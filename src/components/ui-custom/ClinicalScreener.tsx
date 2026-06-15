import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, ShieldAlert, CheckCircle2, X, Phone } from "lucide-react";
import {
  SCREENERS,
  scoreScreener,
  type Screener,
} from "@/lib/clinicalKnowledge";

interface Props {
  screener: keyof typeof SCREENERS;
  onClose: () => void;
  onComplete?: (result: { id: string; score: number; band: string; tone: string }) => void;
}

/**
 * Conversational, one-question-at-a-time screener UI for PHQ-9 / GAD-7 / C-SSRS.
 * Strictly a screening + psychoeducation tool — never used for diagnosis.
 */
export default function ClinicalScreener({ screener, onClose, onComplete }: Props) {
  const s: Screener = SCREENERS[screener];
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [done, setDone] = useState(false);

  const current = s.items[idx];
  const progress = ((idx + (done ? 1 : 0)) / s.items.length) * 100;

  const choose = (value: number) => {
    const next = { ...answers, [current.id]: value };
    setAnswers(next);
    if (idx + 1 < s.items.length) {
      setIdx(idx + 1);
    } else {
      setDone(true);
      const r = scoreScreener(s, next);
      onComplete?.({ id: s.id, ...r });
    }
  };

  const result = done ? scoreScreener(s, answers) : null;
  const crisis = result?.tone === "crisis";

  return (
    <Card className="relative overflow-hidden border border-primary/20 bg-card/95 backdrop-blur p-6 md:p-7 rounded-2xl shadow-elegant">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center text-muted-foreground"
        aria-label="Close screener"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="mb-1 text-[10px] uppercase tracking-widest text-primary font-bold">
        Screening · not a diagnosis
      </div>
      <h3 className="font-display text-xl text-foreground mb-2">{s.title}</h3>
      <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{s.intro}</p>
      <Progress value={progress} className="h-1.5 mb-6" />

      <AnimatePresence mode="wait">
        {!done ? (
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <div className="text-xs text-muted-foreground mb-2">
              Question {idx + 1} of {s.items.length}
            </div>
            <p className="text-base md:text-lg text-foreground font-medium leading-snug mb-5">
              {current.text}
            </p>
            <div className="grid gap-2">
              {s.options.map((o) => (
                <button
                  key={o.value}
                  onClick={() => choose(o.value)}
                  className="text-left px-4 py-3 rounded-xl border border-border bg-background hover:border-primary hover:bg-primary/5 transition flex items-center justify-between group"
                >
                  <span className="text-sm font-medium">{o.label}</span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition" />
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-2"
          >
            <div
              className={`mx-auto w-14 h-14 rounded-full flex items-center justify-center mb-3 ${
                crisis ? "bg-destructive/15 text-destructive" : "bg-primary/15 text-primary"
              }`}
            >
              {crisis ? <ShieldAlert className="w-7 h-7" /> : <CheckCircle2 className="w-7 h-7" />}
            </div>
            <div className="text-3xl font-display tabular-nums mb-1">{result!.score}</div>
            <div className="text-sm font-semibold text-foreground mb-3">{result!.band}</div>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-5 leading-relaxed">
              {s.closing(result!.score, result!.band)}
            </p>

            {crisis && (
              <a
                href="tel:9152987821"
                className="inline-flex items-center gap-2 px-5 h-11 rounded-full bg-destructive text-destructive-foreground font-semibold mb-3"
              >
                <Phone className="w-4 h-4" /> Call iCall now
              </a>
            )}
            <div>
              <Button variant="outline" onClick={onClose}>Back to chat</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-[10px] text-muted-foreground text-center mt-5">
        Based on validated public-domain instruments. For screening only — please speak to a licensed clinician for diagnosis.
      </p>
    </Card>
  );
}
