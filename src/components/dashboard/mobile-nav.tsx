import { NavLink } from "react-router-dom";
import { cn } from "../../lib/utils";

const mobileNavItems = [
  { to: "/overview", label: "Overview" },
  { to: "/ai-manager", label: "AI" },
  { to: "/study-config", label: "Study" },
  { to: "/finance", label: "Finance" },
  { to: "/lifestyle", label: "Lifestyle" },
  { to: "/user-management", label: "Users" },
  { to: "/subscriptions", label: "Plans" },
  { to: "/app-health", label: "Health" },
  { to: "/notifications", label: "Notify" },
  { to: "/settings", label: "Settings" },
  { to: "/logs", label: "Logs" },
  { to: "/feedback", label: "Feedback" },
];

export function MobileNav() {
  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-3 sm:px-6">
      {mobileNavItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            cn(
              "whitespace-nowrap rounded-full bg-background px-3 py-1 text-xs font-semibold text-muted-foreground transition",
              "hover:bg-accent hover:text-accent-foreground",
              isActive && "bg-primary text-primary-foreground",
            )
          }
        >
          {item.label}
        </NavLink>
      ))}
    </div>
  );
}
