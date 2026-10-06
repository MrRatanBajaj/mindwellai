import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { identify, initAnalytics, pageview, resetIdentity, track } from "@/lib/analytics";
import { stopAllAudio } from "@/lib/audioGuard";

/** Investor funnel: homepage → demo chat → signup → subscription, plus session events by page. */
const FUNNEL: Record<string, string> = {
  "/": "funnel_homepage",
  "/chat/yaro": "demo_chat_started",
  "/chat": "demo_chat_started",
  "/auth": "signup_viewed",
  "/plans": "pricing_viewed",
  "/payment": "subscription_started",
  "/consultation/audio": "audio_therapy_session",
  "/consultation/video": "video_therapy_session",
};

const AnalyticsTracker = () => {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const lastUser = useRef<string | null>(null);

  useEffect(() => { initAnalytics(); }, []);

  useEffect(() => {
    stopAllAudio(); // any counsellor voice from the previous page stops here
    pageview(pathname);
    const ev = FUNNEL[pathname];
    if (ev) track(ev, { path: pathname });
  }, [pathname]);

  useEffect(() => {
    if (user && lastUser.current !== user.id) {
      identify(user.id, { email: user.email });
      if (!localStorage.getItem(`wm_signup_tracked:${user.id}`)) {
        track("signup_completed");
        localStorage.setItem(`wm_signup_tracked:${user.id}`, "1");
      }
      lastUser.current = user.id;
    } else if (!user && lastUser.current) {
      resetIdentity();
      lastUser.current = null;
    }
  }, [user]);

  return null;
};

export default AnalyticsTracker;
