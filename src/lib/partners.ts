import { supabase } from "@/integrations/supabase/client";

export type PartnerBrand = {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  primary_color: string;
  tagline: string | null;
};

export type Partner = PartnerBrand & {
  contact_email: string;
  user_id: string | null;
  commission_percentage: number;
  total_earnings: number;
  total_paid_out: number;
  payout_details: PayoutDetails | null;
  is_active: boolean;
  created_at: string;
};

export type PayoutDetails = {
  account_holder?: string;
  account_number?: string;
  ifsc?: string;
  upi_id?: string;
};

export type PartnerSession = {
  id: string;
  partner_id: string;
  visitor_key: string | null;
  session_type: string;
  session_duration_minutes: number;
  phq9_score: number | null;
  gad7_score: number | null;
  severity_band: string | null;
  revenue_amount: number;
  created_at: string;
};

const db = supabase as any;
export const SITE = "https://www.wellmindai.in";

export async function getPartnerBySlug(slug: string): Promise<PartnerBrand | null> {
  const { data } = await db
    .from("partners")
    .select("id, name, slug, logo_url, primary_color, tagline")
    .eq("slug", slug.toLowerCase())
    .eq("is_active", true)
    .maybeSingle();
  return (data as PartnerBrand) ?? null;
}

export async function getMyPartner(userId: string): Promise<Partner | null> {
  const { data } = await db.from("partners").select("*").eq("user_id", userId).maybeSingle();
  return (data as Partner) ?? null;
}

/** Anonymous visitor id per browser — used only to count unique patients, never personal data. */
export function visitorKey() {
  const K = "wm_partner_visitor";
  let v = localStorage.getItem(K);
  if (!v) {
    v = crypto.randomUUID();
    localStorage.setItem(K, v);
  }
  return v;
}

export function bandFor(phq9?: number | null): string | null {
  if (phq9 == null) return null;
  if (phq9 <= 4) return "minimal";
  if (phq9 <= 9) return "mild";
  if (phq9 <= 14) return "moderate";
  return "severe";
}

export async function logPartnerSession(input: {
  partnerId: string;
  type: "chat" | "voice" | "video";
  minutes: number;
  phq9?: number | null;
  gad7?: number | null;
}) {
  await db.from("partner_sessions").insert({
    partner_id: input.partnerId,
    visitor_key: visitorKey(),
    session_type: input.type,
    session_duration_minutes: Math.max(0, Math.round(input.minutes)),
    phq9_score: input.phq9 ?? null,
    gad7_score: input.gad7 ?? null,
    severity_band: bandFor(input.phq9),
  });
}

export const inr = (n: number) =>
  "₹" + Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 });

/** Convert "#RRGGBB" into "H S% L%" for use inside hsl(var(--primary)) tokens. */
export function hexToHslTriplet(hex: string): string {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex);
  if (!m) return "160 84% 39%";
  const n = parseInt(m[1], 16);
  const r = ((n >> 16) & 255) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
    h *= 60;
  }
  return `${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}
