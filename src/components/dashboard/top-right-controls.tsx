import { LogOut, Moon, Settings, Sun, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { AdminProfile } from "@/types/admin-profile";

interface TopRightControlsProps {
  theme: "light" | "dark";
  onToggleTheme: () => void;
  profile: AdminProfile;
  className?: string;
}

export function TopRightControls({ theme, onToggleTheme, profile, className }: TopRightControlsProps) {
  const navigate = useNavigate();

  const initials = profile.name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const onOpenProfile = () => {
    navigate("/user-management");
  };

  const onOpenSettings = () => {
    navigate("/settings");
  };

  const onLogout = () => {
    window.localStorage.removeItem("mockup-theme");
    navigate("/", { replace: true });
  };

  return (
    <TooltipProvider delayDuration={200}>
      <div className={cn("flex w-12 flex-col items-center gap-2", className)}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-[var(--dock-control-size,2.5rem)] w-[var(--dock-control-size,2.5rem)] rounded-full bg-card/85 p-0.5 shadow-lg backdrop-blur hover:bg-primary-soft"
              aria-label="Open profile menu"
            >
              <Avatar className="h-[calc(var(--dock-control-size,2.5rem)-0.5rem)] w-[calc(var(--dock-control-size,2.5rem)-0.5rem)]">
                <AvatarImage src={profile.avatarUrl || "/admin-avatar.svg"} alt={`${profile.name} avatar`} />
                <AvatarFallback className="bg-primary-soft text-xs font-semibold text-foreground">{initials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="end" className="w-52 rounded-xl">
            <DropdownMenuLabel>
              <p className="truncate text-sm font-semibold text-foreground">{profile.name}</p>
              <p className="truncate text-xs text-muted-foreground">{profile.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={onOpenProfile} className="cursor-pointer">
              <User className="h-4 w-4 text-muted-foreground" />
              ดูโปรไฟล์
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={onOpenSettings} className="cursor-pointer">
              <Settings className="h-4 w-4 text-muted-foreground" />
              ตั้งค่า
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={onLogout} className="cursor-pointer text-rose-600 focus:text-rose-700">
              <LogOut className="h-4 w-4" />
              ออกจากระบบ
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={onToggleTheme}
              className="h-[var(--dock-control-size,2.5rem)] w-[var(--dock-control-size,2.5rem)] rounded-full bg-card/85 shadow-lg backdrop-blur hover:bg-primary-soft"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-[calc(var(--dock-control-size,2.5rem)*0.44)] w-[calc(var(--dock-control-size,2.5rem)*0.44)]" />
              ) : (
                <Moon className="h-[calc(var(--dock-control-size,2.5rem)*0.44)] w-[calc(var(--dock-control-size,2.5rem)*0.44)]" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}

