import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SubscriptionStatus from "@/components/ui-custom/SubscriptionStatus";
import PaymentHistory from "@/components/ui-custom/PaymentHistory";
import { Crown } from "lucide-react";

const Subscription = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-mindwell-50">
      <Header />
      <main className="flex-1 pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Crown className="w-9 h-9 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold">My Subscription</h1>
            </div>
            <p className="text-slate-600">
              View your current plan, renewal date, and remaining counselor sessions.
            </p>
          </motion.div>

          <SubscriptionStatus />

          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-4">Payment History</h2>
            <PaymentHistory />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Subscription;
