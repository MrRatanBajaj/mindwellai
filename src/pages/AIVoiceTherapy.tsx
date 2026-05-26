import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ElevenLabsPhoneCounselor from '@/components/ui-custom/ElevenLabsPhoneCounselor';
import { useSEO } from '@/hooks/useSEO';

export default function AIVoiceTherapy() {
  useSEO({
    title: "AI Phone Counselor — Real Voice Call | WellMind AI",
    description: "Talk to an AI mental wellness counselor over a real phone-style call. Powered by ElevenLabs voice. Private, encrypted, available 24/7.",
    path: "/ai-voice-therapy",
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-28 pb-16 px-4">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-6">
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">
              Phone counselor
            </p>
            <h1 className="font-display text-3xl md:text-4xl text-foreground mb-2">
              Calling <span className="serif-italic text-primary">Dr. Aria</span>…
            </h1>
            <p className="text-sm text-muted-foreground">
              A real-time voice call with your AI mental wellness counselor. Speak naturally — she's listening.
            </p>
          </div>
          <ElevenLabsPhoneCounselor counselorName="Dr. Aria" specialty="AI Mental Wellness Counselor" />
        </div>
      </main>
      <Footer />
    </div>
  );
}
