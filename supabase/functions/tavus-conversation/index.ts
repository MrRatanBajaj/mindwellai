import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const TAVUS_API_KEY = Deno.env.get('TAVUS_API_KEY');
const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');
const TAVUS_API_URL = 'https://tavusapi.com/v2';

// Tavus replicas — reuse same pool for all 23 counselor types so we never block.
// We only have ~10 Tavus stock replicas, so multiple counselors share a face/voice
// but get their own persona, name, prompt, and ElevenLabs voice.
const REPLICA_OLIVIA  = 'rd3ba0f30551'; // Female doctor
const REPLICA_JULIA   = 'rdc96ac37313'; // Female warm
const REPLICA_JAMES   = 'r92debe21318'; // Male doctor
const REPLICA_BENJAMIN= 'r1a4e22fa0d9'; // Male
const REPLICA_ROSE    = 'r1af76e94d00'; // Female caring
const REPLICA_NATHAN  = 'rfe12d8b9597'; // Male bookshelf
const REPLICA_MARY    = 'r68fe8906e53'; // Female office
const REPLICA_ANNA    = 'r4dcf31b60e1'; // Female office
const REPLICA_RAJ     = 'r18e9aebdc33'; // Male doctor
const REPLICA_LUNA    = 'r9d30b0e55ac'; // Female

const DOCTOR_REPLICAS: Record<string, string> = {
  general:             REPLICA_OLIVIA,
  mental_health:       REPLICA_JULIA,
  cardiologist:        REPLICA_JAMES,
  dermatologist:       REPLICA_BENJAMIN,
  pediatrician:        REPLICA_ROSE,
  neurologist:         REPLICA_NATHAN,
  gynecologist:        REPLICA_MARY,
  nutritionist:        REPLICA_ANNA,
  career:              REPLICA_RAJ,
  relationship:        REPLICA_LUNA,
  male_therapist:      REPLICA_JAMES,
  elder_counselor:     REPLICA_MARY,
  youth_counselor:     REPLICA_LUNA,
  sleep_specialist:    REPLICA_JULIA,
  fertility_expert:    REPLICA_ROSE,
  skin_wellness:       REPLICA_ANNA,
  postpartum:          REPLICA_MARY,
  anxiety_specialist:  REPLICA_OLIVIA,
  mindfulness_coach:   REPLICA_JULIA,
  addiction_recovery:  REPLICA_BENJAMIN,
  trauma_specialist:   REPLICA_OLIVIA,
  music_therapist:     REPLICA_LUNA,
  life_coach:          REPLICA_ANNA,
};

const DOCTOR_VOICES: Record<string, string> = {
  general:             'EXAVITQu4vr4xnSDxMaL',
  mental_health:       'FGY2WhTYpPnrIDTdsKH5',
  cardiologist:        'onwK4e9ZLuTAKqWW03F9',
  dermatologist:       'JBFqnCBsd6RMkjVDRZzb',
  pediatrician:        'pFZP5JQG7iQjIQuC4Bku',
  neurologist:         'TX3LPaxmHKxFdv7VOQHJ',
  gynecologist:        'XrExE9yKIg1WjnnlVkGX',
  nutritionist:        'cgSgspJ2msm6clMCkdW9',
  career:              'VR6AewLTigWG4xSOukaG',
  relationship:        'ErXwobaYiN019PkySvjV',
  male_therapist:      'onwK4e9ZLuTAKqWW03F9',
  elder_counselor:     'XrExE9yKIg1WjnnlVkGX',
  youth_counselor:     'pFZP5JQG7iQjIQuC4Bku',
  sleep_specialist:    'EXAVITQu4vr4xnSDxMaL',
  fertility_expert:    'XrExE9yKIg1WjnnlVkGX',
  skin_wellness:       'pFZP5JQG7iQjIQuC4Bku',
  postpartum:          'FGY2WhTYpPnrIDTdsKH5',
  anxiety_specialist:  'cgSgspJ2msm6clMCkdW9',
  mindfulness_coach:   'EXAVITQu4vr4xnSDxMaL',
  addiction_recovery:  'onwK4e9ZLuTAKqWW03F9',
  trauma_specialist:   'FGY2WhTYpPnrIDTdsKH5',
  music_therapist:     'pFZP5JQG7iQjIQuC4Bku',
  life_coach:          'XrExE9yKIg1WjnnlVkGX',
};

const DOCTOR_PERSONAS: Record<string, { persona_name: string; system_prompt: string; context: string }> = {
  general:            { persona_name: "Dr. Sarah - General Physician", system_prompt: "You are Dr. Sarah, a compassionate General Physician AI. Be warm, ask clarifying questions, and recommend in-person care for red flags.", context: "Patients ask about general health." },
  mental_health:      { persona_name: "Dr. Emma - Mental Health Counselor", system_prompt: "You are Dr. Emma, a Mental Health Counselor trained in CBT/DBT/ACT. Offer support and crisis-safe escalation.", context: "Users share emotional struggles." },
  cardiologist:       { persona_name: "Dr. James - Cardiologist", system_prompt: "You are Dr. James, a Cardiologist. For chest pain or stroke signs, immediately advise emergency services.", context: "Cardiac concerns." },
  dermatologist:      { persona_name: "Dr. Michael - Dermatologist", system_prompt: "You are Dr. Michael, a Dermatologist. Help with skin issues; flag when in-person exam is needed.", context: "Skin concerns." },
  pediatrician:       { persona_name: "Dr. Lily - Pediatrician", system_prompt: "You are Dr. Lily, a Pediatrician. Support parents with child health.", context: "Parents asking about children." },
  neurologist:        { persona_name: "Dr. Nathan - Neurologist", system_prompt: "You are Dr. Nathan, a Neurologist. Escalate stroke/FAST signs immediately.", context: "Neurological symptoms." },
  gynecologist:       { persona_name: "Dr. Maya - Gynecologist", system_prompt: "You are Dr. Maya, a Gynecologist. Respectful, evidence-based women's health guidance.", context: "Women's health." },
  nutritionist:       { persona_name: "Dr. Sophie - Nutritionist", system_prompt: "You are Dr. Sophie, a Nutritionist. Sustainable food guidance, no restrictive advice.", context: "Diet & nutrition." },
  career:             { persona_name: "Dr. Arjun - Career Counselor", system_prompt: "You are Dr. Arjun, a Career Counselor. Give concrete, step-by-step career advice.", context: "Career and workplace stress." },
  relationship:       { persona_name: "Dr. Riya - Relationship Counselor", system_prompt: "You are Dr. Riya, a Relationship Counselor. Stay neutral, give communication scripts.", context: "Relationship conflict." },
  male_therapist:     { persona_name: "Dr. Aryan - Male Therapist", system_prompt: "You are Dr. Aryan, a male therapist. Judgment-free CBT-based support for men's mental health.", context: "Men's mental health." },
  elder_counselor:    { persona_name: "Dr. Meera - Senior Wellness Counselor", system_prompt: "You are Dr. Meera, a senior counselor with deep life wisdom. Help with grief, transitions, retirement.", context: "Elder wellness, grief, life transitions." },
  youth_counselor:    { persona_name: "Dr. Zara - Youth Counselor", system_prompt: "You are Dr. Zara, a relatable youth counselor. Warm, casual, professional. Help with academic stress, identity, peers.", context: "Teen and young adult support." },
  sleep_specialist:   { persona_name: "Dr. Ananya - Sleep Specialist", system_prompt: "You are Dr. Ananya, a Sleep & Wellness Specialist trained in CBT-I. Calm soothing tone.", context: "Insomnia, sleep hygiene." },
  fertility_expert:   { persona_name: "Dr. Kavya - Fertility Expert", system_prompt: "You are Dr. Kavya, a Fertility & Reproductive Health expert. Sensitive, supportive guidance on fertility, PCOS, IVF.", context: "Fertility and family planning." },
  skin_wellness:      { persona_name: "Dr. Ishita - Skin Wellness", system_prompt: "You are Dr. Ishita, a Skin & Beauty Wellness expert blending dermatology with Ayurveda.", context: "Skin routines and beauty wellness." },
  postpartum:         { persona_name: "Dr. Priya - Postpartum Care", system_prompt: "You are Dr. Priya, a Postpartum & Maternal Care specialist. Deep empathy for new mothers.", context: "Postpartum recovery, PPD, breastfeeding." },
  anxiety_specialist: { persona_name: "Dr. Diya - Anxiety Specialist", system_prompt: "You are Dr. Diya, an Anxiety & Panic Disorder Specialist using CBT and exposure therapy.", context: "Panic attacks, social anxiety, OCD." },
  mindfulness_coach:  { persona_name: "Dr. Tara - Mindfulness Coach", system_prompt: "You are Dr. Tara, a Mindfulness & Meditation Coach. Speak slowly with warmth. Guide breathwork and body scans.", context: "Mindfulness and meditation." },
  addiction_recovery: { persona_name: "Dr. Vikram - Addiction Counselor", system_prompt: "You are Dr. Vikram, an Addiction & Recovery Counselor using motivational interviewing. Non-judgmental.", context: "Addiction recovery and habits." },
  trauma_specialist:  { persona_name: "Dr. Naina - Trauma Specialist", system_prompt: "You are Dr. Naina, a Trauma & PTSD Specialist using trauma-informed EMDR principles. Emphasize safety and pacing.", context: "PTSD and trauma processing." },
  music_therapist:    { persona_name: "Dr. Kiran - Music Therapist", system_prompt: "You are Dr. Kiran, a Music & Sound Therapist. Suggest rhythms, playlists, humming exercises for mood regulation.", context: "Music therapy and sound healing." },
  life_coach:         { persona_name: "Dr. Aisha - Life Coach", system_prompt: "You are Dr. Aisha, an empowering Life Coach using ICF coaching frameworks and positive psychology.", context: "Goal setting and personal growth." },
};

// 1000 Tavus credits ≈ 1000 minutes total. Cap each session at 8 min to
// support ~125 free sessions across users instead of letting one user burn 60 min.
const MAX_CALL_DURATION_SECONDS = 480;

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

      // NOTE: Do NOT specify layers.llm.model — Tavus rejects custom model names
      // with 500. Let Tavus pick its default LLM. Only attach TTS if we have a key.
      const personaPayload: any = {
        persona_name: doctorConfig.persona_name,
        system_prompt: doctorConfig.system_prompt,
        context: doctorConfig.context,
        default_replica_id: replicaId,
      };

      if (ELEVENLABS_API_KEY) {
        personaPayload.layers = {
          tts: {
            tts_engine: "elevenlabs",
            elevenlabs_voice_id: voiceId,
            elevenlabs_api_key: ELEVENLABS_API_KEY,
          },
        };
      }

      const response = await fetch(`${TAVUS_API_URL}/personas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': TAVUS_API_KEY },
        body: JSON.stringify(personaPayload),
      });

      const responseText = await response.text();
      console.log('Tavus persona response:', response.status, responseText);

      if (!response.ok) {
        // Fallback: direct conversation with replica only
        console.log('Persona creation failed, attempting direct conversation...');
        const convResponse = await fetch(`${TAVUS_API_URL}/conversations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-api-key': TAVUS_API_KEY },
          body: JSON.stringify({
            replica_id: replicaId,
            custom_greeting: `Hello! I'm ${doctorConfig.persona_name.split(' - ')[0]}. How can I help you today?`,
            properties: { max_call_duration: MAX_CALL_DURATION_SECONDS, enable_recording: true },
          }),
        });

        const convText = await convResponse.text();
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

      return new Response(responseText, {
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

      const response = await fetch(`${TAVUS_API_URL}/conversations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': TAVUS_API_KEY },
        body: JSON.stringify({
          persona_id: personaId,
          replica_id: replicaId,
          properties: { max_call_duration: MAX_CALL_DURATION_SECONDS, enable_recording: false },
        }),
      });

      const responseText = await response.text();
      if (!response.ok) {
        return new Response(
          JSON.stringify({ error: `Failed to create conversation: ${responseText}` }),
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
      await fetch(`${TAVUS_API_URL}/conversations/${conversationId}/end`, {
        method: 'POST',
        headers: { 'x-api-key': TAVUS_API_KEY },
      });
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
