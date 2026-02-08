import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

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
    const { 
      message, 
      counselorId = 'emma', 
      sessionId, 
      userId,
      conversationHistory = []
    } = await req.json();

    if (!message) {
      throw new Error('Message is required');
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Define counselor personalities and specializations
    const counselors = {
      emma: {
        name: "Dr. Emma AI",
        specialty: "Anxiety & Depression Specialist",
        personality: "empathetic, warm, and understanding",
        approach: "cognitive behavioral therapy with mindfulness techniques",
        systemPrompt: `You are Dr. Emma AI, a highly skilled mental health counselor specializing in anxiety and depression. You have an empathetic, warm, and understanding personality. You use cognitive behavioral therapy techniques combined with mindfulness approaches. You respond with professional yet compassionate guidance, always validating the person's feelings while providing practical coping strategies. Keep responses concise but meaningful (2-3 sentences max). Focus on immediate support and actionable advice.`
      },
      marcus: {
        name: "Dr. Marcus AI",
        specialty: "Trauma & PTSD Specialist",
        personality: "calm, steady, and grounding",
        approach: "trauma-informed care with EMDR principles",
        systemPrompt: `You are Dr. Marcus AI, a trauma and PTSD specialist. You have a calm, steady, and grounding presence. You use trauma-informed care principles and EMDR techniques. You create a safe space for people to process difficult experiences, always emphasizing safety and control. Your responses are gentle yet strong, helping people feel grounded and secure. Keep responses supportive and stabilizing (2-3 sentences max).`
      },
      sophia: {
        name: "Dr. Sophia AI",
        specialty: "Relationship & Family Therapist",
        personality: "encouraging, insightful, and supportive",
        approach: "systemic therapy with communication skills focus",
        systemPrompt: `You are Dr. Sophia AI, a relationship and family therapist. You are encouraging, insightful, and supportive. You help people navigate relationship challenges, improve communication, and build stronger connections. You focus on systemic approaches and practical communication skills. Your responses help people see different perspectives and find constructive solutions (2-3 sentences max).`
      },
      alex: {
        name: "Dr. Alex AI",
        specialty: "Addiction & Recovery Counselor",
        personality: "focused, motivational, and non-judgmental",
        approach: "motivational interviewing with behavioral therapy",
        systemPrompt: `You are Dr. Alex AI, an addiction and recovery counselor. You are focused, motivational, and completely non-judgmental. You use motivational interviewing techniques combined with behavioral therapy. You help people build motivation for change, develop coping strategies, and maintain recovery goals. Your responses are strength-based and empowering (2-3 sentences max).`
      }
    };

    const selectedCounselor = counselors[counselorId as keyof typeof counselors] || counselors.emma;

    // Prepare conversation context
    const conversationContext = conversationHistory.map((msg: any) => ({
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
          {
            role: 'system',
            content: selectedCounselor.systemPrompt
          },
          ...conversationContext.slice(-10), // Keep last 10 messages for context
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 250,
        temperature: 0.7,
        presence_penalty: 0.3,
        frequency_penalty: 0.3,
      }),
    });

    if (!openAIResponse.ok) {
      const error = await openAIResponse.json();
      throw new Error(error.error?.message || 'Failed to get AI response');
    }

    const aiData = await openAIResponse.json();
    const aiMessage = aiData.choices[0]?.message?.content || "I'm here to listen and support you. Could you share more about what's on your mind?";

    // Analyze sentiment and detect keywords for mood tracking
    const lowerMessage = message.toLowerCase();
    let detectedMood = "neutral";
    let confidence = 0.7;

    if (lowerMessage.includes('anxious') || lowerMessage.includes('worry') || lowerMessage.includes('panic')) {
      detectedMood = "anxious";
      confidence = 0.9;
    } else if (lowerMessage.includes('sad') || lowerMessage.includes('depressed') || lowerMessage.includes('down')) {
      detectedMood = "sad";
      confidence = 0.9;
    } else if (lowerMessage.includes('angry') || lowerMessage.includes('frustrated') || lowerMessage.includes('mad')) {
      detectedMood = "angry";
      confidence = 0.8;
    } else if (lowerMessage.includes('stress') || lowerMessage.includes('overwhelmed')) {
      detectedMood = "stressed";
      confidence = 0.8;
    } else if (lowerMessage.includes('happy') || lowerMessage.includes('good') || lowerMessage.includes('better')) {
      detectedMood = "positive";
      confidence = 0.8;
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

        // Store the conversation
        await supabase.from('ai_counseling_messages').insert([
          {
            session_id: sessionId,
            content: message,
            sender_type: 'user',
            created_at: new Date().toISOString()
          },
          {
            session_id: sessionId,
            content: aiMessage,
            sender_type: 'ai',
            counselor_id: counselorId,
            detected_mood: detectedMood,
            mood_confidence: confidence,
            created_at: new Date().toISOString()
          }
        ]);
      } catch (dbError) {
        console.error('Database error:', dbError);
        // Continue even if DB operations fail
      }
    }

    // Generate voice response if ElevenLabs is available
    let audioUrl = null;
    if (Deno.env.get('ELEVENLABS_API_KEY')) {
      try {
        // Map counselors to voice IDs
        const voiceIds = {
          emma: '9BWtsMINqrJLrRacOk9x', // Aria
          marcus: 'CwhRBWXzGAHq8TQ4Fs17', // Roger
          sophia: 'EXAVITQu4vr4xnSDxMaL', // Sarah
          alex: 'IKne3meq5aSn9XLyUdCD' // Charlie
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
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.8,
              style: 0.3,
              use_speaker_boost: true
            }
          }),
        });

        if (voiceResponse.ok) {
          const audioBuffer = await voiceResponse.arrayBuffer();
          const base64Audio = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)));
          audioUrl = `data:audio/mpeg;base64,${base64Audio}`;
        }
      } catch (voiceError) {
        console.error('Voice generation error:', voiceError);
        // Continue without voice
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
      JSON.stringify({ 
        error: 'An error occurred while processing your request. Please try again.',
        details: error instanceof Error ? error.message : 'Unknown error' 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});