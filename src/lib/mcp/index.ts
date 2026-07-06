import { defineMcp } from "@lovable.dev/mcp-js";
import chatWithYaro from "./tools/chat-with-yaro";
import clinicalScreen from "./tools/clinical-screen";
import crisisResources from "./tools/crisis-resources";

export default defineMcp({
  name: "wellmindai-mcp",
  title: "WellMindAI MCP",
  version: "0.1.0",
  instructions:
    "Tools for WellMindAI — chat with Yaro (multilingual AI therapist trained on DSM-5/ICD-11/PHQ-9/GAD-7/PCL-5), score standard clinical screeners, and fetch crisis helplines. Use `chat_with_yaro` for open conversation, `clinical_screen` for scoring, `crisis_resources` for safety.",
  tools: [chatWithYaro, clinicalScreen, crisisResources],
});
