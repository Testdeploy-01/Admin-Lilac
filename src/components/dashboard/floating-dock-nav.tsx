import {
  Bell,
  Bot,
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
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


const leftDockItems: DockItem[] = [
  { title: "ภาพรวม", href: "/overview", icon: LayoutDashboard, activePrefixes: ["/overview"] },
  { title: "ผู้ใช้", href: "/user-management", icon: Users, activePrefixes: ["/user-management"], badge: pendingUsersCount },
  { title: "AI Monitor", href: "/ai-monitor", icon: Bot, activePrefixes: ["/ai-monitor"] },
];

const rightDockItems: DockItem[] = [
  { title: "การสมัครสมาชิก", href: "/finance", icon: CreditCard, activePrefixes: ["/finance"] },
  { title: "แจ้งเตือน", href: "/notifications", icon: Bell, activePrefixes: ["/notifications"] },
  { title: "รายงาน", href: "/reports", icon: ClipboardList, activePrefixes: ["/reports"] },
  { title: "ตั้งค่า", href: "/settings", icon: Settings, activePrefixes: ["/settings"] },
];

function isRouteActive(pathname: string, prefixes: string[]) {
  return prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

type FloatingDockNavProps = {
  onHoverChange?: (hovered: boolean) => void;
};

export function DockBrandLogo() {
  return (
    <Link to="/overview" className="flex flex-col items-center gap-2.5 group">
      <img
        src="/Logo.png"
        alt="Lilac logo"
        className="h-14 w-14 object-contain drop-shadow-sm transition-transform duration-200 group-hover:scale-110"
      />
      <span className="text-[11px] font-semibold leading-tight text-muted-foreground tracking-wide">
        Lilac Admin
      </span>
    </Link>
  );
}

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
