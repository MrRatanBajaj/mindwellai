import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

type Msg = { role: "user" | "assistant"; content: string };

const STORAGE_KEY = "wm_inbound_chat";

const InboundChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [token] = useState(() => {
    const t = localStorage.getItem(STORAGE_KEY + ":token") ?? crypto.randomUUID();
    localStorage.setItem(STORAGE_KEY + ":token", t);
    return t;
  });
  const [messages, setMessages] = useState<Msg[]>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY + ":msgs") ?? "[]"); } catch { return []; }
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + ":msgs", JSON.stringify(messages));
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{
        role: "assistant",
        content: "Hi! I'm Mira from WellMindAI 🌱. Pricing, free trial, ya counselor booking — kuch bhi pooch lo.",
      }]);
    }
  }, [open]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("inbound-sales-chat", {
        body: { session_token: token, message: text, history: messages },
      });
      if (error) throw error;
      setMessages([...next, { role: "assistant", content: data?.reply ?? "..." }]);
    } catch (e: any) {
      setMessages([...next, { role: "assistant", content: "Sorry, thoda issue aaya. Aap directly try kar sakte hain: wellmindai.in/dashboard" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-4 md:right-6 z-50 w-[92vw] max-w-sm h-[520px] bg-card border border-border rounded-3xl shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-border bg-gradient-to-r from-primary/10 to-accent/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-primary font-bold text-sm">M</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Mira</p>
                  <p className="text-xs text-muted-foreground">WellMindAI concierge</p>
                </div>
              </div>
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-background/50">
              {messages.map((m, i) => (
                <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                  <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-secondary text-foreground rounded-bl-sm"
                  }`}>
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-secondary text-foreground rounded-2xl rounded-bl-sm px-3 py-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            <form
              onSubmit={(e) => { e.preventDefault(); send(); }}
              className="p-3 border-t border-border flex gap-2 bg-card"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your question…"
                disabled={loading}
                className="flex-1"
              />
              <Button type="submit" size="icon" disabled={loading || !input.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-4 md:right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-xl flex items-center justify-center hover:shadow-2xl transition-shadow"
        aria-label="Open chat with Mira"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        {!open && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full ring-2 ring-background animate-pulse" />
        )}
      </motion.button>
    </>
  );
};

export default InboundChatWidget;
