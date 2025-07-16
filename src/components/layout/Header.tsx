
import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X, Brain, Users, BookOpen, Calendar, MessageCircle, HelpCircle } from "lucide-react";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: "Home", path: "/", icon: Brain },
    { name: "About", path: "/about", icon: Users },
    { name: "Consultation", path: "/consultation", icon: Calendar },
    { name: "Self-Help", path: "/self-help", icon: BookOpen },
    { name: "Peer Connect", path: "/peer-connect", icon: Users },
    { name: "Journal", path: "/journal", icon: MessageCircle },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 py-4 px-6 md:px-8",
        isScrolled 
          ? "bg-white/90 backdrop-blur-xl shadow-lg border-b border-mindwell-100" 
          : "bg-white/5 backdrop-blur-sm"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <NavLink 
          to="/" 
          className="flex items-center space-x-3 transition-all duration-300 hover:scale-105 group"
          aria-label="MindwellAI Home"
        >
          <div className="bg-gradient-to-br from-mindwell-500 to-mindwell-600 p-3 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
            <img 
              src="/lovable-uploads/b438a37f-b172-43e3-9eaf-bffee8ba79f5.png" 
              alt="MindwellAI Logo" 
              className="h-8 w-auto filter brightness-0 invert"
            />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold bg-gradient-to-r from-mindwell-600 to-mindwell-800 bg-clip-text text-transparent">
              MindwellAI
            </h1>
            <p className="text-xs text-slate-500">Mental Health Platform</p>
          </div>
        </NavLink>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => cn(
                "group flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden",
                isActive 
                  ? "text-mindwell-700 bg-mindwell-50 shadow-md scale-105" 
                  : "text-slate-600 hover:text-mindwell-700 hover:bg-mindwell-50/50 hover:scale-105"
              )}
            >
              <link.icon className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
              <span>{link.name}</span>
              {/* Active indicator */}
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-mindwell-500 to-mindwell-600 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
            </NavLink>
          ))}
        </nav>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center space-x-3">
          <NavLink to="/consultation">
            <Button 
              variant="outline"
              className="border-mindwell-200 text-mindwell-700 hover:bg-mindwell-50 hover:border-mindwell-300 transition-all duration-300 hover:scale-105"
              size="sm"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Book Session
            </Button>
          </NavLink>
          <NavLink to="/auth">
            <Button 
              className="bg-gradient-to-r from-mindwell-500 to-mindwell-600 hover:from-mindwell-600 hover:to-mindwell-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              size="sm"
            >
              Get Started
            </Button>
          </NavLink>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden flex items-center p-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 transition-all duration-300 hover:bg-white/20"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6 text-slate-700" />
          ) : (
            <Menu className="w-6 h-6 text-slate-700" />
          )}
        </button>
      </div>

      {/* Enhanced Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-white/95 backdrop-blur-xl pt-24 px-6 animate-fade-in">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link, index) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) => cn(
                  "group flex items-center space-x-3 px-5 py-4 rounded-xl text-base font-medium transition-all duration-300 border border-transparent",
                  isActive 
                    ? "text-mindwell-700 bg-mindwell-50 border-mindwell-200 shadow-md" 
                    : "text-slate-600 hover:text-mindwell-700 hover:bg-mindwell-50/50 hover:border-mindwell-100"
                )}
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="p-2 rounded-lg bg-mindwell-100 group-hover:bg-mindwell-200 transition-colors duration-300">
                  <link.icon className="w-5 h-5 text-mindwell-600" />
                </div>
                <span>{link.name}</span>
              </NavLink>
            ))}
            
            <div className="pt-6 space-y-3 border-t border-slate-200 mt-6">
              <NavLink to="/consultation" onClick={() => setIsMobileMenuOpen(false)}>
                <Button 
                  variant="outline"
                  className="w-full border-mindwell-200 text-mindwell-700 hover:bg-mindwell-50 transition-all duration-300"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Session
                </Button>
              </NavLink>
              <NavLink to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                <Button 
                  className="w-full bg-gradient-to-r from-mindwell-500 to-mindwell-600 hover:from-mindwell-600 hover:to-mindwell-700 text-white font-medium shadow-lg"
                >
                  Get Started
                </Button>
              </NavLink>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
