import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Phone, Video, ArrowLeft, MoreVertical, Smile, Paperclip, Mic, Loader2, Check, CheckCheck, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

type Msg = { sender: "user" | "ai"; content: string; ts: number; status?: "sent" | "delivered" | "read" };

const QUICK_EMOJI = ["😊","🙏","😔","😢","😨","😡","❤️","💪","✨","🌧️","☀️","🫂"];

const LANGS = [
  { code: "auto", label: "Auto" },
  { code: "en", label: "EN" },
  { code: "hi", label: "हिं" },
  { code: "hinglish", label: "Hing" },
  { code: "ta", label: "த" },
  { code: "bn", label: "বাং" },
  { code: "es", label: "ES" },
];

const GREETINGS: Record<string, string> = {
  auto: "Hi, I'm Yaro. Type in any language — Hindi, English, Hinglish, Tamil, whatever feels natural. What's on your mind today? 🌿",
  en: "Hi, I'm Yaro. I'm here to listen — no judgement, no rush. What's on your mind today? 🌿",
  hi: "नमस्ते, मैं यारो हूँ। मैं यहाँ सुनने के लिए हूँ — कोई judgement नहीं। आज मन में क्या है? 🌿",
  hinglish: "Hey, main Yaro hoon. Tension free baat karo — koi judge nahi karega. Aaj kya chal raha hai mann mein? 🌿",
  ta: "வணக்கம், நான் Yaro. நான் கேட்க இங்கே இருக்கிறேன். இன்று மனதில் என்ன? 🌿",
  bn: "নমস্কার, আমি Yaro. আমি শুনতে এখানে আছি। আজ মনে কী চলছে? 🌿",
  es: "Hola, soy Yaro. Estoy aquí para escucharte — sin juicio. ¿Qué tienes en mente hoy? 🌿",
};

interface Props {
  embedded?: boolean; // when true, render compact (no full-screen header)
}

export default function YaroChat({ embedded = false }: Props) {
  const navigate = useNavigate();
  const [lang, setLang] = useState<string>("auto");
  const [messages, setMessages] = useState<Msg[]>([
    { sender: "ai", content: GREETINGS.auto, ts: Date.now(), status: "read" },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || sending) return;
    const userMsg: Msg = { sender: "user", content, ts: Date.now(), status: "sent" };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setSending(true);
    setShowEmoji(false);

    const langInstruction =
      lang === "auto"
        ? "Mirror the user's language exactly (Hindi/English/Hinglish/Tamil/Bengali/Spanish etc.)."
        : `Respond primarily in ${LANGS.find((l) => l.code === lang)?.label}.`;

    try {
      const { data, error } = await supabase.functions.invoke("ai-counselor", {
        body: {
          message: `${content}\n\n[LANG_HINT: ${langInstruction}]`,
          counselorId: "yaro",
          conversationHistory: next.slice(-12).map((m) => ({ sender: m.sender, content: m.content })),
        },
      });
      if (error) throw error;
      const reply = (data as any)?.response || (data as any)?.message || "I'm here. Tell me more.";
      // mark user msg delivered/read
      setMessages((m) => m.map((x) => (x === userMsg ? { ...x, status: "read" } : x)).concat({ sender: "ai", content: String(reply), ts: Date.now(), status: "read" }));
    } catch {
      setMessages((m) => [...m, { sender: "ai", content: "I'm here. Connection was slow — try once more, I'm not going anywhere. 🫂", ts: Date.now(), status: "read" }]);
    } finally {
      setSending(false);
    }
  };

  const fmtTime = (t: number) =>
    new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  // WhatsApp-ish chat background
  const bg = "bg-[#0b141a]";
  const wallpaper = {
    backgroundImage:
      "radial-gradient(circle at 25% 35%, rgba(56,142,142,0.08) 0, transparent 40%), radial-gradient(circle at 75% 75%, rgba(0,168,132,0.06) 0, transparent 40%)",
  } as const;

  return (
    <div className={`${embedded ? "rounded-3xl overflow-hidden shadow-2xl max-w-md mx-auto" : "min-h-screen"} flex flex-col ${bg}`}>
      {/* Top contact bar — WhatsApp style */}
      <div className="flex items-center gap-2 px-3 py-2.5 bg-[#202c33] text-white">
        {!embedded && (
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-700 flex items-center justify-center font-display text-lg shadow-md">Y</div>
          <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#202c33]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium leading-tight truncate">Yaro · WellMindAI</div>
          <div className="text-[11px] text-emerald-400 leading-tight">online · types in your language</div>
        </div>
        <button
          onClick={() => navigate("/consultation/video")}
          className="p-2.5 hover:bg-white/10 rounded-full"
          aria-label="Video call"
        >
          <Video className="w-5 h-5" />
        </button>
        <button
          onClick={() => navigate("/consultation/audio")}
          className="p-2.5 hover:bg-white/10 rounded-full"
          aria-label="Voice call"
        >
          <Phone className="w-5 h-5" />
        </button>
        <button className="p-2.5 hover:bg-white/10 rounded-full" aria-label="More">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* Language strip */}
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#111b21] border-b border-white/5 overflow-x-auto">
        <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        {LANGS.map((l) => (
          <button
            key={l.code}
            onClick={() => {
              setLang(l.code);
              setMessages((m) => [...m, { sender: "ai", content: GREETINGS[l.code] ?? GREETINGS.auto, ts: Date.now(), status: "read" }]);
            }}
            className={`text-[11px] px-2.5 h-6 rounded-full whitespace-nowrap transition ${
              lang === l.code ? "bg-emerald-500 text-white" : "bg-white/5 text-white/70 hover:bg-white/10"
            }`}
          >
            {l.label}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        style={wallpaper}
        className={`flex-1 overflow-y-auto px-3 py-4 space-y-1.5 ${embedded ? "h-[420px]" : ""}`}
      >
        <div className="text-center my-2">
          <span className="text-[10px] uppercase tracking-widest bg-[#182229] text-white/60 px-3 py-1 rounded-md">
            End-to-end private · Today
          </span>
        </div>
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.18 }}
              className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`relative max-w-[78%] px-3 py-2 text-[14.5px] leading-snug shadow-sm whitespace-pre-wrap break-words ${
                  m.sender === "user"
                    ? "bg-[#005c4b] text-white rounded-2xl rounded-tr-sm"
                    : "bg-[#202c33] text-white rounded-2xl rounded-tl-sm"
                }`}
              >
                {m.content}
                <div className="flex items-center justify-end gap-1 mt-1 -mb-0.5">
                  <span className="text-[10px] text-white/55">{fmtTime(m.ts)}</span>
                  {m.sender === "user" && (
                    m.status === "read"
                      ? <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />
                      : <Check className="w-3.5 h-3.5 text-white/55" />
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {sending && (
          <div className="flex justify-start">
            <div className="bg-[#202c33] text-white/70 px-3 py-2 rounded-2xl rounded-tl-sm text-sm flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Yaro is typing…
            </div>
          </div>
        )}
      </div>

      {/* Emoji strip */}
      {showEmoji && (
        <div className="px-3 py-2 bg-[#1f2c33] border-t border-white/5 flex gap-2 overflow-x-auto">
          {QUICK_EMOJI.map((e) => (
            <button
              key={e}
              onClick={() => setInput((v) => v + e)}
              className="text-2xl hover:scale-125 transition-transform"
            >
              {e}
            </button>
          ))}
        </div>
      )}

      {/* Composer */}
      <div className="flex items-end gap-2 px-2 py-2 bg-[#202c33]">
        <button
          onClick={() => setShowEmoji((s) => !s)}
          className="p-2.5 text-white/70 hover:text-white"
          aria-label="Emoji"
        >
          <Smile className="w-6 h-6" />
        </button>
        <button className="p-2.5 text-white/70 hover:text-white" aria-label="Attach">
          <Paperclip className="w-5 h-5" />
        </button>
        <div className="flex-1 bg-[#2a3942] rounded-3xl px-4 py-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            rows={1}
            placeholder="Message — any language…"
            className="w-full bg-transparent resize-none text-white placeholder:text-white/40 text-[15px] outline-none max-h-32"
          />
        </div>
        {input.trim() ? (
          <button
            onClick={() => send()}
            disabled={sending}
            className="w-11 h-11 rounded-full bg-emerald-500 hover:bg-emerald-600 flex items-center justify-center text-white shrink-0 disabled:opacity-50"
            aria-label="Send"
          >
            <Send className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={() => navigate("/consultation/audio")}
            className="w-11 h-11 rounded-full bg-emerald-500 hover:bg-emerald-600 flex items-center justify-center text-white shrink-0"
            aria-label="Voice"
          >
            <Mic className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="text-[10px] text-white/40 text-center py-1.5 bg-[#0b141a]">
        Trained on DSM-5 · ICD-11 · PHQ-9 · GAD-7 · PCL-5 · Crisis? Call iCall 9152987821
      </div>
    </div>
  );
}
