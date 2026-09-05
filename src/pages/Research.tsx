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
  Users,
  Stethoscope,
  LineChart,
  Scale,
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
        {/* Header */}
        <section className="px-6 pb-12 pt-4">
          <div className="mx-auto max-w-5xl">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Research</p>
            <h1 className="mt-3 max-w-3xl font-display text-4xl leading-tight md:text-5xl">
              What we measure, and what we don&apos;t yet know
            </h1>
            <p className="mt-4 max-w-2xl text-foreground/70">
              Written plainly, published openly. If a number is not defensible, it does not appear here.
            </p>
          </div>
        </section>

        {/* Paper library — horizontal cards */}
        <section className="px-6 pb-20">
          <div className="mx-auto max-w-5xl space-y-4">
            {papers.map((p, i) => (
              <motion.article
                key={p.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group flex flex-col gap-5 rounded-[1.75rem] border border-foreground/10 bg-card p-6 transition-shadow hover:shadow-lg sm:flex-row sm:items-center sm:p-7"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-secondary">
                  <FileText className="h-5 w-5 text-secondary-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-display text-xl leading-snug sm:text-2xl">{p.title}</h2>
                  {p.summary && <p className="mt-2 text-sm leading-relaxed text-foreground/70">{p.summary}</p>}
                  <p className="mt-3 text-xs text-muted-foreground">
                    {p.authors ?? "WellMindAI"}
                    {p.published_at
                      ? ` · ${new Date(p.published_at).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}`
                      : ""}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
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
              </motion.article>
            ))}
          </div>
        </section>

        {/* Researcher profiles — role and position only */}
        <section className="px-6 pb-20">
          <div className="mx-auto max-w-5xl">
            <h2 className="font-display text-3xl md:text-4xl">The people behind the work</h2>
            <p className="mt-3 max-w-2xl text-foreground/70">
              Every note above is reviewed by these seats before it reaches a person.
            </p>

            <div className="mt-8 space-y-4">
              {teamSections.map((section, i) => (
                <motion.div
                  key={section.heading}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="rounded-[1.75rem] border border-foreground/10 bg-card p-6 sm:p-8"
                >
                  <div className="mb-5 flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-secondary">
                      <section.icon className="h-5 w-5 text-secondary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-display text-xl sm:text-2xl">{section.heading}</h3>
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

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-[1.75rem] border border-dashed border-foreground/20 p-6">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-primary" />
                <p className="text-sm text-foreground/70">These seats are open.</p>
              </div>
              <Button asChild variant="outline" className="rounded-full">
                <Link to="/careers">See open roles</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="px-6 pb-20">



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
