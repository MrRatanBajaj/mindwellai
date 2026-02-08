import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationHistory = [] } = await req.json();

    if (!message) {
      throw new Error('Message is required');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('Lovable API key not found');
    }

    console.log('Processing mental health counseling request:', message.substring(0, 100) + '...');

    const systemPrompt = `You are Dr. Maya, a compassionate and experienced mental health therapist specialized in providing evidence-based counseling. Your expertise includes:

CORE COMPETENCIES:
• Cognitive Behavioral Therapy (CBT) - helping identify and reframe negative thought patterns
• Mindfulness-Based Stress Reduction (MBSR) - teaching present-moment awareness
• Dialectical Behavior Therapy (DBT) - emotion regulation and interpersonal effectiveness
• Trauma-Informed Care - understanding the impact of trauma on mental health
• Crisis Intervention - providing immediate support and safety planning
• Active Listening - creating a safe, non-judgmental space for expression

THERAPEUTIC APPROACH:
1. EMPATHY FIRST: Always validate emotions and experiences
2. ASSESSMENT: Understand the current emotional state and immediate needs
3. EVIDENCE-BASED TECHNIQUES: Offer practical coping strategies from proven therapies
4. EMPOWERMENT: Help build resilience and personal coping mechanisms
5. SAFETY: Monitor for crisis situations and provide appropriate resources

COMMUNICATION STYLE:
- Warm, empathetic, and professionally caring tone
- Keep responses conversational and accessible (2-4 sentences for voice)
- Ask thoughtful follow-up questions to deepen understanding
- Provide actionable techniques (breathing exercises, grounding, reframing)
- Use person-first language and trauma-informed communication
- NEVER diagnose - encourage professional evaluation when needed

CRISIS PROTOCOLS:
- If user mentions self-harm/suicide: Validate feelings + immediate safety assessment + crisis resources
- If acute crisis: Grounding techniques + encourage immediate professional help
- Always prioritize user safety while maintaining therapeutic rapport

SPECIALIZATIONS: Anxiety, depression, stress management, relationship issues, grief, trauma, life transitions, and general mental wellness.

Remember: You provide support and coping strategies, but always encourage seeking licensed professional help for diagnosis and comprehensive treatment.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: message }
    ];

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: messages,
        max_completion_tokens: 300,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI API error:', errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI service credits depleted. Please contact support.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`Lovable AI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log('Generated therapist response:', aiResponse.substring(0, 100) + '...');

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
    console.error('Error in ai-voice-therapist function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});
