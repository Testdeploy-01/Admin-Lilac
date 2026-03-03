import { useEffect, useLayoutEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { DashboardUIProvider, useDashboardUI } from "@/app/context/dashboard-ui-context";
import { DashboardCommandCenter } from "@/components/dashboard/dashboard-command-center";
import { cn } from "@/lib/utils";
import { FloatingDockNav } from "../../components/dashboard/floating-dock-nav";
import { TopRightControls } from "../../components/dashboard/top-right-controls";
import { adminProfileMock } from "../../mocks/admin-profile.mock";

const THEME_KEY = "mockup-theme";

function getInitialTheme(): "light" | "dark" {
  if (typeof window === "undefined") {
    return "light";
  }

  const savedTheme = window.localStorage.getItem(THEME_KEY);
  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function DashboardLayout() {
  const [theme, setTheme] = useState<"light" | "dark">(getInitialTheme);
  const location = useLocation();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <DashboardUIProvider>
      <DashboardLayoutFrame
        theme={theme}
        pathname={location.pathname}
        onToggleTheme={() => setTheme(theme === "dark" ? "light" : "dark")}
      />
    </DashboardUIProvider>
  );
}

type DashboardLayoutFrameProps = {
  theme: "light" | "dark";
  pathname: string;
  onToggleTheme: () => void;
};

function DashboardLayoutFrame({ theme, pathname, onToggleTheme }: DashboardLayoutFrameProps) {
  const { refreshTick } = useDashboardUI();
  const [dockHovered, setDockHovered] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen flex-col">
        <TopRightControls theme={theme} onToggleTheme={onToggleTheme} profile={adminProfileMock} />
        <main className="flex-1 bg-background px-4 pt-10 pb-24 sm:px-6 sm:pt-10 sm:pb-28 md:pl-32 lg:px-8 lg:pl-36 lg:pt-10 lg:pb-32">
          <div className={cn("ml-auto w-full max-w-[110rem] transition-[filter] duration-200", dockHovered && "blur-[2px]")}>
            <Outlet key={`${pathname}-${refreshTick}`} />
          </div>
        </main>
        <DashboardCommandCenter />
        <FloatingDockNav onHoverChange={setDockHovered} />
      </div>
    </div>
  );
}
