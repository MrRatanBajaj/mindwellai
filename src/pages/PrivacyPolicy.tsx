import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useSEO } from "@/hooks/useSEO";

const PrivacyPolicy = () => {
  useSEO({
    title: "Privacy Policy — WellMind AI",
    description: "How WellMind AI protects your mental health data: encryption, RLS, DPDP & HIPAA-style safeguards, your rights.",
    path: "/privacy",
  });

  return (
    <div className="min-h-screen flex flex-col bg-pastel-cream">
      <Header />
      <main className="flex-grow pt-28 pb-16">
        <div className="max-w-3xl mx-auto px-6">
          <p className="font-hand text-3xl text-primary mb-2 text-center">our promise.</p>
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-center mb-3">Privacy Policy</h1>
          <p className="text-center text-sm text-foreground/60 mb-10">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="pastel-card space-y-8 text-foreground/80 leading-relaxed">
            <section>
              <h2 className="font-display text-2xl mb-2">Who we are</h2>
              <p>WellMindAI ("we", "us") is operated by WellMindAI Technologies, India. This policy applies to users in India under the Digital Personal Data Protection Act 2023, and to international users under GDPR, CCPA, and equivalents.</p>
            </section>
            <section>
              <h2 className="font-display text-2xl mb-2">What we collect</h2>
              <ul className="list-disc ml-6 space-y-1">
                <li>Account details — name, email, password hash</li>
                <li>Mental-health inputs — journal entries, mood, chat & call transcripts</li>
                <li>Device & usage data — IP, browser, session timestamps</li>
                <li>Payment metadata via Razorpay/Stripe. We never store full card numbers.</li>
              </ul>
            </section>
            <section>
              <h2 className="font-display text-2xl mb-2">How we protect it</h2>
              <p>TLS 1.3 in transit, AES-256 at rest, Postgres Row-Level Security per user, audit logging on every consultation. We do not train AI models on your personal therapy content.</p>
            </section>
            <section>
              <h2 className="font-display text-2xl mb-2">Your rights</h2>
              <ul className="list-disc ml-6 space-y-1">
                <li>Access, correct, port, or erase your data</li>
                <li>Withdraw consent at any time — privacy@wellmindai.in</li>
                <li>Grievance Officer (India): grievance@wellmindai.in (response within 15 days)</li>
                <li>Lodge a complaint with the Data Protection Board of India or your local DPA</li>
              </ul>
            </section>
            <section>
              <h2 className="font-display text-2xl mb-2">Where data lives</h2>
              <p>Hosted on Supabase (AWS Mumbai for Indian users). Cross-border transfers use Standard Contractual Clauses.</p>
            </section>
            <section>
              <h2 className="font-display text-2xl mb-2">Contact</h2>
              <p>privacy@wellmindai.in · WellMindAI Technologies, Purnia, Bihar, India</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
