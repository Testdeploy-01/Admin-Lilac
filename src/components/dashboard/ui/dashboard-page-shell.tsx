import { useEffect, type ReactNode } from "react";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { cn } from "@/lib/utils";

export type DashboardPageShellProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function DashboardPageShell({
  title,
  description,
  actions,
  children,
  className,
}: DashboardPageShellProps) {
  useEffect(() => {
    document.title = `${title} — Lilac Admin`;
  }, [title]);

  return (
    <section className={cn("relative space-y-6 overflow-hidden pb-2", className)}>
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-30">
        <BackgroundBeams />
      </div>

      <div className="card-gray-gradient rounded-2xl border border-border p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-xl font-bold leading-snug tracking-wide text-foreground sm:text-2xl">{title}</h1>
            {description ? <p className="-mt-1 text-sm text-muted-foreground">{description}</p> : null}
          </div>
          {actions ? <div className="shrink-0">{actions}</div> : null}
        </div>
      </div>

      {children}
    </section>
  );
}
