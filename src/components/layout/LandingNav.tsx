import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import BrandLogo from "@/components/layout/BrandLogo";

const items = [
  { label: "Home", href: "/" },
  { label: "Chat with Yaro", href: "/chat/yaro" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Research", href: "/research" },
];

const LandingNav = () => (
  <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md">
    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
      <Link to="/" aria-label="WellMindAI home">
        <BrandLogo size={44} textClassName="hidden sm:inline" />
      </Link>
      <nav className="hidden md:flex items-center gap-8 text-[15px] text-foreground/80">
        {items.map((it) => (
          <Link key={it.label} to={it.href} className="hover:text-foreground transition-colors">
            {it.label}
          </Link>
        ))}
      </nav>
      <Button asChild className="h-11 rounded-full bg-[#2A2522] hover:bg-[#2A2522]/90 text-[#F5EFE6] px-6 font-medium">
        <Link to="/auth">Start free <Sparkles className="ml-1.5 h-4 w-4" /></Link>
      </Button>
    </div>
  </header>
);

export default LandingNav;
