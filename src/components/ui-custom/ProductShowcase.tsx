import { motion } from "framer-motion";
import { MessageCircle, BookHeart, Video, Sparkles, LineChart } from "lucide-react";
import chatShot from "@/assets/product-shot-chat.jpg";
import journalShot from "@/assets/product-shot-journal.jpg";
import videoShot from "@/assets/product-shot-video.jpg";
import selfhelpShot from "@/assets/product-shot-selfhelp.jpg";
import dashboardShot from "@/assets/product-shot-dashboard.jpg";

const features = [
  {
    img: chatShot,
    icon: MessageCircle,
    tag: "Talk anytime",
    title: "Chat with Aria, 24/7",
    desc: "Vent at 3 AM. No judgment, no waiting list. Aria listens like a friend who actually gets it.",
    outcome: "Feel heard within seconds.",
    accent: "from-sky-400/20 to-emerald-300/10",
  },
  {
    img: journalShot,
    icon: BookHeart,
    tag: "60-second check-in",
    title: "Daily mood journal",
    desc: "Pick an emotion, slide your energy, jot a line. We turn it into patterns you can actually see.",
    outcome: "Spot your triggers in 7 days.",
    accent: "from-rose-300/20 to-violet-300/10",
  },
  {
    img: videoShot,
    icon: Video,
    tag: "Face-to-face",
    title: "Video sessions with AI specialists",
    desc: "23 trained counselors — from teen support to grief. Same eye-contact warmth, fraction of the cost.",
    outcome: "Therapy that fits in ₹149.",
    accent: "from-amber-300/20 to-orange-300/10",
  },
  {
    img: selfhelpShot,
    icon: Sparkles,
    tag: "Do it yourself",
    title: "Self-help library",
    desc: "Breathing, CBT, sleep resets — bite-sized exercises curated from NIMH, WHO and SAMHSA.",
    outcome: "Calm in under 5 minutes.",
    accent: "from-emerald-300/20 to-lime-300/10",
  },
  {
    img: dashboardShot,
    icon: LineChart,
    tag: "See your progress",
    title: "Your mind, on a dashboard",
    desc: "Streaks, mood trends, weekly insights — proof that your effort is actually working.",
    outcome: "Watch yourself heal, week by week.",
    accent: "from-violet-300/20 to-indigo-300/10",
  },
];

export default function ProductShowcase() {
  return (
    <section className="py-24 bg-gradient-to-b from-background via-secondary/20 to-background overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">
            See it in 10 seconds
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-foreground mb-4 text-balance">
            Five screens. <span className="serif-italic text-primary">One calmer you.</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
            A peek inside WellMindAI — every screen designed to make a hard day feel a little lighter.
          </p>
        </div>

        <div className="space-y-24 md:space-y-32">
          {features.map((f, i) => {
            const reverse = i % 2 === 1;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7 }}
                className={`grid md:grid-cols-2 gap-10 md:gap-16 items-center ${
                  reverse ? "md:[&>*:first-child]:order-2" : ""
                }`}
              >
                {/* Phone image with creative backdrop */}
                <div className="relative">
                  <div
                    className={`absolute inset-0 rounded-[3rem] bg-gradient-to-br ${f.accent} blur-3xl scale-90`}
                    aria-hidden
                  />
                  <motion.div
                    whileHover={{ y: -8, rotate: reverse ? -1.5 : 1.5 }}
                    transition={{ type: "spring", stiffness: 200, damping: 18 }}
                    className="relative mx-auto max-w-xs md:max-w-sm"
                  >
                    <div className="absolute -inset-4 rounded-[2.5rem] bg-card/40 backdrop-blur-xl border border-border/40 shadow-elegant -z-10" />
                    <img
                      src={f.img}
                      alt={f.title}
                      width={800}
                      height={1024}
                      loading="lazy"
                      className="w-full h-auto rounded-[2rem] shadow-2xl"
                    />
                    <div className="absolute -top-4 -right-4 w-14 h-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-elegant">
                      <f.icon className="w-6 h-6" />
                    </div>
                  </motion.div>
                </div>

                {/* Copy side */}
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] uppercase tracking-widest font-semibold mb-4">
                    {f.tag}
                  </div>
                  <h3 className="font-display text-3xl md:text-4xl text-foreground mb-4 leading-tight">
                    {f.title}
                  </h3>
                  <p className="text-muted-foreground text-lg leading-relaxed mb-5">{f.desc}</p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border/60">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">{f.outcome}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
