import { motion } from "motion/react";
import { useState } from "react";
import {
  Activity,
  Bell,
  BookOpen,
  Bot,
  CreditCard,
  LayoutDashboard,
  MessageSquare,
  ScrollText,
  Settings,
  Sprout,
  Users,
  Wallet,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { Sidebar as AceternitySidebar, SidebarBody, useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const navGroups = [
  {
    title: "Overview",
    items: [{ to: "/overview", label: "Overview Dashboard", icon: LayoutDashboard }],
  },
  {
    title: "Manage",
    items: [
      { to: "/ai-manager", label: "AI Manager", icon: Bot },
      { to: "/study-config", label: "Study Config", icon: BookOpen },
      { to: "/finance", label: "Finance", icon: Wallet },
      { to: "/lifestyle", label: "Lifestyle Content", icon: Sprout },
    ],
  },
  {
    title: "Users & Sales",
    items: [
      { to: "/user-management", label: "User Management", icon: Users },
      { to: "/subscriptions", label: "Subscriptions Plan", icon: CreditCard },
    ],
  },
  {
    title: "System",
    items: [
      { to: "/notifications", label: "Notifications Broadcast", icon: Bell },
      { to: "/settings", label: "System Settings", icon: Settings },
      { to: "/app-health", label: "App Health", icon: Activity },
      { to: "/logs", label: "System Logs Feed", icon: ScrollText },
      { to: "/feedback", label: "Customer Feedback", icon: MessageSquare },
    ],
  },
];

export function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <AceternitySidebar open={open} setOpen={setOpen}>
      <SidebarBody className="h-full justify-between gap-10 px-3 py-4">
        <SidebarNav />
      </SidebarBody>
    </AceternitySidebar>
  );
}

function SidebarNav() {
  const { open, animate } = useSidebar();
  const shouldShowLabel = !animate || open;
  const iconOnly = !shouldShowLabel;

  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden px-1">
        {shouldShowLabel ? <SidebarLogo /> : <SidebarLogoIcon />}

        <nav className="space-y-4">
          {navGroups.map((group) => (
            <div key={group.title} className="space-y-1.5">
              <motion.p
                animate={{ display: shouldShowLabel ? "block" : "none", opacity: shouldShowLabel ? 1 : 0 }}
                className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
              >
                {group.title}
              </motion.p>
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink key={item.to} to={item.to} title={item.label}>
                    {({ isActive }) => (
                      <div
                        className={cn(
                          "group/sidebar relative flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all",
                          iconOnly && "justify-center px-0",
                          "text-muted-foreground hover:bg-accent/60 hover:text-accent-foreground",
                          isActive && "bg-primary-soft text-primary",
                        )}
                      >
                        <span
                          className={cn(
                            "absolute left-0 top-1/2 h-7 w-0.5 -translate-y-1/2 rounded-full bg-primary transition-opacity",
                            isActive ? "opacity-100" : "opacity-0",
                          )}
                        />
                        <Icon className="h-5 w-5 shrink-0" />
                        <motion.span
                          animate={{ display: shouldShowLabel ? "inline-block" : "none", opacity: shouldShowLabel ? 1 : 0 }}
                          className="inline-block whitespace-nowrap transition duration-150 group-hover/sidebar:translate-x-0.5"
                        >
                          {item.label}
                        </motion.span>
                      </div>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      <div className="flex flex-col gap-2 px-1 pb-1">
        <div className="flex items-center justify-center">
          <div className="h-1 w-12 rounded-full bg-border/60" />
        </div>
        <NavLink
          to="/settings"
          className={cn(
            "group/sidebar relative flex items-center gap-2 rounded-xl border border-white/10 bg-card/60 px-2 py-2 text-sm shadow-inner",
            iconOnly && "justify-center border-transparent bg-transparent px-0",
          )}
        >
          <img
            src="https://ui.shadcn.com/avatars/01.png"
            alt="Admin avatar"
            className="h-9 w-9 rounded-full border border-border object-cover"
          />
          <motion.div
            animate={{ display: shouldShowLabel ? "block" : "none", opacity: shouldShowLabel ? 1 : 0 }}
            className="min-w-0"
          >
            <p className="truncate text-sm font-semibold text-foreground">Admin User</p>
            <p className="truncate text-xs text-muted-foreground">Superadmin</p>
          </motion.div>
        </NavLink>
      </div>
    </>
  );
}

function SidebarLogo() {
  return (
    <NavLink to="/overview" className="relative z-20 mb-5 flex items-center gap-3 px-2 py-1">
      <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary-soft/70 shadow-inner">
        <img src="/Logo.png" alt="Lilac Admin Logo" className="h-5 w-5 shrink-0 object-contain" />
      </div>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="whitespace-pre text-sm font-semibold leading-tight text-foreground"
      >
        Lilac Admin
        <span className="block text-[11px] font-normal text-muted-foreground">Mockup Workspace</span>
      </motion.span>
    </NavLink>
  );
}

function SidebarLogoIcon() {
  return (
    <NavLink to="/overview" className="relative z-20 mb-5 flex items-center justify-center px-1 py-1">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary-soft/70 shadow-inner">
        <img src="/Logo.png" alt="Lilac Admin Logo" className="h-6 w-6 shrink-0 object-contain" />
      </div>
    </NavLink>
  );
}
