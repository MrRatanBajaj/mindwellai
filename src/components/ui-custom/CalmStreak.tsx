import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Flame, Sparkles, Trophy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Gamified daily check-in ("Calm Streak").
 * Purely client-side + localStorage — a light attention hook that gives
 * visitors an immediate, rewarding micro-action before signing up.
 */

const KEY = "wm_calm_streak_v1";

type State = { streak: number; xp: number; lastDay: string; mood?: string };

const MOODS = [
  { emoji: "🌤️", label: "Okay" },
  { emoji: "🌧️", label: "Heavy" },
  { emoji: "🌪️", label: "Anxious" },
  { emoji: "🫥", label: "Numb" },
  { emoji: "🌱", label: "Hopeful" },
];

const today = () => new Date().toISOString().slice(0, 10);
const yesterday = () => new Date(Date.now() - 864e5).toISOString().slice(0, 10);

const LEVELS = [
  { at: 0, name: "First breath" },
  { at: 30, name: "Grounded" },
  { at: 80, name: "Steady" },
  { at: 150, name: "Resilient" },
];

const CalmStreak = () => {
  const [state, setState] = useState<State>({ streak: 0, xp: 0, lastDay: "" });
  const [justChecked, setJustChecked] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  const checkedToday = state.lastDay === today();

  const level = useMemo(
    () => [...LEVELS].reverse().find((l) => state.xp >= l.at) ?? LEVELS[0],
    [state.xp],
  );
  const next = LEVELS.find((l) => l.at > state.xp);
  const progress = next ? Math.min(100, Math.round((state.xp / next.at) * 100)) : 100;

  const checkIn = (mood: string) => {
    if (checkedToday) return;
    const streak = state.lastDay === yesterday() ? state.streak + 1 : 1;
    const nextState = { streak, xp: state.xp + 10, lastDay: today(), mood };
    setState(nextState);
    setJustChecked(true);
    try { localStorage.setItem(KEY, JSON.stringify(nextState)); } catch { /* ignore */ }
    setTimeout(() => setJustChecked(false), 2600);
  };

  return (
    <section className="px-6 py-16">
      <div className="max-w-4xl mx-auto rounded-[2.5rem] border border-border bg-card p-8 md:p-10 shadow-[var(--shadow-crayon)] relative overflow-hidden">
        <div className="absolute -top-24 -right-16 h-56 w-56 rounded-full bg-primary/10 blur-3xl" aria-hidden />
        <div className="absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-accent/10 blur-3xl" aria-hidden />

        <div className="relative grid md:grid-cols-[1fr_auto] gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">
              <Sparkles className="h-3.5 w-3.5" /> 30-second daily ritual
            </div>
            <h2 className="mt-4 font-display text-3xl md:text-4xl leading-tight">
              How are you arriving today?
            </h2>
            <p className="mt-3 text-foreground/70 max-w-md">
              One tap. No account. Build a calm streak and watch small check-ins turn
              into something you can actually feel.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {MOODS.map((m) => (
                <button
                  key={m.label}
                  onClick={() => checkIn(m.label)}
                  disabled={checkedToday}
                  aria-label={`Check in feeling ${m.label}`}
                  className={`group flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 text-sm transition-all
                    ${checkedToday && state.mood === m.label ? "border-primary bg-primary/10" : ""}
                    ${checkedToday ? "opacity-60" : "hover:-translate-y-0.5 hover:border-primary hover:shadow-[0_10px_24px_-14px_hsl(var(--primary)/0.6)]"}`}
                >
                  <span className="text-lg">{m.emoji}</span>
                  <span className="text-foreground/80">{m.label}</span>
                </button>
              ))}
            </div>

            <AnimatePresence>
              {justChecked && (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 inline-flex items-center gap-2 text-sm text-primary font-medium"
                >
                  <Check className="h-4 w-4" /> +10 XP · noted, gently.
                </motion.p>
              )}
            </AnimatePresence>

            <div className="mt-6">
              <Button asChild className="h-12 px-6 rounded-full bg-primary text-primary-foreground">
                <Link to="/chat/yaro">Keep going with Yaro</Link>
              </Button>
            </div>
          </div>

          <div className="rounded-[2rem] bg-background border border-border p-6 min-w-[220px] text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <Flame className="h-9 w-9 text-primary" />
            </div>
            <p className="mt-3 font-display text-4xl">{state.streak}</p>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">day streak</p>

            <div className="mt-5 h-2 w-full rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>
            <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-foreground/70">
              <Trophy className="h-4 w-4 text-accent" /> {level.name}
            </p>
            <p className="text-xs text-muted-foreground">{state.xp} XP</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CalmStreak;
