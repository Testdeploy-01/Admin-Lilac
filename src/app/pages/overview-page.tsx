import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import {
  overviewGrowth30d,
  overviewKpis,
  overviewUsageByModule,
  popularFeatures,
  recentActivities,
} from "../../mocks/dashboard-features.mock";

export function OverviewPage() {
  const [range, setRange] = useState<"7d" | "30d">("30d");
  const usageColors = ["hsl(var(--primary))", "#14b8a6", "#f59e0b"];

  const growthData = useMemo(() => {
    if (range === "30d") {
      return overviewGrowth30d;
    }
    return overviewGrowth30d.slice(-7);
  }, [range]);

  const topCategory = useMemo(() => {
    return [...overviewUsageByModule].sort((a, b) => b.value - a.value)[0]?.module ?? "-";
  }, []);

  const maxFeatureCalls = Math.max(...popularFeatures.map((item) => item.calls));

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">ภาพรวม</h2>
          <p className="mt-1 text-sm text-muted-foreground">สรุป KPI, พฤติกรรมการใช้งาน และกิจกรรมล่าสุด</p>
        </div>
        <div className="inline-flex rounded-lg border border-border bg-card p-1">
          <button
            type="button"
            onClick={() => setRange("7d")}
            aria-pressed={range === "7d"}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${range === "7d" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"
              }`}
          >
            7 วัน
          </button>
          <button
            type="button"
            onClick={() => setRange("30d")}
            aria-pressed={range === "30d"}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${range === "30d" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"
              }`}
          >
            30 วัน
          </button>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {overviewKpis.map((item) => (
          <article key={item.label} className="rounded-xl bg-card p-5 shadow-card transition hover:-translate-y-0.5">
            <p className="text-sm text-muted-foreground">{item.label}</p>
            <p className="mt-3 text-2xl font-bold text-foreground">{item.value}</p>
            <p
              className={`mt-2 text-xs font-semibold ${item.trend === "up"
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

      <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <article className="rounded-xl bg-card p-6 shadow-card">
          <h3 className="text-base font-semibold">กราฟการเติบโตของผู้ใช้ ({range === "30d" ? "30 วัน" : "7 วัน"})</h3>
          <p className="text-sm text-muted-foreground">แนวโน้มจำนวนผู้ใช้งานรายวัน</p>
          <div className="mt-4 h-64 w-full">
            <ResponsiveContainer>
              <AreaChart data={growthData} margin={{ left: 8, right: 8, top: 6, bottom: 0 }}>
                <defs>
                  <linearGradient id="usersGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.06} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.5} />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Area
                  type="natural"
                  dataKey="users"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  fill="url(#usersGradient)"
                  dot={false}
                  activeDot={{ r: 5 }}
                  name="Users"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="rounded-xl bg-card p-6 shadow-card">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-base font-semibold">สัดส่วนการใช้งานตามหมวด</h3>
            <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
              มาแรง: {topCategory}
            </span>
          </div>
          <div className="mt-4 h-52 w-full">
            <ResponsiveContainer>
              <PieChart>
                <Tooltip />
                <Pie
                  data={overviewUsageByModule}
                  dataKey="value"
                  nameKey="module"
                  innerRadius={50}
                  outerRadius={86}
                  paddingAngle={3}
                  stroke="hsl(var(--background))"
                  strokeWidth={2}
                >
                  {overviewUsageByModule.map((item, index) => (
                    <Cell key={item.module} fill={usageColors[index % usageColors.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 space-y-1.5">
            {overviewUsageByModule.map((item) => (
              <div key={item.module} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{item.module}</span>
                <span className="font-semibold">{item.value}%</span>
              </div>
            ))}
          </div>
        </article>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-xl bg-card p-6 shadow-card">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold">กิจกรรมล่าสุด</h3>
            <Link to="/user-management" className="text-xs font-semibold text-primary hover:underline">
              ดูทั้งหมด
            </Link>
          </div>
          <div className="mt-4 space-y-2.5">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="rounded-lg bg-background p-3">
                <p className="text-sm font-medium">{activity.text}</p>
                <p className="mt-1 text-xs text-muted-foreground">{activity.time}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-xl bg-card p-6 shadow-card">
          <h3 className="text-base font-semibold">Feature ยอดนิยม</h3>
          <p className="text-sm text-muted-foreground">จัดอันดับฟังก์ชันที่ถูกใช้งานมากที่สุด</p>
          <div className="mt-4 space-y-3">
            {popularFeatures.map((item, index) => {
              const width = (item.calls / maxFeatureCalls) * 100;
              return (
                <div key={item.feature} className="rounded-lg bg-background p-3">
                  <div className="mb-2 flex items-center justify-between gap-2 text-sm">
                    <span className="font-medium">
                      #{index + 1} {item.feature}
                    </span>
                    <span className="text-xs text-muted-foreground">{item.calls.toLocaleString()} ครั้ง</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div className="h-2 rounded-full bg-primary" style={{ width: `${width}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </article>
      </div>
    </section>
  );
}

