// Server-side B2B activation. Verifies Razorpay signature, then creates the
// account + gateway atomically. NEVER trust the browser to insert these rows.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { createHmac } from "node:crypto";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ANON = Deno.env.get("SUPABASE_ANON_KEY")!;
const RZP_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET")!;

const RZP_KEY_ID = Deno.env.get("RAZORPAY_KEY_ID") ?? "";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    if (!authHeader.startsWith("Bearer ")) return json({ error: "auth required" }, 401);
    const userClient = createClient(SUPABASE_URL, ANON, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData } = await userClient.auth.getUser();
    const user = userData?.user;
    if (!user) return json({ error: "no user" }, 401);

    const body = await req.json();

    // === Step 1: create the Razorpay order server-side ===
    if (body?.action === "create_order") {
      const amount = Math.max(1, parseInt(body.amount, 10) || 0);
      if (!amount) return json({ error: "invalid amount" }, 400);
      if (!RZP_KEY_ID || !RZP_SECRET) return json({ error: "Razorpay keys not configured on the server" }, 500);
      const auth = btoa(`${RZP_KEY_ID}:${RZP_SECRET}`);
      const resp = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amount * 100,
          currency: "INR",
          receipt: `b2b_${Date.now()}`,
          payment_capture: 1,
          notes: { kind: "b2b", user_id: user.id },
        }),
      });
      if (!resp.ok) {
        const t = await resp.text();
        console.error("Razorpay order fail", resp.status, t);
        return json({ error: `Razorpay order failed (${resp.status})` }, 400);
      }
      const order = await resp.json();
      return json({ orderId: order.id, keyId: RZP_KEY_ID, amount: order.amount, currency: order.currency }, 200);
    }

    const {
      organization_name,
      organization_type,
      admin_email,
      max_seats,
      auth_strategy,
      identifier,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = body ?? {};

    if (!["corporate", "college", "coaching"].includes(organization_type))
      return json({ error: "invalid organization_type" }, 400);
    if (!["domain_match", "secure_passcode"].includes(auth_strategy))
      return json({ error: "invalid auth_strategy" }, 400);
    if (!organization_name || !admin_email || !identifier || !razorpay_payment_id)
      return json({ error: "missing required fields" }, 400);

    // Verify Razorpay signature
    if (razorpay_order_id && razorpay_signature) {
      const expected = createHmac("sha256", RZP_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");
      if (expected !== razorpay_signature) return json({ error: "signature mismatch" }, 400);
    }

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);
    const start = new Date();
    const end = new Date(start);
    end.setFullYear(end.getFullYear() + 1);

    const { data: account, error: accErr } = await admin
      .from("b2b_accounts")
      .insert({
        organization_name,
        organization_type,
        admin_email: admin_email.toLowerCase(),
        admin_user_id: user.id,
        is_active: true,
        max_seats: Math.max(1, parseInt(max_seats, 10) || 1),
        contract_start: start.toISOString(),
        contract_end: end.toISOString(),
        razorpay_payment_id,
      })
      .select("id")
      .single();
    if (accErr) return json({ error: accErr.message }, 400);

    const rule: Record<string, unknown> = { account_id: account.id, auth_strategy };
    if (auth_strategy === "domain_match") {
      rule.target_domain = String(identifier).replace(/^@/, "").toLowerCase().trim();
    } else {
      rule.secure_passcode = String(identifier).toUpperCase().trim();
    }
    const { error: ruleErr } = await admin.from("b2b_gateways").insert(rule);
    if (ruleErr) {
      await admin.from("b2b_accounts").delete().eq("id", account.id);
      return json({ error: ruleErr.message }, 400);
    }

    // Link the buyer's profile to the account
    await admin.from("profiles").update({ b2b_account_id: account.id }).eq("user_id", user.id);

    return json({ ok: true, account_id: account.id }, 200);
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "unknown" }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
