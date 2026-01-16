
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
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
import AIVoiceTherapy from "./pages/AIVoiceTherapy";
import Emergency from "./pages/Emergency";
import Policy from "./pages/Policy";
import Sessions from "./pages/Sessions";
import MedicineStore from "./pages/MedicineStore";
import AuditLogs from "./pages/AuditLogs";
import Careers from "./pages/Careers";
import NotificationAdminPage from "./pages/NotificationAdmin";
import LeadsAdmin from "./pages/LeadsAdmin";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/emergency" element={<Emergency />} />
            <Route path="/policy" element={<Policy />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/notification-admin" element={<NotificationAdminPage />} />
            <Route path="/leads-admin" element={<LeadsAdmin />} />
            {/* Protected routes requiring authentication */}
            <Route path="/consultation" element={<ProtectedRoute><Consultation /></ProtectedRoute>} />
            <Route path="/plans" element={<ProtectedRoute><Plans /></ProtectedRoute>} />
            <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
            <Route path="/self-help" element={<ProtectedRoute><SelfHelp /></ProtectedRoute>} />
            <Route path="/journal" element={<ProtectedRoute><Journal /></ProtectedRoute>} />
            <Route path="/peer-connect" element={<ProtectedRoute><PeerConnect /></ProtectedRoute>} />
            <Route path="/memorial-chat" element={<ProtectedRoute><MemorialChat /></ProtectedRoute>} />
            <Route path="/ai-therapist" element={<ProtectedRoute><AITherapist /></ProtectedRoute>} />
            <Route path="/ai-audio-call" element={<ProtectedRoute><AIAudioCall /></ProtectedRoute>} />
            <Route path="/ai-voice-therapy" element={<ProtectedRoute><AIVoiceTherapy /></ProtectedRoute>} />
            <Route path="/sessions" element={<ProtectedRoute><Sessions /></ProtectedRoute>} />
            <Route path="/medicine-store" element={<ProtectedRoute><MedicineStore /></ProtectedRoute>} />
            <Route path="/audit-logs" element={<ProtectedRoute><AuditLogs /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
