
import { Button } from "@/components/ui/button";
import { NavLink, useNavigate } from "react-router-dom";
import { Brain, Menu, X, Heart, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useSecurityMonitoring } from "@/hooks/useSecurityMonitoring";
import { useSessionManagement } from "@/hooks/useSessionManagement";
import { toast } from "sonner";

const Header = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { logLogout } = useSecurityMonitoring();
  const { terminateSession } = useSessionManagement();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await terminateSession();
      await signOut();
      logLogout();
      toast.success("Signed out successfully");
      navigate("/");
    } catch (error) {
      toast.error("Error signing out");
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/20">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo Section with Animation */}
          <NavLink to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-mindwell-500 to-mindwell-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Brain className="w-6 h-6 text-white animate-pulse" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-mindwell-600 to-blue-600 bg-clip-text text-transparent">
                MindWelAI
              </h1>
              <p className="text-xs text-slate-500 -mt-1">Mental Health AI</p>
            </div>
          </NavLink>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink to="/about" className="text-slate-700 hover:text-mindwell-600 transition-colors">
              About
            </NavLink>
            <NavLink to="/consultation" className="text-slate-700 hover:text-mindwell-600 transition-colors">
              Consultation
            </NavLink>
            <NavLink to="/self-help" className="text-slate-700 hover:text-mindwell-600 transition-colors">
              Self Help
            </NavLink>
            <NavLink to="/peer-connect" className="text-slate-700 hover:text-mindwell-600 transition-colors">
              Peer Connect
            </NavLink>
            <NavLink to="/emergency" className="text-red-600 hover:text-red-700 transition-colors font-semibold">
              🚨 Emergency
            </NavLink>
            <NavLink to="/memorial-chat" className="text-slate-700 hover:text-mindwell-600 transition-colors flex items-center space-x-1">
              <Heart className="w-4 h-4" />
              <span>Memorial Chat</span>
            </NavLink>
            <NavLink to="/journal" className="text-slate-700 hover:text-mindwell-600 transition-colors">
              Journal
            </NavLink>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-slate-600">
                  Welcome, {user.email}
                </span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleSignOut}
                  className="border-mindwell-200 text-mindwell-700 hover:bg-mindwell-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <>
                <NavLink to="/auth">
                  <Button variant="outline" className="border-mindwell-200 text-mindwell-700 hover:bg-mindwell-50">
                    Sign In
                  </Button>
                </NavLink>
                <NavLink to="/consultation">
                  <Button className="bg-gradient-to-r from-mindwell-500 to-mindwell-600 hover:from-mindwell-600 hover:to-mindwell-700">
                    Get Started
                  </Button>
                </NavLink>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-slate-200">
            <nav className="flex flex-col space-y-4">
              <NavLink to="/about" className="text-slate-700 hover:text-mindwell-600 transition-colors">
                About
              </NavLink>
              <NavLink to="/consultation" className="text-slate-700 hover:text-mindwell-600 transition-colors">
                Consultation
              </NavLink>
              <NavLink to="/self-help" className="text-slate-700 hover:text-mindwell-600 transition-colors">
                Self Help
              </NavLink>
              <NavLink to="/peer-connect" className="text-slate-700 hover:text-mindwell-600 transition-colors">
                Peer Connect
              </NavLink>
              <NavLink to="/emergency" className="text-red-600 hover:text-red-700 transition-colors font-semibold">
                🚨 Emergency
              </NavLink>
              <NavLink to="/memorial-chat" className="text-slate-700 hover:text-mindwell-600 transition-colors flex items-center space-x-1">
                <Heart className="w-4 h-4" />
                <span>Memorial Chat</span>
              </NavLink>
              <NavLink to="/journal" className="text-slate-700 hover:text-mindwell-600 transition-colors">
                Journal
              </NavLink>
              <div className="flex flex-col space-y-2 pt-4">
                <NavLink to="/auth">
                  <Button variant="outline" className="w-full border-mindwell-200 text-mindwell-700 hover:bg-mindwell-50">
                    Sign In
                  </Button>
                </NavLink>
                <NavLink to="/consultation">
                  <Button className="w-full bg-gradient-to-r from-mindwell-500 to-mindwell-600 hover:from-mindwell-600 hover:to-mindwell-700">
                    Get Started
                  </Button>
                </NavLink>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
