import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { Loader2, Plus, Copy, KeyRound, Users, Clock, IndianRupee, Building2 } from "lucide-react";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAdmin } from "@/hooks/useAdmin";
import { useSEO } from "@/hooks/useSEO";
import { inr, SITE, type Partner } from "@/lib/partners";

type Creds = { email: string; password: string | null };

const fileToDataUrl = (f: File) =>
  new Promise<string>((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(String(r.result));
    r.onerror = rej;
    r.readAsDataURL(f);
  });

const SuperAdminPartners = () => {
  const { isAdmin, loading } = useAdmin();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [sessions, setSessions] = useState<{ partner_id: string; session_duration_minutes: number; revenue_amount: number }[]>([]);
  const [busy, setBusy] = useState(false);
  const [creds, setCreds] = useState<Creds | null>(null);
  const [form, setForm] = useState({ name: "", email: "", slug: "", tagline: "", primary_color: "#10B981", commission: 70, logo_url: "" });

  useSEO({ title: "Partners — Super Admin | WellMind AI", description: "Manage clinic and doctor partners.", path: "/admin/super" });

  const call = async (body: Record<string, unknown>) => {
    const { data, error } = await supabase.functions.invoke("partner-admin", { body });
    if (error) {
      let msg = error.message;
      try { msg = JSON.parse(await (error as any).context.text()).error ?? msg; } catch { /* noop */ }
      throw new Error(msg);
    }
    if ((data as any)?.error) throw new Error((data as any).error);
    return data as any;
  };

  const load = async () => {
    try {
      const d = await call({ action: "list_partners" });
      setPartners(d.partners);
      setSessions(d.sessions);
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  useEffect(() => { if (isAdmin) load(); /* eslint-disable-next-line */ }, [isAdmin]);

  const stats = useMemo(() => {
    const by = new Map<string, { count: number; minutes: number; revenue: number }>();
    for (const s of sessions) {
      const v = by.get(s.partner_id) ?? { count: 0, minutes: 0, revenue: 0 };
      v.count++; v.minutes += s.session_duration_minutes; v.revenue += Number(s.revenue_amount);
      by.set(s.partner_id, v);
    }
    return by;
  }, [sessions]);

  const totals = {
    revenue: partners.reduce((a, p) => a + Number(p.total_earnings), 0),
    minutes: sessions.reduce((a, s) => a + s.session_duration_minutes, 0),
    sessions: sessions.length,
  };

  if (loading) return <div className="flex min-h-screen items-center justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  if (!isAdmin) return <Navigate to="/" replace />;

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const d = await call({
        action: "create_partner",
        name: form.name, email: form.email, slug: form.slug || form.name, tagline: form.tagline,
        primary_color: form.primary_color, commission_percentage: form.commission, logo_url: form.logo_url || null,
      });
      setCreds(d.credentials);
      toast.success(`${d.partner.name} is live at /${d.partner.slug}`);
      setForm({ name: "", email: "", slug: "", tagline: "", primary_color: "#10B981", commission: 70, logo_url: "" });
      load();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const reset = async (id: string) => {
    try { setCreds((await call({ action: "reset_partner_password", id })).credentials); }
    catch (e) { toast.error((e as Error).message); }
  };

  const copy = (t: string) => { navigator.clipboard.writeText(t); toast.success("Copied"); };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6">
        <h1 className="font-display text-4xl">Partner network</h1>
        <p className="mt-1 text-muted-foreground">Clinics and doctors with their own co-branded WellMind AI portal.</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [Building2, "Partners", partners.length],
            [IndianRupee, "Partner revenue", inr(totals.revenue)],
            [Clock, "Patient minutes", totals.minutes],
            [Users, "Sessions", totals.sessions],
          ].map(([Icon, label, val]: any) => (
            <div key={label} className="rounded-3xl border border-border bg-card p-5">
              <Icon className="h-5 w-5 text-primary" />
              <p className="mt-3 text-2xl font-semibold">{val}</p>
              <p className="text-sm text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[420px_minmax(0,1fr)]">
          <form onSubmit={create} className="space-y-4 rounded-3xl border border-border bg-card p-6">
            <h2 className="font-display text-2xl">Add a partner</h2>
            <div><Label>Clinic / doctor name</Label><Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Dr. Sharma Clinic" /></div>
            <div><Label>Login email</Label><Input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div>
              <Label>Link name</Label>
              <div className="flex items-center gap-1 text-sm">
                <span className="text-muted-foreground">wellmindai.in/</span>
                <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") })} placeholder="dr-sharma" />
              </div>
            </div>
            <div><Label>Welcome line (optional)</Label><Input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} /></div>
            <div className="grid grid-cols-[1fr_auto] items-end gap-3">
              <div>
                <Label>Logo (PNG / SVG)</Label>
                <Input type="file" accept="image/png,image/svg+xml,image/jpeg" onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  if (f.size > 400_000) return toast.error("Logo must be under 400 KB");
                  setForm({ ...form, logo_url: await fileToDataUrl(f) });
                }} />
              </div>
              <div>
                <Label>Brand colour</Label>
                <Input type="color" className="h-10 w-16 p-1" value={form.primary_color} onChange={(e) => setForm({ ...form, primary_color: e.target.value })} />
              </div>
            </div>
            <div>
              <Label>Commission split — {form.commission}% partner · {100 - form.commission}% WellMind AI</Label>
              <Slider className="mt-3" min={0} max={95} step={5} value={[form.commission]} onValueChange={([v]) => setForm({ ...form, commission: v })} />
            </div>
            <Button type="submit" disabled={busy} className="w-full rounded-full">
              {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />} Create partner & login
            </Button>

            {creds && (
              <div className="rounded-2xl border border-primary/30 bg-primary/10 p-4 text-sm">
                <p className="font-medium">Partner login — share this once</p>
                <p className="mt-1">Email: {creds.email}</p>
                {creds.password ? <p>Password: <code className="rounded bg-card px-1">{creds.password}</code></p> : <p>Existing account — they use their current password.</p>}
                <p>Login at: {SITE}/partner/login</p>
                <Button type="button" size="sm" variant="outline" className="mt-2 rounded-full"
                  onClick={() => copy(`Your WellMind AI partner portal is ready.\nLogin: ${SITE}/partner/login\nEmail: ${creds.email}\n${creds.password ? `Password: ${creds.password}` : ""}`)}>
                  <Copy className="mr-1 h-3.5 w-3.5" /> Copy onboarding message
                </Button>
              </div>
            )}
          </form>

          <div className="overflow-auto rounded-3xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-left">
                <tr>{["Partner", "Link", "Split", "Sessions", "Minutes", "Earnings", ""].map((h) => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr>
              </thead>
              <tbody>
                {partners.length === 0 && <tr><td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">No partners yet — add your first one.</td></tr>}
                {partners.map((p) => {
                  const s = stats.get(p.id);
                  return (
                    <tr key={p.id} className="border-t border-border/60">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="h-3 w-3 rounded-full" style={{ background: p.primary_color }} />
                          <span className="font-medium">{p.name}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{p.contact_email}</p>
                      </td>
                      <td className="px-4 py-3"><button onClick={() => copy(`${SITE}/${p.slug}`)} className="text-primary underline-offset-2 hover:underline">/{p.slug}</button></td>
                      <td className="px-4 py-3">{p.commission_percentage}%</td>
                      <td className="px-4 py-3">{s?.count ?? 0}</td>
                      <td className="px-4 py-3">{s?.minutes ?? 0}</td>
                      <td className="px-4 py-3">{inr(p.total_earnings)}</td>
                      <td className="px-4 py-3"><Button size="sm" variant="ghost" onClick={() => reset(p.id)}><KeyRound className="mr-1 h-3.5 w-3.5" /> New password</Button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SuperAdminPartners;
