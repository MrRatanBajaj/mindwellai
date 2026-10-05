/** First-party visitor identity, kept in a cookie + localStorage so guests are recognised across visits. */
const VID = "wm_vid";
const UTM = "wm_utm";

const rand = () =>
  (crypto?.randomUUID?.() ?? `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`).replace(/[^a-zA-Z0-9-]/g, "");

function readCookie(name: string) {
  return document.cookie.split("; ").find((c) => c.startsWith(`${name}=`))?.split("=")[1] ?? null;
}
function writeCookie(name: string, value: string, days = 365) {
  document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${days * 86400}; path=/; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
}

export function getVisitorId(): string {
  if (typeof window === "undefined") return "";
  let id = readCookie(VID) || localStorage.getItem(VID);
  if (!id) id = `v_${rand()}`;
  writeCookie(VID, id);
  localStorage.setItem(VID, id);
  return id;
}

/** First-touch campaign info (utm_*, referrer, landing page), remembered for a year. */
export function getAttribution(): { utm: string; referrer: string; landing: string } {
  if (typeof window === "undefined") return { utm: "", referrer: "", landing: "" };
  const saved = readCookie(UTM);
  if (saved) {
    try { return JSON.parse(decodeURIComponent(saved)); } catch { /* fallthrough */ }
  }
  const q = new URLSearchParams(location.search);
  const utm = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]
    .filter((k) => q.get(k)).map((k) => `${k}=${q.get(k)}`).join("&");
  const a = { utm, referrer: document.referrer.slice(0, 250), landing: location.pathname };
  writeCookie(UTM, JSON.stringify(a));
  return a;
}

/** Name/email a guest chose to share (from feedback or chat), reused so they're never "anonymous". */
export function getGuestProfile(): { name?: string; email?: string } {
  try { return JSON.parse(localStorage.getItem("wm_guest_profile") || "{}"); } catch { return {}; }
}
export function setGuestProfile(p: { name?: string; email?: string }) {
  const merged = { ...getGuestProfile(), ...Object.fromEntries(Object.entries(p).filter(([, v]) => v)) };
  localStorage.setItem("wm_guest_profile", JSON.stringify(merged));
  return merged;
}
