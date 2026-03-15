import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  CreditCard,
  Database,
  ShieldCheck,
  Sparkles,
  UserPlus,
  Waypoints,
  XCircle,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DashboardPageShell } from "@/components/dashboard/ui/dashboard-page-shell";
import { ContentSkeleton } from "@/components/dashboard/ui/content-skeleton";
import { MetricCard } from "@/components/dashboard/ui/metric-card";
import { AppTabs } from "@/components/dashboard/ui/app-tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/components/ui/chart";
import { activityFeed, overviewGrowthFreeVsPlus } from "../../mocks/dashboard-features.mock";
import {
  overviewInputChannelDonut,
  overviewKpis,
  overviewRevenueKpi,
  overviewSystemStatus,
  overviewSystemOwners,
  overviewTopFeaturesDonut,
  type OverviewFeatureUsageItem,
} from "../../mocks/dashboard-insights.mock";

const eventTypeColors: Record<string, string> = {
  join: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300",
  upgrade: "bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300",
  churn: "bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300",
};

const eventTypeLabels: Record<string, string> = {
  join: "สมัครใหม่",
  upgrade: "อัปเกรด PLUS",
  churn: "ยกเลิกแพ็กเกจ",
};

const eventTypeIconClasses: Record<string, string> = {
  join: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
  upgrade: "border-blue-500/20 bg-blue-500/10 text-blue-300",
  churn: "border-rose-500/20 bg-rose-500/10 text-rose-300",
};

const eventTypeIcons = {
  join: UserPlus,
  upgrade: Sparkles,
  churn: XCircle,
} as const;

const statusLabels = {
  operational: "ปกติ",
  degraded: "เฝ้าระวัง",
  down: "ขัดข้อง",
} as const;

const statusClasses = {
  operational: "border-emerald-200 bg-emerald-500/10 text-emerald-700 dark:border-emerald-900/50 dark:text-emerald-300",
  degraded: "border-amber-200 bg-amber-500/10 text-amber-700 dark:border-amber-900/50 dark:text-amber-300",
  down: "border-rose-200 bg-rose-500/10 text-rose-700 dark:border-rose-900/50 dark:text-rose-300",
} as const;

const statusDotClasses = {
  operational: "bg-emerald-400",
  degraded: "bg-amber-400",
  down: "bg-rose-400",
} as const;

const donutColors = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-4))", "hsl(var(--chart-3))", "hsl(var(--chart-5))", "hsl(var(--muted-foreground))"];

const systemIcons = {
  ai: Activity,
  database: Database,
  api: Waypoints,
  auth: ShieldCheck,
  "payment-gateway": CreditCard,
} as const;

function GrowthTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number | string; color?: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-border bg-background px-3 py-2 shadow-sm">
      {label ? <p className="text-sm font-semibold text-foreground">{label}</p> : null}
      <div className="mt-2 space-y-1.5">
        {payload.map((entry) => (
          <div key={entry.name} className="flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2 text-muted-foreground">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: entry.color ?? "hsl(var(--muted-foreground))" }}
                aria-hidden="true"
              />
              <span>{entry.name}</span>
            </div>
            <span className="font-semibold text-foreground">{Number(entry.value ?? 0).toLocaleString()} คน</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FeatureUsageTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: OverviewFeatureUsageItem }>;
}) {
  if (!active || !payload?.length) return null;

  const item = payload[0]?.payload as OverviewFeatureUsageItem | undefined;
  if (!item) return null;

  return (
    <div className="rounded-lg border border-border bg-background px-3 py-2 shadow-sm">
      <p className="text-sm font-semibold text-foreground">
        {item.feature} {item.value}%
      </p>
      {item.note ? <p className="mt-1 max-w-56 text-xs text-muted-foreground">{item.note}</p> : null}
    </div>
  );
}

function OverviewDonutCard({
  title,
  items,
}: {
  title: string;
  items: OverviewFeatureUsageItem[];
}) {
  const chartConfig = items.reduce<ChartConfig>((acc, item, index) => {
    acc[item.feature] = {
      label: item.feature,
      color: donutColors[index % donutColors.length],
    };
    return acc;
  }, {} satisfies ChartConfig);

  return (
    <Card className="flex h-full flex-col shadow-sm">
      <CardHeader className="px-4 pb-0 pt-4">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col items-center justify-center px-4 pb-4 pt-0">
        <ChartContainer config={chartConfig} className="aspect-square w-full max-w-[280px]">
          <PieChart>
            <ChartTooltip
              content={<FeatureUsageTooltip />}
              cursor={false}
            />
            <Pie
              data={items}
              dataKey="value"
              nameKey="feature"
              innerRadius="48%"
              outerRadius="68%"
              paddingAngle={3}
              stroke="hsl(var(--background))"
              strokeWidth={3}
              labelLine={false}
              label={({ cx = 0, cy = 0, midAngle = 0, outerRadius: or = 0, name, value }) => {
                const RADIAN = Math.PI / 180;
                const radius = Number(or) + 30;
                const x = Number(cx) + radius * Math.cos(-midAngle * RADIAN);
                const y = Number(cy) + radius * Math.sin(-midAngle * RADIAN);
                const anchor = x > Number(cx) ? "start" : "end";

                return (
                  <text x={x} y={y} textAnchor={anchor} dominantBaseline="central">
                    <tspan className="fill-foreground text-sm font-semibold">{value}%</tspan>
                    <tspan x={x} dy="1.2em" className="fill-muted-foreground text-[11px]">{name}</tspan>
                  </text>
                );
              }}
            >
              {items.map((item, index) => (
                <Cell
                  key={item.feature}
                  fill={donutColors[index % donutColors.length]}
                  className="outline-none focus:outline-none"
                />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function OverviewInputChannelCard({
  title,
  items,
}: {
  title: string;
  items: OverviewFeatureUsageItem[];
}) {
  const chartData = items.map((item) => ({
    feature: item.feature,
    value: item.value,
    note: item.note,
  }));

  const chartConfig = {
    value: {
      label: "สัดส่วนการใช้งาน",
      color: "hsl(var(--primary))",
    },
    aiInput: {
      label: "Ai Input",
      color: "hsl(var(--primary))",
    },
    manualInput: {
      label: "Manual Input",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  return (
    <Card className="flex h-full flex-col shadow-sm">
      <CardHeader className="px-4 pb-2 pt-4">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col px-4 pb-4 pt-0">
        <ChartContainer config={chartConfig} className="h-[216px] w-full">
          <BarChart accessibilityLayer data={chartData} margin={{ top: 10, right: 10, left: -24, bottom: 0 }} barCategoryGap="30%">
            <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.35} />
            <XAxis
              dataKey="feature"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              fontSize={12}
            />
            <YAxis
              domain={[0, 100]}
              tickLine={false}
              axisLine={false}
              width={34}
              tickMargin={4}
              fontSize={12}
              tickFormatter={(value) => `${value}%`}
            />
            <ChartTooltip content={<FeatureUsageTooltip />} cursor={false} />
            <Bar dataKey="value" radius={[12, 12, 0, 0]} activeBar={false} maxBarSize={60}>
              {items.map((item, index) => (
                <Cell
                  key={item.feature}
                  fill={
                    item.feature === "Ai Input"
                      ? "var(--color-aiInput)"
                      : item.feature === "Manual Input"
                        ? "var(--color-manualInput)"
                        : donutColors[index % donutColors.length]
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
        <div className="mt-auto grid gap-2 pt-3">
          {items.map((item, index) => (
            <div key={item.feature} className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2 text-sm">
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{
                    backgroundColor:
                      item.feature === "Ai Input"
                        ? "hsl(var(--primary))"
                        : item.feature === "Manual Input"
                          ? "hsl(var(--chart-2))"
                          : donutColors[index % donutColors.length],
                  }}
                  aria-hidden="true"
                />
                <span className="font-medium text-foreground">{item.feature}</span>
              </div>
              <span className="font-semibold">{item.value}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function OverviewPage() {
  const [isLoading, setIsLoading] = useState(() => {
    // Show skeleton only on the very first time they visit the dashboard in this session
    return !sessionStorage.getItem("hasVisitedOverview");
  });

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
        sessionStorage.setItem("hasVisitedOverview", "true");
      }, 1200); // Fake API latency
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  const [growthRange, setGrowthRange] = useState<"3m" | "6m" | "1y">("6m");
  const overviewCards = [...overviewKpis, overviewRevenueKpi];

  const growthData = useMemo(() => {
    const calendarMonthOrder = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
    const orderedGrowthData = [...overviewGrowthFreeVsPlus]
      .sort((a, b) => calendarMonthOrder.indexOf(a.month) - calendarMonthOrder.indexOf(b.month))
      .map((item) => ({ ...item, displayMonth: item.month }));

    if (growthRange === "3m") {
      return orderedGrowthData.slice(0, 3);
    }

    if (growthRange === "6m") {
      return orderedGrowthData.slice(0, 6);
    }

    return orderedGrowthData;
  }, [growthRange]);

  return (
    <DashboardPageShell title="ภาพรวม">
      {isLoading ? (
        <ContentSkeleton />
      ) : (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {overviewCards.map((item) => (
              <MetricCard
                key={item.label}
                label={String(item.label)}
                value={item.value}
                delta={item.delta}
                trend={item.trend}
                note={item.note}
                className="min-h-[132px] p-5"
              />
            ))}
          </div>

      <div className="grid items-stretch gap-4 xl:grid-cols-[1fr_1.6fr_1fr]">
        <OverviewDonutCard
          title="ฟีเจอร์ที่ใช้บ่อย"
          items={overviewTopFeaturesDonut}
        />

        <article className="flex h-full flex-col rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="text-base font-semibold">กราฟการเติบโต (FREE vs PLUS)</h3>
            </div>
            <div className="shrink-0">
              <AppTabs
                value={growthRange}
                onValueChange={(value) => setGrowthRange(value as "3m" | "6m" | "1y")}
                items={[
                  { value: "3m", label: "3 เดือน" },
                  { value: "6m", label: "6 เดือน" },
                  { value: "1y", label: "1 ปี" },
                ]}
              />
            </div>
          </div>
          <div className="mt-3 h-64 w-full">
            <ResponsiveContainer>
              <AreaChart data={growthData} margin={{ left: 20, right: 12, top: 6, bottom: 0 }}>
                <defs>
                  <linearGradient id="freeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="plusGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.06} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.5} />
                <XAxis
                  dataKey="displayMonth"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  padding={{ left: 8, right: 8 }}
                />
                <YAxis hide tickLine={false} axisLine={false} />
                <Tooltip content={<GrowthTooltip />} />
                <Area type="natural" dataKey="free" stroke="hsl(var(--muted-foreground))" strokeWidth={2} fill="url(#freeGrad)" name="FREE" />
                <Area
                  type="natural"
                  dataKey="plus"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  fill="url(#plusGrad)"
                  name="PLUS"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </article>

        <OverviewInputChannelCard
          title="ช่องทางที่ใช้บันทึก"
          items={overviewInputChannelDonut}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold">สถานะระบบ</h3>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">แจ้งผู้รับผิดชอบ</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl border-border bg-card">
                <DialogHeader>
                  <DialogTitle>ผู้ดูแลระบบ</DialogTitle>
                </DialogHeader>
                <div className="grid gap-3 sm:grid-cols-2">
                  {overviewSystemOwners.map((owner) => (
                    <div key={owner.id} className="rounded-xl border border-border bg-background p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-foreground">{owner.name}</p>
                          <p className="text-sm text-muted-foreground">{owner.role}</p>
                        </div>
                        <span className="rounded-full border border-border bg-card px-2.5 py-1 text-xs text-muted-foreground">
                          {owner.team}
                        </span>
                      </div>
                      <div className="mt-3 space-y-2">
                        <p className="text-sm text-foreground">ติดต่อ: {owner.contact}</p>
                        <div className="flex flex-wrap gap-2">
                          {owner.systems.map((system) => (
                            <span
                              key={`${owner.id}-${system}`}
                              className="rounded-full border border-border bg-card px-2.5 py-1 text-xs text-muted-foreground"
                            >
                              {system}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {overviewSystemStatus.map((item, index) => {
              const Icon = systemIcons[item.key as keyof typeof systemIcons] ?? Activity;

              return (
              <div
                key={item.key}
                className={`rounded-xl border border-border/80 bg-gradient-to-br from-background via-background to-card p-4 shadow-sm transition-colors hover:border-border ${index === overviewSystemStatus.length - 1 ? "sm:col-span-2" : ""}`}
              >
                <div className="flex min-h-[56px] items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${statusClasses[item.status]}`}>
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${statusDotClasses[item.status]}`} aria-hidden="true" />
                        <p className="font-semibold text-foreground">{item.label}</p>
                      </div>
                    </div>
                  </div>
                  <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClasses[item.status]}`}>
                    {statusLabels[item.status]}
                  </span>
                </div>
              </div>
            );})}
          </div>
        </article>

        <article className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold">กิจกรรมล่าสุด</h3>
            </div>
            <Button asChild variant="ghost" size="sm" className="rounded-full px-3 text-muted-foreground hover:text-foreground">
              <Link to="/user-management">ดูทั้งหมด</Link>
            </Button>
          </div>
          <div className="overview-feed-scroll mt-5 max-h-[304px] space-y-3 overflow-y-auto pr-2">
            {activityFeed.map((event, index) => {
              const EventIcon = eventTypeIcons[event.type as keyof typeof eventTypeIcons] ?? Activity;

              return (
                <article
                  key={event.id}
                  className="group relative overflow-hidden rounded-xl border border-border/70 bg-background/80 p-4 shadow-sm transition-colors hover:border-border hover:bg-background"
                >
                  {index < activityFeed.length - 1 ? (
                    <span
                      className="absolute left-[2.15rem] top-14 h-10 w-px bg-gradient-to-b from-border via-border/70 to-transparent"
                      aria-hidden="true"
                    />
                  ) : null}
                  <div className="flex items-start gap-3">
                    <span
                      className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border ${eventTypeIconClasses[event.type] ?? "border-border bg-card text-foreground"}`}
                    >
                      <EventIcon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${eventTypeColors[event.type]}`}>
                              {eventTypeLabels[event.type]}
                            </span>
                            <span className="text-sm font-semibold text-foreground">{event.userName}</span>
                          </div>
                          <p className="mt-2 text-sm leading-6 text-muted-foreground">{event.text}</p>
                        </div>
                        <span className="inline-flex shrink-0 rounded-full border border-border bg-card px-2.5 py-1 text-xs text-muted-foreground">
                          {event.time}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </article>
      </div>
      </div>
      )}
    </DashboardPageShell>
  );
}
