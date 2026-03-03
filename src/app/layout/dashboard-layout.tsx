import { useEffect, useLayoutEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { TopRightControls } from "../../components/dashboard/top-right-controls";
import { FloatingDockNav } from "../../components/dashboard/floating-dock-nav";
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
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen flex-col">
        <TopRightControls
          theme={theme}
          onToggleTheme={() => setTheme(theme === "dark" ? "light" : "dark")}
          profile={adminProfileMock}
        />
        <main className="flex-1 bg-background px-4 pt-14 pb-24 sm:px-6 sm:pt-16 sm:pb-28 lg:px-8 lg:pt-20 lg:pb-32">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
        <FloatingDockNav />
      </div>
    </div>
  );
}
