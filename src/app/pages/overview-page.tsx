import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Area,
  AreaChart,
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
import { MetricCard } from "@/components/dashboard/ui/metric-card";
import { AppTabs } from "@/components/dashboard/ui/app-tabs";
import { Button } from "@/components/ui/button";
import { activityFeed, overviewGrowthFreeVsPlus } from "../../mocks/dashboard-features.mock";
import {
  overviewFeatureUsageDonut,
  overviewKpis,
  overviewSystemStatus,
  type OverviewFeatureUsageItem,
} from "../../mocks/dashboard-insights.mock";

const eventTypeColors: Record<string, string> = {
  join: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300",
  upgrade: "bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300",
  churn: "bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300",
  milestone: "bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300",
  warning: "bg-orange-100 text-orange-700 dark:bg-orange-900/60 dark:text-orange-300",
  alert: "bg-red-100 text-red-700 dark:bg-red-900/60 dark:text-red-300",
  voice_error: "bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300",
};

const eventTypeLabels: Record<string, string> = {
  join: "สมัครใหม่",
  upgrade: "อัปเกรด PLUS",
  churn: "ยกเลิกแพ็กเกจรายเดือน",
  milestone: "บรรลุเป้าหมายการออม",
  warning: "เตือนระบบ",
  alert: "แจ้งเตือนสำคัญ",
  voice_error: "เสียงผิดพลาด",
};

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

const donutColors = ["hsl(var(--primary))", "#14b8a6", "#f59e0b", "#0284c7", "#8b5cf6", "#64748b"];

function FeatureUsageTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: OverviewFeatureUsageItem }> }) {
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

export function OverviewPage() {
  const [growthRange, setGrowthRange] = useState<"3m" | "6m" | "1y">("6m");

  const growthData = useMemo(() => {
    if (growthRange === "3m") return overviewGrowthFreeVsPlus.slice(-3);
    if (growthRange === "6m") return overviewGrowthFreeVsPlus;
    return overviewGrowthFreeVsPlus;
  }, [growthRange]);

  return (
    <DashboardPageShell title="แดชบอร์ด" description="ดูภาพรวมสุขภาพระบบและตัวเลขสำคัญของวันนี้แบบรวดเร็ว">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {overviewKpis.map((item) => (
          <MetricCard
            key={item.label}
            label={item.label}
            value={item.value}
            delta={item.delta}
            trend={item.trend}
            note={item.note}
          />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <article className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold">กราฟการเติบโต (FREE vs PLUS)</h3>
              <p className="text-sm text-muted-foreground">แนวโน้มสมาชิกสะสมรายเดือน</p>
            </div>
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
          <div className="mt-4 h-64 w-full">
            <ResponsiveContainer>
              <AreaChart data={growthData} margin={{ left: 8, right: 8, top: 6, bottom: 0 }}>
                <defs>
                  <linearGradient id="freeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="plusGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.06} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.5} />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Area type="natural" dataKey="free" stroke="#94a3b8" strokeWidth={2} fill="url(#freeGrad)" name="FREE" />
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

        <article className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div>
            <h3 className="text-base font-semibold">สัดส่วนการใช้งานฟีเจอร์</h3>
            <p className="text-sm text-muted-foreground">หมวดหลักที่ผู้ใช้เลือกใช้งานบ่อยที่สุด</p>
          </div>
          <div className="mt-4 h-52 w-full">
            <ResponsiveContainer>
              <PieChart>
                <Tooltip content={<FeatureUsageTooltip />} />
                <Pie
                  data={overviewFeatureUsageDonut}
                  dataKey="value"
                  nameKey="feature"
                  innerRadius={50}
                  outerRadius={86}
                  paddingAngle={3}
                  stroke="hsl(var(--background))"
                  strokeWidth={2}
                >
                  {overviewFeatureUsageDonut.map((item, index) => (
                    <Cell key={item.feature} fill={donutColors[index % donutColors.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 space-y-1.5">
            {overviewFeatureUsageDonut.map((item) => (
              <div key={item.feature} className="flex items-center justify-between text-sm">
                <div>
                  <span className="text-muted-foreground">{item.feature}</span>
                  {item.note ? <p className="text-[11px] text-muted-foreground">{item.note}</p> : null}
                </div>
                <span className="font-semibold">{item.value}%</span>
              </div>
            ))}
          </div>
        </article>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold">System Status</h3>
              <p className="text-sm text-muted-foreground">สถานะบริการสำคัญที่ admin ควรเห็นทันที</p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link to="/ai-monitor">ดู AI Monitor</Link>
            </Button>
          </div>
          <div className="mt-4 space-y-3">
            {overviewSystemStatus.map((item) => (
              <div key={item.key} className="rounded-lg border border-border bg-background p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-foreground">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.detail}</p>
                  </div>
                  <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClasses[item.status]}`}>
                    {statusLabels[item.status]}
                  </span>
                </div>
                {item.meta ? <p className="mt-2 text-xs text-muted-foreground">{item.meta}</p> : null}
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold">กิจกรรมล่าสุด</h3>
              <p className="text-sm text-muted-foreground">สรุปเหตุการณ์ล่าสุดที่ควรติดตามจากผู้ใช้และระบบ</p>
            </div>
            <Button asChild variant="link" size="sm">
              <Link to="/user-management">ดูทั้งหมด</Link>
            </Button>
          </div>
          <div className="mt-4 max-h-[340px] space-y-2 overflow-y-auto pr-1">
            {activityFeed.map((event) => (
              <div key={event.id} className="flex items-start gap-3 rounded-lg border border-border bg-background p-3">
                <span className={`mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${eventTypeColors[event.type]}`}>
                  {eventTypeLabels[event.type]}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm">
                    <span className="font-semibold">{event.userName}</span>{" "}
                    <span className="text-muted-foreground">{event.text}</span>
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{event.time}</p>
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>
    </DashboardPageShell>
  );
}
