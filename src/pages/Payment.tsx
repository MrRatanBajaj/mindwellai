
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { pricingPlans } from "@/components/ui-custom/Pricing";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Check, CreditCard, Calendar, Lock } from "lucide-react";

const Payment = () => {
  const [searchParams] = useSearchParams();
  const planId = searchParams.get("plan");
  const navigate = useNavigate();
  
  const [selectedPlan, setSelectedPlan] = useState(
    pricingPlans.find(plan => plan.id === planId) || pricingPlans[0]
  );
  
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });
  
  useEffect(() => {
    // If user directly navigates to payment without selecting a plan, redirect to plans
    if (!planId) {
      navigate("/plans");
    }
    
    const plan = pricingPlans.find(plan => plan.id === planId);
    if (plan) {
      setSelectedPlan(plan);
    }
  }, [planId, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // For free trial, no payment processing needed
    if (selectedPlan.isFree) {
      toast.success("Your free trial has been activated! Redirecting to schedule your first session.");
      setTimeout(() => {
        navigate("/consultation");
      }, 2000);
      return;
    }
    
    // In a real app, this would process the payment
    if (!paymentDetails.cardNumber || !paymentDetails.cardName || !paymentDetails.expiryDate || !paymentDetails.cvv) {
      toast.error("Please fill in all payment details");
      return;
    }
    
    toast.success("Payment successful! Redirecting to schedule your session.");
    setTimeout(() => {
      navigate("/consultation");
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <section className="pt-32 pb-10 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance animate-fade-in">
            Complete Your {selectedPlan.isFree ? "Free Trial" : "Purchase"}
          </h1>
          <p className="text-slate-600 text-lg mb-6 max-w-2xl mx-auto text-balance animate-fade-in">
            {selectedPlan.isFree 
              ? "Get started with your free trial and experience the benefits of MindwellAI counseling." 
              : "You're one step away from beginning your mental wellness journey with MindwellAI."}
          </p>
        </div>
      </section>
      
      <section className="py-10 px-6 mb-20 flex-grow">
        <div className="max-w-4xl mx-auto">
          <div className="glass-panel rounded-xl p-6 md:p-10 shadow-lg animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Order Summary */}
              <div className="col-span-1 p-6 bg-slate-50 rounded-lg border border-slate-200">
                <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-600">Plan</span>
                    <span className="font-medium">{selectedPlan.name}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-600">Sessions</span>
                    <span className="font-medium">
                      {selectedPlan.sessionsCount === 999 ? "Unlimited" : `${selectedPlan.sessionsCount} sessions`}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-600">Billing</span>
                    <span className="font-medium">
                      {selectedPlan.isFree ? "One-time" : "Monthly"}
                    </span>
                  </div>
                </div>
                <div className="border-t border-slate-200 pt-4 mb-4">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>{selectedPlan.price}{!selectedPlan.isFree && "/month"}</span>
                  </div>
                </div>
                <div className="text-xs text-slate-500 italic">
                  {selectedPlan.isFree 
                    ? "No payment information required for free trial" 
                    : "You will be charged on a monthly basis"}
                </div>
              </div>
              
              {/* Payment Form */}
              <div className="col-span-2">
                <h3 className="text-lg font-semibold mb-4">
                  {selectedPlan.isFree ? "Create Account" : "Payment Information"}
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  {!selectedPlan.isFree && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <div className="relative">
                          <Input
                            id="cardNumber"
                            name="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            className="pl-10"
                            value={paymentDetails.cardNumber}
                            onChange={handleInputChange}
                          />
                          <CreditCard className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="cardName">Name on Card</Label>
                        <Input
                          id="cardName"
                          name="cardName"
                          placeholder="John Doe"
                          value={paymentDetails.cardName}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiryDate">Expiry Date</Label>
                          <div className="relative">
                            <Input
                              id="expiryDate"
                              name="expiryDate"
                              placeholder="MM/YY"
                              className="pl-10"
                              value={paymentDetails.expiryDate}
                              onChange={handleInputChange}
                            />
                            <Calendar className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <div className="relative">
                            <Input
                              id="cvv"
                              name="cvv"
                              placeholder="123"
                              className="pl-10"
                              value={paymentDetails.cvv}
                              onChange={handleInputChange}
                            />
                            <Lock className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  
                  <div className="flex items-center mt-6">
                    <Check className="w-5 h-5 text-mindwell-600 mr-2" />
                    <span className="text-sm text-slate-600">
                      I agree to the <a href="#" className="text-mindwell-600 underline">Terms of Service</a> and <a href="#" className="text-mindwell-600 underline">Privacy Policy</a>
                    </span>
                  </div>
                  
                  <Button 
                    type="submit"
                    className="w-full bg-mindwell-500 hover:bg-mindwell-600 text-white mt-6"
                  >
                    {selectedPlan.isFree 
                      ? "Start Free Trial" 
                      : `Pay ${selectedPlan.price}`}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Payment;
