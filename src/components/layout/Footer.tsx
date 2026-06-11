import { NavLink } from "react-router-dom";
import { Heart, Mail } from "lucide-react";
import wellmindLogo from "@/assets/wellmind-logo.png";

const SUPPORT_EMAIL = "support@wellmindai.in";

const Footer = () => {
  const year = new Date().getFullYear();

  const cols: { title: string; links: { to: string; label: string }[] }[] = [
    {
      title: "Product",
      links: [
        { to: "/self-help", label: "Self Help" },
        { to: "/journal", label: "Journal" },
        { to: "/consultation", label: "Book Counselor" },
        { to: "/business", label: "For Business" },
      ],
    },
    {
      title: "Company",
      links: [
        { to: "/about", label: "About" },
        { to: "/careers", label: "Careers" },
        { to: "/research", label: "Research" },
        { to: "/blog", label: "Blog" },
      ],
    },
    {
      title: "Support",
      links: [
        { to: "/feedback-wall", label: "Feedback Wall" },
        { to: "/policy", label: "Privacy & Terms" },
      ],
    },
  ];

  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          <div className="col-span-2">
            <img
              src={wellmindLogo}
              alt="WellMind AI"
              className="h-10 w-auto bg-card rounded-lg p-1.5 mb-4 border border-border"
            />
            <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
              India's mental health AI platform — 24/7 AI counselors and verified human therapists.
            </p>
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="inline-flex items-center gap-2 mt-4 text-sm text-foreground hover:text-primary transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              {SUPPORT_EMAIL}
            </a>
          </div>

          {cols.map((c) => (
            <div key={c.title}>
              <h3 className="font-semibold text-xs uppercase tracking-widest text-foreground/70 mb-4">
                {c.title}
              </h3>
              <ul className="space-y-2.5">
                {c.links.map((l) => (
                  <li key={l.to}>
                    <NavLink
                      to={l.to}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {l.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-xs text-muted-foreground">
            © {year} WellMind AI. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground inline-flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-primary fill-primary" /> in India
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
