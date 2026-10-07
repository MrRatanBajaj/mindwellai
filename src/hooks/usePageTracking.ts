import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { flush, track } from "@/lib/analytics";

/** Page-level duration + 30s heartbeat, reliable even on tab close. */
export function usePageTracking() {
  const { pathname } = useLocation();
  const enteredAt = useRef(Date.now());
  const path = useRef(pathname);

  const complete = (beacon = false) => {
    const d = (Date.now() - enteredAt.current) / 1000;
    if (d < 1) return;
    track("page_view_completed", {
      page_path: path.current,
      duration_seconds: Math.round(d),
      duration_minutes: Number((d / 60).toFixed(2)),
    });
    if (beacon) flush();
  };

  useEffect(() => {
    enteredAt.current = Date.now();
    path.current = pathname;
    return () => complete();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    const onHide = () => { if (document.visibilityState === "hidden") complete(true); else enteredAt.current = Date.now(); };
    const onUnload = () => complete(true);
    const hb = setInterval(() => {
      if (document.visibilityState === "visible") track("heartbeat", { page_path: path.current });
    }, 30_000);
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", onUnload);
    return () => {
      clearInterval(hb);
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", onUnload);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/** Chat session timer: total time, active engagement time, and user message count. */
export function useChatSessionTracking(userMessageCount: number, companion: string) {
  const start = useRef(Date.now());
  const lastActive = useRef(Date.now());
  const active = useRef(0);
  const count = useRef(0);
  count.current = userMessageCount;

  useEffect(() => {
    const mark = () => {
      const now = Date.now();
      const gap = (now - lastActive.current) / 1000;
      if (gap < 60) active.current += gap; // only count time while the person is engaged
      lastActive.current = now;
    };
    const evs = ["keydown", "pointerdown", "touchstart"] as const;
    evs.forEach((e) => window.addEventListener(e, mark));
    const send = () => {
      const secs = Math.round((Date.now() - start.current) / 1000);
      if (secs < 5) return;
      track("wellness_chat_session_completed", {
        total_duration_seconds: secs,
        total_duration_minutes: Number((secs / 60).toFixed(2)),
        active_engagement_seconds: Math.round(active.current),
        user_message_count: count.current,
        companion_type: companion,
      });
      flush();
    };
    window.addEventListener("pagehide", send);
    return () => {
      evs.forEach((e) => window.removeEventListener(e, mark));
      window.removeEventListener("pagehide", send);
      send();
    };
  }, [companion]);
}
