import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Check, Loader2, Sparkles, Building2, Globe2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import {
  PLANS, Plan, CurrencyCode, CURRENCIES,
  detectCurrency, setStoredCurrency, formatPrice, priceSuffix,
} from "@/lib/pricing";

// Re-export legacy shape so Payment.tsx keeps working.
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
  price: formatPrice(p, "INR") + priceSuffix(p),
  description: p.tagline,
  features: p.features,
  buttonText: p.cta,
  isFeatured: p.isFeatured,
  isFree: p.isFree,
  sessionsCount:
    p.id === "free" ? 1 : p.id === "plus" ? 999 : p.id === "premium" ? 30 : 100,
}));

const PlanCard = ({
  plan, currency, onSelect, activating,
}: {
  plan: Plan;
  currency: CurrencyCode;
  onSelect: (p: Plan) => void;
  activating: boolean;
}) => {
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

      <div className="mb-6">
        <h3 className={cn("font-display text-2xl mb-1", featured ? "text-background" : "text-foreground")}>
          {plan.name}
        </h3>
        <p className={cn("text-sm", featured ? "text-background/70" : "text-muted-foreground")}>
          {plan.tagline}
        </p>
      </div>

      <div className="mb-8">
        {plan.price.startingAt && (
          <div className={cn("text-[11px] uppercase tracking-widest mb-1", featured ? "text-background/60" : "text-muted-foreground")}>
            Starting at
          </div>
        )}
        <div className="flex items-baseline gap-1">
          <span className="font-display text-5xl">{formatPrice(plan, currency)}</span>
          {!plan.isFree && (
            <span className={cn("text-sm", featured ? "text-background/60" : "text-muted-foreground")}>
              {priceSuffix(plan)}
            </span>
          )}
        </div>
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
        disabled={activating}
        size="lg"
        className={cn(
          "w-full h-12 rounded-full font-semibold",
          featured
            ? "bg-accent text-accent-foreground hover:bg-accent/90"
            : plan.isFree
              ? "bg-secondary text-foreground hover:bg-secondary/80"
              : "bg-primary text-primary-foreground hover:bg-primary/90",
        )}
      >
        {activating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Activating…</> : plan.cta}
      </Button>
    </motion.div>
  );
};

const Pricing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currency, setCurrency] = useState<CurrencyCode>("INR");
  const [activating, setActivating] = useState<string | null>(null);

  useEffect(() => {
    detectCurrency().then(setCurrency);
  }, []);

  const handleCurrencyChange = (c: CurrencyCode) => {
    setCurrency(c);
    setStoredCurrency(c);
  };

  const handleSelect = async (plan: Plan) => {
    if (plan.id === "free") {
      // Zero-signup access — go straight to the in-page 2-min vent demo.
      navigate("/?vent=1#vent-demo");
      return;
    }

    if (plan.id === "business") {
      navigate("/business");
      return;
    }

    // Plus / Premium → payment
    navigate(`/payment?plan=${plan.id}&currency=${currency}`);
  };

  return (
    <div className="py-6">
      {/* Currency selector — minimal, top-right */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-10 max-w-5xl mx-auto px-2">
        <p className="text-xs text-muted-foreground flex items-center gap-2">
          <Globe2 className="w-3.5 h-3.5" />
          Prices shown in your local currency based on your region.
        </p>
        <Select value={currency} onValueChange={(v) => handleCurrencyChange(v as CurrencyCode)}>
          <SelectTrigger className="w-[180px] h-9 rounded-full text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.values(CURRENCIES).map((c) => (
              <SelectItem key={c.code} value={c.code}>
                {c.flag} {c.code} — {c.symbol}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {PLANS.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            currency={currency}
            onSelect={handleSelect}
            activating={activating === plan.id}
          />
        ))}
      </div>

      {/* B2B note */}
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
