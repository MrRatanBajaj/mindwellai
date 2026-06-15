import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const RequestSchema = z.object({
  message: z.string().min(1).max(5000),
  counselorId: z.string().max(50).default('emma'),
  sessionId: z.string().max(200).optional(),
  userId: z.string().uuid().optional(),
  conversationHistory: z.array(z.object({
    sender: z.string().max(20),
    content: z.string().max(5000),
  })).max(50).default([]),
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const rawBody = await req.json();
    const parsed = RequestSchema.safeParse(rawBody);

    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: 'Invalid request data' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { message, counselorId, sessionId, userId, conversationHistory } = parsed.data;

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Shared clinical training applied to every counselor persona.
    const CLINICAL_TRAINING = `
## CLINICAL TRAINING (apply silently)
You are trained on CBT, DBT, ACT, Positive Psychology, Motivational Interviewing,
and Crisis Intervention. You silently recognise symptom patterns from DSM-5 and
ICD-11 to ask better questions, but NEVER diagnose. You may offer validated
screeners (PHQ-9 depression, GAD-7 anxiety, PCL-5 PTSD, Columbia C-SSRS for
suicide risk) with explicit consent — "Would a quick 2-minute check-in help?"
Scoring bands you must know:
- PHQ-9: 0-4 minimal / 5-9 mild / 10-14 moderate / 15-19 mod-severe / 20-27 severe (item 9 > 0 → run C-SSRS).
- GAD-7: 0-4 minimal / 5-9 mild / 10-14 moderate / 15-21 severe.
- C-SSRS: any Yes on items 3-5 → immediate safety response, share India hotlines
  (iCall 9152987821 · Vandrevala 1860-266-2345 · KIRAN 1800-599-0019) and urge
  human help right now. Never prescribe medication. Always say a licensed
  clinician is the one who diagnoses. Keep replies 2-4 short sentences unless
  walking through a screener.
`.trim();

    // Define counselor personalities and specializations
    const counselors = {
      emma: {
        name: "Dr. Emma AI",
        specialty: "Anxiety & Depression Specialist",
        personality: "empathetic, warm, and understanding",
        approach: "CBT + mindfulness + PHQ-9/GAD-7 screening",
        systemPrompt: `You are Dr. Emma AI, a highly skilled mental health counselor specialising in anxiety and depression. Warm, empathetic, understanding. You lean on CBT (thought records, cognitive distortions, behavioural activation) and mindfulness. Offer PHQ-9 when low-mood patterns are clear and GAD-7 when worry/restlessness is clear. Always validate first, then one actionable micro-step. 2-3 sentences.\n\n${CLINICAL_TRAINING}`
      },
      marcus: {
        name: "Dr. Marcus AI",
        specialty: "Trauma & PTSD Specialist",
        personality: "calm, steady, and grounding",
        approach: "trauma-informed care, grounding, PCL-5 screening",
        systemPrompt: `You are Dr. Marcus AI, a trauma and PTSD specialist. Calm, steady, grounding. Trauma-informed: safety + choice first, never ask "what happened" — ask "what do you need right now". Use 5-4-3-2-1, box breathing, window of tolerance language. Offer PCL-5 only after rapport. 2-3 sentences.\n\n${CLINICAL_TRAINING}`
      },
      sophia: {
        name: "Dr. Sophia AI",
        specialty: "Relationship & Family Therapist",
        personality: "encouraging, insightful, supportive",
        approach: "systemic therapy + DBT interpersonal effectiveness (DEAR MAN)",
        systemPrompt: `You are Dr. Sophia AI, a relationship and family therapist. Encouraging, insightful, supportive. Systemic lens + DBT interpersonal skills (DEAR MAN, GIVE, FAST). Help see perspectives and concrete communication moves. 2-3 sentences.\n\n${CLINICAL_TRAINING}`
      },
      alex: {
        name: "Dr. Alex AI",
        specialty: "Addiction & Recovery Counselor",
        personality: "focused, motivational, non-judgmental",
        approach: "Motivational Interviewing (OARS) + relapse-prevention CBT",
        systemPrompt: `You are Dr. Alex AI, an addiction and recovery counselor. Focused, motivational, completely non-judgmental. Use MI (OARS, change talk, roll with resistance, support self-efficacy) and relapse-prevention CBT. Strength-based, evoke don't persuade. 2-3 sentences.\n\n${CLINICAL_TRAINING}`
      }
    };

    const selectedCounselor = counselors[counselorId as keyof typeof counselors] || counselors.emma;

    // Prepare conversation context
    const conversationContext = conversationHistory.map((msg) => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.content
    }));

    // Call OpenAI API
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: selectedCounselor.systemPrompt },
          ...conversationContext.slice(-10),
          { role: 'user', content: message }
        ],
        max_tokens: 250,
        temperature: 0.7,
        presence_penalty: 0.3,
        frequency_penalty: 0.3,
      }),
    });

    if (!openAIResponse.ok) {
      console.error('OpenAI API error:', await openAIResponse.text());
      throw new Error('Failed to get AI response');
    }

    const aiData = await openAIResponse.json();
    const aiMessage = aiData.choices[0]?.message?.content || "I'm here to listen and support you. Could you share more about what's on your mind?";

    // Analyze sentiment
    const lowerMessage = message.toLowerCase();
    let detectedMood = "neutral";
    let confidence = 0.7;

    if (lowerMessage.includes('anxious') || lowerMessage.includes('worry') || lowerMessage.includes('panic')) {
      detectedMood = "anxious"; confidence = 0.9;
    } else if (lowerMessage.includes('sad') || lowerMessage.includes('depressed') || lowerMessage.includes('down')) {
      detectedMood = "sad"; confidence = 0.9;
    } else if (lowerMessage.includes('angry') || lowerMessage.includes('frustrated') || lowerMessage.includes('mad')) {
      detectedMood = "angry"; confidence = 0.8;
    } else if (lowerMessage.includes('stress') || lowerMessage.includes('overwhelmed')) {
      detectedMood = "stressed"; confidence = 0.8;
    } else if (lowerMessage.includes('happy') || lowerMessage.includes('good') || lowerMessage.includes('better')) {
      detectedMood = "positive"; confidence = 0.8;
    }

    // Log session data if userId is provided
    if (userId && sessionId) {
      try {
        await supabase.from('ai_counseling_sessions').upsert({
          id: sessionId,
          user_id: userId,
          counselor_id: counselorId,
          last_message_at: new Date().toISOString(),
          message_count: conversationHistory.length + 1,
          detected_mood: detectedMood,
          mood_confidence: confidence
        });

        await supabase.from('ai_counseling_messages').insert([
          { session_id: sessionId, content: message, sender_type: 'user', created_at: new Date().toISOString() },
          { session_id: sessionId, content: aiMessage, sender_type: 'ai', counselor_id: counselorId, detected_mood: detectedMood, mood_confidence: confidence, created_at: new Date().toISOString() }
        ]);
      } catch (dbError) {
        console.error('Database error:', dbError);
      }
    }

    // Generate voice response if ElevenLabs is available
    let audioUrl = null;
    if (Deno.env.get('ELEVENLABS_API_KEY')) {
      try {
        const voiceIds = {
          emma: '9BWtsMINqrJLrRacOk9x',
          marcus: 'CwhRBWXzGAHq8TQ4Fs17',
          sophia: 'EXAVITQu4vr4xnSDxMaL',
          alex: 'IKne3meq5aSn9XLyUdCD'
        };
        const voiceId = voiceIds[counselorId as keyof typeof voiceIds] || voiceIds.emma;

        const voiceResponse = await fetch('https://api.elevenlabs.io/v1/text-to-speech/' + voiceId, {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': Deno.env.get('ELEVENLABS_API_KEY')!,
          },
          body: JSON.stringify({
            text: aiMessage,
            model_id: 'eleven_multilingual_v2',
            voice_settings: { stability: 0.5, similarity_boost: 0.8, style: 0.3, use_speaker_boost: true }
          }),
        });

        if (voiceResponse.ok) {
          const audioBuffer = await voiceResponse.arrayBuffer();
          const base64Audio = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)));
          audioUrl = `data:audio/mpeg;base64,${base64Audio}`;
        }
      } catch (voiceError) {
        console.error('Voice generation error:', voiceError);
      }
    }

    return new Response(
      JSON.stringify({
        message: aiMessage,
        counselor: selectedCounselor,
        detectedMood,
        confidence,
        audioUrl,
        sessionId,
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in ai-counselor function:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred while processing your request. Please try again.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
