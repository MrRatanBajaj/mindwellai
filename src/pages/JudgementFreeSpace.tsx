import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import LandingNav from "@/components/layout/LandingNav";
import Footer from "@/components/layout/Footer";
import { useSEO } from "@/hooks/useSEO";
import { Heart, Brain, Sparkles, Lock, Compass, Leaf, MessageCircle, Quote } from "lucide-react";
import judgementArt from "@/assets/judgement-feather.png";
import logoAsset from "@/assets/wellmindai-logo.jpeg.asset.json";

const pillars = [
  {
    icon: Heart,
    title: "Remembers your story",
    body: "Every conversation builds on the last. Your context, your pace, your language — never re-explained.",
  },
  {
    icon: Compass,
    title: "Grows with you",
    body: "As your goals shift, the guidance shifts. Today's grounding becomes tomorrow's reflection prompt.",
  },
  {
    icon: Lock,
    title: "Private by design",
    body: "Encrypted at rest, isolated per user, never sold. Your journal stays yours.",
  },
  {
    icon: Leaf,
    title: "Gentle, not clinical",
    body: "No diagnoses, no scoreboards. Just a steady voice that meets you where you are.",
  },
  {
    icon: Brain,
    title: "Evidence-informed",
    body: "Drawn from CBT, DBT and ACT — translated into small, human-sized next steps.",
  },
  {
    icon: MessageCircle,
    title: "Talk or type, 24/7",
    body: "Voice with Yaro or Riya, or text when words are easier. Whatever feels right tonight.",
  },
];

const JudgementFreeSpace = () => {
  useSEO({
    title: "A judgement-free space — WellMindAI",
    description:
      "WellMindAI is a judgement-free space that remembers your stories and grows with you. Honest reflection, gentle guidance, evidence-informed care.",
    path: "/judgement-free-space",
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingNav />
      <main className="pt-24">
        {/* Hero */}
        <section className="px-6 pb-12">
          <div className="max-w-5xl mx-auto text-center">
            <img
              src={logoAsset.url}
              alt="WellMindAI"
              width={96}
              height={96}
              className="mx-auto h-20 w-20 object-contain mb-6"
            />
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="font-display text-4xl md:text-6xl leading-[1.05] tracking-tight"
            >
              A judgement-free space <br className="hidden md:inline" />
              that grows with you
            </motion.h1>
            <p className="mt-6 text-lg text-foreground/70 max-w-2xl mx-auto">
              WellMindAI greets you exactly where you are — remembering your stories, preferences
              and progress — so every conversation picks up where you left off. As you evolve,
              your guidance evolves with you.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button asChild className="h-12 px-7 rounded-full bg-[#2A2522] hover:bg-[#2A2522]/90 text-[#F5EFE6]">
                <Link to="/auth">Start free <Sparkles className="ml-1.5 h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="ghost" className="h-12 px-5 rounded-full text-foreground/80">
                <Link to="/consultation">Meet Yaro & Riya</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Feature image card */}
        <section className="px-6 pb-12">
          <div className="max-w-6xl mx-auto rounded-[28px] bg-[#EFE3D3] p-8 md:p-14 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="font-display text-3xl md:text-4xl leading-tight">
                Honest reflection. At your own pace.
              </h2>
              <p className="mt-4 text-foreground/75 leading-relaxed">
                Above all, WellMindAI is a space designed for honest reflection and growth. No
                streak-shaming, no pop-ups telling you how you should feel. Just a quiet
                companion that listens — and remembers — so you don't have to start over each
                time the weight returns.
              </p>
              <blockquote className="mt-6 border-l-2 border-foreground/30 pl-4 italic text-foreground/80">
                <Quote className="w-4 h-4 inline mr-1 opacity-50" />
                "I came back after two weeks and it picked up exactly where I left off. Like a
                friend who actually remembered."
                <div className="not-italic text-sm text-foreground/60 mt-2">— Priya, 28</div>
              </blockquote>
            </div>
            <div className="flex items-center justify-center h-[320px] md:h-[400px]">
              <img
                src={judgementArt}
                alt="Hand-drawn peacock feather — judgement-free growth"
                className="max-h-full w-auto object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
              />
            </div>
          </div>
        </section>

        {/* Pillars grid */}
        <section className="px-6 pb-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl text-center mb-10">
              What "judgement-free" actually means
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {pillars.map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-[24px] bg-[#EFE3D3] p-7"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#2A2522] text-[#F5EFE6] flex items-center justify-center mb-4">
                    <p.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-display text-xl mb-2">{p.title}</h3>
                  <p className="text-foreground/70 text-sm leading-relaxed">{p.body}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 pb-24">
          <div className="max-w-4xl mx-auto rounded-[28px] bg-[#2A2522] text-[#F5EFE6] p-10 md:p-14 text-center">
            <h2 className="font-display text-3xl md:text-4xl mb-4">
              Your first conversation is free.
            </h2>
            <p className="text-[#F5EFE6]/80 max-w-xl mx-auto mb-7">
              No card. No pressure. Just open the door and see how it feels.
            </p>
            <Button asChild className="h-12 px-8 rounded-full bg-[#F5EFE6] text-[#2A2522] hover:bg-[#F5EFE6]/90">
              <Link to="/auth">Start free</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default JudgementFreeSpace;
