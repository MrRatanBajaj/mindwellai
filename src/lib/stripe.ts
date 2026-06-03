// Stripe publishable key — safe to expose in client.
export const STRIPE_PUBLISHABLE_KEY =
  "pk_live_51Mnoj6SDeQbvsG5vmI7FpgmkTQesSRQzAnZU2tPyfcwPTvOaeiQaRdgdgEwtNprn6ZWCS57JIArJRFSRbFurUwNi00cSu821TX";

// USD price preview shown next to the INR price for international users.
export const PLAN_USD_PREVIEW: Record<string, string> = {
  student: "$1.99",
  starter: "$4.99",
  standard: "$7.99",
  premium: "$14.99",
};

// Best-effort country detect — if not India, prefer Stripe.
export async function detectIsInternational(): Promise<boolean> {
  try {
    const cached = sessionStorage.getItem("wm_country");
    if (cached) return cached !== "IN";
    const res = await fetch("https://ipapi.co/country/", { cache: "no-store" });
    const code = (await res.text()).trim();
    if (code && code.length === 2) {
      sessionStorage.setItem("wm_country", code);
      return code !== "IN";
    }
  } catch {
    // ignore
  }
  return false;
}
