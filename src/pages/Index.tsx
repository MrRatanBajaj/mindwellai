import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Footer from "@/components/layout/Footer";
import LandingNav from "@/components/layout/LandingNav";
import { useSEO } from "@/hooks/useSEO";
import {
  Mic, MessageCircle, Sparkles, ChevronDown, Shield, Globe, BookHeart, Video, Lock,
  HeartHandshake, Languages, Heart, CloudRain, Users, Clock, Leaf, Star,
} from "lucide-react";
import YaroChat from "@/components/ui-custom/YaroChat";
import RealStoriesSection from "@/components/ui-custom/RealStoriesSection";
import CalmStreak from "@/components/ui-custom/CalmStreak";

/* ───────── Hero ───────── */
const Hero = () => (
  <section id="home" className="relative pt-28 pb-20 px-6 overflow-hidden">
    <div className="absolute -top-32 -left-24 h-80 w-80 rounded-full bg-primary/10 blur-3xl" aria-hidden />
    <div className="absolute top-10 -right-24 h-80 w-80 rounded-full bg-accent/10 blur-3xl" aria-hidden />

    <div className="relative max-w-3xl mx-auto">
      <div className="text-center">

        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-foreground/70"
        >
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          Free to start · no signup · 100% private
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
          className="mt-6 font-display text-4xl md:text-6xl font-normal leading-[1.05] text-foreground tracking-tight text-balance"
        >
          When the weight of the day feels too heavy to carry alone.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.6 }}
          className="mt-6 text-lg md:text-xl text-foreground/70 max-w-xl lg:mx-0 mx-auto"
        >
          Talk to <strong className="text-foreground">Yaro</strong> or <strong className="text-foreground">Ava</strong>.
          Any hour, any language, no judgement.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="mt-9 flex flex-wrap items-center justify-center lg:justify-start gap-3"
        >
          <Button asChild className="h-14 px-8 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-base shadow-[0_18px_40px_-18px_hsl(var(--primary)/0.8)]">
            <Link to="/chat/yaro"><MessageCircle className="mr-2 h-5 w-5" /> Start talking — free</Link>
          </Button>
          <Button asChild variant="outline" className="h-14 px-6 rounded-full text-base border-border bg-card">
            <Link to="/payment?plan=starter_weekly"><Video className="mr-2 h-5 w-5" /> Video session ₹99</Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}
          className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-sm text-muted-foreground"
        >
          <span className="inline-flex items-center gap-1.5"><Lock className="h-4 w-4 text-primary" /> Encrypted &amp; anonymous</span>
          <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4 text-primary" /> Replies in seconds, 24/7</span>
          <span className="inline-flex items-center gap-1.5"><Languages className="h-4 w-4 text-primary" /> 7+ languages</span>
        </motion.div>
      </div>

    </div>
  </section>
);

/* ───────── Trust strip ───────── */
const TrustStrip = () => (
  <section className="px-6 pb-6">
    <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3">
      {[
        { icon: Shield, k: "Clinically grounded", v: "DSM-5 · ICD-11 · PHQ-9" },
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

/* ───────── Grief counselling section ───────── */
const GriefSection = () => (
  <section className="px-6 py-20 bg-secondary/40">
    <div className="max-w-6xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card text-primary text-xs font-medium mb-4 border border-border">
          <Heart className="w-3.5 h-3.5" /> Grief support
        </div>
        <h2 className="font-display text-4xl md:text-5xl text-balance">Grief doesn't follow a timeline. Neither do we.</h2>
        <p className="mt-4 text-foreground/70">No pressure to move on. Just someone there when the wave hits.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-5">
        {[
          { icon: CloudRain, title: "Complicated grief", body: "Prolonged grief patterns are quietly mapped so you feel heard, not diagnosed." },
          { icon: HeartHandshake, title: "Anticipatory grief", body: "For caregivers — the mourning that begins long before goodbye." },
          { icon: Users, title: "Non-death losses", body: "Divorce, estrangement, health, identity, home. Every loss counts here." },
        ].map((it) => (
          <div key={it.title} className="rounded-[2rem] bg-card border border-border p-7 hover-lift">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-5"><it.icon className="w-6 h-6 text-primary" /></div>
            <h3 className="font-display text-2xl mb-2">{it.title}</h3>
            <p className="text-sm text-foreground/70 leading-relaxed">{it.body}</p>
          </div>
        ))}
      </div>
      <div className="mt-12 text-center">
        <Button asChild className="h-12 px-8 rounded-full bg-primary text-primary-foreground">
          <Link to="/chat/yaro">Talk to Yaro about grief</Link>
        </Button>
      </div>
    </div>
  </section>
);

/* ───────── Yaro/Ava companion pillars ───────── */
const CompanionSection = () => (
  <section className="px-6 py-20">
    <div className="max-w-6xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="font-display text-4xl md:text-5xl text-balance">Yaro &amp; Ava: your no-judgement zone</h2>
        <p className="mt-4 text-foreground/70">A private space to vent, reflect, or just be heard.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-5">
        {[
          { icon: Languages, title: "Speaks your language", body: "Hindi, English, Hinglish, Tamil, Bengali, Marathi, Spanish — auto-detected." },
          { icon: HeartHandshake, title: "No unsolicited advice", body: "Pure listening and validation. One gentle next step, only if you want it." },
          { icon: Lock, title: "100% incognito", body: "Anonymous-first and encrypted, built for honest emotional release." },
        ].map((it) => (
          <div key={it.title} className="rounded-[2rem] bg-card border border-border p-7 hover-lift">
            <div className="w-12 h-12 rounded-2xl bg-[hsl(var(--calm-sky))] flex items-center justify-center mb-5"><it.icon className="w-6 h-6 text-accent" /></div>
            <h3 className="font-display text-2xl mb-2">{it.title}</h3>
            <p className="text-sm text-foreground/70 leading-relaxed">{it.body}</p>
          </div>
        ))}
      </div>
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
  { n: "2", t: "2 minutes, fully free", d: "Yaro listens and quietly reads PHQ-9 / GAD-7 / PCL-5 signals." },
  { n: "3", t: "Get your Wellbeing Snapshot", d: "A real PDF report with your scores — logo, watermark, next steps." },
  { n: "4", t: "Log in and keep going", d: "Nothing you said is lost. Voice and video unlock from ₹99/week." },
];

const ChatTherapySection = () => (
  <section className="px-6 py-20 bg-gradient-to-b from-background via-secondary/30 to-background">
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-12 items-center">
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
      <div className="relative">
        <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-primary/15 via-secondary/40 to-[hsl(var(--calm-sky))]/50 blur-2xl" aria-hidden />
        <div className="relative"><YaroChat embedded /></div>
      </div>
    </div>
  </section>
);


const faqs = [
  { q: "Is chat therapy really free without signup?", a: "Yes. Open Yaro Chat from the landing page and start talking — no account needed. Voice and video plans start at ₹99/week." },
  { q: "Who are the counselors?", a: "Yaro (male, calm and grounded) and Ava (female, soft and warm). Trained on DSM-5, ICD-11, PHQ-9, GAD-7 and PCL-5." },
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
        <Hero />
        <TrustStrip />
        <CalmStreak />
        <GriefSection />
        <RealStoriesSection />
        <CompanionSection />
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
