import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Footer from "@/components/layout/Footer";
import LandingNav from "@/components/layout/LandingNav";
import { useSEO } from "@/hooks/useSEO";
import {
  Mic, MessageCircle, Sparkles, ChevronDown, Shield, Globe, Video, Lock,
  Languages, Clock, Leaf, Star,
} from "lucide-react";
import HeroScenes from "@/components/ui-custom/HeroScenes";


/* ───────── Hero: synchronized story scenes (see HeroScenes) ───────── */

/* ───────── Trust strip ───────── */
const TrustStrip = () => (
  <section className="px-6 pb-6">
    <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3">
      {[
        { icon: Shield, k: "Clinically grounded", v: "Built with psychologists" },
        { icon: Star, k: "Real stories", v: "People who kept going" },
        { icon: Globe, k: "Multilingual", v: "Hindi · Hinglish · Tamil +" },
        { icon: Leaf, k: "Gentle pace", v: "No pressure, ever" },
      ].map((t) => (
        <div key={t.k} className="rounded-3xl border border-border bg-card px-5 py-4">
          <t.icon className="h-5 w-5 text-primary" />
          <p className="mt-2 font-medium text-sm text-foreground">{t.k}</p>
          <p className="text-xs text-muted-foreground">{t.v}</p>
        </div>
      ))}
    </div>
  </section>
);

/* ───────── Feature grid ───────── */
const InkCard = ({ children, side }: { children: React.ReactNode; side: React.ReactNode }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 rounded-[2rem] overflow-hidden bg-card border border-border">
    <div className="bg-foreground text-background p-8 md:p-10 min-h-[280px] flex items-center justify-center">{children}</div>
    <div className="p-8 md:p-10 flex flex-col justify-center">{side}</div>
  </div>
);

const FeatureGrid = () => (
  <section className="px-6 pb-16">
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-5">
      <InkCard side={<>
        <h3 className="font-display text-2xl md:text-3xl text-foreground mb-3">Don't know where to start? WellMindAI does.</h3>
        <p className="text-foreground/70">Overwhelmed, grieving, or just need to talk it out — your counselor meets you there.</p>
      </>}>
        <div className="space-y-3 w-full max-w-xs">
          <div className="inline-block px-4 py-2 rounded-2xl bg-background/15 text-sm">Hey WellMindAI!</div>
          <div className="px-4 py-3 rounded-2xl border border-background/30 text-sm">Great to meet you, let's get started.</div>
        </div>
      </InkCard>
      <InkCard side={<>
        <h3 className="font-display text-2xl md:text-3xl text-foreground mb-3">Breakthrough insights from day one</h3>
        <p className="text-foreground/70">From the first conversation, WellMindAI connects your thoughts, feelings and behaviours.</p>
      </>}>
        <div className="text-center">
          <p className="font-display text-2xl mb-3">New Insight</p>
          <div className="px-5 py-4 rounded-2xl border border-background/30 italic text-sm opacity-90">"My sleep is really my unprocessed stress showing up differently."</div>
        </div>
      </InkCard>
    </div>
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
      {[
        { icon: <Mic className="w-9 h-9 text-primary" />, title: "Talk or text 24/7", body: "Phone-call style audio with Yaro or Ava, or just type." },
        { icon: <MessageCircle className="w-9 h-9 text-primary" />, title: "Discovers your patterns", body: "Each conversation links today's story to last week's." },
        { icon: <Sparkles className="w-9 h-9 text-primary" />, title: "A thoughtful next step", body: "Always one small, doable step — never a lecture." },
      ].map((c, i) => (
        <div key={i} className="rounded-[2rem] bg-card border border-border overflow-hidden hover-lift">
          <div className="bg-secondary/60 h-40 flex items-center justify-center">{c.icon}</div>
          <div className="p-6"><h4 className="font-display text-xl text-foreground mb-2">{c.title}</h4><p className="text-foreground/70 text-sm">{c.body}</p></div>
        </div>
      ))}
    </div>
  </section>
);

/* ───────── Live chat: 2 free minutes → report → account ───────── */
const steps = [
  { n: "1", t: "Say one honest sentence", d: "No form, no name. Just start." },
  { n: "2", t: "2 minutes, fully free", d: "Yaro listens, gently, without judging." },
  { n: "3", t: "Get your Wellbeing Snapshot", d: "A simple summary of how you are doing, with next steps." },
  { n: "4", t: "Log in and keep going", d: "Nothing you said is lost. Voice and video unlock from ₹99/week." },
];

const ChatTherapySection = () => (
  <section className="px-6 py-20 bg-gradient-to-b from-background via-secondary/30 to-background">
    <div className="max-w-3xl mx-auto">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-border text-primary text-xs font-medium mb-5">
          <Clock className="w-3.5 h-3.5" /> 2 minutes free · no signup · report included
        </div>
        <h2 className="font-display text-4xl md:text-5xl text-foreground leading-tight text-balance">
          Two minutes. One honest sentence. A report you can actually hold.
        </h2>
        <p className="mt-5 text-foreground/75 leading-relaxed text-lg">
          Start typing in any language. When the two minutes end, we hand you a
          Wellbeing Snapshot PDF — then you decide whether to stay.
        </p>

        <ol className="mt-8 space-y-3">
          {steps.map((s) => (
            <li key={s.n} className="flex gap-4 items-start rounded-2xl bg-card border border-border p-4">
              <span className="shrink-0 h-8 w-8 rounded-full bg-primary/12 text-primary font-medium flex items-center justify-center text-sm">
                {s.n}
              </span>
              <span>
                <span className="block text-foreground font-medium">{s.t}</span>
                <span className="block text-sm text-foreground/65 mt-0.5">{s.d}</span>
              </span>
            </li>
          ))}
        </ol>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild className="h-12 px-6 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link to="/chat/yaro">Start my 2 free minutes →</Link>
          </Button>
          <Button asChild variant="outline" className="h-12 px-6 rounded-full bg-card">
            <Link to="/consultation/audio">Rather talk out loud?</Link>
          </Button>
        </div>
      </div>
    </div>
  </section>
);


const faqs = [
  { q: "Is chat therapy really free without signup?", a: "Yes. Open Yaro Chat from the landing page and start talking — no account needed. Voice and video plans start at ₹99/week." },
  { q: "Who are the counselors?", a: "Yaro (male, calm and grounded) and Ava (female, soft and warm). Guided by proven therapy methods and reviewed by psychologists." },
  { q: "What languages do they speak?", a: "English, Hindi, Hinglish, Tamil, Bengali, Marathi, Spanish and more — auto-detected." },
  { q: "Is video counseling private?", a: "Sessions are gated by your account and privacy-first storage." },
  { q: "Is this a replacement for emergency care?", a: "No. In a crisis, contact Tele-MANAS 14416, iCall 9152987821 or Vandrevala 1860-266-2345." },
];

const FAQ = () => {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="px-6 pb-24">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-display text-4xl md:text-5xl text-foreground text-center mb-10">Frequently asked</h2>
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <div key={i} className="rounded-[1.5rem] bg-card border border-border overflow-hidden">
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left">
                <span className="font-display text-lg text-foreground">{f.q}</span>
                <ChevronDown className={`w-5 h-5 shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`} />
              </button>
              {open === i && <div className="px-5 pb-5 text-foreground/75">{f.a}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ClosingCTA = () => (
  <section className="px-6 pb-24">
    <div className="max-w-4xl mx-auto rounded-[2.5rem] bg-foreground text-background p-10 md:p-14 text-center">
      <h2 className="font-display text-3xl md:text-5xl leading-tight text-balance">You don't have to explain it perfectly. Just start.</h2>
      <p className="mt-4 opacity-80">One message is enough. Yaro takes it from there.</p>
      <Button asChild className="mt-8 h-14 px-8 rounded-full bg-background text-foreground hover:bg-background/90">
        <Link to="/chat/yaro">Start talking — free</Link>
      </Button>
    </div>
  </section>
);

const Index = () => {
  useSEO({
    title: "WellMindAI — A judgement-free space for mental wellbeing",
    description: "Talk, type or just breathe. AI counselors Yaro and Ava help with grief, anxiety, burnout, loneliness — in your language, 24/7.",
    path: "/",
  });
  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingNav />
      <main>
        <HeroScenes />
        <TrustStrip />
        <FeatureGrid />
        <ChatTherapySection />
        <FAQ />
        <ClosingCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
