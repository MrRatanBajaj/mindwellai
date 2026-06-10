import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useSEO } from "@/hooks/useSEO";
import { FileText, ExternalLink, BookOpen } from "lucide-react";

interface AdminPaper {
  id: string; title: string; venue: string; summary: string; tags: string; url: string;
}

const papers = [
  {
    title: "AI-Augmented Cognitive Behavioral Therapy for Young Adults in India",
    venue: "WellMindAI Research · 2026",
    summary:
      "A 12-week study (n=420) measuring symptom reduction (PHQ-9, GAD-7) when users combine an AI counselor with weekly human review.",
    tags: ["CBT", "Youth", "India"],
    url: "#",
  },
  {
    title: "Privacy-Preserving Architecture for Therapy-Grade LLM Conversations",
    venue: "WellMindAI Whitepaper · 2025",
    summary:
      "Technical blueprint for RLS-isolated audit logging, on-device redaction, and HIPAA-aligned retention used in WellMindAI.",
    tags: ["Privacy", "HIPAA", "Architecture"],
    url: "#",
  },
  {
    title: "Crisis Detection in Hinglish Mental Health Conversations",
    venue: "WellMindAI Research · 2025",
    summary:
      "Hybrid lexical + LLM moderation pipeline that surfaces suicidal ideation and triggers helpline routing within 800ms median latency.",
    tags: ["Safety", "NLP", "Hinglish"],
    url: "#",
  },
  {
    title: "Workplace Mental Wellness: Outcomes from a Tier-1 IT Pilot",
    venue: "WellMindAI x Partner Firm · 2026",
    summary:
      "PEPM B2B deployment showing 38% drop in self-reported burnout and 4.7/5 satisfaction over an 8-week structured rollout.",
    tags: ["B2B", "Workplace", "Pilot"],
    url: "#",
  },
];

export default function Research() {
  useSEO({
    title: "Research Papers — WellMindAI",
    description:
      "Peer-reviewed and internal research papers published by WellMindAI on AI counseling, privacy, crisis detection and workplace mental health.",
    path: "/research",
  });

  const [adminPapers, setAdminPapers] = useState<AdminPaper[]>([]);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("wm_research_papers_v1");
      if (raw) setAdminPapers(JSON.parse(raw));
    } catch {}
  }, []);

  const allPapers = [
    ...adminPapers.map((p) => ({
      title: p.title, venue: p.venue, summary: p.summary,
      tags: p.tags ? p.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      url: p.url,
    })),
    ...papers,
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
              <BookOpen className="w-3.5 h-3.5" /> Evidence & Research
            </div>
            <h1 className="font-display text-4xl md:text-5xl text-foreground mb-4 text-balance">
              Research papers <span className="serif-italic text-primary">published</span> by WellMindAI
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our methods, safety pipeline and outcome studies — open for clinicians, partners and investors.
            </p>
          </div>

          <div className="space-y-4">
            {allPapers.map((p) => (
              <a
                key={p.title}
                href={p.url}
                className="block group p-6 rounded-2xl bg-card border border-border hover:border-primary/40 hover-lift transition"
              >
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] uppercase tracking-widest text-muted-foreground mb-1">
                      {p.venue}
                    </div>
                    <h2 className="font-display text-lg md:text-xl text-foreground mb-2 group-hover:text-primary transition">
                      {p.title}
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                      {p.summary}
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      {p.tags.map((t) => (
                        <span
                          key={t}
                          className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full bg-secondary text-secondary-foreground"
                        >
                          {t}
                        </span>
                      ))}
                      <span className="ml-auto inline-flex items-center gap-1 text-xs text-primary opacity-0 group-hover:opacity-100 transition">
                        Read <ExternalLink className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>

          <div className="mt-12 p-6 rounded-2xl bg-secondary/40 border border-border text-center">
            <p className="text-sm text-muted-foreground">
              Researcher or clinician?{" "}
              <a href="mailto:research@wellmindai.in" className="text-primary font-medium hover:underline">
                research@wellmindai.in
              </a>{" "}
              — we share full datasets under DUA on request.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
