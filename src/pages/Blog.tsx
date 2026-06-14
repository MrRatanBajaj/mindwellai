import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useSEO } from "@/hooks/useSEO";
import { Calendar, ArrowRight, BookOpen } from "lucide-react";

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image_url: string | null;
  tags: string[];
  published_at: string | null;
  created_at: string;
}

const Blog = () => {
  useSEO({
    title: "Mental Health Blog | WellMind AI",
    description:
      "Evidence-based articles on therapy, anxiety, depression, mindfulness, AI counseling and affordable mental health support in India.",
    path: "/blog",
  });

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await (supabase as any)
        .from("published_blog_posts")
        .select("id, slug, title, excerpt, cover_image_url, tags, published_at, created_at")
        .order("published_at", { ascending: false })
        .limit(60);
      setPosts((data as Post[]) || []);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="pt-32 pb-12 px-6 bg-gradient-to-b from-secondary/40 to-background">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
              <BookOpen className="w-3.5 h-3.5" /> WellMind Journal
            </div>
            <h1 className="font-display text-4xl md:text-6xl text-foreground leading-tight mb-4">
              Mental health, <span className="serif-italic text-primary">explained gently</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Evidence-based articles on therapy, AI counseling, mindfulness, anxiety and the quiet science of feeling better.
            </p>
          </div>
        </section>

        {/* Grid */}
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            {loading ? (
              <p className="text-center text-muted-foreground">Loading articles…</p>
            ) : posts.length === 0 ? (
              <div className="text-center py-20 max-w-md mx-auto">
                <BookOpen className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                <h2 className="font-display text-xl text-foreground mb-2">First article coming soon</h2>
                <p className="text-muted-foreground text-sm">
                  We're writing our first piece on AI therapy and affordable mental wellness. Check back shortly.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((p, i) => (
                  <motion.article
                    key={p.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="group rounded-3xl border border-border bg-card overflow-hidden hover:shadow-elegant transition"
                  >
                    <NavLink to={`/blog/${p.slug}`} className="block">
                      {p.cover_image_url ? (
                        <div className="aspect-[16/10] overflow-hidden bg-secondary">
                          <img
                            src={p.cover_image_url}
                            alt={p.title}
                            loading="lazy"
                            className="size-full object-cover group-hover:scale-105 transition duration-500"
                          />
                        </div>
                      ) : (
                        <div className="aspect-[16/10] bg-gradient-to-br from-primary/15 via-accent/10 to-secondary" />
                      )}
                      <div className="p-6">
                        {p.tags?.length ? (
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {p.tags.slice(0, 3).map((t) => (
                              <span key={t} className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full bg-secondary text-foreground/70">
                                {t}
                              </span>
                            ))}
                          </div>
                        ) : null}
                        <h2 className="font-display text-xl text-foreground mb-2 leading-snug group-hover:text-primary transition">
                          {p.title}
                        </h2>
                        {p.excerpt && (
                          <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">{p.excerpt}</p>
                        )}
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(p.published_at || p.created_at).toLocaleDateString("en-IN", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                          <span className="inline-flex items-center gap-1 text-primary font-medium group-hover:gap-2 transition-all">
                            Read <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    </NavLink>
                  </motion.article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
