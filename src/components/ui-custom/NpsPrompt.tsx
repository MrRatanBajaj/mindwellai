import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { track } from "@/lib/analytics";

const KEY = "wm_nps_done";

/** Net Promoter Score: shown once, after a visitor has spent ~90s on the site (never on checkout). */
const NpsPrompt = () => {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const k = user ? `${KEY}:${user.id}` : KEY;
    if (localStorage.getItem(k)) return;
    const t = setTimeout(() => setOpen(true), 90_000);
    return () => clearTimeout(t);
  }, [user]);

  if (!open || ["/payment", "/auth"].includes(pathname)) return null;

  const close = () => {
    localStorage.setItem(user ? `${KEY}:${user.id}` : KEY, "1");
    setOpen(false);
  };

  const submit = async () => {
    if (score === null) return;
    track("nps_submitted", { score, category: score >= 9 ? "promoter" : score >= 7 ? "passive" : "detractor", page: pathname });
    const text = comment.trim().slice(0, 1000);
    const { error } = await supabase.from("feedback").insert({
      category: "nps",
      rating: score,
      feedback: text || `NPS score ${score}`,
      suggestions: `page:${pathname}${user?.id ? ` user:${user.id}` : ""}`,
      email: user?.email ?? null,
    });
    if (error) console.error("NPS save failed", error);
    setSent(true);
    setTimeout(close, 1800);
  };

  return (
    <div className="fixed bottom-4 left-4 z-[60] w-[min(92vw,380px)] rounded-3xl border border-border bg-card p-5 shadow-elegant">
      <button onClick={close} aria-label="Close" className="absolute right-3 top-3 text-muted-foreground hover:text-foreground">
        <X className="h-4 w-4" />
      </button>
      {sent ? (
        <p className="py-4 text-center font-display text-lg text-foreground">Thank you — this helps us a lot.</p>
      ) : (
        <>
          <p className="pr-6 font-display text-lg text-foreground">How likely are you to recommend WellMindAI to a friend?</p>
          <div className="mt-4 grid grid-cols-11 gap-1">
            {Array.from({ length: 11 }, (_, i) => (
              <button
                key={i}
                onClick={() => setScore(i)}
                className={`h-8 rounded-lg text-xs font-medium transition ${score === i ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground hover:bg-secondary/70"}`}
              >
                {i}
              </button>
            ))}
          </div>
          <div className="mt-1 flex justify-between text-[10px] text-muted-foreground"><span>Not likely</span><span>Very likely</span></div>
          {score !== null && (
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={1000}
              placeholder="What's the main reason for your score? (optional)"
              className="mt-3 h-20 w-full resize-none rounded-xl border border-border bg-background p-3 text-sm"
            />
          )}
          <Button onClick={submit} disabled={score === null} className="mt-3 w-full rounded-full">Send</Button>
        </>
      )}
    </div>
  );
};

export default NpsPrompt;
