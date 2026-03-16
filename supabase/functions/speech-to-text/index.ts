import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const MAX_AUDIO_SIZE = 25 * 1024 * 1024; // 25MB max for Whisper

// Process base64 in chunks to prevent memory issues
function processBase64Chunks(base64String: string, chunkSize = 32768) {
  const chunks: Uint8Array[] = [];
  let position = 0;
  
  while (position < base64String.length) {
    const chunk = base64String.slice(position, position + chunkSize);
    const binaryChunk = atob(chunk);
    const bytes = new Uint8Array(binaryChunk.length);
    
    for (let i = 0; i < binaryChunk.length; i++) {
      bytes[i] = binaryChunk.charCodeAt(i);
    }
    
    chunks.push(bytes);
    position += chunkSize;
  }

  const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;

  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }

  return result;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    let audioData: Uint8Array;
    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      const rawBody = await req.json();
      const JsonSchema = z.object({
        audio: z.string().min(1).max(35_000_000), // ~25MB base64
      });
      const parsed = JsonSchema.safeParse(rawBody);
      if (!parsed.success) {
        return new Response(
          JSON.stringify({ error: 'Invalid audio data', success: false }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      audioData = processBase64Chunks(parsed.data.audio);
    } else {
      const formData = await req.formData();
      const audioFile = formData.get('audio') as File;
      
      if (!audioFile) {
        return new Response(
          JSON.stringify({ error: 'No audio file provided', success: false }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (audioFile.size > MAX_AUDIO_SIZE) {
        return new Response(
          JSON.stringify({ error: 'Audio file too large (max 25MB)', success: false }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const audioBuffer = await audioFile.arrayBuffer();
      audioData = new Uint8Array(audioBuffer);
    }
    
    const formData = new FormData();
    const audioBlob = new Blob([audioData.buffer], { type: 'audio/webm' });
    formData.append('file', audioBlob, 'audio.webm');
    formData.append('model', 'whisper-1');
    formData.append('language', 'en');

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${openAIApiKey}` },
      body: formData,
    });

    if (!response.ok) {
      console.error('OpenAI API error:', await response.text());
      throw new Error('Transcription failed');
    }

    const result = await response.json();
    
    return new Response(
      JSON.stringify({ text: result.text || '', success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Speech-to-text error:', error);
    return new Response(
      JSON.stringify({ error: 'Speech transcription failed. Please try again.', success: false }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
