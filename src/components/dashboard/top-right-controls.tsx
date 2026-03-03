import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut, Moon, Settings, Sun, User } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";
import type { AdminProfile } from "../../types/admin-profile";

interface TopRightControlsProps {
  theme: "light" | "dark";
  onToggleTheme: () => void;
  profile: AdminProfile;
}

export function TopRightControls({ theme, onToggleTheme, profile }: TopRightControlsProps) {
  const [open, setOpen] = useState(false);
  const [avatarFailed, setAvatarFailed] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const initials = profile.name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (target && !menuRef.current?.contains(target)) {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <div className="fixed top-4 right-4 z-50 flex max-w-[calc(100vw-2rem)] items-center gap-2">
      <button
        type="button"
        onClick={onToggleTheme}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-card/85 text-muted-foreground backdrop-blur transition hover:bg-primary-soft hover:text-foreground"
        aria-label="Toggle theme"
      >
        {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>

      <div ref={menuRef} className="relative">
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="inline-flex h-9 items-center gap-2 rounded-full bg-card/85 px-2.5 text-sm backdrop-blur transition hover:bg-primary-soft"
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls="admin-profile-menu"
        >
          {avatarFailed || !profile.avatarUrl ? (
            <div className="grid h-7 w-7 place-items-center rounded-full bg-primary-soft text-[10px] font-semibold text-foreground">
              {initials}
            </div>
          ) : (
            <img
              src={profile.avatarUrl}
              alt={`${profile.name} avatar`}
              onError={(event) => {
                const image = event.currentTarget;
                if (image.dataset.fallback !== "1") {
                  image.dataset.fallback = "1";
                  image.src = "/admin-avatar.svg";
                } else {
                  setAvatarFailed(true);
                }
              }}
              className="h-7 w-7 rounded-full object-cover"
            />
          )}
          <span className="max-w-32 truncate text-sm font-medium text-foreground">{profile.name}</span>
          <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", open && "rotate-180")} />
        </button>

        {open ? (
          <div
            id="admin-profile-menu"
            role="menu"
            className="absolute right-0 top-full mt-2 min-w-[190px] rounded-xl bg-card p-1.5 shadow-xl"
          >
            <div className="rounded-lg px-2.5 py-2">
              <p className="truncate text-sm font-semibold text-foreground">{profile.name}</p>
              <p className="truncate text-xs text-muted-foreground">{profile.email}</p>
            </div>

            <button
              type="button"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-foreground transition hover:bg-primary-soft"
            >
              <User className="h-4 w-4 text-muted-foreground" />
              <span>Profile</span>
            </button>

            <Link
              to="/settings"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-foreground transition hover:bg-primary-soft"
            >
              <Settings className="h-4 w-4 text-muted-foreground" />
              <span>Settings</span>
            </Link>

            <button
              type="button"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-foreground transition hover:bg-primary-soft"
            >
              <LogOut className="h-4 w-4 text-muted-foreground" />
              <span>Logout</span>
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
