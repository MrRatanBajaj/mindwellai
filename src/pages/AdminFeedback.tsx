import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Loader2, CheckCircle2, EyeOff, Trash2, ShieldCheck, Star } from "lucide-react";
import { FOUNDER_EMAILS } from "@/lib/founderAccess";

interface Row {
  id: string;
  name: string | null;
  email: string | null;
  feedback: string;
  rating: number | null;
  category: string;
  status: string;
  created_at: string;
}

const ADMIN_DOMAINS = ["@mindwellai.com", "@wellmindai.in"];

function isAdmin(email?: string | null) {
  if (!email) return false;
  const e = email.toLowerCase();
  if (FOUNDER_EMAILS.includes(e)) return true;
  return ADMIN_DOMAINS.some((d) => e.endsWith(d));
}

const STATUS_TABS = ["pending", "approved", "hidden", "all"] as const;
type Tab = (typeof STATUS_TABS)[number];

const AdminFeedback = () => {
  const { user, loading } = useAuth();
  const [rows, setRows] = useState<Row[]>([]);
  const [tab, setTab] = useState<Tab>("pending");
  const [fetching, setFetching] = useState(true);

  const load = async () => {
    setFetching(true);
    let q = supabase.from("feedback").select("*").order("created_at", { ascending: false }).limit(200);
    if (tab !== "all") q = q.eq("status", tab);
    const { data, error } = await q;
    if (error) toast.error(error.message);
    setRows((data as Row[]) || []);
    setFetching(false);
  };

  useEffect(() => {
    if (user && isAdmin(user.email)) load();
  }, [user, tab]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }
  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin(user.email)) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center p-8 text-center">
          <div>
            <ShieldCheck className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <h1 className="text-xl font-semibold mb-1">Admins only</h1>
            <p className="text-muted-foreground text-sm">
              This page is restricted to WellMindAI staff accounts.
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const setStatus = async (id: string, status: "approved" | "hidden") => {
    const { error } = await supabase.from("feedback").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(status === "approved" ? "Approved — now live on the Wall" : "Hidden from the Wall");
    setRows((r) => r.filter((x) => (tab === "all" ? true : x.id !== id)).map((x) => (x.id === id ? { ...x, status } : x)));
  };

  const remove = async (id: string) => {
    if (!confirm("Delete permanently?")) return;
    const { error } = await supabase.from("feedback").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    setRows((r) => r.filter((x) => x.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-24">
        <div className="flex items-center gap-2 text-xs text-primary font-semibold uppercase tracking-widest mb-2">
          <ShieldCheck className="w-4 h-4" /> Admin · Wall of Voices
        </div>
        <h1 className="font-display text-3xl md:text-4xl text-foreground mb-2">Moderation queue</h1>
        <p className="text-muted-foreground mb-8 text-sm">
          Approve gentle, safe notes. Hide anything off-tone. Delete spam.
        </p>

        <div className="flex gap-2 mb-6 flex-wrap">
          {STATUS_TABS.map((t) => (
            <Button
              key={t}
              variant={tab === t ? "default" : "outline"}
              size="sm"
              className="capitalize rounded-full"
              onClick={() => setTab(t)}
            >
              {t}
            </Button>
          ))}
        </div>

        {fetching ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : rows.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">No entries in this tab.</div>
        ) : (
          <ul className="space-y-3">
            {rows.map((r) => (
              <li key={r.id} className="p-5 rounded-2xl border border-border bg-card hover:shadow-md transition">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-foreground truncate">
                        {r.name || "Anonymous"}
                      </span>
                      {r.email && <span className="text-xs text-muted-foreground truncate">{r.email}</span>}
                      <Badge variant="secondary" className="text-[10px] capitalize">{r.category}</Badge>
                      <Badge
                        className={`text-[10px] capitalize ${
                          r.status === "approved"
                            ? "bg-emerald-500/15 text-emerald-700 border border-emerald-300"
                            : r.status === "hidden"
                            ? "bg-muted text-muted-foreground"
                            : "bg-amber-500/15 text-amber-700 border border-amber-300"
                        }`}
                      >
                        {r.status}
                      </Badge>
                      {r.rating ? (
                        <span className="inline-flex items-center gap-0.5 text-amber-500 text-xs">
                          <Star className="w-3 h-3 fill-current" /> {r.rating}
                        </span>
                      ) : null}
                    </div>
                    <p className="text-sm text-foreground/90 mt-2 whitespace-pre-wrap">{r.feedback}</p>
                    <div className="text-[11px] text-muted-foreground mt-2">
                      {new Date(r.created_at).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    {r.status !== "approved" && (
                      <Button size="sm" onClick={() => setStatus(r.id, "approved")} className="gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                      </Button>
                    )}
                    {r.status !== "hidden" && (
                      <Button size="sm" variant="outline" onClick={() => setStatus(r.id, "hidden")} className="gap-1">
                        <EyeOff className="w-3.5 h-3.5" /> Hide
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" className="text-destructive gap-1" onClick={() => remove(r.id)}>
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AdminFeedback;
