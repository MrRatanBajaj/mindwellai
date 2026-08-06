import YaroChat from "@/components/ui-custom/YaroChat";
import LandingNav from "@/components/layout/LandingNav";
import { useSEO } from "@/hooks/useSEO";

const YaroChatPage = () => {
  useSEO({
    title: "Chat with Yaro — Free AI therapist | WellMindAI",
    description: "WhatsApp-style chat therapy with Yaro. Free, no signup. Multilingual. Trained on DSM-5, ICD-11, PHQ-9, GAD-7, PCL-5.",
    path: "/chat/yaro",
  });
  return (
    <div className="min-h-screen bg-background">
      <LandingNav />
      <main className="pt-20 pb-10 px-2 sm:px-4">
        <YaroChat />
      </main>
    </div>
  );
};

export default YaroChatPage;
