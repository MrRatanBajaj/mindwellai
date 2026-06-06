
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Pricing from "@/components/ui-custom/Pricing";
import { useSearchParams } from "react-router-dom";
import { Lock } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

const Plans = () => {
  const [searchParams] = useSearchParams();
  const gated = searchParams.get("gated") === "1";
  useSEO({
    title: "Pricing & Plans — WellMind AI Therapy from ₹149/mo",
    description: "Compare Free, Student (₹149), Standard (₹499) and Premium (₹999) plans. Video, phone and AI chat counseling included.",
    path: "/plans",
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero — minimal */}
      <section className="pt-32 pb-6 px-6">
        <div className="max-w-3xl mx-auto text-center">
          {gated && (
            <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-sm">
              <Lock className="w-4 h-4" />
              <span>This feature requires an active plan.</span>
            </div>
          )}
          <h1 className="font-display text-4xl md:text-5xl text-foreground mb-4 tracking-tight">
            Simple, honest pricing.
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto">
            Start free. Upgrade only when you need more time with your AI counselor.
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-10 px-6 mb-16 flex-grow">
        <div className="max-w-7xl mx-auto">
          <Pricing />
        </div>
      </section>

      {/* FAQ — slim */}
      <section className="py-16 px-6 bg-secondary/30">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-2xl md:text-3xl text-center mb-10">Questions, answered.</h2>
          <div className="space-y-3">
            {[
              { q: "Can I cancel anytime?", a: "Yes. Cancel from your dashboard — no fees, no calls. Your plan stays active until the end of the period." },
              { q: "What happens when my session time runs out?", a: "You'll see a 60-second warning, then the session ends automatically. Upgrade or wait for next month's allowance." },
              { q: "Is my data private?", a: "All sessions are encrypted, RLS-protected per user, and never used to train models. HIPAA-grade." },
              { q: "Does pricing change with exchange rates?", a: "No. Prices are fixed per region so you always know what you'll pay." },
            ].map((f) => (
              <details key={f.q} className="group bg-card rounded-2xl border border-border/50 p-5 open:shadow-sm">
                <summary className="cursor-pointer font-medium text-foreground flex items-center justify-between">
                  {f.q}
                  <span className="text-muted-foreground group-open:rotate-45 transition">+</span>
                </summary>
                <p className="text-muted-foreground text-sm mt-3 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Plans;
