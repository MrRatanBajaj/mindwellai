import { useEffect } from "react";
import { useSEO } from "@/hooks/useSEO";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TrialChat from "@/components/ui-custom/TrialChat";
import emptyChairHero from "@/assets/empty-chair-hero.jpg";
import { motion } from "framer-motion";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  ArrowRight, Shield, Clock, Globe2, Heart, MessageCircle, Languages, Moon,
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  useSEO({
    title: "WellMindAI — Someone is always here to listen.",
    description: "A free, anonymous 2-minute chat with an AI counselor who speaks your language. No signup. Even at 2:37 AM.",
    path: "/",
  });

  useEffect(() => {
    if (!loading && user) navigate("/dashboard", { replace: true });
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* ░░░ HERO — The Empty Chair ░░░ */}
      <section className="relative pt-24 md:pt-28 pb-20 md:pb-28 overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 -z-10">
          <img
            src={emptyChairHero}
            alt="An empty wooden chair softly lit by a single lamp in a quiet room at night"
            width={1920}
            height={1080}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/55 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/85 via-background/30 to-transparent md:from-background/80 md:via-background/20" />
        </div>

        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 md:gap-14 items-center min-h-[78vh]">
          {/* Left: words */}
          <div className="text-left">
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/70 backdrop-blur border border-border/50 text-xs text-foreground/80 mb-7"
            >
              <Moon className="w-3.5 h-3.5 text-primary" />
              Even at 2:37 AM
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.1 }}
              className="font-display text-4xl sm:text-5xl md:text-6xl leading-[1.05] text-foreground mb-5 text-balance"
            >
              Someone is <span className="serif-italic text-primary">always here</span><br/> to listen.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.2 }}
              className="text-lg text-muted-foreground mb-7 max-w-md leading-relaxed"
            >
              Pull up a chair. No signup. No judgement. Two free minutes of real conversation — in any language you think in.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.3 }}
              className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground"
            >
              <span className="flex items-center gap-1.5"><Languages className="w-3.5 h-3.5 text-primary" /> Any language</span>
              <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-primary" /> 24/7, instant</span>
              <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-primary" /> Private &amp; encrypted</span>
            </motion.div>
          </div>

          {/* Right: chat */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.25 }}
          >
            <TrialChat />
            <p className="text-center text-xs text-muted-foreground/80 mt-4">
              Start typing — the timer only begins on your first message.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ░░░ ONE QUIET PROMISE ░░░ */}
      <section className="py-20 bg-secondary/30 border-y border-border/40">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">Our one promise</p>
          <h2 className="font-display text-3xl md:text-4xl text-foreground mb-5 text-balance">
            We broke the <span className="serif-italic text-primary">language barrier</span>, the <span className="serif-italic text-primary">time barrier</span>, and the <span className="serif-italic text-primary">cost barrier</span>.
          </h2>
          <p className="text-muted-foreground leading-relaxed max-w-xl mx-auto">
            Talk in Hindi, English, Hinglish, Tamil, Bengali, Marathi — whatever feels honest. At 3 AM or 3 PM. For free, or for ₹99/month if you want to stay.
          </p>
        </div>
      </section>

      {/* ░░░ THREE GENTLE PILLARS ░░░ */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-3 gap-5">
          {[
            { icon: MessageCircle, k: "The chair is always warm", v: "An AI counselor picks up in under 2 seconds. No queue, no callback, no waiting room." },
            { icon: Globe2, k: "Your language, your words", v: "Hindi, Hinglish, Tamil, Bengali — say what you mean in the words you mean it." },
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

      {/* ░░░ A DAY WITH WELLMINDAI ░░░ */}
      <section className="py-20 bg-secondary/20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">A day with WellMindAI</p>
            <h2 className="font-display text-3xl md:text-4xl text-foreground mb-3 text-balance">
              Three quiet moments. <span className="serif-italic text-primary">One calmer mind.</span>
            </h2>
          </div>

          <div className="relative">
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent -translate-x-1/2" />
            <div className="space-y-10">
              {[
                { time: "7:42 AM", title: "Morning check-in", body: "A 90-second mood log. Your journal sees the pattern before you do." },
                { time: "1:15 PM", title: "Phone a counselor", body: "Tap once. An AI specialist picks up in seconds — voice that listens, never rushes." },
                { time: "2:37 AM", title: "The chair, again", body: "When the world is asleep, someone here still isn't. Pull it closer." },
              ].map((m, i) => (
                <motion.div
                  key={m.time}
                  initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  className={`md:grid md:grid-cols-2 md:gap-10 items-center ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}
                >
                  <div className="p-6 rounded-2xl bg-card border border-border">
                    <div className="text-[10px] uppercase tracking-widest text-primary font-bold mb-2">{m.time}</div>
                    <h3 className="font-display text-xl text-foreground mb-1.5">{m.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{m.body}</p>
                  </div>
                  <div className="hidden md:flex justify-center">
                    <div className="w-3 h-3 rounded-full bg-primary ring-4 ring-primary/15" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ░░░ CTA ░░░ */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center p-12 rounded-3xl bg-gradient-to-br from-primary/10 via-card to-accent/15 border border-primary/15 shadow-elegant"
          >
            <h2 className="font-display text-4xl md:text-5xl text-foreground mb-4 text-balance">
              The chair is still <span className="serif-italic text-primary">warm</span>.
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Free 3-day trial. One real session with a specialist counselor. No credit card.
            </p>
            <NavLink to="/auth">
              <Button size="lg" className="px-8 h-14 text-base font-semibold rounded-full bg-primary hover:bg-primary/90 shadow-elegant">
                Talk Now <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </NavLink>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
