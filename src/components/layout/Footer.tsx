import { NavLink } from "react-router-dom";
import { Heart, Mail } from "lucide-react";

const SUPPORT_EMAIL = "support@wellmindai.in";

const Footer = () => {
  const year = new Date().getFullYear();

  const cols = [
    {
      title: "Talk",
      links: [
        { to: "/consultation", label: "Counselors" },
        { to: "/phone-counselor", label: "Voice call" },
        { to: "/journal", label: "Journal" },
      ],
    },
    {
      title: "Us",
      links: [
        { to: "/about", label: "About" },
        { to: "/careers", label: "Careers" },
        { to: "/blog", label: "Blog" },
      ],
    },
    {
      title: "Care",
      links: [
        { to: "/subscription", label: "Plans" },
        { to: "/referrals", label: "Refer & earn" },
        { to: "/policy", label: "Privacy & terms" },
      ],
    },
  ];

  return (
    <footer className="bg-pastel-cream border-t-2 border-foreground/10 mt-12">
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-10 h-10 rounded-full bg-primary flex items-center justify-center border-2 border-foreground/80 shadow-pencil">
                <span className="font-hand text-primary-foreground text-2xl leading-none">W</span>
              </span>
              <span className="font-display text-2xl font-semibold">wellmind</span>
            </div>
            <p className="font-hand text-xl text-foreground/80 max-w-xs leading-snug">
              drawn with care — like mom's crayons.
            </p>
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="inline-flex items-center gap-2 mt-4 text-sm hover:text-primary transition-colors"
            >
              <Mail className="w-3.5 h-3.5" /> {SUPPORT_EMAIL}
            </a>
          </div>

          {cols.map((c) => (
            <div key={c.title}>
              <h3 className="font-hand text-2xl text-foreground mb-3">{c.title}</h3>
              <ul className="space-y-2">
                {c.links.map((l) => (
                  <li key={l.to}>
                    <NavLink to={l.to} className="text-sm text-foreground/70 hover:text-primary hover:hand-underline transition-colors">
                      {l.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t-2 border-foreground/10 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-xs text-muted-foreground">© {year} WellMind AI</p>
          <p className="text-xs text-muted-foreground inline-flex items-center gap-1">
            made with <Heart className="w-3 h-3 text-primary fill-primary" /> in India
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
