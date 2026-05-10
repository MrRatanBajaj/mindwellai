
import { Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

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

interface PricingCardProps {
  plan: PricingPlan;
  className?: string;
}

const PricingCard = ({ plan, className }: PricingCardProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activating, setActivating] = useState(false);

  const handleSelectPlan = async () => {
    // Free Trial: 3 days, 1 video session, no payment
    if (plan.id === 'free-trial') {
      if (!user) {
        toast.info("Please sign up first to start your free trial.");
        navigate('/auth?redirect=/plans');
        return;
      }
      setActivating(true);
      try {
        // Check if already used
        const { data: existing } = await supabase
          .from('subscriptions')
          .select('id, plan_id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (existing) {
          toast.error("You've already used your free trial. Please choose a paid plan.");
          setActivating(false);
          return;
        }

        const trialEnd = new Date();
        trialEnd.setDate(trialEnd.getDate() + 3);

        const { error } = await supabase.from('subscriptions').insert({
          user_id: user.id,
          plan_id: 'free-trial',
          status: 'active',
          sessions_remaining: 1,
          current_period_end: trialEnd.toISOString(),
        });

        if (error) throw error;

        toast.success("Free trial activated! 3 days of access starts now.");
        navigate('/dashboard');
      } catch (e: any) {
        toast.error(e?.message || "Could not activate free trial.");
      } finally {
        setActivating(false);
      }
      return;
    }

    if (plan.isFree) {
      navigate('/dashboard');
      return;
    }
    if (plan.id === 'student') {
      const email = window.prompt(
        "Student verification\n\nEnter your student email (.edu / .ac.in / college domain) or your Student ID number:"
      );
      if (!email || email.trim().length < 4) {
        alert("Verification cancelled. Student plan requires a valid student email or ID.");
        return;
      }
      const looksLikeStudent =
        /\.edu(\.[a-z]{2,3})?$/i.test(email) ||
        /\.ac\.[a-z]{2,3}$/i.test(email) ||
        /(college|university|school|institute)/i.test(email) ||
        /^[A-Z0-9]{6,}$/i.test(email.trim());
      if (!looksLikeStudent) {
        alert("This doesn't look like a valid student email or ID. Please use your college email (e.g. you@xyz.edu) or your official Student ID.");
        return;
      }
      sessionStorage.setItem('student_verification', email.trim());
    }
    navigate(`/payment?plan=${plan.id}`);
  };

  return (
    <div
      className={cn(
        "glass-panel rounded-xl p-8 relative transition-all duration-300",
        plan.isFeatured ? "border-2 border-mindwell-500 shadow-lg scale-105" : "border border-slate-200",
        className
      )}
    >
      {plan.isFeatured && (
        <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-mindwell-500 text-white text-xs font-bold py-1 px-4 rounded-full">
          MOST POPULAR
        </span>
      )}
      
      {plan.isFree && (
        <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white text-xs font-bold py-1 px-4 rounded-full">
          FREE TRIAL
        </span>
      )}

      <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
      <p className="text-sm text-slate-600 mb-6">{plan.description}</p>
      
      <div className="mb-6">
        <span className="text-3xl font-bold">{plan.price}</span>
        {!plan.isFree && <span className="text-slate-600 ml-1">/month</span>}
      </div>
      
      <div className="space-y-3 mb-8">
        {plan.features.map((feature, index) => (
          <div key={index} className="flex items-start">
            <Check className="w-5 h-5 text-mindwell-600 mr-2 flex-shrink-0" />
            <span className="text-sm">{feature}</span>
          </div>
        ))}
      </div>
      
      <Button 
        onClick={handleSelectPlan}
        className={cn(
          "w-full", 
          plan.isFeatured 
            ? "bg-mindwell-500 hover:bg-mindwell-600 text-white" 
            : "bg-slate-100 hover:bg-slate-200 text-slate-800"
        )}
      >
        {plan.buttonText}
      </Button>
    </div>
  );
};

export default PricingCard;
