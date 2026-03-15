import { startTransition, useEffect, useState, type CSSProperties } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { DashboardUIProvider, useDashboardUI } from "@/app/context/dashboard-ui-context";
import { useAuth } from "@/app/context/auth-context";
import { DashboardCommandCenter } from "@/components/dashboard/dashboard-command-center";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { DockBrandLogo, FloatingDockNav } from "../../components/dashboard/floating-dock-nav";
import { TopRightControls } from "../../components/dashboard/top-right-controls";

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

  useEffect(() => {
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
  const { profile } = useAuth();
  const [dockHovered, setDockHovered] = useState(false);
  // RequireAuth guarantees profile is non-null inside DashboardLayout
  if (!profile) return null;
  const activeProfile = profile;
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
    "--dashboard-top-gap": "0.5rem",
    "--dashboard-bottom-gap": "1rem",
    "--dock-brand-top-gap": "2.25rem",
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground" style={dockLayoutVars}>
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-25">
        <BackgroundBeams />
      </div>
      <div className="flex min-h-screen flex-col">
        {/* Desktop Sidebar Wrapper */}
        <aside className="pointer-events-none fixed inset-y-0 left-[var(--dock-left,1.5rem)] z-30 hidden w-[var(--dock-rail-w,4.5rem)] flex-col items-center md:flex"
        >
          <div className="pointer-events-auto pt-[var(--dock-brand-top-gap)]">
            <DockBrandLogo />
          </div>
          <div className="pointer-events-auto flex flex-1 flex-col items-center justify-center">
            <div className="h-4" />
            <FloatingDockNav onHoverChange={handleDockHoverChange} />
          </div>
          <div className="pointer-events-auto pb-5">
            <TopRightControls
              theme={theme}
              onToggleTheme={onToggleTheme}
              profile={activeProfile}
              profileMenuSide="right"
              profileMenuAlign="end"
              profileMenuOffset={12}
            />
          </div>
        </aside>

        {/* Mobile View TopRightControls (FloatingDockNav handles its own mobile view) */}
        <div className="md:hidden">
          <TopRightControls
            theme={theme}
            onToggleTheme={onToggleTheme}
            profile={activeProfile}
            profileMenuSide="top"
            profileMenuAlign="end"
            profileMenuOffset={8}
            className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(0.75rem,env(safe-area-inset-right))] z-40 sm:bottom-6 sm:right-4"
          />
        </div>

        <main className="flex-1 overflow-auto bg-background px-4 pt-[var(--dashboard-top-gap)] pb-[var(--dashboard-bottom-gap)] sm:px-6 sm:pt-[var(--dashboard-top-gap)] sm:pb-[var(--dashboard-bottom-gap)] md:pl-[var(--dock-main-offset)] lg:pr-8 lg:pl-[var(--dock-main-offset)] lg:pt-[var(--dashboard-top-gap)] lg:pb-[var(--dashboard-bottom-gap)]">
          {/* Overlay to handle blur cleanly without lagging the first hover calculation */}
          <div
            className="pointer-events-none fixed inset-0 z-10 bg-background/5 transition-opacity duration-300"
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
