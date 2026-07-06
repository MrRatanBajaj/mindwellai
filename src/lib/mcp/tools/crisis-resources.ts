import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

const RESOURCES: Record<string, { name: string; phone: string; hours: string }[]> = {
  IN: [
    { name: "iCall", phone: "9152987821", hours: "Mon-Sat 8am-10pm" },
    { name: "Vandrevala Foundation", phone: "1860-2662-345", hours: "24/7" },
    { name: "AASRA", phone: "9820466726", hours: "24/7" },
  ],
  US: [
    { name: "988 Suicide & Crisis Lifeline", phone: "988", hours: "24/7" },
    { name: "Crisis Text Line", phone: "Text HOME to 741741", hours: "24/7" },
  ],
  GB: [{ name: "Samaritans", phone: "116 123", hours: "24/7" }],
  DEFAULT: [{ name: "Befrienders Worldwide", phone: "befrienders.org", hours: "Directory" }],
};

export default defineTool({
  name: "crisis_resources",
  title: "Get crisis helplines",
  description: "Return verified mental-health crisis helplines for a country (ISO-2). Falls back to an international directory.",
  inputSchema: {
    country: z.string().length(2).optional().describe("ISO-2 country code, e.g. IN, US, GB"),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ country }) => {
    const key = (country ?? "").toUpperCase();
    const list = RESOURCES[key] ?? RESOURCES.DEFAULT;
    const text = list.map((r) => `• ${r.name} — ${r.phone} (${r.hours})`).join("\n");
    return {
      content: [{ type: "text", text }],
      structuredContent: { country: key || "DEFAULT", resources: list },
    };
  },
});
