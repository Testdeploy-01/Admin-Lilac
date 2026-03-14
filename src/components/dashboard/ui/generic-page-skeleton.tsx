import { Skeleton } from "@/components/ui/skeleton";
import { BackgroundBeams } from "@/components/ui/background-beams";

export function GenericPageSkeleton() {
  return (
    <div className="relative space-y-6 overflow-hidden pb-2">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-30">
        <BackgroundBeams />
      </div>

      {/* Header Skeleton - Matches DashboardPageShell exactly */}
      <div className="card-gray-gradient rounded-2xl border border-border p-5">
        <Skeleton className="h-8 w-56 rounded-lg bg-primary/10" />
        <Skeleton className="mt-2 h-4 w-80 rounded-md bg-muted/60" />
      </div>

      <div className="space-y-6 px-1">
        {/* Stats Row Placeholder - Prevents layout jump for pages with stats */}
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={`stat-${i}`} className="h-[126px] rounded-2xl border border-border/50 bg-card/50" />
          ))}
        </div>

        {/* Content Area (Table-like) Placeholder */}
        <div className="card-gray-gradient overflow-hidden rounded-2xl border border-border bg-card/30">
          <div className="flex items-center justify-between border-b border-border p-5 bg-muted/20">
            <div className="flex gap-2">
              <Skeleton className="h-9 w-32 rounded-lg" />
              <Skeleton className="h-9 w-32 rounded-lg" />
            </div>
            <Skeleton className="h-9 w-40 rounded-lg" />
          </div>
          <div className="p-5 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={`row-${i}`} className="flex items-center gap-4 py-2 border-b border-border/10 last:border-0">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-1/4 rounded" />
                  <Skeleton className="h-3 w-1/6 rounded opacity-60" />
                </div>
                <Skeleton className="h-8 w-24 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
