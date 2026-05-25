import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, GraduationCap, Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import PricingCard, { PricingPlan } from "./PricingCard";
import { cn } from "@/lib/utils";

// Public plans (what guests / students see) — only 2 cards to keep it clean.
const publicPlans: PricingPlan[] = [
  {
    id: "free-trial",
    name: "Free Plan",
    price: "₹0",
    description: "Start with the basics — forever free",
    features: [
      "Private Journaling (mood + streaks)",
      "“Hide the Thought” quick-release tool",
      "Full Self-Help library (NIMH / WHO)",
      "1 free AI counseling session (one-time)",
      "No card required",
    ],
    buttonText: "Start Free",
    sessionsCount: 1,
    isFree: true,
  },
  {
    id: "premium",
    name: "Student / Premium",
    price: "₹149",
    description: "Your AI counselor — in your pocket",
    features: [
      "AI Virtual Consultant (video + audio)",
      "30 minutes of live Tavus video calls / month",
      "Unlimited ElevenLabs phone-style calls",
      "Top-up packs available (₹49 → +10 min)",
      "Priority queue & full session history",
    ],
    buttonText: "Get Premium",
    isFeatured: true,
    sessionsCount: 30,
  },
];

// Full ladder kept for the Payment page, admins, and old links.
const pricingPlans: PricingPlan[] = [
  ...publicPlans,
  {
    id: "student",
    name: "Student (Verified)",
    price: "₹99",
    description: "For verified college students",
    features: ["Verified .edu / college ID", "2 counselor sessions / month", "Self-Help + Journal"],
    buttonText: "Choose Student",
    sessionsCount: 2,
  },
  {
    id: "standard",
    name: "Standard",
    price: "₹499",
    description: "Steady ongoing support",
    features: ["6 sessions / month", "Personalized plan", "Priority support"],
    buttonText: "Choose Standard",
    sessionsCount: 6,
  },
];

const Pricing = () => {
  const [audience, setAudience] = useState<"individual" | "corporate">("individual");

  return (
    <div className="py-8">
      {/* Audience toggle */}
      <div className="flex justify-center mb-10">
        <div className="inline-flex p-1 rounded-full bg-secondary/60 border border-border">
          {[
            { id: "individual", label: "Individuals & Students", icon: GraduationCap },
            { id: "corporate", label: "Organization / College", icon: Building2 },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setAudience(t.id as any)}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all",
                audience === t.id
                  ? "bg-primary text-primary-foreground shadow-elegant"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {audience === "individual" ? (
        <motion.div
          key="ind"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto"
        >
          {publicPlans.map((plan) => (
            <PricingCard key={plan.id} plan={plan} />
          ))}
        </motion.div>
      ) : (
        <motion.div
          key="corp"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <div className="relative rounded-3xl bg-gradient-to-br from-primary/10 via-card to-accent/15 border border-primary/20 p-10 md:p-14 text-center shadow-elegant overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-accent/20 blur-3xl" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/20 text-foreground/80 text-xs font-medium mb-5">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                Workplace & Campus Wellness
              </div>
              <h3 className="font-display text-3xl md:text-4xl text-foreground mb-4">
                Custom plans for offices & colleges
              </h3>
              <p className="text-muted-foreground mb-2 max-w-xl mx-auto leading-relaxed">
                Per-Employee-Per-Month (PEPM) pricing. AI counseling, anonymized
                wellness dashboards, and crisis escalation built-in.
              </p>
              <p className="text-muted-foreground/80 text-sm mb-8 max-w-xl mx-auto">
                Includes 15 min Tavus AI counseling / employee / month, unlimited
                self-help & journaling, and admin reporting.
              </p>

              <div className="grid sm:grid-cols-3 gap-3 mb-8 max-w-xl mx-auto">
                {[
                  { k: "Tier 1", v: "Up to 100 seats" },
                  { k: "Tier 2", v: "100 – 1,000 seats" },
                  { k: "Enterprise", v: "1,000+ seats" },
                ].map((t) => (
                  <div key={t.k} className="p-4 rounded-2xl bg-card/70 border border-border/50">
                    <div className="text-xs uppercase tracking-widest text-primary font-semibold mb-1">{t.k}</div>
                    <div className="text-sm text-foreground">{t.v}</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a href="mailto:enterprise@wellmindai.in?subject=WellMindAI%20—%20Organization%20demo">
                  <Button size="lg" className="w-full sm:w-auto px-8 h-14 rounded-full bg-primary hover:bg-primary/90 shadow-elegant">
                    <Mail className="w-5 h-5 mr-2" /> Book a Demo
                  </Button>
                </a>
                <a href="mailto:enterprise@wellmindai.in">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 h-14 rounded-full border-primary/30">
                    Contact Sales
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export { pricingPlans };
export default Pricing;
