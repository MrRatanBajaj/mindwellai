import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { FeedbackForm } from "@/components/ui-custom/FeedbackForm";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, Waves } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

interface Note {
  id: string;
  name: string | null;
  feedback: string;
  rating: number | null;
  created_at: string;
}

// Bioluminescent palette — soft glowing teals, pinks, violets, aquas
const JELLY_HUES = [
  { bell: "#7ee3ff", glow: "rgba(126, 227, 255, 0.55)", ink: "#062234" }, // aqua
  { bell: "#ffb3e1", glow: "rgba(255, 179, 225, 0.5)", ink: "#3a0a2b" },  // pink
  { bell: "#c0b3ff", glow: "rgba(192, 179, 255, 0.55)", ink: "#1a0d3a" }, // violet
  { bell: "#a0ffd1", glow: "rgba(160, 255, 209, 0.55)", ink: "#053a25" }, // mint
  { bell: "#ffd59e", glow: "rgba(255, 213, 158, 0.55)", ink: "#3a1f05" }, // amber
  { bell: "#9ee0ff", glow: "rgba(158, 224, 255, 0.55)", ink: "#062f44" }, // sky
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

      {/* ░░░ DEEP SEA ░░░ */}
      <section
        className="relative pt-28 pb-24 overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse at top, #0b2a4a 0%, #061a33 45%, #02091a 100%)",
        }}
      >
        {/* Rising plankton bubbles */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 60 }).map((_, i) => {
            const size = 2 + Math.random() * 4;
            const left = Math.random() * 100;
            const duration = 8 + Math.random() * 10;
            const delay = Math.random() * 8;
            return (
              <motion.span
                key={i}
                className="absolute rounded-full"
                style={{
                  width: size,
                  height: size,
                  left: `${left}%`,
                  bottom: -10,
                  background:
                    "radial-gradient(circle, rgba(180,240,255,0.9), rgba(120,200,255,0.2))",
                  boxShadow: "0 0 6px rgba(160,230,255,0.6)",
                }}
                animate={{
                  y: ["0vh", "-110vh"],
                  opacity: [0, 0.9, 0.9, 0],
                }}
                transition={{ duration, repeat: Infinity, delay, ease: "linear" }}
              />
            );
          })}
        </div>

        {/* Caustic surface light */}
        <div
          className="absolute -top-20 left-1/2 -translate-x-1/2 w-[140%] h-[400px] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center top, rgba(160,230,255,0.18), transparent 65%)",
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-cyan-100/80 text-xs font-medium mb-6 backdrop-blur-sm">
              <Waves className="w-3.5 h-3.5" />
              The Wall of Voices
            </div>
            <h1
              className="text-4xl md:text-6xl text-cyan-50 leading-tight mb-4"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              A quiet sea of{" "}
              <span className="italic" style={{ color: "#8ee7ff" }}>
                glowing voices
              </span>
            </h1>
            <p className="text-cyan-100/65 max-w-xl mx-auto leading-relaxed">
              Each glow is a real voice — drifting gently through the deep, carrying a piece of someone's journey. Hover one to listen.
            </p>
          </motion.div>

          {/* Jellyfish field */}
          <div className="relative min-h-[640px]">
            {loading ? (
              <p className="text-center text-cyan-100/40">Waking the deep…</p>
            ) : notes.length === 0 ? (
              <p className="text-center text-cyan-100/50 italic">
                The sea is still. Be the first glow — share a note below.
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-8 gap-y-20">
                {notes.map((note, i) => {
                  const c = JELLY_HUES[i % JELLY_HUES.length];
                  const font = HANDWRITTEN_FONTS[i % HANDWRITTEN_FONTS.length];
                  const drift = 8 + (i % 5) * 3;
                  const sway = 2 + (i % 4) * 0.6;
                  const delay = (i % 10) * 0.4;
                  return (
                    <motion.div
                      key={note.id}
                      initial={{ opacity: 0, y: 60 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.8 }}
                      className="relative group flex flex-col items-center"
                    >
                      <motion.div
                        animate={{
                          y: [0, -drift, 0],
                          x: [-sway, sway, -sway],
                        }}
                        transition={{
                          duration: 5 + (i % 5),
                          repeat: Infinity,
                          delay,
                          ease: "easeInOut",
                        }}
                        whileHover={{ scale: 1.12, zIndex: 20 }}
                        className="relative cursor-default"
                        style={{ width: 150 }}
                      >
                        {/* Bioluminescent halo */}
                        <motion.div
                          className="absolute inset-0 rounded-full blur-3xl"
                          style={{
                            background: `radial-gradient(circle, ${c.glow}, transparent 70%)`,
                            transform: "scale(1.8)",
                          }}
                          animate={{ opacity: [0.45, 0.85, 0.45] }}
                          transition={{ duration: 3 + (i % 3), repeat: Infinity }}
                        />

                        {/* Jellyfish bell */}
                        <div
                          className="relative px-4 pt-5 pb-4 backdrop-blur-md border"
                          style={{
                            background: `linear-gradient(180deg, ${c.bell}ee, ${c.bell}aa 70%, ${c.bell}55)`,
                            borderColor: "rgba(255,255,255,0.45)",
                            borderRadius: "50% 50% 38% 38% / 60% 60% 40% 40%",
                            boxShadow: `0 0 50px ${c.glow}, inset 0 -10px 24px rgba(0,0,0,0.08), inset 0 10px 16px rgba(255,255,255,0.55)`,
                            minHeight: 150,
                          }}
                        >
                          {/* Top shine */}
                          <div
                            className="absolute top-2 left-6 w-10 h-3 rounded-full opacity-70"
                            style={{ background: "rgba(255,255,255,0.7)", filter: "blur(2px)" }}
                          />

                          <p
                            className="text-xs md:text-sm leading-snug line-clamp-5 text-center relative z-10"
                            style={{ fontFamily: font, color: c.ink }}
                          >
                            "{note.feedback}"
                          </p>
                          {note.name && (
                            <p
                              className="text-[11px] italic text-center mt-2 relative z-10"
                              style={{ fontFamily: font, color: c.ink, opacity: 0.75 }}
                            >
                              — {note.name}
                            </p>
                          )}
                        </div>

                        {/* Flowing tentacles */}
                        <div className="absolute left-1/2 -translate-x-1/2 -bottom-16 flex gap-1.5">
                          {Array.from({ length: 5 }).map((_, t) => (
                            <motion.span
                              key={t}
                              className="block rounded-full"
                              style={{
                                width: 1.5,
                                height: 56 + (t % 3) * 14,
                                background: `linear-gradient(180deg, ${c.bell}cc, transparent)`,
                                boxShadow: `0 0 6px ${c.glow}`,
                                transformOrigin: "top center",
                              }}
                              animate={{ rotate: [-6, 6, -6] }}
                              transition={{
                                duration: 3 + t * 0.4,
                                repeat: Infinity,
                                delay: t * 0.2,
                                ease: "easeInOut",
                              }}
                            />
                          ))}
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

      {/* Release a voice */}
      <section className="py-20 bg-gradient-to-b from-background via-calm-sky/20 to-background">
        <div className="max-w-2xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
              <Sparkles className="w-3.5 h-3.5" /> Release a voice
            </div>
            <h2 className="text-3xl md:text-4xl font-display text-foreground mb-3">
              Send your glow into the deep
            </h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              Share a thought, a thank you, or a wish. It will drift with the others.
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
