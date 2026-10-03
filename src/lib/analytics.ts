import posthog from "posthog-js";

let ready = false;

export function initAnalytics() {
  if (ready || typeof window === "undefined") return;
  const token = import.meta.env.VITE_LOVABLE_CONNECTOR_POSTHOG_API_KEY as string | undefined;
  if (!token) return;
  const region = (import.meta.env.VITE_LOVABLE_CONNECTOR_POSTHOG_REGION as string | undefined) || "us";
  posthog.init(token, {
    api_host: region === "eu" ? "https://eu.i.posthog.com" : "https://us.i.posthog.com",
    capture_pageview: false, // sent manually on route change
    capture_pageleave: true, // session duration + bounce
    autocapture: true,
    person_profiles: "identified_only",
  });
  ready = true;
}

export function track(event: string, props?: Record<string, unknown>) {
  if (ready) posthog.capture(event, props);
}

export function pageview(path: string) {
  if (ready) posthog.capture("$pageview", { $current_url: window.location.origin + path });
}

export function identify(id: string, props?: Record<string, unknown>) {
  if (ready) posthog.identify(id, props);
}

export function resetIdentity() {
  if (ready) posthog.reset();
}
