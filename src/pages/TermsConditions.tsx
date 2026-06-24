import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useSEO } from "@/hooks/useSEO";

const TermsConditions = () => {
  useSEO({
    title: "Terms & Conditions — WellMind AI",
    description: "Subscription terms, refund policy, AI counselor disclaimer, and crisis helplines for WellMind AI users.",
    path: "/terms",
  });

  return (
    <div className="min-h-screen flex flex-col bg-pastel-cream">
      <Header />
      <main className="flex-grow pt-28 pb-16">
        <div className="max-w-3xl mx-auto px-6">
          <p className="font-hand text-3xl text-primary mb-2 text-center">the basics.</p>
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-center mb-3">Terms & Conditions</h1>
          <p className="text-center text-sm text-foreground/60 mb-10">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="pastel-card space-y-8 text-foreground/80 leading-relaxed">
            <section>
              <h2 className="font-display text-2xl mb-2">What WellMindAI is</h2>
              <p>WellMindAI is an AI-powered mental wellness companion. It supplements — and does not replace — licensed clinical care. It is not a crisis service.</p>
            </section>
            <section>
              <h2 className="font-display text-2xl mb-2">Eligibility</h2>
              <p>You must be 18 years or older, or have parental consent. By signing up you confirm the details you provide are accurate.</p>
            </section>
            <section>
              <h2 className="font-display text-2xl mb-2">Subscription plans</h2>
              <ul className="list-disc ml-6 space-y-1">
                <li><strong>Free:</strong> 7-day window, unlimited text journaling, voice trial, and a single 2-minute video session.</li>
                <li><strong>Standard ₹499/mo:</strong> Unlimited text and audio, video minutes per plan tier.</li>
                <li><strong>Pro Ultimate ₹999/mo:</strong> 30 video minutes/month across up to 6 session blocks (5 min max each).</li>
              </ul>
              <p className="mt-2 text-sm">Server-enforced limits are checked in real time. Quotas reset monthly on the billing date.</p>
            </section>
            <section>
              <h2 className="font-display text-2xl mb-2">Refunds & cancellation</h2>
              <ul className="list-disc ml-6 space-y-1">
                <li>India: full refund within 7 days if under 30 minutes of paid usage. GST 18% included.</li>
                <li>International: 14-day refund window where digital services have not been substantially consumed.</li>
                <li>Cancel any time from Dashboard → Subscription. Access continues to the end of the billing cycle.</li>
                <li>Billing support: billing@wellmindai.in</li>
              </ul>
            </section>
            <section>
              <h2 className="font-display text-2xl mb-2">AI counselor disclaimer</h2>
              <p>Yaro and Ava are AI companions. They do not provide diagnoses, prescriptions, or crisis response. For emergencies, contact a licensed professional immediately.</p>
            </section>
            <section>
              <h2 className="font-display text-2xl mb-2">Crisis helplines (India)</h2>
              <p>iCall <strong>9152987821</strong> · Vandrevala <strong>1860-266-2345</strong> · KIRAN <strong>1800-599-0019</strong></p>
            </section>
            <section>
              <h2 className="font-display text-2xl mb-2">Governing law</h2>
              <p>These terms are governed by the laws of India. Disputes are subject to the jurisdiction of courts at Purnia, Bihar.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsConditions;
