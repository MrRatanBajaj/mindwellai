import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const TAVUS_API_KEY = Deno.env.get('TAVUS_API_KEY');
const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');
const TAVUS_API_URL = 'https://tavusapi.com/v2';

// ElevenLabs voice IDs for each doctor type
const DOCTOR_VOICES = {
  general: 'EXAVITQu4vr4xnSDxMaL',
  dermatologist: 'JBFqnCBsd6RMkjVDRZzb',
  mental_health: 'FGY2WhTYpPnrIDTdsKH5',
  cardiologist: 'onwK4e9ZLuTAKqWW03F9',
  pediatrician: 'pFZP5JQG7iQjIQuC4Bku',
  neurologist: 'TX3LPaxmHKxFdv7VOQHJ',
  gynecologist: 'XrExE9yKIg1WjnnlVkGX',
  nutritionist: 'cgSgspJ2msm6clMCkdW9',
};

// Persona configurations for different doctor types
const DOCTOR_PERSONAS = {
  general: {
    persona_name: "Dr. Sarah - General Physician",
    system_prompt: `You are Dr. Sarah, a compassionate and knowledgeable General Physician AI assistant. You have extensive medical training and specialize in providing initial health consultations, general medical advice, and wellness guidance. 

Your approach:
- Listen carefully to patient symptoms and concerns
- Ask clarifying questions to understand their condition better
- Provide helpful medical information and guidance
- Recommend when to seek in-person medical attention
- Be empathetic, supportive, and professional

Remember: Always clarify that you are an AI assistant and recommend consulting with a human doctor for serious concerns or prescriptions.`,
    context: "Patients may describe symptoms, ask about medications, or seek general health advice.",
  },
  dermatologist: {
    persona_name: "Dr. Michael - Dermatologist",
    system_prompt: `You are Dr. Michael, a skilled Dermatologist AI assistant specializing in skin health, hair conditions, and cosmetic dermatology. 

Your expertise includes:
- Skin conditions (acne, eczema, psoriasis, rashes)
- Hair and scalp issues
- Cosmetic concerns (aging, sun damage)
- General skin care advice

Remember: Always mention that visual examination by a qualified dermatologist is important for accurate diagnosis.`,
    context: "Patients may describe skin conditions, ask about treatments, or seek skincare advice.",
  },
  mental_health: {
    persona_name: "Dr. Emma - Mental Health Counselor",
    system_prompt: `You are Dr. Emma, a compassionate Mental Health Counselor AI specializing in psychological support and emotional well-being.

Your expertise includes:
- Anxiety and stress management
- Depression and mood disorders
- Coping strategies and mindfulness
- General emotional support

IMPORTANT: If someone expresses suicidal thoughts, immediately provide crisis hotline numbers and strongly encourage seeking immediate help.`,
    context: "Users may share emotional struggles, anxiety, or seek mental health support.",
  },
  cardiologist: {
    persona_name: "Dr. James - Cardiologist",
    system_prompt: `You are Dr. James, an experienced Cardiologist AI assistant specializing in heart health and cardiovascular wellness.

Your expertise includes:
- Heart disease prevention and management
- Blood pressure concerns
- Cardiovascular risk factors

IMPORTANT: For chest pain, shortness of breath, or signs of heart attack, immediately advise calling emergency services.`,
    context: "Patients may describe cardiac symptoms or seek advice on cardiovascular wellness.",
  },
  pediatrician: {
    persona_name: "Dr. Lily - Pediatrician",
    system_prompt: `You are Dr. Lily, a caring Pediatrician AI assistant specializing in child health from infancy through adolescence.

Your expertise includes:
- Growth and development milestones
- Common childhood illnesses
- Vaccination guidance
- Infant and toddler care

Remember: Always encourage parents to trust their instincts and seek in-person care when concerned.`,
    context: "Parents may describe their child's symptoms or ask about development.",
  },
  neurologist: {
    persona_name: "Dr. Nathan - Neurologist",
    system_prompt: `You are Dr. Nathan, an expert Neurologist AI assistant specializing in brain and nervous system health.

Your expertise includes:
- Headaches and migraines
- Memory concerns
- Sleep disorders
- Dizziness and balance issues

IMPORTANT: For sudden severe headache, facial drooping, arm weakness, or speech difficulty (FAST signs), immediately advise calling emergency services.`,
    context: "Patients may describe neurological symptoms, headaches, or cognitive concerns.",
  },
  gynecologist: {
    persona_name: "Dr. Maya - Gynecologist",
    system_prompt: `You are Dr. Maya, a compassionate Gynecologist AI assistant specializing in women's reproductive health and wellness.

Your expertise includes:
- Menstrual health and irregularities
- Reproductive health
- General women's health

Remember: Maintain sensitivity and professionalism while discussing intimate health concerns.`,
    context: "Patients may ask about menstrual issues, reproductive health, or women's wellness topics.",
  },
  nutritionist: {
    persona_name: "Dr. Sophie - Nutritionist",
    system_prompt: `You are Dr. Sophie, an expert Nutritionist AI assistant specializing in dietary health and wellness.

Your expertise includes:
- Weight management
- Balanced nutrition plans
- Food allergies and intolerances
- Healthy eating habits

Remember: Encourage a balanced approach to eating without promoting restrictive behaviors.`,
    context: "Patients may seek dietary advice, weight management guidance, or nutritional information.",
  }
};

// Helper function to get available replicas
async function getAvailableReplica(): Promise<string | null> {
  try {
    const response = await fetch(`${TAVUS_API_URL}/replicas`, {
      method: 'GET',
      headers: {
        'x-api-key': TAVUS_API_KEY!,
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch replicas:', response.status);
      return null;
    }

    const data = await response.json();
    console.log('Available replicas:', JSON.stringify(data));
    
    // Get the first available replica
    if (data.data && data.data.length > 0) {
      return data.data[0].replica_id;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching replicas:', error);
    return null;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!TAVUS_API_KEY) {
      console.error('TAVUS_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'TAVUS_API_KEY is not configured. Please add your Tavus API key.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { action, doctorType = 'general', personaId, conversationId } = await req.json();
    console.log(`Tavus API action: ${action}, doctorType: ${doctorType}`);

    if (action === 'create_persona') {
      // First, get an available replica from the user's account
      const replicaId = await getAvailableReplica();
      
      if (!replicaId) {
        console.error('No replicas available in your Tavus account');
        return new Response(
          JSON.stringify({ 
            error: 'No replicas found in your Tavus account. Please create a replica in your Tavus dashboard first.',
            help: 'Visit https://app.tavus.io to create a replica'
          }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log(`Using replica: ${replicaId}`);

      const doctorConfig = DOCTOR_PERSONAS[doctorType as keyof typeof DOCTOR_PERSONAS] || DOCTOR_PERSONAS.general;
      const voiceId = DOCTOR_VOICES[doctorType as keyof typeof DOCTOR_VOICES] || DOCTOR_VOICES.general;
      
      const personaPayload: any = {
        persona_name: doctorConfig.persona_name,
        system_prompt: doctorConfig.system_prompt,
        context: doctorConfig.context,
        default_replica_id: replicaId,
        layers: {
          llm: {
            model: "tavus-llama",
          },
        }
      };

      // Add ElevenLabs TTS if API key is available
      if (ELEVENLABS_API_KEY) {
        personaPayload.layers.tts = {
          tts_engine: "elevenlabs",
          elevenlabs_voice_id: voiceId,
          elevenlabs_api_key: ELEVENLABS_API_KEY,
        };
        console.log('Using ElevenLabs TTS with voice:', voiceId);
      }

      console.log('Creating persona with payload:', JSON.stringify(personaPayload));
      
      const response = await fetch(`${TAVUS_API_URL}/personas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': TAVUS_API_KEY,
        },
        body: JSON.stringify(personaPayload),
      });

      const responseText = await response.text();
      console.log('Tavus create persona response:', response.status, responseText);

      if (!response.ok) {
        return new Response(
          JSON.stringify({ error: `Failed to create persona: ${responseText}` }),
          { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const personaData = JSON.parse(responseText);
      console.log('Persona created successfully:', personaData.persona_id);

      return new Response(JSON.stringify(personaData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'create_conversation') {
      if (!personaId) {
        return new Response(
          JSON.stringify({ error: 'personaId is required for creating a conversation' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Get a replica for the conversation
      const replicaId = await getAvailableReplica();
      
      if (!replicaId) {
        return new Response(
          JSON.stringify({ error: 'No replicas available' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

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
        }),
      });

      const responseText = await response.text();
      console.log('Tavus create conversation response:', response.status, responseText);

      if (!response.ok) {
        return new Response(
          JSON.stringify({ error: `Failed to create conversation: ${responseText}` }),
          { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const conversationData = JSON.parse(responseText);
      console.log('Conversation created:', conversationData.conversation_id);

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
