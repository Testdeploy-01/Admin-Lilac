"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type NotificationListItem = {
  id: string;
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  tone?: "default" | "warning" | "critical" | "success";
};

const toneClassMap: Record<NonNullable<NotificationListItem["tone"]>, string> = {
  default: "card-gray-gradient border-border",
  warning: "border-amber-300/60 bg-amber-50/80 dark:border-amber-900/50 dark:bg-amber-950/30",
  critical: "border-rose-300/60 bg-rose-50/80 dark:border-rose-900/50 dark:bg-rose-950/30",
  success: "border-emerald-300/60 bg-emerald-50/80 dark:border-emerald-900/50 dark:bg-emerald-950/30",
};

type NotificationListProps = {
  items: NotificationListItem[];
  className?: string;
};

export function NotificationList({ items, className }: NotificationListProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {items.map((item) => (
        <article key={item.id} className={cn("rounded-xl border p-4", toneClassMap[item.tone ?? "default"])}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                {item.icon ? <span className="text-muted-foreground">{item.icon}</span> : null}
                <p className="truncate text-sm font-semibold text-foreground">{item.title}</p>
              </div>
              {item.description ? <p className="mt-1 text-sm text-muted-foreground">{item.description}</p> : null}
            </div>
            {item.action ? <div className="shrink-0">{item.action}</div> : null}
          </div>
        </article>
      ))}
    </div>
  );
}
