import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SessionHistory from "@/components/ui-custom/SessionHistory";
import { History } from "lucide-react";

const Sessions = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-mindwell-50">
      <Header />
      
      <main className="flex-1 pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <History className="w-10 h-10 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold">
                Your <span className="text-gradient">Session History</span>
              </h1>
            </div>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Review your past therapy sessions, download transcripts, and track your mental health journey.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <SessionHistory />
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Sessions;