import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Heart, Clock, Sparkles, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";

const MemorialChat = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
      <Header />
      
      <main className="flex-1 flex items-center justify-center px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-lg"
        >
          {/* Animated Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
            className="relative inline-block mb-8"
          >
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-violet-100 to-pink-100 flex items-center justify-center mx-auto">
              <Heart className="w-16 h-16 text-violet-500" />
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0"
            >
              <Sparkles className="w-6 h-6 text-violet-400 absolute -top-2 right-4" />
            </motion.div>
          </motion.div>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-700 text-sm font-medium mb-6"
          >
            <Clock className="w-4 h-4" />
            Coming Soon
          </motion.div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Memorial AI Chat
          </h1>

          {/* Description */}
          <p className="text-slate-600 mb-8 leading-relaxed">
            Connect with cherished memories of your loved ones through AI-powered conversations. 
            This feature is currently under development and will be available soon.
          </p>

          {/* Status */}
          <div className="bg-slate-100 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-center gap-3 text-slate-700">
              <div className="w-3 h-3 rounded-full bg-amber-400 animate-pulse" />
              <span className="font-medium">Feature in Development</span>
            </div>
            <p className="text-slate-500 text-sm mt-2">
              We're working hard to bring this meaningful feature to you
            </p>
          </div>

          {/* Back Button */}
          <NavLink to="/">
            <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </NavLink>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default MemorialChat;
