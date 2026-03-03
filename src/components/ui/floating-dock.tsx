"use client";
/**
 * Note: Use position fixed according to your needs
 * Desktop navbar is better positioned at the bottom
 * Mobile navbar is better positioned at bottom right.
 **/

import { cn } from "@/lib/utils";
import { IconLayoutNavbarCollapse } from "@tabler/icons-react";
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

import { useRef, useState, type MouseEvent as ReactMouseEvent } from "react";

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
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-50 dark:bg-neutral-900"
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
        className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-50 dark:bg-neutral-800"
      >
        <IconLayoutNavbarCollapse className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />
      </button>
    </div>
  );
};

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
  const pointer = useMotionValue(Infinity);
  return (
    <motion.div
      onMouseMove={(e) => pointer.set(orientation === "vertical" ? e.clientY : e.clientX)}
      onMouseEnter={() => onDockHoverChange?.(true)}
      onMouseLeave={() => {
        pointer.set(Infinity);
        onDockHoverChange?.(false);
      }}
      className={cn(
        orientation === "vertical"
          ? "mx-auto hidden w-16 items-center gap-4 rounded-2xl bg-gray-50 px-3 py-4 md:flex md:flex-col dark:bg-neutral-900"
          : "mx-auto hidden h-16 items-end gap-4 rounded-2xl bg-gray-50 px-4 pb-3 md:flex dark:bg-neutral-900",
        className,
      )}
    >
      <LayoutGroup id="dock-active-indicator">
        {items.map((item) => (
          <IconContainer pointer={pointer} orientation={orientation} key={item.title} {...item} />
        ))}
      </LayoutGroup>
    </motion.div>
  );
};

function IconContainer({
  pointer,
  orientation,
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
  orientation: DockOrientation;
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

  const widthTransform = useTransform(distance, [-150, 0, 150], variant === "logo" ? [48, 92, 48] : [40, 80, 40]);
  const heightTransform = useTransform(distance, [-150, 0, 150], variant === "logo" ? [48, 92, 48] : [40, 80, 40]);

  const widthTransformIcon = useTransform(
    distance,
    [-150, 0, 150],
    variant === "logo" ? [44, 88, 44] : variant === "avatar" ? [40, 80, 40] : [20, 40, 20],
  );
  const heightTransformIcon = useTransform(
    distance,
    [-150, 0, 150],
    variant === "logo" ? [44, 88, 44] : variant === "avatar" ? [40, 80, 40] : [20, 40, 20],
  );

  const width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  const height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const widthIcon = useSpring(widthTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  const heightIcon = useSpring(heightTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const [hovered, setHovered] = useState(false);
  const showLogo = variant === "logo";

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
          "relative flex aspect-square items-center justify-center rounded-full bg-gray-200 dark:bg-neutral-800",
          (variant === "avatar" || variant === "logo") && "overflow-hidden p-0",
        )}
      >
        <AnimatePresence>
          {hovered && !showLogo && (
            <motion.div
              initial={orientation === "vertical" ? { opacity: 0, x: 8, y: "-50%" } : { opacity: 0, y: 10, x: "-50%" }}
              animate={orientation === "vertical" ? { opacity: 1, x: 0, y: "-50%" } : { opacity: 1, y: 0, x: "-50%" }}
              exit={orientation === "vertical" ? { opacity: 0, x: 4, y: "-50%" } : { opacity: 0, y: 2, x: "-50%" }}
              className={cn(
                "w-fit rounded-md border border-gray-200 bg-gray-100 px-2 py-0.5 text-xs whitespace-pre text-neutral-700 dark:border-neutral-900 dark:bg-neutral-800 dark:text-white",
                orientation === "vertical" ? "absolute left-full top-1/2 ml-2" : "absolute -top-8 left-1/2",
              )}
            >
              {title}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          style={{ width: widthIcon, height: heightIcon }}
          className={cn(
            "flex items-center justify-center",
            (variant === "avatar" || variant === "logo") && "h-full w-full overflow-hidden rounded-full",
          )}
        >
          {icon}
        </motion.div>
        {badge && badge > 0 && !showLogo ? (
          <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white">
            {badge}
          </span>
        ) : null}
        {active && !showLogo ? (
          <motion.span
            layoutId="dock-active-dot"
            transition={{ type: "spring", stiffness: 520, damping: 36, mass: 0.55 }}
            className={cn(
              "absolute h-1.5 w-1.5 rounded-full bg-primary",
              orientation === "vertical" ? "-right-1.5 top-1/2 -translate-y-1/2" : "-bottom-1.5",
            )}
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
