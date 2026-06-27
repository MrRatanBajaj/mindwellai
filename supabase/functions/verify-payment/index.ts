import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { createHmac } from 'https://deno.land/std@0.168.0/node/crypto.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Per-plan cycle length & nominal "sessions_remaining" seed (legacy field).
const PLAN_META: Record<string, { days: number; sessions: number; periodType: "weekly" | "monthly" }> = {
  starter_weekly: { days: 7,  sessions: 1,  periodType: "weekly"  },
  premium:        { days: 30, sessions: 3,  periodType: "monthly" },
  pro_ultimate:   { days: 30, sessions: 6,  periodType: "monthly" },
  // legacy
  basic:    { days: 30, sessions: 8, periodType: "monthly" },
  standard: { days: 30, sessions: 6, periodType: "monthly" },
  starter:  { days: 30, sessions: 2, periodType: "monthly" },
  student:  { days: 30, sessions: 2, periodType: "monthly" },
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { razorpayPaymentId, razorpayOrderId, razorpaySignature } = await req.json()
    if (!razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
      throw new Error('Missing payment verification parameters')
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET')!

    const expectedSignature = createHmac('sha256', razorpayKeySecret)
      .update(razorpayOrderId + '|' + razorpayPaymentId)
      .digest('hex')
    if (expectedSignature !== razorpaySignature) throw new Error('Invalid payment signature')

    const authHeader = req.headers.get('authorization')
    let userId: string | null = null
    if (authHeader) {
      const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''))
      userId = user?.id ?? null
    }

    // Mark payment completed
    const { data: existingPayment } = await supabase
      .from('payments').select('*').eq('order_id', razorpayOrderId).maybeSingle()
    if (existingPayment) {
      await supabase.from('payments').update({
        payment_id: razorpayPaymentId, status: 'completed',
      }).eq('order_id', razorpayOrderId)
    }

    // Find consultation/notes to extract planId
    const { data: consultations } = await supabase
      .from('consultations').select('*')
      .contains('notes', { razorpayOrderId }).limit(1)

    let planId: string | null = null
    if (consultations?.length) {
      const c = consultations[0]
      const notes = typeof c.notes === 'string' ? JSON.parse(c.notes) : c.notes
      planId = notes?.planId ?? null

      await supabase.from('consultations').update({
        status: 'confirmed',
        notes: JSON.stringify({
          ...notes, razorpayPaymentId,
          paymentStatus: 'completed', paidAt: new Date().toISOString(),
        }),
      }).eq('id', c.id)
    }

    if (!planId && existingPayment?.plan_id) planId = existingPayment.plan_id

    // Upsert subscription
    if (userId && planId) {
      const meta = PLAN_META[planId] ?? { days: 30, sessions: 1, periodType: "monthly" as const }
      const now = new Date()
      const ends = new Date(now.getTime() + meta.days * 24 * 60 * 60 * 1000)

      const { data: existingSub } = await supabase
        .from('subscriptions').select('id').eq('user_id', userId).maybeSingle()

      const payload: Record<string, unknown> = {
        plan_id: planId,
        status: 'active',
        sessions_remaining: meta.sessions,
        current_period_start: now.toISOString(),
        current_period_end: ends.toISOString(),
        period_type: meta.periodType,
      }
      if (existingSub) {
        await supabase.from('subscriptions').update(payload).eq('user_id', userId)
      } else {
        await supabase.from('subscriptions').insert({ user_id: userId, ...payload })
      }
    }

    await supabase.from('analytics').insert({
      event_type: 'payment_success',
      event_data: { orderId: razorpayOrderId, paymentId: razorpayPaymentId, planId },
    })

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('verify-payment error', error)
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
