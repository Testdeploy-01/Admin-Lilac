import {
  Bell,
  Bot,
  LayoutDashboard,
  Settings,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import { FloatingDock } from "@/components/ui/floating-dock";
import { cn } from "@/lib/utils";
import { pendingUsersCount } from "@/mocks/dashboard-features.mock";

type DockItem = {
  title: string;
  href?: string;
  icon?: LucideIcon;
  customIcon?: React.ReactNode;
  activePrefixes: string[];
  badge?: number;
  variant?: "default" | "logo" | "avatar";
  align?: "default" | "bottom";
};

type DockRenderItem = {
  title: string;
  href?: string;
  icon: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  variant?: "default" | "logo" | "avatar";
  align?: "default" | "bottom";
  badge?: number;
};

const logoDockItem: DockItem = {
  title: "โลโก้",
  href: "/overview",
  activePrefixes: ["/overview"],
  customIcon: <img src="/Logo.png" alt="Lilac logo" className="h-full w-full rounded-full object-contain bg-primary-soft p-1" />,
  variant: "logo",
};

const leftDockItems: DockItem[] = [
  { title: "แดชบอร์ด", href: "/overview", icon: LayoutDashboard, activePrefixes: ["/overview"] },
  { title: "ผู้ใช้", href: "/user-management", icon: Users, activePrefixes: ["/user-management"], badge: pendingUsersCount },
  { title: "AI Monitor", href: "/ai-monitor", icon: Bot, activePrefixes: ["/ai-monitor"] },
];

const rightDockItems: DockItem[] = [
  { title: "การเงิน", href: "/finance", icon: Wallet, activePrefixes: ["/finance"] },
  { title: "แจ้งเตือน", href: "/notifications", icon: Bell, activePrefixes: ["/notifications"] },
  { title: "ตั้งค่า", href: "/settings", icon: Settings, activePrefixes: ["/settings"] },
];

function isRouteActive(pathname: string, prefixes: string[]) {
  return prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

type FloatingDockNavProps = {
  onHoverChange?: (hovered: boolean) => void;
};

export function FloatingDockNav({ onHoverChange }: FloatingDockNavProps) {
  const { pathname } = useLocation();

  const toRenderItem = (item: DockItem): DockRenderItem => {
    const active = isRouteActive(pathname, item.activePrefixes);
    const iconNode = item.customIcon ? (
      <span className={cn("block h-full w-full rounded-full", active && "ring-2 ring-primary/70 ring-offset-1 ring-offset-background")}>
        {item.customIcon}
      </span>
    ) : item.icon ? (
      <item.icon className={cn("h-full w-full", active ? "text-foreground" : "text-muted-foreground")} />
    ) : null;

    return {
      title: item.title,
      href: item.href,
      active,
      badge: item.badge,
      variant: item.variant,
      align: item.align,
      icon: iconNode,
    };
  };

  const items: DockRenderItem[] = [
    toRenderItem(logoDockItem),
    ...leftDockItems.map(toRenderItem),
    ...rightDockItems.map(toRenderItem),
  ];

  return (
    <FloatingDock
      items={items}
      desktopClassName="z-30"
      mobileClassName="fixed right-4 bottom-6 z-30"
      desktopOrientation="vertical"
      onDockHoverChange={onHoverChange}
    />
  );
}
