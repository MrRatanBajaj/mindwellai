
import PricingCard, { PricingPlan } from "./PricingCard";

const pricingPlans: PricingPlan[] = [
  {
    id: "free",
    name: "Free Plan",
    price: "₹0",
    description: "Get started with basic mental wellness tools",
    features: [
      "2 AI counseling sessions",
      "Basic mood tracking",
      "Access to meditation library",
      "Self-help resources",
      "Community support forum",
    ],
    buttonText: "Get Started Free",
    isFree: true,
    sessionsCount: 2
  },
  {
    id: "standard",
    name: "Standard Plan",
    price: "₹199",
    description: "Enhanced support for your mental wellness",
    features: [
      "10 AI counseling sessions/month",
      "Comprehensive mood assessment",
      "Personalized wellness plan",
      "All meditation resources",
      "Priority email support",
      "Session history & insights",
      "UPI & Digital wallet payments",
    ],
    buttonText: "Choose Standard",
    sessionsCount: 10
  },
  {
    id: "premium",
    name: "Premium Plan",
    price: "₹499",
    description: "Complete mental wellness experience",
    features: [
      "Unlimited counseling sessions",
      "Advanced AI assessments",
      "Custom wellness program",
      "AI Voice counseling",
      "Guided meditation sessions",
      "24/7 priority support",
      "Video consultation access",
      "Journal & progress tracking",
      "UPI & Digital wallet payments",
    ],
    buttonText: "Choose Premium",
    isFeatured: true,
    sessionsCount: 999
  }
];

const Pricing = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12">
      {pricingPlans.map((plan) => (
        <PricingCard key={plan.id} plan={plan} />
      ))}
    </div>
  );
};

export { pricingPlans };
export default Pricing;
