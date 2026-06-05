import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap, Copy, Share2, Users, Sparkles, Check, Mail, MessageCircle,
  Trophy, Award, Crown, Star, Megaphone, Gift, TrendingUp, Briefcase,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ReferralCode {
  code: string;
  total_invited: number;
  total_converted: number;
  total_reward_days: number;
}

interface Referral {
  id: string;
  referred_email: string | null;
  status: string;
  reward_days: number;
  created_at: string;
}

const generateCode = (email: string) => {
  const base = (email.split("@")[0] || "campus").replace(/[^a-z0-9]/gi, "").slice(0, 6).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `CA-${base}-${rand}`;
};

const TIERS = [
  { name: "Cadet",     min: 0,   color: "text-muted-foreground", bg: "bg-muted/40",        icon: Star,    perks: ["7 free days per signup", "Ambassador kit (PDF)"] },
  { name: "Advocate",  min: 5,   color: "text-primary",          bg: "bg-primary/10",      icon: Award,   perks: ["+15 bonus days", "WellMindAI swag", "LinkedIn certificate"] },
  { name: "Leader",    min: 15,  color: "text-accent-foreground",bg: "bg-accent/25",       icon: Trophy,  perks: ["Private founder AMA", "Featured on Wall of Champions", "Premium plan free 3 months"] },
  { name: "Captain",   min: 40,  color: "text-primary",          bg: "bg-gradient-to-br from-primary/15 to-accent/30", icon: Crown,   perks: ["Internship offer letter", "Premium plan free 1 year", "Equity-track conversion"] },
];

const Referrals = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [code, setCode] = useState<ReferralCode | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate("/auth"); return; }
    (async () => {
      let { data } = await supabase
        .from("referral_codes").select("*").eq("user_id", user.id).maybeSingle();
      if (!data) {
        const newCode = generateCode(user.email || "campus");
        const { data: created } = await supabase
          .from("referral_codes").insert({ user_id: user.id, code: newCode }).select().single();
        data = created;
      }
      setCode(data);
      const { data: refs } = await supabase
        .from("referrals").select("*").eq("referrer_user_id", user.id).order("created_at", { ascending: false });
      setReferrals(refs || []);
      setLoading(false);
    })();
  }, [user, navigate]);

  const referralLink = code ? `${window.location.origin}/auth?ref=${code.code}` : "";
  const converted = code?.total_converted ?? 0;
  const currentTier = [...TIERS].reverse().find((t) => converted >= t.min) ?? TIERS[0];
  const nextTier = TIERS.find((t) => t.min > converted);
  const progressPct = nextTier ? Math.min(100, (converted / nextTier.min) * 100) : 100;

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success("Ambassador link copied");
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWhatsApp = () => {
    const msg = `Hey, I'm a WellMindAI Campus Ambassador 🌿 Join through my link and get 7 days free of AI mental wellness: ${referralLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  };
  const shareEmail = () => {
    const subject = "Try WellMindAI with me (Campus Ambassador invite)";
    const body = `Hey,\n\nI'm a Campus Ambassador for WellMindAI. Use my link to get 7 days free:\n\n${referralLink}\n\nTake care.`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  const sendInvite = async () => {
    if (!inviteEmail.trim() || !code || !user) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inviteEmail)) { toast.error("Enter a valid email"); return; }
    const { error } = await supabase.from("referrals").insert({
      referrer_user_id: user.id,
      referred_email: inviteEmail.trim(),
      code: code.code,
      status: "pending",
    });
    if (error) { toast.error("Could not save invite"); return; }
    await supabase
      .from("referral_codes")
      .update({ total_invited: code.total_invited + 1 })
      .eq("user_id", user.id);
    setCode({ ...code, total_invited: code.total_invited + 1 });
    setReferrals((p) => [
      { id: crypto.randomUUID(), referred_email: inviteEmail.trim(), status: "pending", reward_days: 0, created_at: new Date().toISOString() },
      ...p,
    ]);
    setInviteEmail("");
    toast.success(`Invite logged for ${inviteEmail}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-28 pb-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">

          {/* HERO */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/25 text-foreground text-xs font-semibold mb-4">
              <GraduationCap className="w-3.5 h-3.5 text-primary" /> Campus Ambassador Program
            </div>
            <h1 className="font-display text-4xl md:text-6xl text-foreground mb-4 text-balance">
              Lead the mental wellness <span className="serif-italic text-primary">movement</span> on your campus.
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Help your peers access AI therapy. Earn stipends, swag, certificates and a fast-track to a WellMindAI internship.
            </p>
          </motion.div>

          {/* TIER PROGRESS */}
          {code && (
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              className="mb-10 p-7 rounded-3xl bg-investor text-primary-foreground shadow-elegant relative overflow-hidden"
            >
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(hsl(var(--accent) / 0.5) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
              <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <div className="text-xs uppercase tracking-widest opacity-75 mb-1">Your tier</div>
                  <div className="flex items-center gap-3">
                    <currentTier.icon className="w-8 h-8 text-accent" />
                    <span className="font-display text-3xl">{currentTier.name}</span>
                  </div>
                  <div className="mt-2 text-sm opacity-80">
                    {nextTier
                      ? `${nextTier.min - converted} more conversions to reach ${nextTier.name}`
                      : "Top tier unlocked — talk to the founder about going full-time."}
                  </div>
                </div>
                <div className="flex-1 max-w-md w-full">
                  <div className="h-2.5 rounded-full bg-foreground/15 overflow-hidden">
                    <motion.div
                      className="h-full bg-accent"
                      initial={{ width: 0 }} animate={{ width: `${progressPct}%` }} transition={{ duration: 1 }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] opacity-70 mt-2 uppercase tracking-widest">
                    {TIERS.map((t) => <span key={t.name}>{t.name}</span>)}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STATS */}
          {code && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
              {[
                { label: "Invited", value: code.total_invited, icon: Megaphone },
                { label: "Converted", value: code.total_converted, icon: TrendingUp },
                { label: "Reward Days", value: code.total_reward_days, icon: Gift },
                { label: "Tier", value: currentTier.name, icon: currentTier.icon },
              ].map((s) => (
                <Card key={s.label} className="border-border/40">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <s.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-lg font-display text-foreground leading-none">{s.value}</div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">{s.label}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* TIERS DETAIL */}
          <div className="mb-10">
            <h2 className="font-display text-2xl text-foreground mb-5 text-center">Ambassador tiers & perks</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {TIERS.map((t) => {
                const isCurrent = t.name === currentTier.name;
                return (
                  <div key={t.name} className={cn(
                    "p-5 rounded-2xl border transition",
                    t.bg,
                    isCurrent ? "border-primary shadow-elegant" : "border-border/50",
                  )}>
                    <t.icon className={cn("w-7 h-7 mb-3", t.color)} />
                    <div className="font-display text-xl text-foreground mb-1">{t.name}</div>
                    <div className="text-xs text-muted-foreground mb-3">
                      {t.min === 0 ? "Starting tier" : `${t.min}+ conversions`}
                    </div>
                    <ul className="space-y-1.5">
                      {t.perks.map((p) => (
                        <li key={p} className="text-xs text-foreground/80 flex items-start gap-1.5">
                          <Check className="w-3 h-3 text-primary mt-0.5 shrink-0" /> {p}
                        </li>
                      ))}
                    </ul>
                    {isCurrent && (
                      <Badge className="mt-3 bg-primary text-primary-foreground text-[10px]">You're here</Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* LINK & ACTIONS */}
          <Card className="border-border/40 mb-6">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Share2 className="w-4 h-4 text-primary" /> Your ambassador link
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input value={loading ? "Loading…" : referralLink} readOnly className="font-mono text-xs" />
                <Button onClick={copyLink} className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5">
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
              </div>
              {code && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Code:</span>
                  <Badge variant="outline" className="font-mono">{code.code}</Badge>
                </div>
              )}
              <div className="flex flex-wrap gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={shareWhatsApp} className="gap-1.5">
                  <MessageCircle className="w-4 h-4 text-green-600" /> WhatsApp
                </Button>
                <Button variant="outline" size="sm" onClick={shareEmail} className="gap-1.5">
                  <Mail className="w-4 h-4 text-primary" /> Email
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40 mb-6">
            <CardHeader>
              <CardTitle className="text-base">Invite a peer directly</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Input
                type="email" placeholder="friend@college.edu"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendInvite()}
              />
              <Button onClick={sendInvite} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Send invite
              </Button>
            </CardContent>
          </Card>

          {/* HISTORY */}
          <Card className="border-border/40 mb-6">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" /> Your conversions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {referrals.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No invites yet. Share your link to start climbing the tiers.
                </p>
              ) : (
                <div className="space-y-2">
                  {referrals.map((r) => (
                    <div key={r.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border/30">
                      <div>
                        <p className="text-sm font-medium text-foreground">{r.referred_email || "Anonymous signup"}</p>
                        <p className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {r.reward_days > 0 && <span className="text-xs text-primary font-medium">+{r.reward_days}d</span>}
                        <Badge variant="secondary">{r.status.replace("_", " ")}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* FAQ / closing */}
          <div className="p-7 rounded-3xl bg-gradient-to-br from-primary/8 to-accent/15 border border-primary/15 text-center">
            <Briefcase className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-display text-2xl text-foreground mb-2">Want to go beyond ambassador?</h3>
            <p className="text-muted-foreground text-sm max-w-md mx-auto mb-5">
              Top performers convert into paid internships and equity-track roles with the founding team.
            </p>
            <a href="mailto:campus@wellmindai.in">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6">
                Apply to founding team
              </Button>
            </a>
          </div>

          <p className="text-xs text-muted-foreground text-center mt-6 max-w-lg mx-auto">
            Stipends paid monthly via UPI after KYC. Self-referrals and abuse will be reversed.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Referrals;
