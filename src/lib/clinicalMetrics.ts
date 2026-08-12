import { supabase } from "@/integrations/supabase/client";

/**
 * Clinical validation telemetry for the voice-note pipeline.
 * Buffered locally (always available) + best-effort persisted server side.
 */

export type VoiceMetric = {
  id: string;
  created_at: string;
  session_id: string;
  channel: string;
  language: string | null;
  stt_source: "browser" | "server" | "none";
  stt_ms: number;
  stt_chars: number;
  llm_ms: number;
  tts_ms: number;
  tts_source: "server" | "browser" | "none";
  total_ms: number;
  reply_words: number;
  adherence_score: number;
  adherence_flags: string[];
  crisis_flag: boolean;
  degraded: boolean;
};

const LS_KEY = "wm_clinical_metrics_v1";
const MAX_LOCAL = 300;

export const SESSION_ID =
  (typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2)
  ).slice(0, 8).toUpperCase();

/**
 * Heuristic adherence scoring for a voice-note reply against the
 * CBT / PHQ-9 / DSM-5 framing rules in Yaro's system prompt.
 */
export function scoreAdherence(reply: string): { score: number; flags: string[] } {
  const flags: string[] = [];
  const text = reply.trim();
  const words = text.split(/\s+/).filter(Boolean).length;
  const sentences = text.split(/[.!?…]+/).map((s) => s.trim()).filter(Boolean).length;

  let score = 1;

  // Brevity — voice notes should be 2-3 sentences.
  if (words > 90) { score -= 0.25; flags.push("too_long_for_voice"); }
  if (sentences > 4) { score -= 0.1; flags.push("over_4_sentences"); }
  if (words < 8) { score -= 0.15; flags.push("too_short"); }

  // Emotion acknowledgement first.
  const ack = /(sounds|seems|i hear|i can hear|that must|lagta hai|samajh|feel|feeling|heavy|tough|hard)/i;
  if (!ack.test(text)) { score -= 0.2; flags.push("no_emotion_acknowledgement"); }

  // Reflective question or gentle invitation.
  if (!text.includes("?")) { score -= 0.15; flags.push("no_reflective_question"); }

  // Therapeutic / CBT move present.
  const cbt = /(breath|breathe|notice|thought|reframe|ground|step|small|try|write|name it|pause|body)/i;
  if (!cbt.test(text)) { score -= 0.15; flags.push("no_therapeutic_move"); }

  // Audio hygiene — no markdown / bullets / headings in a spoken reply.
  if (/[*_#`]|^\s*[-•]\s/m.test(text)) { score -= 0.15; flags.push("markdown_in_voice_reply"); }

  // Never diagnose.
  if (/\byou (have|are suffering from|are diagnosed)\b/i.test(text)) {
    score -= 0.4; flags.push("diagnostic_language");
  }

  return { score: Math.max(0, Math.min(1, Number(score.toFixed(2)))), flags };
}

export function readLocalMetrics(): VoiceMetric[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as VoiceMetric[]) : [];
  } catch {
    return [];
  }
}

export function clearLocalMetrics() {
  try { localStorage.removeItem(LS_KEY); } catch { /* noop */ }
}

export async function logVoiceMetric(
  partial: Omit<VoiceMetric, "id" | "created_at" | "session_id">,
): Promise<VoiceMetric> {
  const metric: VoiceMetric = {
    id: Math.random().toString(36).slice(2),
    created_at: new Date().toISOString(),
    session_id: SESSION_ID,
    ...partial,
  };

  try {
    const next = [metric, ...readLocalMetrics()].slice(0, MAX_LOCAL);
    localStorage.setItem(LS_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent("wm:metric", { detail: metric }));
  } catch { /* noop */ }

  // Best effort — table may not exist yet in this environment.
  try {
    const { data: { user } } = await supabase.auth.getUser();
    await (supabase as any).from("clinical_validation_metrics").insert({
      user_id: user?.id ?? null,
      session_id: metric.session_id,
      channel: metric.channel,
      language: metric.language,
      stt_source: metric.stt_source,
      stt_ms: metric.stt_ms,
      stt_chars: metric.stt_chars,
      llm_ms: metric.llm_ms,
      tts_ms: metric.tts_ms,
      tts_source: metric.tts_source,
      total_ms: metric.total_ms,
      reply_words: metric.reply_words,
      adherence_score: metric.adherence_score,
      adherence_flags: metric.adherence_flags,
      crisis_flag: metric.crisis_flag,
      degraded: metric.degraded,
    });
  } catch { /* noop */ }

  return metric;
}

export function percentile(values: number[], p: number): number {
  const v = values.filter((n) => Number.isFinite(n) && n > 0).sort((a, b) => a - b);
  if (!v.length) return 0;
  const idx = Math.min(v.length - 1, Math.floor((p / 100) * v.length));
  return Math.round(v[idx]);
}

export function mean(values: number[]): number {
  const v = values.filter((n) => Number.isFinite(n));
  if (!v.length) return 0;
  return v.reduce((a, b) => a + b, 0) / v.length;
}
