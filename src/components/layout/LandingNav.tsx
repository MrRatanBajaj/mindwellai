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
  <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-xl">
    <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-6">
      <Link to="/" aria-label="WellMindAI home" className="shrink-0">
        <BrandLogo size={52} textClassName="hidden sm:inline" />
      </Link>
      <nav className="hidden md:flex items-center gap-8 text-[15px] text-foreground/75">
        {items.map((it) => (
          <Link key={it.label} to={it.href} className="hover:text-primary transition-colors">
            {it.label}
          </Link>
        ))}
      </nav>
      <Button asChild className="h-11 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground px-6 font-medium shadow-[0_12px_28px_-14px_hsl(var(--primary)/0.9)]">
        <Link to="/auth">Start free <Sparkles className="ml-1.5 h-4 w-4" /></Link>
      </Button>
    </div>
  </header>
);


export default LandingNav;
