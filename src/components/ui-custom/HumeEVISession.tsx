import { VoiceProvider, useVoice } from "@humeai/voice-react";
import { useEffect, useState } from "react";
import { Phone, PhoneOff, Mic, MicOff, Loader2, Heart, Sparkles, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  counselorName: string;
  systemPrompt?: string;
  voiceGender?: "male" | "female";
  onEnd?: () => void;
}

const Inner = ({
  counselorName,
  token,
  configId,
  systemPrompt,
  voiceGender,
  onEnd,
}: {
  counselorName: string;
  token: string;
  configId: string | null;
  systemPrompt?: string;
  voiceGender?: "male" | "female";
  onEnd?: () => void;
}) => {
  const {
    connect, disconnect, status, isMuted, mute, unmute,
    isPlaying, lastAssistantProsodyMessage,
  } = useVoice();
  const [duration, setDuration] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (hasStarted) return;
    setHasStarted(true);
    (async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        // Hume hosted voices: ITO (male, warm), KORA (female, soft)
        const voiceName = voiceGender === "male" ? "ITO" : "KORA";
        await connect({
          auth: { type: "accessToken", value: token },
          ...(configId ? { configId } : {}),
          sessionSettings: {
            type: "session_settings",
            ...(systemPrompt ? { systemPrompt } : {}),
            voice: { provider: "HUME_AI", name: voiceName },
          } as any,
        });
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Could not connect to Hume EVI");
      }
    })();
    return () => { disconnect(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (status.value !== "connected") return;
    const i = setInterval(() => setDuration((d) => d + 1), 1000);
    return () => clearInterval(i);
  }, [status.value]);

  const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const lastEmotion = (() => {
    const scores = lastAssistantProsodyMessage?.models?.prosody?.scores;
    if (!scores) return null;
    const top = Object.entries(scores).sort((a, b) => (b[1] as number) - (a[1] as number))[0];
    return top ? { name: top[0], score: Math.round((top[1] as number) * 100) } : null;
  })();

  const live = status.value === "connected";

  return (
    <div className="relative mx-auto max-w-md w-full rounded-[2rem] overflow-hidden bg-[#2A2522] text-[#F5EFE6] shadow-elegant">
      <div className="flex items-center justify-between px-6 pt-6 text-[11px] uppercase tracking-[0.18em] opacity-80">
        <span>Hume EVI · Emotion-aware</span>
        <span className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${live ? "bg-emerald-400 animate-pulse" : "bg-amber-400 animate-pulse"}`} />
          {live ? "Encrypted call" : status.value === "connecting" ? "Connecting…" : status.value === "error" ? "Error" : "Idle"}
        </span>
      </div>

      <div className="px-6 py-10 text-center">
        <p className="text-xs opacity-70 mb-1 tracking-widest uppercase">In session</p>
        <h2 className="font-display text-4xl mb-1">{counselorName}</h2>
        <p className="text-sm opacity-80 serif-italic">Voice-to-voice · 50+ vocal nuances</p>

        <div className="relative my-8 inline-block">
          <motion.div
            className="absolute inset-0 rounded-full bg-[#E8B8A8]/30"
            animate={isPlaying ? { scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] } : {}}
            transition={{ duration: 1.4, repeat: Infinity }}
          />
          <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-[#E8B8A8] to-[#c98b76] flex items-center justify-center">
            <Heart className="w-12 h-12 text-[#2A2522]" strokeWidth={1.6} />
          </div>
        </div>

        {live && <div className="text-3xl font-display tabular-nums mb-1">{fmt(duration)}</div>}
        {live && (
          <p className="text-xs opacity-75">{isPlaying ? `${counselorName} is speaking…` : "Listening to you"}</p>
        )}
        {lastEmotion && (
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5EFE6]/10 text-[11px]">
            <Sparkles className="w-3 h-3" />
            Detected: <span className="font-semibold capitalize">{lastEmotion.name}</span> · {lastEmotion.score}%
          </div>
        )}
        {status.value === "error" && (
          <p className="mt-3 text-xs text-destructive-foreground bg-destructive/30 rounded-lg px-3 py-2">
            {status.reason}
          </p>
        )}
      </div>

      <div className="px-8 pb-8 flex items-center justify-center gap-6">
        <button
          onClick={() => (isMuted ? unmute() : mute())}
          className="w-14 h-14 rounded-full bg-[#F5EFE6]/15 flex items-center justify-center hover:bg-[#F5EFE6]/25 transition"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
        </button>
        <button
          onClick={async () => { await disconnect(); onEnd?.(); }}
          className="w-20 h-20 rounded-full bg-destructive hover:bg-destructive/90 flex items-center justify-center shadow-lg"
          aria-label="End call"
        >
          {status.value === "connecting"
            ? <Loader2 className="w-8 h-8 animate-spin" />
            : <PhoneOff className="w-8 h-8 text-destructive-foreground" />}
        </button>
        <div className="w-14 h-14 rounded-full bg-[#F5EFE6]/15 flex items-center justify-center">
          <Phone className="w-6 h-6" />
        </div>
      </div>

      <div className="bg-[#F5EFE6]/10 px-6 py-3 flex items-center justify-center gap-2 text-[11px] opacity-80">
        <Shield className="w-3 h-3" /> Hume EVI · End-to-end encrypted
      </div>
    </div>
  );
};

const HumeEVISession = ({ counselorName, systemPrompt, voiceGender, onEnd }: Props) => {
  const [token, setToken] = useState<string | null>(null);
  const [configId, setConfigId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase.functions.invoke("hume-access-token");
        if (error || !data?.accessToken) throw new Error(data?.error ?? error?.message ?? "no token");
        setToken(data.accessToken);
        setConfigId(data.configId ?? null);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load Hume token");
      }
    })();
  }, []);

  if (error) {
    return (
      <div className="rounded-3xl p-8 bg-[#2A2522] text-[#F5EFE6] text-center max-w-md">
        <p className="font-display text-lg mb-2">Hume EVI unavailable</p>
        <p className="text-sm opacity-75">{error}</p>
      </div>
    );
  }
  if (!token) {
    return (
      <div className="rounded-3xl p-8 bg-[#2A2522] text-[#F5EFE6] text-center flex items-center justify-center gap-2 max-w-md">
        <Loader2 className="w-5 h-5 animate-spin" /> Connecting Hume EVI…
      </div>
    );
  }

  return (
    <VoiceProvider>
      <Inner
        counselorName={counselorName}
        token={token}
        configId={configId}
        systemPrompt={systemPrompt}
        voiceGender={voiceGender}
        onEnd={onEnd}
      />
    </VoiceProvider>
  );
};

export default HumeEVISession;
