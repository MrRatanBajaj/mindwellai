import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const TAVUS_API_KEY = Deno.env.get('TAVUS_API_KEY');
const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');
const TAVUS_API_URL = 'https://tavusapi.com/v2';

// Individual Tavus Phoenix-3 replica mapped per doctor for real avatar feel
const DOCTOR_REPLICAS: Record<string, string> = {
  general:      'rd3ba0f30551',  // Olivia - Doctor (female doctor)
  mental_health:'rdc96ac37313',  // Julia
  cardiologist: 'r92debe21318',  // James
  dermatologist:'r1a4e22fa0d9',  // Benjamin
  pediatrician: 'r1af76e94d00',  // Rose
  neurologist:  'rfe12d8b9597',  // Nathan - Bookshelf
  gynecologist: 'r68fe8906e53',  // Mary - Office
  nutritionist: 'r4dcf31b60e1',  // Anna - Office
  career:       'r18e9aebdc33',  // Raj - Doctor
  relationship: 'r9d30b0e55ac',  // Luna
};

// ElevenLabs voice IDs for each doctor type
const DOCTOR_VOICES: Record<string, string> = {
  general:      'EXAVITQu4vr4xnSDxMaL',
  dermatologist:'JBFqnCBsd6RMkjVDRZzb',
  mental_health:'FGY2WhTYpPnrIDTdsKH5',
  cardiologist: 'onwK4e9ZLuTAKqWW03F9',
  pediatrician: 'pFZP5JQG7iQjIQuC4Bku',
  neurologist:  'TX3LPaxmHKxFdv7VOQHJ',
  gynecologist: 'XrExE9yKIg1WjnnlVkGX',
  nutritionist: 'cgSgspJ2msm6clMCkdW9',
  career:       'VR6AewLTigWG4xSOukaG',
  relationship: 'ErXwobaYiN019PkySvjV',
};

const DOCTOR_PERSONAS: Record<string, { persona_name: string; system_prompt: string; context: string }> = {
  general: {
    persona_name: "Dr. Sarah - General Physician",
    system_prompt: `You are Dr. Sarah, a compassionate General Physician AI. Listen carefully, ask clarifying questions, provide evidence-based guidance, and recommend in-person care for serious concerns. Keep responses conversational and warm.`,
    context: "Patients describe symptoms, ask about medications, or seek general health advice.",
  },
  dermatologist: {
    persona_name: "Dr. Michael - Dermatologist",
    system_prompt: `You are Dr. Michael, a skilled Dermatologist AI. Help with skin, hair, and cosmetic concerns. Explain when visual in-person examination is necessary. Be approachable and clear.`,
    context: "Patients describe skin conditions or ask about treatments.",
  },
  mental_health: {
    persona_name: "Dr. Emma - Mental Health Counselor",
    system_prompt: `You are Dr. Emma, a compassionate Mental Health Counselor AI trained in CBT/DBT/ACT. Provide emotional support, practical coping skills, and crisis-safe escalation. If someone expresses suicidal thoughts, provide crisis hotline numbers immediately.`,
    context: "Users share emotional struggles, anxiety, or seek mental health support.",
  },
  cardiologist: {
    persona_name: "Dr. James - Cardiologist",
    system_prompt: `You are Dr. James, an experienced Cardiologist AI. Focus on cardiovascular health. For chest pain, shortness of breath, or heart attack signs, immediately advise calling emergency services.`,
    context: "Patients describe cardiac symptoms or seek cardiovascular wellness advice.",
  },
  pediatrician: {
    persona_name: "Dr. Lily - Pediatrician",
    system_prompt: `You are Dr. Lily, a caring Pediatrician AI. Support parents with child health questions, growth milestones, and common childhood illnesses. Encourage seeking in-person care when warning signs are present.`,
    context: "Parents describe their child's symptoms or ask about development.",
  },
  neurologist: {
    persona_name: "Dr. Nathan - Neurologist",
    system_prompt: `You are Dr. Nathan, a Neurologist AI. Provide structured neurological guidance. For FAST/stroke signs or sudden severe headache, immediately advise calling emergency services.`,
    context: "Patients describe neurological symptoms, headaches, or cognitive concerns.",
  },
  gynecologist: {
    persona_name: "Dr. Maya - Gynecologist",
    system_prompt: `You are Dr. Maya, a compassionate Gynecologist AI. Give respectful, evidence-based guidance on women's health. Encourage timely in-person care for red-flag symptoms.`,
    context: "Patients ask about menstrual issues, reproductive health, or women's wellness.",
  },
  nutritionist: {
    persona_name: "Dr. Sophie - Nutritionist",
    system_prompt: `You are Dr. Sophie, a Nutritionist AI. Offer practical food guidance, metabolic awareness, and sustainable plans without promoting restrictive behaviors.`,
    context: "Patients seek dietary advice, weight management, or nutritional information.",
  },
  career: {
    persona_name: "Dr. Arjun - Career Counselor",
    system_prompt: `You are Dr. Arjun, a Career Counselor AI. Help with career transitions, interview preparation, workplace stress, and action planning. Give concrete, step-by-step advice.`,
    context: "Users discuss career confusion, job changes, interview anxiety, or workplace stress.",
  },
  relationship: {
    persona_name: "Dr. Riya - Relationship Counselor",
    system_prompt: `You are Dr. Riya, a Relationship Counselor AI. Help users improve communication, resolve conflicts, and build secure emotional connection. Stay neutral, avoid blame, and provide safe communication scripts.`,
    context: "Users discuss romantic conflict, trust issues, or emotional distance.",
  },
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!TAVUS_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'TAVUS_API_KEY is not configured.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { action, doctorType = 'general', personaId, conversationId } = await req.json();
    console.log(`Tavus API action: ${action}, doctorType: ${doctorType}`);

    if (action === 'create_persona') {
      const replicaId = DOCTOR_REPLICAS[doctorType] || DOCTOR_REPLICAS.general;
      const voiceId = DOCTOR_VOICES[doctorType] || DOCTOR_VOICES.general;
      const doctorConfig = DOCTOR_PERSONAS[doctorType] || DOCTOR_PERSONAS.general;

      console.log(`Using replica: ${replicaId} for ${doctorType}`);

      const personaPayload: any = {
        persona_name: doctorConfig.persona_name,
        system_prompt: doctorConfig.system_prompt,
        context: doctorConfig.context,
        default_replica_id: replicaId,
        layers: {
          llm: {
            model: "tavus-llama",
          },
        },
      };

      // Add ElevenLabs TTS if available
      if (ELEVENLABS_API_KEY) {
        personaPayload.layers.tts = {
          tts_engine: "elevenlabs",
          elevenlabs_voice_id: voiceId,
          elevenlabs_api_key: ELEVENLABS_API_KEY,
        };
        console.log('Using ElevenLabs TTS voice:', voiceId);
      }

      console.log('Creating persona:', JSON.stringify(personaPayload));

      const response = await fetch(`${TAVUS_API_URL}/personas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': TAVUS_API_KEY,
        },
        body: JSON.stringify(personaPayload),
      });

      const responseText = await response.text();
      console.log('Tavus persona response:', response.status, responseText);

      if (!response.ok) {
        // If persona creation fails, try direct conversation with replica
        console.log('Persona creation failed, attempting direct conversation...');
        
        const convResponse = await fetch(`${TAVUS_API_URL}/conversations`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': TAVUS_API_KEY,
          },
          body: JSON.stringify({
            replica_id: replicaId,
            custom_greeting: `Hello! I'm ${doctorConfig.persona_name.split(' - ')[0]}. How can I help you today?`,
            properties: {
              max_call_duration: 3600,
              enable_recording: false,
            },
          }),
        });

        const convText = await convResponse.text();
        console.log('Direct conversation response:', convResponse.status, convText);

        if (!convResponse.ok) {
          return new Response(
            JSON.stringify({ error: `Failed to create video session: ${convText}` }),
            { status: convResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const convData = JSON.parse(convText);
        return new Response(
          JSON.stringify({
            persona_id: 'direct',
            conversation_id: convData.conversation_id,
            conversation_url: convData.conversation_url,
            direct: true,
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const personaData = JSON.parse(responseText);
      return new Response(JSON.stringify(personaData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'create_conversation') {
      if (!personaId) {
        return new Response(
          JSON.stringify({ error: 'personaId is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const replicaId = DOCTOR_REPLICAS[doctorType] || DOCTOR_REPLICAS.general;

      console.log('Creating conversation with persona:', personaId, 'replica:', replicaId);

      const response = await fetch(`${TAVUS_API_URL}/conversations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': TAVUS_API_KEY,
        },
        body: JSON.stringify({
          persona_id: personaId,
          replica_id: replicaId,
          properties: {
            max_call_duration: 3600,
            enable_recording: false,
          },
        }),
      });

      const responseText = await response.text();
      console.log('Tavus conversation response:', response.status, responseText);

      if (!response.ok) {
        return new Response(
          JSON.stringify({ error: `Failed to create conversation: ${responseText}` }),
          { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const conversationData = JSON.parse(responseText);
      return new Response(JSON.stringify(conversationData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'get_replicas') {
      const response = await fetch(`${TAVUS_API_URL}/replicas`, {
        method: 'GET',
        headers: { 'x-api-key': TAVUS_API_KEY },
      });

      const responseText = await response.text();
      if (!response.ok) {
        return new Response(
          JSON.stringify({ error: `Failed to get replicas: ${responseText}` }),
          { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(responseText, {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'end_conversation') {
      if (!conversationId) {
        return new Response(
          JSON.stringify({ error: 'conversationId is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const response = await fetch(`${TAVUS_API_URL}/conversations/${conversationId}/end`, {
        method: 'POST',
        headers: { 'x-api-key': TAVUS_API_KEY },
      });

      console.log('End conversation response:', response.status);

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(
      JSON.stringify({ error: `Unknown action: ${action}` }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Tavus conversation error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
