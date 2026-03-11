import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.52.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Profanity and crisis word lists
const PROFANITY_WORDS = [
  'fuck', 'shit', 'asshole', 'bitch', 'bastard', 'damn', 'crap',
  'dick', 'pussy', 'whore', 'slut', 'nigger', 'faggot', 'retard',
  'motherfucker', 'cocksucker', 'bullshit', 'piss', 'cunt'
];

const CRISIS_PHRASES = [
  'kill myself', 'want to die', 'end my life', 'suicide', 'suicidal',
  'self harm', 'self-harm', 'cut myself', 'hurt myself', 'no reason to live',
  'better off dead', 'end it all', 'take my life', 'overdose', 'jump off',
  'hang myself', 'slit my wrist', 'not worth living', 'nobody cares'
];

const THREAT_PHRASES = [
  'kill you', 'hurt you', 'murder', 'bomb', 'attack', 'weapon',
  'shoot', 'stab', 'threaten', 'destroy you'
];

interface ModerationResult {
  flagged: boolean;
  alertType: 'none' | 'profanity' | 'crisis' | 'threat';
  severity: 'none' | 'low' | 'medium' | 'high' | 'critical';
  detectedWords: string[];
  warningMessage: string | null;
  crisisResources: boolean;
}

function moderateContent(message: string): ModerationResult {
  const lower = message.toLowerCase();
  const detectedWords: string[] = [];
  let alertType: ModerationResult['alertType'] = 'none';
  let severity: ModerationResult['severity'] = 'none';
  let warningMessage: string | null = null;
  let crisisResources = false;

  // Check crisis phrases first (highest priority)
  for (const phrase of CRISIS_PHRASES) {
    if (lower.includes(phrase)) {
      detectedWords.push(phrase);
      alertType = 'crisis';
      severity = 'critical';
      crisisResources = true;
      warningMessage = "We care about your safety. If you're in crisis, please reach out to a helpline: India: iCall (9152987821) | US: 988 | UK: 116 123. You are not alone. 💚";
    }
  }

  // Check threat phrases
  if (alertType === 'none') {
    for (const phrase of THREAT_PHRASES) {
      if (lower.includes(phrase)) {
        detectedWords.push(phrase);
        alertType = 'threat';
        severity = 'high';
        warningMessage = "Please keep our conversation respectful and safe. Threatening language is not permitted. Let's focus on constructive support. 🤝";
      }
    }
  }

  // Check profanity
  if (alertType === 'none') {
    for (const word of PROFANITY_WORDS) {
      const regex = new RegExp(`\\b${word}\\b`, 'i');
      if (regex.test(lower)) {
        detectedWords.push(word);
        alertType = 'profanity';
        severity = detectedWords.length > 2 ? 'medium' : 'low';
        warningMessage = "We noticed some strong language. This is a safe, respectful space — let's keep our conversation positive. 🌱";
      }
    }
  }

  return {
    flagged: alertType !== 'none',
    alertType,
    severity,
    detectedWords,
    warningMessage,
    crisisResources,
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, sessionId, userId } = await req.json();

    if (!message) {
      throw new Error('Message is required');
    }

    const result = moderateContent(message);

    // Log flagged content to database
    if (result.flagged) {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Use AI for deeper analysis on high-severity flags
      let aiAnalysis: string | null = null;
      if (result.severity === 'critical' || result.severity === 'high') {
        const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
        if (LOVABLE_API_KEY) {
          try {
            const aiResp = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${LOVABLE_API_KEY}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                model: 'google/gemini-3-flash-preview',
                messages: [
                  { role: 'system', content: 'You are a content safety analyst. Briefly analyze this flagged message for risk level and recommended action. Keep response under 100 words.' },
                  { role: 'user', content: `Flagged message (${result.alertType}): "${message}"` }
                ],
                max_tokens: 150,
              }),
            });
            if (aiResp.ok) {
              const aiData = await aiResp.json();
              aiAnalysis = aiData.choices?.[0]?.message?.content || null;
            }
          } catch (e) {
            console.error('AI analysis failed:', e);
          }
        }
      }

      const { error } = await supabase
        .from('content_moderation_alerts')
        .insert({
          session_id: sessionId || 'unknown',
          user_id: userId || null,
          flagged_message: message.substring(0, 500),
          alert_type: result.alertType,
          severity: result.severity,
          detected_words: result.detectedWords,
          ai_analysis: aiAnalysis,
        });

      if (error) {
        console.error('Failed to log moderation alert:', error);
      } else {
        console.log(`Moderation alert logged: ${result.alertType} (${result.severity})`);
      }
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Moderation error:', error);
    return new Response(
      JSON.stringify({ flagged: false, alertType: 'none', severity: 'none', detectedWords: [], warningMessage: null, crisisResources: false }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
