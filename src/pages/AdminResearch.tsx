import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AdminNav from "@/components/layout/AdminNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { FileText, ExternalLink, Plus, Trash2, Upload } from "lucide-react";

// LocalStorage-backed publishing until the research_papers table migration is approved.
// Admin emails matching @wellmindai.in or ratankumar4937@gmail.com can publish.
const LS_KEY = "wm_research_papers_v1";

interface Paper {
  id: string;
  title: string;
  venue: string;
  summary: string;
  tags: string;
  url: string;
  created_at: string;
}

const ADMIN_DOMAINS = ["wellmindai.in", "mindwellai.com"];
const ADMIN_EMAILS = ["ratankumar4937@gmail.com"];
function isAdmin(email?: string | null) {
  if (!email) return false;
  const e = email.toLowerCase();
  if (ADMIN_EMAILS.includes(e)) return true;
  const d = e.split("@")[1];
  return ADMIN_DOMAINS.includes(d);
}

export default function AdminResearch() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [papers, setPapers] = useState<Paper[]>([]);
  const [form, setForm] = useState({ title: "", venue: "", summary: "", tags: "", url: "" });

  useEffect(() => {
    if (!loading && (!user || !isAdmin(user.email))) {
      toast.error("Admin access required");
      navigate("/");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setPapers(JSON.parse(raw));
    } catch {}
  }, []);

  const persist = (next: Paper[]) => {
    setPapers(next);
    localStorage.setItem(LS_KEY, JSON.stringify(next));
  };

  const publish = () => {
    if (!form.title.trim() || !form.summary.trim() || !form.url.trim()) {
      toast.error("Title, summary and URL are required");
      return;
    }
    const next: Paper = {
      id: crypto.randomUUID(),
      title: form.title.trim(),
      venue: form.venue.trim() || "WellMindAI Research",
      summary: form.summary.trim(),
      tags: form.tags.trim(),
      url: form.url.trim(),
      created_at: new Date().toISOString(),
    };
    persist([next, ...papers]);
    setForm({ title: "", venue: "", summary: "", tags: "", url: "" });
    toast.success("Paper published");
  };

  const remove = (id: string) => persist(papers.filter((p) => p.id !== id));

  if (loading || !user || !isAdmin(user.email)) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 pt-28 pb-20 text-center text-muted-foreground">Loading…</main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-4 pb-20">
        <AdminNav />
        <div className="max-w-3xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Upload className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-3xl text-foreground">Publish research</h1>
              <p className="text-sm text-muted-foreground">Admin · papers appear on <code className="text-xs">/research</code> instantly.</p>
            </div>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Plus className="w-4 h-4 text-primary" /> New paper
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs mb-1.5">Title *</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs mb-1.5">Venue</Label>
                  <Input placeholder="WellMindAI Research · 2026" value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} />
                </div>
                <div>
                  <Label className="text-xs mb-1.5">Tags (comma-separated)</Label>
                  <Input placeholder="CBT, Privacy, India" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
                </div>
              </div>
              <div>
                <Label className="text-xs mb-1.5">Summary *</Label>
                <Textarea rows={4} value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} />
              </div>
              <div>
                <Label className="text-xs mb-1.5">PDF / external URL *</Label>
                <Input placeholder="https://drive.google.com/..." value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
                <p className="text-[11px] text-muted-foreground mt-1.5">
                  Upload your PDF to Google Drive / Dropbox / arXiv and paste the public link here. (Direct PDF upload to Supabase Storage will be wired once the <code>research_papers</code> table migration is approved.)
                </p>
              </div>
              <Button onClick={publish} className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 w-full">
                <Plus className="w-4 h-4" /> Publish paper
              </Button>
            </CardContent>
          </Card>

          <h2 className="font-display text-xl text-foreground mb-3">Published ({papers.length})</h2>
          <div className="space-y-3">
            {papers.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">No papers yet. Publish your first one above.</p>
            )}
            {papers.map((p) => (
              <div key={p.id} className="p-4 rounded-xl bg-card border border-border flex items-start gap-3">
                <FileText className="w-5 h-5 text-primary mt-1 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{p.venue}</div>
                  <h3 className="font-display text-foreground">{p.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">{p.summary}</p>
                  <a href={p.url} target="_blank" rel="noreferrer" className="text-xs text-primary inline-flex items-center gap-1 mt-1.5">
                    Open <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <Button size="icon" variant="ghost" onClick={() => remove(p.id)} className="text-destructive">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
