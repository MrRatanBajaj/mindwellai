import { Button } from "@/components/ui/button";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Menu, X, LogOut, BookOpen, Calendar, Leaf,
  MessageCircleHeart, Crown, Gift, Sparkles, ChevronDown, User
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import wellmindLogo from "@/assets/wellmind-logo.png";

const Header = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
      navigate("/");
    } catch {
      toast.error("Error signing out");
    }
  };

  const primaryLinks = [
    { to: "/self-help", label: "Self Help", icon: Leaf },
    { to: "/journal", label: "Journal", icon: BookOpen },
    { to: "/consultation", label: "Counselors", icon: Calendar },
    { to: "/feedback-wall", label: "Wall", icon: MessageCircleHeart },
  ];

  return (
    <header
      className={`fixed top-3 left-1/2 -translate-x-1/2 z-50 w-[min(96%,1100px)] transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-2xl shadow-lg shadow-calm-sage/5"
          : "bg-background/60 backdrop-blur-xl"
      } border border-border/50 rounded-full`}
    >
      <div className="px-4 sm:px-6 py-2.5">
        <div className="flex items-center justify-between gap-2">
          {/* Logo */}
          <NavLink to="/" className="flex items-center group flex-shrink-0 pl-1">
            <img
              src={wellmindLogo}
              alt="WellMind AI"
              className="h-8 w-auto transition-transform duration-300 group-hover:scale-105"
            />
          </NavLink>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {primaryLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    isActive
                      ? "bg-calm-sage/15 text-calm-sage"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  }`
                }
              >
                <link.icon className="w-3.5 h-3.5" />
                {link.label}
              </NavLink>
            ))}

            {/* Refer & Earn — highlighted pill */}
            <NavLink
              to="/referrals"
              className="ml-1 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-calm-sage/20 to-calm-lavender/20 text-foreground hover:from-calm-sage/30 hover:to-calm-lavender/30 transition-all"
            >
              <Gift className="w-3.5 h-3.5 text-calm-sage" />
              <span>Refer & Earn</span>
              <span className="hidden xl:inline text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-calm-sage text-white">
                +7d
              </span>
            </NavLink>
          </nav>

          {/* Auth */}
          <div className="hidden lg:flex items-center gap-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full h-9 px-2 gap-2 hover:bg-muted/60"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-calm-sage to-calm-lavender flex items-center justify-center text-white text-xs font-semibold">
                      {user.email?.[0]?.toUpperCase() || "U"}
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-2">
                  <div className="px-2 py-2 text-xs text-muted-foreground truncate">
                    {user.email}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                    <User className="w-4 h-4 mr-2" /> Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/subscription")}>
                    <Crown className="w-4 h-4 mr-2" /> My Plan
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/referrals")}>
                    <Gift className="w-4 h-4 mr-2" /> Refer & Earn
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                    <LogOut className="w-4 h-4 mr-2" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild className="rounded-full">
                  <NavLink to="/auth">Sign In</NavLink>
                </Button>
                <Button
                  size="sm"
                  asChild
                  className="rounded-full bg-gradient-to-r from-calm-sage to-calm-lavender hover:opacity-90 text-white shadow-md"
                >
                  <NavLink to="/auth">
                    <Sparkles className="w-3.5 h-3.5 mr-1" /> Get Started
                  </NavLink>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden p-2 rounded-full hover:bg-muted transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-3 pb-3 border-t border-border/50 pt-3 px-1">
            <nav className="flex flex-col gap-1">
              {primaryLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted transition-colors text-sm"
                >
                  <link.icon className="w-4 h-4 text-calm-sage" />
                  {link.label}
                </NavLink>
              ))}
              <NavLink
                to="/referrals"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gradient-to-r from-calm-sage/15 to-calm-lavender/15 transition-colors text-sm font-medium"
              >
                <Gift className="w-4 h-4 text-calm-sage" />
                Refer & Earn
                <span className="ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-calm-sage text-white">
                  +7d free
                </span>
              </NavLink>

              <div className="border-t border-border my-3" />
              {user ? (
                <>
                  <div className="text-xs text-muted-foreground px-3 mb-2 truncate">
                    {user.email}
                  </div>
                  <NavLink
                    to="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted text-sm"
                  >
                    <User className="w-4 h-4 text-calm-sage" /> Dashboard
                  </NavLink>
                  <NavLink
                    to="/subscription"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted text-sm"
                  >
                    <Crown className="w-4 h-4 text-calm-sage" /> My Plan
                  </NavLink>
                  <Button variant="outline" size="sm" onClick={handleSignOut} className="mx-3 mt-2 rounded-full">
                    <LogOut className="w-4 h-4 mr-2" /> Sign Out
                  </Button>
                </>
              ) : (
                <div className="flex flex-col gap-2 px-3">
                  <Button variant="outline" size="sm" asChild className="rounded-full">
                    <NavLink to="/auth">Sign In</NavLink>
                  </Button>
                  <Button
                    size="sm"
                    asChild
                    className="rounded-full bg-gradient-to-r from-calm-sage to-calm-lavender text-white"
                  >
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
