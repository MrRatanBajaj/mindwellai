
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Consultation from "./pages/Consultation";
import Plans from "./pages/Plans";
import Payment from "./pages/Payment";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import SelfHelp from "./pages/SelfHelp";
import Journal from "./pages/Journal";
import PeerConnect from "./pages/PeerConnect";
import MemorialChat from "./pages/MemorialChat";
import AITherapist from "./pages/AITherapist";
import AIAudioCall from "./pages/AIAudioCall";
import Emergency from "./pages/Emergency";
import Policy from "./pages/Policy";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/consultation" element={<Consultation />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/self-help" element={<SelfHelp />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/peer-connect" element={<PeerConnect />} />
          <Route path="/memorial-chat" element={<MemorialChat />} />
          <Route path="/ai-therapist" element={<AITherapist />} />
          <Route path="/ai-audio-call" element={<AIAudioCall />} />
          <Route path="/emergency" element={<Emergency />} />
          <Route path="/policy" element={<Policy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
