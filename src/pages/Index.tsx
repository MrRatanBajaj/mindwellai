import { useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { FeedbackForm } from "@/components/ui-custom/FeedbackForm";
import { motion } from "framer-motion";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  ArrowRight, Shield, Clock, Sparkles, Target, Compass, Users, Quote, Star,
  CheckCircle2, Building2, Globe, TrendingUp, BarChart3, Brain, GraduationCap,
  Lock, HeartHandshake, LineChart, Briefcase, Mail, PiggyBank, Rocket,
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) navigate("/dashboard", { replace: true });
  }, [user, loading, navigate]);

  const metrics = [
    { value: "10,400+", label: "Sessions delivered", trend: "+38% MoM" },
    { value: "₹1.2 Cr", label: "Projected ARR FY26", trend: "Bottom-up" },
    { value: "23", label: "AI specialist counselors", trend: "Phone · Voice · Video" },
    { value: "4.9★", label: "User satisfaction", trend: "n=2,140" },
  ];

  const partners = [
    "NIMH", "WHO", "iCall TISS", "Vandrevala", "Mind UK", "SAMHSA",
  ];

  const testimonials = [
    { name: "Aarav S.", role: "Student, Pune", quote: "WellMindAI carried me through exam season. The phone counselor at 1 AM felt like a real human.", rating: 5 },
    { name: "Priya M.", role: "Working professional", quote: "Talking to an AI counselor during a panic attack changed everything. It's a therapist in my pocket.", rating: 5 },
    { name: "Dr. Rohan K.", role: "Therapist", quote: "I recommend WellMindAI as between-session support. The self-help library is genuinely high quality.", rating: 5 },
  ];

  const traction = [
    { icon: Rocket, k: "Growth", v: "38% MoM active users" },
    { icon: HeartHandshake, k: "Retention", v: "62% week-4 retention" },
    { icon: PiggyBank, k: "Unit economics", v: "₹78 CAC · ₹3,200 LTV" },
    { icon: GraduationCap, k: "Campus reach", v: "120+ colleges via ambassadors" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* ░░░ HERO ░░░ */}
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-secondary/40 via-background to-background" />
          <motion.div
            className="absolute -top-32 -left-24 w-[520px] h-[520px] rounded-full opacity-40"
            style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.18), transparent 70%)" }}
            animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 12, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-40 -right-20 w-[600px] h-[600px] rounded-full opacity-30"
            style={{ background: "radial-gradient(circle, hsl(var(--accent) / 0.25), transparent 70%)" }}
            animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 14, repeat: Infinity, delay: 1 }}
          />
        </div>

        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/20 text-foreground/80 text-xs font-medium mb-6 backdrop-blur">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                India's investor-backed mental wellness platform
              </div>

              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl leading-[1.02] text-foreground mb-6">
                Mental healthcare that <span className="serif-italic text-primary">picks up</span><br />
                at 3 in the morning.
              </h1>

              <p className="text-lg text-muted-foreground mb-9 max-w-xl leading-relaxed">
                23 specialist AI counselors. Auto-connecting phone calls. Evidence-based therapy at one-tenth the cost of a clinic — built for the 970M Indians without access to a therapist.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-10">
                <NavLink to="/auth">
                  <Button size="lg" className="w-full sm:w-auto px-8 h-14 text-base font-semibold rounded-full bg-primary hover:bg-primary/90 shadow-elegant">
                    Start free trial <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </NavLink>
                <a href="#investors">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 h-14 text-base rounded-full border-primary/30 hover:bg-primary/5">
                    <Briefcase className="w-5 h-5 mr-2 text-primary" /> For investors
                  </Button>
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
                {[
                  { icon: Shield, label: "HIPAA-grade privacy" },
                  { icon: Clock, label: "24/7 available" },
                  { icon: CheckCircle2, label: "Evidence-based" },
                ].map((s) => (
                  <div key={s.label} className="flex items-center gap-2">
                    <s.icon className="w-4 h-4 text-primary" /> {s.label}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right: investor metric card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="lg:col-span-5"
          >
            <div className="relative">
              <div className="absolute -inset-3 bg-gradient-to-br from-primary/15 to-accent/30 rounded-[2rem] blur-2xl" />
              <div className="relative rounded-[2rem] bg-card/90 backdrop-blur-xl border border-border/50 shadow-elegant p-7">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
                    <LineChart className="w-3.5 h-3.5 text-primary" /> Live traction
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-accent/30 text-accent-foreground">
                    FY26 · YTD
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {metrics.map((m) => (
                    <div key={m.label} className="p-4 rounded-2xl bg-secondary/50 border border-border/40">
                      <div className="text-2xl md:text-3xl font-display text-foreground">{m.value}</div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">{m.label}</div>
                      <div className="text-[10px] text-primary mt-1.5 font-medium">{m.trend}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-5 p-3 rounded-xl bg-gradient-to-r from-primary/10 to-accent/15 text-xs text-foreground/80 border border-primary/15">
                  Pre-seed open · ₹2.5 Cr SAFE · 18-mo runway
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ░░░ THE PROBLEM ░░░ */}
      <section className="py-24 bg-secondary/30">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">The opportunity</p>
          <h2 className="font-display text-4xl md:text-5xl text-foreground mb-6 max-w-3xl mx-auto text-balance">
            India has <span className="serif-italic text-primary">0.75</span> psychiatrists per 100,000 people. The WHO recommends 3.
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
            150 million Indians need active mental healthcare. Less than 30 million can afford or access it. We're closing that gap with AI counselors that cost ₹99/month instead of ₹2,500/session.
          </p>

          <div className="mt-12 grid md:grid-cols-3 gap-4">
            {[
              { stat: "150M", label: "Indians needing care" },
              { stat: "₹2,500", label: "Avg therapist session cost" },
              { stat: "₹99", label: "WellMindAI starting price" },
            ].map((s) => (
              <div key={s.label} className="p-6 rounded-2xl bg-card border border-border/50">
                <div className="text-4xl font-display text-primary mb-1">{s.stat}</div>
                <div className="text-sm text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ░░░ PRODUCT PILLARS ░░░ */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">What we built</p>
            <h2 className="font-display text-4xl md:text-5xl text-foreground mb-4">A pocket-sized mental health clinic</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: Brain, title: "23 AI Specialists", desc: "From teen counselors to grief specialists — phone, voice & video sessions." },
              { icon: HeartHandshake, title: "Auto Phone Call", desc: "ElevenLabs powered phone-style sessions. Picks up in seconds." },
              { icon: Target, title: "Self-Help Library", desc: "Curated NIMH/WHO/SAMHSA exercises, guided journeys, and quizzes." },
              { icon: Compass, title: "Private Journal", desc: "Mood tracking, streaks, AI-generated insights — yours alone." },
              { icon: Shield, title: "HIPAA-grade", desc: "RLS audit logging, encrypted at rest, isolated per user." },
              { icon: GraduationCap, title: "Campus Network", desc: "120+ colleges live through our Campus Ambassador program." },
            ].map((f, i) => (
              <motion.div key={f.title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="group p-7 rounded-2xl bg-card border border-border hover-lift"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-primary-foreground transition">
                  <f.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition" />
                </div>
                <h3 className="font-display text-xl text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ░░░ INVESTORS SECTION ░░░ */}
      <section id="investors" className="py-24 bg-investor text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(hsl(var(--accent) / 0.4) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        <div className="relative max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/30 text-accent-foreground text-xs font-medium mb-4 backdrop-blur">
              <Briefcase className="w-3.5 h-3.5" /> For investors
            </div>
            <h2 className="font-display text-4xl md:text-5xl mb-4 text-balance">
              The investment thesis.
            </h2>
            <p className="text-primary-foreground/75 max-w-2xl mx-auto text-lg">
              Mental health is India's next 10x healthcare category. We're building the infrastructure layer.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {traction.map((t) => (
              <div key={t.k} className="p-6 rounded-2xl bg-foreground/8 backdrop-blur border border-foreground/10">
                <t.icon className="w-7 h-7 text-accent mb-3" />
                <div className="text-xs uppercase tracking-widest opacity-70 mb-1">{t.k}</div>
                <div className="font-display text-xl">{t.v}</div>
              </div>
            ))}
          </div>

          {/* Market Opportunity — TAM / SAM / SOM */}
          <div className="mb-10">
            <div className="text-accent text-xs uppercase tracking-widest font-semibold mb-4 text-center">Market Opportunity</div>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { k: "TAM", v: "₹18,000 Cr", body: "India's mental wellness market by 2030. 150M+ Indians underserved." },
                { k: "SAM", v: "₹4,500 Cr", body: "35M college students + 50M corporate professionals in high-stress roles." },
                { k: "SOM", v: "₹120 Cr", body: "5-yr capture target — Tier 1/2 colleges + IT/BPO workplace wellness." },
              ].map((b) => (
                <div key={b.k} className="p-6 rounded-2xl bg-foreground/5 backdrop-blur border border-accent/30">
                  <div className="text-accent text-[10px] uppercase tracking-widest font-bold mb-1">{b.k}</div>
                  <div className="font-display text-3xl mb-2">{b.v}</div>
                  <p className="text-primary-foreground/80 leading-relaxed text-sm">{b.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Model — 3 streams */}
          <div className="mb-10">
            <div className="text-accent text-xs uppercase tracking-widest font-semibold mb-4 text-center">Revenue Model — 3 Clean Streams</div>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { t: "B2C Subscription", p: "₹149 – ₹199 / mo", body: "High-volume student & individual plans. 30 min Tavus video + unlimited phone counseling." },
                { t: "B2B Corporate SaaS", p: "₹99 PEPM", body: "Per-Employee-Per-Month workplace wellness for offices & colleges. High margin, recurring." },
                { t: "Marketplace Commission", p: "20% cut", body: "Booking commission on physical therapist referrals for severe / clinical cases." },
              ].map((b) => (
                <div key={b.t} className="p-6 rounded-2xl bg-foreground/5 backdrop-blur border border-accent/30">
                  <div className="font-display text-lg mb-1">{b.t}</div>
                  <div className="text-accent text-sm font-semibold mb-3">{b.p}</div>
                  <p className="text-primary-foreground/80 leading-relaxed text-sm">{b.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Unit Economics */}
          <div className="mb-10 p-7 rounded-3xl bg-gradient-to-br from-accent/20 to-foreground/5 border border-accent/40 backdrop-blur">
            <div className="text-accent text-xs uppercase tracking-widest font-semibold mb-3">Unit Economics Advantage</div>
            <h3 className="font-display text-2xl md:text-3xl mb-4">Token-capped backend. Profitable from ₹149.</h3>
            <p className="text-primary-foreground/80 mb-5 max-w-3xl leading-relaxed">
              Every user's Tavus / ElevenLabs / LLM minutes are hard-capped per plan in the edge layer.
              When the cap is reached, the stream auto-disconnects and prompts an upgrade — no runaway API bills.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { k: "Tavus burn / user", v: "30 min cap" },
                { k: "Margin @ ₹149", v: "~62%" },
                { k: "Top-up", v: "₹49 / 10 min" },
                { k: "CAC", v: "₹78 (campus)" },
              ].map((x) => (
                <div key={x.k} className="p-4 rounded-xl bg-foreground/5 border border-foreground/10">
                  <div className="text-[10px] uppercase tracking-widest text-primary-foreground/60">{x.k}</div>
                  <div className="font-display text-xl mt-1">{x.v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Moat + GTM */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl bg-foreground/5 backdrop-blur border border-accent/30">
              <div className="text-accent text-xs uppercase tracking-widest font-semibold mb-2">Technology & Moat</div>
              <p className="text-primary-foreground/85 leading-relaxed text-sm">
                Exclusive workflow combining real-time Tavus video avatars, ElevenLabs phone-style audio,
                and our privacy-first “Hide the Thought” release tool. 23 specialist counselor agents
                trained on 10K+ session corpus — not easily cloneable.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-foreground/5 backdrop-blur border border-accent/30">
              <div className="text-accent text-xs uppercase tracking-widest font-semibold mb-2">Go-To-Market</div>
              <p className="text-primary-foreground/85 leading-relaxed text-sm">
                <strong className="text-primary-foreground">Phase 1:</strong> 1–2 engineering colleges + 1 mid-sized IT firm
                using our 100-hr Tavus credit grant — zero-cost proof of concept.
                <strong className="text-primary-foreground"> Phase 2:</strong> Campus Ambassador network scale-out.
              </p>
            </div>
          </div>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="mailto:invest@wellmindai.in">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 h-14 rounded-full font-semibold shadow-gold">
                <Mail className="w-5 h-5 mr-2" /> Talk to the founder
              </Button>
            </a>
            <NavLink to="/about">
              <Button size="lg" variant="outline" className="bg-transparent border-foreground/30 text-primary-foreground hover:bg-foreground/10 px-8 h-14 rounded-full">
                Read the deck →
              </Button>
            </NavLink>
          </div>
        </div>
      </section>

      {/* ░░░ VISION & MISSION ░░░ */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: Target, title: "Our vision", body: "A world where every person — regardless of income, geography, or language — has a calm, judgment-free space to care for their mind." },
              { icon: Compass, title: "Our mission", body: "To make evidence-based mental healthcare feel as private and immediate as a phone call to someone who deeply understands you." },
            ].map((v, i) => (
              <motion.div key={v.title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="p-9 rounded-3xl border border-border bg-card relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-accent/10 -mr-12 -mt-12" />
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                    <v.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-display text-2xl text-foreground mb-3">{v.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{v.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ░░░ PARTNERS ░░░ */}
      <section className="py-20 bg-secondary/40">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">Backed by research</p>
          <h2 className="font-display text-3xl text-foreground mb-10">Aligned with global mental-health authorities</h2>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {partners.map((p) => (
              <div key={p} className="px-5 py-3 rounded-full bg-card border border-border/50 text-foreground/80 text-sm font-medium hover:border-primary/40 transition">
                {p}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ░░░ TESTIMONIALS ░░░ */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">Loved by 10,000+ users</p>
            <h2 className="font-display text-4xl text-foreground mb-3">Real stories. Real change.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <motion.div key={t.name}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="p-7 rounded-2xl bg-card border border-border hover-lift flex flex-col"
              >
                <Quote className="w-8 h-8 text-accent mb-4" />
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-foreground/90 leading-relaxed mb-5 flex-1 serif-italic text-lg">"{t.quote}"</p>
                <div className="pt-4 border-t border-border/50">
                  <div className="font-semibold text-foreground text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </motion.div>
            ))}
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
              Your calmer mind starts <span className="serif-italic text-primary">tonight</span>.
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Free 3-day trial. One real session with a specialist counselor. No credit card.
            </p>
            <NavLink to="/auth">
              <Button size="lg" className="px-8 h-14 text-base font-semibold rounded-full bg-primary hover:bg-primary/90 shadow-elegant">
                Create free account <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </NavLink>
          </motion.div>
        </div>
      </section>

      {/* Feedback */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-2xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl text-foreground mb-2">Help us improve</h2>
            <p className="text-muted-foreground text-sm">Your feedback shapes WellMindAI's roadmap.</p>
          </div>
          <FeedbackForm />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
