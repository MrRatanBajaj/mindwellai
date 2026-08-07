import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Mic, MicOff, PhoneOff, Loader2, Volume2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

/**
 * Free, open-standard voice therapy.
 * Speech-in  : Web Speech API (SpeechRecognition) — no key, runs in browser.
 * Brain      : ai-counselor edge function (multi-model fallback).
 * Speech-out : SpeechSynthesis with a gendered voice pick — no key, no credits.
 */

interface Props {
  counselorName: string;
  voiceGender: "male" | "female";
  language: string; // BCP-47-ish code or "auto"
  systemPrompt?: string;
  onEnd?: () => void;
}

const LOCALE: Record<string, string> = {
  auto: "en-IN",
  en: "en-IN",
  hi: "hi-IN",
  hinglish: "en-IN",
  ta: "ta-IN",
  bn: "bn-IN",
  mr: "mr-IN",
  es: "es-ES",
};

type Turn = { who: "you" | "them"; text: string };

const FreeVoiceSession = ({ counselorName, voiceGender, language, systemPrompt, onEnd }: Props) => {
  const [supported, setSupported] = useState(true);
  const [listening, setListening] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [muted, setMuted] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [interim, setInterim] = useState("");
  const recogRef = useRef<any>(null);
  const historyRef = useRef<{ sender: "user" | "ai"; content: string }[]>([]);
  const activeRef = useRef(true);

  const locale = LOCALE[language] ?? "en-IN";

  const speak = useCallback(
    (text: string) =>
      new Promise<void>((resolve) => {
        if (!("speechSynthesis" in window)) return resolve();
        const u = new SpeechSynthesisUtterance(text);
        const voices = window.speechSynthesis.getVoices();
        const wanted = voiceGender === "male" ? /male|ravi|daniel|alex|rishi|george/i : /female|kalpana|samantha|veena|zira|karen/i;
        const byLang = voices.filter((v) => v.lang?.toLowerCase().startsWith(locale.slice(0, 2)));
        const pool = byLang.length ? byLang : voices;
        u.voice = pool.find((v) => wanted.test(v.name)) ?? pool[voiceGender === "male" ? 0 : pool.length - 1] ?? null;
        u.lang = locale;
        u.rate = 0.95;
        u.pitch = voiceGender === "male" ? 0.9 : 1.08;
        u.onend = () => resolve();
        u.onerror = () => resolve();
        setSpeaking(true);
        window.speechSynthesis.speak(u);
      }).then(() => setSpeaking(false)),
    [voiceGender, locale],
  );

  const respond = useCallback(
    async (userText: string) => {
      setThinking(true);
      historyRef.current = [...historyRef.current, { sender: "user", content: userText }].slice(-12);
      let reply = "I'm here with you. Tell me more.";
      try {
        const { data } = await supabase.functions.invoke("ai-counselor", {
          body: {
            message: `${userText}\n\n[VOICE_MODE: reply in 2-3 short spoken sentences. ${systemPrompt ?? ""}]`,
            counselorId: voiceGender === "male" ? "yaro" : "ava",
            conversationHistory: historyRef.current,
          },
        });
        reply = String((data as any)?.response || (data as any)?.message || reply);
      } catch {
        reply = "I'm still here. Say that again for me?";
      }
      historyRef.current = [...historyRef.current, { sender: "ai", content: reply }].slice(-12);
      setTurns((t) => [...t, { who: "them", text: reply }]);
      setThinking(false);
      await speak(reply);
    },
    [speak, systemPrompt, voiceGender],
  );

  // Set up recognition
  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      setSupported(false);
      return;
    }
    const recog = new SR();
    recog.continuous = true;
    recog.interimResults = true;
    recog.lang = locale;
    recog.onresult = (e: any) => {
      let final = "";
      let partial = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) final += r[0].transcript;
        else partial += r[0].transcript;
      }
      setInterim(partial);
      if (final.trim()) {
        setInterim("");
        setTurns((t) => [...t, { who: "you", text: final.trim() }]);
        respond(final.trim());
      }
    };
    recog.onend = () => {
      if (activeRef.current && !muted) {
        try { recog.start(); } catch { /* already started */ }
      } else setListening(false);
    };
    recog.onerror = () => setListening(false);
    recogRef.current = recog;
    activeRef.current = true;
    try {
      recog.start();
      setListening(true);
    } catch { /* noop */ }

    // greeting
    speak(`Hi, I'm ${counselorName}. I'm listening. Take your time.`);

    return () => {
      activeRef.current = false;
      try { recog.stop(); } catch { /* noop */ }
      window.speechSynthesis?.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    try {
      if (next) recogRef.current?.stop();
      else { recogRef.current?.start(); setListening(true); }
    } catch { /* noop */ }
  };

  const end = () => {
    activeRef.current = false;
    try { recogRef.current?.stop(); } catch { /* noop */ }
    window.speechSynthesis?.cancel();
    onEnd?.();
  };

  const mmss = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  if (!supported) {
    return (
      <div className="max-w-md w-full rounded-[2rem] bg-card border border-border p-8 text-center">
        <AlertTriangle className="w-10 h-10 text-primary mx-auto mb-3" />
        <h3 className="font-display text-2xl mb-2">Voice needs Chrome or Edge</h3>
        <p className="text-foreground/70 text-sm mb-5">
          Your browser doesn't support live speech. Open WellMindAI in Chrome, Edge or Android — or keep talking by text.
        </p>
        <Button asChild className="rounded-full"><a href="/chat/yaro">Continue by text</a></Button>
      </div>
    );
  }

  return (
    <div className="max-w-md w-full rounded-[2rem] bg-card border border-border shadow-elegant p-8 text-center">
      <div className="relative mx-auto w-36 h-36 mb-6">
        <motion.span
          className="absolute inset-0 rounded-full bg-primary/20"
          animate={{ scale: speaking ? [1, 1.25, 1] : listening ? [1, 1.1, 1] : 1, opacity: [0.6, 0.2, 0.6] }}
          transition={{ duration: speaking ? 1.1 : 2.4, repeat: Infinity }}
        />
        <div className="absolute inset-4 rounded-full bg-primary/90 flex items-center justify-center text-primary-foreground font-display text-4xl">
          {counselorName[0]}
        </div>
      </div>

      <h3 className="font-display text-2xl text-foreground">{counselorName}</h3>
      <p className="text-sm text-foreground/60 mt-1 flex items-center justify-center gap-2">
        {thinking ? (<><Loader2 className="w-3.5 h-3.5 animate-spin" /> thinking…</>)
          : speaking ? (<><Volume2 className="w-3.5 h-3.5" /> speaking…</>)
          : listening ? "listening…" : muted ? "mic off" : "paused"}
        <span className="tabular-nums text-foreground/40">· {mmss}</span>
      </p>

      <div className="mt-5 min-h-[64px] rounded-2xl bg-secondary/60 border border-border p-3 text-sm text-foreground/80 text-left">
        {interim && <p className="italic text-foreground/50">{interim}</p>}
        {[...turns].slice(-2).map((t, i) => (
          <p key={i} className={t.who === "you" ? "text-foreground/60" : "text-foreground"}>
            <b>{t.who === "you" ? "You" : counselorName}:</b> {t.text}
          </p>
        ))}
        {!turns.length && !interim && <p className="text-foreground/50">Just start talking — in any language.</p>}
      </div>

      <div className="mt-6 flex items-center justify-center gap-3">
        <Button onClick={toggleMute} variant="outline" size="icon" className="h-14 w-14 rounded-full">
          {muted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </Button>
        <Button onClick={end} size="icon" className="h-14 w-14 rounded-full bg-destructive hover:bg-destructive/90">
          <PhoneOff className="w-5 h-5" />
        </Button>
      </div>
      <p className="mt-4 text-[11px] text-foreground/45">
        Free open-standard voice · nothing recorded · crisis? Tele-MANAS 14416
      </p>
    </div>
  );
};

export default FreeVoiceSession;
