import { useMemo, useState } from "react";
import { ChartAreaGradient } from "../../components/charts/chart-area-gradient";
import { recentActivities, overviewKpis } from "../../mocks/dashboard-features.mock";

export function OverviewPage() {
  const [range, setRange] = useState<"7d" | "30d">("7d");

  const kpis = useMemo(() => {
    if (range === "7d") return overviewKpis;
    return overviewKpis.map((item) => ({
      ...item,
      delta: item.trend === "up" ? `+${(Number(item.delta.replace(/[^\d.]/g, "")) * 4).toFixed(1)}%` : item.delta,
    }));
  }, [range]);

  const activities = useMemo(() => {
    return range === "7d" ? recentActivities : [...recentActivities].reverse();
  }, [range]);

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Overview Dashboard</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Snapshot of system movement with static fixtures from dashboard feature spec.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setRange("7d")}
            className={`rounded-md px-3 py-1 text-xs font-semibold ${
              range === "7d" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            Last 7 Days
          </button>
          <button
            type="button"
            onClick={() => setRange("30d")}
            className={`rounded-md px-3 py-1 text-xs font-semibold ${
              range === "30d" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            Last 30 Days
          </button>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((item) => (
          <article key={item.label} className="rounded-xl bg-card p-5 shadow-card">
            <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
            <p className="mt-3 text-3xl font-bold tracking-tight">{item.value}</p>
            <p
              className={`mt-2 text-xs font-semibold ${
                item.trend === "up"
                  ? "text-emerald-600 dark:text-emerald-300"
                  : item.trend === "down"
                    ? "text-rose-600 dark:text-rose-300"
                    : "text-muted-foreground"
              }`}
            >
              {item.delta}
            </p>
          </article>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <ChartAreaGradient />

        <article className="rounded-xl bg-card p-6 shadow-card">
          <h2 className="text-lg font-semibold">Recent Activities</h2>
          <p className="text-sm text-muted-foreground">Real-time style feed (static fixtures)</p>
          <div className="mt-4 space-y-3">
            {activities.map((activity) => (
              <div key={activity.id} className="rounded-lg bg-background p-3">
                <p className="text-sm font-medium leading-relaxed">{activity.text}</p>
                <p className="mt-1 text-xs text-muted-foreground">{activity.time}</p>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
