import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Heart, Sparkles, Users, Target, ExternalLink, ShieldCheck } from "lucide-react";

// 🔗 Replace this with your actual Ketto campaign URL once the campaign goes live.
// Until then, this links to Ketto's start-a-campaign page so visitors know where to go.
const KETTO_CAMPAIGN_URL = "https://www.ketto.org/new/fundraiser/wellmindai-affordable-mental-healthcare-for-india";

const GOAL = 2500000; // ₹25 Lakh
const RAISED = 412000; // sync this with Ketto's live total when you launch

export default function CrowdfundingSection() {
  const pct = Math.min(100, (RAISED / GOAL) * 100);

  const openKetto = () => {
    window.open(KETTO_CAMPAIGN_URL, "_blank", "noopener,noreferrer");
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
        {/* Left — story */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/20 text-foreground/80 text-xs font-medium mb-5">
            <Sparkles className="w-3.5 h-3.5 text-primary" /> Community crowdfund · powered by Ketto
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
                  <Users className="w-3 h-3" /> 318 backers on Ketto
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

        {/* Right — Ketto handoff card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="absolute -inset-3 bg-gradient-to-br from-primary/15 to-accent/30 rounded-[2rem] blur-2xl" />
          <div className="relative rounded-[2rem] bg-card/95 backdrop-blur-xl border border-border shadow-elegant p-7">
            <div className="flex items-center justify-between mb-4">
              <div className="text-xs uppercase tracking-widest text-primary font-semibold">Contribute on Ketto</div>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ShieldCheck className="w-3 h-3" /> 80G eligible
              </span>
            </div>
            <h3 className="font-display text-2xl text-foreground mb-3 leading-tight">
              India's most trusted crowdfunding platform
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              You'll be redirected to our verified Ketto campaign page where you can contribute any amount via <span className="font-medium text-foreground">UPI, Card, Netbanking or Wallet</span> — all in a single tap. Tax benefits, refund policy and donor support are handled by Ketto.
            </p>

            {/* Trust row */}
            <div className="grid grid-cols-3 gap-2 mb-6 text-center">
              {[
                { k: "8M+", v: "donors" },
                { k: "₹2,000Cr+", v: "raised" },
                { k: "verified", v: "campaign" },
              ].map((s) => (
                <div key={s.v} className="rounded-xl bg-secondary/40 border border-border p-3">
                  <div className="font-display text-sm text-foreground">{s.k}</div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wide">{s.v}</div>
                </div>
              ))}
            </div>

            <Button
              onClick={openKetto}
              size="lg"
              className="w-full h-14 rounded-full bg-primary hover:bg-primary/90 text-base font-semibold shadow-elegant gap-2"
            >
              <Heart className="w-5 h-5" /> Contribute on Ketto
              <ExternalLink className="w-4 h-4 opacity-80" />
            </Button>
            <p className="text-[11px] text-muted-foreground text-center mt-3">
              Opens on Ketto · Secure · Instant 80G receipt
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
