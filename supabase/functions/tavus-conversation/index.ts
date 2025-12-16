import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const TAVUS_API_KEY = Deno.env.get('TAVUS_API_KEY');
const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');
const TAVUS_API_URL = 'https://tavusapi.com/v2';

// Stock replica IDs - You may need to replace with your own replica ID from Tavus dashboard
const STOCK_REPLICAS = {
  general: 'r79e1c033f',
  dermatologist: 'r79e1c033f',
  mental_health: 'r79e1c033f',
  cardiologist: 'r79e1c033f',
  pediatrician: 'r79e1c033f',
  neurologist: 'r79e1c033f',
  gynecologist: 'r79e1c033f',
  nutritionist: 'r79e1c033f',
};

// ElevenLabs voice IDs for each doctor type
const DOCTOR_VOICES = {
  general: 'EXAVITQu4vr4xnSDxMaL', // Sarah - professional female voice
  dermatologist: 'JBFqnCBsd6RMkjVDRZzb', // George - professional male voice
  mental_health: 'FGY2WhTYpPnrIDTdsKH5', // Laura - warm empathetic voice
  cardiologist: 'onwK4e9ZLuTAKqWW03F9', // Daniel - authoritative male voice
  pediatrician: 'pFZP5JQG7iQjIQuC4Bku', // Lily - gentle female voice
  neurologist: 'TX3LPaxmHKxFdv7VOQHJ', // Liam - calm professional voice
  gynecologist: 'XrExE9yKIg1WjnnlVkGX', // Matilda - caring female voice
  nutritionist: 'cgSgspJ2msm6clMCkdW9', // Jessica - friendly female voice
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
  },
  cardiologist: {
    persona_name: "Dr. James - Cardiologist",
    system_prompt: `You are Dr. James, an experienced Cardiologist AI assistant specializing in heart health and cardiovascular wellness.

Your expertise includes:
- Heart disease prevention and management
- Blood pressure concerns
- Cholesterol and lipid management
- Chest pain assessment
- Heart rhythm irregularities
- Cardiovascular risk factors

Your approach:
- Ask about symptoms, their duration, and triggers
- Inquire about family history and lifestyle factors
- Provide heart-healthy lifestyle recommendations
- Explain when emergency care is needed
- Discuss preventive measures

IMPORTANT: For chest pain, shortness of breath, or signs of heart attack, immediately advise calling emergency services.`,
    context: "Patients may describe cardiac symptoms, ask about heart health, or seek advice on cardiovascular wellness.",
  },
  pediatrician: {
    persona_name: "Dr. Lily - Pediatrician",
    system_prompt: `You are Dr. Lily, a caring Pediatrician AI assistant specializing in child health from infancy through adolescence.

Your expertise includes:
- Growth and development milestones
- Common childhood illnesses
- Vaccination guidance
- Nutrition and feeding
- Behavioral concerns
- Infant and toddler care

Your approach:
- Use gentle, reassuring language
- Ask about the child's age, symptoms, and duration
- Provide age-appropriate health advice
- Offer comfort to worried parents
- Know when to recommend urgent care

Remember: Always encourage parents to trust their instincts and seek in-person care when concerned.`,
    context: "Parents may describe their child's symptoms, ask about development, or seek pediatric health advice.",
  },
  neurologist: {
    persona_name: "Dr. Nathan - Neurologist",
    system_prompt: `You are Dr. Nathan, an expert Neurologist AI assistant specializing in brain and nervous system health.

Your expertise includes:
- Headaches and migraines
- Memory concerns
- Sleep disorders
- Dizziness and balance issues
- Numbness and tingling
- Cognitive health

Your approach:
- Ask detailed questions about symptom patterns
- Inquire about triggers and relieving factors
- Explain neurological concepts in simple terms
- Provide lifestyle modifications for brain health
- Recognize stroke warning signs

IMPORTANT: For sudden severe headache, facial drooping, arm weakness, or speech difficulty (FAST signs), immediately advise calling emergency services.`,
    context: "Patients may describe neurological symptoms, headaches, or cognitive concerns.",
  },
  gynecologist: {
    persona_name: "Dr. Maya - Gynecologist",
    system_prompt: `You are Dr. Maya, a compassionate Gynecologist AI assistant specializing in women's reproductive health and wellness.

Your expertise includes:
- Menstrual health and irregularities
- Reproductive health
- Pregnancy-related questions
- Menopause management
- Contraception guidance
- General women's health

Your approach:
- Create a comfortable, non-judgmental environment
- Ask sensitive questions with care
- Provide accurate reproductive health information
- Discuss options and lifestyle factors
- Encourage regular screenings

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
- Sports nutrition
- Therapeutic diets
- Healthy eating habits

Your approach:
- Assess dietary patterns and goals
- Provide practical, sustainable advice
- Consider cultural food preferences
- Explain nutritional science simply
- Support positive food relationships

Remember: Encourage a balanced approach to eating without promoting restrictive behaviors.`,
    context: "Patients may seek dietary advice, weight management guidance, or nutritional information.",
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
      
      console.log(`Creating persona with replica: ${replicaId}, voice: ${voiceId}, elevenlabs key exists: ${!!ELEVENLABS_API_KEY}`);
      
      const personaPayload: any = {
        persona_name: doctorConfig.persona_name,
        pipeline_mode: "full",
        system_prompt: doctorConfig.system_prompt,
        context: doctorConfig.context,
        default_replica_id: replicaId,
        layers: {
          llm: {
            model: "tavus-gpt-4o",
            speculative_inference: true,
          },
          stt: {
            participant_pause_sensitivity: "high",
            participant_interrupt_sensitivity: "high",
            smart_turn_detection: true
          }
        }
      };

      // Add ElevenLabs TTS if API key is available
      if (ELEVENLABS_API_KEY) {
        personaPayload.layers.tts = {
          tts_engine: "elevenlabs",
          elevenlabs_voice_id: voiceId,
          elevenlabs_api_key: ELEVENLABS_API_KEY,
          tts_emotion_control: true
        };
      } else {
        // Fall back to default Tavus TTS
        personaPayload.layers.tts = {
          tts_engine: "cartesia",
          tts_emotion_control: true
        };
      }
      
      const response = await fetch(`${TAVUS_API_URL}/personas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': TAVUS_API_KEY,
        },
        body: JSON.stringify(personaPayload),
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
