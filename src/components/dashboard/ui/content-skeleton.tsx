import { motion } from "motion/react";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * A premium skeleton loader for the Overview page cards.
 * Mimics the overview page structure: metric cards ➜ chart cards ➜ bottom cards.
 */
export function ContentSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      {/* ── Metric cards row ── */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={`metric-${i}`}
            className="card-gray-gradient min-h-[126px] rounded-xl border border-border p-3.5 shadow-none lg:p-4"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-20 rounded-md" />
            </div>
            <Skeleton className="mt-3 h-8 w-28 rounded-lg" />
            <Skeleton className="mt-2 h-4 w-32 rounded-md" />
          </div>
        ))}
      </div>

      {/* ── Charts row ── */}
      <div className="grid items-stretch gap-4 xl:grid-cols-[1fr_1.6fr_1fr]">
        {/* Donut chart skeleton */}
        <div className="flex h-full flex-col rounded-xl border border-border bg-card p-4 shadow-sm">
          <Skeleton className="h-6 w-32 rounded-md" />
          <div className="mt-3 flex flex-1 items-center justify-center">
            <Skeleton className="h-44 w-44 rounded-full" />
          </div>
        </div>

        {/* Area chart skeleton */}
        <div className="flex h-full flex-col rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <Skeleton className="h-6 w-56 rounded-md" />
            <Skeleton className="h-9 w-40 rounded-lg" />
          </div>
          <div className="mt-3 h-64 w-full">
            <Skeleton className="h-full w-full rounded-xl" />
          </div>
        </div>

        {/* Bar chart / Input channel skeleton */}
        <div className="flex h-full flex-col rounded-xl border border-border bg-card shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6 pb-0 shadow-none">
            <Skeleton className="h-6 w-36 rounded-md" />
          </div>
          <div className="p-6 pt-0 flex-1 pb-0 shadow-none">
            <div className="mt-4 flex h-[250px] items-end justify-around gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton
                  key={`bar-${i}`}
                  className="w-16 rounded-t-xl"
                  style={{ height: `${60 + Math.random() * 40}%` }}
                />
              ))}
            </div>
          </div>
          <div className="flex items-center p-6 pt-0 shadow-none">
            <div className="flex w-full items-start gap-2 text-sm">
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom row ── */}
      <div className="grid gap-4 xl:grid-cols-2">
        {/* System status skeleton */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <Skeleton className="h-6 w-24 rounded-md" />
            <Skeleton className="h-8 w-32 rounded-lg" />
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={`status-${i}`}
                className={`rounded-xl border border-border/80 bg-gradient-to-br from-background via-background to-card p-4 shadow-sm ${i === 4 ? "sm:col-span-2" : ""}`}
              >
                <div className="flex min-h-[56px] items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <Skeleton className="h-10 w-10 shrink-0 rounded-xl" />
                    <Skeleton className="h-5 w-24 rounded-md" />
                  </div>
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity feed skeleton */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <Skeleton className="h-6 w-28 rounded-md" />
            <Skeleton className="h-8 w-20 rounded-full" />
          </div>
          <div className="mt-5 max-h-[304px] space-y-3 overflow-y-auto pr-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={`feed-${i}`}
                className="group relative overflow-hidden rounded-xl border border-border/70 bg-background/80 p-4 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <Skeleton className="h-10 w-10 shrink-0 rounded-2xl" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0 space-y-2">
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-5 w-16 rounded-full" />
                          <Skeleton className="h-5 w-24 rounded-md" />
                        </div>
                        <Skeleton className="h-4 w-64 rounded-md" />
                      </div>
                      <Skeleton className="h-6 w-16 shrink-0 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
