import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, Mail, Check, Copy, Trash2, Loader2, ShieldCheck } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSEO } from "@/hooks/useSEO";
import { z } from "zod";

type Tier = "1-50" | "51-500" | "500+";

const TIER_PRICING: Record<Tier, { seats: number; price: number; label: string }> = {
  "1-50":   { seats: 50,  price: 14999, label: "Small Team" },
  "51-500": { seats: 500, price: 79999, label: "Growing Company" },
  "500+":   { seats: 2000, price: 199999, label: "Enterprise" },
};

const signupSchema = z.object({
  companyName: z.string().trim().min(2).max(120),
  adminEmail: z.string().trim().email().max(255),
  tier: z.enum(["1-50", "51-500", "500+"]),
});

interface Company {
  id: string;
  company_name: string;
  domain: string;
  employee_tier: Tier;
  seats: number;
  monthly_price_inr: number;
  is_active: boolean;
}

interface Invite {
  id: string;
  email: string;
  status: string;
  token: string;
  created_at: string;
}

export default function Business() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState<Company | null>(null);
  const [invites, setInvites] = useState<Invite[]>([]);

  // signup form
  const [companyName, setCompanyName] = useState("");
  const [adminEmail, setAdminEmail] = useState(user?.email ?? "");
  const [tier, setTier] = useState<Tier>("51-500");
  const [submitting, setSubmitting] = useState(false);

  // invite form
  const [inviteEmail, setInviteEmail] = useState("");

  useSEO({
    title: "WellMind AI for Business — Mental Health for Your Team",
    description: "Give your whole team affordable AI-powered mental health support. Verified business email signup, employee invites, simple seat pricing in INR.",
    path: "/business",
  });

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    (async () => {
      const { data: companies } = await supabase
        .from("b2b_companies")
        .select("*")
        .eq("admin_user_id", user.id)
        .limit(1);
      if (companies && companies[0]) {
        setCompany(companies[0] as Company);
        const { data: inv } = await supabase
          .from("b2b_invites")
          .select("*")
          .eq("company_id", companies[0].id)
          .order("created_at", { ascending: false });
        setInvites((inv as Invite[]) ?? []);
      }
      setLoading(false);
    })();
  }, [user]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in first.");
      navigate("/auth?redirect=/business");
      return;
    }
    const parsed = signupSchema.safeParse({ companyName, adminEmail, tier });
    if (!parsed.success) {
      toast.error("Please check the form fields.");
      return;
    }
    setSubmitting(true);
    try {
      // 1. Verify domain via edge function
      const { data: verify, error: verifyErr } = await supabase.functions.invoke("b2b-verify-domain", {
        body: { email: adminEmail },
      });
      if (verifyErr) throw verifyErr;
      if (!verify?.valid) {
        toast.error(verify?.message ?? "Email rejected.");
        return;
      }
      // 2. Insert company
      const pricing = TIER_PRICING[tier];
      const { data: inserted, error: insertErr } = await supabase
        .from("b2b_companies")
        .insert({
          admin_user_id: user.id,
          admin_email: adminEmail.toLowerCase().trim(),
          company_name: companyName.trim(),
          domain: verify.domain,
          employee_tier: tier,
          seats: pricing.seats,
          monthly_price_inr: pricing.price,
        })
        .select()
        .single();
      if (insertErr) {
        if (insertErr.code === "23505") {
          toast.error(`Domain ${verify.domain} is already registered. Contact your admin.`);
        } else {
          toast.error(insertErr.message);
        }
        return;
      }
      setCompany(inserted as Company);
      toast.success("Company verified and registered! You can now invite employees.");
    } finally {
      setSubmitting(false);
    }
  };

  const sendInvite = async () => {
    if (!company) return;
    const email = inviteEmail.trim().toLowerCase();
    if (!email.includes("@")) {
      toast.error("Invalid email.");
      return;
    }
    if (!email.endsWith("@" + company.domain)) {
      toast.error(`Employee email must be on your verified domain (@${company.domain}).`);
      return;
    }
    const { data, error } = await supabase
      .from("b2b_invites")
      .insert({ company_id: company.id, email, invited_by: user!.id })
      .select()
      .single();
    if (error) {
      toast.error(error.message);
      return;
    }
    setInvites([data as Invite, ...invites]);
    setInviteEmail("");
    toast.success("Invite created. Share the link below.");
  };

  const revokeInvite = async (id: string) => {
    const { error } = await supabase.from("b2b_invites").update({ status: "revoked" }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    setInvites(invites.map(i => i.id === id ? { ...i, status: "revoked" } : i));
  };

  const copyLink = (token: string) => {
    const url = `${window.location.origin}/business/join?token=${token}`;
    navigator.clipboard.writeText(url);
    toast.success("Invite link copied!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          <header className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              <Building2 className="w-3 h-3 mr-1" /> For Business
            </Badge>
            <h1 className="font-serif text-4xl md:text-5xl mb-4">
              Mental Health Care for Your Whole Team
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Verified business email signup. Invite employees on your company domain. Pay per seat in INR.
            </p>
          </header>

          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin" /></div>
          ) : company ? (
            <AdminDashboard
              company={company}
              invites={invites}
              inviteEmail={inviteEmail}
              setInviteEmail={setInviteEmail}
              sendInvite={sendInvite}
              revokeInvite={revokeInvite}
              copyLink={copyLink}
            />
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {/* Pricing preview */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif">Simple Seat Pricing</CardTitle>
                  <CardDescription>Monthly, billed annually. INR.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {(Object.keys(TIER_PRICING) as Tier[]).map((t) => {
                    const p = TIER_PRICING[t];
                    return (
                      <div key={t} className={`p-4 rounded-lg border ${tier === t ? "border-calm-sage bg-calm-sage/5" : "border-border"}`}>
                        <div className="flex justify-between items-baseline">
                          <div>
                            <div className="font-medium">{p.label}</div>
                            <div className="text-xs text-muted-foreground">{t} employees · up to {p.seats} seats</div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-semibold">₹{p.price.toLocaleString("en-IN")}</div>
                            <div className="text-xs text-muted-foreground">/month</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
                    <ShieldCheck className="w-4 h-4 text-calm-sage" />
                    All data HIPAA-style audit logged & RLS protected.
                  </div>
                </CardContent>
              </Card>

              {/* Signup form */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif">Register Your Company</CardTitle>
                  <CardDescription>Use your business email (no Gmail / Yahoo).</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div>
                      <Label htmlFor="cn">Company Name</Label>
                      <Input id="cn" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required maxLength={120} placeholder="Acme Pvt Ltd" />
                    </div>
                    <div>
                      <Label htmlFor="ae">Your Work Email</Label>
                      <Input id="ae" type="email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} required placeholder="you@yourcompany.com" />
                      <p className="text-xs text-muted-foreground mt-1">Your domain will be auto-verified.</p>
                    </div>
                    <div>
                      <Label>Employee Count</Label>
                      <Select value={tier} onValueChange={(v) => setTier(v as Tier)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-50">1 – 50 employees</SelectItem>
                          <SelectItem value="51-500">51 – 500 employees</SelectItem>
                          <SelectItem value="500+">500+ employees</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="submit" className="w-full" disabled={submitting || !user}>
                      {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Building2 className="w-4 h-4 mr-2" />}
                      {user ? "Verify & Register" : "Sign in to continue"}
                    </Button>
                    {!user && (
                      <p className="text-xs text-center text-muted-foreground">
                        <button type="button" onClick={() => navigate("/auth?redirect=/business")} className="underline">Sign in</button> to register your company.
                      </p>
                    )}
                  </form>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function AdminDashboard({
  company, invites, inviteEmail, setInviteEmail, sendInvite, revokeInvite, copyLink,
}: {
  company: Company; invites: Invite[];
  inviteEmail: string; setInviteEmail: (s: string) => void;
  sendInvite: () => void; revokeInvite: (id: string) => void; copyLink: (t: string) => void;
}) {
  const accepted = invites.filter(i => i.status === "accepted").length;
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="font-serif">{company.company_name}</CardTitle>
              <CardDescription>Verified domain: @{company.domain}</CardDescription>
            </div>
            <Badge className="bg-calm-sage text-white"><Check className="w-3 h-3 mr-1" /> Verified</Badge>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-4">
          <Stat icon={Users} label="Seats" value={`${accepted}/${company.seats}`} />
          <Stat icon={Mail} label="Pending Invites" value={String(invites.filter(i => i.status === "pending").length)} />
          <Stat icon={Building2} label="Plan" value={`₹${company.monthly_price_inr.toLocaleString("en-IN")}/mo`} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-lg">Invite Employees</CardTitle>
          <CardDescription>Only emails on @{company.domain} can be invited.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder={`employee@${company.domain}`}
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendInvite()}
            />
            <Button onClick={sendInvite}><Mail className="w-4 h-4 mr-2" /> Invite</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="font-serif text-lg">Invites ({invites.length})</CardTitle></CardHeader>
        <CardContent>
          {invites.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">No invites yet. Send the first one above.</p>
          ) : (
            <div className="space-y-2">
              {invites.map((inv) => (
                <div key={inv.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <div className="text-sm font-medium">{inv.email}</div>
                    <div className="text-xs text-muted-foreground capitalize">{inv.status} · {new Date(inv.created_at).toLocaleDateString()}</div>
                  </div>
                  <div className="flex gap-2">
                    {inv.status === "pending" && (
                      <>
                        <Button size="sm" variant="outline" onClick={() => copyLink(inv.token)}>
                          <Copy className="w-3 h-3 mr-1" /> Link
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => revokeInvite(inv.id)}>
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </>
                    )}
                    {inv.status === "accepted" && <Badge variant="secondary"><Check className="w-3 h-3 mr-1" /> Joined</Badge>}
                    {inv.status === "revoked" && <Badge variant="outline">Revoked</Badge>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="p-4 rounded-lg bg-muted/50">
      <Icon className="w-4 h-4 text-calm-sage mb-2" />
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  );
}
