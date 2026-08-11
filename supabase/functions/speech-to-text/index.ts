import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MAX_AUDIO_SIZE = 20 * 1024 * 1024; // 20MB

function base64ToBytes(base64String: string, chunkSize = 32768) {
  const chunks: Uint8Array[] = [];
  let position = 0;
  while (position < base64String.length) {
    const chunk = base64String.slice(position, position + chunkSize);
    const binaryChunk = atob(chunk);
    const bytes = new Uint8Array(binaryChunk.length);
    for (let i = 0; i < binaryChunk.length; i++) bytes[i] = binaryChunk.charCodeAt(i);
    chunks.push(bytes);
    position += chunkSize;
  }
  const total = chunks.reduce((a, c) => a + c.length, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  for (const c of chunks) { out.set(c, offset); offset += c.length; }
  return out;
}

const EXT: Record<string, string> = {
  "audio/webm": "webm",
  "audio/ogg": "ogg",
  "audio/mp4": "mp4",
  "audio/mpeg": "mp3",
  "audio/wav": "wav",
  "audio/x-wav": "wav",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Transcription service not configured", success: false }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let audio: Uint8Array;
    let mime = "audio/webm";
    let language: string | undefined;

    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const body = await req.json().catch(() => null) as
        | { audio?: string; mimeType?: string; language?: string }
        | null;
      if (!body?.audio || typeof body.audio !== "string" || body.audio.length < 100) {
        return new Response(JSON.stringify({ error: "No audio provided", success: false }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (body.audio.length > 28_000_000) {
        return new Response(JSON.stringify({ error: "Audio too large", success: false }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      audio = base64ToBytes(body.audio.includes(",") ? body.audio.split(",")[1] : body.audio);
      if (body.mimeType) mime = String(body.mimeType).split(";")[0];
      if (body.language && /^[a-z]{2}$/.test(body.language)) language = body.language;
    } else {
      const form = await req.formData();
      const file = form.get("audio");
      if (!(file instanceof File)) {
        return new Response(JSON.stringify({ error: "No audio file provided", success: false }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (file.size > MAX_AUDIO_SIZE) {
        return new Response(JSON.stringify({ error: "Audio file too large", success: false }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      audio = new Uint8Array(await file.arrayBuffer());
      mime = (file.type || "audio/webm").split(";")[0];
    }

    if (audio.byteLength < 1200) {
      return new Response(JSON.stringify({ text: "", success: true, empty: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const ext = EXT[mime] ?? "webm";
    const upstream = new FormData();
    upstream.append("model", "openai/gpt-4o-mini-transcribe");
    upstream.append("file", new Blob([audio], { type: mime }), `recording.${ext}`);
    if (language) upstream.append("language", language);

    const res = await fetch("https://ai.gateway.lovable.dev/v1/audio/transcriptions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}` },
      body: upstream,
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("transcription upstream error", res.status, detail);
      return new Response(JSON.stringify({ error: "Transcription failed", success: false }), {
        status: res.status === 429 || res.status === 402 ? res.status : 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const result = await res.json();
    return new Response(JSON.stringify({ text: result?.text ?? "", success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Speech-to-text error:", error);
    return new Response(JSON.stringify({ error: "Speech transcription failed. Please try again.", success: false }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
