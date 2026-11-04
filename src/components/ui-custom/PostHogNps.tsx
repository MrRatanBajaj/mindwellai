import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import posthog from "posthog-js";
import { getVisitorId } from "@/lib/visitor";

const CADENCE_KEY = "wm_nps_opportunity_at";
const CADENCE_MS = 30 * 24 * 60 * 60 * 1000; // ask at most once every 30 days
const ENGAGEMENT_SECONDS = 180; // ~3 minutes of active (visible) time

const isSkippedRoute = (p: string) =>
  p.startsWith("/payment") ||
  p.startsWith("/subscription") ||
  p.startsWith("/auth") ||
  p.startsWith("/admin") ||
  p.startsWith("/partner");

/**
 * PostHog-native feedback moment. Instead of our own rating UI, this fires
 * `nps_survey_opportunity` at the right time (3 minutes of engaged browsing,
 * or immediately after a meaningful interaction like a completed therapy
 * session) and displays the PostHog survey configured for it in the dashboard.
 */
const PostHogNps = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (isSkippedRoute(pathname)) return;

    const last = Number(localStorage.getItem(CADENCE_KEY) || 0);
    if (Number.isFinite(last) && last > 0 && Date.now() - last < CADENCE_MS) return;

    let done = false;
    let elapsed = 0;

    const fire = () => {
      if (done) return;
      done = true;
      localStorage.setItem(CADENCE_KEY, String(Date.now()));
      try {
        posthog.capture("nps_survey_opportunity", {
          page: window.location.pathname,
          visitor_id: getVisitorId(),
        });
        // Show the dashboard-configured survey (displayed via API/code) right away.
        posthog.getSurveys((surveys) => {
          const survey = surveys.find(
            (s) =>
              (s.name || "").toLowerCase().includes("nps") ||
              (s.questions || []).some((q) => (q.type as string) === "nps")
          );
          if (!survey) return;
          const check = posthog.canRenderSurvey(survey.id);
          if (check?.ok) posthog.displaySurvey(survey.id);
        });
      } catch {
        /* PostHog blocked or not loaded — no in-app fallback by design */
      }
    };

    const onMeaningfulMoment = () => fire();
    window.addEventListener("wm:meaningful-moment", onMeaningfulMoment);

    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        elapsed += 5;
        if (elapsed >= ENGAGEMENT_SECONDS) fire();
      }
    }, 5000);

    return () => {
      window.clearInterval(timer);
      window.removeEventListener("wm:meaningful-moment", onMeaningfulMoment);
    };
  }, [pathname]);

  return null;
};

export default PostHogNps;
