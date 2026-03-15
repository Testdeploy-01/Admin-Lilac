import { LogOut, Moon, Sun } from "lucide-react";
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
import { useAuth } from "@/app/context/auth-context";
import type { AdminProfile } from "@/types/admin-profile";

interface TopRightControlsProps {
  theme: "light" | "dark";
  onToggleTheme: () => void;
  profile: AdminProfile;
  className?: string;
  profileMenuSide?: "top" | "right";
  profileMenuAlign?: "start" | "center" | "end";
  profileMenuOffset?: number;
}

export function TopRightControls({
  theme,
  onToggleTheme,
  profile,
  className,
  profileMenuSide = "top",
  profileMenuAlign = "end",
  profileMenuOffset = 4,
}: TopRightControlsProps) {
  const navigate = useNavigate();
  const { isOwner, logout } = useAuth();

  const initials = profile.name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const onLogout = () => {
    logout();
    navigate("/login", { replace: true });
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
          <DropdownMenuContent
            side={profileMenuSide}
            align={profileMenuAlign}
            sideOffset={profileMenuOffset}
            collisionPadding={16}
            className="w-52 rounded-xl"
          >
            <DropdownMenuLabel>
              <p className="truncate text-sm font-semibold text-foreground">{profile.name}</p>
              <span className={cn(
                "mt-1.5 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide",
                isOwner
                  ? "bg-[hsl(var(--primary)/0.15)] text-primary"
                  : "bg-muted text-muted-foreground"
              )}>
                {isOwner ? "System Owner" : "Admin"}
              </span>
            </DropdownMenuLabel>
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
          <TooltipContent>{theme === "dark" ? "เปลี่ยนเป็นโหมดสว่าง" : "เปลี่ยนเป็นโหมดมืด"}</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
