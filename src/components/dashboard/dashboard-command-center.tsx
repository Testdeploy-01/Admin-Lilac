import { Download, RefreshCcw, Search, UserRound } from "lucide-react";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDashboardUI } from "@/app/context/dashboard-ui-context";
import { resolveExportByPath } from "@/app/export/export-resolver";
import { dashboardRouteMeta, findRouteMeta } from "@/app/routes/dashboard-routes";
import { exportCSV } from "@/lib/exporters";
import { managedUsers } from "@/mocks/dashboard-features.mock";

type CommandItem = {
  id: string;
  title: string;
  subtitle: string;
  icon: ReactNode;
  searchText: string;
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
        setQuery("");
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [setCommandOpen]);

  const close = useCallback(() => {
    setCommandOpen(false);
    setQuery("");
  }, [setCommandOpen]);

  const items = useMemo<CommandItem[]>(() => {
    const routeItems: CommandItem[] = dashboardRouteMeta.map((route) => ({
      id: `route-${route.key}`,
      title: route.titleTH,
      subtitle: `หน้า ${route.group}`,
      icon: <Search className="h-4 w-4 text-muted-foreground" />,
      searchText: `${route.titleTH} ${route.group} ${route.searchKeywords.join(" ")}`,
      run: () => {
        navigate(route.path);
        close();
      },
    }));

    const userItems: CommandItem[] = managedUsers.map((user) => ({
      id: `user-${user.id}`,
      title: `${user.name} (${user.id})`,
      subtitle: `ผู้ใช้ ${user.plan}`,
      icon: <UserRound className="h-4 w-4 text-muted-foreground" />,
      searchText: `${user.name} ${user.id} ${user.plan} ${user.favoriteCategory}`,
      run: () => {
        navigate(`/user-management?user=${encodeURIComponent(user.id)}`);
        close();
      },
    }));

    const actionItems: CommandItem[] = [
      {
        id: "action-refresh",
        title: `รีเฟรชหน้า ${currentRoute.titleTH}`,
        subtitle: "Soft refresh หน้าปัจจุบัน",
        icon: <RefreshCcw className="h-4 w-4 text-muted-foreground" />,
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
    if (!q) {
      return items;
    }
    return items.filter((item) => `${item.title} ${item.subtitle} ${item.searchText}`.toLowerCase().includes(q));
  }, [items, query]);

  if (!commandOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[70] bg-black/45 p-4 pt-24 sm:pt-28" onClick={close}>
      <section
        role="dialog"
        aria-modal="true"
        aria-label="ค้นหาด่วน"
        className="mx-auto w-full max-w-2xl rounded-xl border border-border bg-card shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="พิมพ์เพื่อค้นหา หน้า ผู้ใช้ หรือคำสั่ง..."
              className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">กด / เพื่อเปิดทุกหน้า • กด ESC เพื่อปิด</p>
        </div>

        <div className="max-h-[360px] overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <p className="rounded-lg px-3 py-6 text-center text-sm text-muted-foreground">ไม่พบผลลัพธ์ที่ตรงกับคำค้นหา</p>
          ) : (
            filtered.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={item.run}
                className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors duration-200 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span>{item.icon}</span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-foreground">{item.title}</span>
                  <span className="block truncate text-xs text-muted-foreground">{item.subtitle}</span>
                </span>
              </button>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
