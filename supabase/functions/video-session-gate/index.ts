// Server-side video minute & session enforcement for WellMindAI.
// Three actions: start | heartbeat | end.
// Free   → 1 session total, ≤120s
// Premium     → ≤3 sessions/mo,  ≤720s total, ≤240s/session
// Pro Ultimate → ≤6 sessions/mo, ≤1800s total, ≤300s/session
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type Plan = "free" | "premium" | "pro_ultimate";

interface PlanLimits {
  perSessionSeconds: number;
  monthlySeconds: number;
  monthlySessions: number;
  lifetimeSessions?: number; // free plan only
}

const LIMITS: Record<Plan, PlanLimits> = {
  free:         { perSessionSeconds: 120, monthlySeconds: 120,  monthlySessions: 1, lifetimeSessions: 1 },
  premium:      { perSessionSeconds: 240, monthlySeconds: 720,  monthlySessions: 3 },
  pro_ultimate: { perSessionSeconds: 300, monthlySeconds: 1800, monthlySessions: 6 },
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

function startOfMonthIso(): string {
  const d = new Date();
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1)).toISOString();
}

async function getUserPlan(admin: ReturnType<typeof createClient>, userId: string): Promise<Plan> {
  const { data } = await admin
    .from("subscriptions")
    .select("plan, status, current_period_end")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data) return "free";
  const stillActive = data.status === "active" && (!data.current_period_end || new Date(data.current_period_end as string) > new Date());
  if (!stillActive) return "free";
  const p = (data.plan as string)?.toLowerCase();
  if (p === "pro_ultimate" || p === "pro" || p === "ultimate") return "pro_ultimate";
  if (p === "premium" || p === "plus") return "premium";
  return "free";
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const auth = req.headers.get("Authorization");
    if (!auth?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const userClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      global: { headers: { Authorization: auth } },
    });
    const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ error: "Invalid session" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const userId = userData.user.id;

    const body = await req.json().catch(() => ({}));
    const action = body.action as "start" | "heartbeat" | "end";
    const counselor = (body.counselor as string) || "yaro";

    const plan = await getUserPlan(admin, userId);
    const limits = LIMITS[plan];

    if (action === "start") {
      // Lifetime check (free)
      if (limits.lifetimeSessions) {
        const { count } = await admin.from("video_usage").select("id", { count: "exact", head: true }).eq("user_id", userId);
        if ((count ?? 0) >= limits.lifetimeSessions) {
          return new Response(JSON.stringify({ allowed: false, reason: "lifetime_limit", plan, message: "Free trial used. Upgrade to keep talking face-to-face." }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }
      }
      // Monthly checks
      const { data: monthRows } = await admin
        .from("video_usage").select("seconds")
        .eq("user_id", userId).gte("started_at", startOfMonthIso());
      const monthSeconds = (monthRows ?? []).reduce((s, r: any) => s + (r.seconds ?? 0), 0);
      const monthSessions = monthRows?.length ?? 0;
      if (monthSessions >= limits.monthlySessions) {
        return new Response(JSON.stringify({ allowed: false, reason: "session_quota", plan, message: `You've used all ${limits.monthlySessions} video sessions this month.` }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      if (monthSeconds >= limits.monthlySeconds) {
        return new Response(JSON.stringify({ allowed: false, reason: "minute_quota", plan, message: "Monthly video minutes used up." }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      const remainingMonthly = limits.monthlySeconds - monthSeconds;
      const maxSeconds = Math.min(limits.perSessionSeconds, remainingMonthly);

      const { data: row, error: insErr } = await admin
        .from("video_usage")
        .insert({ user_id: userId, plan_id: plan, seconds: 0, counselor })
        .select("id")
        .single();
      if (insErr) throw insErr;

      return new Response(JSON.stringify({
        allowed: true, plan, sessionId: row.id, maxSeconds,
        monthlyRemainingSeconds: remainingMonthly,
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "heartbeat" || action === "end") {
      const sessionId = body.sessionId as string | undefined;
      const seconds = Math.max(0, Math.floor(Number(body.seconds ?? 0)));
      if (!sessionId) return new Response(JSON.stringify({ error: "sessionId required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

      const update: Record<string, unknown> = { seconds };
      if (action === "end") update.ended_at = new Date().toISOString();
      await admin.from("video_usage").update(update).eq("id", sessionId).eq("user_id", userId);

      // Compute live remaining
      const { data: monthRows } = await admin
        .from("video_usage").select("seconds")
        .eq("user_id", userId).gte("started_at", startOfMonthIso());
      const monthSeconds = (monthRows ?? []).reduce((s, r: any) => s + (r.seconds ?? 0), 0);

      const shouldEnd =
        seconds >= limits.perSessionSeconds ||
        monthSeconds >= limits.monthlySeconds;

      return new Response(JSON.stringify({
        ok: true, shouldEnd, plan,
        perSessionMax: limits.perSessionSeconds,
        monthlyMax: limits.monthlySeconds,
        monthlyUsed: monthSeconds,
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ error: "unknown action" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("video-session-gate error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "unknown" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
