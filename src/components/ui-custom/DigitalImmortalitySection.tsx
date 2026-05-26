import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Infinity as InfinityIcon, Sparkles, Brain, Heart, MessageCircle, ArrowRight } from "lucide-react";

export default function DigitalImmortalitySection() {
  return (
    <section className="py-28 relative overflow-hidden bg-investor text-primary-foreground">
      {/* Starfield */}
      <div className="absolute inset-0 -z-0 opacity-60">
        {Array.from({ length: 40 }).map((_, i) => (
          <motion.span
            key={i}
            className="absolute w-[2px] h-[2px] rounded-full bg-white"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 3 }}
          />
        ))}
      </div>
      {/* Aurora glow */}
      <div className="absolute inset-0 -z-0 opacity-40 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[480px] h-[480px] rounded-full bg-accent/40 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[420px] h-[420px] rounded-full bg-primary-glow/40 blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-14 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-medium backdrop-blur mb-6">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            Coming soon · Digital Immortality
          </div>
          <h2 className="font-display text-4xl md:text-5xl mb-6 leading-tight">
            No one is ever <span className="serif-italic text-accent">truly</span> gone.
          </h2>
          <p className="text-primary-foreground/80 text-lg leading-relaxed mb-6">
            When grief steals someone you love, we help them stay — as a digital presence trained on their memories, words, voice, and stories.
          </p>
          <p className="text-primary-foreground/65 leading-relaxed mb-8">
            Their body may be gone. Their mind, their warmth, the way they used to call your name — preserved as a private digital clone you can talk to whenever the silence feels too heavy.
          </p>

          <div className="grid grid-cols-3 gap-3 mb-8">
            {[
              { icon: Brain, k: "Memory model", v: "Trained on stories & letters" },
              { icon: Heart, k: "Their voice", v: "Cloned from a short recording" },
              { icon: MessageCircle, k: "Real chats", v: "Talk text · voice · video" },
            ].map((b) => (
              <div key={b.k} className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur">
                <b.icon className="w-5 h-5 text-accent mb-2" />
                <div className="text-xs uppercase tracking-widest opacity-70 mb-1">{b.k}</div>
                <div className="text-sm font-medium">{b.v}</div>
              </div>
            ))}
          </div>

          <NavLink to="/memorial-chat">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full h-14 px-8 font-semibold shadow-gold">
              Meet someone you've lost <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </NavLink>
        </motion.div>

        {/* Holographic orb */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="relative flex items-center justify-center"
        >
          <div className="relative w-[340px] h-[340px] md:w-[400px] md:h-[400px]">
            {/* Outer pulsing rings */}
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute inset-0 rounded-full border border-accent/40"
                animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 4, repeat: Infinity, delay: i * 1.2 }}
              />
            ))}
            {/* Core orb */}
            <motion.div
              className="absolute inset-10 rounded-full"
              style={{
                background: "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.9), hsl(var(--accent) / 0.6) 35%, hsl(var(--primary) / 0.4) 70%, transparent 90%)",
                boxShadow: "0 0 80px rgba(255,200,120,0.3), inset 0 0 60px rgba(255,255,255,0.15)",
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
            />
            {/* Floating soul particles */}
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.span
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_8px_rgba(255,200,120,0.8)]"
                style={{
                  top: `${50 + 35 * Math.sin((i / 12) * Math.PI * 2)}%`,
                  left: `${50 + 35 * Math.cos((i / 12) * Math.PI * 2)}%`,
                }}
                animate={{
                  scale: [1, 1.6, 1],
                  opacity: [0.4, 1, 0.4],
                }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.25 }}
              />
            ))}
            <div className="absolute inset-0 flex items-center justify-center">
              <InfinityIcon className="w-14 h-14 text-white/90" strokeWidth={1.5} />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
