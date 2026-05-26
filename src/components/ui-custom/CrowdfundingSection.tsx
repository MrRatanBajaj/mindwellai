import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, Sparkles, Users, Target, IndianRupee, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const PRESET_AMOUNTS = [99, 299, 999, 2499];
const GOAL = 2500000; // ₹25 Lakh
const RAISED = 412000; // shown on UI

export default function CrowdfundingSection() {
  const { user } = useAuth();
  const [amount, setAmount] = useState<number>(299);
  const [custom, setCustom] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState(user?.email ?? "");
  const [loading, setLoading] = useState(false);

  const pct = Math.min(100, (RAISED / GOAL) * 100);
  const finalAmount = custom ? Number(custom) : amount;

  const handleBack = async () => {
    if (!name.trim() || !email.trim()) {
      toast.error("Please enter your name and email");
      return;
    }
    if (!finalAmount || finalAmount < 10) {
      toast.error("Minimum contribution is ₹10");
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("razorpay-payment", {
        body: {
          amount: finalAmount,
          currency: "INR",
          name,
          email,
          planId: "crowdfund",
          paymentMethod: "upi",
        },
      });
      if (error) throw error;

      await new Promise<void>((resolve, reject) => {
        const s = document.createElement("script");
        s.src = "https://checkout.razorpay.com/v1/checkout.js";
        s.onload = () => resolve();
        s.onerror = () => reject(new Error("Failed to load Razorpay"));
        document.head.appendChild(s);
      });

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "WellMindAI · Back the mission",
        description: "Crowdfund contribution to bring affordable mental healthcare to 970M Indians",
        order_id: data.orderId,
        prefill: { name, email },
        theme: { color: "#10B981" },
        handler: () => {
          toast.success("Thank you 💚 You just helped someone find calm.");
          setCustom("");
        },
        modal: {
          ondismiss: () => toast.message("Contribution cancelled"),
        },
      };
      // @ts-ignore
      new window.Razorpay(options).open();
    } catch (e) {
      console.error(e);
      toast.error("Could not start payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="crowdfund" className="py-24 relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/10">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-accent/15 blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/20 text-foreground/80 text-xs font-medium mb-5">
            <Sparkles className="w-3.5 h-3.5 text-primary" /> Community crowdfund
          </div>
          <h2 className="font-display text-4xl md:text-5xl text-foreground mb-5 leading-tight">
            Back the mission to give <span className="serif-italic text-primary">India</span> its first 24/7 mental wellness companion.
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-8">
            Every ₹ you contribute keeps the helpline alive for one more person tonight — a student in distress, a parent who can't sleep, a teenager too anxious to ask for help.
          </p>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-baseline justify-between mb-2">
              <div>
                <div className="font-display text-3xl text-foreground">₹{(RAISED / 100000).toFixed(1)}L</div>
                <div className="text-xs text-muted-foreground">raised of ₹{(GOAL / 100000).toFixed(0)}L goal</div>
              </div>
              <div className="text-right">
                <div className="font-display text-2xl text-primary">{Math.round(pct)}%</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                  <Users className="w-3 h-3" /> 318 backers
                </div>
              </div>
            </div>
            <div className="h-3 w-full rounded-full bg-secondary overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${pct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Heart, k: "₹99", v: "1 free helpline call" },
              { icon: Target, k: "₹999", v: "10 days of access for a student" },
              { icon: Users, k: "₹2,499", v: "Sponsor a college club" },
            ].map((b) => (
              <div key={b.k} className="p-4 rounded-2xl bg-card border border-border">
                <b.icon className="w-4 h-4 text-primary mb-2" />
                <div className="font-display text-lg text-foreground">{b.k}</div>
                <div className="text-[11px] text-muted-foreground leading-snug">{b.v}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Pledge card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="absolute -inset-3 bg-gradient-to-br from-primary/15 to-accent/30 rounded-[2rem] blur-2xl" />
          <div className="relative rounded-[2rem] bg-card/95 backdrop-blur-xl border border-border shadow-elegant p-7">
            <div className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">Make a contribution</div>
            <h3 className="font-display text-2xl text-foreground mb-5">Choose any amount</h3>

            <div className="grid grid-cols-4 gap-2 mb-3">
              {PRESET_AMOUNTS.map((a) => (
                <button
                  key={a}
                  onClick={() => { setAmount(a); setCustom(""); }}
                  className={`py-3 rounded-xl text-sm font-semibold border-2 transition ${
                    !custom && amount === a
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-secondary/40 text-foreground hover:border-primary/40"
                  }`}
                >
                  ₹{a}
                </button>
              ))}
            </div>

            <div className="relative mb-4">
              <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Or enter custom amount"
                type="number"
                min={10}
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
                className="pl-9 h-12"
              />
            </div>

            <div className="grid gap-3 mb-5">
              <Input
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12"
              />
              <Input
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12"
              />
            </div>

            <Button
              onClick={handleBack}
              disabled={loading}
              size="lg"
              className="w-full h-14 rounded-full bg-primary hover:bg-primary/90 text-base font-semibold shadow-elegant"
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Opening secure payment…</>
              ) : (
                <><Heart className="w-5 h-5 mr-2" /> Back with ₹{finalAmount || 0}</>
              )}
            </Button>
            <p className="text-[11px] text-muted-foreground text-center mt-3">
              Secure via Razorpay · UPI · Card · Netbanking
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
