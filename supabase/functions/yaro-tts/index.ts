// Yaro voice-note TTS — calm, empathetic clinical therapist tone.
// Runs on the Lovable AI Gateway (no third-party key required).
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MAX_CHARS = 1200;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    {
      const { createClient: _cc } = await import("npm:@supabase/supabase-js@2");
      const _sb = _cc(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!);
      const _jwt = (req.headers.get("Authorization") ?? "").replace("Bearer ", "");
      const { data: _u } = await _sb.auth.getUser(_jwt);
      if (!_u?.user) {
        return new Response(JSON.stringify({ error: "Please sign in to continue.", success: false }), {
          status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey && !Deno.env.get("OPENAI_API_KEY")) {
      return new Response(JSON.stringify({ error: "Voice service not configured", success: false }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => null) as
      | { text?: string; counselorId?: string }
      | null;
    const raw = (body?.text ?? "").replace(/[*_#`>]/g, "").trim();
    if (!raw) {
      return new Response(JSON.stringify({ error: "No text provided", success: false }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const text = raw.slice(0, MAX_CHARS);

    // Yaro = warm male, Ava = soft female
    const isAva = (body?.counselorId ?? "yaro").toLowerCase() === "ava";
    const voice = isAva ? "shimmer" : "onyx";

    const instructions =
      "Speak like a real, warm human therapist in a natural conversation — relaxed breathing, gentle pauses, soft emphasis, empathetic and unhurried. Match the language of the text naturally. Never robotic, never over-cheerful.";
    const openaiKey = Deno.env.get("OPENAI_API_KEY");
    let res: Response;
    if (openaiKey) {
      res = await fetch("https://api.openai.com/v1/audio/speech", {
        method: "POST",
        headers: { Authorization: `Bearer ${openaiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ model: "gpt-4o-mini-tts", input: text, voice: isAva ? "coral" : "ash", response_format: "mp3", instructions }),
      });
      if (!res.ok) console.error("openai tts error", res.status, await res.clone().text().catch(() => ""));
    } else {
      res = new Response(null, { status: 500 });
    }
    if (!res.ok) {
      res = await fetch("https://ai.gateway.lovable.dev/v1/audio/speech", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ model: "openai/gpt-4o-mini-tts", input: text, voice, response_format: "mp3", instructions }),
      });
    }

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("tts upstream error", res.status, detail);
      return new Response(JSON.stringify({ error: "Voice generation failed", success: false }), {
        status: res.status === 429 || res.status === 402 ? res.status : 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const buf = new Uint8Array(await res.arrayBuffer());
    let binary = "";
    const CH = 0x8000;
    for (let i = 0; i < buf.length; i += CH) {
      binary += String.fromCharCode(...buf.subarray(i, i + CH));
    }

    return new Response(
      JSON.stringify({ success: true, audioContent: btoa(binary), contentType: "audio/mpeg" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("yaro-tts error", error);
    return new Response(JSON.stringify({ error: "Voice generation failed", success: false }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
