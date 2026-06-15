// Issues an ElevenLabs Conversational AI WebRTC token (preferred) and signed URL (fallback)
// for the WellMindAI phone counselor. Default agent = Dr. Aria; override with body.agentId.
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

    // Prefer WebRTC token (more stable, fewer drops than WebSocket).
    const tokenRes = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/token?agent_id=${agentId}`,
      { headers: { 'xi-api-key': apiKey } },
    );

    if (tokenRes.ok) {
      const { token } = await tokenRes.json();
      return new Response(JSON.stringify({ token, agentId, connectionType: 'webrtc' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    // Fallback to signed URL (WebSocket) if token endpoint refuses.
    const sigRes = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${agentId}`,
      { headers: { 'xi-api-key': apiKey } },
    );

    if (!sigRes.ok) {
      const text = await sigRes.text();
      return new Response(JSON.stringify({ error: `ElevenLabs: ${sigRes.status} ${text}` }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { signed_url } = await sigRes.json();
    return new Response(JSON.stringify({ signedUrl: signed_url, agentId, connectionType: 'websocket' }), {
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
