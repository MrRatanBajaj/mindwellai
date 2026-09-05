import LandingNav from "@/components/layout/LandingNav";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Heart, Brain, Globe, Target, Eye, ArrowRight, Lock, Clock, Languages } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import wellmindLogo from "@/assets/wellmind-logo-2.png";

const fadeUp = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
};

const principles = [
  {
    icon: Heart,
    title: "Compassion before capability",
    body: "Support begins with being heard. Every conversation validates first and advises second.",
  },
  {
    icon: Brain,
    title: "Evidence, not opinion",
    body: "Framing follows CBT, DBT and ACT practice, with DSM-5 and ICD-11 language conventions.",
  },
  {
    icon: Lock,
    title: "Privacy by default",
    body: "Sessions are encrypted, isolated per person, and never sold, shared or used for advertising.",
  },
  {
    icon: Globe,
    title: "Reach over exclusivity",
    body: "Care that works from any town, in the language you actually think in, at a price that is not a barrier.",
  },
];

const commitments = [
  { icon: Clock, label: "Always open", body: "Support at 3am matters as much as support at 3pm." },
  { icon: Languages, label: "Your language", body: "Type or speak in Hindi, English, Hinglish or your mother tongue." },
  { icon: Shield, label: "Safety routed to humans", body: "Crisis language bypasses the model and goes to real helplines." },
];

const About = () => {
  useSEO({
    title: "About WellMind AI — Our mission for accessible mental health",
    description:
      "WellMind AI exists to make private, evidence-based mental health support reachable for everyone, in any language, at any hour.",
    path: "/about",
  });

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <LandingNav />

      {/* Opening statement — no faces, just the intent */}
      <section className="relative overflow-hidden">
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          animate={{ opacity: [0.75, 1, 0.75] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          style={{
            background:
              "radial-gradient(55% 45% at 15% 10%, hsl(var(--primary) / 0.14), transparent 70%), radial-gradient(50% 40% at 85% 20%, hsl(var(--accent) / 0.14), transparent 70%)",
          }}
        />
        <div className="mx-auto max-w-4xl px-6 pb-16 pt-28 text-center sm:pb-24 sm:pt-32">
          <motion.img
            src={wellmindLogo}
            alt="WellMind AI"
            width={512}
            height={512}
            className="mx-auto mb-7 h-16 w-16 rounded-2xl bg-card/90 p-2 shadow-sm backdrop-blur-md sm:h-20 sm:w-20"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          />
          <motion.h1
            {...fadeUp}
            className="font-display text-[2rem] font-semibold leading-[1.1] text-foreground sm:text-5xl md:text-6xl"
          >
            Care should never depend on
            <span className="block text-primary">where you live or what you earn.</span>
          </motion.h1>
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.55, delay: 0.12 }}
            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            WellMind AI is a mental wellness company building private, always-available support grounded in
            established clinical practice — so the distance between needing help and getting it is one tap.
          </motion.p>
          <motion.div {...fadeUp} transition={{ duration: 0.55, delay: 0.2 }} className="mt-9">
            <Button asChild size="lg" className="h-12 rounded-full px-7">
              <NavLink to="/chat/yaro">
                Start a private conversation <ArrowRight className="ml-2 h-4 w-4" />
              </NavLink>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Mission / Vision */}
      <section className="px-6 pb-4">
        <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-2">
          {[
            {
              icon: Target,
              tag: "Mission",
              title: "Remove every barrier between a person and support",
              body: "Cost, stigma, waiting lists, language and geography keep most people from ever starting. We are dismantling those one at a time with technology that stays warm, careful and clinically honest.",
            },
            {
              icon: Eye,
              tag: "Vision",
              title: "A world where checking in on your mind is ordinary",
              body: "Mental wellbeing should be as routine as a health check — quiet, unremarkable and available before a crisis, not only after one.",
            },
          ].map((c, i) => (
            <motion.article
              key={c.tag}
              {...fadeUp}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className="group rounded-[1.75rem] border border-foreground/10 bg-card p-7 shadow-sm transition-shadow hover:shadow-lg sm:p-9"
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs uppercase tracking-widest text-foreground/70">
                <c.icon className="h-3.5 w-3.5 text-primary" /> {c.tag}
              </span>
              <h2 className="mt-5 font-display text-2xl leading-snug text-foreground sm:text-[1.7rem]">{c.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">{c.body}</p>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Principles */}
      <section className="px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <motion.h2 {...fadeUp} className="font-display text-3xl text-foreground sm:text-4xl">
            What we hold to
          </motion.h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {principles.map((p, i) => (
              <motion.div
                key={p.title}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                className="rounded-2xl border border-foreground/10 bg-card/70 p-6 backdrop-blur-sm"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
                  <p.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-display text-xl text-foreground">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Commitments strip */}
      <section className="bg-secondary/40 px-6 py-14 sm:py-20">
        <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-3">
          {commitments.map((c, i) => (
            <motion.div
              key={c.label}
              {...fadeUp}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-2xl bg-card p-6 text-center shadow-sm"
            >
              <c.icon className="mx-auto mb-3 h-5 w-5 text-primary" />
              <p className="font-display text-lg text-foreground">{c.label}</p>
              <p className="mt-1.5 text-sm text-muted-foreground">{c.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Closing */}
      <section className="px-6 py-20 sm:py-28">
        <motion.div
          {...fadeUp}
          className="mx-auto max-w-3xl rounded-[2rem] bg-[#2A2522] px-7 py-14 text-center text-[#F5EFE6] sm:px-12"
        >
          <p className="font-display text-2xl leading-snug sm:text-3xl">
            “Nobody should have to explain themselves twice to be taken seriously.”
          </p>
          <p className="mt-5 text-sm text-[#F5EFE6]/60">The reason WellMind AI exists</p>
          <Button
            asChild
            size="lg"
            className="mt-8 h-12 rounded-full bg-[#F5EFE6] px-7 text-[#2A2522] hover:bg-[#F5EFE6]/90"
          >
            <NavLink to="/plans">See how it works</NavLink>
          </Button>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
