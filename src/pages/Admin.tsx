import { useEffect, useState } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import {
  Loader2, Plus, Trash2, ShieldCheck, Eye, EyeOff, Save,
  FileText, ExternalLink, Upload, CheckCircle2, Star,
  Users, Mail, Download, RefreshCw, Building2,
} from "lucide-react";
import { FOUNDER_EMAILS } from "@/lib/founderAccess";

// ───────────────────────── Admin gate ─────────────────────────
const ADMIN_DOMAINS = ["@mindwellai.com", "@wellmindai.in"];
function isAdmin(email?: string | null) {
  if (!email) return false;
  const e = email.toLowerCase();
  if (FOUNDER_EMAILS.includes(e)) return true;
  return ADMIN_DOMAINS.some((d) => e.endsWith(d));
}

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 80);

// ═════════════════════════ BLOG PANEL ═════════════════════════
interface Post {
  id: string; slug: string; title: string; excerpt: string | null;
  cover_image_url: string | null; body_markdown: string; tags: string[];
  published: boolean; published_at: string | null; created_at: string;
}
function BlogPanel({ adminEmail }: { adminEmail: string }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [fetching, setFetching] = useState(true);
  const [editing, setEditing] = useState<Partial<Post> | null>(null);
  const [tagsText, setTagsText] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setFetching(true);
    const { data, error } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setPosts((data as Post[]) || []);
    setFetching(false);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    const slug = (editing.slug || slugify(editing.title || "")).trim();
    if (!editing.title || !slug) { toast.error("Title and slug are required"); return; }
    setSaving(true);
    const tags = tagsText.split(",").map((t) => t.trim()).filter(Boolean);
    const payload = {
      slug, title: editing.title!, excerpt: editing.excerpt || null,
      cover_image_url: editing.cover_image_url || null,
      body_markdown: editing.body_markdown || "", tags, published: !!editing.published,
      author_email: adminEmail,
    };
    const { error } = editing.id
      ? await supabase.from("blog_posts").update(payload).eq("id", editing.id)
      : await supabase.from("blog_posts").insert(payload);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(editing.id ? "Post updated" : "Post created");
    setEditing(null); setTagsText(""); load();
  };
  const togglePublish = async (p: Post) => {
    const { error } = await supabase.from("blog_posts").update({
      published: !p.published,
      published_at: !p.published ? new Date().toISOString() : p.published_at,
    }).eq("id", p.id);
    if (error) return toast.error(error.message);
    toast.success(!p.published ? "Published" : "Unpublished"); load();
  };
  const remove = async (id: string) => {
    if (!confirm("Delete this post permanently?")) return;
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted"); load();
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h2 className="font-display text-2xl text-foreground">Blog posts</h2>
          <p className="text-muted-foreground text-sm">Markdown articles published to <code className="text-xs">/blog/&lt;slug&gt;</code>.</p>
        </div>
        {!editing && (
          <Button onClick={() => { setEditing({ slug:"", title:"", excerpt:"", cover_image_url:"", body_markdown:"", tags:[], published:false }); setTagsText(""); }} className="rounded-full gap-1">
            <Plus className="w-4 h-4" /> New post
          </Button>
        )}
      </div>

      {editing ? (
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <div>
            <Label>Title</Label>
            <Input value={editing.title || ""} onChange={(e) => setEditing({ ...editing, title: e.target.value, slug: editing.id ? editing.slug : slugify(e.target.value) })} />
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <div><Label>Slug</Label><Input value={editing.slug || ""} onChange={(e) => setEditing({ ...editing, slug: slugify(e.target.value) })} /></div>
            <div><Label>Cover image URL</Label><Input value={editing.cover_image_url || ""} onChange={(e) => setEditing({ ...editing, cover_image_url: e.target.value })} /></div>
          </div>
          <div><Label>Excerpt</Label><Textarea rows={2} value={editing.excerpt || ""} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} /></div>
          <div><Label>Tags (comma separated)</Label><Input value={tagsText} onChange={(e) => setTagsText(e.target.value)} /></div>
          <div><Label>Body (Markdown)</Label><Textarea rows={14} className="font-mono text-sm" value={editing.body_markdown || ""} onChange={(e) => setEditing({ ...editing, body_markdown: e.target.value })} /></div>
          <div className="flex items-center gap-3">
            <Switch checked={!!editing.published} onCheckedChange={(v) => setEditing({ ...editing, published: v })} />
            <Label className="cursor-pointer">Publish immediately</Label>
          </div>
          <div className="flex gap-3">
            <Button onClick={save} disabled={saving} className="rounded-full gap-1">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {editing.id ? "Save" : "Create"}
            </Button>
            <Button variant="outline" onClick={() => { setEditing(null); setTagsText(""); }} className="rounded-full">Cancel</Button>
          </div>
        </div>
      ) : fetching ? (
        <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">No posts yet.</div>
      ) : (
        <ul className="space-y-3">
          {posts.map((p) => (
            <li key={p.id} className="p-4 rounded-xl border border-border bg-card flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="font-semibold text-foreground truncate">{p.title}</h3>
                  <Badge className={p.published ? "bg-emerald-500/15 text-emerald-700 border border-emerald-300 text-[10px]" : "bg-amber-500/15 text-amber-700 border border-amber-300 text-[10px]"}>
                    {p.published ? "Published" : "Draft"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground truncate">/blog/{p.slug}</p>
                {p.excerpt && <p className="text-sm text-foreground/80 mt-1 line-clamp-2">{p.excerpt}</p>}
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <Button size="sm" variant="outline" onClick={() => { setEditing(p); setTagsText((p.tags || []).join(", ")); }}>Edit</Button>
                <Button size="sm" variant="outline" onClick={() => togglePublish(p)} className="gap-1">
                  {p.published ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  {p.published ? "Unpublish" : "Publish"}
                </Button>
                <Button size="sm" variant="ghost" className="text-destructive gap-1" onClick={() => remove(p.id)}>
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ═════════════════════════ RESEARCH PANEL ═════════════════════════
const LS_KEY = "wm_research_papers_v1";
interface Paper { id: string; title: string; venue: string; summary: string; tags: string; url: string; created_at: string; }
function ResearchPanel() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [form, setForm] = useState({ title: "", venue: "", summary: "", tags: "", url: "" });
  useEffect(() => { try { const raw = localStorage.getItem(LS_KEY); if (raw) setPapers(JSON.parse(raw)); } catch {} }, []);
  const persist = (next: Paper[]) => { setPapers(next); localStorage.setItem(LS_KEY, JSON.stringify(next)); };
  const publish = () => {
    if (!form.title.trim() || !form.summary.trim() || !form.url.trim()) { toast.error("Title, summary and URL are required"); return; }
    const next: Paper = { id: crypto.randomUUID(), title: form.title.trim(), venue: form.venue.trim() || "WellMindAI Research", summary: form.summary.trim(), tags: form.tags.trim(), url: form.url.trim(), created_at: new Date().toISOString() };
    persist([next, ...papers]); setForm({ title: "", venue: "", summary: "", tags: "", url: "" }); toast.success("Paper published");
  };
  const remove = (id: string) => persist(papers.filter((p) => p.id !== id));

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-2xl text-foreground">Research papers</h2>
        <p className="text-muted-foreground text-sm">Appear on <code className="text-xs">/research</code> instantly.</p>
      </div>
      <Card className="mb-6">
        <CardContent className="p-5 space-y-3">
          <div><Label className="text-xs">Title *</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
          <div className="grid md:grid-cols-2 gap-3">
            <div><Label className="text-xs">Venue</Label><Input placeholder="WellMindAI Research · 2026" value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} /></div>
            <div><Label className="text-xs">Tags</Label><Input placeholder="CBT, Privacy" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} /></div>
          </div>
          <div><Label className="text-xs">Summary *</Label><Textarea rows={3} value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} /></div>
          <div><Label className="text-xs">PDF / external URL *</Label><Input placeholder="https://..." value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} /></div>
          <Button onClick={publish} className="gap-2 w-full"><Upload className="w-4 h-4" /> Publish paper</Button>
        </CardContent>
      </Card>
      <h3 className="font-display text-lg text-foreground mb-3">Published ({papers.length})</h3>
      <div className="space-y-3">
        {papers.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">No papers yet.</p>}
        {papers.map((p) => (
          <div key={p.id} className="p-4 rounded-xl bg-card border border-border flex items-start gap-3">
            <FileText className="w-5 h-5 text-primary mt-1 shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{p.venue}</div>
              <h3 className="font-display text-foreground">{p.title}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2">{p.summary}</p>
              <a href={p.url} target="_blank" rel="noreferrer" className="text-xs text-primary inline-flex items-center gap-1 mt-1">Open <ExternalLink className="w-3 h-3" /></a>
            </div>
            <Button size="icon" variant="ghost" onClick={() => remove(p.id)} className="text-destructive"><Trash2 className="w-4 h-4" /></Button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═════════════════════════ FEEDBACK PANEL ═════════════════════════
interface FBRow { id: string; name: string | null; email: string | null; feedback: string; rating: number | null; category: string; status: string; created_at: string; }
const FB_TABS = ["pending", "approved", "hidden", "all"] as const;
function FeedbackPanel() {
  const [rows, setRows] = useState<FBRow[]>([]);
  const [tab, setTab] = useState<(typeof FB_TABS)[number]>("pending");
  const [fetching, setFetching] = useState(true);
  const load = async () => {
    setFetching(true);
    let q = supabase.from("feedback").select("*").order("created_at", { ascending: false }).limit(200);
    if (tab !== "all") q = q.eq("status", tab);
    const { data, error } = await q;
    if (error) toast.error(error.message);
    setRows((data as FBRow[]) || []); setFetching(false);
  };
  useEffect(() => { load(); }, [tab]);
  const setStatus = async (id: string, status: "approved" | "hidden") => {
    const { error } = await supabase.from("feedback").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(status === "approved" ? "Approved" : "Hidden"); load();
  };
  const remove = async (id: string) => {
    if (!confirm("Delete permanently?")) return;
    const { error } = await supabase.from("feedback").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setRows((r) => r.filter((x) => x.id !== id));
  };

  return (
    <div>
      <div className="mb-4">
        <h2 className="font-display text-2xl text-foreground">Feedback wall · moderation</h2>
      </div>
      <div className="flex gap-2 mb-5 flex-wrap">
        {FB_TABS.map((t) => (
          <Button key={t} variant={tab === t ? "default" : "outline"} size="sm" className="capitalize rounded-full" onClick={() => setTab(t)}>{t}</Button>
        ))}
      </div>
      {fetching ? (
        <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
      ) : rows.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">No entries.</div>
      ) : (
        <ul className="space-y-3">
          {rows.map((r) => (
            <li key={r.id} className="p-4 rounded-xl border border-border bg-card">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-foreground truncate">{r.name || "Anonymous"}</span>
                    {r.email && <span className="text-xs text-muted-foreground truncate">{r.email}</span>}
                    <Badge variant="secondary" className="text-[10px] capitalize">{r.category}</Badge>
                    <Badge className={`text-[10px] capitalize ${r.status === "approved" ? "bg-emerald-500/15 text-emerald-700 border border-emerald-300" : r.status === "hidden" ? "bg-muted text-muted-foreground" : "bg-amber-500/15 text-amber-700 border border-amber-300"}`}>{r.status}</Badge>
                    {r.rating ? <span className="inline-flex items-center gap-0.5 text-amber-500 text-xs"><Star className="w-3 h-3 fill-current" /> {r.rating}</span> : null}
                  </div>
                  <p className="text-sm text-foreground/90 mt-2 whitespace-pre-wrap">{r.feedback}</p>
                  <div className="text-[11px] text-muted-foreground mt-2">{new Date(r.created_at).toLocaleString()}</div>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  {r.status !== "approved" && <Button size="sm" onClick={() => setStatus(r.id, "approved")} className="gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Approve</Button>}
                  {r.status !== "hidden" && <Button size="sm" variant="outline" onClick={() => setStatus(r.id, "hidden")} className="gap-1"><EyeOff className="w-3.5 h-3.5" /> Hide</Button>}
                  <Button size="sm" variant="ghost" className="text-destructive gap-1" onClick={() => remove(r.id)}><Trash2 className="w-3.5 h-3.5" /> Delete</Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ═════════════════════════ LEADS PANEL ═════════════════════════
function LeadsPanel() {
  const [leads, setLeads] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(500);
    if (error) toast.error(error.message);
    setLeads(data || []); setLoading(false);
  };
  useEffect(() => { load(); }, []);
  const filtered = leads.filter((l) => {
    const s = search.toLowerCase();
    return !s || l.email?.toLowerCase().includes(s) || l.name?.toLowerCase().includes(s) || l.location_city?.toLowerCase().includes(s);
  });
  const exportCsv = () => {
    const csv = [
      ["Name", "Email", "Phone", "City", "Country", "Source", "Date"].join(","),
      ...filtered.map((l) => [l.name || "", l.email || "", l.phone || "", l.location_city || "", l.location_country || "", l.source || "", new Date(l.created_at).toLocaleDateString()].join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `leads-${new Date().toISOString().split("T")[0]}.csv`; a.click();
    URL.revokeObjectURL(url); toast.success("Exported");
  };
  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
        <div>
          <h2 className="font-display text-2xl text-foreground">Leads</h2>
          <p className="text-sm text-muted-foreground">{filtered.length} of {leads.length}</p>
        </div>
        <div className="flex gap-2">
          <Input placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} className="w-56" />
          <Button variant="outline" onClick={load}><RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /></Button>
          <Button onClick={exportCsv} disabled={filtered.length === 0}><Download className="w-4 h-4 mr-1" /> CSV</Button>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/40"><tr>
              <th className="text-left p-3">Contact</th><th className="text-left p-3">Location</th>
              <th className="text-left p-3">Source</th><th className="text-left p-3">Date</th>
            </tr></thead>
            <tbody>
              {filtered.map((l) => (
                <tr key={l.id} className="border-t border-border">
                  <td className="p-3">
                    <div>{l.name || <span className="text-muted-foreground">Anonymous</span>}</div>
                    {l.email && <div className="text-xs text-muted-foreground inline-flex items-center gap-1"><Mail className="w-3 h-3" />{l.email}</div>}
                  </td>
                  <td className="p-3 text-muted-foreground">{[l.location_city, l.location_country].filter(Boolean).join(", ") || "—"}</td>
                  <td className="p-3"><Badge variant="outline" className="text-xs">{l.source || "website"}</Badge></td>
                  <td className="p-3 text-muted-foreground">{new Date(l.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">No leads.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ═════════════════════════ B2B SALES PANEL ═════════════════════════
function B2BPanel() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("b2b_companies").select("*").order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setCompanies(data || []); setLoading(false);
  };
  useEffect(() => { load(); }, []);
  const setActive = async (id: string, is_active: boolean) => {
    const { error } = await supabase.from("b2b_companies").update({ is_active }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(is_active ? "Activated" : "Deactivated"); load();
  };
  const totalSeats = companies.reduce((s, c) => s + (c.seats || 0), 0);
  const totalMRR = companies.filter((c) => c.is_active).reduce((s, c) => s + (c.monthly_price_inr || 0), 0);

  return (
    <div>
      <div className="mb-5">
        <h2 className="font-display text-2xl text-foreground">B2B sales pipeline</h2>
        <p className="text-sm text-muted-foreground">Company sign-ups from <code>/business</code>.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">Companies</div><div className="text-2xl font-semibold">{companies.length}</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">Active</div><div className="text-2xl font-semibold">{companies.filter((c) => c.is_active).length}</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">Total seats</div><div className="text-2xl font-semibold">{totalSeats}</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">MRR (₹)</div><div className="text-2xl font-semibold">{totalMRR.toLocaleString("en-IN")}</div></CardContent></Card>
      </div>
      {loading ? (
        <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
      ) : companies.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No B2B sign-ups yet.</div>
      ) : (
        <ul className="space-y-3">
          {companies.map((c) => (
            <li key={c.id} className="p-4 rounded-xl border border-border bg-card">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Building2 className="w-4 h-4 text-primary" />
                    <span className="font-semibold text-foreground">{c.company_name}</span>
                    <Badge variant="outline" className="text-[10px]">{c.domain}</Badge>
                    <Badge className={`text-[10px] capitalize ${c.is_active ? "bg-emerald-500/15 text-emerald-700 border border-emerald-300" : "bg-amber-500/15 text-amber-700 border border-amber-300"}`}>{c.is_active ? "active" : "pending"}</Badge>
                    <Badge variant="secondary" className="text-[10px] capitalize">{c.plan}</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Admin: {c.admin_email} · {c.seats} seats · tier {c.employee_tier} · ₹{(c.monthly_price_inr || 0).toLocaleString("en-IN")}/mo</div>
                  <div className="text-[11px] text-muted-foreground mt-1">{new Date(c.created_at).toLocaleString()}</div>
                </div>
                <div className="flex gap-2 shrink-0">
                  {!c.is_active
                    ? <Button size="sm" onClick={() => setActive(c.id, true)}>Activate</Button>
                    : <Button size="sm" variant="outline" onClick={() => setActive(c.id, false)}>Deactivate</Button>}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


// ═════════════════════════ MAIN PAGE ═════════════════════════
const TABS = [
  { value: "b2b", label: "B2B Sales", icon: Building2 },
  { value: "blog", label: "Blog", icon: FileText },
  { value: "research", label: "Research", icon: Upload },
  { value: "feedback", label: "Feedback", icon: ShieldCheck },
  { value: "leads", label: "Leads", icon: Users },
];

export default function Admin() {
  const { user, loading } = useAuth();
  const [params, setParams] = useSearchParams();
  const initial = params.get("tab") || "b2b";
  const [tab, setTab] = useState(initial);

  useEffect(() => { setParams({ tab }, { replace: true }); }, [tab]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin" /></div>;
  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin(user.email)) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center p-8 text-center">
          <div>
            <ShieldCheck className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <h1 className="text-xl font-semibold mb-1">Admins only</h1>
            <p className="text-muted-foreground text-sm">Restricted to WellMindAI staff accounts.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 pt-28 pb-20">
        <div className="flex items-center gap-2 text-xs text-primary font-semibold uppercase tracking-widest mb-2">
          <ShieldCheck className="w-4 h-4" /> Admin console
        </div>
        <h1 className="font-display text-3xl md:text-4xl text-foreground mb-1">Operations</h1>
        <p className="text-muted-foreground text-sm mb-8">All admin tools in one place.</p>

        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="flex flex-wrap h-auto p-1 mb-6 bg-muted/60">
            {TABS.map((t) => (
              <TabsTrigger key={t.value} value={t.value} className="gap-1.5">
                <t.icon className="w-3.5 h-3.5" /> {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="b2b"><B2BPanel /></TabsContent>
          <TabsContent value="blog"><BlogPanel adminEmail={user.email!} /></TabsContent>
          <TabsContent value="research"><ResearchPanel /></TabsContent>
          <TabsContent value="feedback"><FeedbackPanel /></TabsContent>
          <TabsContent value="leads"><LeadsPanel /></TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
