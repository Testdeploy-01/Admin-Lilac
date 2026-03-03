import { Bell, Moon, Search, Sun } from "lucide-react";

interface TopHeaderProps {
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

export function TopHeader({ theme, onToggleTheme }: TopHeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-center border-b border-border bg-card/95 backdrop-blur w-full">
      <div className="flex w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-14 text-sm outline-none ring-offset-background transition focus-visible:ring-2 focus-visible:ring-ring"
          />
          <span className="pointer-events-none absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] uppercase font-semibold text-muted-foreground leading-none">
            Ctrl K
          </span>
        </div>

        <div className="ml-4 flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onToggleTheme}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
