"use client";
/**
 * Note: Use position fixed according to your needs
 * Desktop navbar is better positioned at the bottom
 * Mobile navbar is better positioned at bottom right.
 **/

import { cn } from "@/lib/utils";
import { PanelBottomClose } from "lucide-react";
import {
  AnimatePresence,
  LayoutGroup,
  MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { Link } from "react-router-dom";

import { useId, useRef, useState, type CSSProperties, type MouseEvent as ReactMouseEvent } from "react";

type DockItem = {
  title: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: (event: ReactMouseEvent<HTMLElement>) => void;
  onMouseEnter?: (event: ReactMouseEvent<HTMLElement>) => void;
  onMouseLeave?: (event: ReactMouseEvent<HTMLElement>) => void;
  active?: boolean;
  disabled?: boolean;
  variant?: "default" | "logo" | "avatar";
  badge?: number;
  align?: "default" | "bottom";
};

type DockOrientation = "horizontal" | "vertical";

export const FloatingDock = ({
  items,
  desktopClassName,
  mobileClassName,
  desktopOrientation = "horizontal",
  onDockHoverChange,
}: {
  items: DockItem[];
  desktopClassName?: string;
  mobileClassName?: string;
  desktopOrientation?: DockOrientation;
  onDockHoverChange?: (hovered: boolean) => void;
}) => {
  return (
    <>
      <FloatingDockDesktop
        items={items}
        className={desktopClassName}
        orientation={desktopOrientation}
        onDockHoverChange={onDockHoverChange}
      />
      <FloatingDockMobile items={items} className={mobileClassName} />
    </>
  );
};

const FloatingDockMobile = ({
  items,
  className,
}: {
  items: DockItem[];
  className?: string;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={cn("relative block md:hidden", className)}>
      <AnimatePresence>
        {open && (
          <motion.div
            layoutId="nav"
            className="absolute inset-x-0 bottom-full mb-2 flex flex-col gap-2"
          >
            {items.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: 10,
                  transition: {
                    delay: idx * 0.05,
                  },
                }}
                transition={{ delay: (items.length - 1 - idx) * 0.05 }}
                className="relative"
              >
                <DockLink
                  href={item.href}
                  onClick={(event) => {
                    item.onClick?.(event);
                    setOpen(false);
                  }}
                  disabled={item.disabled}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card shadow-sm"
                >
                  <div
                    className={cn(
                      item.variant === "logo"
                        ? "h-full w-full overflow-hidden rounded-full"
                        : item.variant === "avatar"
                          ? "h-full w-full overflow-hidden rounded-full"
                          : "h-4 w-4",
                    )}
                  >
                    {item.icon}
                  </div>
                </DockLink>
                {item.badge && item.badge > 0 ? (
                  <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white">
                    {item.badge}
                  </span>
                ) : null}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setOpen(!open)}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card shadow-sm"
      >
        <PanelBottomClose className="h-5 w-5 text-muted-foreground" />
      </button>
    </div>
  );
};



function clampNumber(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}



const FloatingDockDesktop = ({
  items,
  className,
  orientation,
  onDockHoverChange,
}: {
  items: DockItem[];
  className?: string;
  orientation: DockOrientation;
  onDockHoverChange?: (hovered: boolean) => void;
}) => {
  const dockInstanceId = useId();
  const pointer = useMotionValue(Infinity);
  const hoverProgressRaw = useMotionValue(0);
  const hoverProgress = useSpring(hoverProgressRaw, {
    mass: 0.25,
    stiffness: 180,
    damping: 24,
  });
  // Always use scale 1 so UI relies on standard browser zoom vs shrinking the viewport multiplier
  const dockScale = 1;
  const verticalDockStyle: CSSProperties | undefined =
    orientation === "vertical"
      ? {
        width: "var(--dock-rail-w, 4.5rem)",
        borderRadius: "1.25rem",
        paddingInline: "0.75rem",
        paddingBlock: "1rem",
        gap: "1rem",
      }
      : undefined;

  return (
    <motion.div
      layoutScroll
      className={cn(
        "fixed z-30",
        orientation === "vertical"
          ? "left-[var(--dock-left,1.5rem)] top-1/2 -translate-y-1/2 hidden items-center rounded-2xl border border-border bg-card shadow-sm md:flex md:flex-col"
          : "bottom-6 left-1/2 -translate-x-1/2 hidden h-16 items-end gap-4 rounded-2xl border border-border bg-card px-4 pb-3 shadow-sm md:flex",
        className,
      )}
      style={verticalDockStyle}
      onMouseMove={(e) => pointer.set(orientation === "vertical" ? e.clientY : e.clientX)}
      onMouseEnter={() => {
        hoverProgressRaw.set(1);
        onDockHoverChange?.(true);
      }}
      onMouseLeave={() => {
        pointer.set(Infinity);
        hoverProgressRaw.set(0);
        onDockHoverChange?.(false);
      }}
    >
      <LayoutGroup id={`dock-active-indicator-${dockInstanceId}`}>
        {items.map((item) => (
          <IconContainer
            pointer={pointer}
            hoverProgress={hoverProgress}
            orientation={orientation}
            dockScale={dockScale}
            key={item.title}
            {...item}
          />
        ))}
      </LayoutGroup>
    </motion.div>
  );
};

function IconContainer({
  pointer,
  hoverProgress,
  orientation,
  dockScale,
  title,
  icon,
  href,
  onClick,
  onMouseEnter,
  onMouseLeave,
  active = false,
  disabled,
  variant = "default",
  badge,
  align = "default",
}: {
  pointer: MotionValue;
  hoverProgress: MotionValue<number>;
  orientation: DockOrientation;
  dockScale: number;
  title: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: (event: ReactMouseEvent<HTMLElement>) => void;
  onMouseEnter?: (event: ReactMouseEvent<HTMLElement>) => void;
  onMouseLeave?: (event: ReactMouseEvent<HTMLElement>) => void;
  active?: boolean;
  disabled?: boolean;
  variant?: "default" | "logo" | "avatar";
  badge?: number;
  align?: "default" | "bottom";
}) {
  const ref = useRef<HTMLDivElement>(null);

  const distance = useTransform(pointer, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, y: 0, width: 0, height: 0 };
    return orientation === "vertical"
      ? val - bounds.y - bounds.height / 2
      : val - bounds.x - bounds.width / 2;
  });

  const distanceRange: number[] = [-150 * dockScale, 0, 150 * dockScale];
  const defaultContainerRange: number[] = [40 * dockScale, 74 * dockScale, 40 * dockScale];
  const logoContainerRange: number[] = [48 * dockScale, 84 * dockScale, 48 * dockScale];
  const widthTransform = useTransform(
    distance,
    distanceRange,
    variant === "logo" ? logoContainerRange : defaultContainerRange,
  );
  const heightTransform = useTransform(
    distance,
    distanceRange,
    variant === "logo" ? logoContainerRange : defaultContainerRange,
  );

  const defaultIconRange: number[] = [20 * dockScale, 34 * dockScale, 20 * dockScale];
  const avatarIconRange: number[] = [22 * dockScale, 40 * dockScale, 22 * dockScale];
  const logoIconRange: number[] = [24 * dockScale, 44 * dockScale, 24 * dockScale];

  const widthTransformIcon = useTransform(
    distance,
    distanceRange,
    variant === "logo" ? logoIconRange : variant === "avatar" ? avatarIconRange : defaultIconRange,
  );
  const heightTransformIcon = useTransform(
    distance,
    distanceRange,
    variant === "logo" ? logoIconRange : variant === "avatar" ? avatarIconRange : defaultIconRange,
  );

  const containerMin = variant === "logo" ? logoContainerRange[0] : defaultContainerRange[0];
  const iconMin = variant === "logo" ? logoIconRange[0] : variant === "avatar" ? avatarIconRange[0] : defaultIconRange[0];

  const widthTarget = useTransform([widthTransform, hoverProgress], ([target, progress]) => {
    const targetValue = Number(target);
    const progressValue = Number(progress);
    return containerMin + (targetValue - containerMin) * progressValue;
  });
  const heightTarget = useTransform([heightTransform, hoverProgress], ([target, progress]) => {
    const targetValue = Number(target);
    const progressValue = Number(progress);
    return containerMin + (targetValue - containerMin) * progressValue;
  });
  const widthIconTarget = useTransform([widthTransformIcon, hoverProgress], ([target, progress]) => {
    const targetValue = Number(target);
    const progressValue = Number(progress);
    return iconMin + (targetValue - iconMin) * progressValue;
  });
  const heightIconTarget = useTransform([heightTransformIcon, hoverProgress], ([target, progress]) => {
    const targetValue = Number(target);
    const progressValue = Number(progress);
    return iconMin + (targetValue - iconMin) * progressValue;
  });

  const springConfig = { mass: 0.25, stiffness: 140, damping: 22 };
  const width = useSpring(widthTarget, springConfig);
  const height = useSpring(heightTarget, springConfig);
  const widthIcon = useSpring(widthIconTarget, springConfig);
  const heightIcon = useSpring(heightIconTarget, springConfig);

  const [hovered, setHovered] = useState(false);
  const showLogo = variant === "logo";
  const badgeSize = clampNumber(16 * dockScale, 14, 18);
  const badgeFontSize = clampNumber(10 * dockScale, 9, 11);
  const activeDotSize = clampNumber(6 * dockScale, 5, 7);

  return (
    <DockLink
      href={href}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      disabled={disabled}
      className={cn(orientation === "vertical" && align === "bottom" && "mt-auto")}
    >
      <motion.div
        ref={ref}
        style={{ width, height }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={cn(
          "relative flex aspect-square items-center justify-center rounded-full border border-border bg-card shadow-sm",
          (variant === "avatar" || variant === "logo") && "overflow-hidden p-0",
        )}
      >
        <AnimatePresence>
          {hovered && !showLogo && (
            <div
              className={cn(
                "w-fit rounded-md border border-border bg-muted px-2 py-0.5 text-xs whitespace-pre text-foreground",
                orientation === "vertical" ? "absolute left-full top-1/2 ml-2" : "absolute -top-8 left-1/2",
              )}
              style={orientation === "vertical" ? { transform: "translateY(-50%)" } : { transform: "translateX(-50%)" }}
            >
              {title}
            </div>
          )}
        </AnimatePresence>
        <motion.div
          style={{ width: widthIcon, height: heightIcon }}
          className={cn(
            "flex items-center justify-center transform-gpu will-change-auto",
            (variant === "avatar" || variant === "logo") && "h-full w-full overflow-hidden rounded-full",
          )}
        >
          {icon}
        </motion.div>
        {badge && badge > 0 && !showLogo ? (
          <span
            className="absolute -right-1 -top-1 inline-flex items-center justify-center rounded-full bg-rose-500 px-1 font-semibold text-white"
            style={{
              height: `${badgeSize}px`,
              minWidth: `${badgeSize}px`,
              fontSize: `${badgeFontSize}px`,
              lineHeight: 1,
            }}
          >
            {badge}
          </span>
        ) : null}
        {active && !showLogo ? (
          <motion.span
            layoutId="dock-active-indicator"
            initial={false}
            transition={{ type: "spring", stiffness: 300, damping: 34, mass: 0.9 }}
            className={cn(
              "absolute rounded-full bg-primary",
              orientation === "vertical" ? "-right-1.5 top-1/2 -translate-y-1/2" : "-bottom-1.5",
            )}
            style={{ width: `${activeDotSize}px`, height: `${activeDotSize}px` }}
          />
        ) : null}

      </motion.div>
    </DockLink>
  );
}

function DockLink({
  href,
  onClick,
  onMouseEnter,
  onMouseLeave,
  disabled,
  children,
  className,
}: {
  href?: string;
  onClick?: (event: ReactMouseEvent<HTMLElement>) => void;
  onMouseEnter?: (event: ReactMouseEvent<HTMLElement>) => void;
  onMouseLeave?: (event: ReactMouseEvent<HTMLElement>) => void;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  if (disabled) {
    return (
      <div className={cn(className, "cursor-default")} aria-hidden="true">
        {children}
      </div>
    );
  }

  if (href && href.startsWith("/")) {
    return (
      <Link to={href} className={className} onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        {children}
      </Link>
    );
  }

  if (!href && onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={cn("cursor-pointer", className)}
      >
        {children}
      </button>
    );
  }

  if (href) {
    return (
      <a href={href} className={className} onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        {children}
      </a>
    );
  }

  return (
    <div className={className} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      {children}
    </div>
  );
}
