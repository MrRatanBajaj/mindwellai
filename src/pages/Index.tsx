import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Footer from "@/components/layout/Footer";
import LandingNav from "@/components/layout/LandingNav";
import { useSEO } from "@/hooks/useSEO";
import { Mic, MessageCircle, Sparkles, ChevronDown } from "lucide-react";
import judgementArt from "@/assets/judgement-feather.png";

/* ───────── Hero ───────── */
const Hero = () => (
  <section id="home" className="pt-32 pb-20 px-6">
    <div className="max-w-5xl mx-auto text-center">
      <motion.h1
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
        className="font-display text-5xl md:text-7xl font-normal leading-[1.05] text-foreground tracking-tight"
      >
        AI for mental wellbeing
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.6 }}
        className="mt-6 text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto"
      >
        Talk, type, or just breathe. WellMindAI connects the dots between your thoughts,
        feelings and behaviors — one quiet conversation at a time.
      </motion.p>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        className="mt-10 flex flex-wrap items-center justify-center gap-3"
      >
        <Button asChild className="h-14 px-8 rounded-full bg-[#2A2522] hover:bg-[#2A2522]/90 text-[#F5EFE6] text-base">
          <Link to="/auth">Get started free</Link>
        </Button>
        <Button asChild variant="ghost" className="h-14 px-6 rounded-full text-base text-foreground/80">
          <Link to="/about">How it works</Link>
        </Button>
      </motion.div>
    </div>
  </section>
);

/* ───────── Dark card (talktoash-style) ───────── */
const DarkCard = ({
  children, className = "", side,
}: { children: React.ReactNode; className?: string; side?: React.ReactNode }) => (
  <div className={`grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-0 rounded-[28px] overflow-hidden bg-[#EFE3D3] ${className}`}>
    <div className="bg-[#2A2522] text-[#F5EFE6] p-8 md:p-10 min-h-[280px] flex items-center justify-center">
      {children}
    </div>
    <div className="p-8 md:p-10 flex flex-col justify-center">
      {side}
    </div>
  </div>
);

/* ───────── Cards grid section ───────── */
const FeatureGrid = () => (
  <section className="px-6 pb-12">
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-5">
      <DarkCard
        side={
          <>
            <h3 className="font-display text-2xl md:text-3xl text-foreground mb-3">
              Don't know where to start? WellMindAI does.
            </h3>
            <p className="text-foreground/70">
              Whether you're overwhelmed, curious, or just need to talk it out —
              your AI counselor meets you there.
            </p>
          </>
        }
      >
        <div className="space-y-3 w-full max-w-xs">
          <div className="inline-block px-4 py-2 rounded-2xl bg-[#3a322d] text-sm">Hey WellMindAI!</div>
          <div className="px-4 py-3 rounded-2xl border border-[#E8B8A8]/50 text-[#F5EFE6]">
            Great to meet you, let's get started.
          </div>
        </div>
      </DarkCard>

      <DarkCard
        side={
          <>
            <h3 className="font-display text-2xl md:text-3xl text-foreground mb-3">
              Breakthrough insights from day one
            </h3>
            <p className="text-foreground/70">
              From your first conversation, WellMindAI connects the dots between your
              thoughts, feelings, and behaviors to unlock new understanding.
            </p>
          </>
        }
      >
        <div className="text-center">
          <p className="font-display text-2xl text-[#F5EFE6] mb-3">New Insight</p>
          <div className="px-5 py-4 rounded-2xl border border-[#E8B8A8]/50 italic text-[#F5EFE6]/90 text-sm">
            "I'm starting to think my sleep challenges are really just my work
            stresses showing up differently."
          </div>
        </div>
      </DarkCard>
    </div>

    {/* 3-up row */}
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
      {[
        {
          icon: <Mic className="w-10 h-10 text-[#E8B8A8]" />,
          title: "Talk or text 24/7, WellMindAI listens",
          body: "Phone-call style audio with Yaro or Ava, or just type. Whatever feels right.",
        },
        {
          icon: <MessageCircle className="w-10 h-10 text-[#E8B8A8]" />,
          title: "WellMindAI discovers your patterns",
          body: "Each conversation helps connect today's story to a pattern from last week.",
        },
        {
          icon: <Sparkles className="w-10 h-10 text-[#E8B8A8]" />,
          title: "WellMindAI takes you on a journey",
          body: "Come with your own agenda or let WellMindAI guide the way. A thoughtful next step, always.",
        },
      ].map((c, i) => (
        <div key={i} className="rounded-[28px] bg-[#EFE3D3] overflow-hidden">
          <div className="bg-[#2A2522] h-44 flex items-center justify-center">{c.icon}</div>
          <div className="p-6">
            <h4 className="font-display text-xl text-foreground mb-2">{c.title}</h4>
            <p className="text-foreground/70 text-sm">{c.body}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

/* ───────── Judgement-free split ───────── */
const JudgementSection = () => (
  <section className="px-6 py-16">
    <div className="max-w-6xl mx-auto rounded-[28px] bg-[#EFE3D3] p-8 md:p-14 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
      <div>
        <h2 className="font-display text-4xl md:text-5xl text-foreground leading-tight">
          A judgement-free space that grows with you
        </h2>
        <p className="mt-5 text-foreground/75 leading-relaxed">
          WellMindAI greets you exactly where you are — remembering your stories,
          preferences and progress — so every conversation picks up where you left off.
          As you evolve, your guidance evolves too. Above all, it's a judgment-free space,
          designed for honest reflection and growth at your own pace.
        </p>
        <Link to="/judgement-free-space" className="inline-block mt-6 text-primary underline underline-offset-4 font-medium">
          Read more →
        </Link>
      </div>
      <div className="relative h-[320px] md:h-[420px] flex items-center justify-center">
        <img
          src={judgementArt}
          alt="Hand-drawn peacock feather in oil pastel and watercolor — a symbol of judgement-free growth"
          width={1024}
          height={1024}
          loading="lazy"
          className="max-h-full w-auto object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
        />
      </div>
    </div>
  </section>
);

/* ───────── FAQ ───────── */
const faqs = [
  { q: "Is the free plan really free?", a: "Yes — 7 days of text care, journaling, audio screening and a short video trial. No card needed." },
  { q: "Who are the counselors?", a: "Two AI counselors: Yaro (Soul Machines video) and Riya (Tavus video). Audio runs on Hume EVI with emotion detection or ElevenLabs for low-latency." },
  { q: "Is video counseling private?", a: "Sessions are gated by your account, server-side usage limits and privacy-first storage." },
  { q: "Can I use audio only?", a: "Yes. Audio and video live on separate pages so plan limits stay clear." },
  { q: "Is this a replacement for emergency care?", a: "No. In a crisis, contact local emergency services or a helpline right away." },
];

const FAQ = () => {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="px-6 pb-24">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-display text-4xl md:text-5xl text-foreground text-center mb-10">
          Frequently asked
        </h2>
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <div key={i} className="rounded-2xl bg-[#EFE3D3] overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="font-display text-lg text-foreground">{f.q}</span>
                <ChevronDown className={`w-5 h-5 transition-transform ${open === i ? "rotate-180" : ""}`} />
              </button>
              {open === i && <div className="px-5 pb-5 text-foreground/75">{f.a}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ───────── Page ───────── */
const Index = () => {
  useSEO({
    title: "WellMindAI — A judgement-free space for mental wellbeing",
    description: "Talk, type, or just breathe. AI counselors Yaro and Riya help you reflect, find patterns, and grow at your own pace.",
    path: "/",
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingNav />
      <main>
        <Hero />
        <FeatureGrid />
        <JudgementSection />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
