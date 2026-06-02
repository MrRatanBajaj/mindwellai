// Inbound website sales chat agent — streaming
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

const SYSTEM = `You are "Mira", WellMindAI's website concierge. Tone: warm, brief, Hinglish-friendly, never pushy. Mission:
1. Answer questions about WellMindAI: Aria (free AI counselor), Journal, Self Help, Counselor booking, Pricing.
2. Pricing tiers: Student ₹99, Starter ₹299, Standard ₹499, Premium ₹999 / month. Free 15-min trial for all.
3. If user shows interest, gently ask for name + email/phone to "book a free Aria session" and reply with link: https://wellmindai.in/dashboard
4. Crisis/self-harm cues: immediately share iCall 9152987821 and stop selling.
5. Keep replies under 60 words. One question at a time.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");
    const { session_token, message, history = [], visitor } = await req.json();
    if (!session_token || !message) {
      return new Response(JSON.stringify({ error: "session_token and message required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const messages = [
      { role: "system", content: SYSTEM },
      ...history.slice(-12),
      { role: "user", content: message },
    ];

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Lovable-API-Key": LOVABLE_API_KEY },
      body: JSON.stringify({ model: "google/gemini-2.5-flash", messages }),
    });
    if (!aiRes.ok) {
      const t = await aiRes.text();
      throw new Error(`AI gateway ${aiRes.status}: ${t}`);
    }
    const data = await aiRes.json();
    const reply = data.choices?.[0]?.message?.content ?? "Sorry, I missed that.";

    // Upsert session
    const newMessages = [...history, { role: "user", content: message }, { role: "assistant", content: reply }];
    await supabase.from("inbound_chat_sessions").upsert({
      session_token,
      visitor_name: visitor?.name ?? null,
      visitor_email: visitor?.email ?? null,
      visitor_phone: visitor?.phone ?? null,
      intent: visitor?.intent ?? null,
      messages: newMessages,
      updated_at: new Date().toISOString(),
    }, { onConflict: "session_token" });

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
