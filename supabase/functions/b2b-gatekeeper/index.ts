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

    // Find company_id via profile
    const { data: profile } = await admin
      .from("profiles")
      .select("company_id")
      .eq("user_id", user.id)
      .maybeSingle();

    let companyId = profile?.company_id as string | undefined;

    // Domain-based auto-link if profile.company_id not set
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

    const now = new Date();
    const end = company.subscription_end_date ? new Date(company.subscription_end_date) : null;
    const active = company.is_active && (!end || end >= now);

    return json(
      {
        access: active ? "premium" : "expired",
        company: {
          id: company.id,
          name: company.company_name,
          client_type: company.client_type,
          expires_at: company.subscription_end_date,
        },
      },
      200,
    );
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
