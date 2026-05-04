import { Button } from "@/components/ui/button";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, BookOpen, Calendar, Leaf, Briefcase, MessageCircleHeart, Crown } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import wellmindLogo from "@/assets/wellmind-logo.png";

const Header = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
      navigate("/");
    } catch (error) {
      toast.error("Error signing out");
    }
  };

  const navLinks = [
    { to: "/self-help", label: "Self Help", icon: Leaf },
    { to: "/journal", label: "Journal", icon: BookOpen },
    { to: "/consultation", label: "Book Counselor", icon: Calendar },
    { to: "/careers", label: "Careers", icon: Briefcase },
    { to: "/feedback-wall", label: "Wall", icon: MessageCircleHeart },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-5xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <NavLink to="/" className="flex items-center group flex-shrink-0">
            <img 
              src={wellmindLogo} 
              alt="WellMind AI" 
              className="h-9 w-auto transition-transform duration-300 group-hover:scale-105"
            />
          </NavLink>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`
                }
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
                  <NavLink to="/subscription">
                    <Crown className="w-4 h-4 mr-1" />
                    My Plan
                  </NavLink>
                </Button>
                <span className="text-sm text-muted-foreground max-w-[140px] truncate">
                  {user.email}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <NavLink to="/auth">Sign In</NavLink>
                </Button>
                <Button size="sm" asChild>
                  <NavLink to="/auth">Get Started</NavLink>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
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
          <div className="md:hidden mt-4 pb-4 border-t border-border pt-4">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors text-sm"
                >
                  <link.icon className="w-4 h-4 text-primary" />
                  {link.label}
                </NavLink>
              ))}
              <div className="border-t border-border my-3" />
              {user ? (
                <>
                  <div className="text-xs text-muted-foreground px-3 mb-2">
                    {user.email}
                  </div>
                  <Button variant="outline" size="sm" onClick={handleSignOut} className="mx-3">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <div className="flex flex-col gap-2 px-3">
                  <Button variant="outline" size="sm" asChild>
                    <NavLink to="/auth">Sign In</NavLink>
                  </Button>
                  <Button size="sm" asChild>
                    <NavLink to="/auth">Get Started</NavLink>
                  </Button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
