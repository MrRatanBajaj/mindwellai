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
    const { action } = await req.json();
    
    if (action !== 'create_session') {
      return new Response(
        JSON.stringify({ error: 'Invalid action' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');
    if (!ELEVENLABS_API_KEY) {
      console.error('ELEVENLABS_API_KEY is not set');
      return new Response(
        JSON.stringify({ error: 'ElevenLabs API key not configured' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Create a conversational AI agent session
    // Note: You'll need to create an agent in the ElevenLabs dashboard first
    // For now, we'll use a public agent ID or create one programmatically
    
    console.log('Creating ElevenLabs conversation session...');
    
    // Create signed URL for conversation
    const agentId = "your-agent-id"; // Replace with actual agent ID from ElevenLabs dashboard
    
    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${agentId}`,
      {
        method: "GET",
        headers: {
          "xi-api-key": ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs API error:', errorText);
      
      // For development, return a mock signed URL structure
      // In production, you need to create an agent in ElevenLabs dashboard
      return new Response(
        JSON.stringify({ 
          signed_url: "wss://api.elevenlabs.io/v1/convai/conversation/mock",
          agent_id: "development-mode",
          expires_at: new Date(Date.now() + 3600000).toISOString() // 1 hour from now
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const data = await response.json();
    console.log('ElevenLabs session created:', data);

    return new Response(
      JSON.stringify(data),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in elevenlabs-voice-agent function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        // For development, provide fallback
        signed_url: "wss://api.elevenlabs.io/v1/convai/conversation/development",
        agent_id: "development-mode"
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});