
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import About from "./pages/About";
import Auth from "./pages/Auth";
import Policy from "./pages/Policy";
import Careers from "./pages/Careers";
import NotFound from "./pages/NotFound";
import SelfHelp from "./pages/SelfHelp";
import Journal from "./pages/Journal";
import Consultation from "./pages/Consultation";
import Dashboard from "./pages/Dashboard";
import MemorialChat from "./pages/MemorialChat";
import Plans from "./pages/Plans";
import Payment from "./pages/Payment";

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
            <Route path="/policy" element={<Policy />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/memorial-chat" element={<MemorialChat />} />
            <Route path="/plans" element={<Plans />} />
            {/* Protected routes */}
            <Route path="/self-help" element={<ProtectedRoute><SelfHelp /></ProtectedRoute>} />
            <Route path="/journal" element={<ProtectedRoute><Journal /></ProtectedRoute>} />
            <Route path="/consultation" element={<ProtectedRoute><Consultation /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
