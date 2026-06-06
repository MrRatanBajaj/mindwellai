import { useEffect, useRef, useState, useCallback } from "react";
import { toast } from "sonner";

interface SessionTimerOptions {
  /** Total session length in seconds (e.g. 600 for 10 min) */
  durationSec: number;
  /** Warning lead-time in seconds (default 60s before end) */
  warnAtSec?: number;
  /** Called when timer auto-ends */
  onEnd: () => void;
  /** Start automatically (default true) */
  autoStart?: boolean;
}

/**
 * Universal session timer used by Virtual Human / Voice / Video sessions.
 * Shows a warning toast before auto-ending and forces session termination
 * at the configured plan limit (5 min Free, 10 min Plus, etc.).
 */
export function useSessionTimer({
  durationSec,
  warnAtSec = 60,
  onEnd,
  autoStart = true,
}: SessionTimerOptions) {
  const [remaining, setRemaining] = useState(durationSec);
  const [running, setRunning] = useState(autoStart);
  const warnedRef = useRef(false);
  const endedRef = useRef(false);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setRemaining((r) => {
        const next = r - 1;
        if (!warnedRef.current && next <= warnAtSec && next > 0) {
          warnedRef.current = true;
          toast.warning(`Session ends in ${warnAtSec}s`, {
            description: "Your plan limit is almost reached. Upgrade for longer sessions.",
            duration: 8000,
          });
        }
        if (next <= 0 && !endedRef.current) {
          endedRef.current = true;
          toast.info("Session ended — time limit reached.", { duration: 6000 });
          onEnd();
        }
        return Math.max(0, next);
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, warnAtSec, onEnd]);

  const start = useCallback(() => setRunning(true), []);
  const pause = useCallback(() => setRunning(false), []);
  const reset = useCallback(() => {
    warnedRef.current = false;
    endedRef.current = false;
    setRemaining(durationSec);
  }, [durationSec]);

  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");

  return {
    remaining,
    formatted: `${mm}:${ss}`,
    running,
    start,
    pause,
    reset,
    isWarning: remaining <= warnAtSec,
  };
}
