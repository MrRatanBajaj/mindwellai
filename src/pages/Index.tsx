import { useEffect, useState } from "react";
import { useSEO } from "@/hooks/useSEO";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MessageThatChanged from "@/components/ui-custom/MessageThatChanged";
import ClinicalScreener from "@/components/ui-custom/ClinicalScreener";
import { motion } from "framer-motion";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import {
  ArrowRight, Shield, Clock, Globe2, Heart, MessageCircle, Languages, Phone,
  Activity, Brain, Sparkles, Waves,
} from "lucide-react";
import heroImage from "@/assets/cinematic-hero.jpg";

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [screener, setScreener] = useState<"phq9" | "gad7" | "cssrs" | null>(null);

  useSEO({
    title: "WellMindAI — Someone is always here to listen.",
    description: "Talk to an AI counselor in under 2 seconds. Any language. 24/7. Free 2-minute conversation — no registration.",
    path: "/",
  });

  useEffect(() => {
    if (!loading && user) navigate("/dashboard", { replace: true });
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* ░░░ CINEMATIC HERO ░░░ */}
      <section className="relative min-h-[100svh] flex items-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 -z-20">
          <img
            src={heroImage}
            alt="A lone figure looking out over a quiet, glowing city at night"
            width={1920}
            height={1080}
            className="w-full h-full object-cover"
          />
          {/* Cinematic graded overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/55 to-background" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_60%,rgba(34,211,238,0.18),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_30%,rgba(245,158,11,0.12),transparent_55%)]" />
          {/* Subtle scanline grid */}
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
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="hidden md:flex absolute top-28 right-10 z-10 items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-400/30 bg-black/40 backdrop-blur text-[10px] uppercase tracking-[0.2em] text-cyan-300/90"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          Online · 2.7s avg pickup
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="hidden md:flex absolute bottom-32 left-10 z-10 items-center gap-2 px-3 py-1.5 rounded-full border border-amber-400/30 bg-black/40 backdrop-blur text-[10px] uppercase tracking-[0.2em] text-amber-300/90"
        >
          <Waves className="w-3 h-3" /> Listening in 11 languages
        </motion.div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-24 md:py-32 w-full text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/15 bg-white/5 backdrop-blur-md text-[11px] uppercase tracking-[0.18em] text-white/80 mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            2:37 AM · Somewhere, someone needs you
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.9 }}
            className="font-display text-4xl sm:text-6xl md:text-7xl leading-[1.02] tracking-tight text-white mb-5 text-balance max-w-4xl mx-auto"
          >
            Someone is always{" "}
            <span className="serif-italic bg-gradient-to-r from-cyan-300 via-sky-200 to-amber-200 bg-clip-text text-transparent">
              here to listen
            </span>
            .
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.9 }}
            className="text-base md:text-lg text-white/75 max-w-xl mx-auto mb-9 leading-relaxed"
          >
            Even at 2:37 AM. Talk to a clinically-trained AI counselor in any language —
            free, instant, no sign-up. Two minutes can change a night.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.9 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <NavLink to="/phone-counselor">
              <Button
                size="lg"
                className="group h-14 px-7 text-base font-semibold rounded-full bg-white text-black hover:bg-white/90 shadow-[0_0_60px_-10px_rgba(34,211,238,0.6)]"
              >
                <Phone className="w-5 h-5 mr-2" />
                Start 2-min free chat
                <ArrowRight className="w-5 h-5 ml-2 transition group-hover:translate-x-0.5" />
              </Button>
            </NavLink>

            <Button
              size="lg"
              variant="outline"
              onClick={() => setScreener("phq9")}
              className="h-14 px-7 text-base font-semibold rounded-full bg-white/5 border-white/20 text-white hover:bg-white/10 backdrop-blur"
            >
              <Activity className="w-5 h-5 mr-2" /> 2-minute mind check-in
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 1 }}
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] text-white/55 mt-9 uppercase tracking-[0.15em]"
          >
            <span className="flex items-center gap-1.5"><Languages className="w-3.5 h-3.5" /> Any language</span>
            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> 24 / 7</span>
            <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> End-to-end private</span>
            <span className="flex items-center gap-1.5"><Brain className="w-3.5 h-3.5" /> CBT · DBT · ACT trained</span>
          </motion.div>
        </div>
      </section>

      {/* ░░░ THE MESSAGE THAT CHANGED EVERYTHING — interactive scene ░░░ */}
      <section className="relative py-20 md:py-24 bg-gradient-to-b from-background via-secondary/15 to-background">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="text-center mb-10">
            <p className="text-[10px] uppercase tracking-[0.25em] text-primary font-bold mb-3">Live scene</p>
            <h2 className="font-display text-3xl md:text-5xl text-foreground mb-3 text-balance max-w-2xl mx-auto">
              Type one kind sentence. <span className="serif-italic text-primary">Watch the room change.</span>
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-lg mx-auto">
              This is what we do — except in real life, you're not the one typing. We are.
            </p>
          </div>
          <MessageThatChanged />
        </div>
      </section>

      {/* ░░░ CLINICAL TRUST STRIP ░░░ */}
      <section className="py-14 border-y border-border/40 bg-card/40">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-center text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-6">
            Trained on the same frameworks your therapist uses
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-xs font-semibold text-foreground/70">
            {["CBT", "DBT", "ACT", "Motivational Interviewing", "Positive Psychology", "Crisis Intervention", "PHQ-9", "GAD-7", "PCL-5", "C-SSRS", "DSM-5", "ICD-11"].map((t) => (
              <span key={t} className="px-3 py-1 rounded-full border border-border/60 bg-background/60">{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ░░░ THREE PROMISES ░░░ */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-3 gap-5">
          {[
            { icon: MessageCircle, k: "Picks up in 2 seconds", v: "Not a queue, not a callback, not a waiting room. Tap once — someone is there." },
            { icon: Globe2, k: "Your language, your words", v: "Hindi, Hinglish, Tamil, Bengali, Marathi — say what you mean in the words you mean it." },
            { icon: Heart, k: "Real humans when you're ready", v: "23 verified human therapists are one tap away when the AI isn't enough." },
          ].map((p, i) => (
            <motion.div key={p.k}
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="p-7 rounded-2xl bg-card border border-border hover-lift"
            >
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <p.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display text-lg text-foreground mb-1.5">{p.k}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{p.v}</p>
            </motion.div>
          ))}
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
              The chair is still <span className="serif-italic text-primary">warm</span>.
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Free 2-minute conversation. No credit card. No registration. Just one honest message.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <NavLink to="/phone-counselor">
                <Button size="lg" className="px-8 h-14 text-base font-semibold rounded-full bg-primary hover:bg-primary/90 shadow-elegant">
                  Talk Now <ArrowRight className="w-5 h-5 ml-2" />
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

      {/* Mind check-in dialog */}
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
