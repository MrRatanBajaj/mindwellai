import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ElevenLabsPhoneCounselor from "@/components/ui-custom/ElevenLabsPhoneCounselor";
import { Button } from "@/components/ui/button";
import { ArrowLeft, PhoneIncoming } from "lucide-react";
import { motion } from "framer-motion";

const PhoneCounselor = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [active, setActive] = useState(false);

  const agentId = params.get("agentId") || undefined;
  const name = params.get("name") || "Dr. Aria";
  const specialty = params.get("specialty") || "AI Mental Wellness Counselor";

  // Auto-trigger the call after a short beat so user feels it "rings" them.
  useEffect(() => {
    const t = setTimeout(() => setActive(true), 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-secondary/40 via-background to-background">
      <Header />
      <main className="flex-1 pt-28 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6 gap-2 text-muted-foreground"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/20 text-accent-foreground text-xs font-medium mb-3">
              <PhoneIncoming className="w-3.5 h-3.5" /> Auto-connecting phone counselor
            </div>
            <h1 className="font-display text-3xl md:text-4xl text-foreground mb-2">
              Your private call with <span className="serif-italic text-primary">{name}</span>
            </h1>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              The line opens automatically. Speak naturally — the conversation is private and never stored as audio.
            </p>
          </motion.div>

          {active && (
            <ElevenLabsPhoneCounselor
              agentId={agentId}
              counselorName={name}
              specialty={specialty}
              autoStart
              onEnd={() => { /* stay on page so user can call again */ }}
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PhoneCounselor;
