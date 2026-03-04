import type { ReactNode } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export type DataTableShellProps = {
  caption: string;
  toolbar?: ReactNode;
  children: ReactNode;
  minWidthClass?: string;
  className?: string;
};

export function DataTableShell({
  caption,
  toolbar,
  children,
  minWidthClass = "min-w-[800px]",
  className,
}: DataTableShellProps) {
  return (
    <article className={cn("card-gray-gradient rounded-xl border border-border p-5 shadow-none sm:p-6", className)}>
      <div className="sr-only">{caption}</div>
      {toolbar ? <div className="mb-4">{toolbar}</div> : null}
      <ScrollArea className="w-full whitespace-nowrap">
        <div className={cn("w-full", minWidthClass)}>{children}</div>
      </ScrollArea>
    </article>
  );
}
