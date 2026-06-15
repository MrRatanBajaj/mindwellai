// Shared clinical knowledge & screening instruments used across all AI counselors
// (chat, voice, video). Trains every persona on evidence-based frameworks plus
// the structured symptom screeners they may run conversationally.
//
// NOTE: These tools are for SCREENING and PSYCHOEDUCATION only — never diagnosis.
// All counselors must remind the user that only a licensed clinician can diagnose.

export const CLINICAL_FRAMEWORKS_PROMPT = `
## CLINICAL TRAINING (apply silently — do not lecture the user)

You are trained on evidence-based mental-health frameworks. Use them naturally
inside warm, conversational language. NEVER list the framework names unless the
user asks. NEVER diagnose. You may *screen* and *educate*.

### Therapeutic modalities
- **CBT (Cognitive Behavioral Therapy)** — identify automatic thoughts, name
  cognitive distortions (catastrophizing, black-and-white thinking, mind reading,
  personalization), Socratic questioning, behavioral activation, thought records.
- **DBT (Dialectical Behavior Therapy)** — distress tolerance (TIPP, ACCEPTS,
  IMPROVE, radical acceptance), emotion regulation (PLEASE), interpersonal
  effectiveness (DEAR MAN, GIVE, FAST), mindfulness (wise mind).
- **ACT (Acceptance & Commitment Therapy)** — cognitive defusion ("I am having
  the thought that…"), values clarification, committed action, present-moment
  awareness, self-as-context.
- **Positive Psychology** — gratitude practice, three good things, character
  strengths (VIA), PERMA model, savoring, hope/optimism building.
- **Motivational Interviewing (MI)** — OARS (Open questions, Affirmations,
  Reflective listening, Summaries), elicit change talk, roll with resistance,
  develop discrepancy, support self-efficacy. Never persuade — evoke.
- **Crisis Intervention** — safety first, validate, contain, contract for
  safety, connect to human help, provide hotline numbers (India: iCall
  9152987821 · Vandrevala 1860-266-2345 · KIRAN 1800-599-0019).

### Diagnostic reference (for SYMPTOM-LITERACY, not diagnosis)
You silently recognise symptom patterns from DSM-5 and ICD-11 to ask better
questions. You never tell a user "you have X disorder". If a pattern is strong,
gently suggest they speak to a licensed clinician.

### Validated screening instruments you can offer
Offer ONE only when the user's words clearly map to that domain, and only with
consent ("Would a quick 2-minute check-in help us understand this better?").

| Tool | Domain | When to offer |
| --- | --- | --- |
| **PHQ-9** | Depression severity (9 items, 0–27) | Persistent low mood, anhedonia, hopelessness, sleep/appetite changes |
| **GAD-7** | Generalised anxiety (7 items, 0–21) | Worry, restlessness, on-edge, can't relax |
| **PCL-5** | PTSD symptoms (20 items) | Trauma exposure + intrusion / avoidance / hyperarousal |
| **Columbia Suicide Severity Rating Scale (C-SSRS)** | Suicide risk | ANY mention of self-harm, suicidal ideation, hopelessness, "don't want to be here" |

If the user agrees, ask the items ONE AT A TIME in plain Hinglish/English,
record scores yourself, and at the end share the band + a warm next step.

### Scoring bands (memorise)
- **PHQ-9**: 0–4 minimal · 5–9 mild · 10–14 moderate · 15–19 moderately severe · 20–27 severe. Item 9 (>0) = always escalate to C-SSRS.
- **GAD-7**: 0–4 minimal · 5–9 mild · 10–14 moderate · 15–21 severe.
- **C-SSRS**: ANY "yes" on items 3–5 (active ideation with method/intent/plan) = immediate safety response: stay present, call helpline together, encourage human help right now.

### Hard rules
- Never diagnose. Use phrases like "what you describe sounds a lot like…", "many
  people with this pattern find it helpful to talk to a clinician".
- Never prescribe medication. Refer to a doctor.
- Self-harm / suicide cues → drop everything → C-SSRS-style safety check →
  India hotlines → encourage immediate human help.
- Keep responses 2-4 short sentences in conversation; longer only when running
  a screener.
`.trim();

// ---------- Client-side screeners (for the in-app ClinicalScreener UI) ----------

export interface ScreenerItem {
  id: string;
  text: string;
}

export interface Screener {
  id: "phq9" | "gad7" | "cssrs";
  title: string;
  intro: string;
  options: { label: string; value: number }[];
  items: ScreenerItem[];
  scoreBands: { max: number; label: string; tone: "ok" | "mild" | "warn" | "crisis" }[];
  closing: (score: number, band: string) => string;
}

const PHQ_GAD_OPTIONS = [
  { label: "Not at all", value: 0 },
  { label: "Several days", value: 1 },
  { label: "More than half the days", value: 2 },
  { label: "Nearly every day", value: 3 },
];

export const PHQ9: Screener = {
  id: "phq9",
  title: "PHQ-9 · Depression check-in",
  intro:
    "Over the last 2 weeks, how often have you been bothered by the following? This is just a check-in — not a diagnosis.",
  options: PHQ_GAD_OPTIONS,
  items: [
    { id: "p1", text: "Little interest or pleasure in doing things" },
    { id: "p2", text: "Feeling down, depressed, or hopeless" },
    { id: "p3", text: "Trouble falling/staying asleep, or sleeping too much" },
    { id: "p4", text: "Feeling tired or having little energy" },
    { id: "p5", text: "Poor appetite or overeating" },
    { id: "p6", text: "Feeling bad about yourself — or that you're a failure" },
    { id: "p7", text: "Trouble concentrating on things" },
    { id: "p8", text: "Moving/speaking slowly, or being fidgety/restless" },
    { id: "p9", text: "Thoughts that you'd be better off dead, or hurting yourself" },
  ],
  scoreBands: [
    { max: 4, label: "Minimal", tone: "ok" },
    { max: 9, label: "Mild", tone: "mild" },
    { max: 14, label: "Moderate", tone: "warn" },
    { max: 19, label: "Moderately severe", tone: "warn" },
    { max: 27, label: "Severe", tone: "crisis" },
  ],
  closing: (score, band) =>
    `Your score is ${score}/27 (${band}). This is a screening, not a diagnosis. A licensed counselor can help you understand what's going on.`,
};

export const GAD7: Screener = {
  id: "gad7",
  title: "GAD-7 · Anxiety check-in",
  intro:
    "Over the last 2 weeks, how often have these bothered you? Just a quick screen — not a diagnosis.",
  options: PHQ_GAD_OPTIONS,
  items: [
    { id: "g1", text: "Feeling nervous, anxious, or on edge" },
    { id: "g2", text: "Not being able to stop or control worrying" },
    { id: "g3", text: "Worrying too much about different things" },
    { id: "g4", text: "Trouble relaxing" },
    { id: "g5", text: "Being so restless that it's hard to sit still" },
    { id: "g6", text: "Becoming easily annoyed or irritable" },
    { id: "g7", text: "Feeling afraid as if something awful might happen" },
  ],
  scoreBands: [
    { max: 4, label: "Minimal", tone: "ok" },
    { max: 9, label: "Mild", tone: "mild" },
    { max: 14, label: "Moderate", tone: "warn" },
    { max: 21, label: "Severe", tone: "crisis" },
  ],
  closing: (score, band) =>
    `Your score is ${score}/21 (${band}). A trained counselor can help you find what works for you.`,
};

export const CSSRS: Screener = {
  id: "cssrs",
  title: "Safety check-in",
  intro:
    "These are gentle, direct safety questions. Please answer honestly — you're not in trouble for any answer.",
  options: [
    { label: "No", value: 0 },
    { label: "Yes", value: 1 },
  ],
  items: [
    { id: "c1", text: "Have you wished you were dead or wished you could go to sleep and not wake up?" },
    { id: "c2", text: "Have you had any actual thoughts of killing yourself?" },
    { id: "c3", text: "Have you been thinking about how you might do this?" },
    { id: "c4", text: "Have you had these thoughts and some intention of acting on them?" },
    { id: "c5", text: "Have you started to work out or worked out the details of how to do this? Have you intended to carry out this plan?" },
    { id: "c6", text: "Have you done anything, started to do anything, or prepared to do anything to end your life — in the past 3 months?" },
  ],
  scoreBands: [
    { max: 0, label: "No current risk indicated", tone: "ok" },
    { max: 2, label: "Low — please reach out for support", tone: "warn" },
    { max: 6, label: "High — please contact a helpline now", tone: "crisis" },
  ],
  closing: (score, _band) =>
    score >= 3
      ? "Please call iCall 9152987821 or Vandrevala 1860-266-2345 right now. You don't have to go through this alone — a human is waiting for your call."
      : score >= 1
      ? "Thank you for sharing. Please reach out to iCall (9152987821) or talk to someone you trust today."
      : "Glad you're safe. Keep talking — I'm here whenever you need me.",
};

export const SCREENERS = { phq9: PHQ9, gad7: GAD7, cssrs: CSSRS } as const;

export function scoreScreener(s: Screener, answers: Record<string, number>): { score: number; band: string; tone: string } {
  const score = s.items.reduce((sum, it) => sum + (answers[it.id] ?? 0), 0);
  const band = s.scoreBands.find((b) => score <= b.max) ?? s.scoreBands[s.scoreBands.length - 1];
  return { score, band: band.label, tone: band.tone };
}
