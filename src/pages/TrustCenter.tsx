import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Shield, Lock, Eye, Server, FileCheck, Mail } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

const sections = [
  {
    icon: Shield,
    title: "Security controls",
    body: "Postgres Row-Level Security on every user table. JWT auth via Supabase. TLS 1.3 in transit, AES-256 at rest. Audit logging on consultations, prescriptions, and medication orders.",
  },
  {
    icon: Lock,
    title: "Privacy",
    body: "Client-side storage keys are scoped per user. Journal entries, transcripts, and mood logs are isolated by row policy. We do not train AI models on your personal therapy content.",
  },
  {
    icon: FileCheck,
    title: "Compliance posture",
    body: "Aligned with India's DPDP Act 2023 and HIPAA-style technical safeguards. This is a published security posture, not a third-party certification.",
  },
  {
    icon: Server,
    title: "Subprocessors",
    body: "Supabase (Postgres + auth + edge functions), Razorpay (India payments), Stripe (international payments), Tavus (video avatars), ElevenLabs (voice), Lovable AI Gateway (chat).",
  },
  {
    icon: Eye,
    title: "What you control",
    body: "Export or delete your data any time. Withdraw consent in one click. Cancel subscription with continued access until the cycle ends.",
  },
  {
    icon: Mail,
    title: "Reach us",
    body: "Security & incidents: security@wellmindai.in · Privacy: privacy@wellmindai.in · Grievance Officer (India): grievance@wellmindai.in",
  },
];

const TrustCenter = () => {
  useSEO({
    title: "Trust Center — WellMind AI",
    description: "WellMind AI's security, privacy, and compliance posture — controls, subprocessors, and incident contact.",
    path: "/trust",
  });

  return (
    <div className="min-h-screen flex flex-col bg-pastel-cream">
      <Header />
      <main className="flex-grow pt-28 pb-16">
        <div className="max-w-5xl mx-auto px-6">
          <p className="font-hand text-3xl text-primary mb-2 text-center">trust, on paper.</p>
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-center">Trust Center</h1>
          <p className="text-center text-foreground/70 mt-3 max-w-xl mx-auto">
            This page is maintained by WellMindAI to answer common security and privacy questions about how we run.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mt-12">
            {sections.map((s, i) => (
              <div
                key={s.title}
                className="pastel-card"
                style={{ transform: i % 2 === 0 ? "rotate(-0.3deg)" : "rotate(0.3deg)" }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-card border-2 border-foreground/80 shadow-pencil flex items-center justify-center shrink-0">
                    <s.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-display text-xl font-semibold mb-1">{s.title}</h2>
                    <p className="text-sm text-foreground/75 leading-relaxed">{s.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-foreground/60 text-center mt-10 max-w-2xl mx-auto">
            Lovable Cloud (Supabase) and our integrated providers each publish their own attestations. We describe enabled controls factually; this page is not a substitute for a third-party audit certificate.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TrustCenter;
