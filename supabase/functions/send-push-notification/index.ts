import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.52.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// VAPID keys for web push
const VAPID_PUBLIC_KEY = 'BLBz-YrPwL4iFBqzYSgGj6gy4M1qYNDxLtCZN8xBVqBELqpXKPuqBQPDqZGTtmvPJqRVvAKjQVpGvQfYqN9QXZI';
const VAPID_PRIVATE_KEY = Deno.env.get('VAPID_PRIVATE_KEY') || '';

interface PushPayload {
  title: string;
  body: string;
  icon?: string;
  tag?: string;
  data?: Record<string, unknown>;
}

interface RequestBody {
  notification: PushPayload;
  targetUserIds?: string[]; // Optional: specific users, if empty sends to all
}

// Web Push implementation using fetch
async function sendWebPush(
  subscription: { endpoint: string; p256dh_key: string; auth_key: string },
  payload: PushPayload
) {
  const encoder = new TextEncoder();
  const payloadString = JSON.stringify(payload);
  
  try {
    // For now, we'll use a simple approach
    // In production, you'd need proper VAPID signing
    const response = await fetch(subscription.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'TTL': '86400',
      },
      body: payloadString,
    });
    
    return { success: response.ok, status: response.status };
  } catch (error) {
    console.error('Push send error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { notification, targetUserIds }: RequestBody = await req.json();

    if (!notification || !notification.title || !notification.body) {
      return new Response(
        JSON.stringify({ error: "Missing notification title or body" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get subscriptions
    let query = supabase.from('push_subscriptions').select('*');
    
    if (targetUserIds && targetUserIds.length > 0) {
      query = query.in('user_id', targetUserIds);
    }
    
    const { data: subscriptions, error: fetchError } = await query;

    if (fetchError) {
      console.error('Error fetching subscriptions:', fetchError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch subscriptions" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!subscriptions || subscriptions.length === 0) {
      return new Response(
        JSON.stringify({ message: "No subscriptions found", sent: 0 }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Sending notifications to ${subscriptions.length} subscribers`);

    const results = await Promise.allSettled(
      subscriptions.map(async (sub) => {
        try {
          const result = await sendWebPush(sub, notification);
          
          // If subscription is invalid, remove it
          if (!result.success && (result.status === 404 || result.status === 410)) {
            await supabase.from('push_subscriptions').delete().eq('id', sub.id);
            console.log(`Removed invalid subscription: ${sub.id}`);
          }
          
          return result;
        } catch (error) {
          console.error(`Error sending to ${sub.id}:`, error);
          return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
        }
      })
    );

    const successful = results.filter(r => r.status === 'fulfilled' && r.value?.success).length;
    const failed = results.length - successful;

    return new Response(
      JSON.stringify({
        message: `Push notifications sent`,
        total: subscriptions.length,
        successful,
        failed,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in send-push-notification:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
