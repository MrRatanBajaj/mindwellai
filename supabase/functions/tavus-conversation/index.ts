import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const TAVUS_API_KEY = Deno.env.get('TAVUS_API_KEY');
const TAVUS_API_URL = 'https://tavusapi.com/v2';

// Stock replica IDs - You may need to replace with your own replica ID from Tavus dashboard
const STOCK_REPLICAS = {
  general: 'r79e1c033f',
  dermatologist: 'r79e1c033f',
  mental_health: 'r79e1c033f',
};

// ElevenLabs voice IDs for each doctor type
const DOCTOR_VOICES = {
  general: 'EXAVITQu4vr4xnSDxMaL', // Sarah - professional female voice
  dermatologist: 'JBFqnCBsd6RMkjVDRZzb', // George - professional male voice
  mental_health: 'FGY2WhTYpPnrIDTdsKH5', // Laura - warm empathetic voice
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
    context: "Patients may describe symptoms, ask about medications, or seek general health advice. Provide thoughtful, accurate medical information while being supportive.",
  },
  dermatologist: {
    persona_name: "Dr. Michael - Dermatologist",
    system_prompt: `You are Dr. Michael, a skilled Dermatologist AI assistant specializing in skin health, hair conditions, and cosmetic dermatology. 

Your expertise includes:
- Skin conditions (acne, eczema, psoriasis, rashes)
- Hair and scalp issues
- Cosmetic concerns (aging, sun damage)
- General skin care advice

Your approach:
- Ask about the appearance, location, and duration of skin issues
- Inquire about any related symptoms (itching, pain, changes)
- Provide skincare recommendations and lifestyle advice
- Recommend when to see a dermatologist in person

Remember: Always mention that visual examination by a qualified dermatologist is important for accurate diagnosis.`,
    context: "Patients may describe skin conditions, ask about treatments, or seek skincare advice. Help them understand their condition and provide guidance.",
  },
  mental_health: {
    persona_name: "Dr. Emma - Mental Health Counselor",
    system_prompt: `You are Dr. Emma, a compassionate Mental Health Counselor AI specializing in psychological support and emotional well-being.

Your expertise includes:
- Anxiety and stress management
- Depression and mood disorders
- Coping strategies and mindfulness
- Crisis intervention basics
- General emotional support

Your approach:
- Create a safe, non-judgmental space for conversation
- Use active listening and empathetic responses
- Help identify feelings and thought patterns
- Suggest coping techniques (breathing exercises, grounding)
- Recognize when professional human intervention is needed

IMPORTANT: If someone expresses suicidal thoughts or intent to harm themselves or others, immediately provide crisis hotline numbers and strongly encourage seeking immediate help.`,
    context: "Users may share emotional struggles, anxiety, or seek mental health support. Be supportive, empathetic, and provide helpful coping strategies.",
  }
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!TAVUS_API_KEY) {
      throw new Error('TAVUS_API_KEY is not configured');
    }

    const { action, doctorType = 'general', personaId, conversationId } = await req.json();
    console.log(`Tavus API action: ${action}, doctorType: ${doctorType}`);

    if (action === 'create_persona') {
      // Create a new persona for the specified doctor type
      const doctorConfig = DOCTOR_PERSONAS[doctorType as keyof typeof DOCTOR_PERSONAS] || DOCTOR_PERSONAS.general;
      const replicaId = STOCK_REPLICAS[doctorType as keyof typeof STOCK_REPLICAS] || STOCK_REPLICAS.general;
      const voiceId = DOCTOR_VOICES[doctorType as keyof typeof DOCTOR_VOICES] || DOCTOR_VOICES.general;
      
      console.log(`Creating persona with replica: ${replicaId}, voice: ${voiceId}`);
      
      const response = await fetch(`${TAVUS_API_URL}/personas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': TAVUS_API_KEY,
        },
        body: JSON.stringify({
          persona_name: doctorConfig.persona_name,
          pipeline_mode: "full",
          system_prompt: doctorConfig.system_prompt,
          context: doctorConfig.context,
          default_replica_id: replicaId,
          layers: {
            tts: {
              tts_engine: "elevenlabs",
              elevenlabs_voice_id: voiceId,
              tts_emotion_control: true
            },
            llm: {
              model: "tavus-gpt-4o",
              speculative_inference: true,
              tools: [
                {
                  type: "function",
                  function: {
                    name: "get_health_info",
                    description: "Fetch health information for a specific condition or symptom.",
                    parameters: {
                      type: "object",
                      required: ["topic"],
                      properties: {
                        topic: {
                          type: "string",
                          description: "The health topic, symptom, or condition to get information about."
                        }
                      }
                    }
                  }
                }
              ]
            },
            stt: {
              participant_pause_sensitivity: "high",
              participant_interrupt_sensitivity: "high",
              smart_turn_detection: true
            }
          }
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Tavus create persona error:', errorText);
        throw new Error(`Failed to create persona: ${response.status} - ${errorText}`);
      }

      const personaData = await response.json();
      console.log('Persona created:', personaData);

      return new Response(JSON.stringify(personaData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'create_conversation') {
      // Create a conversation with the specified persona
      if (!personaId) {
        throw new Error('personaId is required for creating a conversation');
      }

      const replicaId = STOCK_REPLICAS[doctorType as keyof typeof STOCK_REPLICAS] || STOCK_REPLICAS.general;

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

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Tavus create conversation error:', errorText);
        throw new Error(`Failed to create conversation: ${response.status} - ${errorText}`);
      }

      const conversationData = await response.json();
      console.log('Conversation created:', conversationData);

      return new Response(JSON.stringify(conversationData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'get_replicas') {
      // List all available replicas
      const response = await fetch(`${TAVUS_API_URL}/replicas`, {
        method: 'GET',
        headers: {
          'x-api-key': TAVUS_API_KEY,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Tavus get replicas error:', errorText);
        throw new Error(`Failed to get replicas: ${response.status}`);
      }

      const replicasData = await response.json();
      console.log('Available replicas:', replicasData);
      return new Response(JSON.stringify(replicasData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'get_personas') {
      // List all available personas
      const response = await fetch(`${TAVUS_API_URL}/personas`, {
        method: 'GET',
        headers: {
          'x-api-key': TAVUS_API_KEY,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Tavus get personas error:', errorText);
        throw new Error(`Failed to get personas: ${response.status}`);
      }

      const personasData = await response.json();
      return new Response(JSON.stringify(personasData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'end_conversation') {
      // End an active conversation
      if (!conversationId) {
        throw new Error('conversationId is required');
      }

      const response = await fetch(`${TAVUS_API_URL}/conversations/${conversationId}/end`, {
        method: 'POST',
        headers: {
          'x-api-key': TAVUS_API_KEY,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Tavus end conversation error:', errorText);
        // Don't throw error for end conversation - it may already be ended
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    throw new Error(`Unknown action: ${action}`);

  } catch (error) {
    console.error('Tavus conversation error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
