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
import { Gift, Copy, Share2, Users, Sparkles, Check, Mail, MessageCircle } from "lucide-react";
import { toast } from "sonner";

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
  const base = (email.split("@")[0] || "wellmind").replace(/[^a-z0-9]/gi, "").slice(0, 6).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${base}-${rand}`;
};

const Referrals = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [code, setCode] = useState<ReferralCode | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    (async () => {
      // Get or create referral code
      let { data } = await supabase
        .from("referral_codes")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!data) {
        const newCode = generateCode(user.email || "user");
        const { data: created } = await supabase
          .from("referral_codes")
          .insert({ user_id: user.id, code: newCode })
          .select()
          .single();
        data = created;
      }
      setCode(data);

      const { data: refs } = await supabase
        .from("referrals")
        .select("*")
        .eq("referrer_user_id", user.id)
        .order("created_at", { ascending: false });
      setReferrals(refs || []);
      setLoading(false);
    })();
  }, [user, navigate]);

  const referralLink = code
    ? `${window.location.origin}/auth?ref=${code.code}`
    : "";

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWhatsApp = () => {
    const msg = `🌿 Join me on WellMindAI — your calm space for mental wellness. Use my link to get 7 days FREE: ${referralLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const shareEmail = () => {
    const subject = "Try WellMindAI with me 🌿";
    const body = `Hey,\n\nI've been using WellMindAI for journaling and counseling — it's been calming. Use my referral link to get 7 days free:\n\n${referralLink}\n\nTake care.`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  const sendInvite = async () => {
    if (!inviteEmail.trim() || !code || !user) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inviteEmail)) {
      toast.error("Enter a valid email");
      return;
    }
    const { error } = await supabase.from("referrals").insert({
      referrer_user_id: user.id,
      referred_email: inviteEmail.trim(),
      code: code.code,
      status: "pending",
    });
    if (error) {
      toast.error("Could not save invite");
      return;
    }
    await supabase
      .from("referral_codes")
      .update({ total_invited: code.total_invited + 1 })
      .eq("user_id", user.id);
    setCode({ ...code, total_invited: code.total_invited + 1 });
    setReferrals((p) => [
      {
        id: crypto.randomUUID(),
        referred_email: inviteEmail.trim(),
        status: "pending",
        reward_days: 0,
        created_at: new Date().toISOString(),
      },
      ...p,
    ]);
    setInviteEmail("");
    toast.success(`Invite logged for ${inviteEmail}. Share your link with them!`);
  };

  const statusColor = (s: string) =>
    s === "rewarded" || s === "converted"
      ? "bg-calm-sage-light text-calm-sage"
      : s === "signed_up"
      ? "bg-calm-sky-light text-calm-sky"
      : "bg-muted text-muted-foreground";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-28 pb-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-calm-sage-light/60 text-calm-sage text-xs font-medium mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Refer & Earn
            </div>
            <h1 className="font-display text-3xl md:text-5xl text-foreground mb-3">
              Share calm. <span className="text-calm-sage italic">Earn calm.</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Invite a friend. When they subscribe, you both get <strong>7 days free</strong> added to your plan.
            </p>
          </motion.div>

          {/* How it works */}
          <div className="grid md:grid-cols-3 gap-3 mb-8">
            {[
              { icon: Share2, title: "Share your link", desc: "Send your unique referral link" },
              { icon: Users, title: "Friend signs up", desc: "They join & subscribe to any plan" },
              { icon: Gift, title: "Both get 7 days free", desc: "Bonus added to your subscription" },
            ].map((s, i) => (
              <Card key={i} className="border-border/40">
                <CardContent className="p-5 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-calm-sage-light/60 flex items-center justify-center mx-auto mb-3">
                    <s.icon className="w-6 h-6 text-calm-sage" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{s.title}</h3>
                  <p className="text-xs text-muted-foreground">{s.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Stats */}
          {code && (
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { label: "Invited", value: code.total_invited, color: "text-calm-sky" },
                { label: "Converted", value: code.total_converted, color: "text-calm-sage" },
                { label: "Free Days Earned", value: code.total_reward_days, color: "text-calm-lavender" },
              ].map((s, i) => (
                <Card key={i} className="border-border/40">
                  <CardContent className="p-4 text-center">
                    <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Your link */}
          <Card className="border-border/40 mb-6">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Gift className="w-4 h-4 text-calm-sage" /> Your Referral Link
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input value={loading ? "Loading…" : referralLink} readOnly className="font-mono text-xs" />
                <Button onClick={copyLink} className="bg-calm-sage hover:bg-calm-sage/90 text-white gap-1.5">
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
                  <Mail className="w-4 h-4 text-calm-sky" /> Email
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Invite by email */}
          <Card className="border-border/40 mb-6">
            <CardHeader>
              <CardTitle className="text-base">Invite by Email</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Input
                type="email"
                placeholder="friend@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendInvite()}
              />
              <Button onClick={sendInvite} className="bg-calm-sage hover:bg-calm-sage/90 text-white">
                Send Invite
              </Button>
            </CardContent>
          </Card>

          {/* History */}
          <Card className="border-border/40">
            <CardHeader>
              <CardTitle className="text-base">Your Referrals</CardTitle>
            </CardHeader>
            <CardContent>
              {referrals.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No referrals yet. Share your link above to start earning free days.
                </p>
              ) : (
                <div className="space-y-2">
                  {referrals.map((r) => (
                    <div
                      key={r.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border/30"
                    >
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {r.referred_email || "Anonymous signup"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(r.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {r.reward_days > 0 && (
                          <span className="text-xs text-calm-sage font-medium">
                            +{r.reward_days}d
                          </span>
                        )}
                        <Badge className={statusColor(r.status)} variant="secondary">
                          {r.status.replace("_", " ")}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Terms */}
          <p className="text-xs text-muted-foreground text-center mt-6 max-w-lg mx-auto">
            Reward days are added once your friend completes their first paid subscription. Self-referrals
            and abuse will be reversed.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Referrals;
