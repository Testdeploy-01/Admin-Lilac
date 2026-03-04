import { startTransition, useEffect, useLayoutEffect, useState, type CSSProperties } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { DashboardUIProvider, useDashboardUI } from "@/app/context/dashboard-ui-context";
import { DashboardCommandCenter } from "@/components/dashboard/dashboard-command-center";
import { BackgroundBeams } from "@/components/ui/background-beams";
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
  const handleDockHoverChange = (hovered: boolean) => {
    startTransition(() => {
      setDockHovered(hovered);
    });
  };
  const dockLayoutVars: CSSProperties & Record<string, string> = {
    "--dock-left": "1.5rem",
    "--dock-rail-w": "4.5rem",
    "--dock-gap-main": "1.5rem",
    "--dock-main-offset": "calc(var(--dock-left) + var(--dock-rail-w) + var(--dock-gap-main))",
    "--dock-control-size": "2.5rem",
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground" style={dockLayoutVars}>
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-25">
        <BackgroundBeams />
      </div>
      <div className="flex min-h-screen flex-col">
        {/* Desktop Sidebar Wrapper */}
        <aside className="pointer-events-none fixed inset-y-0 left-[var(--dock-left,1.5rem)] z-30 hidden w-[var(--dock-rail-w,4.5rem)] flex-col items-center justify-center gap-6 md:flex">
          <div className="pointer-events-auto">
            <FloatingDockNav onHoverChange={handleDockHoverChange} />
          </div>
          <div className="pointer-events-auto">
            <TopRightControls theme={theme} onToggleTheme={onToggleTheme} profile={adminProfileMock} />
          </div>
        </aside>

        {/* Mobile View TopRightControls (FloatingDockNav handles its own mobile view) */}
        <div className="md:hidden">
          <TopRightControls
            theme={theme}
            onToggleTheme={onToggleTheme}
            profile={adminProfileMock}
            className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(0.75rem,env(safe-area-inset-right))] z-40 sm:bottom-6 sm:right-4"
          />
        </div>

        <main className="flex-1 bg-background px-4 pt-10 pb-24 sm:px-6 sm:pt-10 sm:pb-28 md:pl-[var(--dock-main-offset)] lg:pr-8 lg:pl-[var(--dock-main-offset)] lg:pt-10 lg:pb-32">
          {/* Overlay to handle blur cleanly without lagging the first hover calculation */}
          <div
            className="pointer-events-none fixed inset-0 z-20 bg-background/5 transition-opacity duration-300"
            style={{
              opacity: dockHovered ? 1 : 0,
              backdropFilter: "blur(2px)",
              WebkitBackdropFilter: "blur(2px)"
            }}
          />
          <div className="ml-auto w-full max-w-[110rem]">
            <Outlet key={`${pathname}-${refreshTick}`} />
          </div>
        </main>
        <DashboardCommandCenter />

        {/* Mobile view of the dock */}
        <div className="md:hidden">
          <FloatingDockNav onHoverChange={handleDockHoverChange} />
        </div>
      </div>
    </div>
  );
}
