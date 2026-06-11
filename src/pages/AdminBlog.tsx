import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AdminNav from "@/components/layout/AdminNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, ShieldCheck, Eye, EyeOff, Save } from "lucide-react";
import { FOUNDER_EMAILS } from "@/lib/founderAccess";

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image_url: string | null;
  body_markdown: string;
  tags: string[];
  published: boolean;
  published_at: string | null;
  created_at: string;
}

const ADMIN_DOMAINS = ["@mindwellai.com", "@wellmindai.in"];
function isAdmin(email?: string | null) {
  if (!email) return false;
  const e = email.toLowerCase();
  if (FOUNDER_EMAILS.includes(e)) return true;
  return ADMIN_DOMAINS.some((d) => e.endsWith(d));
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);

const empty: Partial<Post> = {
  slug: "",
  title: "",
  excerpt: "",
  cover_image_url: "",
  body_markdown: "",
  tags: [],
  published: false,
};

const AdminBlog = () => {
  const { user, loading } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [fetching, setFetching] = useState(true);
  const [editing, setEditing] = useState<Partial<Post> | null>(null);
  const [tagsText, setTagsText] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setFetching(true);
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setPosts((data as Post[]) || []);
    setFetching(false);
  };

  useEffect(() => {
    if (user && isAdmin(user.email)) load();
  }, [user]);

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
              Restricted to WellMindAI staff accounts.
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const startNew = () => {
    setEditing({ ...empty });
    setTagsText("");
  };
  const startEdit = (p: Post) => {
    setEditing(p);
    setTagsText((p.tags || []).join(", "));
  };
  const cancel = () => {
    setEditing(null);
    setTagsText("");
  };

  const save = async () => {
    if (!editing) return;
    const slug = (editing.slug || slugify(editing.title || "")).trim();
    if (!editing.title || !slug) {
      toast.error("Title and slug are required");
      return;
    }
    setSaving(true);
    const tags = tagsText
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const payload = {
      slug,
      title: editing.title,
      excerpt: editing.excerpt || null,
      cover_image_url: editing.cover_image_url || null,
      body_markdown: editing.body_markdown || "",
      tags,
      published: !!editing.published,
      author_email: user.email,
    };
    let error;
    if (editing.id) {
      ({ error } = await supabase.from("blog_posts").update(payload).eq("id", editing.id));
    } else {
      ({ error } = await supabase.from("blog_posts").insert(payload));
    }
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(editing.id ? "Post updated" : "Post created");
    setEditing(null);
    setTagsText("");
    load();
  };

  const togglePublish = async (p: Post) => {
    const { error } = await supabase
      .from("blog_posts")
      .update({ published: !p.published, published_at: !p.published ? new Date().toISOString() : p.published_at })
      .eq("id", p.id);
    if (error) return toast.error(error.message);
    toast.success(!p.published ? "Published" : "Unpublished");
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this post permanently?")) return;
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <AdminNav />
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 pt-4 pb-24">
        <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
          <div>
            <div className="flex items-center gap-2 text-xs text-primary font-semibold uppercase tracking-widest mb-2">
              <ShieldCheck className="w-4 h-4" /> Admin · Blog
            </div>
            <h1 className="font-display text-3xl md:text-4xl text-foreground">Articles</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Write Markdown. Publish to <code className="text-xs">/blog/&lt;slug&gt;</code>. Auto-indexed.
            </p>
          </div>
          {!editing && (
            <Button onClick={startNew} className="rounded-full gap-1">
              <Plus className="w-4 h-4" /> New post
            </Button>
          )}
        </div>

        {editing ? (
          <div className="rounded-3xl border border-border bg-card p-6 md:p-8 space-y-5">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={editing.title || ""}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      title: e.target.value,
                      slug: editing.id ? editing.slug : slugify(e.target.value),
                    })
                  }
                  placeholder="A gentle guide to anxiety during exam season"
                />
              </div>
              <div>
                <Label htmlFor="slug">URL slug</Label>
                <Input
                  id="slug"
                  value={editing.slug || ""}
                  onChange={(e) => setEditing({ ...editing, slug: slugify(e.target.value) })}
                  placeholder="anxiety-exam-season"
                />
                <p className="text-[11px] text-muted-foreground mt-1">
                  /blog/{editing.slug || "your-slug"}
                </p>
              </div>
              <div>
                <Label htmlFor="cover">Cover image URL (optional)</Label>
                <Input
                  id="cover"
                  value={editing.cover_image_url || ""}
                  onChange={(e) => setEditing({ ...editing, cover_image_url: e.target.value })}
                  placeholder="https://…/image.jpg"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="excerpt">Excerpt (1-2 lines, used for SEO + previews)</Label>
                <Textarea
                  id="excerpt"
                  rows={2}
                  value={editing.excerpt || ""}
                  onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })}
                  placeholder="Practical, science-backed steps to calm exam anxiety in minutes."
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  value={tagsText}
                  onChange={(e) => setTagsText(e.target.value)}
                  placeholder="anxiety, students, mindfulness"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="body">Body (Markdown supported)</Label>
                <Textarea
                  id="body"
                  rows={18}
                  className="font-mono text-sm"
                  value={editing.body_markdown || ""}
                  onChange={(e) => setEditing({ ...editing, body_markdown: e.target.value })}
                  placeholder={"## Why exam anxiety happens\n\nWrite your article in Markdown..."}
                />
              </div>
              <div className="md:col-span-2 flex items-center gap-3">
                <Switch
                  id="pub"
                  checked={!!editing.published}
                  onCheckedChange={(v) => setEditing({ ...editing, published: v })}
                />
                <Label htmlFor="pub" className="cursor-pointer">
                  Publish immediately
                </Label>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button onClick={save} disabled={saving} className="rounded-full gap-1">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {editing.id ? "Save changes" : "Create post"}
              </Button>
              <Button variant="outline" onClick={cancel} className="rounded-full">
                Cancel
              </Button>
            </div>
          </div>
        ) : fetching ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            No posts yet. Click <strong>New post</strong> to write the first article.
          </div>
        ) : (
          <ul className="space-y-3">
            {posts.map((p) => (
              <li key={p.id} className="p-5 rounded-2xl border border-border bg-card flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-semibold text-foreground truncate">{p.title}</h3>
                    <Badge
                      className={
                        p.published
                          ? "bg-emerald-500/15 text-emerald-700 border border-emerald-300 text-[10px]"
                          : "bg-amber-500/15 text-amber-700 border border-amber-300 text-[10px]"
                      }
                    >
                      {p.published ? "Published" : "Draft"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">/blog/{p.slug}</p>
                  {p.excerpt && <p className="text-sm text-foreground/80 mt-1 line-clamp-2">{p.excerpt}</p>}
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <Button size="sm" variant="outline" onClick={() => startEdit(p)} className="gap-1">
                    Edit
                  </Button>
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
      </main>
      <Footer />
    </div>
  );
};

export default AdminBlog;
