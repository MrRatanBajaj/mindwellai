import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ElevenLabsPhoneCounselor from "@/components/ui-custom/ElevenLabsPhoneCounselor";
import AriaHinglishChat from "@/components/ui-custom/AriaHinglishChat";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ArrowLeft, PhoneIncoming, MessageCircle, Phone } from "lucide-react";
import { motion } from "framer-motion";
import {
  ARIA_PERSONA_LIST,
  ARIA_PERSONAS,
  type AriaPersonaId,
} from "@/lib/ariaPersonas";
import { useSEO } from "@/hooks/useSEO";

const PhoneCounselor = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [mode, setMode] = useState<"call" | "chat">("call");
  const [personaId, setPersonaId] = useState<AriaPersonaId>("general");
  const [callActive, setCallActive] = useState(false);
  const [callKey, setCallKey] = useState(0); // forces remount when persona changes mid-flow

  const agentId = params.get("agentId") || undefined;
  const name = params.get("name") || "Dr. Aria";
  const specialty = params.get("specialty") || "AI Mental Wellness Counselor — Hinglish";

  const persona = useMemo(() => ARIA_PERSONAS[personaId], [personaId]);

  useSEO({
    title: "Dr. Aria — Hinglish AI Counselor (Call + Chat) | WellMind AI",
    description:
      "Talk to Dr. Aria — a Hinglish AI mental wellness counselor. CBT, DBT, ACT, trauma-informed and mindfulness specialists. Private voice call or text chat, 24/7.",
    path: "/phone-counselor",
  });

  // Only auto-ring on first land in call mode
  useEffect(() => {
    if (mode !== "call") return;
    const t = setTimeout(() => setCallActive(true), 500);
    return () => clearTimeout(t);
  }, [mode]);

  const onPickPersona = (id: AriaPersonaId) => {
    setPersonaId(id);
    if (mode === "call") {
      setCallActive(false);
      setCallKey((k) => k + 1);
      setTimeout(() => setCallActive(true), 400);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-secondary/40 via-background to-background">
      <Header />
      <main className="flex-1 pt-28 pb-12 px-4">
        <div className="max-w-5xl mx-auto">
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
            className="text-center mb-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/20 text-accent-foreground text-xs font-medium mb-3">
              <PhoneIncoming className="w-3.5 h-3.5" /> Hinglish AI counselor · Private &amp; encrypted
            </div>
            <h1 className="font-display text-3xl md:text-4xl text-foreground mb-2">
              Aapki private baat <span className="serif-italic text-primary">{name}</span> ke saath
            </h1>
            <p className="text-muted-foreground text-sm max-w-xl mx-auto">
              Hindi, English ya Hinglish — jaisa comfortable lage waisa bolo. Voice call ya text chat,
              dono available hain. Specialist persona choose karo niche se.
            </p>
          </motion.div>

          {/* Persona selector */}
          <div className="mb-6">
            <p className="text-xs uppercase tracking-widest text-muted-foreground text-center mb-3">
              Choose your specialist
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
              {ARIA_PERSONA_LIST.map((p) => {
                const active = p.id === personaId;
                return (
                  <button
                    key={p.id}
                    onClick={() => onPickPersona(p.id)}
                    className={`rounded-2xl border px-3 py-3 text-left transition-all ${
                      active
                        ? "border-primary bg-primary/10 shadow-elegant"
                        : "border-border bg-card hover:border-primary/50"
                    }`}
                  >
                    <div className="text-xl mb-1">{p.emoji}</div>
                    <div className="text-xs font-semibold text-foreground leading-tight">
                      {p.label}
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-0.5 leading-snug line-clamp-2">
                      {p.tagline}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mode tabs */}
          <Tabs value={mode} onValueChange={(v) => setMode(v as "call" | "chat")} className="w-full">
            <TabsList className="grid grid-cols-2 max-w-sm mx-auto mb-6">
              <TabsTrigger value="call" className="gap-2">
                <Phone className="w-4 h-4" /> Voice Call
              </TabsTrigger>
              <TabsTrigger value="chat" className="gap-2">
                <MessageCircle className="w-4 h-4" /> Hinglish Chat
              </TabsTrigger>
            </TabsList>

            <TabsContent value="call" className="mt-0">
              <div className="max-w-md mx-auto">
                {callActive && (
                  <ElevenLabsPhoneCounselor
                    key={callKey}
                    agentId={agentId}
                    counselorName={name}
                    specialty={`${persona.emoji} ${persona.label}`}
                    personaPrompt={persona.prompt}
                    firstMessage={persona.firstMessage}
                    autoStart
                    onEnd={() => {
                      /* stay on page so user can call again */
                    }}
                  />
                )}
              </div>
            </TabsContent>

            <TabsContent value="chat" className="mt-0">
              <div className="max-w-2xl mx-auto">
                <AriaHinglishChat persona={persona} />
              </div>
            </TabsContent>
          </Tabs>

          <p className="text-center text-xs text-muted-foreground mt-6 max-w-md mx-auto">
            Crisis ke time turant call karo — iCall <strong>9152987821</strong> · Vandrevala{" "}
            <strong>1860-266-2345</strong> · KIRAN <strong>1800-599-0019</strong>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PhoneCounselor;
