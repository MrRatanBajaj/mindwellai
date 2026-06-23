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
    name: "Free Forever",
    tagline: "Zero signup. Lifetime baseline access.",
    features: [
      "One-time 2-minute Virtual Human therapy session (lifetime)",
      "Unlimited AI text chat counseling",
      "Private digital journaling",
      "Daily mood tracking logs",
      "Emotional Color Brain Map™",
    ],
    highlights: { sessions: "1 lifetime", duration: "2 min" },
    cta: "Start Free — No Signup",
    isFree: true,
    price: { monthly: { INR: 0, USD: 0, EUR: 0, GBP: 0, AED: 0, SGD: 0, AUD: 0, CAD: 0 } },
  },
  {
    id: "plus",
    name: "Plus",
    tagline: "Voice ecosystem — daily support",
    features: [
      "Unlimited voice & audio therapy (zero voice caps)",
      "Unlimited AI text chat counseling",
      "Full emotional analytics dashboard",
      "Unlimited private journaling",
      "🚫 Virtual Human video disabled on this tier",
    ],
    highlights: { sessions: "Unlimited voice", duration: "No caps" },
    cta: "Upgrade to Plus",
    isFeatured: true,
    paymentKey: "plus",
    price: {
      monthly: {
        INR: 399, USD: 5.99, EUR: 5.49, GBP: 4.99,
        AED: 22, SGD: 8.99, AUD: 9.99, CAD: 8.99,
      },
    },
  },
  {
    id: "premium",
    name: "Premium",
    tagline: "The Virtual Human tier",
    features: [
      "30 minutes of live Virtual Human Video Therapy / month",
      "Unlimited voice & audio therapy",
      "Unlimited AI text chat counseling",
      "Premium emotional metrics mapping",
      "Priority cloud rendering — zero midnight queues",
    ],
    highlights: { sessions: "30 min video", duration: "/ month" },
    cta: "Go Premium",
    paymentKey: "premium",
    price: {
      monthly: {
        INR: 1499, USD: 19.99, EUR: 18.99, GBP: 16.99,
        AED: 75, SGD: 26.99, AUD: 29.99, CAD: 27.99,
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
