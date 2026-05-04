
import PricingCard, { PricingPlan } from "./PricingCard";

const pricingPlans: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    price: "₹299",
    description: "Begin your guided wellness journey",
    features: [
      "Unlock Self Help library",
      "Book 2 counselor sessions / month",
      "Mood tracking & journaling",
      "Email support",
      "Cancel anytime",
    ],
    buttonText: "Choose Starter",
    sessionsCount: 2
  },
  {
    id: "standard",
    name: "Standard",
    price: "₹499",
    description: "Most popular for steady support",
    features: [
      "Everything in Starter",
      "Book 6 counselor sessions / month",
      "Personalized wellness plan",
      "Priority support",
      "Session history & insights",
    ],
    buttonText: "Choose Standard",
    isFeatured: true,
    sessionsCount: 6
  },
  {
    id: "premium",
    name: "Premium",
    price: "₹999",
    description: "Complete care, unlimited access",
    features: [
      "Everything in Standard",
      "Unlimited counselor sessions",
      "AI Voice & Video counseling",
      "Crisis priority response",
      "Advanced AI assessments",
    ],
    buttonText: "Choose Premium",
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
