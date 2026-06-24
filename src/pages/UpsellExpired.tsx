import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Heart, Sparkles } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

const UpsellExpired = () => {
  const navigate = useNavigate();
  useSEO({
    title: "Keep your progress — WellMind AI",
    description: "Your workplace or partner plan has ended. Continue your mental wellness journey with 50% off your first month.",
    path: "/expired",
  });

  return (
    <div className="min-h-screen flex flex-col bg-pastel-peach">
      <Header />
      <main className="flex-grow pt-28 pb-16 flex items-center">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <Heart className="w-14 h-14 text-primary mx-auto mb-4" />
          <p className="font-hand text-3xl text-primary mb-2">don't stop now.</p>
          <h1 className="font-display text-4xl md:text-5xl font-semibold mb-4">
            Your partner plan has ended.
          </h1>
          <p className="text-foreground/75 max-w-md mx-auto mb-8">
            Don't lose your journal streaks, mood history, or your counselor's memory of you.
            Keep going with a personal plan — 50% off your first month.
          </p>
          <div className="pastel-card max-w-md mx-auto" style={{ transform: "rotate(-0.5deg)" }}>
            <div className="text-left space-y-2 mb-5">
              <p className="font-hand text-2xl text-primary">what stays with you</p>
              <ul className="text-sm text-foreground/80 list-disc ml-5 space-y-1">
                <li>Every journal entry, mood log, breathing streak</li>
                <li>Yaro & Ava's session context</li>
                <li>Your dashboard insights</li>
              </ul>
            </div>
            <Button
              onClick={() => navigate("/plans?promo=B2B50")}
              className="w-full h-12 rounded-full bg-primary text-primary-foreground border-2 border-foreground/80 shadow-pencil font-semibold"
            >
              <Sparkles className="w-4 h-4 mr-2" /> Continue with 50% off
            </Button>
            <button
              onClick={() => navigate("/dashboard")}
              className="text-xs text-foreground/60 hover:text-foreground mt-4 underline"
            >
              maybe later
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UpsellExpired;
