import { NavLink } from "react-router-dom";
import { Briefcase, MapPin, Sparkles, Heart, Brain, Shield } from "lucide-react";
import { motion } from "framer-motion";
import wellmindLogo from "@/assets/wellmind-logo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-slate-900 text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Hiring Banner */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 py-4 relative"
      >
        <div className="max-w-7xl mx-auto px-6">
          <NavLink to="/careers" className="flex flex-col md:flex-row items-center justify-center gap-3 text-white hover:opacity-90 transition-opacity">
            <motion.div 
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              <span className="font-bold text-lg">We're Hiring!</span>
              <Sparkles className="w-5 h-5" />
            </motion.div>
            <div className="flex items-center gap-4 text-sm md:text-base">
              <span className="flex items-center gap-1">
                <Briefcase className="w-4 h-4" />
                Co-Founder • AI/ML Engineer • Software Engineer
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                Delhi, India
              </span>
            </div>
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
              Equity-based → Apply Now
            </span>
          </NavLink>
        </div>
      </motion.div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
          {/* Brand Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="col-span-1 md:col-span-2"
          >
            <div className="flex items-center gap-3 mb-6">
              <img 
                src={wellmindLogo} 
                alt="WellMind AI Logo" 
                className="h-16 w-auto bg-white rounded-xl p-2"
              />
            </div>
            <p className="text-slate-400 text-sm mb-6 max-w-sm">
              AI-powered mental health support available 24/7. Evidence-based therapy techniques delivered with compassion and privacy.
            </p>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Shield className="w-4 h-4 text-emerald-400" />
                HIPAA Compliant
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Heart className="w-4 h-4 text-rose-400" />
                2M+ Sessions
              </div>
            </div>
          </motion.div>
          
          {/* Platform Links */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="col-span-1"
          >
            <h3 className="font-semibold text-sm text-white mb-4">Platform</h3>
            <ul className="space-y-3">
              <li>
                <NavLink to="/" className="text-slate-400 hover:text-white text-sm transition-colors">
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/about" className="text-slate-400 hover:text-white text-sm transition-colors">
                  About
                </NavLink>
              </li>
              <li>
                <NavLink to="/consultation" className="text-slate-400 hover:text-white text-sm transition-colors">
                  Consultation
                </NavLink>
              </li>
              <li>
                <NavLink to="/plans" className="text-slate-400 hover:text-white text-sm transition-colors">
                  Plans
                </NavLink>
              </li>
            </ul>
          </motion.div>
          
          {/* Legal Links */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="col-span-1"
          >
            <h3 className="font-semibold text-sm text-white mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <NavLink to="/policy" className="text-slate-400 hover:text-white text-sm transition-colors">
                  Privacy Policy
                </NavLink>
              </li>
              <li>
                <NavLink to="/policy" className="text-slate-400 hover:text-white text-sm transition-colors">
                  Terms of Service
                </NavLink>
              </li>
              <li>
                <NavLink to="/policy" className="text-slate-400 hover:text-white text-sm transition-colors">
                  Cookie Policy
                </NavLink>
              </li>
            </ul>
          </motion.div>

          {/* Careers Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="col-span-1"
          >
            <h3 className="font-semibold text-sm text-white mb-4 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-violet-400" />
              Careers
            </h3>
            <ul className="space-y-3">
              <li>
                <NavLink to="/careers" className="text-slate-400 hover:text-white text-sm transition-colors flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                  Co-Founder
                </NavLink>
              </li>
              <li>
                <NavLink to="/careers" className="text-slate-400 hover:text-white text-sm transition-colors flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                  AI/ML Engineer
                </NavLink>
              </li>
              <li>
                <NavLink to="/careers" className="text-slate-400 hover:text-white text-sm transition-colors flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                  Software Engineer
                </NavLink>
              </li>
              <li>
                <NavLink to="/careers" className="text-violet-400 hover:text-violet-300 text-sm font-medium transition-colors">
                  View All →
                </NavLink>
              </li>
            </ul>
          </motion.div>
        </div>
        
        {/* Bottom Bar */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center"
        >
          <p className="text-slate-500 text-sm">
            © {currentYear} WellMind AI. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-slate-500 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="#" className="text-slate-500 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a href="#" className="text-slate-500 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
