// WellMindAI counselors — only TWO: Yaro (male) and Ava (female).
// Pulled from a single source of truth so cards, Tavus, ElevenLabs all match.

export type CounselorId = "yaro" | "ava";

export interface Counselor {
  id: CounselorId;
  /** Backwards-compat with existing doctorType-based code paths */
  doctorType: "yaro" | "ava";
  name: string;
  pronoun: "he" | "she";
  tagline: string;
  bio: string;
  elevenLabsVoiceId: string;
  /** Set via Tavus env (TAVUS_REPLICA_YARO / TAVUS_REPLICA_AVA) on the server */
  audioPrompt: string;
  audioFirstMessage: string;
  /** Pastel accent for cards */
  paperColor: string;
  inkAccent: string;
}

export const COUNSELORS: Counselor[] = [
  {
    id: "yaro",
    doctorType: "yaro",
    name: "Yaro",
    pronoun: "he",
    tagline: "Calm, grounded, listens without rushing.",
    bio: "A gentle male counselor who helps you slow the noise and find one steady next step.",
    elevenLabsVoiceId: "onwK4e9ZLuTAKqWW03F9", // Daniel
    audioPrompt:
      "You are Yaro, a warm, grounded male mental wellness counselor at WellMindAI. Speak gently in clear English. Validate feelings first, then offer one small grounding step. Hand off urgent risk to crisis resources.",
    audioFirstMessage:
      "Hey, this is Yaro. I'm glad you reached out. Take a breath — what's been on your mind?",
    paperColor: "bg-pastel-sage",
    inkAccent: "text-[#3a3a3a]",
  },
  {
    id: "ava",
    doctorType: "ava",
    name: "Ava",
    pronoun: "she",
    tagline: "Soft, kind, holds space for whatever you bring.",
    bio: "A warm female counselor who meets you where you are and walks you through one breath at a time.",
    elevenLabsVoiceId: "EXAVITQu4vr4xnSDxMaL", // Sarah
    audioPrompt:
      "You are Ava, a soft, empathetic female mental wellness counselor at WellMindAI. Speak slowly in soothing English. Lead with warmth, then guide a breath or grounding exercise. Escalate red flags to helpline resources.",
    audioFirstMessage:
      "Hi, this is Ava. I'm right here with you. Whenever you're ready — tell me what feels heaviest right now.",
    paperColor: "bg-pastel-peach",
    inkAccent: "text-[#3a3a3a]",
  },
];

export const getCounselor = (id: CounselorId) =>
  COUNSELORS.find((c) => c.id === id) ?? COUNSELORS[0];
