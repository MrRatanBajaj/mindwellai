import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { SubscriptionRoute } from "@/components/auth/SubscriptionRoute";
import CookieBanner from "@/components/ui-custom/CookieBanner";
import NainaChatbot from "@/components/ui-custom/NainaChatbot";
import Index from "./pages/Index";
import About from "./pages/About";
import Auth from "./pages/Auth";
import Policy from "./pages/Policy";
import Careers from "./pages/Careers";
import NotFound from "./pages/NotFound";
import PartnerProgram from "./pages/PartnerProgram";
import StudentAmbassador from "./pages/StudentAmbassador";
import Journal from "./pages/Journal";
import Consultation from "./pages/Consultation";
import Dashboard from "./pages/Dashboard";
import MemorialChat from "./pages/MemorialChat";
import Plans from "./pages/Plans";
import Payment from "./pages/Payment";
import Subscription from "./pages/Subscription";
import FeedbackWall from "./pages/FeedbackWall";
import Referrals from "./pages/Referrals";
import Research from "./pages/Research";
import PhoneCounselor from "./pages/PhoneCounselor";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Business from "./pages/Business";
import Admin from "./pages/Admin";
import { Navigate } from "react-router-dom";

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
            <Route path="/feedback-wall" element={<FeedbackWall />} />
            <Route path="/research" element={<Research />} />
            <Route path="/business" element={<Business />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            {/* Unified admin console */}
            <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
            <Route path="/admin/blog" element={<Navigate to="/admin?tab=blog" replace />} />
            <Route path="/admin/research" element={<Navigate to="/admin?tab=research" replace />} />
            <Route path="/admin/feedback" element={<Navigate to="/admin?tab=feedback" replace />} />
            <Route path="/admin/leads" element={<Navigate to="/admin?tab=leads" replace />} />
            {/* Protected routes */}
            <Route path="/journal" element={<ProtectedRoute><Journal /></ProtectedRoute>} />
            <Route path="/subscription" element={<ProtectedRoute><Subscription /></ProtectedRoute>} />
            <Route path="/referrals" element={<ProtectedRoute><Referrals /></ProtectedRoute>} />

            
            {/* Auth + active paid subscription required */}
            <Route path="/self-help" element={<SubscriptionRoute><SelfHelp /></SubscriptionRoute>} />
            <Route path="/consultation" element={<SubscriptionRoute><Consultation /></SubscriptionRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/phone-counselor" element={<ProtectedRoute><PhoneCounselor /></ProtectedRoute>} />
            <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <CookieBanner />
          <NainaChatbot />
          
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
