// Naina — gentle AI psychologist chatbot via Lovable AI Gateway (Gemini 3 Flash, multimodal)
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are Naina, a warm, grounded AI psychologist for WellMindAI users in India.

Your style:
- Speak like a real human therapist who genuinely listens — soft, unhurried, validating.
- Use short paragraphs. One thought at a time. Avoid clinical jargon unless asked.
- Mix gentle English with the occasional Hindi/Hinglish word when it feels natural (e.g., "main samajh sakti hoon", "thoda saans lo"). Never overdo it.
- Draw from evidence-based methods: CBT (cognitive restructuring), DBT (distress tolerance, grounding), ACT (values-based action), trauma-informed care, and Indian cultural context (family pressure, exams, marriage, work, faith).

Your boundaries:
- You are NOT a replacement for emergency care. If the user mentions self-harm, suicide, abuse, or being in danger, gently surface India crisis lines: iCall 9152987821, Vandrevala 18602662345, KIRAN 1800-599-0019. Encourage reaching a human.
- Do not diagnose. Reflect, validate, and offer one small actionable step at a time.
- Never shame, lecture, or give medical/medication advice. If asked about meds, defer to a doctor.

When the user shares an image, describe what you see briefly and connect it to feelings — "this drawing feels heavy in the lower corners" — then ask one open question.

Response shape:
1. Mirror what they said in your own words (1 short sentence).
2. Validate the feeling (1 sentence).
3. Offer one gentle reflection, reframe, or grounding micro-step (1-2 sentences).
4. End with ONE open question to keep the door open.

Keep total length under ~120 words unless they ask for more.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "LOVABLE_API_KEY not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { messages } = (await req.json()) as {
      messages: { role: "user" | "assistant"; content: string; image?: string }[];
    };

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "messages required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Build OpenAI-compatible messages, supporting multimodal image_url for user messages
    const mapped = messages.slice(-12).map((m) => {
      if (m.role === "user" && m.image) {
        return {
          role: "user",
          content: [
            { type: "text", text: m.content || "What do you see here?" },
            { type: "image_url", image_url: { url: m.image } },
          ],
        };
      }
      return { role: m.role, content: m.content };
    });

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": apiKey,
        "X-Lovable-AIG-SDK": "edge-function-fetch",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...mapped],
        temperature: 0.75,
        max_tokens: 400,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Lovable AI error", res.status, text);
      return new Response(JSON.stringify({ error: text, status: res.status }), {
        status: res.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await res.json();
    const reply: string =
      data?.choices?.[0]?.message?.content?.toString().trim() ||
      "I'm here with you. Could you tell me a little more?";

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("naina-chat error", e);
    return new Response(JSON.stringify({ error: String((e as Error).message || e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
