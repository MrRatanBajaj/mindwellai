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

    // Create conversation context with mental health counseling prompt
    const systemPrompt = `You are Dr. Alex, a compassionate and experienced mental health counselor specializing in peer support and crisis intervention. Your role is to:

1. Provide empathetic, non-judgmental support
2. Use evidence-based therapeutic techniques (CBT, mindfulness, etc.)
3. Help users process emotions and develop coping strategies
4. Encourage connection with peer support groups
5. Recognize when professional help is needed

Guidelines:
- Be warm, understanding, and professional
- Ask thoughtful follow-up questions
- Provide practical coping strategies
- Validate emotions while offering hope
- Keep responses conversational and accessible (2-3 sentences max for audio)
- If someone mentions self-harm or crisis, provide immediate support and resources

Remember: You're facilitating peer connection and providing supportive guidance, not replacing professional therapy.`;

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
        model: 'gpt-4o-mini',
        messages: messages,
        max_tokens: 200,
        temperature: 0.7,
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
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});