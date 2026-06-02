// AI Marketing & Sales Agent — unified backend
// Actions: score_leads | draft_outbound | generate_content | tick (autonomous)
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

async function callAI(system: string, user: string, json = false): Promise<string> {
  if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");
  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": LOVABLE_API_KEY,
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      ...(json ? { response_format: { type: "json_object" } } : {}),
    }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`AI gateway ${res.status}: ${t}`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}

async function getSettings() {
  const { data } = await supabase.from("agent_settings").select("*").eq("id", 1).single();
  return data;
}

async function scoreLeads(limit = 25) {
  const { data: leads } = await supabase
    .from("leads")
    .select("id, email, name, phone, location_city, utm_source, utm_campaign, source, status, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (!leads?.length) return { scored: 0 };

  // Skip already scored
  const ids = leads.map((l) => l.id);
  const { data: existing } = await supabase.from("lead_scores").select("lead_id").in("lead_id", ids);
  const done = new Set((existing ?? []).map((e: any) => e.lead_id));
  const todo = leads.filter((l) => !done.has(l.id));
  if (!todo.length) return { scored: 0 };

  let scored = 0;
  for (const lead of todo) {
    try {
      const prompt = `Lead profile (JSON): ${JSON.stringify(lead)}\n\nScore this mental-wellness app lead. Return JSON: {"score":0-100,"temperature":"hot|warm|cold","next_action":"whatsapp|email|discount|call|nurture","reasoning":"short 1-line why"}.\nRules: has email+phone => warmer; campaign/source = paid ad => hotter; only IP/anon => cold.`;
      const raw = await callAI("You are a B2C SaaS lead scoring agent for an Indian mental wellness app.", prompt, true);
      const parsed = JSON.parse(raw);
      await supabase.from("lead_scores").upsert({
        lead_id: lead.id,
        score: Math.max(0, Math.min(100, parsed.score ?? 0)),
        temperature: parsed.temperature ?? "cold",
        next_action: parsed.next_action,
        reasoning: parsed.reasoning,
        scored_at: new Date().toISOString(),
      });
      scored++;
    } catch (e) {
      console.error("score failed", lead.id, e);
    }
  }
  return { scored };
}

async function draftOutbound(limit = 10) {
  const settings = await getSettings();
  if (!settings) return { drafted: 0 };

  // Find hot/warm leads with contact info, not already drafted recently
  const { data: hot } = await supabase
    .from("lead_scores")
    .select("lead_id, temperature, next_action, reasoning")
    .in("temperature", ["hot", "warm"])
    .order("score", { ascending: false })
    .limit(limit);

  if (!hot?.length) return { drafted: 0 };

  const leadIds = hot.map((h: any) => h.lead_id);
  const { data: leads } = await supabase
    .from("leads")
    .select("id, email, name, phone")
    .in("id", leadIds);

  const leadMap = new Map((leads ?? []).map((l: any) => [l.id, l]));

  // Skip leads already drafted in last 7 days
  const since = new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString();
  const { data: recent } = await supabase
    .from("marketing_drafts")
    .select("lead_id")
    .in("lead_id", leadIds)
    .gte("created_at", since);
  const recentSet = new Set((recent ?? []).map((r: any) => r.lead_id));

  let drafted = 0;
  for (const h of hot as any[]) {
    if (recentSet.has(h.lead_id)) continue;
    const lead: any = leadMap.get(h.lead_id);
    if (!lead) continue;

    const channel = lead.phone && (h.next_action === "whatsapp" || !lead.email) ? "whatsapp" : "email";
    const recipient = channel === "whatsapp" ? lead.phone : lead.email;
    if (!recipient) continue;

    try {
      const sys = `You are WellMindAI's marketing copywriter. Brand voice: ${settings.brand_voice}. Keep it human, Hinglish-friendly, never pushy. NEVER mention "AI agent" or marketing.`;
      const userPrompt = channel === "whatsapp"
        ? `Write a short WhatsApp message (max 350 chars, 2 short paras, 1 emoji) to ${lead.name ?? "this person"} inviting them to try Aria, our free AI mental wellness companion. Mention 15-min free trial. End with link: https://wellmindai.in/dashboard. Return JSON: {"body":"..."}`
        : `Write a short warm email (subject + body, 3 short paras, no jargon) to ${lead.name ?? "this person"} inviting them to try Aria. Mention privacy & 15-min free trial. End with CTA link https://wellmindai.in/dashboard. Return JSON: {"subject":"...","body":"..."}`;
      const raw = await callAI(sys, userPrompt, true);
      const parsed = JSON.parse(raw);

      await supabase.from("marketing_drafts").insert({
        lead_id: lead.id,
        channel,
        recipient,
        subject: parsed.subject ?? null,
        body: parsed.body,
        status: "draft",
        created_by: "agent",
      });
      drafted++;
    } catch (e) {
      console.error("draft failed", lead.id, e);
    }
  }
  return { drafted };
}

async function generateContent(count = 1) {
  const settings = await getSettings();
  const topics = [
    "Anxiety relief in 2 minutes (Hinglish)",
    "Why journaling beats overthinking",
    "How to talk to an AI counselor anonymously",
    "Sleep reset: 4-7-8 breathing",
    "Exam stress survival kit for Indian students",
    "When to talk to a human counselor vs AI",
  ];
  let created = 0;
  for (let i = 0; i < count; i++) {
    const topic = topics[Math.floor(Math.random() * topics.length)];
    try {
      const sys = `You write evidence-based, friendly mental wellness content for WellMindAI. Brand voice: ${settings?.brand_voice}.`;
      const raw = await callAI(
        sys,
        `Write a blog post outline+draft on: "${topic}". 600-800 words. Markdown. Include H2 sections, a calming intro, 3-4 practical tips, and end with a soft CTA to try Aria (https://wellmindai.in/dashboard). Return JSON: {"title":"...","body":"...","hashtags":["#...","#..."]}`,
        true,
      );
      const parsed = JSON.parse(raw);
      await supabase.from("content_drafts").insert({
        kind: "blog",
        topic,
        title: parsed.title,
        body: parsed.body,
        hashtags: parsed.hashtags ?? [],
        status: "draft",
      });
      created++;
    } catch (e) {
      console.error("content failed", e);
    }
  }
  return { created };
}

async function autonomousTick() {
  const settings = await getSettings();
  if (!settings || settings.kill_switch) {
    return { skipped: true, reason: "kill_switch on or no settings" };
  }

  const startedAt = new Date().toISOString();
  const { data: run } = await supabase
    .from("agent_runs")
    .insert({ run_kind: "tick", status: "running", started_at: startedAt })
    .select()
    .single();

  try {
    const s = await scoreLeads(25);
    const d = await draftOutbound(Math.min(10, settings.daily_outbound_cap));
    const c = await generateContent(Math.min(1, settings.daily_content_cap));

    await supabase
      .from("agent_runs")
      .update({
        status: "completed",
        leads_scored: s.scored,
        drafts_created: d.drafted,
        content_created: c.created,
        completed_at: new Date().toISOString(),
        summary: `Scored ${s.scored}, drafted ${d.drafted}, content ${c.created}. Autonomy=${settings.autonomy_level}.`,
      })
      .eq("id", run?.id);

    return { ok: true, scored: s.scored, drafted: d.drafted, content: c.created };
  } catch (e: any) {
    await supabase
      .from("agent_runs")
      .update({ status: "failed", error: String(e), completed_at: new Date().toISOString() })
      .eq("id", run?.id);
    throw e;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const { action = "tick" } = req.method === "POST" ? await req.json().catch(() => ({})) : {};
    let result;
    if (action === "score_leads") result = await scoreLeads();
    else if (action === "draft_outbound") result = await draftOutbound();
    else if (action === "generate_content") result = await generateContent(1);
    else result = await autonomousTick();

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
