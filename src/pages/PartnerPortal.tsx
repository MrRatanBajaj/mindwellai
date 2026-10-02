import { useEffect, useRef, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageCircle, Mic, Video, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import BrandLogo from "@/components/layout/BrandLogo";
import YaroChat from "@/components/ui-custom/YaroChat";
import FreeVoiceSession from "@/components/ui-custom/FreeVoiceSession";
import LiveAvatarSession from "@/components/ui-custom/LiveAvatarSession";
import { useSEO } from "@/hooks/useSEO";
import { getPartnerBySlug, hexToHslTriplet, logPartnerSession, type PartnerBrand } from "@/lib/partners";

type Mode = "chat" | "voice" | "video";

const PartnerPortal = () => {
  const { slug = "" } = useParams();
  const [partner, setPartner] = useState<PartnerBrand | null>(null);
  const [state, setState] = useState<"loading" | "ok" | "missing">("loading");
  const [mode, setMode] = useState<Mode>("chat");
  const [live, setLive] = useState(false);
  const chatStartRef = useRef(Date.now());

  useEffect(() => {
    let alive = true;
    getPartnerBySlug(slug).then((p) => {
      if (!alive) return;
      setPartner(p);
      setState(p ? "ok" : "missing");
    });
    return () => { alive = false; };
  }, [slug]);

  // Count text chat time when the visitor leaves the page.
  useEffect(() => {
    if (!partner) return;
    chatStartRef.current = Date.now();
    const log = () => {
      const mins = (Date.now() - chatStartRef.current) / 60000;
      if (mins >= 0.5) logPartnerSession({ partnerId: partner.id, type: "chat", minutes: mins });
    };
    window.addEventListener("pagehide", log);
    return () => window.removeEventListener("pagehide", log);
  }, [partner]);

  const name = partner?.name ?? "Partner";
  useSEO({
    title: `${name} | Online AI Therapy & Mental Wellness Clinic - WellMind AI`,
    description: `Connect with ${name}'s official 24/7 AI-powered mental wellness companion. Safe, confidential, and instant support powered by WellMind AI.`,
    path: `/${slug}`,
  });

  if (state === "loading")
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  if (state === "missing" || !partner) return <Navigate to="/chat/yaro" replace />;

  const hsl = hexToHslTriplet(partner.primary_color);
  const welcome = `Welcome to ${partner.name}'s clinic portal on WellMind AI. I'm here to listen — take your time, speak in any language.`;
  const clinicPrompt = `You are supporting a patient of ${partner.name}. Mention ${partner.name} naturally when relevant.`;

  const endLive = (type: Mode) => (s: { seconds: number; phq9: number | null; gad7: number | null }) => {
    logPartnerSession({ partnerId: partner.id, type, minutes: s.seconds / 60, phq9: s.phq9, gad7: s.gad7 });
    setLive(false);
  };

  return (
    <div
      className="min-h-screen bg-background"
      style={{ ["--primary" as any]: hsl, ["--ring" as any]: hsl }}
    >
      <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <BrandLogo size={44} withText={false} />
            <span className="text-lg text-foreground/40">×</span>
            {partner.logo_url ? (
              <img src={partner.logo_url} alt={`${partner.name} logo`} className="h-10 w-10 rounded-xl border border-border bg-card object-contain p-1" />
            ) : (
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary font-display text-lg text-primary-foreground">
                {partner.name[0]}
              </span>
            )}
            <div className="min-w-0">
              <p className="truncate font-display text-base leading-tight sm:text-lg">{partner.name}</p>
              <p className="text-[11px] text-muted-foreground">Powered by WellMind AI</p>
            </div>
          </div>
          <span className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:inline-flex">
            <ShieldCheck className="h-3.5 w-3.5" /> confidential
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-3 pb-14 pt-24 sm:px-6">
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 rounded-[1.75rem] border border-primary/20 bg-primary/10 p-6 text-center"
        >
          <h1 className="font-display text-3xl text-foreground sm:text-4xl">Welcome to {partner.name} Support Portal</h1>
          <p className="mx-auto mt-2 max-w-xl text-sm text-foreground/70">
            {partner.tagline || "24/7 confidential support — chat, talk or see your counsellor face to face."}
          </p>
          <div className="mt-5 inline-flex rounded-full border border-border bg-card p-1">
            {([
              ["chat", MessageCircle, "Chat"],
              ["voice", Mic, "Voice"],
              ["video", Video, "Video"],
            ] as const).map(([m, Icon, label]) => (
              <button
                key={m}
                onClick={() => { setMode(m); setLive(false); }}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm transition-colors ${mode === m ? "bg-primary text-primary-foreground" : "text-foreground/70 hover:text-foreground"}`}
              >
                <Icon className="h-4 w-4" /> {label}
              </button>
            ))}
          </div>
        </motion.section>

        {mode === "chat" && <YaroChat />}

        {mode !== "chat" && !live && (
          <div className="mx-auto max-w-md rounded-[1.75rem] border border-border bg-card p-8 text-center">
            <p className="font-display text-2xl">{mode === "video" ? "Face-to-face session" : "Voice session"}</p>
            <p className="mt-2 text-sm text-muted-foreground">One tap — your counsellor greets you on behalf of {partner.name}.</p>
            <Button onClick={() => setLive(true)} className="mt-6 h-12 rounded-full px-7">
              {mode === "video" ? <Video className="mr-2 h-4 w-4" /> : <Mic className="mr-2 h-4 w-4" />} Start session
            </Button>
          </div>
        )}

        {mode === "voice" && live && (
          <FreeVoiceSession
            counselorName="Ava"
            voiceGender="female"
            language="auto"
            greeting={welcome}
            systemPrompt={clinicPrompt}
            onEnd={() => {
              logPartnerSession({ partnerId: partner.id, type: "voice", minutes: 1 });
              setLive(false);
            }}
          />
        )}

        {mode === "video" && live && (
          <LiveAvatarSession counselorId="ava" counselorName="Ava" greeting={welcome} systemPrompt={clinicPrompt} onEnd={endLive("video")} />
        )}
      </main>
    </div>
  );
};

export default PartnerPortal;
