// Verifies a logged-in user against active B2B gateways and consumes a seat.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ANON = Deno.env.get("SUPABASE_ANON_KEY")!;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    if (!authHeader.startsWith("Bearer ")) return json({ authorized: false, mode: "no_auth" }, 200);
    const userClient = createClient(SUPABASE_URL, ANON, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData } = await userClient.auth.getUser();
    const user = userData?.user;
    if (!user?.email) return json({ authorized: false, mode: "no_user" }, 200);

    const { passcode } = await req.json().catch(() => ({}));
    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

    // Already linked?
    const { data: profile } = await admin
      .from("profiles")
      .select("b2b_account_id")
      .eq("user_id", user.id)
      .maybeSingle();
    if (profile?.b2b_account_id) {
      const { data: acc } = await admin
        .from("b2b_accounts")
        .select("id, is_active, contract_end")
        .eq("id", profile.b2b_account_id)
        .maybeSingle();
      const active = acc?.is_active && new Date(acc.contract_end) > new Date();
      return json({ authorized: !!active, mode: active ? "premium" : "expired", accountId: profile.b2b_account_id }, 200);
    }

    // 1) domain match
    const domain = user.email.split("@")[1]?.toLowerCase().trim();
    let { data: gateway } = await admin
      .from("b2b_gateways")
      .select("account_id, b2b_accounts!inner(id,is_active,contract_end,seats_consumed,max_seats)")
      .eq("auth_strategy", "domain_match")
      .eq("target_domain", domain)
      .maybeSingle();

    // 2) passcode fallback
    if (!gateway && passcode) {
      const res = await admin
        .from("b2b_gateways")
        .select("account_id, b2b_accounts!inner(id,is_active,contract_end,seats_consumed,max_seats)")
        .eq("auth_strategy", "secure_passcode")
        .eq("secure_passcode", String(passcode).toUpperCase().trim())
        .maybeSingle();
      gateway = res.data;
    }

    // deno-lint-ignore no-explicit-any
    const acc: any = (gateway as any)?.b2b_accounts;
    if (!gateway || !acc) return json({ authorized: false, mode: "b2c" }, 200);
    if (!acc.is_active || new Date(acc.contract_end) <= new Date())
      return json({ authorized: false, mode: "expired" }, 200);
    if (acc.seats_consumed >= acc.max_seats)
      return json({ authorized: false, mode: "seat_limit_exceeded" }, 200);

    const { data: ok } = await admin.rpc("b2b_increment_seat", { _account_id: acc.id });
    if (!ok) return json({ authorized: false, mode: "seat_limit_exceeded" }, 200);

    await admin.from("profiles").update({ b2b_account_id: acc.id }).eq("user_id", user.id);
    return json({ authorized: true, mode: "premium", accountId: acc.id }, 200);
  } catch (e) {
    return json({ authorized: false, error: e instanceof Error ? e.message : "unknown" }, 200);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
