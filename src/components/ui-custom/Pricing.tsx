
import PricingCard, { PricingPlan } from "./PricingCard";

const pricingPlans: PricingPlan[] = [
  {
    id: "free-trial",
    name: "Free Trial",
    price: "₹0",
    description: "Try our AI counseling with no commitment",
    features: [
      "3 free counseling sessions",
      "Basic mental health assessment",
      "Access to meditation resources",
      "Email support",
    ],
    buttonText: "Start Free Trial",
    isFree: true,
    sessionsCount: 3
  },
  {
    id: "basic",
    name: "Basic Plan",
    price: "₹999",
    description: "Perfect for ongoing support needs",
    features: [
      "8 counseling sessions per month",
      "Comprehensive mental health assessment",
      "Personalized growth plan",
      "Access to all meditation resources",
      "Priority email support",
      "UPI & Digital wallet payments",
    ],
    buttonText: "Choose Basic",
    sessionsCount: 8
  },
  {
    id: "premium",
    name: "Premium Plan",
    price: "₹1999",
    description: "Comprehensive mental wellness support",
    features: [
      "Unlimited counseling sessions",
      "Advanced mental health assessments",
      "Customized wellness program",
      "Full access to all resources",
      "Guided meditation sessions",
      "24/7 priority support",
      "AI Voice counseling included",
      "UPI & Digital wallet payments",
    ],
    buttonText: "Choose Premium",
    isFeatured: true,
    sessionsCount: 999 // Unlimited
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
