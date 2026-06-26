// Returns the Soul Machines Workforce embed URL for a counselor.
// The PERSONA env vars should hold the full shareable URL from
// https://workforce.soulmachines.com/dashboard/agents → "Share" → copy link.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const { counselor } = await req.json().catch(() => ({}));
    const yaro = Deno.env.get("SOULMACHINES_YARO_PERSONA") ?? "";
    const ava = Deno.env.get("SOULMACHINES_AVA_PERSONA") ?? "";
    const url = counselor === "yaro" ? yaro : ava;
    if (!url) {
      return json({ error: "Soul Machines persona not configured. Paste the agent share URL into SOULMACHINES_YARO_PERSONA / SOULMACHINES_AVA_PERSONA." }, 200);
    }
    return json({ url }, 200);
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "unknown" }, 200);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
