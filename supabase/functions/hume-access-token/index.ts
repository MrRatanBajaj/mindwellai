// Mints a short-lived Hume EVI access token for the browser client.
// Browser uses this token (not the API key) to open the EVI WebSocket.
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const apiKey = Deno.env.get("HUME_API_KEY");
    const secretKey = Deno.env.get("HUME_SECRET_KEY");
    const configId = Deno.env.get("HUME_EVI_CONFIG_ID") ?? null;
    if (!apiKey || !secretKey) {
      return new Response(JSON.stringify({ error: "Hume keys not configured" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const basic = btoa(`${apiKey}:${secretKey}`);
    const tokenRes = await fetch("https://api.hume.ai/oauth2-cc/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });
    if (!tokenRes.ok) {
      const txt = await tokenRes.text();
      return new Response(JSON.stringify({ error: `Hume auth failed: ${txt}` }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const data = await tokenRes.json();
    return new Response(JSON.stringify({ accessToken: data.access_token, configId }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "unknown" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
