import { Button } from "@/components/ui/button";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Menu, X, LogOut, BookOpen, Calendar, Phone,
  Crown, Gift, Sparkles, ChevronDown, User,
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
      toast.success("See you soon");
      navigate("/");
    } catch {
      toast.error("Couldn't sign out");
    }
  };

  const primaryLinks = user ? [
    { to: "/dashboard", label: "Home", icon: User },
    { to: "/journal", label: "Journal", icon: BookOpen },
    { to: "/consultation/video", label: "Video", icon: Calendar },
    { to: "/consultation/audio", label: "Audio", icon: Phone },
  ] : [];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-background/90 backdrop-blur-md py-1 border-b-2 border-foreground/10"
          : "bg-transparent py-2"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex items-center justify-between gap-2">
          {/* Hand-drawn brand */}
          <NavLink to="/" className="flex items-center gap-2 group">
            <span className="w-9 h-9 rounded-full bg-primary/90 flex items-center justify-center border-2 border-foreground/80 shadow-pencil">
              <span className="font-hand text-primary-foreground text-xl leading-none">W</span>
            </span>
            <span className="font-display text-xl font-semibold text-foreground hidden sm:inline">
              wellmind
            </span>
          </NavLink>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {primaryLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `relative flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-secondary text-foreground border-2 border-foreground/80"
                      : "text-foreground/70 hover:text-foreground hover:bg-card/60"
                  }`
                }
              >
                <link.icon className="w-3.5 h-3.5" />
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Auth */}
          <div className="hidden lg:flex items-center gap-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="rounded-full h-10 px-2 gap-2">
                    <div className="w-8 h-8 rounded-full bg-secondary border-2 border-foreground/80 flex items-center justify-center text-foreground text-sm font-bold">
                      {user.email?.[0]?.toUpperCase() || "U"}
                    </div>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-2 pastel-card p-2">
                  <div className="px-2 py-2 text-xs text-muted-foreground truncate">{user.email}</div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                    <User className="w-4 h-4 mr-2" /> Home
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/subscription")}>
                    <Crown className="w-4 h-4 mr-2" /> Plan & usage
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/referrals")}>
                    <Gift className="w-4 h-4 mr-2" /> Refer
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                    <LogOut className="w-4 h-4 mr-2" /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild className="rounded-full font-semibold">
                  <NavLink to="/auth">Sign in</NavLink>
                </Button>
                <Button
                  size="sm"
                  asChild
                  className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground border-2 border-foreground/80 shadow-pencil font-semibold"
                >
                  <NavLink to="/auth">
                    <Sparkles className="w-3.5 h-3.5 mr-1" /> Start
                  </NavLink>
                </Button>
              </>
            )}
          </div>

          <button
            className="lg:hidden p-2 rounded-full hover:bg-card/60"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden mt-3 pb-3 pt-3 px-1 pastel-card">
            <nav className="flex flex-col gap-1">
              {primaryLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-secondary/60 text-sm font-semibold"
                >
                  <link.icon className="w-4 h-4" /> {link.label}
                </NavLink>
              ))}
              <div className="border-t-2 border-foreground/10 my-3" />
              {user ? (
                <>
                  <div className="text-xs text-muted-foreground px-3 mb-2 truncate">{user.email}</div>
                  <NavLink to="/subscription" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-secondary/60 text-sm">
                    <Crown className="w-4 h-4" /> Plan
                  </NavLink>
                  <NavLink to="/referrals" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-secondary/60 text-sm">
                    <Gift className="w-4 h-4" /> Refer
                  </NavLink>
                  <Button variant="outline" size="sm" onClick={handleSignOut} className="mx-3 mt-2 rounded-full">
                    <LogOut className="w-4 h-4 mr-2" /> Sign out
                  </Button>
                </>
              ) : (
                <div className="flex flex-col gap-2 px-3">
                  <Button variant="outline" size="sm" asChild className="rounded-full"><NavLink to="/auth">Sign in</NavLink></Button>
                  <Button size="sm" asChild className="rounded-full bg-primary text-primary-foreground border-2 border-foreground/80"><NavLink to="/auth">Start</NavLink></Button>
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
