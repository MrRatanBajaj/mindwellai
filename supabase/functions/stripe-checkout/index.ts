// Creates a Stripe Checkout Session for international (non-INR) customers.
// Razorpay continues to handle INR. This function handles USD card payments
// via Stripe Checkout (hosted page — no card data ever hits our servers).
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY")!;
const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
  httpClient: Stripe.createFetchHttpClient(),
});

// USD pricing (cents). Roughly aligned with INR plans for international users.
const PLAN_USD_CENTS: Record<string, { amount: number; name: string }> = {
  student: { amount: 199, name: "WellMindAI — Student" },
  starter: { amount: 499, name: "WellMindAI — Starter" },
  standard: { amount: 799, name: "WellMindAI — Standard" },
  premium: { amount: 1499, name: "WellMindAI — Premium" },
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { planId, email, name, userId, currency = "usd" } = await req.json();
    const plan = PLAN_USD_CENTS[planId];
    if (!plan) {
      return new Response(JSON.stringify({ error: "Invalid planId" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const origin = req.headers.get("origin") || "https://wellmindai.in";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: email || undefined,
      line_items: [
        {
          price_data: {
            currency,
            product_data: { name: plan.name },
            unit_amount: plan.amount,
            recurring: { interval: "month" },
          },
          quantity: 1,
        },
      ],
      metadata: {
        planId,
        userId: userId || "",
        name: name || "",
      },
      success_url: `${origin}/payment?stripe=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/payment?stripe=cancelled`,
    });

    return new Response(JSON.stringify({ url: session.url, id: session.id }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("stripe-checkout error", e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
