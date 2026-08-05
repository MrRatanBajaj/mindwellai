import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import LandingNav from "@/components/layout/LandingNav";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useSEO } from "@/hooks/useSEO";
import { supabase } from "@/integrations/supabase/client";
import { FileText, ArrowUpRight } from "lucide-react";

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

const Research = () => {
  const [papers, setPapers] = useState<Paper[]>(FALLBACK);

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
        <section className="px-4 sm:px-6 pb-14">
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] bg-[#F6EFE3] px-6 pt-20 pb-40 text-center">
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
        <section className="px-6 pb-12">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-display text-4xl md:text-5xl">Research</h1>
            <p className="mt-4 text-foreground/70">
              What we measure, what we learn, and what we still don't know. Written plainly, published openly.
            </p>
          </div>
        </section>

        {/* Papers */}
        <section className="px-6 pb-24">
          <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-2">
            {papers.map((p) => (
              <article
                key={p.id}
                className="group rounded-3xl border border-foreground/10 bg-card p-7 transition-shadow hover:shadow-xl"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary">
                  <FileText className="h-5 w-5 text-secondary-foreground" />
                </div>
                <h2 className="font-display text-2xl leading-snug">{p.title}</h2>
                {p.summary && <p className="mt-3 text-sm leading-relaxed text-foreground/70">{p.summary}</p>}
                <div className="mt-5 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{p.authors ?? "WellMindAI"}</span>
                  <span>
                    {p.published_at
                      ? new Date(p.published_at).toLocaleDateString("en-IN", { month: "short", year: "numeric" })
                      : ""}
                  </span>
                </div>
                {p.file_url && (
                  <a
                    href={p.file_url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary"
                  >
                    Read the paper <ArrowUpRight className="h-4 w-4" />
                  </a>
                )}
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
      <Footer />
    </div>
  );
};

export default Research;
