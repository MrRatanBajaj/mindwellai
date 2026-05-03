import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { FeedbackForm } from "@/components/ui-custom/FeedbackForm";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles } from "lucide-react";

interface Note {
  id: string;
  name: string | null;
  feedback: string;
  rating: number | null;
  created_at: string;
}

// Warm sticky-note palette (paper colors against dark wall)
const NOTE_COLORS = [
  { bg: "#FFF59D", shadow: "rgba(255,235,59,0.25)" },   // yellow
  { bg: "#FFCCBC", shadow: "rgba(255,138,101,0.25)" },  // peach
  { bg: "#C5E1A5", shadow: "rgba(174,213,129,0.25)" },  // sage
  { bg: "#B3E5FC", shadow: "rgba(129,212,250,0.25)" },  // sky
  { bg: "#F8BBD0", shadow: "rgba(244,143,177,0.25)" },  // pink
  { bg: "#D1C4E9", shadow: "rgba(179,157,219,0.25)" },  // lavender
];

const ROTATIONS = [-4, -2.5, -1, 1, 2.5, 4, -3, 3, 0, -1.5];

const HANDWRITTEN_FONTS = [
  "'Caveat', 'Comic Sans MS', cursive",
  "'Patrick Hand', cursive",
  "'Kalam', cursive",
  "'Shadows Into Light', cursive",
];

const FeedbackWall = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Inject handwritten fonts once
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

      {/* The Dark Room */}
      <section
        className="relative pt-28 pb-20 overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse at top, #2a2520 0%, #14110f 55%, #0a0908 100%)",
        }}
      >
        {/* Wall texture */}
        <div
          className="absolute inset-0 opacity-[0.18] pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' /%3E%3C/svg%3E\")",
          }}
        />

        {/* Warm spotlight */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[600px] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center top, rgba(255,200,120,0.18), transparent 60%)",
          }}
        />

        <div className="relative max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-amber-100/80 text-xs font-medium mb-6 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5" />
              The Wall of Voices
            </div>
            <h1
              className="text-4xl md:text-6xl text-amber-50 leading-tight mb-4"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              Notes from{" "}
              <span className="italic" style={{ color: "#FFD580" }}>
                quiet hearts
              </span>
            </h1>
            <p className="text-amber-100/60 max-w-xl mx-auto leading-relaxed">
              Every note here is a real voice — left by someone who paused, breathed, and shared a piece of their journey.
            </p>
          </motion.div>

          {/* The Wall */}
          <div className="relative min-h-[600px]">
            {loading ? (
              <p className="text-center text-amber-100/40">Lighting the room…</p>
            ) : notes.length === 0 ? (
              <p className="text-center text-amber-100/50 italic">
                The wall is quiet. Be the first voice — write a note below.
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8">
                {notes.map((note, i) => {
                  const color = NOTE_COLORS[i % NOTE_COLORS.length];
                  const rot = ROTATIONS[i % ROTATIONS.length];
                  const font = HANDWRITTEN_FONTS[i % HANDWRITTEN_FONTS.length];
                  return (
                    <motion.div
                      key={note.id}
                      initial={{ opacity: 0, y: 30, rotate: 0 }}
                      animate={{ opacity: 1, y: 0, rotate: rot }}
                      transition={{
                        delay: i * 0.04,
                        type: "spring",
                        stiffness: 80,
                        damping: 14,
                      }}
                      whileHover={{
                        scale: 1.08,
                        rotate: 0,
                        zIndex: 10,
                        transition: { duration: 0.2 },
                      }}
                      className="relative aspect-square p-4 cursor-default"
                      style={{
                        background: color.bg,
                        boxShadow: `0 12px 30px -8px ${color.shadow}, 0 4px 8px rgba(0,0,0,0.4)`,
                      }}
                    >
                      {/* Pin */}
                      <div
                        className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full"
                        style={{
                          background:
                            "radial-gradient(circle at 30% 30%, #ff6b6b, #c92a2a)",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.5)",
                        }}
                      />
                      <p
                        className="text-slate-800 text-sm md:text-base leading-snug line-clamp-6 overflow-hidden"
                        style={{ fontFamily: font }}
                      >
                        "{note.feedback}"
                      </p>
                      {note.name && (
                        <p
                          className="absolute bottom-3 right-4 text-slate-700/80 text-xs italic"
                          style={{ fontFamily: font }}
                        >
                          — {note.name}
                        </p>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Add your own note */}
      <section className="py-20 bg-gradient-to-b from-background via-calm-sky/20 to-background">
        <div className="max-w-2xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl md:text-4xl font-display text-foreground mb-3">
              Pin your note to the wall
            </h2>
            <p className="text-muted-foreground text-sm">
              Share a thought, a thank you, or a wish. It will appear among the others.
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
