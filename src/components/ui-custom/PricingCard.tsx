
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

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

  const handleSelectPlan = () => {
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
