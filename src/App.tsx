import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { SubscriptionRoute } from "@/components/auth/SubscriptionRoute";
import CookieBanner from "@/components/ui-custom/CookieBanner";
import Index from "./pages/Index";
import About from "./pages/About";
import Auth from "./pages/Auth";
import Policy from "./pages/Policy";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";
import Careers from "./pages/Careers";
import NotFound from "./pages/NotFound";
import Journal from "./pages/Journal";
import Consultation from "./pages/Consultation";
import VideoConsultation from "./pages/VideoConsultation";
import AudioConsultation from "./pages/AudioConsultation";
import Dashboard from "./pages/Dashboard";
import MemorialChat from "./pages/MemorialChat";
import Plans from "./pages/Plans";
import Payment from "./pages/Payment";
import Subscription from "./pages/Subscription";
import PhoneCounselor from "./pages/PhoneCounselor";
import Blog from "./pages/Blog";
import UpsellExpired from "./pages/UpsellExpired";
import B2BBillingEngine from "./pages/B2BBillingEngine";
import B2BAdminDashboard from "./pages/B2BAdminDashboard";
import JudgementFreeSpace from "./pages/JudgementFreeSpace";
import YaroChatPage from "./pages/YaroChatPage";
import Alternative from "./pages/Alternative";
import Admin from "./pages/Admin";
import Compare from "./pages/Compare";
import Research from "./pages/Research";
import ClinicalValidation from "./pages/ClinicalValidation";
import PartnerPortal from "./pages/PartnerPortal";
import PartnerLogin from "./pages/PartnerLogin";
import PartnerDashboard from "./pages/PartnerDashboard";
import SuperAdminPartners from "./pages/SuperAdminPartners";
import NpsPrompt from "@/components/ui-custom/NpsPrompt";
import AnalyticsTracker from "@/components/ui-custom/AnalyticsTracker";


const queryClient = new QueryClient();

const AppChrome = () => (
  <>
    <CookieBanner />
    <NpsPrompt />
    <AnalyticsTracker />
  </>
);

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
            <Route path="/judgement-free-space" element={<JudgementFreeSpace />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/policy" element={<Policy />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsConditions />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/memorial-chat" element={<ProtectedRoute><MemorialChat /></ProtectedRoute>} />
            <Route path="/plans" element={<Plans />} />
            <Route path="/business/buy" element={<B2BBillingEngine />} />
            <Route path="/business/dashboard" element={<ProtectedRoute><B2BAdminDashboard /></ProtectedRoute>} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/expired" element={<UpsellExpired />} />
            <Route path="/journal" element={<ProtectedRoute><Journal /></ProtectedRoute>} />
            <Route path="/subscription" element={<ProtectedRoute><Subscription /></ProtectedRoute>} />
            <Route path="/phone-counselor" element={<ProtectedRoute><PhoneCounselor /></ProtectedRoute>} />
            <Route path="/consultation" element={<ProtectedRoute><Consultation /></ProtectedRoute>} />
            <Route path="/consultation/video" element={<SubscriptionRoute><VideoConsultation /></SubscriptionRoute>} />
            <Route path="/consultation/audio" element={<SubscriptionRoute><AudioConsultation /></SubscriptionRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/chat/yaro" element={<ProtectedRoute><YaroChatPage /></ProtectedRoute>} />
            <Route path="/chat" element={<ProtectedRoute><YaroChatPage /></ProtectedRoute>} />
            <Route path="/alternatives/:slug" element={<Alternative />} />
            <Route path="/research" element={<Research />} />
            <Route path="/clinical-validation" element={<ProtectedRoute><ClinicalValidation /></ProtectedRoute>} />

            <Route path="/compare" element={<Compare />} />
            <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
            <Route path="/partner/login" element={<PartnerLogin />} />
            <Route path="/partner/dashboard" element={<PartnerDashboard />} />
            <Route path="/partner/settings" element={<PartnerDashboard />} />
            <Route path="/admin/super" element={<ProtectedRoute><SuperAdminPartners /></ProtectedRoute>} />
            <Route path="/:slug" element={<PartnerPortal />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <AppChrome />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
