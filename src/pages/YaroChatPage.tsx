import YaroChat from "@/components/ui-custom/YaroChat";
import LandingNav from "@/components/layout/LandingNav";
import Header from "@/components/layout/Header";
import { useSEO } from "@/hooks/useSEO";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { ShieldCheck, Globe, Heart, Clock } from "lucide-react";
import yaroRobot from "@/assets/yaro-robot.png";

const assurances = [
  { icon: ShieldCheck, label: "Private", note: "Nothing is shared." },
  { icon: Globe, label: "Any language", note: "Type how you think." },
  { icon: Clock, label: "No waiting", note: "Yaro replies now." },
  { icon: Heart, label: "No judgement", note: "Say it messy." },
];

const YaroChatPage = () => {
  const { user, loading } = useAuth();
  useSEO({
    title: "Chat with Yaro — Free AI therapist | WellMindAI",
    description:
      "WhatsApp-style chat therapy with Yaro. Free, no signup. Multilingual. Trained on DSM-5, ICD-11, PHQ-9, GAD-7, PCL-5.",
    path: "/chat/yaro",
  });

  return (
    <div className="min-h-screen bg-background">
      {!loading && user ? <Header /> : <LandingNav />}

      {/* Calm gradient field — sage + sky, low arousal, high trust */}
      <main className="relative overflow-hidden pb-14 pt-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(60% 45% at 18% 12%, hsl(var(--primary) / 0.12), transparent 70%), radial-gradient(55% 40% at 85% 25%, hsl(var(--accent) / 0.12), transparent 70%)",
          }}
        />

        <div className="mx-auto grid max-w-6xl items-start gap-8 px-3 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          {/* Chat window */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="order-2 lg:order-1"
          >
            <YaroChat />
          </motion.div>

          {/* Companion rail */}
          <motion.aside
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="order-1 lg:order-2 lg:sticky lg:top-28"
          >
            <div className="rounded-[1.75rem] border border-foreground/10 bg-card/80 p-6 shadow-sm backdrop-blur-md">
              <div className="flex items-center gap-4">
                <motion.img
                  src={yaroRobot}
                  alt="Yaro, the WellMindAI companion"
                  width={816}
                  height={816}
                  loading="lazy"
                  className="h-24 w-24 shrink-0 object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.15)]"
                  animate={{ y: [0, -7, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                />
                <div>
                  <h1 className="font-display text-2xl leading-tight">Chat with Yaro</h1>
                  <p className="mt-1 text-sm text-foreground/70">
                    A steady companion who listens first and never rushes you.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                {assurances.map((a) => (
                  <div key={a.label} className="rounded-2xl bg-secondary/60 p-3">
                    <a.icon className="mb-1.5 h-4 w-4 text-primary" />
                    <p className="text-sm font-medium leading-tight">{a.label}</p>
                    <p className="text-xs text-muted-foreground">{a.note}</p>
                  </div>
                ))}
              </div>

              <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
                Yaro is supportive, not a replacement for emergency care. If you are in danger, please reach a local
                helpline right away.
              </p>
            </div>
          </motion.aside>
        </div>
      </main>
    </div>
  );
};

export default YaroChatPage;
