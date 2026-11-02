import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Lock, Clock, HeartHandshake, MessageCircle, Sparkles } from "lucide-react";

import avaLonely from "@/assets/hero/ava-lonely.png";
import avaBreathe from "@/assets/hero/ava-breathe.png";
import avaListening from "@/assets/hero/ava-listening.png";
import avaWelcome from "@/assets/hero/ava-welcome.png";
import yaroListening from "@/assets/hero/yaro-listening.png";
import yaroBurnout from "@/assets/hero/yaro-burnout.png";
import yaroGrowth from "@/assets/hero/yaro-growth.png";

/* ── Scene configuration: headline, copy, character and atmosphere belong together ── */
type Scene = {
  id: string;
  headline: [string, string];
  description: string;
  bubble: string;
  speaker: "Ava" | "Yaro";
  img: string;
  alt: string;
  /** tone of the environment, drawn from calm tokens */
  tone: "night" | "sky" | "lavender" | "sunset" | "warm" | "sunrise" | "future";
};

const SCENES: Scene[] = [
  {
    id: "loneliness",
    headline: ["Feeling alone?", "You don't have to be."],
    description:
      "Some days, all you need is someone who listens. Start a conversation with your AI companion, anytime you need one.",
    bubble: "You don't have to pretend you're okay here. Want to talk?",
    speaker: "Ava",
    img: avaLonely,
    alt: "Ava, the AI companion, sitting thoughtfully and looking toward you",
    tone: "night",
  },
  {
    id: "overthinking",
    headline: ["Too many thoughts?", "Let's untangle them."],
    description:
      "Slow down your thoughts, explore what's bothering you and find a little clarity, one conversation at a time.",
    bubble: "Take a breath. What's the one thing weighing on your mind?",
    speaker: "Yaro",
    img: yaroListening,
    alt: "Yaro, the AI companion, listening attentively with a reassuring expression",
    tone: "sky",
  },
  {
    id: "anxiety",
    headline: ["When everything feels overwhelming,", "start with one breath."],
    description:
      "Explore calming exercises and simple techniques to help you navigate stressful moments.",
    bubble: "Let's take this one moment at a time. Breathe with me.",
    speaker: "Ava",
    img: avaBreathe,
    alt: "Ava guiding a calm breathing exercise, hand resting on her heart",
    tone: "lavender",
  },
  {
    id: "burnout",
    headline: ["Running on empty?", "It's okay to pause."],
    description:
      "Give yourself permission to slow down. Check in with your feelings and make space for yourself.",
    bubble: "You've been carrying a lot lately. How are you really feeling?",
    speaker: "Yaro",
    img: yaroBurnout,
    alt: "Yaro sitting casually with a compassionate, gentle expression",
    tone: "sunset",
  },
  {
    id: "expression",
    headline: ["Some feelings are hard to say.", "Start anywhere."],
    description:
      "A private, judgment-free space to express your thoughts without worrying about what others think.",
    bubble: "I'm listening. You can tell me what's on your mind.",
    speaker: "Ava",
    img: avaListening,
    alt: "Ava making warm eye contact, mid-conversation, hands open",
    tone: "warm",
  },
  {
    id: "growth",
    headline: ["Small steps.", "A better relationship with yourself."],
    description:
      "Build healthier habits, reflect on your emotions and discover new ways to take care of your wellbeing.",
    bubble: "Look how far you've come. What's one thing you're proud of today?",
    speaker: "Yaro",
    img: yaroGrowth,
    alt: "Yaro smiling confidently, celebrating personal progress",
    tone: "sunrise",
  },
  {
    id: "always",
    headline: ["Your feelings don't follow a schedule.", "Neither does support."],
    description:
      "Whenever you need to talk, reflect or simply feel heard, your AI companion is here.",
    bubble: "Hey, I'm here. What's happening?",
    speaker: "Ava",
    img: avaWelcome,
    alt: "Ava standing and welcoming you like a video call, warm smile",
    tone: "future",
  },
];

const SCENE_MS = 6500;

/** Per-scene environment: soft light pools and floating orbs, all from calm tokens. */
const TONES: Record<Scene["tone"], { wash: string; orbs: string[] }> = {
  night: {
    wash: "bg-[radial-gradient(120%_90%_at_70%_0%,hsl(var(--accent)/0.28),transparent_60%),radial-gradient(90%_70%_at_20%_100%,hsl(var(--calm-lavender)/0.85),transparent_65%)]",
    orbs: ["hsl(var(--calm-sky))", "hsl(var(--calm-lavender))", "hsl(var(--accent))"],
  },
  sky: {
    wash: "bg-[radial-gradient(120%_90%_at_70%_0%,hsl(var(--calm-sky)/0.9),transparent_60%),radial-gradient(90%_70%_at_20%_100%,hsl(var(--calm-lavender)/0.7),transparent_65%)]",
    orbs: ["hsl(var(--calm-sky))", "hsl(var(--accent))", "hsl(var(--calm-lavender))"],
  },
  lavender: {
    wash: "bg-[radial-gradient(120%_90%_at_70%_0%,hsl(var(--calm-lavender)),transparent_60%),radial-gradient(90%_70%_at_20%_100%,hsl(var(--calm-sky)/0.8),transparent_65%)]",
    orbs: ["hsl(var(--calm-lavender))", "hsl(var(--calm-sky))", "hsl(var(--primary))"],
  },
  sunset: {
    wash: "bg-[radial-gradient(120%_90%_at_70%_0%,hsl(var(--calm-sand)),transparent_60%),radial-gradient(90%_70%_at_20%_100%,hsl(var(--calm-sage-light)/0.9),transparent_65%)]",
    orbs: ["hsl(var(--calm-sand))", "hsl(var(--calm-warm))", "hsl(var(--calm-sage))"],
  },
  warm: {
    wash: "bg-[radial-gradient(120%_90%_at_70%_0%,hsl(var(--calm-warm)),transparent_60%),radial-gradient(90%_70%_at_20%_100%,hsl(var(--calm-lavender)/0.8),transparent_65%)]",
    orbs: ["hsl(var(--calm-warm))", "hsl(var(--calm-lavender))", "hsl(var(--calm-sand))"],
  },
  sunrise: {
    wash: "bg-[radial-gradient(120%_90%_at_70%_0%,hsl(var(--calm-sage-light)),transparent_60%),radial-gradient(90%_70%_at_20%_100%,hsl(var(--calm-sand)/0.9),transparent_65%)]",
    orbs: ["hsl(var(--calm-sage-light))", "hsl(var(--calm-sand))", "hsl(var(--primary))"],
  },
  future: {
    wash: "bg-[radial-gradient(120%_90%_at_70%_0%,hsl(var(--accent)/0.3),transparent_60%),radial-gradient(90%_70%_at_20%_100%,hsl(var(--calm-sky)/0.9),transparent_65%)]",
    orbs: ["hsl(var(--calm-sky))", "hsl(var(--accent))", "hsl(var(--calm-lavender))"],
  },
};

const SCENE_LABELS: Record<Scene["id"], string> = {
  loneliness: "Loneliness",
  overthinking: "Overthinking",
  anxiety: "Anxiety",
  burnout: "Burnout",
  expression: "Expressing",
  growth: "Growing",
  always: "Anytime",
};

/* ── Hero ── */
const HeroScenes = () => {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const scene = SCENES[active];
  const tone = TONES[scene.tone];
  const activeRef = useRef(active);
  activeRef.current = active;
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  /* Preload the next scene's character so transitions never blank */
  useEffect(() => {
    const next = SCENES[(active + 1) % SCENES.length];
    const img = new Image();
    img.src = next.img;
  }, [active]);

  /* Auto-rotate; stops while the visitor interacts and for reduced motion */
  const go = useCallback((dir: 1 | -1) => {
    setActive((a) => (a + dir + SCENES.length) % SCENES.length);
  }, []);

  useEffect(() => {
    if (reduceMotion || paused) return;
    const t = window.setInterval(() => go(1), SCENE_MS);
    return () => window.clearInterval(t);
  }, [reduceMotion, paused, go, active]);

  return (
    <section
      id="home"
      className="relative pt-24 pb-16 px-4 sm:px-6 overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      aria-roledescription="carousel"
      aria-label="WellMindAI stories"
    >
      {/* ambient page glow */}
      <div className="absolute -top-32 -left-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl" aria-hidden />
      <div className="absolute top-24 -right-24 h-96 w-96 rounded-full bg-accent/10 blur-3xl" aria-hidden />

      <div className="relative max-w-6xl mx-auto grid items-center gap-10 lg:grid-cols-[1.05fr_1fr]">
        {/* ── LEFT: synced headline storytelling ── */}
        <div className="text-center lg:text-left order-1">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-foreground/70"
          >
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            Free to start · no signup · 100% private
          </motion.div>

          <div className="mt-6 min-h-[13rem] sm:min-h-[11.5rem]" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.div
                key={scene.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: reduceMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                <h1 className="font-display text-4xl md:text-6xl font-normal leading-[1.06] text-foreground tracking-tight text-balance">
                  {scene.headline[0]}
                  <span className="block mt-1 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                    {scene.headline[1]}
                  </span>
                </h1>
                <p className="mt-5 text-lg md:text-xl text-foreground/70 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  {scene.description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* CTAs stay put while stories change */}
          <div className="mt-9 flex flex-wrap items-center justify-center lg:justify-start gap-3">
            <Button asChild size="lg" className="h-14 px-8 rounded-full text-base shadow-[0_18px_40px_-18px_hsl(var(--primary)/0.8)]">
              <Link to="/chat/yaro"><MessageCircle className="mr-2 h-5 w-5" /> Start talking — free</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-14 px-6 rounded-full text-base border-border bg-card">
              <Link to="/#features"><Sparkles className="mr-2 h-5 w-5" /> Explore WellMindAI</Link>
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4 text-primary" /> Available 24/7</span>
            <span className="inline-flex items-center gap-1.5"><Lock className="h-4 w-4 text-primary" /> Private conversations</span>
            <span className="inline-flex items-center gap-1.5"><HeartHandshake className="h-4 w-4 text-primary" /> No judgment</span>
          </div>
        </div>

        {/* ── RIGHT: floating character inside a living environment ── */}
        <div className="order-2 relative">
          {/* environment layer */}
          <motion.div
            aria-hidden
            initial={false}
            animate={{ opacity: [0.85, 1, 0.85] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -inset-4 rounded-[3rem] bg-card/40 border border-border/60 overflow-hidden"
          >
            <div className={`absolute inset-0 transition-all duration-1000 ${tone.wash}`} />
            {/* floating orbs */}
            <motion.span
              className="absolute left-[12%] top-[18%] h-24 w-24 rounded-full blur-2xl opacity-50"
              style={{ background: tone.orbs[0] }}
              animate={reduceMotion ? undefined : { y: [0, -16, 0], opacity: [0.35, 0.55, 0.35] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.span
              className="absolute right-[10%] top-[10%] h-16 w-16 rounded-full blur-xl opacity-40"
              style={{ background: tone.orbs[1] }}
              animate={reduceMotion ? undefined : { y: [0, 12, 0], x: [0, -8, 0] }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.span
              className="absolute right-[22%] bottom-[16%] h-32 w-32 rounded-full blur-2xl opacity-30"
              style={{ background: tone.orbs[2] }}
              animate={reduceMotion ? undefined : { y: [0, -10, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* ground glow under the character */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 h-10 w-2/3 rounded-[100%] bg-foreground/10 blur-xl" />
          </motion.div>

          {/* character layer */}
          <div className="relative h-[30rem] sm:h-[34rem] flex items-end justify-center">
            <div className="relative z-10 max-h-full">
              <motion.div
                animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={scene.id}
                    src={scene.img}
                    alt={scene.alt}
                    width={1024}
                    height={1536}
                    draggable={false}
                    initial={{ opacity: 0, y: 28, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.98 }}
                    transition={{ duration: reduceMotion ? 0.2 : 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="max-h-[28rem] sm:max-h-[32rem] w-auto object-contain drop-shadow-[0_24px_36px_hsl(var(--foreground)/0.18)]"
                  />
                </AnimatePresence>
              </motion.div>
            </div>

            {/* floating chat bubble, synced to the scene — kept low-left so it never covers the character's face */}
            <div className="absolute inset-x-0 bottom-9 z-20 flex justify-start px-3 lg:px-8 pointer-events-none">
              <AnimatePresence mode="wait">
                <motion.div
                  key={scene.id}
                  initial={{ opacity: 0, y: 14, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.97 }}
                  transition={{ duration: reduceMotion ? 0 : 0.45, delay: reduceMotion ? 0 : 0.25 }}
                  className="max-w-[19rem] rounded-2xl rounded-bl-md border border-border bg-card/90 backdrop-blur-md px-4 py-3 shadow-[var(--shadow-crayon)]"
                >
                  <p className="text-[11px] font-medium uppercase tracking-wider text-primary">
                    {scene.speaker}
                  </p>
                  <p className="mt-1 text-sm text-foreground/85 leading-snug">{scene.bubble}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* scene indicators */}
          <div className="relative z-20 mt-4 flex items-center justify-center gap-2" role="tablist" aria-label="Choose a story">
            {SCENES.map((s, i) => (
              <button
                key={s.id}
                role="tab"
                aria-selected={i === active}
                aria-label={`${SCENE_LABELS[s.id]} story`}
                onClick={() => setActive(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === active ? "w-8 bg-primary" : "w-2 bg-foreground/20 hover:bg-foreground/35"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroScenes;
