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

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {PARTNERS.map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={`relative rounded-2xl border border-white/10 p-6 bg-gradient-to-br ${p.hue} hover:border-amber-300/30 transition group overflow-hidden`}
              >
                <div className="absolute -right-6 -top-6 w-20 h-20 rounded-full bg-white/[0.03] group-hover:bg-amber-300/5 transition" />
                <div className="relative">
                  <div className="font-display text-lg text-slate-50 mb-1.5">{p.name}</div>
                  <div className="text-xs text-slate-400">{p.tag}</div>
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
