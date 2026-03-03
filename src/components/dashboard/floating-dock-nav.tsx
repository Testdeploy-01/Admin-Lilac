import {
  Activity,
  Bell,
  BookOpen,
  Bot,
  CreditCard,
  LayoutDashboard,
  MessageSquare,
  Sprout,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import { FloatingDock } from "@/components/ui/floating-dock";
import { cn } from "@/lib/utils";

type DockItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  activePrefixes: string[];
};

type DockRenderItem = {
  title: string;
  href: string;
  icon: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  variant?: "default" | "logo";
};

const leftDockItems: DockItem[] = [
  { title: "Overview", href: "/overview", icon: LayoutDashboard, activePrefixes: ["/overview"] },
  { title: "Lifestyle", href: "/lifestyle", icon: Sprout, activePrefixes: ["/lifestyle"] },
  { title: "Study", href: "/study-config", icon: BookOpen, activePrefixes: ["/study-config"] },
  { title: "Finance", href: "/finance", icon: Wallet, activePrefixes: ["/finance"] },
];

const rightDockItems: DockItem[] = [
  { title: "AI Manager", href: "/ai-manager", icon: Bot, activePrefixes: ["/ai-manager"] },
  { title: "Users", href: "/user-management", icon: Users, activePrefixes: ["/user-management"] },
  { title: "Subscriptions", href: "/subscriptions", icon: CreditCard, activePrefixes: ["/subscriptions"] },
  { title: "App Health", href: "/app-health", icon: Activity, activePrefixes: ["/app-health"] },
  { title: "Notify", href: "/notifications", icon: Bell, activePrefixes: ["/notifications"] },
  { title: "Feedback", href: "/feedback", icon: MessageSquare, activePrefixes: ["/feedback"] },
];

function isRouteActive(pathname: string, prefixes: string[]) {
  return prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function FloatingDockNav() {
  const { pathname } = useLocation();

  const toRenderItem = (item: DockItem): DockRenderItem => {
    const Icon = item.icon;
    const active = isRouteActive(pathname, item.activePrefixes);
    return {
      title: item.title,
      href: item.href,
      active,
      icon: <Icon className={cn("h-full w-full", active ? "text-foreground" : "text-muted-foreground")} />,
    };
  };

  const items: DockRenderItem[] = [
    ...leftDockItems.map(toRenderItem),
    {
    title: "Lilac",
    href: "#",
    disabled: true,
    variant: "logo",
    icon: <img src="/Logo.png" alt="Lilac logo" className="h-full w-full object-contain" />,
    },
    ...rightDockItems.map(toRenderItem),
  ];

  return (
    <FloatingDock
      items={items}
      desktopClassName="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 bg-[rgb(249,250,251)] backdrop-blur-xl"
      mobileClassName="fixed right-5 bottom-5 z-50"
    />
  );
}
