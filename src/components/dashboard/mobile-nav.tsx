import { NavLink } from "react-router-dom";
import { cn } from "../../lib/utils";

const mobileNavItems = [
  { to: "/overview", label: "แดชบอร์ด" },
  { to: "/user-management", label: "ผู้ใช้" },
  { to: "/ai-monitor", label: "AI Monitor" },
  { to: "/finance", label: "การเงิน" },
  { to: "/notifications", label: "แจ้งเตือน" },
  { to: "/settings", label: "ตั้งค่า" },
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
