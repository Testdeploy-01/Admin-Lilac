import { Download, Megaphone, ShieldBan, UserPlus } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
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
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { Button } from "@/components/ui/button";
import {
  activityFeed,
  conversionFunnel,
  dauWeekly,
  featureUsageDonut,
  overviewGrowthFreeVsPlus,
  overviewKpis,
  retentionCurve,
  topTextPrompts,
  widgetQuickActions,
} from "../../mocks/dashboard-features.mock";
import { formatNumber } from "../../lib/formatters";

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
  upgrade: "อัปเกรด",
  churn: "ยกเลิก",
  milestone: "เป้าหมาย",
  warning: "เตือน",
  alert: "แจ้งเตือน",
  voice_error: "เสียงผิดพลาด",
};

const donutColors = ["hsl(var(--primary))", "#14b8a6", "#f59e0b", "#0284c7", "#8b5cf6", "#64748b"];

export function OverviewPage() {
  const [growthRange, setGrowthRange] = useState<"3m" | "6m" | "1y">("6m");

  const growthData = useMemo(() => {
    if (growthRange === "3m") return overviewGrowthFreeVsPlus.slice(-3);
    if (growthRange === "6m") return overviewGrowthFreeVsPlus;
    return overviewGrowthFreeVsPlus;
  }, [growthRange]);

  const maxPromptCount = Math.max(...topTextPrompts.map((p) => p.count), ...widgetQuickActions.map((p) => p.count));

  return (
    <DashboardPageShell title="แดชบอร์ด" description="ดูภาพรวมสุขภาพระบบทั้งหมดแบบรวดเร็ว">

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {overviewKpis.map((item) => (
          <MetricCard
            key={item.label}
            label={item.label}
            value={item.value}
            delta={item.delta}
            trend={item.trend === "up" ? "up" : item.trend === "down" ? "down" : "neutral"}
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
          <h3 className="text-base font-semibold">สัดส่วนการใช้ฟีเจอร์</h3>
          <div className="mt-4 h-52 w-full">
            <ResponsiveContainer>
              <PieChart>
                <Tooltip />
                <Pie
                  data={featureUsageDonut}
                  dataKey="value"
                  nameKey="feature"
                  innerRadius={50}
                  outerRadius={86}
                  paddingAngle={3}
                  stroke="hsl(var(--background))"
                  strokeWidth={2}
                >
                  {featureUsageDonut.map((item, index) => (
                    <Cell key={item.feature} fill={donutColors[index % donutColors.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 space-y-1.5">
            {featureUsageDonut.map((item) => (
              <div key={item.feature} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{item.feature}</span>
                <span className="font-semibold">{item.value}%</span>
              </div>
            ))}
          </div>
        </article>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div>
            <h3 className="text-base font-semibold">ผู้ใช้งานรายวัน (รายสัปดาห์)</h3>
            <p className="text-sm text-muted-foreground">เทียบสัปดาห์นี้ vs สัปดาห์ที่แล้ว</p>
          </div>
          <div className="mt-4 h-64 w-full">
            <ResponsiveContainer>
              <BarChart data={dauWeekly} margin={{ left: 8, right: 8, top: 6 }}>
                <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.5} />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="lastWeek" fill="#94a3b8" radius={[4, 4, 0, 0]} name="สัปดาห์ที่แล้ว" />
                <Bar dataKey="thisWeek" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="สัปดาห์นี้" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div>
            <h3 className="text-base font-semibold">เส้นกราฟการรักษาผู้ใช้</h3>
            <p className="text-sm text-muted-foreground">% ผู้ใช้ที่ยังใช้งานอยู่ สัปดาห์ 1–8 เทียบกับค่าเฉลี่ย</p>
          </div>
          <div className="mt-4 h-64 w-full">
            <ResponsiveContainer>
              <LineChart data={retentionCurve} margin={{ left: 8, right: 8, top: 6 }}>
                <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.5} />
                <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 100]}
                />
                <Tooltip />
                <Line type="natural" dataKey="retention" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4 }} name="Lilac" />
                <Line
                  type="natural"
                  dataKey="benchmark"
                  stroke="#94a3b8"
                  strokeWidth={2}
                  strokeDasharray="6 4"
                  dot={{ r: 3 }}
                  name="Benchmark"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </article>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.3fr_1fr]">
        <article className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div>
            <h3 className="text-base font-semibold">ขั้นตอนการอัปเกรด FREE → PLUS</h3>
            <p className="text-sm text-muted-foreground">ดูจำนวนที่หลุดในแต่ละขั้นตอน</p>
          </div>
          <div className="mt-4 h-64 w-full">
            <ResponsiveContainer>
              <BarChart data={conversionFunnel} margin={{ left: 8, right: 8, top: 6 }}>
                <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.5} />
                <XAxis dataKey="step" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="users" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} name="Users" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {conversionFunnel.slice(1).map((step) => (
              <p key={step.step} className="text-xs text-muted-foreground">
                {step.step}:{" "}
                <span className={`font-semibold ${step.dropOff > 25 ? "text-rose-500" : "text-foreground"}`}>
                  {step.dropOff}% หลุด
                </span>
              </p>
            ))}
          </div>
        </article>

        <article className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold">กิจกรรมล่าสุด</h3>
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

      <div className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div>
            <h3 className="text-base font-semibold">คำถามข้อความยอดนิยม</h3>
            <p className="text-sm text-muted-foreground">คำขอที่ถูกพิมพ์บ่อยที่สุด</p>
          </div>
          <div className="mt-4 space-y-3">
            {topTextPrompts.map((item, idx) => (
              <div key={item.prompt}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    #{idx + 1} {item.prompt}
                  </span>
                  <span className="font-semibold">{formatNumber(item.count)}</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div className="h-2 rounded-full bg-primary" style={{ width: `${(item.count / maxPromptCount) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div>
            <h3 className="text-base font-semibold">การดำเนินการด่วนที่ใช้บ่อย</h3>
            <p className="text-sm text-muted-foreground">การดำเนินการด่วนผ่านวิดเจ็ต</p>
          </div>
          <div className="mt-4 space-y-3">
            {widgetQuickActions.map((item, idx) => (
              <div key={item.prompt}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    #{idx + 1} {item.prompt}
                  </span>
                  <span className="font-semibold">{formatNumber(item.count)}</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div className="h-2 rounded-full bg-purple-500" style={{ width: `${(item.count / maxPromptCount) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>

      <article className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h3 className="text-base font-semibold">ทางลัด</h3>
        <BentoGrid className="mt-4 max-w-none md:auto-rows-[11rem] md:grid-cols-4">
          <Link to="/notifications">
            <BentoGridItem
              icon={<Megaphone className="h-5 w-5 text-primary" />}
              title="ส่งข้อความถึงทุกคน"
              description="Broadcast notifications"
            />
          </Link>
          <Link to="/user-management?filter=new7">
            <BentoGridItem
              icon={<UserPlus className="h-5 w-5 text-primary" />}
              title="ดูผู้ใช้ใหม่วันนี้"
              description="Open users with new-user filter"
            />
          </Link>
          <BentoGridItem
            icon={<Download className="h-5 w-5 text-primary" />}
            title={
              <Button variant="ghost" className="h-auto p-0 text-left font-bold" onClick={() => alert("Export functionality (mock)")}>
                ดาวน์โหลดรายงาน
              </Button>
            }
            description="Export report as CSV/PDF"
          />
          <BentoGridItem
            icon={<ShieldBan className="h-5 w-5 text-primary" />}
            title={
              <Button variant="ghost" className="h-auto p-0 text-left font-bold" onClick={() => alert("Suspend dialog (mock)")}>
                ระงับบัญชีผู้ใช้
              </Button>
            }
            description="Open suspend flow"
          />
        </BentoGrid>
      </article>
    </DashboardPageShell>
  );
}


