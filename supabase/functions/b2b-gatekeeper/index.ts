// B2B Gatekeeper — determines whether the caller has active B2B access
// (premium for free), expired (route to up-sell), or no B2B at all (b2c).
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
    if (!authHeader.startsWith("Bearer ")) {
      return json({ access: "none", reason: "no_auth" }, 200);
    }
    const userClient = createClient(SUPABASE_URL, ANON, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData } = await userClient.auth.getUser();
    const user = userData?.user;
    if (!user) return json({ access: "none", reason: "no_user" }, 200);

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

    // ---- 1) NEW b2b_accounts path (preferred) -------------------------------
    const { data: profile } = await admin
      .from("profiles")
      .select("company_id, b2b_account_id")
      .eq("user_id", user.id)
      .maybeSingle();

    let accountId = (profile as { b2b_account_id?: string } | null)?.b2b_account_id;

    // Auto-link via domain_match gateway if not already linked
    if (!accountId && user.email) {
      const domain = user.email.split("@")[1]?.toLowerCase();
      const { data: gw } = await admin
        .from("b2b_gateways")
        .select("account_id")
        .eq("auth_strategy", "domain_match")
        .eq("target_domain", domain)
        .maybeSingle();
      if (gw?.account_id) {
        // Atomically consume a seat before linking
        const { data: ok } = await admin.rpc("b2b_increment_seat", { _account_id: gw.account_id });
        if (ok) {
          accountId = gw.account_id;
          await admin.from("profiles").update({ b2b_account_id: accountId }).eq("user_id", user.id);
        }
      }
    }

    if (accountId) {
      const { data: acc } = await admin
        .from("b2b_accounts")
        .select("id, organization_name, organization_type, is_active, contract_end")
        .eq("id", accountId)
        .maybeSingle();
      if (acc) {
        const active = acc.is_active && new Date(acc.contract_end) > new Date();
        return json({
          access: active ? "premium" : "expired",
          company: { id: acc.id, name: acc.organization_name, client_type: acc.organization_type, expires_at: acc.contract_end },
        }, 200);
      }
    }

    // ---- 2) Legacy b2b_companies fallback ----------------------------------
    let companyId = (profile as { company_id?: string } | null)?.company_id;
    if (!companyId && user.email) {
      const domain = "@" + user.email.split("@")[1];
      const { data: rule } = await admin
        .from("b2b_access_rules")
        .select("company_id, allowed_domain")
        .eq("auth_type", "domain")
        .eq("allowed_domain", domain)
        .maybeSingle();
      if (rule?.company_id) {
        companyId = rule.company_id;
        await admin.from("profiles").update({ company_id: companyId }).eq("user_id", user.id);
      }
    }
    if (!companyId) return json({ access: "b2c" }, 200);
    const { data: company } = await admin
      .from("b2b_companies")
      .select("id, company_name, client_type, is_active, subscription_end_date")
      .eq("id", companyId)
      .maybeSingle();
    if (!company) return json({ access: "b2c" }, 200);
    const end = company.subscription_end_date ? new Date(company.subscription_end_date) : null;
    const active = company.is_active && (!end || end >= new Date());
    return json({
      access: active ? "premium" : "expired",
      company: { id: company.id, name: company.company_name, client_type: company.client_type, expires_at: company.subscription_end_date },
    }, 200);
  } catch (e) {
    return json({ access: "none", error: e instanceof Error ? e.message : "unknown" }, 200);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
