import { Download, RefreshCcw, Route, Search, UserRound } from "lucide-react";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDashboardUI } from "@/app/context/dashboard-ui-context";
import { resolveExportByPath } from "@/app/export/export-resolver";
import { dashboardRouteMeta, findRouteMeta } from "@/app/routes/dashboard-routes";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { Slide } from "@/components/ui/slide";
import { exportCSV } from "@/lib/exporters";
import { managedUsers } from "@/mocks/dashboard-features.mock";

type CommandItemType = "action" | "route" | "user";

type DashboardCommandItem = {
  id: string;
  title: string;
  subtitle: string;
  icon: ReactNode;
  searchText: string;
  type: CommandItemType;
  run: () => void;
};

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }
  const tag = target.tagName.toLowerCase();
  return tag === "input" || tag === "textarea" || tag === "select" || target.isContentEditable;
}

export function DashboardCommandCenter() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { commandOpen, setCommandOpen, triggerRefresh } = useDashboardUI();
  const [query, setQuery] = useState("");
  const currentRoute = findRouteMeta(pathname);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const isSlash = event.key === "/" && !event.metaKey && !event.ctrlKey && !event.altKey;
      if (isSlash && !isEditableTarget(event.target)) {
        event.preventDefault();
        setCommandOpen(true);
        return;
      }
      if (event.key === "Escape") {
        setCommandOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [setCommandOpen]);

  const close = useCallback(() => {
    setCommandOpen(false);
    setQuery("");
  }, [setCommandOpen]);

  const items = useMemo<DashboardCommandItem[]>(() => {
    const routeItems: DashboardCommandItem[] = dashboardRouteMeta.map((route) => ({
      id: `route-${route.key}`,
      title: route.titleTH,
      subtitle: `หน้า ${route.group}`,
      icon: <Route className="h-4 w-4 text-muted-foreground" />,
      type: "route",
      searchText: `${route.titleTH} ${route.group} ${route.searchKeywords.join(" ")}`,
      run: () => {
        navigate(route.path);
        close();
      },
    }));

    const userItems: DashboardCommandItem[] = managedUsers.map((user) => ({
      id: `user-${user.id}`,
      title: `${user.name} (${user.id})`,
      subtitle: `ผู้ใช้ ${user.plan}`,
      icon: <UserRound className="h-4 w-4 text-muted-foreground" />,
      type: "user",
      searchText: `${user.name} ${user.id} ${user.plan} ${user.favoriteCategory}`,
      run: () => {
        navigate(`/user-management?user=${encodeURIComponent(user.id)}`);
        close();
      },
    }));

    const actionItems: DashboardCommandItem[] = [
      {
        id: "action-refresh",
        title: `รีเฟรชหน้า ${currentRoute.titleTH}`,
        subtitle: "Soft refresh หน้าปัจจุบัน",
        icon: <RefreshCcw className="h-4 w-4 text-muted-foreground" />,
        type: "action",
        searchText: `refresh reload รีเฟรช ${currentRoute.titleTH}`,
        run: () => {
          triggerRefresh();
          close();
        },
      },
      {
        id: "action-export",
        title: `ส่งออกข้อมูล ${currentRoute.titleTH}`,
        subtitle: "ดาวน์โหลดเป็น CSV",
        icon: <Download className="h-4 w-4 text-muted-foreground" />,
        type: "action",
        searchText: `export csv ดาวน์โหลด ส่งออก ${currentRoute.titleTH}`,
        run: () => {
          const resolved = resolveExportByPath(pathname);
          exportCSV(resolved.filename, resolved.rows);
          close();
        },
      },
    ];

    return [...actionItems, ...routeItems, ...userItems];
  }, [close, currentRoute.titleTH, navigate, pathname, triggerRefresh]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => `${item.title} ${item.subtitle} ${item.searchText}`.toLowerCase().includes(q));
  }, [items, query]);

  const renderGroup = (type: CommandItemType, heading: string) => {
    const groupItems = filtered.filter((item) => item.type === type);
    if (!groupItems.length) return null;
    return (
      <CommandGroup heading={heading}>
        {groupItems.map((item) => (
          <CommandItem key={item.id} onSelect={item.run}>
            {item.icon}
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-sm font-medium">{item.title}</span>
              <span className="truncate text-xs text-muted-foreground">{item.subtitle}</span>
            </div>
          </CommandItem>
        ))}
      </CommandGroup>
    );
  };

  return (
    <CommandDialog
      open={commandOpen}
      onOpenChange={(open) => {
        setCommandOpen(open);
        if (!open) setQuery("");
      }}
    >
      <Slide from="up" className="w-full">
        <CommandInput value={query} onValueChange={setQuery} placeholder="พิมพ์เพื่อค้นหา หน้า ผู้ใช้ หรือคำสั่ง..." />
        <CommandList>
          <CommandEmpty>ไม่พบผลลัพธ์ที่ตรงกับคำค้นหา</CommandEmpty>
          {renderGroup("action", "Quick Actions")}
          <CommandSeparator />
          {renderGroup("route", "Routes")}
          <CommandSeparator />
          {renderGroup("user", "Users")}
        </CommandList>
        <div className="border-t border-border px-3 py-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <Search className="h-3.5 w-3.5" />
            <span>กด</span>
            <CommandShortcut>/</CommandShortcut>
            <span>เพื่อเปิด และ</span>
            <CommandShortcut>ESC</CommandShortcut>
            <span>เพื่อปิด</span>
          </span>
        </div>
      </Slide>
    </CommandDialog>
  );
}

