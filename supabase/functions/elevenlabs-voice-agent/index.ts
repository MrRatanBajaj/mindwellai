import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');

// Per-doctor voice IDs
const DOCTOR_VOICES: Record<string, string> = {
  general:        'EXAVITQu4vr4xnSDxMaL', // Sarah
  dermatologist:  'JBFqnCBsd6RMkjVDRZzb', // George
  mental_health:  'FGY2WhTYpPnrIDTdsKH5', // Laura
  cardiologist:   'onwK4e9ZLuTAKqWW03F9', // Daniel
  pediatrician:   'pFZP5JQG7iQjIQuC4Bku', // Lily
  neurologist:    'TX3LPaxmHKxFdv7VOQHJ', // Liam
  gynecologist:   'XrExE9yKIg1WjnnlVkGX', // Matilda
  nutritionist:   'cgSgspJ2msm6clMCkdW9', // Jessica
  career:         'VR6AewLTigWG4xSOukaG', // Arnold
  relationship:   'ErXwobaYiN019PkySvjV', // Antoni
  male_therapist: 'onwK4e9ZLuTAKqWW03F9', // Daniel
  elder_counselor:'XrExE9yKIg1WjnnlVkGX', // Matilda
  youth_counselor:'pFZP5JQG7iQjIQuC4Bku', // Lily
};

const DOCTOR_NAMES: Record<string, string> = {
  general:        'Dr. Sarah',
  dermatologist:  'Dr. Michael',
  mental_health:  'Dr. Emma',
  cardiologist:   'Dr. James',
  pediatrician:   'Dr. Lily',
  neurologist:    'Dr. Nathan',
  gynecologist:   'Dr. Maya',
  nutritionist:   'Dr. Sophie',
  career:         'Dr. Arjun',
  relationship:   'Dr. Riya',
  male_therapist: 'Dr. Aryan',
  elder_counselor:'Dr. Meera',
  youth_counselor:'Dr. Zara',
};

const DOCTOR_PROMPTS: Record<string, string> = {
  male_therapist: "You are Dr. Aryan, a compassionate male therapist specializing in men's mental health. You create a judgment-free space using CBT and motivational interviewing. Help users explore emotions, manage anger constructively, and develop healthy coping mechanisms. Keep responses concise for voice conversation.",
  elder_counselor: "You are Dr. Meera, a seasoned senior counselor with 35+ years of experience. You bring warmth, patience, and deep life wisdom. Specialize in grief, life transitions, retirement adjustment, and existential concerns. Speak with gentle authority and share relevant life perspectives. Keep responses concise for voice conversation.",
  youth_counselor: "You are Dr. Zara, a young, relatable youth counselor. You understand Gen-Z culture, social media pressures, and academic stress. Use casual, warm language while maintaining professionalism. Help with identity, peer pressure, self-esteem, and academic burnout. Keep responses concise for voice conversation.",
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!ELEVENLABS_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'ELEVENLABS_API_KEY is not configured' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { action, doctorType = 'general', systemPrompt } = await req.json();
    console.log(`ElevenLabs voice agent action: ${action}, doctorType: ${doctorType}`);

    const voiceId = DOCTOR_VOICES[doctorType] || DOCTOR_VOICES.general;
    const doctorName = DOCTOR_NAMES[doctorType] || DOCTOR_NAMES.general;

    if (action === 'get_signed_url') {
      const defaultPrompt = systemPrompt || DOCTOR_PROMPTS[doctorType] || `You are ${doctorName}, a compassionate healthcare AI assistant. Listen carefully to patient symptoms and concerns. Ask clarifying questions. Provide helpful guidance. Recommend when to seek in-person attention. Be empathetic and professional. Keep responses concise since this is a voice call.`;

      const agentConfig = {
        conversation_config: {
          agent: {
            prompt: {
              prompt: defaultPrompt,
            },
            first_message: `Hello, I'm ${doctorName}. How can I help you today?`,
            language: "en",
          },
          tts: {
            voice_id: voiceId,
          },
        },
        name: `${doctorName} - Voice Agent`,
      };

      console.log('Creating ElevenLabs agent for:', doctorName);

      const agentResponse = await fetch('https://api.elevenlabs.io/v1/convai/agents/create', {
        method: 'POST',
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(agentConfig),
      });

      if (!agentResponse.ok) {
        const errorText = await agentResponse.text();
        console.error('Failed to create agent:', agentResponse.status, errorText);
        return new Response(
          JSON.stringify({ error: `Failed to create agent: ${errorText}` }),
          { status: agentResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const agentData = await agentResponse.json();
      console.log('Agent created:', agentData);

      const agentId = agentData.agent_id;
      if (!agentId) {
        return new Response(
          JSON.stringify({ error: 'No agent ID returned' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Get signed URL for conversation
      const signedUrlResponse = await fetch(
        `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${agentId}`,
        {
          method: 'GET',
          headers: { 'xi-api-key': ELEVENLABS_API_KEY },
        }
      );

      if (!signedUrlResponse.ok) {
        // Return agent_id as fallback
        return new Response(
          JSON.stringify({ agent_id: agentId }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const signedUrlData = await signedUrlResponse.json();
      console.log('Signed URL obtained for', doctorName);

      return new Response(
        JSON.stringify({ signed_url: signedUrlData.signed_url, agent_id: agentId }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: `Unknown action: ${action}` }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('ElevenLabs voice agent error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
