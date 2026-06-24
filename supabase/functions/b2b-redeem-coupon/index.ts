// Redeem a B2B coupon code — links the user's profile to a company.
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
    if (!authHeader.startsWith("Bearer ")) return j({ ok: false, error: "Sign in required" }, 401);
    const body = await req.json().catch(() => ({}));
    const code = String(body?.code ?? "").trim().toUpperCase();
    if (!code) return j({ ok: false, error: "Code required" }, 400);

    const userClient = createClient(SUPABASE_URL, ANON, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData } = await userClient.auth.getUser();
    const user = userData?.user;
    if (!user) return j({ ok: false, error: "Sign in required" }, 401);

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);
    const { data: coupon } = await admin
      .from("b2b_coupons")
      .select("id, company_id, redeemed_by")
      .eq("code", code)
      .maybeSingle();

    if (!coupon) return j({ ok: false, error: "Invalid code" }, 404);
    if (coupon.redeemed_by && coupon.redeemed_by !== user.id) {
      return j({ ok: false, error: "Code already redeemed" }, 409);
    }

    await admin
      .from("b2b_coupons")
      .update({ redeemed_by: user.id, redeemed_at: new Date().toISOString() })
      .eq("id", coupon.id);
    await admin.from("profiles").update({ company_id: coupon.company_id }).eq("user_id", user.id);

    return j({ ok: true, company_id: coupon.company_id });
  } catch (e) {
    return j({ ok: false, error: e instanceof Error ? e.message : "unknown" }, 500);
  }
});

function j(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
