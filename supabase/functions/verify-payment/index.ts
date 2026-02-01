import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { createHmac } from 'https://deno.land/std@0.168.0/node/crypto.ts'

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
    const { razorpayPaymentId, razorpayOrderId, razorpaySignature } = await req.json()

    if (!razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
      throw new Error('Missing payment verification parameters')
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get Razorpay secret
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET')

    if (!razorpayKeySecret) {
      throw new Error('Razorpay secret not configured')
    }

    // Verify signature
    const body = razorpayOrderId + '|' + razorpayPaymentId
    const expectedSignature = createHmac('sha256', razorpayKeySecret)
      .update(body)
      .digest('hex')

    if (expectedSignature !== razorpaySignature) {
      throw new Error('Invalid payment signature')
    }

    // Get auth header to extract user
    const authHeader = req.headers.get('authorization')
    let userId = null
    
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '')
      const { data: { user } } = await supabase.auth.getUser(token)
      userId = user?.id
    }

    // Update or create payment record
    const { data: existingPayment } = await supabase
      .from('payments')
      .select('*')
      .eq('order_id', razorpayOrderId)
      .single()

    if (existingPayment) {
      await supabase
        .from('payments')
        .update({
          payment_id: razorpayPaymentId,
          status: 'completed'
        })
        .eq('order_id', razorpayOrderId)
    }

    // Update consultation record if exists
    const { data: consultations, error: fetchError } = await supabase
      .from('consultations')
      .select('*')
      .contains('notes', { razorpayOrderId: razorpayOrderId })
      .limit(1)

    if (!fetchError && consultations?.length) {
      const consultation = consultations[0]
      const notes = typeof consultation.notes === 'string' 
        ? JSON.parse(consultation.notes) 
        : consultation.notes

      // Update consultation status
      await supabase
        .from('consultations')
        .update({
          status: 'confirmed',
          notes: JSON.stringify({
            ...notes,
            razorpayPaymentId: razorpayPaymentId,
            paymentStatus: 'completed',
            paidAt: new Date().toISOString()
          })
        })
        .eq('id', consultation.id)

      // Create or update subscription
      if (userId && notes.planId) {
        const sessionsMap: Record<string, number> = {
          'free-trial': 3,
          'basic': 8,
          'premium': 999
        }
        
        const { data: existingSub } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', userId)
          .single()

        if (existingSub) {
          await supabase
            .from('subscriptions')
            .update({
              plan_id: notes.planId,
              status: 'active',
              sessions_remaining: sessionsMap[notes.planId] || 0,
              current_period_start: new Date().toISOString(),
              current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
            })
            .eq('user_id', userId)
        } else {
          await supabase
            .from('subscriptions')
            .insert({
              user_id: userId,
              plan_id: notes.planId,
              status: 'active',
              sessions_remaining: sessionsMap[notes.planId] || 0,
              current_period_start: new Date().toISOString(),
              current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
            })
        }
      }
    }

    // Log successful payment
    await supabase
      .from('analytics')
      .insert({
        event_type: 'payment_success',
        event_data: {
          orderId: razorpayOrderId,
          paymentId: razorpayPaymentId
        }
      })

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Payment verified successfully',
        consultationId: consultation.id
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Payment verification error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})