import { Link, useParams, Navigate } from "react-router-dom";
import { Check, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import LandingNav from "@/components/layout/LandingNav";
import Footer from "@/components/layout/Footer";
import { useSEO } from "@/hooks/useSEO";

type Competitor = {
  slug: string;
  name: string;
  tagline: string;
  positioning: string;
  gaps: string[];
  wellmindWins: { title: string; body: string }[];
  faqs: { q: string; a: string }[];
};

const COMPETITORS: Record<string, Competitor> = {
  "wysa-alternative": {
    slug: "wysa-alternative",
    name: "Wysa",
    tagline: "The best Wysa alternative for judgement-free, multilingual mental grounding in India",
    positioning:
      "Wysa is a well-known AI penguin chatbot focused on CBT-style self-help. WellMindAI is built for real Indian users who switch between Hindi, Hinglish, Tamil, Bengali and English mid-sentence — with a clinical pattern engine running silently on DSM-5, PHQ-9, GAD-7 and PCL-5.",
    gaps: [
      "Wysa is English-first — Indian code-mixing (Hinglish, Tanglish) breaks flow",
      "Paywalled human coaching; free tier is limited to scripted CBT cards",
      "No live video / audio grounding with real-time clinical signal",
      "No transparent DSM-5 / PHQ-9 / GAD-7 mapping surfaced to the user",
    ],
    wellmindWins: [
      { title: "Native multilingual", body: "22 Indian languages + English. Yaro mirrors your exact language, including Hinglish and Tanglish." },
      { title: "Clinical pattern engine", body: "Every message is silently scored on PHQ-9, GAD-7, PCL-5. Crisis kill-switch hands off to iCall / Vandrevala instantly." },
      { title: "Video + audio grounding", body: "Under 1.5s latency voice therapy with Ava (female) and Yaro (male) — no waitlist, no coach paywall." },
      { title: "₹99 / week starter", body: "Video 3 min + audio 10 min + unlimited chat. No corporate contract needed." },
    ],
    faqs: [
      { q: "Is WellMindAI free like Wysa?", a: "Chat with Yaro is free with no signup. Paid plans start at ₹99/week for video and audio sessions." },
      { q: "Does WellMindAI diagnose me?", a: "No — like Wysa, we do not diagnose. Our clinical engine maps patterns to DSM-5 / ICD-11 silently and hands off to licensed clinicians." },
      { q: "How is WellMindAI different from Wysa for Indian users?", a: "We are Hinglish-first, run on Digital India Bhashini for regional ASR, and expose the underlying PHQ-9 / GAD-7 signal so you can see your own patterns." },
    ],
  },
  "lyra-health-alternative": {
    slug: "lyra-health-alternative",
    name: "Lyra Health",
    tagline: "A Lyra Health alternative built for individuals — not just enterprise HR",
    positioning:
      "Lyra Health is a US-focused enterprise EAP — you can only use it if your employer buys a contract. WellMindAI is a direct-to-consumer clinical companion available to any Indian citizen for ₹99/week, with the same evidence-based frameworks (CBT, DBT, ACT) and a stricter safety net.",
    gaps: [
      "Only accessible via employer contracts — no individual signup",
      "US-centric — no Indian-language ASR, no Bhashini pipeline",
      "Long onboarding and matching before first session",
      "Not transparent about DSM-5 / PHQ-9 scoring surfaced to the user",
    ],
    wellmindWins: [
      { title: "Available to individuals", body: "No employer required. Sign up, chat with Yaro in 30 seconds." },
      { title: "Built for India", body: "Bhashini ASR + regional voices + ₹ pricing, not $." },
      { title: "First session in under a minute", body: "No intake bottleneck — the clinical engine is live from message one." },
      { title: "Radical transparency", body: "Toggle the clinical panel and see your own PHQ-9 / GAD-7 bands in real time." },
    ],
    faqs: [
      { q: "Can I use WellMindAI if my company doesn't offer it?", a: "Yes. Anyone can start free. We also offer B2B for companies at /business." },
      { q: "Does WellMindAI replace therapy like Lyra?", a: "It complements licensed care. For crisis or diagnosis, we hand off to human clinicians and Indian helplines." },
      { q: "Is my data private?", a: "Zero data retention on central servers. Chats are encrypted and, in mesh mode, RAM-only with TTL." },
    ],
  },
  "whisper-alternative": {
    slug: "whisper-alternative",
    name: "Whisper",
    tagline: "A Whisper alternative with a real clinical pattern engine and multilingual voice",
    positioning:
      "Whisper focuses on lightweight peer-style venting. WellMindAI adds a silent DSM-5 / PHQ-9 / GAD-7 engine, crisis handoff, and native multilingual voice grounding — so venting turns into an actual, evidence-based grounding session.",
    gaps: [
      "No structured clinical framework behind responses",
      "Limited multilingual support for Indian users",
      "No real-time crisis detection with hotline handoff",
      "No integrated audio/video therapy option",
    ],
    wellmindWins: [
      { title: "Clinical framework, not just chat", body: "Trained on DSM-5, ICD-11, PHQ-9, GAD-7 and PCL-5 — with C-SSRS crisis kill-switch." },
      { title: "Multilingual voice", body: "Hume EVI voice with Yaro (male) and Ava (female) across English, Hindi, Hinglish, Tamil, Bengali and more." },
      { title: "Under 1.5s latency", body: "Interim token streaming keeps conversation as natural as talking to a friend." },
      { title: "Judgement-free by design", body: "No profile browsing, no likes, no peer noise — just one calm space." },
    ],
    faqs: [
      { q: "Is WellMindAI just another chatbot?", a: "No — it is a clinical grounding companion with a transparent scoring layer, voice/video sessions, and crisis routing." },
      { q: "Do I need to create an account?", a: "No. Chat with Yaro is public and free." },
      { q: "What if I am in crisis?", a: "Our engine detects C-SSRS-positive language and immediately shares Indian helplines: iCall 9152987821, Vandrevala 1860-266-2345, KIRAN 1800-599-0019." },
    ],
  },
};

const Alternative = () => {
  const { slug } = useParams<{ slug: string }>();
  const data = slug ? COMPETITORS[slug] : undefined;

  useSEO({
    title: data ? `${data.name} Alternative — WellMindAI · Multilingual AI Therapy` : "Alternatives — WellMindAI",
    description: data
      ? `Looking for a ${data.name} alternative? WellMindAI is a Hinglish-first, clinically grounded AI therapist trained on DSM-5, PHQ-9, GAD-7 and PCL-5. Starts at ₹99/week.`
      : "Compare WellMindAI with Wysa, Lyra Health and Whisper.",
    path: `/alternatives/${slug ?? ""}`,
  });

  if (!data) return <Navigate to="/" replace />;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: data.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="min-h-screen bg-background">
      <LandingNav />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main className="pt-28 pb-16">
        <section className="max-w-5xl mx-auto px-6">
          <p className="text-sm uppercase tracking-widest text-foreground/50 mb-3">{data.name} alternative · 2026</p>
          <h1 className="font-display text-4xl md:text-6xl leading-tight tracking-tight">{data.tagline}</h1>
          <p className="mt-6 text-lg text-foreground/70 max-w-3xl">{data.positioning}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild className="h-12 rounded-full px-6 bg-[#2A2522] hover:bg-[#2A2522]/90 text-[#F5EFE6]">
              <Link to="/chat/yaro">Try Yaro free <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
            <Button asChild variant="outline" className="h-12 rounded-full px-6">
              <Link to="/plans">See ₹99 plan</Link>
            </Button>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-6 mt-16 grid md:grid-cols-2 gap-6">
          <div className="rounded-3xl border p-8 bg-card">
            <h2 className="font-display text-2xl mb-4">Where {data.name} falls short</h2>
            <ul className="space-y-3">
              {data.gaps.map((g) => (
                <li key={g} className="flex gap-3 text-foreground/80">
                  <X className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" /> {g}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border p-8 bg-[#2A2522] text-[#F5EFE6]">
            <h2 className="font-display text-2xl mb-4">Where WellMindAI wins</h2>
            <ul className="space-y-4">
              {data.wellmindWins.map((w) => (
                <li key={w.title} className="flex gap-3">
                  <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium">{w.title}</div>
                    <div className="text-sm text-[#F5EFE6]/70">{w.body}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-6 mt-20">
          <h2 className="font-display text-3xl mb-6">Common questions about the {data.name} vs WellMindAI comparison</h2>
          <div className="space-y-4">
            {data.faqs.map((f) => (
              <details key={f.q} className="rounded-2xl border p-5 group">
                <summary className="cursor-pointer font-medium">{f.q}</summary>
                <p className="mt-3 text-foreground/70">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-6 mt-16 text-center">
          <h3 className="font-display text-2xl mb-3">Try WellMindAI instead of {data.name}</h3>
          <p className="text-foreground/70 mb-6">Free chat with Yaro — no signup, any language.</p>
          <Button asChild className="h-12 rounded-full px-8 bg-[#2A2522] hover:bg-[#2A2522]/90 text-[#F5EFE6]">
            <Link to="/chat/yaro">Start now</Link>
          </Button>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Alternative;
