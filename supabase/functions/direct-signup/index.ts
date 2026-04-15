import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const SignupSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(255),
  password: z.string().min(6).max(72),
  phone: z.string().trim().max(30).optional(),
})

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const rawBody = await req.json()
    const parsed = SignupSchema.safeParse(rawBody)

    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: 'Invalid signup details' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { name, email, password, phone } = parsed.data
    const normalizedEmail = email.trim().toLowerCase()

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error('Auth service is not configured')
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey)

    const { data: listedUsers, error: listError } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    })

    if (listError) {
      throw listError
    }

    const existingUser = listedUsers.users.find(
      (user) => user.email?.trim().toLowerCase() === normalizedEmail
    )

    let userId: string
    let mode: 'created' | 'recovered'

    if (existingUser) {
      if (existingUser.email_confirmed_at) {
        return new Response(
          JSON.stringify({ error: 'This email is already registered. Please sign in instead.' }),
          { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const { data: updatedUser, error: updateError } = await supabase.auth.admin.updateUserById(
        existingUser.id,
        {
          password,
          email_confirm: true,
          user_metadata: {
            ...(existingUser.user_metadata ?? {}),
            display_name: name,
            phone: phone || '',
          },
        }
      )

      if (updateError || !updatedUser.user) {
        throw updateError ?? new Error('Unable to activate existing account')
      }

      userId = updatedUser.user.id
      mode = 'recovered'
    } else {
      const { data: createdUser, error: createError } = await supabase.auth.admin.createUser({
        email: normalizedEmail,
        password,
        email_confirm: true,
        user_metadata: {
          display_name: name,
          phone: phone || '',
        },
      })

      if (createError || !createdUser.user) {
        throw createError ?? new Error('Unable to create account')
      }

      userId = createdUser.user.id
      mode = 'created'
    }

    const { data: existingProfile, error: profileLookupError } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle()

    if (profileLookupError) {
      throw profileLookupError
    }

    if (existingProfile) {
      const { error: profileUpdateError } = await supabase
        .from('profiles')
        .update({
          display_name: name,
          email: normalizedEmail,
        })
        .eq('id', existingProfile.id)

      if (profileUpdateError) {
        throw profileUpdateError
      }
    } else {
      const { error: profileInsertError } = await supabase
        .from('profiles')
        .insert({
          user_id: userId,
          display_name: name,
          email: normalizedEmail,
        })

      if (profileInsertError) {
        throw profileInsertError
      }
    }

    // Auto-create free subscription for new users
    if (mode === 'created') {
      const { data: existingSub } = await supabase
        .from('subscriptions')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle()

      if (!existingSub) {
        await supabase
          .from('subscriptions')
          .insert({
            user_id: userId,
            plan_id: 'free',
            status: 'active',
            sessions_remaining: 2,
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          })
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        mode,
        message:
          mode === 'recovered'
            ? 'Your earlier account has been activated successfully.'
            : 'Account created successfully.',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Direct signup error:', error)

    const message = error instanceof Error ? error.message : 'Unable to create account right now'

    return new Response(
      JSON.stringify({ error: message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
