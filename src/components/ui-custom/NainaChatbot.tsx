import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircleHeart, X, Send, Loader2, Image as ImageIcon, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Msg = { role: "user" | "assistant"; content: string; image?: string };

const STORAGE = "naina-chat-v1";
const GREETING: Msg = {
  role: "assistant",
  content:
    "Hi, I'm Naina 🌿 — your gentle AI psychologist. Tell me what's on your mind today. You can also drop an image (a journal page, a moment, anything) and we'll talk about it together.",
};

export default function NainaChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE);
      if (raw) {
        const parsed = JSON.parse(raw) as Msg[];
        if (Array.isArray(parsed) && parsed.length) setMessages(parsed);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE, JSON.stringify(messages.slice(-30)));
    } catch {}
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const pickImage = (file: File) => {
    if (file.size > 4 * 1024 * 1024) {
      toast.error("Image too large (max 4MB).");
      return;
    }
    const r = new FileReader();
    r.onload = () => setImage(r.result as string);
    r.readAsDataURL(file);
  };

  const send = async () => {
    const text = input.trim();
    if (!text && !image) return;
    const userMsg: Msg = { role: "user", content: text || "(shared an image)", image: image || undefined };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput("");
    setImage(null);
    setBusy(true);
    try {
      const { data, error } = await supabase.functions.invoke("naina-chat", {
        body: {
          messages: history.slice(-12).map((m) => ({
            role: m.role,
            content: m.content,
            image: m.image,
          })),
        },
      });
      if (error) throw error;
      const reply: string = data?.reply || "I'm here. Could you say a bit more?";
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch (e: any) {
      console.error(e);
      const msg = String(e?.message || "");
      if (msg.includes("429")) toast.error("Naina is resting — too many requests. Try again in a minute.");
      else if (msg.includes("402")) toast.error("AI credits exhausted. Please top up Lovable AI.");
      else toast.error("Couldn't reach Naina. Try again.");
      setMessages((m) => [...m, { role: "assistant", content: "I'm having trouble responding right now. Please try again in a moment." }]);
    } finally {
      setBusy(false);
    }
  };

  const onKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <>
      {/* Floating launcher */}
      <motion.button
        aria-label="Chat with Naina"
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-5 right-5 z-[90] w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-elegant flex items-center justify-center"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircleHeart className="w-6 h-6" />}
        {!open && (
          <span className="absolute inset-0 rounded-full bg-primary/40 animate-ping -z-10" />
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 220, damping: 24 }}
            className="fixed bottom-24 right-5 z-[90] w-[min(380px,calc(100vw-2rem))] h-[min(560px,calc(100vh-7rem))] rounded-3xl bg-card border border-border shadow-elegant flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-4 py-3 bg-gradient-to-br from-primary/15 via-accent/10 to-transparent border-b border-border flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="font-display text-base text-foreground leading-tight">Naina</div>
                <div className="text-[11px] text-muted-foreground">AI psychologist · CBT · DBT · trauma-informed</div>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-3 bg-background/50">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap ${
                      m.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-secondary text-foreground rounded-bl-md"
                    }`}
                  >
                    {m.image && (
                      <img src={m.image} alt="shared" className="rounded-xl mb-2 max-h-40 object-cover" />
                    )}
                    {m.content}
                  </div>
                </div>
              ))}
              {busy && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground px-2">
                  <Loader2 className="w-3 h-3 animate-spin" /> Naina is thinking…
                </div>
              )}
            </div>

            {/* Composer */}
            <div className="border-t border-border p-2.5 bg-card">
              {image && (
                <div className="relative inline-block mb-2">
                  <img src={image} alt="preview" className="h-16 rounded-lg" />
                  <button
                    aria-label="Remove image"
                    onClick={() => setImage(null)}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-foreground text-background flex items-center justify-center"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              <div className="flex items-end gap-2">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => e.target.files?.[0] && pickImage(e.target.files[0])}
                />
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => fileRef.current?.click()}
                  aria-label="Attach image"
                  className="shrink-0"
                >
                  <ImageIcon className="w-4 h-4" />
                </Button>
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKey}
                  placeholder="Tell Naina how you feel…"
                  rows={1}
                  className="min-h-[40px] max-h-32 resize-none text-sm"
                />
                <Button size="icon" onClick={send} disabled={busy || (!input.trim() && !image)} aria-label="Send">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1.5 px-1">
                Naina is supportive AI — not a replacement for crisis care. If you're in danger, call iCall 9152987821.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
