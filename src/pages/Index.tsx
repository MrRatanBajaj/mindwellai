import { useEffect } from "react";
import { useSEO } from "@/hooks/useSEO";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { ArrowRight, BookOpen, Brain, Heart, MessageCircle, Phone, ShieldCheck, Sparkles, Video } from "lucide-react";

const landingNav = [
  { label: "Home", href: "#home" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Research", href: "#research" },
];

const faqs = [
  {
    question: "Is the free plan really free?",
    answer: "Yes. You get 7 days to try WellMindAI, including text care, journaling, audio screening, and one short video trial.",
  },
  {
    question: "Who are the counselors?",
    answer: "WellMindAI keeps the experience simple with two counselors: AVA and YARO for voice and video support.",
  },
  {
    question: "Is video counseling private?",
    answer: "Sessions are protected by account access, server-side usage limits, and privacy-first storage rules.",
  },
  {
    question: "Can I use only audio?",
    answer: "Yes. Audio and video counseling now live on separate pages so each plan limit stays clear.",
  },
  {
    question: "Is this a replacement for emergency care?",
    answer: "No. If there is immediate danger, contact local emergency services or a crisis helpline right away.",
  },
];

const LandingNav = () => (
  <header className="fixed top-0 left-0 right-0 z-50 border-b border-foreground/10 bg-background/90 backdrop-blur-md">
    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
      <Link to="/" className="flex items-center gap-2" aria-label="WellMindAI home">
        <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-foreground/80 bg-card shadow-pencil">
          <span className="font-hand text-2xl leading-none text-primary">W</span>
        </span>
        <span className="font-display text-2xl font-semibold text-foreground">WellMindAI</span>
      </Link>

      <nav className="hidden items-center gap-1 rounded-full border border-foreground/10 bg-card/60 px-2 py-1 md:flex" aria-label="Landing page navigation">
        {landingNav.map((item) =>
          item.href.startsWith("#") ? (
            <a key={item.label} href={item.href} className="rounded-full px-4 py-2 text-sm font-semibold text-foreground/75 transition-colors hover:bg-secondary/70 hover:text-foreground">
              {item.label}
            </a>
          ) : (
            <Link key={item.label} to={item.href} className="rounded-full px-4 py-2 text-sm font-semibold text-foreground/75 transition-colors hover:bg-secondary/70 hover:text-foreground">
              {item.label}
            </Link>
          ),
        )}
      </nav>

      <Button asChild className="h-11 rounded-full border-2 border-foreground/80 bg-foreground px-5 font-semibold text-background shadow-pencil hover:bg-foreground/90">
        <Link to="/auth">
          Start free <Sparkles className="ml-1.5 h-4 w-4" />
        </Link>
      </Button>
    </div>
  </header>
);

const OilDoodle = () => (
  <div className="oil-doodle-wrap" aria-hidden="true">
    <svg viewBox="0 0 620 430" className="h-full w-full" role="img">
      <path className="oil-stroke oil-stroke-muted" d="M95 310 C155 170, 265 165, 280 230 C295 292, 184 326, 245 375 C315 432, 446 330, 525 202" />
      <path className="oil-stroke oil-stroke-sage" d="M85 280 C168 235, 256 250, 345 282 C430 312, 506 291, 565 230" />
      <path className="oil-stroke oil-stroke-primary" d="M207 372 C218 300, 246 254, 292 210 C342 160, 419 139, 498 104" />
      <path className="oil-stroke oil-stroke-soft" d="M384 80 C465 122, 512 172, 548 246 C575 300, 575 342, 553 382" />
      <path className="oil-stroke oil-stroke-muted oil-stroke-thin" d="M128 118 C184 70, 238 78, 276 126" />
      <path className="oil-stroke oil-stroke-muted oil-stroke-thin" d="M338 238 C393 190, 454 178, 512 190" />
    </svg>
  </div>
);

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useSEO({
    title: "WellMindAI — talk to someone, gently.",
    description: "Two counselors. One tap. Voice or video mental wellness sessions, drawn with care.",
    path: "/",
  });

  useEffect(() => {
    if (!loading && user) navigate("/dashboard", { replace: true });
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <LandingNav />

      {/* HERO — peach + sage split, hand-drawn */}
      <section id="home" className="relative flex-grow overflow-hidden pt-28 pb-16">
        {/* Sage corner wash */}
        <div aria-hidden className="absolute -top-20 -right-20 w-[40rem] h-[40rem] rounded-full bg-pastel-sage opacity-80 blur-2xl -z-10" />
        <div aria-hidden className="absolute -bottom-32 -left-20 w-[36rem] h-[36rem] rounded-full bg-pastel-cream opacity-80 blur-2xl -z-10" />

        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-[1.05fr_1fr] gap-12 items-center">
          {/* Left */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="font-hand text-3xl text-primary mb-3">hi, you.</p>
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl leading-[1.02] font-semibold mb-6 text-balance">
              A judgment-free space that grows with you.
            </h1>
            <p className="text-lg text-foreground/75 max-w-lg mb-8 leading-relaxed">
              Talk to AVA or YARO by voice or video. Calm, private support when your mind feels too full.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                size="lg"
                onClick={() => navigate("/auth")}
                className="h-14 px-7 rounded-full text-base font-semibold bg-primary text-primary-foreground border-2 border-foreground/80 shadow-pencil hover:rotate-[-1deg] transition-transform"
              >
                Start talking <ArrowRight className="w-5 h-5 ml-1.5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/consultation")}
                className="h-14 px-7 rounded-full text-base font-semibold border-2 border-foreground bg-card hover:bg-card/80"
              >
                choose care
              </Button>
            </div>
            <p className="font-hand text-xl text-foreground/60 mt-6">
              7 days free. no card. anonymous.
            </p>
          </motion.div>

          {/* Right — dark oil-pencil cards inspired by the reference */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="grid gap-4"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { name: "AVA", note: "soft voice care", icon: MessageCircle },
                { name: "YARO", note: "steady video care", icon: Video },
              ].map((c) => (
                <div key={c.name} className="landing-ink-card min-h-64 hover-lift">
                  <div className="oil-orbit" />
                  <div className="relative z-10 flex h-full flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-card/15 px-4 py-2 font-hand text-2xl">{c.name}</span>
                      <span className="flex h-11 w-11 items-center justify-center rounded-full border border-card/35 bg-card/10">
                        <c.icon className="h-5 w-5" />
                      </span>
                    </div>
                    <div>
                      <p className="font-display text-3xl leading-tight">{c.note}</p>
                      <p className="mt-3 max-w-xs text-sm text-card/75">One tap. Private room. Clear plan limits.</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="pastel-card flex items-center gap-5 bg-pastel-cream">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-foreground/70 bg-pastel-sage shadow-pencil">
                <Brain className="h-7 w-7" />
              </div>
              <p className="text-base leading-relaxed text-foreground/75">
                Your stories, mood notes, and coping patterns stay connected, so support feels less robotic and more human.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Ash-inspired judgment-free feature */}
      <section className="border-t-2 border-foreground/10 bg-card/40 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="landing-paper-shell grid gap-10 overflow-hidden lg:grid-cols-[0.95fr_1.25fr] lg:items-center">
            <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
              <h2 className="font-display text-4xl leading-tight md:text-5xl">A judgment-free space that grows with you</h2>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-foreground/75">
                WellMindAI remembers your care journey gently, so every check-in starts closer to where you are.
              </p>
              <Button asChild variant="link" className="mt-5 h-auto p-0 text-base font-semibold text-primary underline-offset-4 hover:underline">
                <Link to="/about">Read more <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </motion.div>
            <OilDoodle />
          </div>
        </div>
      </section>

      {/* Three soft promises — minimal, hand-drawn */}
      <section className="bg-pastel-cream border-t-2 border-foreground/10 py-16">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-3 gap-6">
          {[
            { hand: "tap", title: "one tap to talk", body: "No booking, no forms. Pick a face, choose voice or video." },
            { hand: "feel", title: "no judgment", body: "Trained in CBT, ACT, DBT. We listen first, advise gently." },
            { hand: "safe", title: "yours alone", body: "End-to-end encrypted. Anonymous by default." },
          ].map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="pastel-card hover-lift"
              style={{ transform: `rotate(${(i - 1) * 0.6}deg)` }}
            >
              <p className="font-hand text-3xl text-primary mb-1">{c.hand}</p>
              <h3 className="font-display text-xl mb-2">{c.title}</h3>
              <p className="text-sm text-foreground/70 leading-relaxed">{c.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="research" className="border-t-2 border-foreground/10 bg-background py-16">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-hand text-3xl text-primary">research, softly used</p>
              <h2 className="font-display text-4xl">Care that follows real mental-health practice.</h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-foreground/65">CBT, DBT, ACT, mood journaling, and daily check-ins — without making the page feel clinical.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { icon: BookOpen, title: "Journal patterns", body: "Short reflections become clear emotional notes." },
              { icon: Brain, title: "Coping models", body: "Personal exercises adapt as your mood shifts." },
              { icon: ShieldCheck, title: "Privacy rules", body: "Access and usage are enforced server-side." },
            ].map((item) => (
              <div key={item.title} className="pastel-card hover-lift">
                <item.icon className="mb-4 h-7 w-7 text-primary" />
                <h3 className="font-display text-2xl">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground/70">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quiet CTA */}
      <section className="py-20 bg-pastel-peach border-t-2 border-foreground/10">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <Heart className="w-10 h-10 text-primary mx-auto mb-4" />
          <p className="font-hand text-4xl text-foreground/90 mb-2">you don't have to figure it out alone.</p>
          <h2 className="font-display text-3xl md:text-4xl mb-6">Try a free 7-day session.</h2>
          <Button
            size="lg"
            onClick={() => navigate("/auth")}
            className="h-14 px-8 rounded-full bg-foreground text-background border-2 border-foreground hover:bg-foreground/90 font-semibold"
          >
            Begin <ArrowRight className="w-5 h-5 ml-1.5" />
          </Button>
        </div>
      </section>

      <section className="border-t-2 border-foreground/10 bg-pastel-cream py-16">
        <div className="mx-auto max-w-3xl px-6">
          <div className="mb-8 text-center">
            <p className="font-hand text-3xl text-primary">small answers</p>
            <h2 className="font-display text-4xl">FAQ</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <details key={faq.question} className="faq-paper group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-xl">
                  {faq.question}
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-foreground/20 bg-card font-sans text-sm transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-foreground/70">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
