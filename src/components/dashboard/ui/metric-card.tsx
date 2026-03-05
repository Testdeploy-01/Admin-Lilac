import { TrendingDown, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type MetricCardProps = {
  label: string;
  value: number | string;
  delta?: string;
  trend?: "up" | "down" | "neutral";
  note?: string;
  className?: string;
};

function extractNumber(value: number | string): number | null {
  if (typeof value === "number") return value;
  const cleaned = value.replace(/[^\d.-]/g, "");
  if (!cleaned) return null;
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
}

export function MetricCard({ label, value, delta, trend = "neutral", note, className }: MetricCardProps) {
  const numericValue = extractNumber(value);
  const trendClass =
    trend === "up"
      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
      : trend === "down"
        ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
        : "bg-muted text-muted-foreground";
  const displayValue = numericValue !== null && typeof value === "number" ? value.toLocaleString() : String(value);

  return (
    <div className={cn("card-gray-gradient rounded-xl border border-border p-4 shadow-none", className)}>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          {delta ? (
            <Badge className={cn("gap-1", trendClass)}>
              {trend === "up" ? <TrendingUp className="h-3 w-3" /> : null}
              {trend === "down" ? <TrendingDown className="h-3 w-3" /> : null}
              {trend === "neutral" ? "-" : null} {delta}
            </Badge>
          ) : null}
        </div>
        <p className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{displayValue}</p>
        {note ? <p className="text-xs text-muted-foreground">{note}</p> : null}
      </div>
    </div>
  );
}
