import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoAsset from "@/assets/wellmindai-logo.jpeg.asset.json";

const items = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Research", href: "/judgement-free-space" },
  { label: "News", href: "/blog" },
];

const LandingNav = () => (
  <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md">
    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
      <Link to="/" className="flex items-center gap-2">
        <img
          src={logoAsset.url}
          alt="WellMindAI logo"
          width={40}
          height={40}
          className="h-10 w-10 object-contain rounded-full"
        />
        <span className="font-display text-2xl text-foreground tracking-tight hidden sm:inline">
          WellMindAI
        </span>
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
