import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import QRCode from "qrcode";
import jsPDF from "jspdf";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Loader2, Copy, QrCode, Users, Clock, IndianRupee, Video, LogOut, Settings, LayoutDashboard, Wallet, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import BrandLogo from "@/components/layout/BrandLogo";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useSEO } from "@/hooks/useSEO";
import { getMyPartner, inr, SITE, type Partner, type PartnerSession, type PayoutDetails } from "@/lib/partners";

const db = supabase as any;
type Payout = { id: string; amount: number; status: string; created_at: string };

const PartnerDashboard = () => {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  const { pathname } = useLocation();
  const tab = pathname.endsWith("/settings") ? "settings" : "dashboard";
  const [partner, setPartner] = useState<Partner | null | undefined>(undefined);
  const [sessions, setSessions] = useState<PartnerSession[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [payout, setPayout] = useState<PayoutDetails>({});
  const [saving, setSaving] = useState(false);

  useSEO({ title: "Partner dashboard | WellMind AI", description: "Your clinic's patients, minutes and earnings.", path: "/partner/dashboard" });

  const load = async () => {
    if (!user) return;
    const p = await getMyPartner(user.id);
    setPartner(p);
    if (!p) return;
    setPayout(p.payout_details ?? {});
    const [{ data: s }, { data: r }] = await Promise.all([
      db.from("partner_sessions").select("*").eq("partner_id", p.id).order("created_at", { ascending: false }).limit(1000),
      db.from("partner_payout_requests").select("*").eq("partner_id", p.id).order("created_at", { ascending: false }),
    ]);
    setSessions(s ?? []);
    setPayouts(r ?? []);
  };

  useEffect(() => { if (user) load(); /* eslint-disable-next-line */ }, [user]);

  const stats = useMemo(() => {
    const uniq = new Set(sessions.map((s) => s.visitor_key).filter(Boolean));
    const minutes = sessions.reduce((a, s) => a + s.session_duration_minutes, 0);
    const video = sessions.filter((s) => s.session_type === "video").length;
    const bands: Record<string, number> = { minimal: 0, mild: 0, moderate: 0, severe: 0 };
    sessions.forEach((s) => { if (s.severity_band && s.severity_band in bands) bands[s.severity_band]++; });
    const months = new Map<string, { month: string; patients: number; earnings: number }>();
    sessions.forEach((s) => {
      const k = s.created_at.slice(0, 7);
      const v = months.get(k) ?? { month: k, patients: 0, earnings: 0 };
      v.patients++; v.earnings += Number(s.revenue_amount) * ((partner?.commission_percentage ?? 0) / 100);
      months.set(k, v);
    });
    return { uniq: uniq.size, minutes, video, bands, monthly: [...months.values()].sort((a, b) => a.month.localeCompare(b.month)).slice(-6) };
  }, [sessions, partner]);

  if (loading || partner === undefined) return <div className="flex min-h-screen items-center justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  if (!user) return <Navigate to="/partner/login" replace />;
  if (!partner)
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center">
        <p className="font-display text-2xl">This account isn't linked to a partner clinic.</p>
        <Button asChild variant="outline" className="rounded-full"><Link to="/partner/login">Use another account</Link></Button>
      </div>
    );

  const link = `${SITE}/${partner.slug}`;
  const earned = Number(partner.total_earnings);
  const paid = Number(partner.total_paid_out);
  const requested = payouts.filter((p) => p.status === "pending").reduce((a, p) => a + Number(p.amount), 0);
  const pending = Math.max(0, earned - paid);
  const totalTriage = Object.values(stats.bands).reduce((a, b) => a + b, 0);

  const downloadQR = async () => {
    const url = await QRCode.toDataURL(link, { width: 900, margin: 2, color: { dark: partner.primary_color } });
    const a = document.createElement("a");
    a.href = url; a.download = `${partner.slug}-wellmindai-qr.png`; a.click();
  };

  const requestPayout = async () => {
    const amount = pending - requested;
    if (amount <= 0) return toast.error("No payout balance available yet");
    if (!payout.upi_id && !payout.account_number) { nav("/partner/settings"); return toast.error("Add payout details first"); }
    const { error } = await db.from("partner_payout_requests").insert({ partner_id: partner.id, amount });
    if (error) return toast.error(error.message);
    toast.success(`Payout of ${inr(amount)} requested`);
    load();
  };

  const invoice = (p: Payout) => {
    const doc = new jsPDF();
    doc.setFontSize(18); doc.text("WellMind AI — Partner payout statement", 20, 25);
    doc.setFontSize(11);
    [
      `Partner: ${partner.name}`, `Statement ID: ${p.id.slice(0, 8).toUpperCase()}`,
      `Date: ${new Date(p.created_at).toLocaleDateString("en-IN")}`, `Commission: ${partner.commission_percentage}%`,
      `Amount: ${inr(p.amount)}`, `Status: ${p.status}`,
    ].forEach((l, i) => doc.text(l, 20, 45 + i * 9));
    doc.save(`payout-${p.id.slice(0, 8)}.pdf`);
  };

  const savePayout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (payout.ifsc && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(payout.ifsc)) return toast.error("IFSC looks wrong (e.g. HDFC0001234)");
    if (payout.account_number && !/^\d{9,18}$/.test(payout.account_number)) return toast.error("Account number must be 9–18 digits");
    if (payout.upi_id && !/^[\w.-]{2,}@[a-zA-Z]{2,}$/.test(payout.upi_id)) return toast.error("UPI ID looks wrong (e.g. name@okhdfc)");
    setSaving(true);
    const { error } = await db.from("partners").update({ payout_details: payout }).eq("id", partner.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Payout details saved");
  };

  const StatCard = ({ icon: Icon, label, value }: { icon: any; label: string; value: string | number }) => (
    <div className="rounded-3xl border border-border bg-card p-5">
      <Icon className="h-5 w-5 text-primary" />
      <p className="mt-3 text-2xl font-semibold">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <BrandLogo size={36} withText={false} />
            <span className="text-foreground/40">×</span>
            <span className="font-display text-lg">{partner.name}</span>
          </div>
          <nav className="flex items-center gap-1">
            <Button asChild variant={tab === "dashboard" ? "secondary" : "ghost"} size="sm" className="rounded-full"><Link to="/partner/dashboard"><LayoutDashboard className="mr-1 h-4 w-4" />Dashboard</Link></Button>
            <Button asChild variant={tab === "settings" ? "secondary" : "ghost"} size="sm" className="rounded-full"><Link to="/partner/settings"><Settings className="mr-1 h-4 w-4" />Settings</Link></Button>
            <Button variant="ghost" size="sm" className="rounded-full" onClick={async () => { await supabase.auth.signOut(); nav("/partner/login"); }}><LogOut className="h-4 w-4" /></Button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {tab === "dashboard" ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-primary/25 bg-primary/10 p-5">
              <div>
                <p className="text-sm text-muted-foreground">Your patient link</p>
                <p className="font-display text-xl">{link.replace("https://", "")}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="rounded-full" onClick={() => { navigator.clipboard.writeText(link); toast.success("Link copied"); }}><Copy className="mr-1.5 h-4 w-4" />Copy link</Button>
                <Button className="rounded-full" onClick={downloadQR}><QrCode className="mr-1.5 h-4 w-4" />Download QR</Button>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard icon={Users} label="Unique patients" value={stats.uniq} />
              <StatCard icon={Clock} label="Therapy minutes" value={stats.minutes} />
              <StatCard icon={Video} label="Video sessions" value={stats.video} />
              <StatCard icon={IndianRupee} label="Total earned" value={inr(earned)} />
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
              <div className="rounded-3xl border border-border bg-card p-5">
                <h2 className="font-display text-xl">Monthly usage</h2>
                <div className="mt-4 h-64">
                  {stats.monthly.length ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stats.monthly}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="month" fontSize={12} />
                        <YAxis fontSize={12} />
                        <Tooltip />
                        <Bar dataKey="patients" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : <p className="pt-20 text-center text-sm text-muted-foreground">Share your link — usage shows up here.</p>}
                </div>
              </div>
              <div className="rounded-3xl border border-border bg-card p-5">
                <h2 className="font-display text-xl">Wellness overview</h2>
                <p className="text-xs text-muted-foreground">Anonymous screening bands only — no names, no messages.</p>
                <div className="mt-4 space-y-3">
                  {Object.entries(stats.bands).map(([band, n]) => (
                    <div key={band}>
                      <div className="flex justify-between text-sm capitalize"><span>{band}</span><span>{n}</span></div>
                      <div className="mt-1 h-2 rounded-full bg-muted">
                        <div className="h-2 rounded-full bg-primary" style={{ width: `${totalTriage ? (n / totalTriage) * 100 : 0}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-border bg-card p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-display text-xl">Revenue & commission · {partner.commission_percentage}% share</h2>
                <Button className="rounded-full" onClick={requestPayout}><Wallet className="mr-1.5 h-4 w-4" />Request Payout</Button>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <StatCard icon={IndianRupee} label="Total Earned" value={inr(earned)} />
                <StatCard icon={IndianRupee} label="Paid Out" value={inr(paid)} />
                <StatCard icon={Wallet} label="Pending Payout Balance" value={inr(pending)} />
              </div>
              <div className="mt-5 space-y-2">
                {payouts.map((p) => (
                  <div key={p.id} className="flex items-center justify-between rounded-2xl bg-muted/40 px-4 py-3 text-sm">
                    <span>{new Date(p.created_at).toLocaleDateString("en-IN")} · {inr(p.amount)} · <span className="capitalize">{p.status}</span></span>
                    <Button size="sm" variant="ghost" onClick={() => invoice(p)}><FileDown className="mr-1 h-4 w-4" />Statement</Button>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <form onSubmit={savePayout} className="mx-auto max-w-lg space-y-4 rounded-3xl border border-border bg-card p-6">
            <h1 className="font-display text-2xl">Payout details</h1>
            <p className="text-sm text-muted-foreground">Visible only to you and the WellMind AI finance team.</p>
            <div><Label>Account holder name</Label><Input maxLength={100} value={payout.account_holder ?? ""} onChange={(e) => setPayout({ ...payout, account_holder: e.target.value })} /></div>
            <div><Label>Bank account number</Label><Input inputMode="numeric" maxLength={18} value={payout.account_number ?? ""} onChange={(e) => setPayout({ ...payout, account_number: e.target.value.replace(/\D/g, "") })} /></div>
            <div><Label>IFSC code</Label><Input maxLength={11} value={payout.ifsc ?? ""} onChange={(e) => setPayout({ ...payout, ifsc: e.target.value.toUpperCase() })} /></div>
            <div><Label>UPI ID</Label><Input maxLength={60} value={payout.upi_id ?? ""} onChange={(e) => setPayout({ ...payout, upi_id: e.target.value.trim() })} placeholder="name@okhdfc" /></div>
            <Button type="submit" disabled={saving} className="w-full rounded-full">{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Save</Button>
          </form>
        )}
      </main>
    </div>
  );
};

export default PartnerDashboard;
