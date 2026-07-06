import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Footer from "@/components/layout/Footer";
import LandingNav from "@/components/layout/LandingNav";
import { useSEO } from "@/hooks/useSEO";
import { Mic, MessageCircle, Sparkles, ChevronDown, Shield, Globe, BookHeart, Video, Lock, HeartHandshake, Languages, Heart, CloudRain, Users } from "lucide-react";
import YaroChat from "@/components/ui-custom/YaroChat";
import RealStoriesSection from "@/components/ui-custom/RealStoriesSection";

/* ───────── Hero ───────── */
const Hero = () => (
  <section id="home" className="pt-28 pb-16 px-6">
    <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.05fr_0.95fr] gap-10 items-center">
      <div className="text-center lg:text-left">
        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
          className="font-display text-4xl md:text-6xl font-normal leading-[1.05] text-foreground tracking-tight"
        >
          When the weight of the day feels too heavy to carry alone.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.6 }}
          className="mt-6 text-lg md:text-xl text-foreground/70 max-w-2xl lg:mx-0 mx-auto"
        >
          Grief. Anxiety. Loneliness. Burnout. Meet <strong>Yaro</strong> and <strong>Ava</strong> — your 24/7 AI companions
          trained on DSM-5, ICD-11, PHQ-9, GAD-7 & PCL-5. No judgement, in your language, whenever you need.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-3"
        >
          <Button asChild className="h-14 px-8 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-base shadow-[0_0_32px_hsl(var(--primary)/0.35)]">
            <Link to="/payment?plan=starter_weekly"><Video className="mr-2 h-5 w-5" /> Book a Video Session (₹99)</Link>
          </Button>
          <Button asChild variant="ghost" className="h-14 px-6 rounded-full text-base text-foreground/80">
            <Link to="/chat/yaro">Chat with Yaro (free)</Link>
          </Button>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="relative">
        <div className="rounded-[2rem] border border-foreground/10 bg-card/75 backdrop-blur-xl p-8 min-h-[420px] shadow-crayon flex flex-col items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/20 to-accent/10" />
          <div className="relative h-56 w-56 rounded-full bg-gradient-to-br from-emerald-100 to-teal-200 border-4 border-foreground/10 shadow-pencil flex items-center justify-center">
            <div className="text-8xl animate-float">🫂</div>
          </div>
          <p className="relative mt-6 text-sm text-muted-foreground text-center max-w-xs">Your WellMindAI companion — private, patient, always here.</p>
        </div>
      </motion.div>
    </div>
  </section>
);

/* ───────── Grief counselling section ───────── */
const GriefSection = () => (
  <section className="px-6 py-16 bg-card/40">
    <div className="max-w-6xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
          <Heart className="w-3.5 h-3.5" /> Grief support
        </div>
        <h2 className="font-display text-4xl md:text-5xl">Grief doesn't follow a timeline. Neither do we.</h2>
        <p className="mt-4 text-foreground/70">
          Whether you lost a parent last week or you're still learning to breathe years after —
          Yaro and Ava sit with you at 3 AM, at midday, whenever the wave hits. No "moving on" pressure.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-5">
        {[
          { icon: CloudRain, title: "Complicated grief", body: "Prolonged Grief Disorder patterns from DSM-5-TR are silently mapped so you're truly heard, not diagnosed." },
          { icon: HeartHandshake, title: "Anticipatory grief", body: "For caregivers and family — the exhausting mourning that begins before goodbye." },
          { icon: Users, title: "Non-death losses", body: "Divorce, estrangement, health, identity, home. Every loss counts here." },
        ].map((it) => (
          <div key={it.title} className="rounded-3xl bg-card border border-foreground/10 p-6 hover-lift">
            <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center mb-5"><it.icon className="w-6 h-6 text-secondary-foreground" /></div>
            <h3 className="font-display text-2xl mb-2">{it.title}</h3>
            <p className="text-sm text-foreground/70 leading-relaxed">{it.body}</p>
          </div>
        ))}
      </div>
      <div className="mt-10 text-center">
        <Button asChild className="h-12 px-8 rounded-full bg-primary text-primary-foreground">
          <Link to="/chat/yaro">Talk to Yaro about grief</Link>
        </Button>
      </div>
    </div>
  </section>
);

/* ───────── Yaro/Ava companion pillars ───────── */
const CompanionSection = () => (
  <section className="px-6 py-16">
    <div className="max-w-6xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <h2 className="font-display text-4xl md:text-5xl">Yaro & Ava: your no-judgement zone</h2>
        <p className="mt-4 text-foreground/70">A soft, private space to vent, reflect, or just be heard.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-5">
        {[
          { icon: Languages, title: "Speaks your language", body: "Hindi, English, Hinglish, Tamil, Bengali, Marathi, Spanish — auto-detected and mirrored." },
          { icon: HeartHandshake, title: "No unsolicited advice", body: "Pure listening, validation, and one gentle next step only when you want it." },
          { icon: Lock, title: "100% incognito", body: "Anonymous-first, encrypted, designed for honest emotional release." },
        ].map((it) => (
          <div key={it.title} className="rounded-3xl bg-card border border-foreground/10 p-6 hover-lift">
            <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center mb-5"><it.icon className="w-6 h-6 text-secondary-foreground" /></div>
            <h3 className="font-display text-2xl mb-2">{it.title}</h3>
            <p className="text-sm text-foreground/70 leading-relaxed">{it.body}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ───────── Dark cards feature grid ───────── */
const DarkCard = ({ children, className = "", side }: { children: React.ReactNode; className?: string; side?: React.ReactNode }) => (
  <div className={`grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-0 rounded-[28px] overflow-hidden bg-[#EFE3D3] ${className}`}>
    <div className="bg-[#2A2522] text-[#F5EFE6] p-8 md:p-10 min-h-[280px] flex items-center justify-center">{children}</div>
    <div className="p-8 md:p-10 flex flex-col justify-center">{side}</div>
  </div>
);

const FeatureGrid = () => (
  <section className="px-6 pb-12">
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-5">
      <DarkCard side={<>
        <h3 className="font-display text-2xl md:text-3xl text-foreground mb-3">Don't know where to start? WellMindAI does.</h3>
        <p className="text-foreground/70">Whether you're overwhelmed, grieving, or just need to talk it out — your AI counselor meets you there.</p>
      </>}>
        <div className="space-y-3 w-full max-w-xs">
          <div className="inline-block px-4 py-2 rounded-2xl bg-[#3a322d] text-sm">Hey WellMindAI!</div>
          <div className="px-4 py-3 rounded-2xl border border-[#E8B8A8]/50 text-[#F5EFE6]">Great to meet you, let's get started.</div>
        </div>
      </DarkCard>
      <DarkCard side={<>
        <h3 className="font-display text-2xl md:text-3xl text-foreground mb-3">Breakthrough insights from day one</h3>
        <p className="text-foreground/70">From your first conversation, WellMindAI connects the dots between your thoughts, feelings and behaviours.</p>
      </>}>
        <div className="text-center">
          <p className="font-display text-2xl text-[#F5EFE6] mb-3">New Insight</p>
          <div className="px-5 py-4 rounded-2xl border border-[#E8B8A8]/50 italic text-[#F5EFE6]/90 text-sm">"My sleep is really my unprocessed stress showing up differently."</div>
        </div>
      </DarkCard>
    </div>
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
      {[
        { icon: <Mic className="w-10 h-10 text-[#E8B8A8]" />, title: "Talk or text 24/7", body: "Phone-call style audio with Yaro or Ava, or just type. Whatever feels right." },
        { icon: <MessageCircle className="w-10 h-10 text-[#E8B8A8]" />, title: "Discovers your patterns", body: "Each conversation connects today's story to a pattern from last week." },
        { icon: <Sparkles className="w-10 h-10 text-[#E8B8A8]" />, title: "A thoughtful next step", body: "Come with your own agenda or let us guide you. Always one small step." },
      ].map((c, i) => (
        <div key={i} className="rounded-[28px] bg-[#EFE3D3] overflow-hidden">
          <div className="bg-[#2A2522] h-44 flex items-center justify-center">{c.icon}</div>
          <div className="p-6"><h4 className="font-display text-xl text-foreground mb-2">{c.title}</h4><p className="text-foreground/70 text-sm">{c.body}</p></div>
        </div>
      ))}
    </div>
  </section>
);

/* ───────── Live chat preview ───────── */
const ChatTherapySection = () => (
  <section className="px-6 py-20 bg-gradient-to-b from-background via-[#fdf6ec] to-background">
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-12 items-center">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 text-xs font-medium mb-5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live · no signup needed
        </div>
        <h2 className="font-display text-4xl md:text-5xl text-foreground leading-tight">
          Chat therapy with <span className="italic">Yaro</span> —<br className="hidden md:block" /> like texting a friend who actually trained for this.
        </h2>
        <p className="mt-5 text-foreground/75 leading-relaxed text-lg">
          Open the chat. Type in Hindi, English, Hinglish or any language. Yaro is trained on
          <strong> DSM-5, ICD-11, PHQ-9, GAD-7 and PCL-5</strong> — friendly on the surface, evidence-based underneath.
        </p>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
          {[
            { icon: <Globe className="w-4 h-4" />, text: "Multilingual · auto-detect" },
            { icon: <Shield className="w-4 h-4" />, text: "Encrypted · private" },
            { icon: <BookHeart className="w-4 h-4" />, text: "Clinical screeners on consent" },
          ].map((f, i) => (
            <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-card border border-border/60">
              <span className="text-emerald-600">{f.icon}</span><span className="text-foreground/80">{f.text}</span>
            </div>
          ))}
        </div>
        <div className="mt-7 flex flex-wrap gap-3">
          <Button asChild className="h-12 px-6 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white">
            <Link to="/chat/yaro">Open full chat →</Link>
          </Button>
          <Button asChild variant="outline" className="h-12 px-6 rounded-full">
            <Link to="/consultation/audio">Talk by voice instead</Link>
          </Button>
        </div>
      </div>
      <div className="relative">
        <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-emerald-200/40 via-teal-200/30 to-amber-100/40 blur-2xl" />
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
  { q: "Is this a replacement for emergency care?", a: "No. In a crisis, contact iCall 9152987821 or Vandrevala 1860-266-2345." },
];

const FAQ = () => {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="px-6 pb-24">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-display text-4xl md:text-5xl text-foreground text-center mb-10">Frequently asked</h2>
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <div key={i} className="rounded-2xl bg-[#EFE3D3] overflow-hidden">
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left">
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
        <GriefSection />
        <RealStoriesSection />
        <CompanionSection />
        <ChatTherapySection />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
