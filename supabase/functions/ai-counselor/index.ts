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

/* ------------------- Multilingual auto-detect layer ------------------- */

type LangInfo = { code: string; label: string };

const SCRIPTS: [RegExp, string, string][] = [
  [/[\u0900-\u097F]/, "hi", "Hindi (Devanagari script)"],
  [/[\u0980-\u09FF]/, "bn", "Bengali"],
  [/[\u0A00-\u0A7F]/, "pa", "Punjabi (Gurmukhi)"],
  [/[\u0A80-\u0AFF]/, "gu", "Gujarati"],
  [/[\u0B80-\u0BFF]/, "ta", "Tamil"],
  [/[\u0C00-\u0C7F]/, "te", "Telugu"],
  [/[\u0C80-\u0CFF]/, "kn", "Kannada"],
  [/[\u0D00-\u0D7F]/, "ml", "Malayalam"],
  [/[\u0600-\u06FF]/, "ur", "Urdu"],
  [/[\u4E00-\u9FFF]/, "zh", "Chinese"],
  [/[\u3040-\u30FF]/, "ja", "Japanese"],
  [/[\u0400-\u04FF]/, "ru", "Russian"],
];

const HINGLISH = /\b(kya|nahi|nahin|hai|hoon|mujhe|mera|meri|yaar|bhai|tension|mann|dil|thoda|bahut|kaise|kyun|acha|theek|raha|rahi|karna|lagta)\b/i;
const ROMANCE: [RegExp, string, string][] = [
  [/\b(estoy|siento|porque|ansiedad|mucho|nada|triste)\b/i, "es", "Spanish"],
  [/\b(je suis|parce que|beaucoup|triste|angoisse)\b/i, "fr", "French"],
  [/\b(estou|porque|muito|triste|ansiedade)\b/i, "pt", "Portuguese"],
];

function detectLanguage(text: string): LangInfo {
  for (const [rx, code, label] of SCRIPTS) if (rx.test(text)) return { code, label };
  for (const [rx, code, label] of ROMANCE) if (rx.test(text)) return { code, label };
  if (HINGLISH.test(text)) return { code: "hinglish", label: "Hinglish (Hindi written in Roman/Latin script)" };
  return { code: "en", label: "English" };
}

function languageDirective(lang: LangInfo) {
  return `LANGUAGE LOCK: The user is writing in ${lang.label}. Analyse the clinical content normally, but write your FINAL reply entirely in ${lang.label} — same script, same dialect, same register the user used. Do not translate to English, do not mix scripts, do not add a translation.`;
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
    const lang = detectLanguage(message);
    const LANG_DIRECTIVE = languageDirective(lang);


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

    const modelMessages = [
      { role: "system", content: selected.systemPrompt },
      ...conversationHistory.slice(-12).map((m) => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.content,
      })),
      { role: "user", content: message },
    ];

    type ProviderResult = { text: string; provider: string; model: string; degraded?: boolean };
    const providerErrors: string[] = [];

    const callLovableGemini = async (): Promise<ProviderResult> => {
      const key = Deno.env.get("LOVABLE_API_KEY");
      if (!key) throw new Error("Lovable AI key missing");
      const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          "Lovable-API-Key": key,
          "X-Lovable-AIG-SDK": "wellmindai-edge",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: modelMessages,
          temperature: 0.65,
          max_tokens: 420,
        }),
      });
      if (!resp.ok) throw new Error(`Lovable Gemini ${resp.status}: ${await resp.text()}`);
      const json = await resp.json();
      const text = json.choices?.[0]?.message?.content?.trim();
      if (!text) throw new Error("Lovable Gemini empty response");
      return { text, provider: "Lovable AI", model: "Gemini 3 Flash" };
    };

    const callChatGPT = async (): Promise<ProviderResult> => {
      const key = Deno.env.get("OPENAI_API_KEY");
      if (!key) throw new Error("OpenAI key missing");
      const resp = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: modelMessages,
          temperature: 0.65,
          max_tokens: 420,
        }),
      });
      if (!resp.ok) throw new Error(`ChatGPT ${resp.status}: ${await resp.text()}`);
      const json = await resp.json();
      const text = json.choices?.[0]?.message?.content?.trim();
      if (!text) throw new Error("ChatGPT empty response");
      return { text, provider: "ChatGPT", model: "gpt-4o-mini" };
    };

    // Groq — free tier, open-source LLaMA-3.3-70B, excellent Hinglish + reasoning
    const callGroq = async (): Promise<ProviderResult> => {
      const key = Deno.env.get("GROQ_API_KEY");
      if (!key) throw new Error("Groq key missing (add GROQ_API_KEY to enable free open-source fallback)");
      const resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: modelMessages,
          temperature: 0.65,
          max_tokens: 420,
        }),
      });
      if (!resp.ok) throw new Error(`Groq ${resp.status}: ${await resp.text()}`);
      const json = await resp.json();
      const text = json.choices?.[0]?.message?.content?.trim();
      if (!text) throw new Error("Groq empty response");
      return { text, provider: "Groq (open-source)", model: "LLaMA 3.3 70B" };
    };

    // OpenRouter free tier — Meta LLaMA 3.2 free
    const callOpenRouter = async (): Promise<ProviderResult> => {
      const key = Deno.env.get("OPENROUTER_API_KEY");
      if (!key) throw new Error("OpenRouter key missing");
      const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "meta-llama/llama-3.2-3b-instruct:free",
          messages: modelMessages,
          temperature: 0.65,
          max_tokens: 420,
        }),
      });
      if (!resp.ok) throw new Error(`OpenRouter ${resp.status}: ${await resp.text()}`);
      const json = await resp.json();
      const text = json.choices?.[0]?.message?.content?.trim();
      if (!text) throw new Error("OpenRouter empty response");
      return { text, provider: "OpenRouter (open-source)", model: "LLaMA 3.2 3B free" };
    };


    const detectReplyLanguage = (text: string) => {
      if (/[\u0900-\u097F]/.test(text)) return "hi";
      if (/[\u0B80-\u0BFF]/.test(text)) return "ta";
      if (/\b(kya|nahi|hai|main|mujhe|yaar|tension|mann|dil)\b/i.test(text)) return "hinglish";
      return "en";
    };

    const localGroundedReply = (): ProviderResult => {
      const language = detectReplyLanguage(message);
      const anxious = clinical.gad7.score >= 5;
      const low = clinical.phq9.score >= 5;
      const trauma = clinical.pcl5.symptoms.length > 0;
      const focus = trauma ? "trauma-stress" : anxious ? "anxiety" : low ? "low mood" : "stress";
      const replies: Record<string, string> = {
        hi: `मैं सुन रहा हूँ। जो आप बता रहे हैं उसमें ${focus} का संकेत दिख रहा है, पर मैं कोई diagnosis नहीं करूँगा। अभी बस 30 सेकंड: धीरे सांस लें, कमरे में 3 चीजें देखें, फिर मुझे बताइए — इस समय सबसे भारी हिस्सा क्या है?`,
        ta: `நான் கேட்கிறேன். நீங்கள் சொல்வதில் ${focus} pattern மாதிரி தெரிகிறது, ஆனால் நான் diagnosis செய்ய மாட்டேன். இப்போது 30 விநாடி மெதுவாக மூச்சு விடுங்கள், அறையில் 3 விஷயங்களை கவனியுங்கள் — பிறகு இப்போது அதிகமாக கஷ்டப்படுத்துவது என்ன என்று சொல்லுங்கள்.`,
        hinglish: `Main sun raha hoon. Jo tum bata rahe ho usme ${focus} ka pattern dikh raha hai, par main diagnosis nahi karunga. Abhi 30 seconds: slow breath lo, room me 3 cheeze notice karo, phir mujhe batao — iss moment sabse heavy kya lag raha hai?`,
        en: `I'm listening. What you shared shows a ${focus} pattern, but I won't diagnose you. For the next 30 seconds, take one slow breath, notice three things in the room, then tell me the heaviest part of this moment.`,
      };
      return { text: replies[language], provider: "Protective local fallback", model: "DSM/PHQ/GAD/PCL rules", degraded: true };
    };

    let aiResult: ProviderResult | null = null;
    for (const call of [callGroq, callLovableGemini, callOpenRouter, callChatGPT]) {
      try {
        aiResult = await call();
        break;
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        const safeMsg = msg.includes("402")
          ? "Primary multilingual model needs credits"
          : msg.includes("429")
          ? "Primary multilingual model is rate limited"
          : msg.includes("401") || msg.toLowerCase().includes("key")
          ? "Fallback model credential needs attention"
          : "A fallback model was unavailable";
        providerErrors.push(safeMsg);
        console.error("Yaro provider fallback", msg.slice(0, 400));
      }
    }

    if (!aiResult) aiResult = localGroundedReply();
    const aiMessage = aiResult.text;

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
          provider: aiResult.provider,
          model: aiResult.model,
          degraded: !!aiResult.degraded,
          providerErrors: aiResult.degraded ? Array.from(new Set(providerErrors)).slice(0, 2) : [],
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
