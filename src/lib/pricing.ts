// Centralized INR-only pricing configuration.
// International (Stripe) checkout removed — Razorpay INR only.

export type PlanId = "starter_weekly" | "premium" | "pro_ultimate";

export interface PlanQuota {
  videoMinutes: number;       // per cycle
  audioMinutes: number;       // per cycle
  videoSessions: number;      // per cycle
  audioSessions: number;      // per cycle
  perVideoMinutes: number;    // max per single call
  perAudioMinutes: number;    // max per single call
}

export interface Plan {
  id: PlanId;
  name: string;
  tagline: string;
  pricePaise: number;     // INR paise (₹99 = 9900)
  priceLabel: string;     // pre-formatted ("₹99")
  periodLabel: string;    // "week" | "month"
  periodDays: number;     // 7 | 30
  cycle: "weekly" | "monthly";
  features: string[];
  cta: string;
  isFeatured?: boolean;
  quota: PlanQuota;
}

export const PLANS: Plan[] = [
  {
    id: "starter_weekly",
    name: "Starter Weekly",
    tagline: "Just ₹99 — try real therapy for 7 days",
    pricePaise: 9900,
    priceLabel: "₹99",
    periodLabel: "week",
    periodDays: 7,
    cycle: "weekly",
    features: [
      "💬 Unlimited chat therapy — no time limit",
      "🎤 Voice therapy: 10 min / week (Hume EVI emotion-aware)",
      "📹 Video therapy: 3 min / week (Tavus AI counselor)",
      "📊 Mood & journal tracking",
      "🔒 Encrypted, private, HIPAA-grade",
    ],
    cta: "Get Started — ₹99/week",
    quota: {
      videoMinutes: 3, audioMinutes: 10,
      videoSessions: 1, audioSessions: 3,
      perVideoMinutes: 3, perAudioMinutes: 5,
    },
  },
  {
    id: "premium",
    name: "Premium",
    tagline: "Most popular — full voice + video therapy",
    pricePaise: 49900,
    priceLabel: "₹499",
    periodLabel: "month",
    periodDays: 30,
    cycle: "monthly",
    features: [
      "💬 Unlimited chat therapy",
      "🎤 Voice therapy: 60 min / month with emotion biomarkers",
      "📹 Video counselling: 12 min / month (3 sessions × 4 min)",
      "📊 Full emotional analytics dashboard",
      "⭐ Priority response — no queue",
    ],
    cta: "Get Premium",
    isFeatured: true,
    quota: {
      videoMinutes: 12, audioMinutes: 60,
      videoSessions: 3, audioSessions: 12,
      perVideoMinutes: 4, perAudioMinutes: 10,
    },
  },
  {
    id: "pro_ultimate",
    name: "Pro Ultimate",
    tagline: "Deep healing suite",
    pricePaise: 99900,
    priceLabel: "₹999",
    periodLabel: "month",
    periodDays: 30,
    cycle: "monthly",
    features: [
      "💬 Unlimited chat + standard audio therapy",
      "🎤 Voice therapy: 180 min / month, clinical-grade",
      "📹 Video counselling: 30 min / month (6 × 5 min)",
      "🧠 DSM-5 & PHQ-9 automated clinical profiling",
      "⚡ Priority cloud rendering — zero queue",
    ],
    cta: "Go Pro Ultimate",
    quota: {
      videoMinutes: 30, audioMinutes: 180,
      videoSessions: 6, audioSessions: 30,
      perVideoMinutes: 5, perAudioMinutes: 15,
    },
  },
];

export const getPlan = (id: string): Plan | undefined =>
  PLANS.find((p) => p.id === id);

export const formatINR = (paise: number): string =>
  `₹${(paise / 100).toLocaleString("en-IN")}`;
