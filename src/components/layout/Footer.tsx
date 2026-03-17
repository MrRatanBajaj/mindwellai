import { NavLink } from "react-router-dom";
import { Briefcase, Heart } from "lucide-react";
import wellmindLogo from "@/assets/wellmind-logo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-background/80">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <img 
              src={wellmindLogo} 
              alt="WellMind AI Logo" 
              className="h-12 w-auto bg-white rounded-lg p-1.5 mb-4"
            />
            <p className="text-background/50 text-sm max-w-xs leading-relaxed">
              Your companion for mental wellness. Journaling, self-help resources, and professional counselor booking — all in one place.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-medium text-sm text-background mb-4">Platform</h3>
            <ul className="space-y-2.5">
              {[
                { to: "/self-help", label: "Self Help" },
                { to: "/journal", label: "Journal" },
                { to: "/consultation", label: "Book Counselor" },
                { to: "/about", label: "About" },
              ].map((link) => (
                <li key={link.to}>
                  <NavLink to={link.to} className="text-background/50 hover:text-background text-sm transition-colors">
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-medium text-sm text-background mb-4">Company</h3>
            <ul className="space-y-2.5">
              <li>
                <NavLink to="/careers" className="text-background/50 hover:text-background text-sm transition-colors flex items-center gap-2">
                  <Briefcase className="w-3.5 h-3.5" />
                  Careers
                  <span className="text-[10px] bg-primary/20 text-primary-foreground px-1.5 py-0.5 rounded-full">Hiring</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/policy" className="text-background/50 hover:text-background text-sm transition-colors">
                  Privacy Policy
                </NavLink>
              </li>
              <li>
                <NavLink to="/policy" className="text-background/50 hover:text-background text-sm transition-colors">
                  Terms of Service
                </NavLink>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-background/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-background/40 text-sm">
            © {currentYear} WellMind AI. All rights reserved.
          </p>
          <p className="text-background/40 text-xs flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-destructive" /> for mental wellness
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
