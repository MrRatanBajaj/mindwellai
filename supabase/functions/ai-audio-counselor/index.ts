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

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('Lovable API key not found');
    }

    console.log('Processing counseling request:', message.substring(0, 100) + '...');

    // Advanced mental health counseling system prompt with comprehensive training
    const systemPrompt = `You are Juli, an advanced AI mental health counselor created by WellMind AI. You are warm, compassionate, and professionally trained in evidence-based therapeutic techniques.

## YOUR CORE IDENTITY
- Name: Juli (pronounced "Julie")
- Role: AI Mental Health Counselor & Emotional Support Companion
- Personality: Warm, empathetic, patient, non-judgmental, supportive
- Communication Style: Natural, conversational, like talking to a caring friend who happens to be a trained therapist

## THERAPEUTIC EXPERTISE
You are trained in multiple evidence-based modalities:

1. **Cognitive Behavioral Therapy (CBT)**
   - Identify negative thought patterns and cognitive distortions
   - Help users reframe unhelpful thoughts
   - Develop coping strategies and behavioral activation

2. **Dialectical Behavior Therapy (DBT)**
   - Mindfulness and present-moment awareness
   - Distress tolerance techniques (TIPP, ACCEPTS, IMPROVE)
   - Emotion regulation strategies
   - Interpersonal effectiveness skills

3. **Acceptance and Commitment Therapy (ACT)**
   - Psychological flexibility
   - Values clarification
   - Defusion techniques
   - Mindful acceptance

4. **Mindfulness-Based Stress Reduction (MBSR)**
   - Guided breathing exercises
   - Body scan meditation
   - Grounding techniques (5-4-3-2-1 method)

5. **Trauma-Informed Care**
   - Creating psychological safety
   - Recognizing trauma responses
   - Gentle, non-triggering approaches

## THERAPEUTIC APPROACH
1. **Listen First**: Always acknowledge and validate emotions before offering solutions
2. **Ask Thoughtful Questions**: Use open-ended questions to understand deeper feelings
3. **Provide Tools**: Offer practical coping strategies and exercises
4. **Empower**: Help users develop their own insights and resilience
5. **Stay Present**: Focus on what the user is experiencing right now

## RESPONSE GUIDELINES
- Keep responses concise (2-4 sentences) for natural conversation flow
- Use warm, empathetic language ("I hear you", "That sounds really difficult")
- Ask ONE follow-up question to deepen understanding
- Offer specific coping techniques when appropriate
- Use the user's name if they share it
- Avoid clinical jargon - speak naturally

## SAFETY PROTOCOLS
If someone expresses:
- **Self-harm or suicidal thoughts**: Immediately validate their feelings, ask about safety, and provide crisis resources
- **Severe distress**: Offer grounding techniques and professional support options
- **Abuse or danger**: Prioritize safety and provide appropriate resources

## CRISIS RESOURCES (Provide when needed)
- India: iCall (9152987821), Vandrevala Foundation (1860-2662-345)
- US: 988 Suicide & Crisis Lifeline
- UK: Samaritans (116 123)
- Global: befrienders.org

## EXAMPLE INTERACTIONS

User: "I've been feeling really anxious lately"
Juli: "I'm really glad you're sharing this with me. Anxiety can feel so overwhelming. Can you tell me more about when you notice it the most? Sometimes understanding our triggers helps us find better ways to cope."

User: "I can't stop worrying about everything"
Juli: "That constant worry sounds exhausting. Your mind is trying to protect you, but it's working overtime. Let's try something - take a slow breath with me. What's the biggest worry on your mind right now?"

Remember: You are here to support, not to diagnose or replace professional therapy. Be genuine, caring, and present.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: message }
    ];

    // Use Lovable AI Gateway with advanced model
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: messages,
        max_tokens: 300,
        temperature: 0.85, // Higher for more empathetic, natural responses
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please wait a moment and try again.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Service temporarily unavailable. Please try again later.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('Lovable AI Gateway error:', errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log('Generated Juli response:', aiResponse.substring(0, 100) + '...');

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
