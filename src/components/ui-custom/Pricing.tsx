import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PLANS, type Plan } from "@/lib/pricing";

// Legacy shape kept so older imports keep building.
export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  buttonText: string;
  isFeatured?: boolean;
  sessionsCount: number;
  isFree?: boolean;
}

export const pricingPlans: PricingPlan[] = PLANS.map((p) => ({
  id: p.id,
  name: p.name,
  price: `${p.priceLabel}/${p.periodLabel}`,
  description: p.tagline,
  features: p.features,
  buttonText: p.cta,
  isFeatured: p.isFeatured,
  sessionsCount: p.quota.videoSessions,
}));

const PlanCard = ({ plan, onSelect }: { plan: Plan; onSelect: (p: Plan) => void }) => {
  const featured = plan.isFeatured;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn(
        "relative rounded-3xl p-8 flex flex-col transition-all",
        featured
          ? "bg-foreground text-background border border-foreground shadow-2xl md:scale-[1.03]"
          : "bg-card text-foreground border border-border/60 hover:border-primary/30",
      )}
    >
      {featured && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-accent text-accent-foreground text-[10px] uppercase tracking-widest font-bold">
          Most Popular
        </span>
      )}
      {plan.id === "starter_weekly" && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-[10px] uppercase tracking-widest font-bold inline-flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> New · Weekly
        </span>
      )}

      <div className="mb-6">
        <h3 className={cn("font-display text-2xl mb-1", featured ? "text-background" : "text-foreground")}>
          {plan.name}
        </h3>
        <p className={cn("text-sm", featured ? "text-background/70" : "text-muted-foreground")}>
          {plan.tagline}
        </p>
      </div>

      <div className="mb-8">
        <div className="flex items-baseline gap-1">
          <span className="font-display text-5xl">{plan.priceLabel}</span>
          <span className={cn("text-sm", featured ? "text-background/60" : "text-muted-foreground")}>
            /{plan.periodLabel}
          </span>
        </div>
        <p className={cn("text-xs mt-1", featured ? "text-background/60" : "text-muted-foreground")}>
          Renews every {plan.periodDays} days · Cancel anytime
        </p>
      </div>

      <ul className="space-y-3 mb-8 flex-1">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-3 text-sm">
            <Check className={cn("w-4 h-4 mt-0.5 shrink-0", featured ? "text-accent" : "text-primary")} />
            <span className={featured ? "text-background/90" : "text-foreground/85"}>{f}</span>
          </li>
        ))}
      </ul>

      <Button
        onClick={() => onSelect(plan)}
        size="lg"
        className={cn(
          "w-full h-12 rounded-full font-semibold",
          featured
            ? "bg-accent text-accent-foreground hover:bg-accent/90"
            : "bg-primary text-primary-foreground hover:bg-primary/90",
        )}
      >
        {plan.cta}
      </Button>
    </motion.div>
  );
};

const Pricing = () => {
  const navigate = useNavigate();
  const handleSelect = (plan: Plan) => navigate(`/payment?plan=${plan.id}`);

  return (
    <div className="py-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {PLANS.map((plan) => (
          <PlanCard key={plan.id} plan={plan} onSelect={handleSelect} />
        ))}
      </div>

      <div className="mt-10 max-w-3xl mx-auto px-2 text-center">
        <p className="text-xs text-muted-foreground">
          Running a company, college or coaching institute?{" "}
          <a href="/business" className="text-primary underline-offset-2 hover:underline font-semibold">
            See B2B per-seat pricing →
          </a>
        </p>
      </div>
    </div>
  );
};

export default Pricing;
