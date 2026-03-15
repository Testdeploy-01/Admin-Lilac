import {
  Bell,
  Bot,
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  Moon,
  Settings,
  Sun,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { FloatingDock } from "@/components/ui/floating-dock";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/app/context/auth-context";
import { pendingUsersCount } from "@/mocks/dashboard-features.mock";
import type { AdminProfile } from "@/types/admin-profile";

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
  onMouseEnter?: () => void;
  onClick?: () => void;
  mobileOnly?: boolean;
};


// Map route path → dynamic import for hover-based prefetch
const routePrefetch: Record<string, () => Promise<unknown>> = {
  "/overview": () => import("../../app/pages/overview-page"),
  "/user-management": () => import("../../app/pages/user-management-page"),
  "/ai-monitor": () => import("../../app/pages/ai-monitor-page"),
  "/finance": () => import("../../app/pages/finance-page"),
  "/notifications": () => import("../../app/pages/notifications-page"),
  "/reports": () => import("../../app/pages/reports-page"),
  "/settings": () => import("../../app/pages/settings-page"),
};

export function prefetchRoute(href: string) {
  routePrefetch[href]?.();
}

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
  /** Mobile-only: show profile avatar + theme toggle inside the dock */
  profile?: AdminProfile;
  theme?: "light" | "dark";
  onToggleTheme?: () => void;
};

export function DockBrandLogo() {
  return (
    <Link to="/overview" className="flex flex-col items-center gap-2.5 group">
      <img
        src="/Logo.webp"
        alt="Lilac logo"
        className="h-14 w-14 object-contain drop-shadow-sm transition-transform duration-200 group-hover:scale-110"
      />
      <span className="text-[11px] font-semibold leading-tight text-muted-foreground tracking-wide">
        Lilac Admin
      </span>
    </Link>
  );
}

export function FloatingDockNav({ onHoverChange, profile, theme, onToggleTheme }: FloatingDockNavProps) {
  const { pathname } = useLocation();
  const { isOwner } = useAuth();

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
      // Prefetch the page chunk when user hovers the dock item
      onMouseEnter: item.href ? () => prefetchRoute(item.href!) : undefined,
    };
  };

  const filteredRightItems = isOwner
    ? rightDockItems
    : rightDockItems.filter((item) => item.href !== "/settings");

  // Mobile-only: profile avatar (navigates to /settings)
  const mobileProfileItem: DockRenderItem | null = profile
    ? {
        title: "โปรไฟล์",
        variant: "avatar",
        mobileOnly: true,
        href: "/settings",
        icon: (
          <Avatar className="h-full w-full">
            <AvatarImage src={profile.avatarUrl || ""} alt={profile.name} />
            <AvatarFallback className="bg-primary/20 text-[10px] font-semibold text-foreground">
              {profile.name.split(" ").filter(Boolean).map((p) => p[0]).join("").slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        ),
      }
    : null;

  // Mobile-only: theme toggle button
  const mobileThemeItem: DockRenderItem | null =
    onToggleTheme != null && theme != null
      ? {
          title: theme === "dark" ? "โหมดสว่าง" : "โหมดมืด",
          mobileOnly: true,
          icon: theme === "dark"
            ? <Sun className="h-full w-full text-muted-foreground" />
            : <Moon className="h-full w-full text-muted-foreground" />,
          onClick: onToggleTheme,
        }
      : null;

  const items: DockRenderItem[] = [
    ...leftDockItems.map(toRenderItem),
    ...filteredRightItems.map(toRenderItem),
    ...(mobileProfileItem ? [mobileProfileItem] : []),
    ...(mobileThemeItem ? [mobileThemeItem] : []),
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
