import { createClient } from "npm:@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};
const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { ...cors, "Content-Type": "application/json" } });

/** Saves guest (no-login) chat therapy sessions so they are never lost or "anonymous". */
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  try {
    const b = await req.json().catch(() => null);
    const token = typeof b?.sessionToken === "string" ? b.sessionToken.slice(0, 80) : "";
    if (!/^[a-zA-Z0-9_-]{8,80}$/.test(token)) return json({ error: "bad session" }, 400);
    const msgs = Array.isArray(b?.messages) ? b.messages.slice(-200) : [];
    const clean = msgs
      .filter((m: any) => m && typeof m.content === "string")
      .map((m: any) => ({ sender: m.sender === "user" ? "user" : "ai", content: m.content.slice(0, 4000), ts: Number(m.ts) || Date.now() }));
    const str = (v: unknown, n = 200) => (typeof v === "string" && v.trim() ? v.trim().slice(0, n) : null);

    const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const row: Record<string, unknown> = {
      session_token: token,
      messages: clean,
      intent: str(b?.intent, 300) ?? JSON.stringify({
        visitor_id: str(b?.visitorId, 80),
        user_id: str(b?.userId, 80),
        lang: str(b?.lang, 20),
        page: str(b?.page, 200),
        referrer: str(b?.referrer, 300),
        utm: str(b?.utm, 300),
        device: str(req.headers.get("user-agent"), 300),
        country: req.headers.get("cf-ipcountry"),
      }),
      updated_at: new Date().toISOString(),
    };
    const name = str(b?.name, 100), email = str(b?.email, 200), phone = str(b?.phone, 30);
    if (name) row.visitor_name = name;
    if (email) row.visitor_email = email;
    if (phone) row.visitor_phone = phone;

    const { data: existing } = await sb.from("inbound_chat_sessions").select("id").eq("session_token", token).maybeSingle();
    const { error } = existing
      ? await sb.from("inbound_chat_sessions").update(row).eq("id", existing.id)
      : await sb.from("inbound_chat_sessions").insert(row);
    if (error) {
      console.error("save failed", error);
      return json({ error: error.message }, 500);
    }
    return json({ ok: true });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "error" }, 500);
  }
});
