import { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Megaphone, Users, Wallet, Sparkles, CheckCircle2, TrendingUp, Share2, Gift,
} from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const TIERS = [
  { name: "Starter", followers: "1k – 10k", commission: "20%", perks: "Welcome kit + custom code" },
  { name: "Growth", followers: "10k – 100k", commission: "30%", perks: "Co-branded landing page + bonus payouts" },
  { name: "Signature", followers: "100k+", commission: "40% + retainer", perks: "Dedicated manager + revenue share" },
];

const PERKS = [
  { icon: Wallet, t: "Recurring revenue", d: "Earn on every renewal of every user you refer — for as long as they stay." },
  { icon: Share2, t: "Branded toolkit", d: "Custom links, banners, video assets, scripts — ready in 24h." },
  { icon: TrendingUp, t: "Real-time dashboard", d: "Track clicks, conversions, payouts live. No black box." },
  { icon: Gift, t: "Free Premium for life", d: "Active partners unlock unlimited Virtual Human therapy access." },
];

export default function PartnerProgram() {
  useSEO({
    title: "Partner Program — WellMindAI for Creators & Influencers",
    description: "Earn up to 40% recurring commission promoting India's #1 AI mental wellness platform. Custom codes, real-time dashboard, instant payouts.",
    path: "/partner-program",
  });

  const [form, setForm] = useState({
    name: "", email: "", handle: "", platform: "Instagram", audience: "", pitch: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.handle.trim()) {
      toast.error("Please fill name, email, and your social handle.");
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.from("leads").insert({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        source: "partner_program",
        status: "new",
        landing_page: "/partner-program",
        notes: JSON.stringify({
          handle: form.handle,
          platform: form.platform,
          audience: form.audience,
          pitch: form.pitch,
        }),
      });
      if (error) throw error;
      setDone(true);
      toast.success("Application received! We'll reach out within 48h.");
    } catch (err: any) {
      toast.error(err?.message || "Could not submit. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-28 pb-20">
        {/* HERO */}
        <section className="max-w-5xl mx-auto px-6 text-center mb-14">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
              <Megaphone className="w-3.5 h-3.5" /> Creator & Influencer Program
            </div>
            <h1 className="font-display text-4xl md:text-6xl mb-4 tracking-tight">
              Get paid to talk about <span className="text-primary serif-italic">mental wellness</span>.
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Up to <span className="font-semibold text-foreground">40% recurring commission</span>, lifetime Premium access, and instant payouts.
              Built for creators who care about real impact.
            </p>
          </motion.div>
        </section>

        {/* PERKS */}
        <section className="max-w-5xl mx-auto px-6 mb-14">
          <div className="grid md:grid-cols-2 gap-4">
            {PERKS.map((p) => (
              <div key={p.t} className="p-6 rounded-2xl bg-card border border-border/60 flex gap-4">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <p.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-lg mb-1">{p.t}</h3>
                  <p className="text-sm text-muted-foreground">{p.d}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* TIERS */}
        <section className="max-w-5xl mx-auto px-6 mb-14">
          <h2 className="font-display text-3xl text-center mb-8">Commission tiers</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {TIERS.map((t, i) => (
              <Card key={t.name} className={i === 1 ? "border-primary shadow-lg" : ""}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {t.name}
                    {i === 1 && <span className="text-[10px] uppercase tracking-widest bg-primary text-primary-foreground px-2 py-0.5 rounded-full">Popular</span>}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">{t.followers} followers</p>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-display text-primary mb-2">{t.commission}</div>
                  <p className="text-sm text-muted-foreground">{t.perks}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* APPLY */}
        <section className="max-w-2xl mx-auto px-6">
          <Card className="border-primary/20 shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" /> Apply now
              </CardTitle>
              <p className="text-sm text-muted-foreground">Approval within 48 hours. Onboarding kit follows immediately.</p>
            </CardHeader>
            <CardContent>
              {done ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-3" />
                  <h3 className="font-display text-xl mb-1">Application received.</h3>
                  <p className="text-sm text-muted-foreground">We'll email <span className="font-medium">{form.email}</span> within 48 hours.</p>
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">Full name</Label>
                      <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    </div>
                    <div>
                      <Label className="text-xs">Email</Label>
                      <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-3 gap-3">
                    <div className="md:col-span-2">
                      <Label className="text-xs">Social handle</Label>
                      <Input placeholder="@yourhandle" value={form.handle} onChange={(e) => setForm({ ...form, handle: e.target.value })} />
                    </div>
                    <div>
                      <Label className="text-xs">Platform</Label>
                      <select className="w-full h-10 px-3 rounded-md border bg-background text-sm" value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })}>
                        <option>Instagram</option><option>YouTube</option><option>X / Twitter</option><option>LinkedIn</option><option>Other</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">Audience size</Label>
                    <Input placeholder="e.g. 25,000 followers" value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value })} />
                  </div>
                  <div>
                    <Label className="text-xs">Why are you a fit? (optional)</Label>
                    <Textarea rows={3} value={form.pitch} onChange={(e) => setForm({ ...form, pitch: e.target.value })} />
                  </div>
                  <Button type="submit" disabled={submitting} className="w-full">
                    {submitting ? "Submitting…" : "Apply to Partner Program"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </section>
      </main>
      <Footer />
    </div>
  );
}
