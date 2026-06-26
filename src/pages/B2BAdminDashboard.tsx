import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useSEO } from "@/hooks/useSEO";
import { Loader2 } from "lucide-react";

interface Account {
  id: string;
  organization_name: string;
  organization_type: string;
  max_seats: number;
  seats_consumed: number;
  contract_end: string;
}
interface Report {
  id: string;
  report_month_year: string;
  total_active_users: number;
  total_ai_sessions_log: number;
  stress_reduction_index_pct: number;
}

const B2BAdminDashboard = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [account, setAccount] = useState<Account | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [busy, setBusy] = useState(true);

  useSEO({ title: "Admin dashboard | WellMind AI for Business", description: "Track seat utilization and monthly wellness engagement.", path: "/business/dashboard" });

  useEffect(() => {
    if (!loading && !user) navigate("/auth?redirect=/business/dashboard");
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sb = supabase as any;
      const { data: acc } = await sb
        .from("b2b_accounts")
        .select("id, organization_name, organization_type, max_seats, seats_consumed, contract_end")
        .or(`admin_user_id.eq.${user.id},admin_email.eq.${user.email?.toLowerCase() ?? ""}`)
        .maybeSingle();
      setAccount((acc as Account | null) ?? null);
      if (acc) {
        const { data: rs } = await sb
          .from("b2b_monthly_analytics")
          .select("*")
          .eq("account_id", (acc as Account).id)
          .order("generated_at", { ascending: false });
        setReports((rs as Report[]) ?? []);
      }
      setBusy(false);
    })();
  }, [user]);

  const downloadCsv = () => {
    if (!reports.length) return;
    const csv = ["month,active_users,ai_sessions,stress_reduction_pct"]
      .concat(reports.map((r) => `${r.report_month_year},${r.total_active_users},${r.total_ai_sessions_log},${r.stress_reduction_index_pct}`))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${account?.organization_name ?? "report"}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  if (busy) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>;

  if (!account) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-24 pb-12 max-w-3xl mx-auto px-6 text-center">
          <h1 className="font-display text-3xl mb-3">No B2B account linked to {user?.email}.</h1>
          <p className="font-hand text-xl text-foreground/70 mb-6">Sign in with the admin email used at purchase, or activate a new plan.</p>
          <Button onClick={() => navigate("/business/buy")} className="rounded-full border-2 border-foreground bg-foreground text-background">Buy seats</Button>
        </main>
        <Footer />
      </div>
    );
  }

  const pct = Math.round((account.seats_consumed / account.max_seats) * 100);
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24 pb-12 max-w-5xl mx-auto px-6">
        <p className="font-hand text-2xl text-primary mb-1">{account.organization_type}</p>
        <h1 className="font-display text-4xl font-semibold mb-6">{account.organization_name} · admin panel</h1>

        <div className="pastel-card bg-pastel-sage mb-6">
          <p className="font-display text-xl mb-2">License utilization</p>
          <p className="font-hand text-3xl mb-3">{account.seats_consumed} / {account.max_seats} seats active</p>
          <div className="h-3 w-full rounded-full bg-card border-2 border-foreground/70 overflow-hidden">
            <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
          </div>
          <p className="text-xs text-foreground/60 mt-2">Contract ends {new Date(account.contract_end).toLocaleDateString()}</p>
        </div>

        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-2xl">Monthly engagement reports</h2>
          <Button disabled={!reports.length} onClick={downloadCsv} variant="outline" className="rounded-full border-2 border-foreground">Download CSV</Button>
        </div>

        {!reports.length ? (
          <div className="pastel-card text-center">
            <p className="font-hand text-xl text-foreground/70">No reports yet — your first monthly summary will appear after 30 days of usage.</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {reports.map((r) => (
              <div key={r.id} className="pastel-card flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <p className="font-display text-lg">{r.report_month_year}</p>
                  <p className="font-hand text-foreground/70">Active users: {r.total_active_users} · AI sessions: {r.total_ai_sessions_log}</p>
                </div>
                <span className="rounded-full bg-pastel-sage border-2 border-foreground/70 px-4 py-2 font-display">
                  Stress ↓ {r.stress_reduction_index_pct}%
                </span>
              </div>
            ))}
          </div>
        )}
        <p className="text-xs text-foreground/50 mt-6">All reports are 100% anonymous aggregates. No personal chat data is exposed.</p>
      </main>
      <Footer />
    </div>
  );
};

export default B2BAdminDashboard;
