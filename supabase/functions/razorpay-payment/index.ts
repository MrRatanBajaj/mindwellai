import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const RequestSchema = z.object({
  amount: z.number().positive().max(10000000),
  currency: z.string().max(10).default('INR'),
  name: z.string().min(1).max(200),
  email: z.string().email().max(255),
  phone: z.string().max(20).optional(),
  planId: z.string().max(100).optional(),
  paymentMethod: z.string().max(50).optional(),
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const rawBody = await req.json();
    const parsed = RequestSchema.safeParse(rawBody);

    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: 'Invalid request data' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { amount, currency, name, email, phone, planId, paymentMethod } = parsed.data;

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID')
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET')

    if (!razorpayKeyId || !razorpayKeySecret) {
      throw new Error('Payment service not configured')
    }

    const orderData = {
      amount: amount * 100,
      currency: currency,
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1,
      notes: {
        planId: planId || '',
        name: name,
        email: email,
        phone: phone || '',
        paymentMethod: paymentMethod || 'card'
      }
    }

    const auth = btoa(`${razorpayKeyId}:${razorpayKeySecret}`)
    
    const razorpayResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    })

    if (!razorpayResponse.ok) {
      console.error('Razorpay API error:', await razorpayResponse.text());
      throw new Error('Payment order creation failed')
    }

    const razorpayOrder = await razorpayResponse.json()

    const authHeader = req.headers.get('authorization')
    let userId = null
    
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '')
      const { data: { user } } = await supabase.auth.getUser(token)
      userId = user?.id
    }

    if (userId) {
      await supabase
        .from('payments')
        .insert({
          user_id: userId,
          order_id: razorpayOrder.id,
          amount: amount,
          currency: currency,
          status: 'pending',
          plan_id: planId || 'consultation',
          payment_method: paymentMethod || 'upi'
        })
    }

    if (userId) {
      const consultationData = {
        user_id: userId,
        name: name,
        email: email,
        phone: phone,
        concerns: `Payment for ${planId || 'consultation'} plan`,
        status: 'payment_pending',
        session_type: 'ai_counselor',
        scheduled_date: new Date().toISOString().split('T')[0],
        scheduled_time: '09:00:00',
        notes: JSON.stringify({
          razorpayOrderId: razorpayOrder.id,
          amount: amount,
          currency: currency,
          paymentMethod: paymentMethod,
          planId: planId
        })
      }

      const { error: dbError } = await supabase
        .from('consultations')
        .insert(consultationData)

      if (dbError) {
        console.error('Database error:', dbError)
      }
    }

    return new Response(
      JSON.stringify({
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        keyId: razorpayKeyId,
        name: 'MindwellAI',
        description: `Payment for ${planId || 'consultation'} plan`,
        prefill: { name, email, contact: phone || '' },
        theme: { color: '#10B981' },
        upiOptions: { vpa: 'mindwellai@paytm', flow: 'intent' },
        method: { upi: true, card: true, netbanking: true, wallet: true, emi: false, paylater: false }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Payment creation error:', error)
    return new Response(
      JSON.stringify({ error: 'Payment processing failed. Please try again.' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
