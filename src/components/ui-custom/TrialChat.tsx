import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Clock, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

type Msg = { sender: "user" | "ai"; content: string };

const TRIAL_SECONDS = 120;
const STORAGE_KEY = "wm_trial_chat_started_at";

const seedByLang: Record<string, string> = {
  auto: "I'm here. Whatever you want to say — in any language — say it. I'll understand.",
  en: "I'm here. Whatever's on your mind, say it. I'm listening.",
  hi: "मैं यहाँ हूँ। जो भी मन में है, कहो। मैं सुन रहा हूँ।",
  hinglish: "Main yahin hoon. Jo bhi mann mein hai, bata do. Koi judge nahi karega.",
};

export default function TrialChat() {
  const [messages, setMessages] = useState<Msg[]>([
    { sender: "ai", content: seedByLang.auto },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [started, setStarted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Resume an existing trial window if any
  useEffect(() => {
    const startedAt = localStorage.getItem(STORAGE_KEY);
    if (startedAt) {
      const elapsed = Math.floor((Date.now() - Number(startedAt)) / 1000);
      const left = Math.max(0, TRIAL_SECONDS - elapsed);
      if (left > 0) {
        setStarted(true);
        setSecondsLeft(left);
      } else {
        setSecondsLeft(0);
        setStarted(true);
      }
    }
  }, []);

  useEffect(() => {
    if (!started || secondsLeft === null || secondsLeft <= 0) return;
    const t = setInterval(() => setSecondsLeft((s) => (s === null ? s : Math.max(0, s - 1))), 1000);
    return () => clearInterval(t);
  }, [started, secondsLeft]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  const expired = secondsLeft === 0;

  const send = async () => {
    if (!input.trim() || sending || expired) return;
    const userMsg: Msg = { sender: "user", content: input.trim() };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setSending(true);

    if (!started) {
      localStorage.setItem(STORAGE_KEY, String(Date.now()));
      setStarted(true);
      setSecondsLeft(TRIAL_SECONDS);
    }

    try {
      const { data, error } = await supabase.functions.invoke("ai-counselor", {
        body: {
          message: userMsg.content,
          counselorId: "emma",
          conversationHistory: next.slice(-10).map((m) => ({ sender: m.sender, content: m.content })),
        },
      });
      if (error) throw error;
      const reply = (data as any)?.response || (data as any)?.message || "I'm here with you. Tell me more.";
      setMessages((m) => [...m, { sender: "ai", content: String(reply) }]);
    } catch {
      setMessages((m) => [
        ...m,
        { sender: "ai", content: "I'm here. (Connection slow — try once more, I'm not going anywhere.)" },
      ]);
    } finally {
      setSending(false);
    }
  };

  const mm = secondsLeft !== null ? String(Math.floor(secondsLeft / 60)).padStart(1, "0") : "2";
  const ss = secondsLeft !== null ? String(secondsLeft % 60).padStart(2, "0") : "00";

  return (
    <div className="w-full max-w-xl mx-auto rounded-3xl bg-card/90 backdrop-blur-md border border-border/60 shadow-elegant overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-border/50 bg-background/40">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-60 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          <span className="text-xs font-medium text-foreground/80">Someone is listening · No signup</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs tabular-nums text-muted-foreground">
          <Clock className="w-3.5 h-3.5" />
          {mm}:{ss} free
        </div>
      </div>

      <div ref={scrollRef} className="px-5 py-5 h-72 overflow-y-auto space-y-3">
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  m.sender === "user"
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-secondary text-foreground rounded-bl-sm"
                }`}
              >
                {m.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {sending && (
          <div className="flex justify-start">
            <div className="px-4 py-2.5 rounded-2xl bg-secondary text-muted-foreground text-sm flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> typing…
            </div>
          </div>
        )}
      </div>

      {expired ? (
        <div className="p-5 border-t border-border/50 bg-secondary/40 text-center space-y-3">
          <p className="text-sm text-foreground">
            Your 2 free minutes are up — but the chair stays. Keep talking, free for 3 days.
          </p>
          <NavLink to="/auth">
            <Button className="rounded-full px-6">
              Continue free for 3 days <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </NavLink>
        </div>
      ) : (
        <div className="p-3 border-t border-border/50 flex items-end gap-2 bg-background/40">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            placeholder="Type in any language — Hindi, English, Hinglish, Tamil…"
            rows={1}
            className="flex-1 resize-none bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground/70 max-h-28"
          />
          <Button onClick={send} disabled={!input.trim() || sending} size="icon" className="rounded-full shrink-0">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      )}

      <div className="px-5 py-2.5 text-[10px] text-muted-foreground bg-background/30 border-t border-border/40 text-center">
        Private · Encrypted · If you're in crisis, please call iCall 9152987821
      </div>
    </div>
  );
}
