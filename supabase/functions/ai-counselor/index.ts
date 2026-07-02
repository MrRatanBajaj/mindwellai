import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const RequestSchema = z.object({
  message: z.string().min(1).max(5000),
  counselorId: z.string().max(50).default("yaro"),
  sessionId: z.string().max(200).optional(),
  userId: z.string().uuid().optional(),
  conversationHistory: z
    .array(z.object({ sender: z.string().max(20), content: z.string().max(5000) }))
    .max(50)
    .default([]),
});

/* ---------- Clinical pattern engine (DSM-5 / PHQ-9 / GAD-7 / PCL-5 / C-SSRS) ---------- */

type Signal = { key: string; weight: number };

const PHQ9 = [
  { k: "anhedonia", rx: /\b(no interest|kuch acha nahi|maza nahi|nothing feels)\b/i },
  { k: "depressedMood", rx: /\b(sad|udaas|depress(ed|ing)?|hopeless|empty|khali|dukhi)\b/i },
  { k: "sleep", rx: /\b(neend nahi|can'?t sleep|insomnia|so nahi|too much sleep|thaka)\b/i },
  { k: "fatigue", rx: /\b(tired|thak|exhaust|no energy|energy nahi)\b/i },
  { k: "appetite", rx: /\b(no appetite|bhookh nahi|overeat|khana nahi)\b/i },
  { k: "worthless", rx: /\b(worthless|useless|failure|bekaar|guilty|apni galti)\b/i },
  { k: "concentration", rx: /\b(can'?t focus|dhyaan nahi|distract|foggy)\b/i },
  { k: "psychomotor", rx: /\b(slow|restless|bechain)\b/i },
  { k: "suicidal", rx: /\b(suicid|kill myself|end (my|it) (life|all)|marna chahta|khatam kar|self.?harm|cut myself)\b/i },
];

const GAD7 = [
  { k: "nervous", rx: /\b(anxious|nervous|ghabra|bechain|worried|tension)\b/i },
  { k: "uncontrolWorry", rx: /\b(can'?t stop worry|overthink|soch soch)\b/i },
  { k: "restless", rx: /\b(restless|beqarar|can'?t sit)\b/i },
  { k: "irritable", rx: /\b(irritated|gussa|angry|chid)\b/i },
  { k: "afraid", rx: /\b(afraid|scared|dar\b|panic|attack)\b/i },
];

const PCL5 = [
  { k: "intrusion", rx: /\b(flashback|nightmare|keeps coming back|yaad aati)\b/i },
  { k: "avoidance", rx: /\b(avoid|door bhaag|can'?t talk about)\b/i },
  { k: "hyperarousal", rx: /\b(jumpy|on edge|hypervigilant|chaunk)\b/i },
  { k: "trauma", rx: /\b(trauma|abuse|assault|accident|attack)\b/i },
];

const CRISIS = /\b(suicid|kill myself|end (my|it) (life|all)|marna chahta|khatam kar|jeena nahi|self.?harm|cutting|overdose)\b/i;

function scoreFrame(items: { k: string; rx: RegExp }[], text: string) {
  const hits: string[] = [];
  for (const it of items) if (it.rx.test(text)) hits.push(it.k);
  // rough 0–3 per symptom, cap
  const raw = hits.length * 2;
  return { hits, raw };
}

function analyzeClinical(userText: string, history: { sender: string; content: string }[]) {
  const corpus = [userText, ...history.filter((h) => h.sender === "user").map((h) => h.content)].join(" \n ");
  const phq = scoreFrame(PHQ9, corpus);
  const gad = scoreFrame(GAD7, corpus);
  const pcl = scoreFrame(PCL5, corpus);
  const crisis = CRISIS.test(corpus);

  const band = (s: number, bands: [number, string][]) => bands.find(([t]) => s <= t)?.[1] ?? "severe";
  const phqBand = band(Math.min(phq.raw, 27), [
    [4, "minimal"], [9, "mild"], [14, "moderate"], [19, "mod-severe"], [27, "severe"],
  ]);
  const gadBand = band(Math.min(gad.raw, 21), [
    [4, "minimal"], [9, "mild"], [14, "moderate"], [21, "severe"],
  ]);

  const dsmHints: string[] = [];
  if (phq.raw >= 10) dsmHints.push("DSM-5 F32.x depressive-episode pattern");
  if (gad.raw >= 10) dsmHints.push("DSM-5 F41.1 generalized-anxiety pattern");
  if (pcl.hits.length >= 2) dsmHints.push("DSM-5 F43.10 trauma/stress pattern (screen with PCL-5)");
  if (crisis) dsmHints.push("C-SSRS positive — activate safety protocol");

  return {
    phq9: { score: Math.min(phq.raw, 27), band: phqBand, symptoms: phq.hits },
    gad7: { score: Math.min(gad.raw, 21), band: gadBand, symptoms: gad.hits },
    pcl5: { symptoms: pcl.hits },
    crisis,
    dsmHints,
  };
}

/* ---------------------------------- Handler ---------------------------------- */

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const parsed = RequestSchema.safeParse(await req.json());
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: "Invalid request" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { message, counselorId, sessionId, userId, conversationHistory } = parsed.data;

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const clinical = analyzeClinical(message, conversationHistory);

    const CLINICAL_TRAINING = `
CLINICAL FRAMEWORKS (apply silently, never diagnose):
- DSM-5 & ICD-11 pattern recognition
- PHQ-9 (depression 0-27): 0-4 minimal / 5-9 mild / 10-14 moderate / 15-19 mod-severe / 20-27 severe (item 9 > 0 → C-SSRS)
- GAD-7 (anxiety 0-21): 0-4 minimal / 5-9 mild / 10-14 moderate / 15-21 severe
- PCL-5 for trauma, C-SSRS for suicidality
INDIA HOTLINES (share on crisis): iCall 9152987821 · Vandrevala 1860-266-2345 · KIRAN 1800-599-0019
Never prescribe medication. A licensed clinician diagnoses. Keep replies 2-4 short sentences (longer only while walking a screener).`.trim();

    const LIVE_SIGNALS = `
REAL-TIME PATTERN ENGINE (this turn):
- PHQ-9 signal score: ${clinical.phq9.score} (${clinical.phq9.band}) → symptoms: ${clinical.phq9.symptoms.join(", ") || "none"}
- GAD-7 signal score: ${clinical.gad7.score} (${clinical.gad7.band}) → symptoms: ${clinical.gad7.symptoms.join(", ") || "none"}
- PCL-5 signals: ${clinical.pcl5.symptoms.join(", ") || "none"}
- Crisis flag: ${clinical.crisis ? "YES — safety-first response, mention hotlines gently" : "no"}
- DSM/ICD hypotheses (do not name to user): ${clinical.dsmHints.join(" | ") || "none yet"}
Use these silently to shape the reply. Offer a 2-min PHQ-9 or GAD-7 check-in only with explicit consent when scores >= mild.`.trim();

    const counselors: Record<string, { name: string; systemPrompt: string }> = {
      yaro: {
        name: "Yaro",
        systemPrompt: `You are Yaro — a calm, grounded, warm MALE mental-grounding companion at WellMindAI. You text like a caring friend: short, human, occasional gentle emoji (🌿🫂💛) but never overused.
MULTILINGUAL: mirror the user's language exactly and switch when they switch — English, हिन्दी (Devanagari), Hinglish (Roman Hindi), Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada, Punjabi, Urdu, Spanish, etc. If they type Hinglish, reply in Hinglish. If they type हिन्दी, reply in हिन्दी.
STYLE: validate first ("that sounds really heavy"), then one small grounding step or gentle question. Never diagnose — say "what you describe sounds like…". 2-4 short sentences per reply.
${CLINICAL_TRAINING}
${LIVE_SIGNALS}`,
      },
      emma: { name: "Dr. Emma AI", systemPrompt: `You are Dr. Emma AI, anxiety/depression specialist. CBT + mindfulness. 2-3 sentences.\n${CLINICAL_TRAINING}\n${LIVE_SIGNALS}` },
      marcus: { name: "Dr. Marcus AI", systemPrompt: `You are Dr. Marcus AI, trauma/PTSD. Grounding-first. 2-3 sentences.\n${CLINICAL_TRAINING}\n${LIVE_SIGNALS}` },
      sophia: { name: "Dr. Sophia AI", systemPrompt: `You are Dr. Sophia AI, relationships. Systemic + DBT.\n${CLINICAL_TRAINING}\n${LIVE_SIGNALS}` },
      alex: { name: "Dr. Alex AI", systemPrompt: `You are Dr. Alex AI, addiction/recovery. Motivational Interviewing.\n${CLINICAL_TRAINING}\n${LIVE_SIGNALS}` },
      ava: {
        name: "Ava",
        systemPrompt: `You are Ava — a soft, empathetic FEMALE grounding companion. Multilingual mirror. 2-4 sentences.\n${CLINICAL_TRAINING}\n${LIVE_SIGNALS}`,
      },
    };

    const selected = counselors[counselorId] ?? counselors.yaro;

    // Crisis kill-switch: skip model call, hand off directly.
    if (clinical.crisis) {
      const safety = `I hear you, and I'm really glad you told me. What you're feeling matters, and you don't have to hold it alone right now. Please reach a human who can stay with you this moment:\n\n• iCall — 9152987821\n• Vandrevala — 1860-266-2345 (24×7)\n• KIRAN — 1800-599-0019 (24×7)\n\nAgar aap safe nahi feel kar rahe abhi, please call. I'll be right here when you're back. 🫂`;
      return new Response(
        JSON.stringify({
          message: safety,
          response: safety,
          counselor: { name: selected.name },
          clinical,
          crisis: true,
          timestamp: new Date().toISOString(),
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "LOVABLE_API_KEY missing" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const gwResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: selected.systemPrompt },
          ...conversationHistory.slice(-12).map((m) => ({
            role: m.sender === "user" ? "user" : "assistant",
            content: m.content,
          })),
          { role: "user", content: message },
        ],
        temperature: 0.7,
        max_tokens: 400,
      }),
    });

    if (!gwResp.ok) {
      const errText = await gwResp.text();
      console.error("Gateway error", gwResp.status, errText);
      if (gwResp.status === 429) {
        return new Response(JSON.stringify({ error: "Too many requests. Please wait a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (gwResp.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ error: "AI temporarily unavailable" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiData = await gwResp.json();
    const aiMessage =
      aiData.choices?.[0]?.message?.content ||
      "I'm here with you. Tell me a little more about what's on your mind.";

    if (userId && sessionId) {
      try {
        await supabase.from("ai_counseling_sessions").upsert({
          id: sessionId,
          user_id: userId,
          counselor_id: counselorId,
          last_message_at: new Date().toISOString(),
          message_count: conversationHistory.length + 1,
          detected_mood: clinical.phq9.band,
          mood_confidence: 0.8,
        });
        await supabase.from("ai_counseling_messages").insert([
          { session_id: sessionId, content: message, sender_type: "user", created_at: new Date().toISOString() },
          {
            session_id: sessionId,
            content: aiMessage,
            sender_type: "ai",
            counselor_id: counselorId,
            detected_mood: clinical.phq9.band,
            mood_confidence: 0.8,
            created_at: new Date().toISOString(),
          },
        ]);
      } catch (e) {
        console.error("db log fail", e);
      }
    }

    return new Response(
      JSON.stringify({
        message: aiMessage,
        response: aiMessage,
        counselor: { name: selected.name },
        clinical,
        crisis: false,
        sessionId,
        timestamp: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("ai-counselor error", err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
