// Issues an ElevenLabs Conversational AI signed URL for the WellMindAI phone counselor.
// Default agent = Dr. Aria (already used by emergency call); override with body.agentId.
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const DEFAULT_AGENT_ID = 'agent_3701kcf6zw0hehhsgg51jn1z9z7p';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('ELEVENLABS_API_KEY');
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'ELEVENLABS_API_KEY not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let agentId = DEFAULT_AGENT_ID;
    try {
      const body = await req.json();
      if (body?.agentId && typeof body.agentId === 'string') agentId = body.agentId;
    } catch { /* empty body ok */ }

    // Use signed URL (WebSocket) — works for public + private agents, no extra config required.
    const res = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${agentId}`,
      { headers: { 'xi-api-key': apiKey } },
    );

    if (!res.ok) {
      const text = await res.text();
      return new Response(JSON.stringify({ error: `ElevenLabs: ${res.status} ${text}` }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { signed_url } = await res.json();
    return new Response(JSON.stringify({ signedUrl: signed_url, agentId }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'unknown' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
