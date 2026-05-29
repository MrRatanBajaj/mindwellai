import { useEffect, useState } from "react";
import { NavLink, useParams, Navigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Calendar, Loader2 } from "lucide-react";

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image_url: string | null;
  body_markdown: string;
  tags: string[];
  author_email: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
}

const BASE_URL = "https://www.wellmindai.in";

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      if (!data) {
        setNotFound(true);
      } else {
        setPost(data as Post);
      }
      setLoading(false);
    })();
  }, [slug]);

  useEffect(() => {
    if (!post) return;
    const url = `${BASE_URL}/blog/${post.slug}`;
    const desc = (post.excerpt || post.title).slice(0, 157);
    document.title = `${post.title} | WellMind AI`;
    setMeta("name", "description", desc);

    // canonical
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", url);

    setMeta("property", "og:title", post.title);
    setMeta("property", "og:description", desc);
    setMeta("property", "og:url", url);
    setMeta("property", "og:type", "article");
    if (post.cover_image_url) setMeta("property", "og:image", post.cover_image_url);

    // Article JSON-LD
    const ldId = "blog-post-jsonld";
    document.getElementById(ldId)?.remove();
    const ld = document.createElement("script");
    ld.type = "application/ld+json";
    ld.id = ldId;
    ld.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      description: desc,
      image: post.cover_image_url || undefined,
      datePublished: post.published_at || post.created_at,
      dateModified: post.published_at || post.created_at,
      author: { "@type": "Organization", name: "WellMind AI" },
      publisher: {
        "@type": "Organization",
        name: "WellMind AI",
        logo: { "@type": "ImageObject", url: `${BASE_URL}/lovable-uploads/b438a37f-b172-43e3-9eaf-bffee8ba79f5.png` },
      },
      mainEntityOfPage: url,
    });
    document.head.appendChild(ld);

    return () => {
      document.getElementById(ldId)?.remove();
    };
  }, [post]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (notFound) return <Navigate to="/blog" replace />;
  if (!post) return null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-28 pb-20 px-6">
        <article className="max-w-3xl mx-auto">
          <NavLink to="/blog" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="w-4 h-4" /> All articles
          </NavLink>

          {post.tags?.length ? (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {post.tags.map((t) => (
                <span key={t} className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full bg-secondary text-foreground/70">
                  {t}
                </span>
              ))}
            </div>
          ) : null}

          <h1 className="font-display text-4xl md:text-5xl text-foreground leading-tight mb-4">{post.title}</h1>

          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-8">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(post.published_at || post.created_at).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span>·</span>
            <span>WellMind AI editorial</span>
          </div>

          {post.cover_image_url && (
            <div className="aspect-[16/9] overflow-hidden rounded-3xl mb-10 bg-secondary">
              <img src={post.cover_image_url} alt={post.title} className="size-full object-cover" />
            </div>
          )}

          {post.excerpt && (
            <p className="text-lg text-foreground/85 leading-relaxed mb-8 italic border-l-4 border-primary/40 pl-4">
              {post.excerpt}
            </p>
          )}

          <div className="prose prose-neutral max-w-none prose-headings:font-display prose-headings:text-foreground prose-p:text-foreground/85 prose-p:leading-relaxed prose-a:text-primary prose-strong:text-foreground prose-blockquote:border-primary/40 prose-img:rounded-2xl">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.body_markdown}</ReactMarkdown>
          </div>

          <div className="mt-16 p-6 rounded-3xl bg-gradient-to-br from-primary/10 to-accent/15 border border-primary/15 text-center">
            <h3 className="font-display text-2xl text-foreground mb-2">Talk to an AI counselor — free trial</h3>
            <p className="text-sm text-muted-foreground mb-4">
              24/7 mental wellness support. Voice, chat, and phone counseling from ₹149/month.
            </p>
            <NavLink to="/auth" className="inline-flex items-center gap-2 px-6 h-11 rounded-full bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition">
              Start free trial
            </NavLink>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;
