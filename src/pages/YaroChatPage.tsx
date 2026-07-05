import YaroChat from "@/components/ui-custom/YaroChat";
import { useSEO } from "@/hooks/useSEO";

const YaroChatPage = () => {
  useSEO({
    title: "Chat with Yaro — Free AI therapist | WellMindAI",
    description: "WhatsApp-style chat therapy with Yaro. Free, no signup. Multilingual. Trained on DSM-5, ICD-11, PHQ-9, GAD-7, PCL-5.",
    path: "/chat/yaro",
  });
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 px-2 sm:px-4">
      <YaroChat />
    </div>
  );
};

export default YaroChatPage;

