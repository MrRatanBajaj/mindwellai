import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "clinical_screen",
  title: "Run a clinical screener",
  description:
    "Score a PHQ-9 (depression), GAD-7 (anxiety) or PCL-5 (PTSD) screener from item responses (0-3 per item; PCL-5 0-4). Returns total score, severity band, and safe next-step guidance. Not a diagnosis.",
  inputSchema: {
    instrument: z.enum(["phq9", "gad7", "pcl5"]),
    answers: z
      .array(z.number().int().min(0).max(4))
      .describe("Item answers in order. PHQ-9: 9 items 0-3. GAD-7: 7 items 0-3. PCL-5: 20 items 0-4."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ instrument, answers }) => {
    const sum = answers.reduce((a, b) => a + b, 0);
    let band = "n/a";
    let expected = 0;
    if (instrument === "phq9") {
      expected = 9;
      band =
        sum <= 4 ? "minimal" : sum <= 9 ? "mild" : sum <= 14 ? "moderate" : sum <= 19 ? "moderately severe" : "severe";
    } else if (instrument === "gad7") {
      expected = 7;
      band = sum <= 4 ? "minimal" : sum <= 9 ? "mild" : sum <= 14 ? "moderate" : "severe";
    } else {
      expected = 20;
      band = sum >= 33 ? "probable PTSD" : "sub-threshold";
    }
    const warn = answers.length !== expected ? `Warning: expected ${expected} items, got ${answers.length}.` : "";
    const text = `${instrument.toUpperCase()} score: ${sum} (${band}). ${warn}\nThis is a screening signal, not a diagnosis. If crisis: iCall 9152987821 (India).`;
    return {
      content: [{ type: "text", text }],
      structuredContent: { instrument, score: sum, band },
    };
  },
});
