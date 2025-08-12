import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { amount, currency = 'INR', name, email, phone, planId, paymentMethod } = await req.json()

    if (!amount || !name || !email) {
      throw new Error('Missing required fields: amount, name, email')
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get Razorpay credentials
    const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID')
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET')

    if (!razorpayKeyId || !razorpayKeySecret) {
      throw new Error('Razorpay credentials not configured')
    }

    // Create Razorpay order
    const orderData = {
      amount: amount * 100, // Convert to paise
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
      const errorText = await razorpayResponse.text()
      throw new Error(`Razorpay API error: ${errorText}`)
    }

    const razorpayOrder = await razorpayResponse.json()

    // Store payment record in database
    const { data: paymentRecord, error: dbError } = await supabase
      .from('consultations')
      .insert({
        name: name,
        email: email,
        phone: phone,
        concerns: `Payment for ${planId || 'consultation'} plan`,
        status: 'payment_pending',
        session_type: 'consultation',
        scheduled_date: new Date().toISOString().split('T')[0],
        scheduled_time: '09:00:00',
        notes: JSON.stringify({
          razorpayOrderId: razorpayOrder.id,
          amount: amount,
          currency: currency,
          paymentMethod: paymentMethod,
          planId: planId
        })
      })

    if (dbError) {
      console.error('Database error:', dbError)
      throw new Error('Failed to create payment record')
    }

    // Return order details for frontend
    return new Response(
      JSON.stringify({
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        keyId: razorpayKeyId,
        name: 'MindwellAI',
        description: `Payment for ${planId || 'consultation'} plan`,
        prefill: {
          name: name,
          email: email,
          contact: phone || ''
        },
        theme: {
          color: '#10B981'
        },
        upiOptions: {
          vpa: 'mindwellai@paytm',
          flow: 'intent'
        },
        method: {
          upi: true,
          card: true,
          netbanking: true,
          wallet: true,
          emi: false,
          paylater: false
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Payment creation error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})