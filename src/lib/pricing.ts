// Centralized regional pricing configuration.
// Prices are FIXED per region (not exchange-rate based) so they don't fluctuate.
// Stored here so they can be updated without touching components.

export type CurrencyCode = "INR" | "USD" | "EUR" | "GBP" | "AED" | "SGD" | "AUD" | "CAD";

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  label: string;
  flag: string;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  INR: { code: "INR", symbol: "₹",  label: "Indian Rupee",      flag: "🇮🇳" },
  USD: { code: "USD", symbol: "$",  label: "US Dollar",         flag: "🇺🇸" },
  EUR: { code: "EUR", symbol: "€",  label: "Euro",              flag: "🇪🇺" },
  GBP: { code: "GBP", symbol: "£",  label: "British Pound",     flag: "🇬🇧" },
  AED: { code: "AED", symbol: "د.إ",label: "UAE Dirham",        flag: "🇦🇪" },
  SGD: { code: "SGD", symbol: "S$", label: "Singapore Dollar",  flag: "🇸🇬" },
  AUD: { code: "AUD", symbol: "A$", label: "Australian Dollar", flag: "🇦🇺" },
  CAD: { code: "CAD", symbol: "C$", label: "Canadian Dollar",   flag: "🇨🇦" },
};

// 2-letter country code → preferred currency.
export const COUNTRY_TO_CURRENCY: Record<string, CurrencyCode> = {
  IN: "INR",
  US: "USD", PR: "USD",
  GB: "GBP",
  AE: "AED", SA: "AED", QA: "AED", KW: "AED", OM: "AED", BH: "AED",
  SG: "SGD",
  AU: "AUD", NZ: "AUD",
  CA: "CAD",
  // Eurozone
  DE: "EUR", FR: "EUR", IT: "EUR", ES: "EUR", NL: "EUR", BE: "EUR",
  PT: "EUR", IE: "EUR", AT: "EUR", FI: "EUR", GR: "EUR", LU: "EUR",
};

export type PlanId = "free" | "premium" | "pro_ultimate" | "business";

export interface PlanFeature { text: string; }

export interface PlanPriceByCurrency {
  // Monthly price as a NUMBER for the given currency.
  monthly: Partial<Record<CurrencyCode, number>>;
  // Optional per-seat suffix (used for B2B Business plan).
  perSeatSuffix?: boolean;
  startingAt?: boolean;
}

export interface Plan {
  id: PlanId;
  name: string;
  tagline: string;
  features: string[];
  highlights: { sessions: string; duration: string };
  cta: string;
  isFeatured?: boolean;
  isFree?: boolean;
  price: PlanPriceByCurrency;
  paymentKey?: string;
}

// FIXED regional pricing — update here, no code change needed elsewhere.
export const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    tagline: "Trust & acquisition loop — 7 days",
    features: [
      "7-day validity window per user / device",
      "Unlimited chat therapy + secure journaling",
      "Voice therapy: free trial for automated audio screening",
      "Video counselling: 2 minutes max — new users only, one-time",
    ],
    highlights: { sessions: "7 days", duration: "2 min video (once)" },
    cta: "Start Free — 7 Days",
    isFree: true,
    price: { monthly: { INR: 0, USD: 0, EUR: 0, GBP: 0, AED: 0, SGD: 0, AUD: 0, CAD: 0 } },
  },
  {
    id: "premium",
    name: "Premium",
    tagline: "Core therapy bundle",
    features: [
      "Unlimited chat & voice therapy logs",
      "Voice biomarkers — pitch, jitter & pause pattern detection",
      "Video counselling: 12 min / month, up to 3 sessions (4 min each)",
      "Full emotional analytics dashboard",
    ],
    highlights: { sessions: "12 min video", duration: "3 sessions / mo" },
    cta: "Get Premium",
    isFeatured: true,
    paymentKey: "premium",
    price: {
      monthly: {
        INR: 499, USD: 6.99, EUR: 6.49, GBP: 5.99,
        AED: 25, SGD: 9.99, AUD: 10.99, CAD: 9.99,
      },
    },
  },
  {
    id: "pro_ultimate",
    name: "Pro Ultimate",
    tagline: "Deep healing suite",
    features: [
      "Unlimited text chat + standard audio therapy",
      "Clinical metrics — DSM-5 & PHQ-9 automated profiling",
      "Video counselling: 30 min / month, 6 sessions (5 min each)",
      "Priority cloud rendering — zero queue",
    ],
    highlights: { sessions: "30 min video", duration: "6 sessions / mo" },
    cta: "Go Pro Ultimate",
    paymentKey: "pro_ultimate",
    price: {
      monthly: {
        INR: 999, USD: 12.99, EUR: 11.99, GBP: 10.99,
        AED: 49, SGD: 17.99, AUD: 19.99, CAD: 17.99,
      },
    },
  },
];

// ───────────────────── Currency detection & override ─────────────────────

const STORAGE_KEY = "wm_currency";
const COUNTRY_CACHE = "wm_country";

export function getStoredCurrency(): CurrencyCode | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v && v in CURRENCIES ? (v as CurrencyCode) : null;
  } catch {
    return null;
  }
}

export function setStoredCurrency(c: CurrencyCode) {
  try { localStorage.setItem(STORAGE_KEY, c); } catch {}
}

export async function detectCountry(): Promise<string | null> {
  try {
    const cached = sessionStorage.getItem(COUNTRY_CACHE);
    if (cached) return cached;
    const res = await fetch("https://ipapi.co/country/", { cache: "no-store" });
    const code = (await res.text()).trim().toUpperCase();
    if (code && code.length === 2) {
      sessionStorage.setItem(COUNTRY_CACHE, code);
      return code;
    }
  } catch { /* ignore */ }
  return null;
}

export async function detectCurrency(): Promise<CurrencyCode> {
  const stored = getStoredCurrency();
  if (stored) return stored;
  const country = await detectCountry();
  if (country && COUNTRY_TO_CURRENCY[country]) return COUNTRY_TO_CURRENCY[country];
  return "INR";
}

export function formatPrice(plan: Plan, currency: CurrencyCode): string {
  const cfg = CURRENCIES[currency];
  const amount = plan.price.monthly[currency] ?? plan.price.monthly.INR ?? 0;
  if (amount === 0) return `${cfg.symbol}0`;
  // No decimals for INR/AED, 2 decimals otherwise when fractional.
  const isWhole = Number.isInteger(amount);
  const formatted = isWhole ? amount.toLocaleString() : amount.toFixed(2);
  return `${cfg.symbol}${formatted}`;
}

export function priceSuffix(plan: Plan): string {
  if (plan.isFree) return "";
  if (plan.price.perSeatSuffix) return "/user/month";
  return "/month";
}
