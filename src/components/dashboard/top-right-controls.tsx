import { LogOut, Moon, Settings, Sun, User } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import type { AdminProfile } from "@/types/admin-profile";

interface TopRightControlsProps {
  theme: "light" | "dark";
  onToggleTheme: () => void;
  profile: AdminProfile;
  className?: string; // <--- allow class override
}

export function TopRightControls({ theme, onToggleTheme, profile, className }: TopRightControlsProps) {
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [avatarFailed, setAvatarFailed] = useState(false);

  const initials = profile.name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const controlButtonSizeStyle: CSSProperties = {
    width: "var(--dock-control-size, 2.5rem)",
    height: "var(--dock-control-size, 2.5rem)",
  };
  const avatarSizeStyle: CSSProperties = {
    width: "calc(var(--dock-control-size, 2.5rem) - 0.5rem)",
    height: "calc(var(--dock-control-size, 2.5rem) - 0.5rem)",
  };
  const iconSizeStyle: CSSProperties = {
    width: "calc(var(--dock-control-size, 2.5rem) * 0.44)",
    height: "calc(var(--dock-control-size, 2.5rem) * 0.44)",
  };

  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (target && !menuRef.current?.contains(target)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const closeMenu = () => setOpen(false);

  const onOpenProfile = () => {
    closeMenu();
    navigate("/user-management");
  };

  const onLogout = () => {
    window.localStorage.removeItem("mockup-theme");
    closeMenu();
    navigate("/", { replace: true });
  };

  return (
    <div className={cn("flex w-12 flex-col items-center gap-2", className)}>
      <div ref={menuRef} className="relative">
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          style={controlButtonSizeStyle}
          className={cn(
            "inline-flex cursor-pointer items-center justify-center rounded-full bg-card/85 p-0.5 shadow-lg backdrop-blur transition-colors duration-200 hover:bg-primary-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            open && "bg-primary-soft",
          )}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls="admin-profile-menu"
          aria-label="Open profile menu"
        >
          {avatarFailed || !profile.avatarUrl ? (
            <div
              className="grid place-items-center rounded-full bg-primary-soft font-semibold text-foreground"
              style={{ ...avatarSizeStyle, fontSize: "clamp(0.625rem, 0.75vw, 0.75rem)" }}
            >
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
              className="rounded-full object-cover"
              style={avatarSizeStyle}
            />
          )}
        </button>

        {open ? (
          <div
            id="admin-profile-menu"
            role="menu"
            className="absolute bottom-full right-0 mb-2 min-w-[180px] rounded-xl bg-card p-1.5 shadow-xl md:min-w-[190px] xl:right-auto xl:left-full xl:bottom-auto xl:-bottom-1 xl:mb-0 xl:ml-3"
          >
            <div className="rounded-lg px-2.5 py-2">
              <p className="truncate text-sm font-semibold text-foreground">{profile.name}</p>
              <p className="truncate text-xs text-muted-foreground">{profile.email}</p>
            </div>

            <button
              type="button"
              role="menuitem"
              onClick={onOpenProfile}
              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm text-foreground transition-colors duration-200 hover:bg-primary-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <User className="h-4 w-4 text-muted-foreground" />
              <span>ดูโปรไฟล์</span>
            </button>

            <Link
              to="/settings"
              role="menuitem"
              onClick={closeMenu}
              className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-foreground transition-colors duration-200 hover:bg-primary-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Settings className="h-4 w-4 text-muted-foreground" />
              <span>ตั้งค่า</span>
            </Link>

            <button
              type="button"
              role="menuitem"
              onClick={onLogout}
              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm text-foreground transition-colors duration-200 hover:bg-primary-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <LogOut className="h-4 w-4 text-muted-foreground" />
              <span>ออกจากระบบ</span>
            </button>
          </div>
        ) : null}
      </div>

      <button
        type="button"
        onClick={onToggleTheme}
        style={controlButtonSizeStyle}
        className="inline-flex cursor-pointer items-center justify-center rounded-full bg-card/85 text-muted-foreground shadow-lg backdrop-blur transition-colors duration-200 hover:bg-primary-soft hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Toggle theme"
      >
        {theme === "dark" ? <Sun style={iconSizeStyle} /> : <Moon style={iconSizeStyle} />}
      </button>
    </div>
  );
}
