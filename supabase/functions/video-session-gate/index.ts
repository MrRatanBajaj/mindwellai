// Server-side session enforcement for WellMindAI video AND audio therapy.
// Actions: start | heartbeat | end.   Modes: video | audio.
// Plans:
//   starter_weekly → 3 min video / 10 min audio (WEEKLY)
//   premium        → 12 min video / 60 min audio (MONTHLY)
//   pro_ultimate   → 30 min video / 180 min audio (MONTHLY)
//   anything else (no active sub) → blocked
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type Plan = "starter_weekly" | "premium" | "pro_ultimate" | "none";
type Mode = "video" | "audio";

interface PlanLimits {
  videoSeconds: number;       // per cycle
  audioSeconds: number;       // per cycle
  videoSessions: number;
  audioSessions: number;
  perVideoSeconds: number;    // per single call cap
  perAudioSeconds: number;
  cycleDays: number;
}

const LIMITS: Record<Exclude<Plan, "none">, PlanLimits> = {
  starter_weekly: {
    videoSeconds: 180, audioSeconds: 600,
    videoSessions: 1,  audioSessions: 3,
    perVideoSeconds: 180, perAudioSeconds: 300,
    cycleDays: 7,
  },
  premium: {
    videoSeconds: 720, audioSeconds: 3600,
    videoSessions: 3,  audioSessions: 12,
    perVideoSeconds: 240, perAudioSeconds: 600,
    cycleDays: 30,
  },
  pro_ultimate: {
    videoSeconds: 1800, audioSeconds: 10800,
    videoSessions: 6,   audioSessions: 30,
    perVideoSeconds: 300, perAudioSeconds: 900,
    cycleDays: 30,
  },
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

async function getUserPlan(admin: ReturnType<typeof createClient>, userId: string): Promise<{ plan: Plan; periodStart: string }> {
  const { data } = await admin
    .from("subscriptions")
    .select("plan_id, status, current_period_start, current_period_end")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data) return { plan: "none", periodStart: new Date().toISOString() };
  const stillActive = data.status === "active" &&
    (!data.current_period_end || new Date(data.current_period_end as string) > new Date());
  if (!stillActive) return { plan: "none", periodStart: new Date().toISOString() };

  const id = (data.plan_id as string)?.toLowerCase();
  let plan: Plan = "none";
  if (id === "starter_weekly") plan = "starter_weekly";
  else if (id === "premium" || id === "plus") plan = "premium";
  else if (id === "pro_ultimate" || id === "pro" || id === "ultimate") plan = "pro_ultimate";

  return {
    plan,
    periodStart: (data.current_period_start as string) || new Date().toISOString(),
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const auth = req.headers.get("Authorization");
    if (!auth?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      global: { headers: { Authorization: auth } },
    });
    const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ error: "Invalid session" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = userData.user.id;

    const body = await req.json().catch(() => ({}));
    const action = body.action as "start" | "heartbeat" | "end";
    const mode: Mode = (body.mode as Mode) === "audio" ? "audio" : "video";
    const counselor = (body.counselor as string) || "yaro";

    const { plan, periodStart } = await getUserPlan(admin, userId);

    if (plan === "none") {
      return new Response(JSON.stringify({
        allowed: false, reason: "no_subscription",
        message: "Subscribe to start a session. Try ₹99/week to begin.",
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const limits = LIMITS[plan];
    const table = mode === "video" ? "video_usage" : "audio_usage";
    const totalSecondsCap = mode === "video" ? limits.videoSeconds : limits.audioSeconds;
    const sessionsCap = mode === "video" ? limits.videoSessions : limits.audioSessions;
    const perCallCap = mode === "video" ? limits.perVideoSeconds : limits.perAudioSeconds;

    if (action === "start") {
      const { data: cycleRows } = await admin
        .from(table).select("seconds")
        .eq("user_id", userId).gte("started_at", periodStart);
      const used = (cycleRows ?? []).reduce((s, r: any) => s + (r.seconds ?? 0), 0);
      const sessions = cycleRows?.length ?? 0;

      if (sessions >= sessionsCap) {
        return new Response(JSON.stringify({
          allowed: false, reason: "session_quota", plan, mode,
          message: `You've used all ${sessionsCap} ${mode} sessions this cycle.`,
        }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      if (used >= totalSecondsCap) {
        return new Response(JSON.stringify({
          allowed: false, reason: "minute_quota", plan, mode,
          message: `${mode === "video" ? "Video" : "Voice"} minutes used up for this cycle.`,
        }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      const remainingCycle = totalSecondsCap - used;
      const maxSeconds = Math.min(perCallCap, remainingCycle);

      const insertPayload: Record<string, unknown> = {
        user_id: userId, plan_id: plan, seconds: 0, counselor,
      };
      const { data: row, error: insErr } = await admin
        .from(table).insert(insertPayload).select("id").single();
      if (insErr) throw insErr;

      return new Response(JSON.stringify({
        allowed: true, plan, mode, sessionId: row.id, maxSeconds,
        cycleRemainingSeconds: remainingCycle,
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "heartbeat" || action === "end") {
      const sessionId = body.sessionId as string | undefined;
      const seconds = Math.max(0, Math.floor(Number(body.seconds ?? 0)));
      if (!sessionId) {
        return new Response(JSON.stringify({ error: "sessionId required" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const update: Record<string, unknown> = { seconds };
      if (action === "end") update.ended_at = new Date().toISOString();
      await admin.from(table).update(update).eq("id", sessionId).eq("user_id", userId);

      const { data: cycleRows } = await admin
        .from(table).select("seconds")
        .eq("user_id", userId).gte("started_at", periodStart);
      const used = (cycleRows ?? []).reduce((s, r: any) => s + (r.seconds ?? 0), 0);

      return new Response(JSON.stringify({
        ok: true, plan, mode,
        shouldEnd: seconds >= perCallCap || used >= totalSecondsCap,
        perSessionMax: perCallCap, cycleMax: totalSecondsCap, cycleUsed: used,
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ error: "unknown action" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("session-gate error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "unknown" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
