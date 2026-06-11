import { NavLink, useLocation } from "react-router-dom";
import { FileText, BookOpen, MessageSquare, Users } from "lucide-react";

const items = [
  { to: "/admin/blog", label: "Blog", icon: BookOpen },
  { to: "/admin/research", label: "Publish Research", icon: FileText },
  { to: "/admin/feedback", label: "Feedback", icon: MessageSquare },
  { to: "/admin/leads", label: "Leads", icon: Users },
];

export default function AdminNav() {
  const { pathname } = useLocation();
  return (
    <div className="max-w-5xl mx-auto px-6 mt-24 mb-6">
      <div className="flex flex-wrap items-center gap-2 p-2 rounded-2xl border border-border bg-card/50">
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground px-3 font-semibold">
          Admin Console
        </span>
        {items.map((i) => {
          const active = pathname === i.to;
          return (
            <NavLink
              key={i.to}
              to={i.to}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <i.icon className="w-3.5 h-3.5" />
              {i.label}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}
