import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Cookie, X } from "lucide-react";
import { Link } from "react-router-dom";

const KEY = "wm-cookie-consent-v1";

export default function CookieBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      if (typeof window !== "undefined" && !localStorage.getItem(KEY)) setOpen(true);
    }, 600);
    return () => clearTimeout(t);
  }, []);

  const decide = (v: "accept" | "reject") => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ v, at: new Date().toISOString() }));
    } catch {}
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 26 }}
          className="fixed bottom-4 left-4 right-4 md:left-6 md:right-auto md:max-w-md z-[100]"
          role="dialog"
          aria-label="Cookie preferences"
        >
          <div className="rounded-2xl border border-border bg-card/95 backdrop-blur-xl shadow-elegant p-4 md:p-5">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                <Cookie className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-foreground mb-1">We use cookies</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  WellMindAI uses cookies to keep you signed in, remember your preferences, and
                  understand how the app is used. Read our{" "}
                  <Link to="/policy" className="text-primary underline-offset-2 hover:underline">
                    privacy policy
                  </Link>
                  .
                </p>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" onClick={() => decide("accept")} className="rounded-full">
                    Accept all
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => decide("reject")}
                    className="rounded-full"
                  >
                    Essential only
                  </Button>
                </div>
              </div>
              <button
                aria-label="Dismiss"
                onClick={() => decide("reject")}
                className="text-muted-foreground hover:text-foreground -mr-1 -mt-1 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
