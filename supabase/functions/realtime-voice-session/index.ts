import { createClient } from "npm:@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};
const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { ...cors, "Content-Type": "application/json" } });

const CLINICAL_FRAME = `You are a warm, human-sounding psychologist-style companion at WellMindAI.
Speak like a real person on a phone call: short sentences, natural pauses, gentle "mm", reflective listening.
Validate feelings first, ask one open question at a time, then offer one small CBT/DBT/ACT grounding step.
Silently screen for depression (PHQ-9), anxiety (GAD-7) and trauma (PCL-5) patterns; never read scores aloud.
Never diagnose or prescribe. If the person mentions self-harm or suicide, calmly share Tele-MANAS 14416 (India) or 988 (US) and encourage reaching a trusted person now.
Always reply in the same language the person speaks (Hindi, Hinglish, English, Tamil, Bengali, Marathi, Spanish...). Keep each reply under 3 short sentences.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  try {
    const key = Deno.env.get("OPENAI_API_KEY");
    if (!key) return json({ error: "Voice service not configured" }, 500);

    const auth = req.headers.get("Authorization") ?? "";
    const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: auth } },
    });
    const { data: u } = await sb.auth.getUser(auth.replace("Bearer ", ""));
    if (!u?.user) return json({ error: "Please sign in to start a voice session." }, 401);

    const body = await req.json().catch(() => ({}));
    const gender = body.gender === "male" ? "male" : "female";
    const name = String(body.counselorName || (gender === "male" ? "Yaro" : "Ava")).slice(0, 30);
    const extra = String(body.prompt || "").slice(0, 3000);

    const r = await fetch("https://api.openai.com/v1/realtime/client_secrets", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        session: {
          type: "realtime",
          model: "gpt-realtime",
          instructions: `Your name is ${name}.\n${CLINICAL_FRAME}\n\n${extra}`,
          audio: {
            input: { turn_detection: { type: "semantic_vad" }, transcription: { model: "gpt-4o-mini-transcribe" } },
            output: { voice: gender === "male" ? "cedar" : "marin" },
          },
        },
      }),
    });
    const text = await r.text();
    if (!r.ok) {
      console.error("realtime token failed", r.status, text);
      return json({ error: "Voice service unavailable", status: r.status, details: text }, r.status);
    }
    const data = JSON.parse(text);
    return json({ client_secret: data.value, expires_at: data.expires_at });
  } catch (e) {
    console.error(e);
    return json({ error: e instanceof Error ? e.message : "error" }, 500);
  }
});
