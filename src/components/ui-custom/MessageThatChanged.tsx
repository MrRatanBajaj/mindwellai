import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Heart, Sparkles, ArrowRight, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import studentSad from "@/assets/student-3d-sad.png";
import studentHappy from "@/assets/student-3d-happy.png";

/**
 * "The Message That Changed Everything"
 * Visitor types replies; each reply brightens the room and the 3D student
 * crossfades from sad → hopeful. Student messages are spoken aloud via
 * the browser's SpeechSynthesis (toggleable).
 */

type Msg = { from: "student" | "you" | "ai"; text: string };

const STUDENT_BEATS = [
  "Thank you.",
  "Nobody asked me that today.",
  "I think I'll be okay tonight.",
];

const FINAL_LINE = "Imagine if someone was always available to listen.";

export default function MessageThatChanged() {
  const [step, setStep] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { from: "student", text: "Is anyone there?" },
    { from: "student", text: "I just need someone to talk to." },
    { from: "student", text: "Today was really hard." },
  ]);
  const [input, setInput] = useState("");
  const [audioOn, setAudioOn] = useState(true);
  const audioOnRef = useRef(audioOn);
  const scrollRef = useRef<HTMLDivElement>(null);
  const spokenRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    audioOnRef.current = audioOn;
    if (!audioOn && typeof window !== "undefined") {
      window.speechSynthesis?.cancel();
    }
  }, [audioOn]);

  const t = Math.min(1, step / 3);

  // Speak helper
  const speak = (text: string, opts: { voice?: "student" | "ai" } = {}) => {
    if (!audioOnRef.current || typeof window === "undefined" || !window.speechSynthesis) return;
    try {
      const u = new SpeechSynthesisUtterance(text);
      u.rate = opts.voice === "ai" ? 0.95 : 0.92;
      u.pitch = opts.voice === "ai" ? 1.05 : 0.95;
      u.volume = 0.9;
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find((v) =>
        opts.voice === "ai"
          ? /female|samantha|google.*en|zira/i.test(v.name)
          : /male|daniel|alex|google.*uk|david/i.test(v.name)
      );
      if (preferred) u.voice = preferred;
      window.speechSynthesis.speak(u);
    } catch {
      /* ignore */
    }
  };

  // Speak new student/ai messages once
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    messages.forEach((m, i) => {
      if (spokenRef.current.has(i)) return;
      if (m.from === "student" || m.from === "ai") {
        spokenRef.current.add(i);
        // small delay so it lines up with the bubble appearing
        setTimeout(() => speak(m.text, { voice: m.from === "ai" ? "ai" : "student" }), 150);
      } else {
        spokenRef.current.add(i);
      }
    });
  }, [messages]);

  useEffect(() => {
    // prime voices list on some browsers
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
    }
    return () => {
      if (typeof window !== "undefined") window.speechSynthesis?.cancel();
    };
  }, []);

  const send = () => {
    const txt = input.trim();
    if (!txt || revealed) return;
    setInput("");
    setMessages((m) => [...m, { from: "you", text: txt }]);

    const next = step;
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        { from: "student", text: STUDENT_BEATS[next] ?? STUDENT_BEATS[STUDENT_BEATS.length - 1] },
      ]);
      setStep((s) => s + 1);
    }, 900);

    if (next + 1 >= 3) {
      setTimeout(() => {
        setMessages((m) => [...m, { from: "student", text: FINAL_LINE }]);
      }, 2200);
      setTimeout(() => {
        setMessages((m) => [...m, { from: "ai", text: "Hi, I'm here for you too." }]);
        setRevealed(true);
      }, 3600);
    }
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto rounded-3xl overflow-hidden border border-border/40 shadow-elegant">
      <div className="grid md:grid-cols-[1.15fr_1fr] min-h-[640px]">
        {/* ░░░ LEFT — the room ░░░ */}
        <div
          className="relative overflow-hidden transition-colors duration-[1500ms] ease-out"
          style={{
            background: `linear-gradient(160deg,
              hsl(232 35% ${6 + t * 8}%) 0%,
              hsl(228 30% ${10 + t * 12}%) 45%,
              hsl(28 ${30 + t * 40}% ${10 + t * 22}%) 100%)`,
          }}
        >
          {/* window with moon → sunrise */}
          <div
            className="absolute top-10 left-10 w-40 h-52 rounded-md border-[6px] border-black/40 overflow-hidden shadow-inner"
            style={{
              background: `linear-gradient(180deg,
                hsl(${230 - t * 200} ${40 + t * 30}% ${8 + t * 50}%),
                hsl(${220 - t * 190} ${50 + t * 20}% ${15 + t * 35}%))`,
            }}
          >
            <motion.div
              className="absolute w-10 h-10 rounded-full bg-yellow-100/90 shadow-[0_0_30px_rgba(255,240,200,0.6)]"
              animate={{ top: 16 + t * 130, left: 18 + t * 60, opacity: 1 - t * 0.4 }}
              transition={{ duration: 1.5 }}
            />
            <div className="absolute inset-0 flex">
              <div className="flex-1 border-r-2 border-black/40" />
              <div className="flex-1" />
            </div>
            <div className="absolute inset-x-0 top-1/2 border-t-2 border-black/40" />
          </div>

          {/* clock + audio toggle */}
          <div className="absolute top-8 right-8 text-right flex flex-col items-end gap-2">
            <button
              onClick={() => setAudioOn((v) => !v)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 hover:bg-black/60 text-white/90 text-[11px] backdrop-blur transition"
              aria-label={audioOn ? "Mute voices" : "Unmute voices"}
            >
              {audioOn ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
              {audioOn ? "Voice on" : "Muted"}
            </button>
            <div
              className="text-[10px] uppercase tracking-[0.25em] transition-colors"
              style={{ color: `hsla(0,0%,100%,${0.4 + t * 0.4})` }}
            >
              {revealed ? "Sunrise" : "Night"}
            </div>
            <div
              className="font-display text-2xl md:text-3xl tabular-nums transition-colors"
              style={{ color: `hsla(0,0%,100%,${0.7 + t * 0.3})` }}
            >
              {revealed ? "5:58 AM" : "2:37 AM"}
            </div>
          </div>

          {/* lamp glow */}
          <motion.div
            className="absolute pointer-events-none"
            style={{
              top: "28%",
              left: "50%",
              width: 420,
              height: 420,
              marginLeft: -210,
              borderRadius: "9999px",
              background: "radial-gradient(circle, hsla(36,90%,70%,0.55) 0%, transparent 65%)",
              filter: "blur(10px)",
            }}
            animate={{ opacity: 0.3 + t * 0.55, scale: 1 + t * 0.15 }}
            transition={{ duration: 1.2 }}
          />

          {/* 3D student character — crossfade sad → happy */}
          <div className="absolute inset-x-0 bottom-0 flex justify-center pointer-events-none">
            <div className="relative w-[78%] max-w-[420px] aspect-square">
              <motion.img
                src={studentSad}
                alt="Student feeling lonely at 2:37 AM"
                className="absolute inset-0 w-full h-full object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.55)]"
                animate={{ opacity: 1 - t, y: revealed ? 0 : [0, -3, 0] }}
                transition={{ opacity: { duration: 1 }, y: { duration: 4, repeat: Infinity } }}
              />
              <motion.img
                src={studentHappy}
                alt="Student feeling hopeful at sunrise"
                className="absolute inset-0 w-full h-full object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.4)]"
                initial={{ opacity: 0 }}
                animate={{ opacity: t }}
                transition={{ duration: 1 }}
              />
            </div>
          </div>

          {/* plant — browns → greens */}
          <div className="absolute" style={{ bottom: "14%", right: "6%" }}>
            <div className="w-14 h-10 rounded-b-2xl bg-stone-700" />
            <motion.div
              className="absolute -top-10 left-1/2 -translate-x-1/2 w-3 h-12 rounded-full"
              animate={{ backgroundColor: `hsl(${90 + t * 40} ${30 + t * 50}% ${20 + t * 25}%)` }}
              transition={{ duration: 1.2 }}
            />
            <motion.div
              className="absolute -top-8 left-2 w-8 h-5 rounded-full -rotate-45"
              animate={{ backgroundColor: `hsl(${100 + t * 30} ${30 + t * 50}% ${22 + t * 25}%)` }}
            />
            <motion.div
              className="absolute -top-8 right-2 w-8 h-5 rounded-full rotate-45"
              animate={{ backgroundColor: `hsl(${100 + t * 30} ${30 + t * 50}% ${22 + t * 25}%)` }}
            />
          </div>

          {/* floor shadow */}
          <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

          {/* floating thought from student */}
          <AnimatePresence>
            {!revealed && (
              <motion.div
                key={`thought-${step}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 0.95, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute left-6 top-[42%] max-w-[15rem]"
              >
                <div className="px-4 py-2.5 rounded-2xl rounded-bl-sm bg-white/95 text-stone-900 text-sm shadow-lg backdrop-blur">
                  {messages.filter((m) => m.from === "student").slice(-1)[0]?.text}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* reveal */}
          <AnimatePresence>
            {revealed && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 bg-gradient-to-b from-transparent via-background/30 to-background/70"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur text-xs font-semibold text-stone-900 mb-4">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" /> WellMindAI
                </div>
                <h3 className="font-display text-3xl md:text-4xl text-white drop-shadow-lg max-w-md leading-tight">
                  Everyone needs someone who listens.
                </h3>
                <p className="mt-3 text-white/85 max-w-sm text-sm">
                  Talk instantly. No registration. Any language. 24/7.
                </p>
                <NavLink to="/auth" className="mt-6">
                  <Button size="lg" className="rounded-full px-7 h-12 bg-white text-stone-900 hover:bg-white/90">
                    Start free 2-minute conversation <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </NavLink>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ░░░ RIGHT — chat panel ░░░ */}
        <div className="flex flex-col bg-card/95 backdrop-blur">
          <div className="px-5 py-4 border-b border-border/60 flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
              <Heart className="w-4 h-4 text-primary" />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-card animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">A stranger</p>
              <p className="text-[11px] text-muted-foreground">
                {revealed ? "Calmer now · thanks to you" : "Online · needs someone"}
              </p>
            </div>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Anonymous</span>
          </div>

          <div
            ref={scrollRef}
            className="flex-1 px-4 py-4 space-y-3 overflow-y-auto bg-background/40 min-h-[420px] max-h-[500px]"
          >
            <AnimatePresence initial={false}>
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  className={`flex ${m.from === "you" ? "justify-end" : "justify-start"}`}
                >
                  {m.from === "ai" ? (
                    <div className="max-w-[85%] px-4 py-2.5 rounded-2xl rounded-bl-sm text-sm bg-gradient-to-br from-primary/15 to-accent/15 text-foreground border border-primary/20">
                      <span className="text-[10px] uppercase tracking-widest text-primary font-semibold block mb-1">
                        WellMindAI
                      </span>
                      {m.text}
                    </div>
                  ) : (
                    <div
                      className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        m.from === "you"
                          ? "bg-primary text-primary-foreground rounded-br-sm"
                          : "bg-secondary text-foreground rounded-bl-sm"
                      }`}
                    >
                      {m.text}
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {!revealed && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
              className="p-3 border-t border-border/60 flex items-end gap-2"
            >
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                rows={1}
                placeholder="Type a reply… any language"
                className="flex-1 resize-none bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground/70 max-h-24"
              />
              <Button type="submit" size="icon" className="rounded-full shrink-0" disabled={!input.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </form>
          )}

          {revealed && (
            <div className="p-4 border-t border-border/60 bg-secondary/40 text-center">
              <p className="text-xs text-muted-foreground mb-3">
                You just changed someone's night. Imagine if someone was always there for you too.
              </p>
              <NavLink to="/auth">
                <Button className="rounded-full px-6">
                  Start free 2-min chat <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
