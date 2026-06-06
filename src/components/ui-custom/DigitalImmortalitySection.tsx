import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Infinity as InfinityIcon, Sparkles, Brain, Heart, MessageCircle, ArrowRight, Waves } from "lucide-react";

export default function DigitalImmortalitySection() {
  return (
    <section className="py-32 relative overflow-hidden bg-investor text-primary-foreground">
      {/* Deep cosmic field */}
      <div className="absolute inset-0 -z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-investor via-investor to-black" />
        {/* Starfield */}
        {Array.from({ length: 80 }).map((_, i) => (
          <motion.span
            key={`star-${i}`}
            className="absolute rounded-full bg-white"
            style={{
              width: `${Math.random() * 2 + 0.5}px`,
              height: `${Math.random() * 2 + 0.5}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{ opacity: [0.1, 1, 0.1] }}
            transition={{ duration: 2 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 3 }}
          />
        ))}
        {/* Nebula glow */}
        <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] rounded-full bg-accent/20 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-primary-glow/30 blur-[120px]" />
        {/* Grid floor */}
        <div
          className="absolute inset-x-0 bottom-0 h-1/2 opacity-[0.08]"
          style={{
            backgroundImage: "linear-gradient(hsl(var(--accent)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--accent)) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            transform: "perspective(600px) rotateX(60deg)",
            transformOrigin: "bottom",
          }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-14 items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/30 text-xs font-medium backdrop-blur-xl mb-8"
            animate={{ boxShadow: ["0 0 0px hsl(var(--accent) / 0)", "0 0 24px hsl(var(--accent) / 0.4)", "0 0 0px hsl(var(--accent) / 0)"] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span className="uppercase tracking-[0.2em] text-accent">Coming Soon</span>
            <span className="opacity-50">·</span>
            <span>Digital Immortality</span>
          </motion.div>

          <h2 className="font-display text-4xl md:text-6xl mb-6 leading-[1.05] tracking-tight">
            No one is ever{" "}
            <span className="relative inline-block">
              <span className="serif-italic text-accent">truly</span>
              <motion.span
                className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent"
                animate={{ scaleX: [0, 1, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </span>{" "}
            gone.
          </h2>
          <p className="text-primary-foreground/80 text-lg leading-relaxed mb-6">
            When grief steals someone you love, we help them stay — as a digital presence trained on their memories, words, voice, and stories.
          </p>
          <p className="text-primary-foreground/60 leading-relaxed mb-10 text-sm">
            Their body may be gone. Their mind — preserved as a private clone you can talk to whenever the silence feels too heavy.
          </p>

          <div className="grid grid-cols-3 gap-3 mb-10">
            {[
              { icon: Brain, k: "Memory", v: "Stories & letters" },
              { icon: Heart, k: "Voice", v: "Cloned audio" },
              { icon: MessageCircle, k: "Talk", v: "Text · voice · video" },
            ].map((b, i) => (
              <motion.div
                key={b.k}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 * i }}
                className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl hover:border-accent/40 transition-colors"
              >
                <b.icon className="w-5 h-5 text-accent mb-2" />
                <div className="text-[10px] uppercase tracking-widest opacity-60 mb-1">{b.k}</div>
                <div className="text-sm font-medium">{b.v}</div>
              </motion.div>
            ))}
          </div>

          <NavLink to="/memorial-chat">
            <Button size="lg" className="group bg-accent hover:bg-accent/90 text-accent-foreground rounded-full h-14 px-8 font-semibold shadow-[0_0_40px_hsl(var(--accent)/0.4)]">
              Meet someone you've lost
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </NavLink>
        </motion.div>

        {/* Holographic orb — futuristic */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative flex items-center justify-center"
        >
          <div className="relative w-[360px] h-[360px] md:w-[440px] md:h-[440px]">
            {/* Outer scanning ring */}
            <motion.div
              className="absolute inset-0 rounded-full border border-accent/30"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-2 h-2 rounded-full bg-accent shadow-[0_0_16px_hsl(var(--accent))]" />
            </motion.div>
            <motion.div
              className="absolute inset-6 rounded-full border border-accent/20"
              animate={{ rotate: -360 }}
              transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-1.5 h-1.5 rounded-full bg-primary-glow shadow-[0_0_12px_hsl(var(--primary-glow))]" />
            </motion.div>

            {/* Pulsing rings */}
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="absolute inset-0 rounded-full border border-accent/40"
                animate={{ scale: [1, 1.5, 1], opacity: [0.7, 0, 0.7] }}
                transition={{ duration: 4, repeat: Infinity, delay: i * 1 }}
              />
            ))}

            {/* Core orb */}
            <motion.div
              className="absolute inset-16 rounded-full"
              style={{
                background:
                  "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.95), hsl(var(--accent) / 0.7) 30%, hsl(var(--primary) / 0.5) 65%, transparent 90%)",
                boxShadow:
                  "0 0 100px hsl(var(--accent) / 0.5), inset 0 0 80px rgba(255,255,255,0.2)",
              }}
              animate={{
                scale: [1, 1.05, 1],
                rotate: 360,
              }}
              transition={{
                scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 30, repeat: Infinity, ease: "linear" },
              }}
            />

            {/* Inner core glow */}
            <motion.div
              className="absolute inset-24 rounded-full bg-gradient-to-br from-white/60 via-accent/40 to-transparent blur-2xl"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
            />

            {/* Orbiting particles */}
            {Array.from({ length: 14 }).map((_, i) => (
              <motion.span
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_10px_hsl(var(--accent))]"
                style={{
                  top: "50%",
                  left: "50%",
                }}
                animate={{
                  x: [
                    Math.cos((i / 14) * Math.PI * 2) * 140,
                    Math.cos((i / 14) * Math.PI * 2 + Math.PI * 2) * 140,
                  ],
                  y: [
                    Math.sin((i / 14) * Math.PI * 2) * 140,
                    Math.sin((i / 14) * Math.PI * 2 + Math.PI * 2) * 140,
                  ],
                  scale: [1, 1.6, 1],
                  opacity: [0.4, 1, 0.4],
                }}
                transition={{
                  duration: 12,
                  repeat: Infinity,
                  ease: "linear",
                  delay: i * 0.2,
                }}
              />
            ))}

            {/* Data scanline */}
            <motion.div
              className="absolute inset-x-12 h-px bg-gradient-to-r from-transparent via-accent to-transparent"
              animate={{ top: ["20%", "80%", "20%"] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Center icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              >
                <InfinityIcon className="w-16 h-16 text-white drop-shadow-[0_0_20px_hsl(var(--accent))]" strokeWidth={1.25} />
              </motion.div>
            </div>

            {/* Floating labels */}
            {[
              { text: "MEMORY", angle: -30 },
              { text: "VOICE", angle: 90 },
              { text: "PRESENCE", angle: 210 },
            ].map((l, i) => (
              <motion.div
                key={l.text}
                className="absolute top-1/2 left-1/2 text-[10px] tracking-[0.3em] text-accent/80 font-mono"
                style={{
                  transform: `rotate(${l.angle}deg) translateX(180px) rotate(${-l.angle}deg) translate(-50%, -50%)`,
                }}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.8 }}
              >
                {l.text}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom waveform */}
      <div className="relative max-w-6xl mx-auto px-6 mt-16 flex items-center justify-center gap-1 opacity-40">
        {Array.from({ length: 60 }).map((_, i) => (
          <motion.span
            key={i}
            className="w-0.5 bg-accent rounded-full"
            animate={{ height: [4, 8 + Math.random() * 20, 4] }}
            transition={{ duration: 1 + Math.random(), repeat: Infinity, delay: i * 0.04 }}
          />
        ))}
      </div>
    </section>
  );
}
