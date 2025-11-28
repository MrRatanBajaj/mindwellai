import { Button } from "@/components/ui/button";
import { NavLink, useNavigate } from "react-router-dom";
import { 
  Brain, 
  Menu, 
  X, 
  Heart, 
  LogOut, 
  Pill,
  Sparkles,
  BookOpen,
  Calendar,
  Phone,
  Users,
  AlertCircle,
  ShieldCheck,
  ChevronDown
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useSecurityMonitoring } from "@/hooks/useSecurityMonitoring";
import { useSessionManagement } from "@/hooks/useSessionManagement";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
    <header className="fixed top-0 w-full z-50 glass-panel border-b">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo Section */}
          <NavLink to="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200 shadow-lg">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white shadow-sm"></div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                MindWelAI
              </h1>
              <p className="text-[10px] text-muted-foreground -mt-0.5">Mental Health Companion</p>
            </div>
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {/* AI Services Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-1 text-sm">
                  <Sparkles className="w-4 h-4" />
                  AI Services
                  <ChevronDown className="w-3 h-3 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel className="text-xs text-muted-foreground">Talk with AI</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <NavLink to="/ai-voice-therapy" className="flex items-center gap-2 cursor-pointer">
                    <Brain className="w-4 h-4 text-purple-500" />
                    <div>
                      <div className="font-medium">Voice Therapy</div>
                      <div className="text-xs text-muted-foreground">Natural conversation</div>
                    </div>
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <NavLink to="/memorial-chat" className="flex items-center gap-2 cursor-pointer">
                    <Heart className="w-4 h-4 text-rose-500" />
                    <div>
                      <div className="font-medium">Memorial Chat</div>
                      <div className="text-xs text-muted-foreground">Remember loved ones</div>
                    </div>
                  </NavLink>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Resources Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-1 text-sm">
                  <BookOpen className="w-4 h-4" />
                  Resources
                  <ChevronDown className="w-3 h-3 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel className="text-xs text-muted-foreground">Self-Care Tools</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <NavLink to="/self-help" className="flex items-center gap-2 cursor-pointer">
                    <BookOpen className="w-4 h-4 text-blue-500" />
                    <div>
                      <div className="font-medium">Self Help</div>
                      <div className="text-xs text-muted-foreground">Guides & exercises</div>
                    </div>
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <NavLink to="/journal" className="flex items-center gap-2 cursor-pointer">
                    <BookOpen className="w-4 h-4 text-amber-500" />
                    <div>
                      <div className="font-medium">Journal</div>
                      <div className="text-xs text-muted-foreground">Track your thoughts</div>
                    </div>
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <NavLink to="/medicine-store" className="flex items-center gap-2 cursor-pointer">
                    <Pill className="w-4 h-4 text-green-500" />
                    <div>
                      <div className="font-medium">Medicine Store</div>
                      <div className="text-xs text-muted-foreground">Order prescriptions</div>
                    </div>
                  </NavLink>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Professional Care */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-1 text-sm">
                  <Calendar className="w-4 h-4" />
                  Professional
                  <ChevronDown className="w-3 h-3 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel className="text-xs text-muted-foreground">Connect with Experts</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <NavLink to="/consultation" className="flex items-center gap-2 cursor-pointer">
                    <Phone className="w-4 h-4 text-blue-500" />
                    <div>
                      <div className="font-medium">Book Consultation</div>
                      <div className="text-xs text-muted-foreground">Schedule with therapist</div>
                    </div>
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <NavLink to="/sessions" className="flex items-center gap-2 cursor-pointer">
                    <Calendar className="w-4 h-4 text-purple-500" />
                    <div>
                      <div className="font-medium">My Sessions</div>
                      <div className="text-xs text-muted-foreground">View history</div>
                    </div>
                  </NavLink>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Support */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-1 text-sm">
                  <Users className="w-4 h-4" />
                  Support
                  <ChevronDown className="w-3 h-3 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel className="text-xs text-muted-foreground">Community & Help</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <NavLink to="/peer-connect" className="flex items-center gap-2 cursor-pointer">
                    <Users className="w-4 h-4 text-blue-500" />
                    <div>
                      <div className="font-medium">Peer Connect</div>
                      <div className="text-xs text-muted-foreground">Support groups</div>
                    </div>
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <NavLink to="/emergency" className="flex items-center gap-2 cursor-pointer text-rose-600">
                    <AlertCircle className="w-4 h-4" />
                    <div>
                      <div className="font-semibold">🚨 Emergency</div>
                      <div className="text-xs">Crisis hotline</div>
                    </div>
                  </NavLink>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="sm" asChild className="text-sm">
              <NavLink to="/about">About</NavLink>
            </Button>
          </nav>

          {/* User Section */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white text-sm font-medium">
                      {user.email?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm max-w-[120px] truncate">{user.email}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <NavLink to="/audit-logs" className="flex items-center gap-2 cursor-pointer">
                      <ShieldCheck className="w-4 h-4" />
                      Security Logs
                    </NavLink>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-rose-600 cursor-pointer">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <NavLink to="/auth">Sign In</NavLink>
                </Button>
                <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700" asChild>
                  <NavLink to="/consultation">Get Started</NavLink>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t pt-4">
            <nav className="flex flex-col gap-2">
              <div className="text-xs font-semibold text-muted-foreground mb-2 px-2">AI Services</div>
              <NavLink to="/ai-voice-therapy" className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-muted transition-colors">
                <Brain className="w-4 h-4 text-purple-500" />
                <span className="text-sm">Voice Therapy</span>
              </NavLink>
              <NavLink to="/memorial-chat" className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-muted transition-colors">
                <Heart className="w-4 h-4 text-rose-500" />
                <span className="text-sm">Memorial Chat</span>
              </NavLink>

              <div className="text-xs font-semibold text-muted-foreground mb-2 mt-3 px-2">Resources</div>
              <NavLink to="/self-help" className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-muted transition-colors">
                <BookOpen className="w-4 h-4 text-blue-500" />
                <span className="text-sm">Self Help</span>
              </NavLink>
              <NavLink to="/journal" className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-muted transition-colors">
                <BookOpen className="w-4 h-4 text-amber-500" />
                <span className="text-sm">Journal</span>
              </NavLink>
              <NavLink to="/medicine-store" className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-muted transition-colors">
                <Pill className="w-4 h-4 text-green-500" />
                <span className="text-sm">Medicine Store</span>
              </NavLink>

              <div className="text-xs font-semibold text-muted-foreground mb-2 mt-3 px-2">Professional</div>
              <NavLink to="/consultation" className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-muted transition-colors">
                <Phone className="w-4 h-4 text-blue-500" />
                <span className="text-sm">Book Consultation</span>
              </NavLink>
              <NavLink to="/sessions" className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-muted transition-colors">
                <Calendar className="w-4 h-4 text-purple-500" />
                <span className="text-sm">My Sessions</span>
              </NavLink>

              <div className="text-xs font-semibold text-muted-foreground mb-2 mt-3 px-2">Support</div>
              <NavLink to="/peer-connect" className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-muted transition-colors">
                <Users className="w-4 h-4 text-blue-500" />
                <span className="text-sm">Peer Connect</span>
              </NavLink>
              <NavLink to="/emergency" className="flex items-center gap-3 px-2 py-2 rounded-lg bg-rose-50 dark:bg-rose-950/20 text-rose-600">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm font-semibold">🚨 Emergency</span>
              </NavLink>
              
              <div className="border-t my-3"></div>
              <NavLink to="/about" className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-muted transition-colors">
                <span className="text-sm">About</span>
              </NavLink>
              
              {user && (
                <NavLink to="/audit-logs" className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-muted transition-colors">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-sm">Security Logs</span>
                </NavLink>
              )}

              <div className="flex flex-col gap-2 mt-4">
                {user ? (
                  <>
                    <div className="text-xs text-muted-foreground px-2">
                      Signed in as {user.email}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSignOut}
                      className="w-full"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <NavLink to="/auth">Sign In</NavLink>
                    </Button>
                    <Button size="sm" className="w-full bg-gradient-to-r from-purple-600 to-blue-600" asChild>
                      <NavLink to="/consultation">Get Started</NavLink>
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
