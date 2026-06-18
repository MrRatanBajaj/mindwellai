import { useEffect, useMemo, useState } from "react";
import { useSEO } from "@/hooks/useSEO";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useAuth } from "@/hooks/useAuth";
import {
  ArrowRight, Shield, Lock, Sparkles, Send, Waves, RefreshCw,
  CheckCircle2, X, Timer, Wind, HeartHandshake, Zap, Brain,
  Video, Mic, Globe2, Activity, ScanLine, Stethoscope, Languages, PhoneCall,
} from "lucide-react";

/* ───────────────── Stress-aware micro-copy ───────────────── */
const stressCopy = (n: number) => {
  if (n <= 3) return { tag: "Light load", line: "Mind feels mostly clear. Let's keep it that way.", color: "from-emerald-400 to-emerald-200" };
  if (n <= 6) return { tag: "Building up", line: "Some noise in there. 2 minutes of venting will tidy it.", color: "from-amber-400 to-amber-200" };
  if (n <= 8) return { tag: "Heavy", line: "It's a lot. Let it out — no one is judging.", color: "from-orange-500 to-amber-300" };
  return { tag: "Overflowing", line: "Don't carry this alone. Type one sentence — we'll take the rest.", color: "from-rose-500 to-orange-300" };
};

/* ───────────────── How it works ───────────────── */
const STEPS = [
  { n: "01", icon: Send, title: "Vent", body: "Start typing. Any language. No script, no rules.", accent: "text-amber-300" },
  { n: "02", icon: Waves, title: "AI Unpacks", body: "We name the feeling, find the pattern, hold the weight.", accent: "text-amber-300" },
  { n: "03", icon: RefreshCw, title: "Reset", body: "Walk away with a 60-second toolkit made for this moment.", accent: "text-amber-300" },
];

/* ───────────────── Comparison rows ───────────────── */
const COMPARE = [
  { k: "Time to relief",       a: "20–40 min audio session",     b: "120 seconds of typing" },
  { k: "Format",                a: "Pre-recorded, one-size-fits", b: "Live, hyper-personalised reply" },
  { k: "Feels like",            a: "A chore between meetings",    b: "Texting your most honest friend" },
  { k: "Signup wall",           a: "Account + paywall up front",  b: "Try it before you tell us your name" },
  { k: "When you're in crisis", a: "Schedule next week",          b: "Reply in under 3 seconds, 24/7" },
];

/* ───────────────── NGO impact partners ───────────────── */
const PARTNERS = [
  { name: "Bajaj Foundation", tag: "Flagship CSR partner · free access codes for underserved communities", hue: "from-amber-500/20 to-amber-200/5" },
];

/* ───────────────── Clinical frameworks ───────────────── */
const FRAMEWORKS = [
  { code: "DSM-5",  label: "Diagnostic Standards" },
  { code: "ICD-11", label: "Global Classification" },
  { code: "PHQ-9",  label: "Depression Scale" },
  { code: "GAD-7",  label: "Anxiety Scale" },
  { code: "PCL-5",  label: "PTSD Checklist" },
  { code: "C-SSRS", label: "Suicide Severity Rating" },
];

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [stress, setStress] = useState(6);
  const [vent, setVent] = useState("");
  const copy = useMemo(() => stressCopy(stress), [stress]);

  useSEO({
    title: "WellMindAI — Vent for 2 minutes. Reset your mind.",
    description: "Skip the meditation chore. WellMindAI is a 2-minute AI venting companion — anonymous, instant, judgment-free. Try it now without signing up.",
    path: "/",
  });

  useEffect(() => {
    if (!loading && user) navigate("/dashboard", { replace: true });
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0d12] text-slate-100">
      <Header />

      {/* ░░░ HERO ░░░ */}
      <section className="relative pt-28 md:pt-32 pb-20 overflow-hidden">
        {/* ambient backdrop */}
        <div aria-hidden className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(245,158,11,0.10),transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(56,189,248,0.08),transparent_55%)]" />
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.6) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.6) 1px,transparent 1px)", backgroundSize: "56px 56px" }} />
        </div>

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — emotional hook */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-400/25 bg-amber-400/5 text-amber-200 text-[11px] uppercase tracking-[0.18em] mb-6">
              <Sparkles className="w-3 h-3" /> 2-minute mental reset
            </div>

            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-[64px] leading-[1.04] tracking-tight text-slate-50 mb-5">
              Meditation feels like a <span className="line-through decoration-rose-400/70 decoration-[3px]">chore</span>?
              <br />
              <span className="bg-gradient-to-r from-amber-200 via-amber-300 to-amber-100 bg-clip-text text-transparent">
                Try venting.
              </span>
            </h1>

            <p className="text-base md:text-lg text-slate-300 leading-relaxed max-w-xl mb-7">
              Flush out overthinking in <span className="text-amber-300 font-semibold">120 seconds</span>.
              Type whatever's loud in your head — our AI listens, unpacks, and hands back a clean mind.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
              <Button
                size="lg"
                onClick={() => document.getElementById("vent-demo")?.scrollIntoView({ behavior: "smooth" })}
                className="group h-14 px-7 rounded-full text-base font-semibold bg-amber-300 text-slate-950 hover:bg-amber-200 shadow-[0_0_60px_-12px_rgba(245,158,11,0.55)]"
              >
                Start venting <ArrowRight className="w-5 h-5 ml-1.5 transition group-hover:translate-x-0.5" />
              </Button>

              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-emerald-400/30 bg-emerald-400/5 text-emerald-300 text-xs font-medium">
                <Lock className="w-3.5 h-3.5" />
                🔒 100% Anonymous Mode Active
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-slate-400 uppercase tracking-[0.16em]">
              <span className="flex items-center gap-1.5"><Timer className="w-3.5 h-3.5" /> 120 sec</span>
              <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> No signup to try</span>
              <span className="flex items-center gap-1.5"><Brain className="w-3.5 h-3.5" /> CBT · DBT · ACT trained</span>
            </div>
          </motion.div>

          {/* Right — interactive vent mockup */}
          <motion.div
            id="vent-demo"
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
            className="relative"
          >
            <div className="absolute -inset-6 bg-gradient-to-br from-amber-400/15 via-transparent to-cyan-400/10 blur-2xl -z-10" />
            <div className="rounded-[28px] border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-950/95 backdrop-blur-xl shadow-2xl overflow-hidden">
              {/* window chrome */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-300/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
                </div>
                <span className="text-[10px] uppercase tracking-[0.22em] text-slate-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Anonymous · End-to-end
                </span>
              </div>

              <div className="p-6">
                <label className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Vent box · 120s</label>
                <div className="relative mt-2">
                  <textarea
                    value={vent}
                    onChange={(e) => setVent(e.target.value)}
                    placeholder="Type how you feel right now…"
                    rows={6}
                    className="w-full resize-none rounded-2xl bg-slate-950/60 border border-white/10 px-4 py-3 text-[15px] leading-relaxed text-slate-100 placeholder:text-slate-500 outline-none focus:border-amber-300/50 focus:ring-2 focus:ring-amber-300/20 transition"
                  />
                  {!vent && (
                    <motion.span
                      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6, repeat: Infinity, repeatType: "reverse", duration: 1.6 }}
                      className="pointer-events-none absolute left-4 top-3 text-slate-500 text-[15px]"
                    >
                      Type how you feel right now<span className="text-amber-300">_</span>
                    </motion.span>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <Wind className="w-3.5 h-3.5 text-amber-300" /> One honest sentence is enough.
                  </div>
                  <NavLink to="/phone-counselor">
                    <Button size="sm" className="rounded-full bg-amber-300 text-slate-950 hover:bg-amber-200 h-9 px-4 font-semibold">
                      Send <Send className="w-3.5 h-3.5 ml-1.5" />
                    </Button>
                  </NavLink>
                </div>

                {/* Stress slider micro-block */}
                <div className="mt-7 rounded-2xl border border-white/10 bg-slate-950/40 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Stress level</span>
                    <span className={`text-xs font-semibold bg-gradient-to-r ${copy.color} bg-clip-text text-transparent`}>
                      {stress}/10 · {copy.tag}
                    </span>
                  </div>
                  <Slider
                    value={[stress]}
                    onValueChange={(v) => setStress(v[0])}
                    min={1} max={10} step={1}
                    className="[&_[role=slider]]:bg-amber-300 [&_[role=slider]]:border-amber-300 [&_.bg-primary]:bg-gradient-to-r [&_.bg-primary]:from-amber-400 [&_.bg-primary]:to-rose-400"
                  />
                  <motion.p
                    key={copy.line}
                    initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                    className="mt-3 text-sm text-slate-300"
                  >
                    {copy.line}
                  </motion.p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ░░░ HOW IT WORKS ░░░ */}
      <section className="py-24 border-t border-white/5 bg-[#0a0c11]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-[11px] uppercase tracking-[0.25em] text-amber-300/80 mb-3">How it works</p>
            <h2 className="font-display text-3xl md:text-5xl text-slate-50 mb-3">
              Three steps. One <span className="text-amber-300">cleaner</span> mind.
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">No onboarding wizard. No 20-question intake. Just type, breathe, reset.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 relative">
            <div className="hidden md:block absolute top-16 left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-amber-300/40 to-transparent" />
            {STEPS.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="relative rounded-3xl border border-white/10 bg-gradient-to-b from-slate-900/80 to-slate-950/60 p-7 hover:border-amber-300/30 transition"
              >
                <div className="flex items-center justify-between mb-5">
                  <span className="text-[11px] tracking-[0.25em] text-slate-500">{s.n}</span>
                  <div className="w-12 h-12 rounded-2xl bg-amber-300/10 border border-amber-300/20 flex items-center justify-center">
                    <s.icon className={`w-5 h-5 ${s.accent}`} />
                  </div>
                </div>
                <h3 className="font-display text-2xl text-slate-50 mb-2">{s.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{s.body}</p>

                {/* tiny visual */}
                {i === 0 && (
                  <div className="mt-5 rounded-xl bg-slate-950/70 border border-white/5 p-3 text-xs text-slate-400 font-mono">
                    today felt heavy<span className="animate-pulse text-amber-300">▍</span>
                  </div>
                )}
                {i === 1 && (
                  <div className="mt-5 flex items-end gap-1 h-10">
                    {[14, 24, 18, 32, 22, 36, 20, 28, 16].map((h, k) => (
                      <motion.span
                        key={k}
                        animate={{ height: [h, h + 10, h] }}
                        transition={{ duration: 1.4, repeat: Infinity, delay: k * 0.08 }}
                        className="w-1.5 rounded-full bg-gradient-to-t from-amber-300 to-amber-100"
                        style={{ height: h }}
                      />
                    ))}
                  </div>
                )}
                {i === 2 && (
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {["Box breath", "Reframe", "Walk 5m"].map((t) => (
                      <span key={t} className="px-2.5 py-1 rounded-full text-[11px] bg-amber-300/10 text-amber-200 border border-amber-300/20">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ░░░ COMPARISON MATRIX ░░░ */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-[11px] uppercase tracking-[0.25em] text-amber-300/80 mb-3">Why WellMindAI</p>
            <h2 className="font-display text-3xl md:text-5xl text-slate-50 mb-3">
              Not another <span className="text-slate-500">meditation</span> app.
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">Built for the messy 2 a.m. moments — not perfectly quiet meditation rooms.</p>
          </div>

          <div className="rounded-3xl border border-white/10 overflow-hidden bg-slate-950/40">
            <div className="grid grid-cols-3 text-xs uppercase tracking-[0.18em] text-slate-400 bg-white/[0.03] px-6 py-4">
              <span>Dimension</span>
              <span className="flex items-center gap-2 text-slate-500"><X className="w-3.5 h-3.5" /> Traditional wellness apps</span>
              <span className="flex items-center gap-2 text-amber-300"><CheckCircle2 className="w-3.5 h-3.5" /> WellMindAI</span>
            </div>
            {COMPARE.map((row, i) => (
              <div
                key={row.k}
                className={`grid grid-cols-3 items-center px-6 py-5 text-sm ${i % 2 === 0 ? "bg-white/[0.015]" : ""} border-t border-white/5`}
              >
                <span className="font-medium text-slate-200">{row.k}</span>
                <span className="text-slate-500">{row.a}</span>
                <span className="text-slate-100 font-medium">
                  <span className="bg-gradient-to-r from-amber-200 to-amber-100 bg-clip-text text-transparent">{row.b}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ░░░ VIRTUAL HUMAN AI VIDEO CALL ░░░ */}
      <section className="py-24 border-t border-white/5 bg-[#0a0c11] relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_40%,rgba(245,158,11,0.08),transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_60%,rgba(20,184,166,0.08),transparent_55%)]" />
        </div>
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          {/* Avatar card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-br from-amber-400/20 via-transparent to-teal-400/15 blur-2xl -z-10" />
            <div className="rounded-[28px] border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-950/95 backdrop-blur-xl shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
                <span className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" /> Live · Encrypted
                </span>
                <span className="text-[10px] uppercase tracking-[0.22em] text-amber-300">Aria · AI Counselor</span>
              </div>
              <div className="relative aspect-[4/5] sm:aspect-video bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 overflow-hidden">
                {/* Avatar silhouette */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-300/30 to-teal-400/30 blur-3xl scale-150" />
                    <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-gradient-to-br from-amber-200/90 via-amber-300/70 to-rose-200/60 border-4 border-white/10 shadow-2xl flex items-center justify-center">
                      <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br from-slate-900/40 to-transparent flex items-center justify-center">
                        <Stethoscope className="w-12 h-12 text-white/80" />
                      </div>
                    </div>
                  </div>
                </div>
                {/* HUD chips */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-black/50 backdrop-blur border border-white/10 text-[10px] uppercase tracking-[0.18em] text-emerald-300">● HD</span>
                  <span className="px-2.5 py-1 rounded-full bg-black/50 backdrop-blur border border-white/10 text-[10px] uppercase tracking-[0.18em] text-slate-200 flex items-center gap-1"><Languages className="w-3 h-3" /> Hindi</span>
                </div>
                <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur border border-white/10 text-[10px] tracking-[0.18em] text-slate-200">02:14</div>
                {/* Waveform */}
                <div className="absolute bottom-0 left-0 right-0 px-6 py-5 bg-gradient-to-t from-slate-950/90 to-transparent">
                  <div className="flex items-end justify-center gap-1 h-12 mb-3">
                    {[18, 28, 14, 36, 22, 40, 18, 32, 26, 38, 20, 30, 16, 34, 22].map((h, k) => (
                      <motion.span
                        key={k}
                        animate={{ height: [h, h + 14, h - 4, h] }}
                        transition={{ duration: 1.2, repeat: Infinity, delay: k * 0.07 }}
                        className="w-1.5 rounded-full bg-gradient-to-t from-amber-400 via-amber-300 to-amber-100"
                        style={{ height: h }}
                      />
                    ))}
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <button className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 flex items-center justify-center text-slate-100 transition"><Mic className="w-4 h-4" /></button>
                    <button className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 flex items-center justify-center text-slate-100 transition"><Video className="w-4 h-4" /></button>
                    <button className="w-11 h-11 rounded-full bg-rose-500 hover:bg-rose-400 flex items-center justify-center text-white transition"><PhoneCall className="w-4 h-4 rotate-[135deg]" /></button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Copy */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-300/25 bg-amber-300/5 text-amber-200 text-[11px] uppercase tracking-[0.18em] mb-5">
              <Video className="w-3 h-3" /> Virtual Human AI · Video Call
            </div>
            <h2 className="font-display text-3xl md:text-5xl text-slate-50 mb-4 leading-[1.05]">
              Face-to-face with a <span className="bg-gradient-to-r from-amber-200 to-amber-300 bg-clip-text text-transparent">human-like AI counselor</span>.
            </h2>
            <p className="text-slate-400 mb-7 max-w-lg">
              When typing isn't enough, look someone in the eyes. Hyper-realistic AI counselor, instant pickup, zero judgement, available 24/7.
            </p>

            <ul className="space-y-3 mb-8">
              {[
                { icon: HeartHandshake, t: "Face-to-Face Emotional Support", s: "Real-time micro-expressions, gentle eye contact, human warmth." },
                { icon: Timer, t: "Zero Judgement · 24/7 Availability", s: "Average pickup under 3 seconds — 3am or 3pm." },
                { icon: Globe2, t: "Break Language Barriers", s: "Hindi, English, Spanish, Tamil, Bengali — switch mid-sentence." },
              ].map(({ icon: I, t, s }) => (
                <li key={t} className="flex gap-3">
                  <span className="shrink-0 w-9 h-9 rounded-xl bg-amber-300/10 border border-amber-300/20 flex items-center justify-center">
                    <I className="w-4 h-4 text-amber-300" />
                  </span>
                  <div>
                    <div className="font-medium text-slate-100">{t}</div>
                    <div className="text-sm text-slate-400">{s}</div>
                  </div>
                </li>
              ))}
            </ul>

            <NavLink to="/phone-counselor">
              <Button
                size="lg"
                className="h-14 px-7 rounded-full text-base font-semibold bg-amber-300 text-slate-950 hover:bg-amber-200 shadow-[0_0_60px_-10px_rgba(245,158,11,0.7)] hover:shadow-[0_0_80px_-8px_rgba(245,158,11,0.9)] transition-all"
              >
                <Video className="w-5 h-5 mr-2" /> Start Free Video Consultation
              </Button>
            </NavLink>
          </motion.div>
        </div>
      </section>

      {/* ░░░ CLINICAL INTELLIGENCE SCANNER ░░░ */}
      <section className="py-24 border-t border-white/5 relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(20,184,166,0.07),transparent_60%)]" />
        </div>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-teal-300/25 bg-teal-300/5 text-teal-200 text-[11px] uppercase tracking-[0.18em] mb-4">
              <ScanLine className="w-3 h-3" /> Clinical Intelligence Scanner
            </div>
            <h2 className="font-display text-3xl md:text-5xl text-slate-50 mb-3 leading-[1.05]">
              Enterprise-grade safety, <span className="bg-gradient-to-r from-teal-200 to-amber-200 bg-clip-text text-transparent">running quietly</span> behind every chat.
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              While you chat or talk, our secure AI cross-references globally trusted psychiatric frameworks to safely evaluate your anxiety, stress or trauma — in real time.
            </p>
          </div>

          {/* Scanner dashboard */}
          <div className="relative rounded-[28px] border border-white/10 bg-gradient-to-br from-slate-900/80 to-slate-950/90 backdrop-blur-xl shadow-2xl overflow-hidden">
            {/* scanning line */}
            <motion.div
              aria-hidden
              initial={{ y: 0 }} animate={{ y: ["0%", "100%", "0%"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-0 right-0 h-24 bg-gradient-to-b from-transparent via-teal-300/15 to-transparent pointer-events-none"
            />
            <div className="grid lg:grid-cols-[1.1fr_1fr]">
              {/* Left: live signal */}
              <div className="p-7 border-b lg:border-b-0 lg:border-r border-white/5">
                <div className="flex items-center justify-between mb-5">
                  <span className="text-[11px] uppercase tracking-[0.22em] text-slate-400 flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-teal-300" /> Live Signal Analysis
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-[10px] uppercase tracking-[0.18em] text-emerald-300">Stable</span>
                </div>

                {/* waveform */}
                <div className="rounded-2xl bg-slate-950/60 border border-white/5 p-5 mb-4">
                  <div className="flex items-end gap-1 h-20">
                    {Array.from({ length: 42 }).map((_, k) => {
                      const h = 12 + ((k * 7) % 50);
                      return (
                        <motion.span
                          key={k}
                          animate={{ height: [h, h + 12, h - 4, h] }}
                          transition={{ duration: 1.6, repeat: Infinity, delay: k * 0.04 }}
                          className="w-1 rounded-full bg-gradient-to-t from-teal-400 to-amber-200"
                          style={{ height: h }}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* scoring */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { k: "Anxiety", v: 32, c: "from-emerald-400 to-emerald-200" },
                    { k: "Stress",  v: 58, c: "from-amber-400 to-amber-200" },
                    { k: "Mood",    v: 71, c: "from-teal-400 to-teal-200" },
                  ].map((m) => (
                    <div key={m.k} className="rounded-xl bg-slate-950/60 border border-white/5 p-3">
                      <div className="text-[10px] uppercase tracking-[0.18em] text-slate-400 mb-1.5">{m.k}</div>
                      <div className={`text-xl font-display bg-gradient-to-r ${m.c} bg-clip-text text-transparent`}>{m.v}<span className="text-xs text-slate-500">/100</span></div>
                      <div className="mt-2 h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full bg-gradient-to-r ${m.c}`} style={{ width: `${m.v}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: frameworks */}
              <div className="p-7">
                <div className="flex items-center justify-between mb-5">
                  <span className="text-[11px] uppercase tracking-[0.22em] text-slate-400 flex items-center gap-2">
                    <Stethoscope className="w-3.5 h-3.5 text-amber-300" /> Cross-Referencing
                  </span>
                  <span className="text-[10px] text-slate-500">6 frameworks · live</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {FRAMEWORKS.map((f, i) => (
                    <motion.div
                      key={f.code}
                      initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                      transition={{ delay: i * 0.06 }}
                      className="group relative rounded-xl border border-white/10 bg-gradient-to-br from-slate-900/80 to-slate-950/60 p-4 hover:border-teal-300/40 transition overflow-hidden"
                    >
                      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-300/40 to-transparent" />
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-display text-base text-slate-50 tracking-wide">{f.code}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-300" />
                      </div>
                      <div className="text-[11px] text-slate-400">{f.label}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Privacy banner */}
            <div className="px-6 py-4 border-t border-white/5 bg-gradient-to-r from-amber-300/10 via-teal-300/10 to-amber-300/10 flex items-center justify-center gap-3 text-sm">
              <Lock className="w-4 h-4 text-amber-300" />
              <span className="font-semibold text-slate-50">🔒 HIPAA Compliant & 100% Encrypted</span>
              <span className="hidden sm:inline text-slate-400">— zero-knowledge, never shared, never sold.</span>
            </div>
          </div>
        </div>
      </section>

      {/* ░░░ PRIVACY BAND ░░░ */}
      <section className="py-16 border-t border-white/5 bg-[#0a0c11]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-300/10 border border-amber-300/20 mb-5">
            <Shield className="w-7 h-7 text-amber-300" />
          </div>
          <h2 className="font-display text-2xl md:text-4xl text-slate-50 mb-3">
            What you say here, <span className="text-amber-300">stays here</span>.
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto mb-6">
            End-to-end encrypted. No human ever reads your sessions. Anonymous mode is on by default — no email, no phone, nothing.
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-xs">
            {["E2E Encrypted", "HIPAA-aligned", "DPDP Act 2023", "Zero-knowledge", "RLS audit logs"].map((t) => (
              <span key={t} className="px-3 py-1.5 rounded-full bg-slate-900/70 border border-white/10 text-slate-300">
                <Lock className="w-3 h-3 inline mr-1.5 text-amber-300" />{t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ░░░ SOCIAL IMPACT PARTNERS ░░░ */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-300/25 bg-amber-300/5 text-amber-200 text-[11px] uppercase tracking-[0.18em] mb-4">
              <HeartHandshake className="w-3 h-3" /> Social Impact
            </div>
            <h2 className="font-display text-3xl md:text-5xl text-slate-50 mb-3">
              Our partners hand out <span className="text-amber-300">free access codes</span>.
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              We work with NGOs and crisis lines so the people who need this most never see a paywall.
            </p>
          </div>

          <div className="flex justify-center">
            {PARTNERS.map((p) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className={`relative rounded-2xl border border-amber-300/30 p-8 bg-gradient-to-br ${p.hue} hover:border-amber-300/50 transition group overflow-hidden max-w-md w-full text-center`}
              >
                <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-amber-300/10 group-hover:bg-amber-300/20 transition" />
                <div className="relative">
                  <HeartHandshake className="w-7 h-7 text-amber-300 mx-auto mb-3" />
                  <div className="font-display text-2xl text-slate-50 mb-2">{p.name}</div>
                  <div className="text-sm text-slate-400">{p.tag}</div>
                </div>
              </motion.div>
            ))}
          </div>

          <p className="text-center text-xs text-slate-500 mt-8">
            Run an NGO, college counselling cell, or campus initiative?{" "}
            <a href="mailto:partners@wellmindai.in" className="text-amber-300 hover:underline">Request partnership codes →</a>
          </p>
        </div>
      </section>

      {/* ░░░ FINAL CTA ░░░ */}
      <section className="relative py-24 border-t border-white/5 overflow-hidden">
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-br from-amber-400/[0.07] via-transparent to-cyan-400/[0.06]" />
        <div className="max-w-3xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center p-10 md:p-14 rounded-[28px] border border-white/10 bg-gradient-to-b from-slate-900/80 to-slate-950/90 backdrop-blur shadow-2xl"
          >
            <Sparkles className="w-7 h-7 text-amber-300 mx-auto mb-4" />
            <h2 className="font-display text-3xl md:text-5xl text-slate-50 mb-3">
              The chair is still <span className="text-amber-300 italic">warm</span>.
            </h2>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">
              2 free minutes. No card, no signup. One honest sentence is all it takes.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Button
                size="lg"
                onClick={() => document.getElementById("vent-demo")?.scrollIntoView({ behavior: "smooth" })}
                className="px-8 h-14 rounded-full text-base font-semibold bg-amber-300 text-slate-950 hover:bg-amber-200 shadow-[0_0_60px_-12px_rgba(245,158,11,0.55)]"
              >
                <Zap className="w-5 h-5 mr-2" /> Vent now — free
              </Button>
              <NavLink to="/blog">
                <Button size="lg" variant="outline" className="px-8 h-14 rounded-full text-base font-semibold border-white/15 text-slate-200 hover:bg-white/5">
                  Read the blog
                </Button>
              </NavLink>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
