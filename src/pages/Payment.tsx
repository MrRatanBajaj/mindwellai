import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Check, CreditCard, Calendar, Lock, Smartphone, Wallet, History, Crown,
  Sparkles, Shield, Loader2, ArrowLeft,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import PaymentHistory from "@/components/ui-custom/PaymentHistory";
import SubscriptionStatus from "@/components/ui-custom/SubscriptionStatus";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PLANS, getPlan } from "@/lib/pricing";
import { motion } from "framer-motion";

const Payment = () => {
  const [searchParams] = useSearchParams();
  const planId = searchParams.get("plan");
  const navigate = useNavigate();
  const { user } = useAuth();

  const selectedPlan = useMemo(
    () => getPlan(planId || "") || PLANS[0],
    [planId],
  );

  const [paymentDetails, setPaymentDetails] = useState({
    name: "",
    email: user?.email || "",
    phone: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "wallet">("upi");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!planId) navigate("/plans");
  }, [planId, navigate]);

  useEffect(() => {
    if (user?.email && !paymentDetails.email) {
      setPaymentDetails((p) => ({ ...p, email: user.email! }));
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.info("Please sign in to continue");
      navigate(`/auth?redirect=/payment?plan=${selectedPlan.id}`);
      return;
    }
    if (!paymentDetails.name || !paymentDetails.email) {
      toast.error("Please fill in your name and email");
      return;
    }
    setIsProcessing(true);
    try {
      const amount = selectedPlan.pricePaise / 100;
      const { data: orderData, error } = await supabase.functions.invoke("razorpay-payment", {
        body: {
          amount,
          currency: "INR",
          name: paymentDetails.name,
          email: paymentDetails.email,
          phone: paymentDetails.phone,
          planId: selectedPlan.id,
          paymentMethod,
        },
      });
      if (error) throw error;

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        const options = {
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency,
          name: "WellMindAI",
          description: `${selectedPlan.name} — ${selectedPlan.priceLabel}/${selectedPlan.periodLabel}`,
          order_id: orderData.orderId,
          prefill: orderData.prefill,
          theme: { color: "#6366f1" },
          method: orderData.method,
          handler: async (response: any) => {
            try {
              const { error: vErr } = await supabase.functions.invoke("verify-payment", {
                body: {
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpaySignature: response.razorpay_signature,
                },
              });
              if (vErr) throw vErr;
              toast.success(`${selectedPlan.name} active! Enjoy your sessions.`);
              setTimeout(() => navigate("/dashboard"), 1500);
            } catch {
              toast.error("Payment verification failed. Please contact support.");
            }
          },
          modal: {
            ondismiss: () => {
              setIsProcessing(false);
              toast.error("Payment cancelled");
            },
          },
        };
        new (window as any).Razorpay(options).open();
        setIsProcessing(false);
      };
      document.head.appendChild(script);
    } catch {
      toast.error("Failed to initiate payment. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-secondary/30 to-background">
      <Header />
      <main className="flex-grow pt-28 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue={planId ? "checkout" : "subscription"} className="w-full">
            <TabsList className="grid w-full max-w-lg mx-auto grid-cols-3 mb-8 rounded-full p-1 h-12">
              <TabsTrigger value="subscription" className="rounded-full gap-2">
                <Crown className="w-4 h-4" /> Plan
              </TabsTrigger>
              <TabsTrigger value="checkout" className="rounded-full gap-2">
                <CreditCard className="w-4 h-4" /> Checkout
              </TabsTrigger>
              <TabsTrigger value="history" className="rounded-full gap-2">
                <History className="w-4 h-4" /> History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="subscription">
              <div className="max-w-2xl mx-auto">
                <SubscriptionStatus />
              </div>
            </TabsContent>

            <TabsContent value="checkout">
              <Button
                variant="ghost"
                onClick={() => navigate("/plans")}
                className="mb-4 rounded-full"
              >
                <ArrowLeft className="w-4 h-4 mr-1" /> Change plan
              </Button>

              <div className="grid lg:grid-cols-[1fr_1.4fr] gap-8">
                {/* LEFT — Order summary */}
                <motion.aside
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="rounded-3xl border border-border/60 bg-card p-7 h-fit lg:sticky lg:top-28 shadow-sm"
                >
                  <div className="flex items-center gap-2 mb-1 text-xs font-semibold uppercase tracking-wider text-primary">
                    <Sparkles className="w-3.5 h-3.5" /> Order Summary
                  </div>
                  <h2 className="font-display text-2xl mb-1">{selectedPlan.name}</h2>
                  <p className="text-sm text-muted-foreground mb-6">{selectedPlan.tagline}</p>

                  <div className="rounded-2xl bg-gradient-to-br from-primary/10 via-accent/5 to-transparent p-5 mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="font-display text-5xl">{selectedPlan.priceLabel}</span>
                      <span className="text-sm text-muted-foreground">/{selectedPlan.periodLabel}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Active for {selectedPlan.periodDays} days · Cancel anytime
                    </p>
                  </div>

                  <div className="space-y-2.5 mb-6">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                      What you get
                    </p>
                    {selectedPlan.features.map((f) => (
                      <div key={f} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                        <span className="text-foreground/85">{f}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-border/60 pt-4">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total today</span>
                      <span>{selectedPlan.priceLabel}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Inclusive of all taxes · INR only
                    </p>
                  </div>

                  <div className="mt-6 flex items-center gap-4 text-[11px] text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><Lock className="w-3 h-3" /> 256-bit SSL</span>
                    <span className="inline-flex items-center gap-1"><Shield className="w-3 h-3" /> PCI DSS</span>
                    <span className="inline-flex items-center gap-1"><Sparkles className="w-3 h-3" /> Razorpay</span>
                  </div>
                </motion.aside>

                {/* RIGHT — Payment form */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="rounded-3xl border border-border/60 bg-card p-7 shadow-sm"
                >
                  <h3 className="font-display text-2xl mb-1">Payment Information</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Quick & secure — most users finish in under 30 seconds.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" name="name" placeholder="Your name"
                          value={paymentDetails.name} onChange={handleInputChange} required />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="phone">Phone (optional)</Label>
                        <Input id="phone" name="phone" type="tel" placeholder="+91…"
                          value={paymentDetails.phone} onChange={handleInputChange} />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" placeholder="you@example.com"
                        value={paymentDetails.email} onChange={handleInputChange} required />
                    </div>

                    <div className="space-y-2">
                      <Label>Payment Method</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: "upi" as const, icon: Smartphone, label: "UPI" },
                          { id: "card" as const, icon: CreditCard, label: "Card" },
                          { id: "wallet" as const, icon: Wallet, label: "Wallet" },
                        ].map((m) => {
                          const active = paymentMethod === m.id;
                          return (
                            <button
                              key={m.id}
                              type="button"
                              onClick={() => setPaymentMethod(m.id)}
                              className={`rounded-2xl border-2 p-4 flex flex-col items-center gap-1.5 transition ${
                                active
                                  ? "border-primary bg-primary/5"
                                  : "border-border/60 hover:border-primary/30"
                              }`}
                            >
                              <m.icon className={`w-5 h-5 ${active ? "text-primary" : "text-muted-foreground"}`} />
                              <span className="text-sm font-medium">{m.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {paymentMethod === "upi" && (
                      <div className="rounded-xl bg-secondary/50 p-3 flex flex-wrap gap-2 text-xs">
                        {["Google Pay", "PhonePe", "Paytm", "BHIM", "Amazon Pay"].map((u) => (
                          <span key={u} className="px-2 py-1 bg-background rounded">{u}</span>
                        ))}
                      </div>
                    )}

                    <Button
                      type="submit"
                      size="lg"
                      disabled={isProcessing}
                      className="w-full h-14 rounded-full font-semibold text-base"
                    >
                      {isProcessing ? (
                        <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processing…</>
                      ) : (
                        <><Lock className="w-4 h-4 mr-2" /> Pay {selectedPlan.priceLabel} securely</>
                      )}
                    </Button>

                    <p className="text-[11px] text-center text-muted-foreground">
                      By continuing, you agree to our Terms & Privacy. Your subscription
                      renews automatically every {selectedPlan.periodDays} days.
                    </p>
                  </form>
                </motion.div>
              </div>
            </TabsContent>

            <TabsContent value="history">
              <div className="max-w-3xl mx-auto">
                <h2 className="font-display text-2xl mb-6 text-center">Payment History</h2>
                <PaymentHistory />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Payment;
