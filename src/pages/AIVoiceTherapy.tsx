import AIVoiceTherapist from '@/components/ui-custom/AIVoiceTherapist';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function AIVoiceTherapy() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <AIVoiceTherapist />
      </main>
      <Footer />
    </div>
  );
}
