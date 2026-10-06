import posthog from "posthog-js";
import { getAttribution, getGuestProfile, getVisitorId } from "@/lib/visitor";

let ready = false;

export function initAnalytics() {
  if (ready || typeof window === "undefined") return;
  const token = import.meta.env.VITE_LOVABLE_CONNECTOR_POSTHOG_API_KEY as string | undefined;
  if (!token) return;
  const region = (import.meta.env.VITE_LOVABLE_CONNECTOR_POSTHOG_REGION as string | undefined) || "us";
  let consent: string | null = null;
  try { consent = JSON.parse(localStorage.getItem("wm-cookie-consent-v1") || "null")?.v ?? null; } catch { /* ignore */ }
  posthog.init(token, {
    api_host: region === "eu" ? "https://eu.i.posthog.com" : "https://us.i.posthog.com",
    defaults: "2025-05-24",
    capture_pageview: "history_change", // automatic $pageview on every route change
    capture_pageleave: true,
    autocapture: true,
    person_profiles: "always", // guests get a real person profile, not "anonymous"
    persistence: consent === "reject" ? "memory" : "localStorage+cookie",
  } as Parameters<typeof posthog.init>[1]);
  const guest = getGuestProfile();
  const attr = getAttribution();
  posthog.register({ visitor_id: getVisitorId(), first_landing: attr.landing, first_referrer: attr.referrer, utm: attr.utm });
  posthog.setPersonProperties?.({ visitor_id: getVisitorId(), ...(guest.name ? { name: guest.name } : {}), ...(guest.email ? { email: guest.email } : {}) });
  ready = true;
}

export function track(event: string, props?: Record<string, unknown>) {
  if (ready) posthog.capture(event, props);
}

/** Kept for compatibility — $pageview is captured automatically on route change. */
export function pageview(_path: string) {}

export function identify(id: string, props?: Record<string, unknown>) {
  if (ready) posthog.identify(id, props);
}

export function setPerson(props: Record<string, unknown>) {
  if (ready) posthog.setPersonProperties?.(props);
}

export function resetIdentity() {
  if (ready) posthog.reset();
}
