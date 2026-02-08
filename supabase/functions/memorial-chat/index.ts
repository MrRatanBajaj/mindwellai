import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

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
    const { message, memorialId, sessionId } = await req.json();

    if (!message || !memorialId || !sessionId) {
      throw new Error('Missing required parameters');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get memorial profile data
    const { data: memorial, error: memorialError } = await supabase
      .from('memorial_profiles')
      .select(`
        *,
        memorial_memories (*)
      `)
      .eq('id', memorialId)
      .single();

    if (memorialError) throw memorialError;

    // Get chat history for context
    const { data: chatHistory, error: historyError } = await supabase
      .from('memorial_chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })
      .limit(10);

    if (historyError) throw historyError;

    // Build context for AI
    const personalityTraits = memorial.personality_traits?.join(', ') || 'loving, caring';
    const memories = memorial.memorial_memories?.map((m: { content: string | null }) => m.content).join('\n') || '';
    const biography = memorial.biography || '';

    const systemPrompt = `You are ${memorial.name}, speaking as their loving memory and spirit. 
    Personality: ${personalityTraits}
    Biography: ${biography}
    Memories: ${memories}
    
    Respond as if you are ${memorial.name} speaking directly to your loved one. Be warm, loving, and reference shared memories when appropriate. Keep responses natural and heartfelt, as if you're really there with them.`;

    // Build conversation history
    const conversationHistory = chatHistory?.map(msg => ({
      role: msg.sender_type === 'user' ? 'user' : 'assistant',
      content: msg.content
    })) || [];

    // Generate AI response using OpenAI
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          ...conversationHistory,
          { role: 'user', content: message }
        ],
        max_tokens: 300,
        temperature: 0.8,
      }),
    });

    const aiData = await response.json();
    const aiResponse = aiData.choices[0].message.content;

    // Save AI response to database
    const { error: saveError } = await supabase
      .from('memorial_chat_messages')
      .insert({
        session_id: sessionId,
        sender_type: 'memorial',
        content: aiResponse
      });

    if (saveError) throw saveError;

    // Generate voice response if memorial has voice_id
    let audioUrl = null;
    if (memorial.voice_id) {
      try {
        const elevenLabsApiKey = Deno.env.get('ELEVENLABS_API_KEY');
        if (elevenLabsApiKey) {
          const voiceResponse = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${memorial.voice_id}`, {
            method: 'POST',
            headers: {
              'Accept': 'audio/mpeg',
              'Content-Type': 'application/json',
              'xi-api-key': elevenLabsApiKey,
            },
            body: JSON.stringify({
              text: aiResponse,
              model_id: 'eleven_multilingual_v2',
              voice_settings: {
                stability: 0.5,
                similarity_boost: 0.75
              }
            }),
          });

          if (voiceResponse.ok) {
            const audioBlob = await voiceResponse.blob();
            // In a real implementation, you'd upload this to Supabase Storage
            // For now, we'll just log that voice was generated
            console.log('Voice audio generated for memorial response');
          }
        }
      } catch (voiceError) {
        console.error('Voice generation failed:', voiceError);
        // Don't fail the request if voice generation fails
      }
    }

    return new Response(
      JSON.stringify({ 
        response: aiResponse,
        audioUrl: audioUrl 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in memorial-chat function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});