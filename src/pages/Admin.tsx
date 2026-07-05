import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAdmin } from "@/hooks/useAdmin";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Trash2, Plus, Shield } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

type Row = Record<string, any>;

const Table = ({ rows, cols }: { rows: Row[]; cols: string[] }) => (
  <div className="overflow-auto rounded-xl border border-border">
    <table className="w-full text-sm">
      <thead className="bg-muted/40">
        <tr>{cols.map((c) => <th key={c} className="text-left px-3 py-2 font-medium">{c}</th>)}</tr>
      </thead>
      <tbody>
        {rows.length === 0 ? (
          <tr><td className="px-3 py-6 text-muted-foreground" colSpan={cols.length}>No rows</td></tr>
        ) : rows.map((r, i) => (
          <tr key={i} className="border-t border-border/60">
            {cols.map((c) => <td key={c} className="px-3 py-2 align-top max-w-xs truncate">{typeof r[c] === "object" ? JSON.stringify(r[c]) : String(r[c] ?? "-")}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const BlogTab = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [form, setForm] = useState({ title: "", slug: "", excerpt: "", content: "", published: false });
  const load = async () => {
    const { data } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
    setRows(data || []);
  };
  useEffect(() => { load(); }, []);
  const save = async () => {
    if (!form.title || !form.slug) return toast.error("Title & slug required");
    const { error } = await supabase.from("blog_posts").insert(form as any);
    if (error) return toast.error(error.message);
    toast.success("Post saved");
    setForm({ title: "", slug: "", excerpt: "", content: "", published: false });
    load();
  };
  const del = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    await supabase.from("blog_posts").delete().eq("id", id);
    load();
  };
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border p-4 grid gap-3">
        <div className="grid md:grid-cols-2 gap-3">
          <div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
          <div><Label>Slug</Label><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="my-post-url" /></div>
        </div>
        <div><Label>Excerpt</Label><Input value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} /></div>
        <div><Label>Content (markdown)</Label><Textarea rows={6} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} /></div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> Publish</label>
          <Button onClick={save}><Plus className="w-4 h-4 mr-1" /> Save post</Button>
        </div>
      </div>
      <div className="space-y-2">
        {rows.map((r) => (
          <div key={r.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
            <div className="min-w-0">
              <div className="font-medium truncate">{r.title} {r.published ? <span className="text-xs text-emerald-600">· live</span> : <span className="text-xs text-muted-foreground">· draft</span>}</div>
              <div className="text-xs text-muted-foreground truncate">/{r.slug}</div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => del(r.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
          </div>
        ))}
      </div>
    </div>
  );
};

const ResearchTab = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [form, setForm] = useState({ title: "", slug: "", authors: "", abstract: "", pdf_url: "", published: false });
  const load = async () => {
    const { data } = await (supabase as any).from("research_papers").select("*").order("created_at", { ascending: false });
    setRows(data || []);
  };
  useEffect(() => { load(); }, []);
  const save = async () => {
    if (!form.title || !form.slug) return toast.error("Title & slug required");
    const payload: any = { ...form };
    if (form.published) payload.published_at = new Date().toISOString();
    const { error } = await (supabase as any).from("research_papers").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Paper saved");
    setForm({ title: "", slug: "", authors: "", abstract: "", pdf_url: "", published: false });
    load();
  };
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border p-4 grid gap-3">
        <div className="grid md:grid-cols-2 gap-3">
          <div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
          <div><Label>Slug</Label><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} /></div>
        </div>
        <div><Label>Authors</Label><Input value={form.authors} onChange={(e) => setForm({ ...form, authors: e.target.value })} /></div>
        <div><Label>Abstract</Label><Textarea rows={4} value={form.abstract} onChange={(e) => setForm({ ...form, abstract: e.target.value })} /></div>
        <div><Label>PDF URL</Label><Input value={form.pdf_url} onChange={(e) => setForm({ ...form, pdf_url: e.target.value })} /></div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> Publish</label>
          <Button onClick={save}><Plus className="w-4 h-4 mr-1" /> Save paper</Button>
        </div>
      </div>
      <Table rows={rows} cols={["title", "slug", "authors", "published", "created_at"]} />
    </div>
  );
};

const CareersTab = () => {
  const [rows, setRows] = useState<Row[]>([]);
  useEffect(() => { supabase.from("job_applications").select("*").order("created_at", { ascending: false }).then(({ data }) => setRows(data || [])); }, []);
  return <Table rows={rows} cols={["full_name", "email", "role", "phone", "status", "created_at"]} />;
};

const LeadsTab = () => {
  const [rows, setRows] = useState<Row[]>([]);
  useEffect(() => { supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(200).then(({ data }) => setRows(data || [])); }, []);
  return <Table rows={rows} cols={["email", "phone", "source", "status", "created_at"]} />;
};

const DemoTab = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [email, setEmail] = useState("");
  const load = async () => {
    const { data } = await (supabase as any).from("demo_access_grants").select("*").order("created_at", { ascending: false });
    setRows(data || []);
  };
  useEffect(() => { load(); }, []);
  const grant = async () => {
    if (!email) return;
    const { error } = await (supabase as any).from("demo_access_grants").insert({ email: email.toLowerCase(), expires_at: new Date(Date.now() + 86400_000).toISOString() });
    if (error) return toast.error(error.message);
    toast.success(`1-day full access granted to ${email}`);
    setEmail(""); load();
  };
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border p-4 flex gap-2 items-end">
        <div className="flex-1"><Label>Grant 24-hour full-feature demo to email</Label><Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="user@example.com" /></div>
        <Button onClick={grant}><Plus className="w-4 h-4 mr-1" /> Grant</Button>
      </div>
      <Table rows={rows} cols={["email", "expires_at", "is_active", "created_at"]} />
    </div>
  );
};

const InvoicesTab = () => {
  const [rows, setRows] = useState<Row[]>([]);
  useEffect(() => { (supabase as any).from("invoices").select("*").order("issued_at", { ascending: false }).limit(200).then(({ data }) => setRows(data || [])); }, []);
  return <Table rows={rows} cols={["invoice_no", "plan_id", "amount", "status", "issued_at"]} />;
};

const Admin = () => {
  useSEO({ title: "Admin — WellMindAI", description: "Admin control panel", path: "/admin" });
  const navigate = useNavigate();
  const { isAdmin, loading } = useAdmin();
  useEffect(() => { if (!loading && isAdmin === false) navigate("/dashboard"); }, [isAdmin, loading, navigate]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Checking access…</div>;
  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16 px-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Shield className="w-6 h-6 text-primary" />
          <h1 className="font-display text-3xl">Admin Panel</h1>
        </div>
        <Tabs defaultValue="blog">
          <TabsList className="flex-wrap h-auto">
            <TabsTrigger value="blog">Blog</TabsTrigger>
            <TabsTrigger value="research">Research</TabsTrigger>
            <TabsTrigger value="careers">Careers</TabsTrigger>
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="demo">Demo Access</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
          </TabsList>
          <TabsContent value="blog" className="mt-6"><BlogTab /></TabsContent>
          <TabsContent value="research" className="mt-6"><ResearchTab /></TabsContent>
          <TabsContent value="careers" className="mt-6"><CareersTab /></TabsContent>
          <TabsContent value="leads" className="mt-6"><LeadsTab /></TabsContent>
          <TabsContent value="demo" className="mt-6"><DemoTab /></TabsContent>
          <TabsContent value="invoices" className="mt-6"><InvoicesTab /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
