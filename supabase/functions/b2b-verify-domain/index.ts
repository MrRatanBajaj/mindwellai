import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'

const FREE_EMAIL_DOMAINS = new Set([
  'gmail.com', 'yahoo.com', 'yahoo.in', 'yahoo.co.in', 'hotmail.com',
  'outlook.com', 'live.com', 'icloud.com', 'aol.com', 'protonmail.com',
  'proton.me', 'gmx.com', 'mail.com', 'zoho.com', 'rediffmail.com',
  'me.com', 'msn.com', 'ymail.com', 'rocketmail.com', 'fastmail.com',
]);

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();
    if (typeof email !== 'string' || !email.includes('@')) {
      return new Response(JSON.stringify({ valid: false, reason: 'invalid_email' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const domain = email.split('@')[1].toLowerCase().trim();
    const isStudent = domain.endsWith('.edu') || domain.endsWith('.ac.in') || domain.endsWith('.edu.in');
    const isFree = FREE_EMAIL_DOMAINS.has(domain);

    if (isFree && !isStudent) {
      return new Response(JSON.stringify({
        valid: false, domain, isStudent: false,
        reason: 'free_email_blocked',
        message: 'Please use your work email (e.g. you@yourcompany.com). Free email providers like Gmail / Yahoo are not allowed for B2B accounts.',
      }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({
      valid: true, domain, isStudent,
      type: isStudent ? 'student' : 'business',
    }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ valid: false, error: String(err) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
