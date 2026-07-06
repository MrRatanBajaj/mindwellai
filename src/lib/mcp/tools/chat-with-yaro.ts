import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "chat_with_yaro",
  title: "Chat with Yaro (AI therapist)",
  description:
    "Send a message to WellMindAI's Yaro — a compassionate multilingual (Hindi/English/Hinglish/Tamil/Bengali/Spanish) AI therapist trained on DSM-5, ICD-11, PHQ-9, GAD-7, PCL-5. Returns Yaro's reply plus a real-time clinical pattern read (PHQ-9/GAD-7 bands, DSM hints, crisis flag).",
  inputSchema: {
    message: z.string().min(1).describe("The user's message to Yaro."),
    language: z
      .enum(["auto", "en", "hi", "hinglish", "ta", "bn", "es"])
      .optional()
      .describe("Language hint. 'auto' mirrors the user's language."),
    history: z
      .array(
        z.object({
          sender: z.enum(["user", "ai"]),
          content: z.string(),
        }),
      )
      .optional()
      .describe("Recent conversation turns for context."),
  },
  annotations: { readOnlyHint: false, openWorldHint: true },
  handler: async ({ message, language, history }) => {
    const url =
      "https://tcqwhsdhbxlzxuoekjom.supabase.co/functions/v1/ai-counselor";
    const anon =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjcXdoc2RoYnhsenh1b2Vram9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2NTAwNzEsImV4cCI6MjA2OTIyNjA3MX0.lB1_VKY_eUKJfhRX1tZggll5O-md1NB-WpL9wUg4p64";
    const lang = language ?? "auto";
    const hint =
      lang === "auto"
        ? "Mirror the user's language exactly."
        : `Respond primarily in ${lang}.`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${anon}`,
        apikey: anon,
      },
      body: JSON.stringify({
        message: `${message}\n\n[LANG_HINT: ${hint}]`,
        counselorId: "yaro",
        conversationHistory: (history ?? []).slice(-12),
      }),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return {
        content: [{ type: "text", text: `Yaro engine error ${res.status}: ${text}` }],
        isError: true,
      };
    }
    const data = (await res.json()) as any;
    const reply = data?.response || data?.message || "";
    return {
      content: [{ type: "text", text: String(reply) }],
      structuredContent: {
        reply,
        clinical: data?.clinical ?? null,
        provider: data?.provider,
        model: data?.model,
        degraded: Boolean(data?.degraded),
      },
    };
  },
});
