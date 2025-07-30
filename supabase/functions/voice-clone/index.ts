import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, audioFiles } = await req.json();

    if (!name || !audioFiles || audioFiles.length === 0) {
      throw new Error('Name and audio files are required');
    }

    const elevenLabsApiKey = Deno.env.get('ELEVENLABS_API_KEY');
    if (!elevenLabsApiKey) {
      throw new Error('ElevenLabs API key not configured');
    }

    // Create a voice clone using ElevenLabs API
    const formData = new FormData();
    formData.append('name', name);
    
    // Add audio files to form data
    audioFiles.forEach((audioFile: string, index: number) => {
      // In a real implementation, you'd handle the actual audio file upload
      // For now, we'll simulate the process
      console.log(`Processing audio file ${index + 1} for voice clone`);
    });

    const response = await fetch('https://api.elevenlabs.io/v1/voices/add', {
      method: 'POST',
      headers: {
        'xi-api-key': elevenLabsApiKey,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail?.message || 'Failed to create voice clone');
    }

    const voiceData = await response.json();

    return new Response(
      JSON.stringify({ 
        voiceId: voiceData.voice_id,
        message: 'Voice clone created successfully' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in voice-clone function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});