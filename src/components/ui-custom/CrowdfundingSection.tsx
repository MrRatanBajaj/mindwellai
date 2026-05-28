import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, Sparkles, Users, Target, Loader2, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const GOAL = 2500000; // ₹25L
const RAISED = 412000;
const QUICK = [199, 499, 999, 2499];

declare global {
  interface Window {
    Razorpay: any;
  }
}

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export default function CrowdfundingSection() {
  const pct = Math.min(100, (RAISED / GOAL) * 100);
  const [amount, setAmount] = useState<number>(499);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const contribute = async () => {
    if (!name.trim() || !email.trim() || amount < 49) {
      toast.error("Add your name, email and at least ₹49.");
      return;
    }
    setLoading(true);
    try {
      const ok = await loadRazorpay();
      if (!ok) throw new Error("Could not load Razorpay");

      const { data, error } = await supabase.functions.invoke("razorpay-payment", {
        body: {
          amount,
          currency: "INR",
          name,
          email,
          planId: "crowdfund",
          paymentMethod: "card",
        },
      });
      if (error) throw error;
      if (!data?.orderId || !data?.razorpayKeyId) throw new Error("Order not created");

      const rzp = new window.Razorpay({
        key: data.razorpayKeyId,
        amount: amount * 100,
        currency: "INR",
        name: "WellMindAI",
        description: "Community crowdfund contribution",
        order_id: data.orderId,
        prefill: { name, email },
        theme: { color: "#7c9b76" },
        handler: async (resp: any) => {
          try {
            await supabase.functions.invoke("verify-payment", {
              body: {
                razorpay_order_id: resp.razorpay_order_id,
                razorpay_payment_id: resp.razorpay_payment_id,
                razorpay_signature: resp.razorpay_signature,
              },
            });
          } catch {}
          toast.success("Thank you for backing the mission 💚");
        },
        modal: {
          ondismiss: () => toast("Contribution cancelled.", { description: "You can try again anytime." }),
        },
      });
      rzp.open();
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || "Payment could not start");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="crowdfund"
      className="py-24 relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/10"
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-accent/15 blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        {/* Story */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/20 text-foreground/80 text-xs font-medium mb-5">
            <Sparkles className="w-3.5 h-3.5 text-primary" /> Community crowdfund · powered by Razorpay
          </div>
          <h2 className="font-display text-4xl md:text-5xl text-foreground mb-5 leading-tight">
            Back the mission to give <span className="serif-italic text-primary">India</span> its first 24/7 mental wellness companion.
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-8">
            Every ₹ you contribute keeps the helpline alive for one more person tonight — a student in distress, a parent who can't sleep, a teenager too anxious to ask for help.
          </p>

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

        {/* Inline Razorpay form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="absolute -inset-3 bg-gradient-to-br from-primary/15 to-accent/30 rounded-[2rem] blur-2xl" />
          <div className="relative rounded-[2rem] bg-card/95 backdrop-blur-xl border border-border shadow-elegant p-7">
            <div className="flex items-center justify-between mb-4">
              <div className="text-xs uppercase tracking-widest text-primary font-semibold">Contribute</div>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ShieldCheck className="w-3 h-3" /> Secure · UPI / Card
              </span>
            </div>
            <h3 className="font-display text-2xl text-foreground mb-4 leading-tight">
              Choose any amount you like
            </h3>

            <div className="grid grid-cols-4 gap-2 mb-4">
              {QUICK.map((a) => (
                <button
                  key={a}
                  onClick={() => setAmount(a)}
                  className={`rounded-xl px-2 py-3 text-sm font-medium border transition ${
                    amount === a
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-secondary/40 text-foreground border-border hover:border-primary/50"
                  }`}
                >
                  ₹{a}
                </button>
              ))}
            </div>

            <div className="space-y-2 mb-4">
              <Input
                type="number"
                min={49}
                value={amount}
                onChange={(e) => setAmount(Math.max(0, parseInt(e.target.value || "0", 10)))}
                placeholder="Custom amount in ₹"
              />
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email for receipt"
              />
            </div>

            <Button
              onClick={contribute}
              disabled={loading}
              size="lg"
              className="w-full h-14 rounded-full bg-primary hover:bg-primary/90 text-base font-semibold shadow-elegant gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Heart className="w-5 h-5" />}
              Contribute ₹{amount || 0}
            </Button>
            <p className="text-[11px] text-muted-foreground text-center mt-3">
              Secure payments via Razorpay · UPI · Card · Netbanking · Wallet
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
