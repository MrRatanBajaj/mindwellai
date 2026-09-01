import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import LandingNav from "@/components/layout/LandingNav";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useSEO } from "@/hooks/useSEO";
import { supabase } from "@/integrations/supabase/client";
import {
  FileText,
  ArrowUpRight,
  Download,
  X,
  Microscope,
  ShieldCheck,
  Brain,
  Users,
  Stethoscope,
  LineChart,
  Scale,
  Sparkles,
} from "lucide-react";

interface Paper {
  id: string;
  title: string;
  summary: string | null;
  authors: string | null;
  published_at: string | null;
  file_url: string | null;
}

const FALLBACK: Paper[] = [
  {
    id: "f1",
    title: "Conversational support and perceived loneliness: an early observational read",
    summary:
      "Across the first 90 days of open conversations, people reported feeling less alone and more able to name what they were carrying.",
    authors: "WellMindAI Clinical Team",
    published_at: "2026-01-12",
    file_url: null,
  },
  {
    id: "f2",
    title: "Screening signals in everyday language",
    summary:
      "How PHQ-9, GAD-7 and PCL-5 item patterns surface inside ordinary, multilingual conversation — and why consent must come before scoring.",
    authors: "WellMindAI Clinical Team",
    published_at: "2025-11-04",
    file_url: null,
  },
  {
    id: "f3",
    title: "Designing for safety: escalation before advice",
    summary:
      "A protocol note on why risk language bypasses the model entirely and hands directly to human helplines.",
    authors: "WellMindAI Clinical Team",
    published_at: "2025-09-22",
    file_url: null,
  },
];

/* Soft watercolour botanical, drawn inline so it stays crisp and weightless. */
const Leaf = ({ className = "", flip = false }: { className?: string; flip?: boolean }) => (
  <svg viewBox="0 0 200 260" className={className} style={flip ? { transform: "scaleX(-1)" } : undefined} aria-hidden>
    <g fill="none" stroke="#8CA47A" strokeWidth="2" opacity="0.85">
      <path d="M100 255 C100 180 100 110 100 20" />
      <path d="M100 210 C70 200 50 175 46 145 C80 148 98 175 100 210Z" fill="#B7CBA3" fillOpacity="0.55" stroke="none" />
      <path d="M100 210 C130 200 150 175 154 145 C120 148 102 175 100 210Z" fill="#9DB88A" fillOpacity="0.5" stroke="none" />
      <path d="M100 160 C72 150 54 126 50 98 C82 101 98 127 100 160Z" fill="#C6D7B4" fillOpacity="0.55" stroke="none" />
      <path d="M100 160 C128 150 146 126 150 98 C118 101 102 127 100 160Z" fill="#A8C295" fillOpacity="0.5" stroke="none" />
      <path d="M100 110 C78 102 64 82 61 60 C86 63 98 84 100 110Z" fill="#D2E0C2" fillOpacity="0.6" stroke="none" />
      <path d="M100 110 C122 102 136 82 139 60 C114 63 102 84 100 110Z" fill="#B4CCA0" fillOpacity="0.5" stroke="none" />
    </g>
  </svg>
);

const pillars = [
  {
    icon: Microscope,
    title: "Measurement",
    body: "Every claim we publish traces back to an instrument — PHQ-9, GAD-7, PCL-5 — never to a feeling about the product.",
  },
  {
    icon: ShieldCheck,
    title: "Safety first",
    body: "Risk language never waits for a model. It routes straight to human crisis pathways, and we publish how often that fires.",
  },
  {
    icon: Brain,
    title: "Clinical grounding",
    body: "Framing follows DSM-5 and ICD-11 language conventions. Pattern recognition is silent, consented, and never a diagnosis.",
  },
  {
    icon: Scale,
    title: "Honest limits",
    body: "We write down what we could not measure. Negative and null results are published alongside the encouraging ones.",
  },
];

/* Team is described by function, not by faces — roles we staff and hire into. */
const teamSections = [
  {
    heading: "Clinical research",
    caption: "Designs the instruments, reads the data, signs off on every claim.",
    icon: Stethoscope,
    roles: [
      { role: "Clinical psychologist", focus: "Instrument validity, PHQ-9 / GAD-7 scoring integrity" },
      { role: "Psychiatric advisor", focus: "DSM-5 & ICD-11 framing review, escalation thresholds" },
      { role: "Crisis protocol lead", focus: "Risk detection, helpline routing, incident review" },
    ],
  },
  {
    heading: "Measurement & data science",
    caption: "Turns conversations into numbers you can argue with.",
    icon: LineChart,
    roles: [
      { role: "Outcomes analyst", focus: "Longitudinal change, retention-adjusted effect reads" },
      { role: "Evaluation engineer", focus: "Latency, transcription accuracy, adherence scoring" },
      { role: "Safety evaluator", focus: "Red-team suites, refusal and escalation benchmarks" },
    ],
  },
  {
    heading: "Ethics & governance",
    caption: "Holds the line between useful and acceptable.",
    icon: Scale,
    roles: [
      { role: "Privacy lead", focus: "Data minimisation, retention windows, consent flows" },
      { role: "Ethics reviewer", focus: "Study design review, vulnerable-population safeguards" },
      { role: "Community reviewer", focus: "Lived-experience input before anything ships" },
    ],
  },
];

const Research = () => {
  const [papers, setPapers] = useState<Paper[]>(FALLBACK);
  const [reading, setReading] = useState<Paper | null>(null);

  useSEO({
    title: "Research — WellMindAI",
    description:
      "Clinical notes, observational reads and method write-ups behind WellMindAI's conversational support.",
    path: "/research",
  });

  useEffect(() => {
    (async () => {
      const { data } = await (supabase as any)
        .from("research_papers")
        .select("id, title, summary, authors, published_at, file_url")
        .order("published_at", { ascending: false })
        .limit(24);
      if (data && data.length) setPapers(data as Paper[]);
    })();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingNav />
      <main className="pt-24">
        {/* Statement hero — cream card with watercolour botanicals */}
        <section className="px-4 pb-14 sm:px-6">
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] bg-[#F6EFE3] px-6 pb-40 pt-20 text-center">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#2A2522]/10 bg-white/70 px-4 py-1.5 text-xs uppercase tracking-[0.18em] text-[#2A2522]/70">
              <Sparkles className="h-3.5 w-3.5" /> Research
            </span>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="mx-auto max-w-3xl font-display text-3xl leading-snug text-[#2A2522] sm:text-4xl md:text-5xl"
            >
              On average, people using WellMindAI gained at least one person they felt they could rely on.
            </motion.p>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-center gap-2 opacity-90">
              <Leaf className="h-28 w-20 sm:h-40 sm:w-28" />
              <Leaf className="h-40 w-28 sm:h-56 sm:w-40" flip />
              <Leaf className="h-24 w-16 sm:h-36 sm:w-24" />
              <Leaf className="hidden h-48 w-32 sm:block" flip />
              <Leaf className="hidden h-28 w-20 sm:block" />
            </div>
          </div>
        </section>

        {/* Intro */}
        <section className="px-6 pb-14">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-display text-4xl md:text-5xl">What we measure, and what we don't yet know</h1>
            <p className="mt-4 text-foreground/70">
              Written plainly, published openly. If a number is not defensible, it does not appear on this page.
            </p>
          </div>
        </section>

        {/* Principles */}
        <section className="px-6 pb-20">
          <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2">
            {pillars.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="rounded-3xl border border-foreground/10 bg-card p-7"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary">
                  <p.icon className="h-5 w-5 text-secondary-foreground" />
                </div>
                <h2 className="font-display text-2xl">{p.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-foreground/70">{p.body}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Research team — by function */}
        <section className="px-6 pb-20">
          <div className="mx-auto max-w-5xl">
            <div className="mb-10 max-w-2xl">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">The research team</p>
              <h2 className="mt-3 font-display text-3xl md:text-4xl">Built around functions, not job titles</h2>
              <p className="mt-3 text-foreground/70">
                We are early, and we would rather show you the shape of the work than a wall of headshots. These are the
                seats that review everything before it reaches a person.
              </p>
            </div>

            <div className="space-y-6">
              {teamSections.map((section, i) => (
                <motion.div
                  key={section.heading}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="rounded-[2rem] border border-foreground/10 bg-card p-7 md:p-9"
                >
                  <div className="mb-6 flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-secondary">
                      <section.icon className="h-5 w-5 text-secondary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-display text-2xl">{section.heading}</h3>
                      <p className="text-sm text-foreground/60">{section.caption}</p>
                    </div>
                  </div>
                  <div className="grid gap-3 md:grid-cols-3">
                    {section.roles.map((r) => (
                      <div key={r.role} className="rounded-2xl bg-secondary/50 p-5">
                        <p className="font-medium">{r.role}</p>
                        <p className="mt-1.5 text-sm leading-relaxed text-foreground/65">{r.focus}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-[2rem] border border-dashed border-foreground/20 p-7">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-primary" />
                <p className="text-sm text-foreground/70">
                  These seats are open. If this is your life's work, we would like to hear from you.
                </p>
              </div>
              <Button asChild variant="outline" className="rounded-full">
                <Link to="/careers">See open roles</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Manifesto block above the library */}
        <section className="px-4 pb-14 sm:px-6">
          <div className="mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] bg-[#14100E] px-7 py-12 text-[#F5EFE6] md:px-14 md:py-16">
            <p className="text-xs uppercase tracking-[0.2em] text-[#F5EFE6]/50">Our position</p>
            <h2 className="mt-4 max-w-3xl font-display text-3xl leading-snug md:text-4xl">
              Machines that talk to people in pain must be held to a higher bar than machines that sell them shoes.
            </h2>
            <div className="mt-6 grid gap-6 text-sm leading-relaxed text-[#F5EFE6]/75 md:grid-cols-2">
              <p>
                We think the honest way to build this is in public: publish the method, publish the failure rate, and let
                clinicians tear it apart. A system that cannot survive that review should not be sitting with someone at
                3 a.m.
              </p>
              <p>
                So we hold three lines. Safety outranks engagement — always. A person is never scored without consent. And
                no model output is allowed to stand between someone in danger and a human being who can help.
              </p>
            </div>
            <p className="mt-8 text-xs text-[#F5EFE6]/45">
              Everything below is a working note. Read it, disagree with it, write to us.
            </p>
          </div>
        </section>

        {/* Paper library */}
        <section className="px-6 pb-24">
          <div className="mx-auto mb-8 max-w-5xl">
            <h2 className="font-display text-3xl md:text-4xl">Papers &amp; working notes</h2>
            <p className="mt-2 text-sm text-foreground/65">Open any paper to read it right here — no download needed.</p>
          </div>

          <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-2">
            {papers.map((p) => (
              <article
                key={p.id}
                className="group flex flex-col rounded-3xl border border-foreground/10 bg-card p-7 transition-shadow hover:shadow-xl"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary">
                  <FileText className="h-5 w-5 text-secondary-foreground" />
                </div>
                <h3 className="font-display text-2xl leading-snug">{p.title}</h3>
                {p.summary && <p className="mt-3 text-sm leading-relaxed text-foreground/70">{p.summary}</p>}
                <div className="mt-5 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{p.authors ?? "WellMindAI"}</span>
                  <span>
                    {p.published_at
                      ? new Date(p.published_at).toLocaleDateString("en-IN", { month: "short", year: "numeric" })
                      : ""}
                  </span>
                </div>
                <div className="mt-5 flex items-center gap-3 pt-1">
                  <Button onClick={() => setReading(p)} className="h-10 rounded-full px-5 text-sm">
                    Read paper
                  </Button>
                  {p.file_url && (
                    <a
                      href={p.file_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-medium text-primary"
                    >
                      Download <ArrowUpRight className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>

          <div className="mt-14 text-center">
            <Button asChild className="h-12 rounded-full px-8">
              <Link to="/chat/yaro">Try a conversation</Link>
            </Button>
          </div>
        </section>
      </main>

      {/* In-site PDF reader */}
      <Dialog open={!!reading} onOpenChange={(open) => !open && setReading(null)}>
        <DialogContent className="h-[88vh] max-w-5xl gap-0 overflow-hidden p-0">
          <DialogHeader className="flex-row items-start justify-between gap-4 border-b border-foreground/10 px-6 py-4">
            <div className="min-w-0">
              <DialogTitle className="truncate font-display text-xl">{reading?.title}</DialogTitle>
              <p className="mt-1 truncate text-xs text-muted-foreground">
                {reading?.authors ?? "WellMindAI"}
                {reading?.published_at
                  ? ` · ${new Date(reading.published_at).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}`
                  : ""}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {reading?.file_url && (
                <Button asChild variant="outline" size="sm" className="rounded-full">
                  <a href={reading.file_url} target="_blank" rel="noreferrer">
                    <Download className="mr-1.5 h-3.5 w-3.5" /> Download
                  </a>
                </Button>
              )}
              <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setReading(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="h-full min-h-0 flex-1 bg-muted/40">
            {reading?.file_url ? (
              <iframe
                title={reading.title}
                src={`${reading.file_url}#view=FitH`}
                className="h-full w-full border-0"
              />
            ) : (
              <div className="mx-auto h-full max-w-3xl overflow-y-auto bg-card px-8 py-10">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Working note</p>
                <h3 className="mt-3 font-display text-3xl leading-snug">{reading?.title}</h3>
                <p className="mt-6 leading-relaxed text-foreground/80">{reading?.summary}</p>
                <p className="mt-6 leading-relaxed text-foreground/70">
                  The full write-up for this note is being prepared for publication. In the meantime, the summary above
                  reflects the method and the read as it stands, including its limits.
                </p>
                <p className="mt-6 text-sm text-muted-foreground">
                  Questions or a methodological objection? We would genuinely like to receive it.
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Research;
