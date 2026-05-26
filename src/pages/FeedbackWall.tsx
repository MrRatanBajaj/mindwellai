import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { FeedbackForm } from "@/components/ui-custom/FeedbackForm";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, Star } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

interface Note {
  id: string;
  name: string | null;
  feedback: string;
  rating: number | null;
  created_at: string;
}

// Lantern glow palette — warm golds, blush pinks, sky blues, gentle violets
const LANTERN_GLOWS = [
  { core: "#FFE8A3", glow: "rgba(255, 200, 120, 0.55)" }, // candle gold
  { core: "#FFD9B5", glow: "rgba(255, 170, 120, 0.5)" },  // peach
  { core: "#FFC8DD", glow: "rgba(255, 150, 200, 0.45)" }, // blush
  { core: "#BDE0FE", glow: "rgba(140, 200, 255, 0.5)" },  // sky
  { core: "#D4C5F9", glow: "rgba(180, 160, 240, 0.5)" },  // lavender
  { core: "#FFE5B4", glow: "rgba(255, 210, 140, 0.55)" }, // amber
];

const HANDWRITTEN_FONTS = [
  "'Caveat', cursive",
  "'Patrick Hand', cursive",
  "'Kalam', cursive",
  "'Shadows Into Light', cursive",
];

const FeedbackWall = () => {
  useSEO({
    title: "Wall of Voices — Stories from WellMind AI Users",
    description: "Read real feedback and stories from people using WellMind AI for therapy, journaling and self-help. Share your own experience.",
    path: "/feedback-wall",
  });
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Caveat:wght@400;600&family=Patrick+Hand&family=Kalam:wght@400;700&family=Shadows+Into+Light&display=swap";
    document.head.appendChild(link);

    const load = async () => {
      const { data } = await supabase
        .from("feedback")
        .select("id, name, feedback, rating, created_at")
        .order("created_at", { ascending: false })
        .limit(60);
      setNotes(data || []);
      setLoading(false);
    };
    load();

    const channel = supabase
      .channel("feedback-wall")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "feedback" },
        (payload) => {
          setNotes((prev) => [payload.new as Note, ...prev].slice(0, 60));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* ░░░ NIGHT SKY ░░░ */}
      <section
        className="relative pt-28 pb-24 overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse at top, #1a1f3a 0%, #0a0d1f 55%, #04050d 100%)",
        }}
      >
        {/* Stars layer */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 90 }).map((_, i) => (
            <motion.span
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: Math.random() < 0.85 ? 1.5 : 2.5,
                height: Math.random() < 0.85 ? 1.5 : 2.5,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{ opacity: [0.2, 0.95, 0.2] }}
              transition={{
                duration: 2 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>

        {/* Moon glow */}
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[140%] h-[640px] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center top, rgba(255,220,160,0.20), transparent 65%)",
          }}
        />

        <div className="relative max-w-6xl mx-auto px-6">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-amber-100/80 text-xs font-medium mb-6 backdrop-blur-sm">
              <Star className="w-3.5 h-3.5" />
              The Wall of Voices
            </div>
            <h1
              className="text-4xl md:text-6xl text-amber-50 leading-tight mb-4"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              A sky full of{" "}
              <span className="italic" style={{ color: "#FFD580" }}>
                quiet lanterns
              </span>
            </h1>
            <p className="text-amber-100/65 max-w-xl mx-auto leading-relaxed">
              Each lantern is a real voice — released into the night by someone who paused, breathed, and shared a piece of their journey. Hover one to read it.
            </p>
          </motion.div>

          {/* Lantern field */}
          <div className="relative min-h-[640px]">
            {loading ? (
              <p className="text-center text-amber-100/40">Lighting the lanterns…</p>
            ) : notes.length === 0 ? (
              <p className="text-center text-amber-100/50 italic">
                The sky is still. Be the first lantern — write a note below.
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-12">
                {notes.map((note, i) => {
                  const c = LANTERN_GLOWS[i % LANTERN_GLOWS.length];
                  const font = HANDWRITTEN_FONTS[i % HANDWRITTEN_FONTS.length];
                  const driftY = 6 + (i % 5) * 2;
                  const sway = 1.5 + (i % 4) * 0.4;
                  const delay = (i % 10) * 0.3;
                  return (
                    <motion.div
                      key={note.id}
                      initial={{ opacity: 0, y: 60 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.8 }}
                      className="relative group flex flex-col items-center"
                    >
                      {/* String to the heavens */}
                      <div
                        className="w-px h-8 bg-gradient-to-b from-transparent to-white/20"
                        aria-hidden
                      />

                      {/* Lantern body — floats & sways */}
                      <motion.div
                        animate={{
                          y: [0, -driftY, 0],
                          rotate: [-sway, sway, -sway],
                        }}
                        transition={{
                          duration: 4 + (i % 5),
                          repeat: Infinity,
                          delay,
                          ease: "easeInOut",
                        }}
                        whileHover={{ scale: 1.12, zIndex: 20 }}
                        className="relative cursor-default"
                        style={{ width: 140 }}
                      >
                        {/* Glow halo */}
                        <div
                          className="absolute inset-0 rounded-full blur-2xl"
                          style={{
                            background: `radial-gradient(circle, ${c.glow}, transparent 70%)`,
                            transform: "scale(1.6)",
                          }}
                        />

                        {/* Lantern paper */}
                        <div
                          className="relative rounded-[28px] px-4 py-5 backdrop-blur-sm border"
                          style={{
                            background: `linear-gradient(180deg, ${c.core}f0, ${c.core}d0)`,
                            borderColor: "rgba(255,255,255,0.35)",
                            boxShadow: `0 0 40px ${c.glow}, inset 0 -8px 16px rgba(0,0,0,0.08), inset 0 8px 12px rgba(255,255,255,0.4)`,
                            minHeight: 130,
                          }}
                        >
                          {/* Top bamboo rim */}
                          <div
                            className="absolute top-1 left-3 right-3 h-1 rounded-full"
                            style={{ background: "rgba(120,80,40,0.4)" }}
                          />
                          {/* Bottom bamboo rim */}
                          <div
                            className="absolute bottom-1 left-3 right-3 h-1 rounded-full"
                            style={{ background: "rgba(120,80,40,0.4)" }}
                          />
                          {/* Tassel */}
                          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0.5 h-3 bg-amber-900/40" />
                          <div
                            className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full"
                            style={{ background: c.core, boxShadow: `0 0 6px ${c.glow}` }}
                          />

                          <p
                            className="text-slate-800/90 text-xs md:text-sm leading-snug line-clamp-5 text-center"
                            style={{ fontFamily: font }}
                          >
                            "{note.feedback}"
                          </p>
                          {note.name && (
                            <p
                              className="text-slate-700/70 text-[11px] italic text-center mt-2"
                              style={{ fontFamily: font }}
                            >
                              — {note.name}
                            </p>
                          )}

                          {/* Inner flame */}
                          <motion.div
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-4 rounded-full pointer-events-none"
                            style={{
                              background:
                                "radial-gradient(circle, rgba(255,255,255,0.9), rgba(255,200,80,0.4), transparent 70%)",
                              filter: "blur(2px)",
                            }}
                            animate={{ scale: [1, 1.18, 0.95, 1.1, 1] }}
                            transition={{ duration: 1.4, repeat: Infinity }}
                          />
                        </div>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Release a lantern */}
      <section className="py-20 bg-gradient-to-b from-background via-calm-sky/20 to-background">
        <div className="max-w-2xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
              <Sparkles className="w-3.5 h-3.5" /> Release a lantern
            </div>
            <h2 className="text-3xl md:text-4xl font-display text-foreground mb-3">
              Light one for someone tonight
            </h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              Share a thought, a thank you, or a wish. It will rise and join the others.
            </p>
          </motion.div>
          <FeedbackForm />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FeedbackWall;
