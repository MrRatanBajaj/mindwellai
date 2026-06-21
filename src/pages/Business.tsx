import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { NavLink, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSEO } from "@/hooks/useSEO";
import { useAuth } from "@/hooks/useAuth";
import {
  Building2, Users, Calendar, ShieldCheck, TrendingDown, Sparkles,
  CheckCircle2, ArrowRight, Mail, Phone, Globe2, Award, Lock, Headphones,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// ─────────────────── Realtime pricing engine ───────────────────
const PER_SEAT_INR = 299; // ₹299 / seat / month — flat, no haggling
const MIN_SEATS = 50;

function volumeDiscount(_seats: number) { return 0; }
function durationDiscount(_months: number) { return 0; }

const FREE_DOMAINS = new Set([
  "gmail.com","yahoo.com","yahoo.co.in","hotmail.com","outlook.com",
  "live.com","icloud.com","aol.com","proton.me","protonmail.com","rediffmail.com",
]);
const isBusinessEmail = (email: string) => {
  const d = email.split("@")[1]?.toLowerCase().trim();
  if (!d) return false;
  return !FREE_DOMAINS.has(d);
};

export default function Business() {
  useSEO({
    title: "WellMindAI for Business — Employee Mental Wellness Plans",
    description: "Custom B2B mental wellness plans for companies, universities & startups. Realtime pricing by team size and duration. From ₹69/user/month.",
    path: "/business",
  });

  const navigate = useNavigate();
  const { user } = useAuth();

  const [employees, setEmployees] = useState(100);
  const [months, setMonths] = useState(12);
  const [companyName, setCompanyName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const pricing = useMemo(() => {
    const vd = volumeDiscount(employees);
    const dd = durationDiscount(months);
    const combinedDisc = 1 - (1 - vd) * (1 - dd); // stacked
    const monthlyList = PER_SEAT_INR * employees;
    const monthlyEffective = Math.round(monthlyList * (1 - vd) * (1 - dd));
    const perUserEffective = Math.round(PER_SEAT_INR * (1 - vd) * (1 - dd));
    const total = monthlyEffective * months;
    const saved = (monthlyList * months) - total;
    return { vd, dd, combinedDisc, monthlyList, monthlyEffective, perUserEffective, total, saved };
  }, [employees, months]);

  const tier = useMemo(() => {
    if (employees >= 500) return { label: "Enterprise", color: "bg-primary/15 text-primary" };
    if (employees >= 200) return { label: "Scale",      color: "bg-accent/30 text-foreground" };
    if (employees >= 50)  return { label: "Growth",     color: "bg-secondary text-secondary-foreground" };
    return { label: "Starter", color: "bg-muted text-muted-foreground" };
  }, [employees]);

  const submit = async () => {
    if (!companyName.trim()) { toast.error("Enter company / institution name"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminEmail)) { toast.error("Enter a valid email"); return; }
    if (!isBusinessEmail(adminEmail)) {
      toast.error("Use a work email (gmail / yahoo / hotmail not allowed)");
      return;
    }
    if (!user) {
      toast.info("Please sign in with your work email to activate the plan.");
      navigate(`/auth?redirect=/business`);
      return;
    }
    setSubmitting(true);
    try {
      const domain = adminEmail.split("@")[1].toLowerCase();
      const tierStr =
        employees >= 500 ? "500+" : employees >= 50 ? "51-500" : "1-50";

      const { error } = await supabase.from("b2b_companies").insert({
        admin_user_id: user.id,
        admin_email: adminEmail.trim().toLowerCase(),
        company_name: companyName.trim(),
        domain,
        employee_tier: tierStr,
        plan: "business",
        seats: employees,
        monthly_price_inr: pricing.monthlyEffective,
        is_active: false,
      });
      if (error) throw error;
      toast.success("Quote saved. Our team will email you within 24h to activate.");
      const subject = `New B2B quote: ${companyName} (${employees} users, ${months} mo)`;
      const body = `Company: ${companyName}\nAdmin email: ${adminEmail}\nEmployees: ${employees}\nDuration: ${months} months\nMonthly: ₹${pricing.monthlyEffective.toLocaleString()}\nTotal contract: ₹${pricing.total.toLocaleString()}\n`;
      window.open(`mailto:sales@wellmindai.in?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    } catch (e: any) {
      toast.error(e?.message || "Could not save. Please email sales@wellmindai.in");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 pt-28 pb-20">
        {/* HERO */}
        <section className="max-w-5xl mx-auto px-6 text-center mb-12">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
              <Building2 className="w-3.5 h-3.5" /> WellMindAI for Business
            </div>
            <h1 className="font-display text-4xl md:text-6xl text-foreground mb-4 text-balance">
              Mental wellness for every <span className="serif-italic text-primary">employee, student</span>, or member.
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Custom enterprise plans for companies, universities and coaching institutes. Realtime pricing — adjust team size and duration, see your number change instantly.
            </p>
          </motion.div>
        </section>

        {/* TRUST STRIP */}
        <section className="max-w-5xl mx-auto px-6 mb-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: ShieldCheck, k: "HIPAA-grade", v: "RLS encrypted" },
              { icon: Lock,        k: "ISO-aligned", v: "Audit logging" },
              { icon: Headphones,  k: "24/7 SLA",   v: "<2h response" },
              { icon: Award,       k: "120+ campuses", v: "Live deployments" },
            ].map((t) => (
              <div key={t.k} className="p-4 rounded-2xl bg-card border border-border/60 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <t.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-foreground leading-tight">{t.k}</div>
                  <div className="text-xs text-muted-foreground">{t.v}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CALCULATOR */}
        <section className="max-w-5xl mx-auto px-6 mb-16">
          <Card className="border-primary/20 shadow-elegant overflow-hidden">
            <CardHeader className="bg-gradient-to-br from-primary/5 to-accent/10 border-b border-border/40">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="w-5 h-5 text-primary" /> Realtime price calculator
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Slide to your team size and contract length — pricing updates live.
              </p>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Inputs */}
                <div className="space-y-7">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="flex items-center gap-2 text-sm font-medium">
                        <Users className="w-4 h-4 text-primary" /> Employees / Students
                      </Label>
                      <Badge className={tier.color}>{tier.label}</Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <Input
                        type="number" min={MIN_SEATS} max={10000}
                        value={employees}
                        onChange={(e) => setEmployees(Math.max(MIN_SEATS, Math.min(10000, Number(e.target.value) || MIN_SEATS)))}
                        className="w-28 font-mono"
                      />
                      <Slider
                        value={[employees]} min={MIN_SEATS} max={1000} step={10}
                        onValueChange={(v) => setEmployees(Math.max(MIN_SEATS, v[0]))}
                        className="flex-1"
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-muted-foreground mt-2 uppercase tracking-widest">
                      <span>Minimum {MIN_SEATS} seats</span><span>₹{PER_SEAT_INR}/seat · flat</span><span>1,000+</span>
                    </div>
                  </div>

                  <div>
                    <Label className="flex items-center gap-2 text-sm font-medium mb-3">
                      <Calendar className="w-4 h-4 text-primary" /> Contract duration
                    </Label>
                    <div className="grid grid-cols-4 gap-2">
                      {[3, 6, 12, 24].map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setMonths(m)}
                          className={`p-3 rounded-xl border-2 text-sm font-semibold transition ${
                            months === m
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border hover:border-primary/40 text-foreground"
                          }`}
                        >
                          {m} mo
                          {durationDiscount(m) > 0 && (
                            <div className="text-[10px] text-primary font-normal mt-0.5">
                              -{Math.round(durationDiscount(m) * 100)}%
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border/40 space-y-2">
                    {pricing.vd > 0 && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground flex items-center gap-1.5">
                          <TrendingDown className="w-3.5 h-3.5 text-primary" /> Volume discount
                        </span>
                        <span className="font-semibold text-primary">-{Math.round(pricing.vd * 100)}%</span>
                      </div>
                    )}
                    {pricing.dd > 0 && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground flex items-center gap-1.5">
                          <TrendingDown className="w-3.5 h-3.5 text-primary" /> Duration discount
                        </span>
                        <span className="font-semibold text-primary">-{Math.round(pricing.dd * 100)}%</span>
                      </div>
                    )}
                    {pricing.saved > 0 && (
                      <div className="flex items-center justify-between text-xs pt-1.5">
                        <span className="text-muted-foreground">You save</span>
                        <span className="font-semibold text-foreground">₹{Math.round(pricing.saved).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Live total */}
                <motion.div
                  layout
                  className="rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-7 flex flex-col justify-between shadow-elegant"
                >
                  <div>
                    <div className="text-xs uppercase tracking-widest opacity-80 mb-2">Effective price</div>
                    <div className="flex items-baseline gap-1">
                      <span className="font-display text-5xl md:text-6xl">₹{pricing.perUserEffective}</span>
                      <span className="opacity-80 text-sm">/user/month</span>
                    </div>
                    {pricing.perUserEffective < PER_SEAT_INR && (
                      <div className="text-xs opacity-70 mt-1">
                        <span className="line-through">₹{PER_SEAT_INR}</span> list price
                      </div>
                    )}

                    <div className="mt-6 space-y-2 text-sm">
                      <div className="flex justify-between opacity-90">
                        <span>Monthly invoice</span>
                        <span className="font-semibold">₹{pricing.monthlyEffective.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between opacity-90">
                        <span>Total contract ({months} mo)</span>
                        <span className="font-semibold">₹{pricing.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-5 border-t border-primary-foreground/20 space-y-1.5 text-xs opacity-90">
                    {[
                      "Everything in Plus for every seat",
                      "Org admin dashboard + anonymized reports",
                      "Crisis escalation + 24/7 SLA",
                      "Dedicated account manager",
                    ].map((p) => (
                      <div key={p} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> {p}
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Activate form */}
              <div className="mt-8 pt-8 border-t border-border/40">
                <h3 className="font-display text-xl text-foreground mb-1">Activate for your organization</h3>
                <p className="text-sm text-muted-foreground mb-5">
                  Quote saved instantly. Our team activates within 24h after KYC + payment.
                </p>
                <div className="grid md:grid-cols-2 gap-3 mb-4">
                  <div>
                    <Label className="text-xs mb-1.5">Company / Institution</Label>
                    <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Acme Corp / IIT Delhi" />
                  </div>
                  <div>
                    <Label className="text-xs mb-1.5">Work email</Label>
                    <Input type="email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} placeholder="hr@acme.com" />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button onClick={submit} disabled={submitting} className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 flex-1">
                    {submitting ? "Activating…" : <>Activate Instant Access For Your Team <ArrowRight className="w-4 h-4" /></>}
                  </Button>
                  <a href="mailto:sales@wellmindai.in" className="flex-1">
                    <Button variant="outline" className="w-full gap-2">
                      <Mail className="w-4 h-4" /> Email sales
                    </Button>
                  </a>
                </div>
                <p className="text-[11px] text-muted-foreground mt-3">
                  Work email required (gmail / yahoo / hotmail not accepted). GST invoice provided.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* WHO IT'S FOR */}
        <section className="max-w-5xl mx-auto px-6 mb-16">
          <h2 className="font-display text-3xl text-foreground mb-6 text-center">Built for these teams</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: Building2, t: "Companies & Startups", d: "Reduce burnout, retain talent, hit ESG/wellness OKRs." },
              { icon: Globe2,    t: "Universities & Schools", d: "Counselor shortage solved — 24/7 AI + on-call humans." },
              { icon: Phone,     t: "Coaching Institutes",   d: "Pre-exam anxiety support for thousands of students." },
            ].map((c) => (
              <div key={c.t} className="p-6 rounded-2xl bg-card border border-border hover-lift">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <c.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display text-lg mb-1.5">{c.t}</h3>
                <p className="text-sm text-muted-foreground">{c.d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-6 text-center">
          <NavLink to="/research">
            <Button variant="outline" size="sm" className="gap-2">
              Read our research papers <ArrowRight className="w-4 h-4" />
            </Button>
          </NavLink>
        </section>
      </main>

      <Footer />
    </div>
  );
}
