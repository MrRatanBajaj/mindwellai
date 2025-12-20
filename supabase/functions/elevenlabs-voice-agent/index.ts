import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');

// ElevenLabs voice IDs for each doctor type
const DOCTOR_VOICES: Record<string, string> = {
  general: 'EXAVITQu4vr4xnSDxMaL', // Sarah
  dermatologist: 'JBFqnCBsd6RMkjVDRZzb', // George
  mental_health: 'FGY2WhTYpPnrIDTdsKH5', // Laura
  cardiologist: 'onwK4e9ZLuTAKqWW03F9', // Daniel
  pediatrician: 'pFZP5JQG7iQjIQuC4Bku', // Lily
  neurologist: 'TX3LPaxmHKxFdv7VOQHJ', // Liam
  gynecologist: 'XrExE9yKIg1WjnnlVkGX', // Matilda
  nutritionist: 'cgSgspJ2msm6clMCkdW9', // Jessica
};

const DOCTOR_NAMES: Record<string, string> = {
  general: 'Dr. Sarah',
  dermatologist: 'Dr. Michael',
  mental_health: 'Dr. Emma',
  cardiologist: 'Dr. James',
  pediatrician: 'Dr. Lily',
  neurologist: 'Dr. Nathan',
  gynecologist: 'Dr. Maya',
  nutritionist: 'Dr. Sophie',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!ELEVENLABS_API_KEY) {
      console.error('ELEVENLABS_API_KEY is not configured');
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
      // Create an agent for this conversation
      const defaultPrompt = `You are ${doctorName}, a compassionate healthcare AI assistant. 
                
Your approach:
- Listen carefully to patient symptoms and concerns
- Ask clarifying questions to understand their condition better  
- Provide helpful medical information and guidance
- Recommend when to seek in-person medical attention
- Be empathetic, supportive, and professional

Remember: Always clarify that you are an AI assistant and recommend consulting with a human doctor for serious concerns or prescriptions.

Keep your responses concise and conversational since this is a voice call.`;

      const agentConfig = {
        conversation_config: {
          agent: {
            prompt: {
              prompt: systemPrompt || defaultPrompt,
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

      console.log('Creating ElevenLabs agent with config:', JSON.stringify(agentConfig));

      // Create agent
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
          headers: {
            'xi-api-key': ELEVENLABS_API_KEY,
          },
        }
      );

      if (!signedUrlResponse.ok) {
        const errorText = await signedUrlResponse.text();
        console.error('Failed to get signed URL:', signedUrlResponse.status, errorText);
        
        // Return the agent ID as fallback for public agents
        return new Response(
          JSON.stringify({ 
            agent_id: agentId,
            message: 'Signed URL not available, use agent_id directly'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const signedUrlData = await signedUrlResponse.json();
      console.log('Signed URL obtained');

      return new Response(
        JSON.stringify({ 
          signed_url: signedUrlData.signed_url,
          agent_id: agentId,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'get_token') {
      // Alternative: Get conversation token for WebRTC
      const body = await req.json();
      const agentId = body.agentId;
      
      if (!agentId) {
        return new Response(
          JSON.stringify({ error: 'agentId is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const tokenResponse = await fetch(
        `https://api.elevenlabs.io/v1/convai/conversation/token?agent_id=${agentId}`,
        {
          method: 'GET',
          headers: {
            'xi-api-key': ELEVENLABS_API_KEY,
          },
        }
      );

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        console.error('Failed to get token:', tokenResponse.status, errorText);
        return new Response(
          JSON.stringify({ error: `Failed to get token: ${errorText}` }),
          { status: tokenResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const tokenData = await tokenResponse.json();
      
      return new Response(
        JSON.stringify({ token: tokenData.token }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Handle legacy create_session action
    if (action === 'create_session') {
      return new Response(
        JSON.stringify({ 
          error: 'Please use get_signed_url action instead',
          message: 'The create_session action is deprecated'
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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
