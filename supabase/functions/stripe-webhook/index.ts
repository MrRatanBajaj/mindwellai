// Stripe webhook: marks subscription active on successful checkout.
// Configure endpoint in Stripe Dashboard → Webhooks pointing at this function's URL.
// Send STRIPE_WEBHOOK_SECRET to env. Listens for: checkout.session.completed.
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2024-06-20",
  httpClient: Stripe.createFetchHttpClient(),
});
const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET")!;

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const sessionsMap: Record<string, number> = {
  student: 2,
  starter: 2,
  standard: 6,
  premium: 999,
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const sig = req.headers.get("stripe-signature");
  if (!sig) return new Response("missing signature", { status: 400 });

  const body = await req.text();
  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, sig, webhookSecret);
  } catch (err) {
    console.error("Signature verification failed", err);
    return new Response(`Webhook Error: ${(err as Error).message}`, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const planId = session.metadata?.planId;

      if (userId && planId) {
        const periodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
        const { data: existing } = await supabase
          .from("subscriptions")
          .select("id")
          .eq("user_id", userId)
          .maybeSingle();

        const payload = {
          plan_id: planId,
          status: "active",
          sessions_remaining: sessionsMap[planId] || 0,
          current_period_start: new Date().toISOString(),
          current_period_end: periodEnd,
        };

        if (existing) {
          await supabase.from("subscriptions").update(payload).eq("user_id", userId);
        } else {
          await supabase.from("subscriptions").insert({ user_id: userId, ...payload });
        }

        await supabase.from("analytics").insert({
          event_type: "payment_success",
          event_data: {
            provider: "stripe",
            sessionId: session.id,
            planId,
            amount: session.amount_total,
            currency: session.currency,
          },
        });
      }
    }
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("webhook handler error", e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
