import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Video, Phone, ArrowRight, Shield, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useSEO } from "@/hooks/useSEO";

const Consultation = () => {
  const navigate = useNavigate();
  useSEO({
    title: "Talk to a counselor — WellMind AI",
    description: "Choose video therapy or an audio call with Yaro or Ava. Instant, private, encrypted.",
    path: "/consultation",
  });

  const cards = [
    {
      to: "/consultation/video",
      icon: Video,
      title: "Video therapy",
      sub: "face-to-face with Yaro or Ava",
      bg: "bg-pastel-sage",
      tilt: "-0.7deg",
    },
    {
      to: "/consultation/audio",
      icon: Phone,
      title: "Audio call",
      sub: "voice only — eyes closed, just talk",
      bg: "bg-pastel-peach",
      tilt: "0.7deg",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24 pb-12">
        <section className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="font-hand text-3xl text-primary mb-2">say hi.</p>
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-balance">
              How do you want to <span className="hand-underline">talk today?</span>
            </h1>
            <p className="text-foreground/70 mt-4 max-w-md mx-auto">
              Two ways in. Both private. Both start instantly.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {cards.map((c, i) => (
              <motion.button
                key={c.to}
                onClick={() => navigate(c.to)}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.12 }}
                className={`pastel-card hover-lift ${c.bg} text-left`}
                style={{ transform: `rotate(${c.tilt})` }}
              >
                <div className="flex flex-col items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-card border-[3px] border-foreground/80 shadow-pencil flex items-center justify-center">
                    <c.icon className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="font-display text-3xl font-semibold">{c.title}</h2>
                    <p className="font-hand text-2xl text-primary mt-1">{c.sub}</p>
                  </div>
                  <span className="mt-2 inline-flex items-center gap-2 text-sm font-semibold">
                    open <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </motion.button>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-foreground/70">
            <span className="inline-flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> Encrypted</span>
            <span className="inline-flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" /> Starts instantly</span>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Consultation;
