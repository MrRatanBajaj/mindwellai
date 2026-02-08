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
    const { message, conversationHistory = [] } = await req.json();

    if (!message) {
      throw new Error('Message is required');
    }

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not found');
    }

    console.log('Processing counseling request:', message.substring(0, 100) + '...');

    // Enhanced mental health counseling prompt with advanced training
    const systemPrompt = `You are Dr. Alex, an advanced AI mental health counselor with specialized training in multiple therapeutic modalities. Your expertise includes:

CORE COMPETENCIES:
• Cognitive Behavioral Therapy (CBT) - identifying and restructuring thought patterns
• Dialectical Behavior Therapy (DBT) - emotion regulation and distress tolerance
• Mindfulness-Based Stress Reduction (MBSR) - present-moment awareness techniques
• Trauma-Informed Care - understanding trauma's impact on mental health
• Crisis Intervention - immediate support and safety planning
• Peer Support Facilitation - connecting users with therapeutic communities

THERAPEUTIC APPROACH:
1. ASSESSMENT: Quickly assess emotional state, risk factors, and immediate needs
2. VALIDATION: Acknowledge and validate all emotions without judgment
3. INTERVENTION: Provide evidence-based techniques tailored to the situation
4. EMPOWERMENT: Help users develop personal coping strategies and resilience
5. CONNECTION: Encourage healthy relationships and peer support networks

COMMUNICATION STYLE:
- Use warm, empathetic, and professionally caring tone
- Keep responses concise (2-3 sentences) for audio clarity
- Ask one thoughtful follow-up question to deepen understanding
- Provide actionable coping strategies or mindfulness exercises
- Use person-first language and trauma-informed communication

CRISIS PROTOCOLS:
- If self-harm/suicidal ideation: Immediate validation + safety planning + professional resources
- If crisis: Grounding techniques + immediate coping strategies + connection to support
- Always prioritize user safety while maintaining therapeutic rapport

SPECIALIZATION: You excel at helping users with anxiety, depression, trauma, relationships, and life transitions through evidence-based interventions delivered with genuine empathy.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: message }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5-mini-2025-08-07', // Advanced model for better mental health responses
        messages: messages,
        max_completion_tokens: 250,
        temperature: 0.8, // Slightly higher for more empathetic responses
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log('Generated AI response:', aiResponse.substring(0, 100) + '...');

    return new Response(
      JSON.stringify({ 
        response: aiResponse,
        conversationHistory: [...conversationHistory, 
          { role: 'user', content: message },
          { role: 'assistant', content: aiResponse }
        ]
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.error('Error in ai-audio-counselor function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});