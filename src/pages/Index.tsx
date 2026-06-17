import { useEffect, useState } from "react";
import { useSEO } from "@/hooks/useSEO";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MessageThatChanged from "@/components/ui-custom/MessageThatChanged";
import ClinicalScreener from "@/components/ui-custom/ClinicalScreener";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import {
  ArrowRight, Shield, Clock, Globe2, Heart, MessageCircle, Languages, Phone,
  Activity, Brain, Sparkles, Waves, User, Building2, Stethoscope, Trophy,
  GraduationCap, Plane, TrendingDown, BarChart3, Lock, CheckCircle2, Zap,
  Users, LineChart, AlertCircle, Palette,
} from "lucide-react";
import heroImage from "@/assets/cinematic-hero.jpg";

type Audience = "individual" | "institution" | "clinic";

const AUDIENCES: Record<Audience, {
  label: string; sub: string; icon: any; hook: string; sub_hook: string;
  bullets: { icon: any; k: string; v: string }[]; cta: string; ctaTo: string;
}> = {
  individual: {
    label: "मैं अपने लिए आया हूँ",
    sub: "Individual · B2C",
    icon: User,
    hook: "अकेलापन या एंग्जायटी महसूस कर रहे हैं?",
    sub_hook: "2-मिनट का फ्री Color Brain Mapping टेस्ट लीजिए — अपने मूड का पैटर्न समझिए, फिर AI काउंसलर से बात कीजिए।",
    bullets: [
      { icon: Brain, k: "Color Brain Mapping", v: "जैसे-जैसे आप जर्नल लिखेंगे, आपका माइंड मैप शांत नीला/हरा होता जाएगा।" },
      { icon: MessageCircle, k: "2 सेकंड में जवाब", v: "कोई वेटिंग रूम नहीं — AI काउंसलर तुरंत सुनती है।" },
      { icon: Lock, k: "100% प्राइवेट", v: "एंड-टू-एंड इनक्रिप्टेड। कोई आपकी बात नहीं पढ़ सकता।" },
    ],
    cta: "5-मिनट फ्री AI थेरेपी शुरू करें",
    ctaTo: "/phone-counselor",
  },
  institution: {
    label: "संस्थान / कॉर्पोरेट के लिए",
    sub: "Universities · Startups · EdTech",
    icon: Building2,
    hook: "स्टूडेंट ड्रॉप-आउट और एम्प्लोयी बर्नआउट को 40% तक कम करें।",
    sub_hook: "Anonymous aggregated AI डैशबोर्ड से अपनी टीम या कैंपस की मेंटल हेल्थ को रियल-टाइम ट्रैक करें — privacy-first, ROI-ready।",
    bullets: [
      { icon: BarChart3, k: "Anonymous Aggregated Data", v: "“इस हफ्ते आपके 15% एम्प्लोयी बर्नआउट के कगार पर हैं।”" },
      { icon: TrendingDown, k: "−40% Drop-out / Attrition", v: "Early-warning alerts before crisis points." },
      { icon: Shield, k: "HIPAA + DPDP Compliant", v: "Individual identities never exposed. Auditable RLS logs." },
    ],
    cta: "Book a 15-min Demo",
    ctaTo: "/business",
  },
  clinic: {
    label: "डॉक्टर / क्लिनिक्स के लिए",
    sub: "Therapy Clinics · Partners",
    icon: Stethoscope,
    hook: "अपने पेशेंट्स को सेशन के बीच में भी ट्रैक करें।",
    sub_hook: "हमारा AI between-session data आपके clinical diagnosis को आसान बनाता है — DSM-5, ICD-11, PHQ-9, GAD-7 aligned।",
    bullets: [
      { icon: AlertCircle, k: "Real-time Patient Alerts", v: "“पेशेंट #24 का anxiety level कल रात 11 बजे spike हुआ था।”" },
      { icon: LineChart, k: "Structured Screening Reports", v: "PHQ-9 · GAD-7 · PCL-5 · C-SSRS — auto-scored, exportable." },
      { icon: Users, k: "Care-team Collaboration", v: "Share notes securely with co-therapists & supervisors." },
    ],
    cta: "Partner with WellMindAI",
    ctaTo: "/consultation",
  },
};

const VERTICAL_HOOKS = [
  { icon: GraduationCap, t: "University / EdTech", v: "Students के exam stress और drop-out को 40% कम करें।" },
  { icon: Building2, t: "Corporate · Startup Founders", v: "Founder burnout और employee stress को रोकें — live AI wellness data।" },
  { icon: Trophy, t: "Athletes & Coaches", v: "Performance pressure को game-winning mindset में बदलिए।" },
  { icon: Plane, t: "Study Abroad Consultants", v: "विदेश जा रहे students की cultural shock और homesickness manage कीजिए।" },
  { icon: Stethoscope, t: "Therapy Clinics", v: "Between-session AI tracking आपके diagnosis को sharper बनाती है।" },
  { icon: User, t: "Individuals", v: "अकेलेपन और anxiety के लिए — 2 सेकंड में किसी से बात करें।" },
];

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [screener, setScreener] = useState<"phq9" | "gad7" | "cssrs" | null>(null);
  const [audience, setAudience] = useState<Audience>("individual");

  useSEO({
    title: "WellMindAI — तनाव, एंग्जायटी, अकेलेपन से मुकाबला AI + Experts के साथ",
    description: "Personalized Color Brain Mapping + 2-second AI counselor in any language. Free 2-minute trial. 24/7. 100% private. For individuals, universities, corporates & clinics.",
    path: "/",
  });

  useEffect(() => {
    if (!loading && user) navigate("/dashboard", { replace: true });
  }, [user, loading, navigate]);

  const A = AUDIENCES[audience];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* ░░░ CINEMATIC HERO — Neutral, multi-audience ░░░ */}
      <section className="relative min-h-[100svh] flex items-center overflow-hidden">
        <div className="absolute inset-0 -z-20">
          <img
            src={heroImage}
            alt="A lone figure looking out over a quiet, glowing city at night"
            width={1920} height={1080}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/65 to-background" />
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_60%,rgba(34,211,238,0.22),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_30%,rgba(245,158,11,0.14),transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.7)_100%)]" />
          <div
            className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
        </div>

        {/* Floating HUD chips */}
        <motion.div
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="hidden md:flex absolute top-28 right-10 z-10 items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-400/30 bg-black/40 backdrop-blur text-[10px] uppercase tracking-[0.2em] text-cyan-300/90"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          Online · 2.7s avg pickup · 11 languages
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="hidden md:flex absolute bottom-32 left-10 z-10 items-center gap-2 px-3 py-1.5 rounded-full border border-amber-400/30 bg-black/40 backdrop-blur text-[10px] uppercase tracking-[0.2em] text-amber-300/90"
        >
          <Palette className="w-3 h-3" /> Color Brain Mapping · Live
        </motion.div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-24 md:py-28 w-full text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/15 bg-white/5 backdrop-blur-md text-[11px] uppercase tracking-[0.18em] text-white/90 mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            2:37 AM · कोई आपकी सुनने के लिए हमेशा है
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.9 }}
            className="font-display text-3xl sm:text-5xl md:text-6xl leading-[1.05] tracking-tight text-white mb-5 text-balance max-w-4xl mx-auto [text-shadow:0_2px_24px_rgba(0,0,0,0.9),0_0_16px_rgba(34,211,238,0.18)]"
          >
            तनाव, एंग्जायटी और अकेलेपन से मुकाबला —{" "}
            <span className="serif-italic bg-gradient-to-r from-cyan-200 via-sky-100 to-amber-200 bg-clip-text text-transparent">
              अब AI और Experts के साथ
            </span>
            .
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.9 }}
            className="text-base md:text-lg text-white max-w-2xl mx-auto mb-8 leading-relaxed"
          >
            Personalized <span className="text-cyan-300 font-semibold">Color Brain Mapping</span> तकनीक से अपने
            मानसिक स्वास्थ्य को track कीजिए — और सही guidance पाइए।
            <span className="block text-white/80 text-sm mt-2">CBT · DBT · ACT · DSM-5 · PHQ-9 trained · Any language · 24/7</span>
          </motion.p>

          {/* Segmentation Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.9 }}
            className="mb-8"
          >
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/60 mb-3">Choose your path · आप कौन हैं?</p>
            <div className="inline-flex flex-wrap justify-center gap-2 p-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/15">
              {(Object.keys(AUDIENCES) as Audience[]).map((k) => {
                const A2 = AUDIENCES[k];
                const active = audience === k;
                return (
                  <button
                    key={k}
                    onClick={() => {
                      setAudience(k);
                      document.getElementById("audience-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs md:text-sm font-medium transition-all ${
                      active
                        ? "bg-white text-black shadow-[0_0_30px_-5px_rgba(34,211,238,0.6)]"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <A2.icon className="w-4 h-4" />
                    {A2.label}
                  </button>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.9 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <NavLink to="/phone-counselor">
              <Button
                size="lg"
                className="group h-14 px-7 text-base font-semibold rounded-full bg-white text-black hover:bg-white/90 shadow-[0_0_60px_-10px_rgba(34,211,238,0.6)]"
              >
                <Phone className="w-5 h-5 mr-2" />
                5-मिनट फ्री AI थेरेपी
                <ArrowRight className="w-5 h-5 ml-2 transition group-hover:translate-x-0.5" />
              </Button>
            </NavLink>

            <Button
              size="lg" variant="outline"
              onClick={() => setScreener("phq9")}
              className="h-14 px-7 text-base font-semibold rounded-full bg-white/5 border-white/20 text-white hover:bg-white/10 backdrop-blur"
            >
              <Activity className="w-5 h-5 mr-2" /> 2-min Mind Check-in
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.75, duration: 1 }}
            className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] text-white/75 mt-8 uppercase tracking-[0.15em]"
          >
            <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5" /> 100% Private</span>
            <span className="flex items-center gap-1.5"><Languages className="w-3.5 h-3.5" /> Any language</span>
            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> 24 / 7</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> No sign-up</span>
          </motion.div>
        </div>
      </section>

      {/* ░░░ AUDIENCE PANEL — changes based on segmentation ░░░ */}
      <section id="audience-panel" className="relative py-20 md:py-24 bg-gradient-to-b from-background via-secondary/15 to-background">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={audience}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              <div className="text-center mb-10">
                <p className="text-[10px] uppercase tracking-[0.25em] text-primary font-bold mb-3">
                  For {A.sub}
                </p>
                <h2 className="font-display text-3xl md:text-5xl text-foreground mb-3 text-balance max-w-3xl mx-auto">
                  {A.hook}
                </h2>
                <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                  {A.sub_hook}
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-5 mb-10">
                {A.bullets.map((b, i) => (
                  <motion.div
                    key={b.k}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="p-6 rounded-2xl bg-card border border-border hover-lift"
                  >
                    <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <b.icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-display text-lg text-foreground mb-1.5">{b.k}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{b.v}</p>
                  </motion.div>
                ))}
              </div>

              <div className="text-center">
                <NavLink to={A.ctaTo}>
                  <Button size="lg" className="h-13 px-8 rounded-full bg-primary hover:bg-primary/90 shadow-elegant">
                    {A.cta} <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </NavLink>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ░░░ COLOR BRAIN MAPPING SHOWCASE ░░░ */}
      <section className="py-20 bg-card/30 border-y border-border/40">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-primary font-bold mb-3">Signature feature</p>
            <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4 text-balance">
              Color Brain Mapping — <span className="serif-italic text-primary">अपने मूड का रंग देखिए</span>
            </h2>
            <p className="text-muted-foreground mb-5 leading-relaxed">
              जैसे-जैसे आप journal लिखते हैं, हमारा AI आपके emotional patterns को colors में translate करता है —
              <span className="text-foreground font-semibold"> लाल</span> = stress,
              <span className="text-amber-500 font-semibold"> पीला</span> = anxiety,
              <span className="text-emerald-500 font-semibold"> हरा</span> = balance,
              <span className="text-sky-500 font-semibold"> नीला</span> = calm।
              समय के साथ आपका mind map शांत होते देखिए।
            </p>
            <ul className="space-y-2.5 mb-6">
              {[
                "Real-time emotional fingerprint",
                "Anonymous aggregated view for institutions",
                "Between-session insights for therapists",
                "Clinically aligned with PHQ-9 & GAD-7 scores",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" /> {t}
                </li>
              ))}
            </ul>
            <NavLink to="/journal">
              <Button variant="outline" className="rounded-full">
                <Palette className="w-4 h-4 mr-2" /> Try Color Mapping
              </Button>
            </NavLink>
          </div>

          {/* Live mock visualization */}
          <div className="relative aspect-square rounded-3xl bg-gradient-to-br from-background to-card border border-border overflow-hidden shadow-elegant">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(239,68,68,0.35),transparent_45%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,rgba(245,158,11,0.35),transparent_45%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_75%,rgba(16,185,129,0.4),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_80%,rgba(59,130,246,0.35),transparent_45%)]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.05, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="w-32 h-32 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center"
              >
                <Brain className="w-14 h-14 text-white" />
              </motion.div>
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex justify-between text-[10px] uppercase tracking-wider text-white/80">
              <span>Mon · Stress 78%</span>
              <span>Sun · Calm 64%</span>
            </div>
          </div>
        </div>
      </section>

      {/* ░░░ MESSAGE THAT CHANGED ░░░ */}
      <section className="relative py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="text-center mb-10">
            <p className="text-[10px] uppercase tracking-[0.25em] text-primary font-bold mb-3">Live scene</p>
            <h2 className="font-display text-3xl md:text-5xl text-foreground mb-3 text-balance max-w-2xl mx-auto">
              एक kind sentence लिखिए. <span className="serif-italic text-primary">देखिए कमरा बदलता है.</span>
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-lg mx-auto">
              This is what we do — except in real life, you're not the one typing. We are.
            </p>
          </div>
          <MessageThatChanged />
        </div>
      </section>

      {/* ░░░ VERTICAL HOOKS GRID — every audience ░░░ */}
      <section className="py-20 bg-card/30 border-y border-border/40">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <p className="text-[10px] uppercase tracking-[0.25em] text-primary font-bold mb-3">One platform · Many lives</p>
            <h2 className="font-display text-3xl md:text-4xl text-foreground mb-3 text-balance max-w-2xl mx-auto">
              हर इंसान, हर role के लिए mental health support
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {VERTICAL_HOOKS.map((h, i) => (
              <motion.div
                key={h.t}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="p-5 rounded-2xl bg-background border border-border hover-lift"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <h.icon className="w-4.5 h-4.5 text-primary" />
                  </div>
                  <h3 className="font-display text-base text-foreground">{h.t}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{h.v}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ░░░ CLINICAL TRUST STRIP ░░░ */}
      <section className="py-14 bg-background">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-center text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-6">
            Trained on the same frameworks your therapist uses
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-xs font-semibold text-foreground/70">
            {["CBT", "DBT", "ACT", "Motivational Interviewing", "Positive Psychology", "Crisis Intervention", "PHQ-9", "GAD-7", "PCL-5", "C-SSRS", "DSM-5", "ICD-11"].map((t) => (
              <span key={t} className="px-3 py-1 rounded-full border border-border/60 bg-card/60">{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ░░░ PRIVACY PROMISE ░░░ */}
      <section className="py-16 bg-gradient-to-b from-background to-card/30">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-5">
            <Shield className="w-7 h-7 text-primary" />
          </div>
          <h2 className="font-display text-2xl md:text-3xl text-foreground mb-3">
            आपकी बात आपकी रहती है — हमेशा।
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            End-to-end encryption · Anonymous aggregated analytics · HIPAA + DPDP compliant ·
            कोई इंसान आपकी sessions नहीं पढ़ता। Institutional dashboards सिर्फ patterns दिखाते हैं, identities नहीं।
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-xs">
            {["E2E Encrypted", "HIPAA-aligned", "DPDP Act 2023", "RLS Audit Logs", "Zero-knowledge journals"].map(t => (
              <span key={t} className="px-3 py-1.5 rounded-full bg-card border border-border text-foreground/70">
                <Lock className="w-3 h-3 inline mr-1.5" />{t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ░░░ FINAL CTA ░░░ */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-cyan-500/10 via-background to-amber-500/10" />
        <div className="max-w-3xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center p-10 md:p-14 rounded-3xl bg-card/80 backdrop-blur border border-primary/15 shadow-elegant"
          >
            <Sparkles className="w-8 h-8 text-primary mx-auto mb-4" />
            <h2 className="font-display text-3xl md:text-5xl text-foreground mb-4 text-balance">
              कुर्सी अभी भी <span className="serif-italic text-primary">गर्म</span> है.
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              5-मिनट का फ्री AI session. No credit card. No registration. सिर्फ एक ईमानदार message।
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <NavLink to="/phone-counselor">
                <Button size="lg" className="px-8 h-14 text-base font-semibold rounded-full bg-primary hover:bg-primary/90 shadow-elegant">
                  <Zap className="w-5 h-5 mr-2" /> अभी बात करें
                </Button>
              </NavLink>
              <NavLink to="/auth">
                <Button size="lg" variant="outline" className="px-8 h-14 text-base font-semibold rounded-full">
                  Create free account
                </Button>
              </NavLink>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />

      <Dialog open={!!screener} onOpenChange={(o) => !o && setScreener(null)}>
        <DialogContent className="max-w-md p-0 bg-transparent border-0 shadow-none">
          {screener && (
            <ClinicalScreener
              screener={screener}
              onClose={() => setScreener(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
