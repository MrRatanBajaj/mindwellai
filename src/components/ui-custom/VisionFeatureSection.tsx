import { motion } from "framer-motion";
import { Phone, Video, BookHeart, Brain, Users, Sparkles } from "lucide-react";

// Lightweight, looped SVG-based "animations" — no heavy videos
const features = [
  {
    icon: Phone,
    title: "Phone-call counseling",
    desc: "A real ringing call. Pick up at 3 AM. Talk to Dr. Aria over a true voice line, powered by ElevenLabs.",
    tint: "from-emerald-400/30 to-emerald-600/10",
    accent: "text-emerald-500",
    Anim: PhoneRingAnim,
  },
  {
    icon: Video,
    title: "Face-to-face video",
    desc: "Real-face AI therapist via Tavus. Sessions auto-recorded for your private history.",
    tint: "from-sky-400/30 to-sky-600/10",
    accent: "text-sky-500",
    Anim: VideoWaveAnim,
  },
  {
    icon: BookHeart,
    title: "Journal that listens",
    desc: "Mood streaks, AI insights, gentle nudges. A private space that grows with you.",
    tint: "from-rose-400/30 to-rose-600/10",
    accent: "text-rose-500",
    Anim: HeartBeatAnim,
  },
  {
    icon: Brain,
    title: "Self-help library",
    desc: "12 guided exercises and 18+ NIMH / WHO / SAMHSA resources. Curated, not algorithmic.",
    tint: "from-violet-400/30 to-violet-600/10",
    accent: "text-violet-500",
    Anim: BrainBloomAnim,
  },
  {
    icon: Users,
    title: "Quiet community",
    desc: "Anonymous peer rooms within 5 km. Real humans who get it — moderated for safety.",
    tint: "from-amber-400/30 to-amber-600/10",
    accent: "text-amber-500",
    Anim: PeerRipple,
  },
  {
    icon: Sparkles,
    title: "Crisis safety net",
    desc: "Auto-detects distress signals. Connects to helplines and emergency video instantly.",
    tint: "from-pink-400/30 to-pink-600/10",
    accent: "text-pink-500",
    Anim: ShieldPulseAnim,
  },
];

export default function VisionFeatureSection() {
  return (
    <section className="py-24 relative">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">Our vision in motion</p>
          <h2 className="font-display text-4xl md:text-5xl text-foreground mb-4 text-balance">
            Six quiet ways we <span className="serif-italic text-primary">show up</span> for you.
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Not a chatbot. Not an app full of buttons. A calm, always-on companion shaped around how a real human asks for help.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="group relative overflow-hidden rounded-3xl bg-card border border-border hover-lift"
            >
              <div className={`relative h-40 bg-gradient-to-br ${f.tint} flex items-center justify-center overflow-hidden`}>
                <f.Anim />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-9 h-9 rounded-xl bg-background/80 border border-border flex items-center justify-center ${f.accent}`}>
                    <f.icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-display text-lg text-foreground">{f.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ Tiny inline animations (SVG + Framer Motion) ============ */

function PhoneRingAnim() {
  return (
    <div className="relative">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="absolute inset-0 rounded-full border-2 border-emerald-500/40"
          style={{ width: 80, height: 80, left: -40, top: -40 }}
          animate={{ scale: [1, 2, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.6 }}
        />
      ))}
      <motion.div
        animate={{ rotate: [-15, 15, -15, 0, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1.5 }}
        className="w-16 h-16 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/40"
      >
        <Phone className="w-7 h-7 text-white" />
      </motion.div>
    </div>
  );
}

function VideoWaveAnim() {
  return (
    <div className="flex items-end gap-1.5 h-20">
      {Array.from({ length: 9 }).map((_, i) => (
        <motion.div
          key={i}
          className="w-2 rounded-full bg-sky-500"
          animate={{ height: ["20%", "100%", "30%", "80%", "20%"] }}
          transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.1 }}
          style={{ minHeight: 8 }}
        />
      ))}
    </div>
  );
}

function HeartBeatAnim() {
  return (
    <motion.div
      animate={{ scale: [1, 1.18, 1, 1.1, 1] }}
      transition={{ duration: 1.4, repeat: Infinity }}
      className="text-rose-500"
    >
      <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 21s-7-4.35-9.5-9.5C.83 8.43 2.93 5 6.5 5c2.04 0 3.5 1 5.5 3 2-2 3.46-3 5.5-3 3.57 0 5.67 3.43 4 6.5C19 16.65 12 21 12 21z" />
      </svg>
    </motion.div>
  );
}

function BrainBloomAnim() {
  return (
    <div className="relative">
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        return (
          <motion.span
            key={i}
            className="absolute w-2.5 h-2.5 rounded-full bg-violet-500"
            style={{
              top: `${30 * Math.sin(angle)}px`,
              left: `${30 * Math.cos(angle)}px`,
            }}
            animate={{ scale: [0.5, 1.4, 0.5], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
          />
        );
      })}
      <Brain className="w-10 h-10 text-violet-600 relative" />
    </div>
  );
}

function PeerRipple() {
  return (
    <div className="relative flex items-center gap-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{ y: [-4, 4, -4] }}
          transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.2 }}
          className="w-10 h-10 rounded-full bg-amber-500/30 border-2 border-amber-500 flex items-center justify-center"
        >
          <Users className="w-4 h-4 text-amber-700" />
        </motion.div>
      ))}
    </div>
  );
}

function ShieldPulseAnim() {
  return (
    <motion.div
      animate={{ scale: [1, 1.12, 1] }}
      transition={{ duration: 1.8, repeat: Infinity }}
      className="relative"
    >
      <div className="absolute inset-0 rounded-full bg-pink-400/40 blur-2xl" />
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-pink-500 relative">
        <path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-4z" fill="currentColor" fillOpacity="0.15" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    </motion.div>
  );
}
