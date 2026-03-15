import { useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { DashboardPageShell } from "@/components/dashboard/ui/dashboard-page-shell";
import { MetricCard } from "@/components/dashboard/ui/metric-card";
import { DataTableShell } from "@/components/dashboard/ui/data-table-shell";
import { AppTabs } from "@/components/dashboard/ui/app-tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  aiCommandSeriesByPeriod,
  aiFeatureUsageSummaryByPeriod,
  aiModelUsageByPeriod,
  aiStatsByPeriod,
  aiTopPromptsByFeatureByPeriod,
  type AiMonitorPeriod,
  unresolvedQueriesByPeriod,
} from "../../mocks/dashboard-features.mock";
import { formatCurrencyTHB, formatNumber } from "../../lib/formatters";

const periodTabs = [
  { value: "today", label: "วันนี้" },
  { value: "month", label: "เดือนนี้" },
  { value: "6months", label: "6 เดือนที่ผ่านมา" },
  { value: "year", label: "1 ปีที่ผ่านมา" },
] as const;

const chartTitles: Record<AiMonitorPeriod, string> = {
  today: "คำสั่ง AI วันนี้",
  month: "คำสั่ง AI รายเดือน",
  "6months": "คำสั่ง AI ย้อนหลัง 6 เดือน",
  year: "คำสั่ง AI ย้อนหลัง 1 ปี",
};

const featureAccentColors = [
  { panelBg: "bg-gradient-to-br from-background via-background to-card", badge: "bg-primary/15 text-primary", dot: "bg-primary" },
  { panelBg: "bg-gradient-to-br from-background via-background to-card", badge: "bg-primary/15 text-primary", dot: "bg-primary" },
  { panelBg: "bg-gradient-to-br from-background via-background to-card", badge: "bg-primary/15 text-primary", dot: "bg-primary" },
] as const;

const sectionCardClass = "card-gray-gradient rounded-xl border border-border p-5 shadow-sm lg:p-6";
const sectionHeaderClass = "mb-4 flex items-start justify-between gap-3";
const sectionTitleClass = "text-base font-semibold text-foreground";
const chartPanelClass = "rounded-xl border border-border/70 bg-background/70 p-3";

const chartTooltipStyle = {
  backgroundColor: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "12px",
  boxShadow: "0 12px 24px -18px hsl(var(--foreground) / 0.35)",
};

function formatTooltipValue(value: number | string | readonly (number | string)[] | undefined): string {
  if (Array.isArray(value)) return value.map((item) => formatTooltipValue(item)).join(" / ");
  if (typeof value === "number") return formatNumber(value);
  return String(value ?? "-");
}

export function AiMonitorPage() {
  const [period, setPeriod] = useState<AiMonitorPeriod>("month");

  const periodStats = aiStatsByPeriod[period];
  const commandSeries = aiCommandSeriesByPeriod[period];
  const featureUsage = aiFeatureUsageSummaryByPeriod[period];
  const topPromptsByFeature = aiTopPromptsByFeatureByPeriod[period];
  const unresolvedQueries = unresolvedQueriesByPeriod[period];
  const modelUsage = aiModelUsageByPeriod[period];

  const statsCards = [
    { label: "คำสั่ง AI", value: formatNumber(periodStats.commands), delta: "+7.4%", trend: "up" as const, note: "ตามช่วงเวลาที่เลือก" },
    { label: "ผู้ใช้งาน AI", value: formatNumber(periodStats.users), delta: "+5.1%", trend: "up" as const, note: "ตามช่วงเวลาที่เลือก" },
    { label: "อัตราสำเร็จ", value: `${periodStats.successRate.toFixed(1)}%`, delta: "+0.3%", trend: "up" as const, note: "เทียบกับช่วงก่อนหน้า" },
    { label: "ต้นทุนรวม", value: formatCurrencyTHB(periodStats.totalCostTHB), delta: "+12.8%", trend: "up" as const, note: "ตามช่วงเวลาที่เลือก" },
  ];

  return (
    <DashboardPageShell title="มอนิเตอร์การใช้งาน AI">
      <AppTabs value={period} onValueChange={(value) => setPeriod(value as AiMonitorPeriod)} items={[...periodTabs]} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statsCards.map((item) => (
          <MetricCard
            key={item.label}
            label={item.label}
            value={item.value}
            delta={item.delta}
            trend={item.trend}
            note={item.note}
            className="min-h-[132px] p-5"
          />
        ))}
      </div>

      <article className={sectionCardClass}>
        <div className={sectionHeaderClass}>
          <div>
            <h3 className={sectionTitleClass}>{chartTitles[period]}</h3>
          </div>
          <Badge variant="secondary" className="rounded-full px-3 py-1">
            ข้อความ / เสียง
          </Badge>
        </div>
        <div className={chartPanelClass}>
          <div className="h-72 w-full">
            <ResponsiveContainer>
              <BarChart data={commandSeries} margin={{ left: 8, right: 8, top: 10 }}>
                <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.45} />
                <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} interval={0} minTickGap={12} />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  label={{ value: "ครั้ง", angle: -90, position: "insideLeft", fill: "hsl(var(--muted-foreground))" }}
                />
                <Tooltip
                  contentStyle={chartTooltipStyle}
                  cursor={{ fill: "hsl(var(--muted) / 0.35)" }}
                  formatter={(value, name) => [formatTooltipValue(value), name]}
                />
                <Bar dataKey="text" stackId="a" fill="hsl(var(--primary))" name="ข้อความ" radius={[6, 6, 0, 0]} />
                <Bar dataKey="voice" stackId="a" fill="hsl(var(--primary) / 0.6)" name="เสียง" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </article>

      <div className="grid gap-4 xl:grid-cols-[1.15fr_1fr]">
        <DataTableShell caption="การใช้ AI ตามฟีเจอร์" minWidthClass="min-w-[760px]" className="h-full">
          <div className={sectionHeaderClass}>
            <div>
              <h3 className={sectionTitleClass}>การใช้ AI ตามฟีเจอร์</h3>
            </div>
            <Badge variant="secondary" className="rounded-full px-3 py-1">
              อันดับตามคำสั่ง
            </Badge>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>อันดับ</TableHead>
                <TableHead>ฟีเจอร์</TableHead>
                <TableHead>คำสั่ง</TableHead>
                <TableHead>สัดส่วน</TableHead>
                <TableHead>ต้นทุน AI</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {featureUsage.map((item, index) => (
                <TableRow key={item.feature}>
                  <TableCell>
                    <span className="inline-flex rounded-full border border-border bg-background px-2.5 py-1 text-xs font-semibold text-foreground">
                      #{index + 1}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium text-foreground">{item.feature}</TableCell>
                  <TableCell className="font-semibold text-foreground">{formatNumber(item.commands)}</TableCell>
                  <TableCell>
                    <span className="rounded-full border border-border bg-background px-2.5 py-1 text-xs font-semibold text-foreground">
                      {item.sharePercent}%
                    </span>
                  </TableCell>
                  <TableCell className="font-semibold text-foreground">{formatCurrencyTHB(item.costTHB)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DataTableShell>

        <DataTableShell caption="รายการคำถามที่ AI ตอบไม่ได้" minWidthClass="min-w-[520px]" className="h-full">
          <div className={sectionHeaderClass}>
            <div>
              <h3 className={sectionTitleClass}>คำถามที่ AI ตอบไม่ได้</h3>
            </div>
            <Badge variant="secondary" className="rounded-full px-3 py-1">
              คำถามนอกขอบเขตของ AI
            </Badge>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>คำถาม</TableHead>
                <TableHead>ครั้ง</TableHead>
                <TableHead>ฟีเจอร์</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {unresolvedQueries.map((query) => (
                <TableRow key={query.query}>
                  <TableCell className="font-medium text-foreground">{query.query}</TableCell>
                  <TableCell className="font-semibold text-foreground">{query.count}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="rounded-full px-2.5 py-1">
                      {query.category === "off-topic" ? "นอกขอบเขต" : query.category}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DataTableShell>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        {topPromptsByFeature.map((group, groupIndex) => {
          const groupTotal = group.prompts.reduce((sum, item) => sum + item.count, 0);
          const accent = featureAccentColors[groupIndex % featureAccentColors.length];

          return (
            <article key={group.feature} className="card-gray-gradient rounded-xl border border-border p-5 shadow-sm lg:p-6 h-full">
              <div className={sectionHeaderClass}>
                <div className="flex items-center gap-2">
                  <span className={`h-4 w-1 rounded-full ${accent.dot}`} aria-hidden="true" />
                  <h3 className={sectionTitleClass}>{group.feature}</h3>
                </div>
              </div>
              <div className="space-y-3">
                {group.prompts.map((item, idx) => (
                  <div key={item.prompt} className="rounded-xl border border-border/80 bg-gradient-to-br from-background via-background to-card p-4 shadow-sm transition-colors hover:border-border">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex rounded-full px-2 py-1 text-[11px] font-semibold ${accent.badge}`}>
                            อันดับ {idx + 1}
                          </span>
                          <span className="text-xs text-muted-foreground">{((item.count / groupTotal) * 100).toFixed(0)}% ของคำสั่งในกลุ่มนี้</span>
                        </div>
                        <p className="mt-3 text-sm font-medium text-foreground">{item.prompt}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-foreground">{formatNumber(item.count)}</p>
                        <p className="text-xs text-muted-foreground">ครั้ง</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          );
        })}
      </div>

      <article className={sectionCardClass}>
        <div className={sectionHeaderClass}>
          <h3 className={sectionTitleClass}>ต้นทุน AI แยกตามรุ่น</h3>
        </div>
        <div className="grid gap-4 xl:grid-cols-3">
          {modelUsage.map((model) => (
            <div
              key={model.model}
              className="rounded-xl border border-border/80 bg-gradient-to-br from-background via-background to-card p-5 shadow-sm transition-colors hover:border-border"
            >
              <p className="font-semibold text-foreground">{model.model}</p>
              <div className="mt-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-foreground">Input</span>
                  <span className="text-sm font-medium text-foreground">
                    {model.unit === "minutes"
                      ? `${formatNumber(model.inputTokens)} นาที`
                      : `${(model.inputTokens / 1_000_000).toFixed(2)}M tokens`}
                  </span>
                </div>
                {model.outputTokens > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-foreground">Output</span>
                    <span className="text-sm font-medium text-foreground">
                      {(model.outputTokens / 1_000_000).toFixed(2)}M tokens
                    </span>
                  </div>
                )}
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-4">
                <span className="text-xs text-foreground">ต้นทุน</span>
                <span className="text-lg font-bold text-foreground">{formatCurrencyTHB(model.costTHB)}</span>
              </div>
            </div>
          ))}
        </div>
      </article>
    </DashboardPageShell>
  );
}
