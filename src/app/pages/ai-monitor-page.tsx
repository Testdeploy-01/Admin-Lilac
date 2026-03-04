import { useState } from "react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { DashboardPageShell } from "@/components/dashboard/ui/dashboard-page-shell";
import { MetricCard } from "@/components/dashboard/ui/metric-card";
import { DataTableShell } from "@/components/dashboard/ui/data-table-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  aiCallVolumeHourly,
  aiModelUsage,
  aiMonitorStats,
  errorRateHourly,
  flaggedPrompts,
  tokenUsageCost,
  tokenUsageDaily,
  topTextPrompts,
  widgetQuickActions,
  unresolvedQueries,
  widgetInsightsMetrics,
  type FlaggedPrompt,
} from "../../mocks/dashboard-features.mock";
import { formatCurrencyTHB, formatNumber } from "../../lib/formatters";

export function AiMonitorPage() {
  const [flagged, setFlagged] = useState<FlaggedPrompt[]>(flaggedPrompts);

  const maxPromptCount = Math.max(...topTextPrompts.map((p) => p.count), ...widgetQuickActions.map((p) => p.count));

  return (
    <DashboardPageShell title="ตรวจสอบ AI และ Widget" description="ดูคุณภาพและการใช้งาน AI + Widget Insights แบบเรียลไทม์">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {aiMonitorStats.map((item) => (
          <MetricCard key={item.label} label={item.label} value={item.value} note={item.note} />
        ))}
      </div>

      <article className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <div>
          <h3 className="text-base font-semibold">ช่วงเวลาที่แตะวิดเจ็ตบ่อยที่สุด (Tap by Time of Day)</h3>
          <p className="text-sm text-muted-foreground">แยกข้อความ vs เสียง รายชั่วโมง</p>
        </div>
        <div className="mt-4 h-72 w-full">
          <ResponsiveContainer>
            <BarChart data={aiCallVolumeHourly} margin={{ left: 8, right: 8, top: 6 }}>
              <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.5} />
              <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} interval={2} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar dataKey="text" stackId="a" fill="hsl(var(--primary))" name="ข้อความ" />
              <Bar dataKey="voice" stackId="a" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="เสียง" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </article>

      <div className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div>
            <h3 className="text-base font-semibold">วิดเจ็ตโหลดข้อมูลไม่สำเร็จ (%)</h3>
            <p className="text-sm text-muted-foreground">เส้นแจ้งเตือน (2% = เตือน, 5% = วิกฤต)</p>
          </div>
          <div className="mt-4 h-64 w-full">
            <ResponsiveContainer>
              <LineChart data={errorRateHourly} margin={{ left: 8, right: 8, top: 6 }}>
                <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.5} />
                <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} interval={3} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="errorRate" stroke="#ef4444" strokeWidth={2.5} dot={false} name="โหลดไม่สำเร็จ (%)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div>
            <h3 className="text-base font-semibold">ความล่าช้าของข้อมูลบนวิดเจ็ต (Data Staleness)</h3>
            <p className="text-sm text-muted-foreground">ระยะเวลาที่ข้อมูลค้างก่อนอัปเดต (นาที)</p>
          </div>
          <div className="mt-4 h-64 w-full">
            <ResponsiveContainer>
              <LineChart data={errorRateHourly} margin={{ left: 8, right: 8, top: 6 }}>
                <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.5} />
                <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} interval={3} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="median" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={false} name="ค่ากลาง (ms)" />
                <Line type="monotone" dataKey="p95" stroke="#f59e0b" strokeWidth={2} strokeDasharray="6 4" dot={false} name="ค่าสูงสุด 5% (ms)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </article>
      </div>

      <article className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h3 className="text-base font-semibold">ตรวจสอบวิดเจ็ต (Widget Insights)</h3>
        <p className="text-sm text-muted-foreground">ตัวชี้วัดสำคัญสำหรับการใช้งานวิดเจ็ต</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border border-border bg-background p-4">
            <p className="text-sm text-muted-foreground">อัตราการติดตั้งวิดเจ็ต</p>
            <p className="mt-2 text-2xl font-bold">{widgetInsightsMetrics.installRate}%</p>
          </div>
          <div className="rounded-lg border border-border bg-background p-4">
            <p className="text-sm text-muted-foreground">อัตราการแตะวิดเจ็ตรายสัปดาห์</p>
            <p className="mt-2 text-2xl font-bold">{widgetInsightsMetrics.tapRate.weekly}%</p>
          </div>
          <div className="rounded-lg border border-border bg-background p-4">
            <p className="text-sm text-muted-foreground">ระยะเวลาก่อนติดตั้ง (D3)</p>
            <p className="mt-2 text-2xl font-bold">{widgetInsightsMetrics.timeToInstall.d3}%</p>
            <div className="mt-1 space-y-0.5 text-xs text-muted-foreground">
              <p>D1: {widgetInsightsMetrics.timeToInstall.d1}% | D7: {widgetInsightsMetrics.timeToInstall.d7}%</p>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-background p-4">
            <p className="text-sm text-muted-foreground">ทำรายการสำเร็จหลังแตะ</p>
            <p className="mt-2 text-2xl font-bold">{widgetInsightsMetrics.tapToActionCompletion}%</p>
            <p className="mt-1 text-xs text-muted-foreground">
              หยุดกลางคัน {widgetInsightsMetrics.dropOffAfterTap}%
            </p>
          </div>
          <div className="rounded-lg border border-border bg-background p-4">
            <p className="text-sm text-muted-foreground">โหลดข้อมูลไม่สำเร็จ</p>
            <p className="mt-2 text-2xl font-bold text-rose-500">{widgetInsightsMetrics.widgetLoadError}%</p>
            <p className="mt-1 text-xs text-muted-foreground">ล่าช้า {widgetInsightsMetrics.dataStaleness}%</p>
          </div>
          <div className="rounded-lg border border-border bg-background p-4">
            <p className="text-sm text-muted-foreground">อัตราการถอนวิดเจ็ต</p>
            <p className="mt-2 text-2xl font-bold text-rose-500">{widgetInsightsMetrics.uninstallRate}%</p>
          </div>
        </div>
      </article>

      <div className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-base font-semibold">การดำเนินการด่วนผ่านวิดเจ็ต</h3>
          <div className="mt-4 space-y-3">
            {widgetQuickActions.map((item, idx) => (
              <div key={item.prompt}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">#{idx + 1} {item.prompt}</span>
                  <span className="font-semibold">{formatNumber(item.count)} ({item.percentage}%)</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div className="h-2 rounded-full bg-primary" style={{ width: `${(item.count / maxPromptCount) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-base font-semibold">คำถามข้อความยอดนิยม</h3>
          <div className="mt-4 space-y-3">
            {topTextPrompts.map((item, idx) => (
              <div key={item.prompt}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">#{idx + 1} {item.prompt}</span>
                  <span className="font-semibold">{formatNumber(item.count)} ({item.percentage}%)</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div className="h-2 rounded-full bg-primary" style={{ width: `${(item.count / maxPromptCount) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <DataTableShell caption="รายการ query ที่ AI ตอบไม่ได้" minWidthClass="min-w-[520px]">
          <div className="mb-3">
            <h3 className="text-base font-semibold">คำถามที่ AI ตอบไม่ได้</h3>
            <p className="text-sm text-muted-foreground">เรียงตามจำนวนครั้งที่ถาม</p>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Query</TableHead>
                <TableHead>ครั้ง</TableHead>
                <TableHead>หมวด</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {unresolvedQueries.map((query) => (
                <TableRow key={query.query}>
                  <TableCell className="font-medium">{query.query}</TableCell>
                  <TableCell>{query.count}</TableCell>
                  <TableCell><Badge variant="secondary">{query.category}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DataTableShell>

        <DataTableShell caption="รายการ query ที่ถูก flag" minWidthClass="min-w-[620px]">
          <div className="mb-3">
            <h3 className="text-base font-semibold">คำถามที่ถูกตั้งธง</h3>
            <p className="text-sm text-muted-foreground">คำถามที่ขัดกับนโยบายเนื้อหา</p>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Query</TableHead>
                <TableHead>ประเภท</TableHead>
                <TableHead>ครั้ง</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {flagged.map((prompt) => (
                <TableRow key={prompt.id}>
                  <TableCell className="font-medium">{prompt.query}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        prompt.category === "inappropriate"
                          ? "bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300"
                          : prompt.category === "privacy-sensitive"
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300"
                            : "bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300"
                      }
                    >
                      {prompt.category}
                    </Badge>
                  </TableCell>
                  <TableCell>{prompt.count}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant={prompt.isFalsePositive ? "secondary" : "outline"}
                      onClick={() =>
                        setFlagged((prev) => prev.map((item) => (item.id === prompt.id ? { ...item, isFalsePositive: !item.isFalsePositive } : item)))
                      }
                    >
                      {prompt.isFalsePositive ? "ไม่มีปัญหา" : "ทำเครื่องหมาย"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DataTableShell>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1.5fr]">
        <article className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-base font-semibold">การใช้โทเคนและค่าใช้จ่าย</h3>
          <div className="mt-4 space-y-3">
            <div className="rounded-lg border border-border bg-background p-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">วันนี้</span>
                <div className="text-right">
                  <p className="font-semibold">{formatNumber(tokenUsageCost.today.tokens)} tokens</p>
                  <p className="text-xs text-muted-foreground">{formatCurrencyTHB(tokenUsageCost.today.cost)}</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-border bg-background p-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">เดือนนี้</span>
                <div className="text-right">
                  <p className="font-semibold">{formatNumber(tokenUsageCost.thisMonth.tokens)} tokens</p>
                  <p className="text-xs text-muted-foreground">{formatCurrencyTHB(tokenUsageCost.thisMonth.cost)}</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-border bg-background p-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">เดือนที่แล้ว</span>
                <div className="text-right">
                  <p className="font-semibold">{formatNumber(tokenUsageCost.lastMonth.tokens)} tokens</p>
                  <p className="text-xs text-muted-foreground">{formatCurrencyTHB(tokenUsageCost.lastMonth.cost)}</p>
                </div>
              </div>
            </div>
          </div>
        </article>

        <article className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-base font-semibold">การใช้โทเคนรายวัน (30 วัน)</h3>
          <div className="mt-4 h-64 w-full">
            <ResponsiveContainer>
              <BarChart data={tokenUsageDaily} margin={{ left: 8, right: 8, top: 6 }}>
                <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.5} />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} interval={2} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="tokens" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Tokens" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>
      </div>

      <article className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h3 className="text-base font-semibold">การใช้โทเคนแยกตามรุ่น AI</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {aiModelUsage.map((model) => {
            const maxTokens = Math.max(...aiModelUsage.map((row) => row.tokens));
            const width = (model.tokens / maxTokens) * 100;
            return (
              <div key={model.model} className="rounded-xl border border-border bg-background p-5">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-foreground">{model.model}</h4>
                    <p className="mt-0.5 text-xs text-muted-foreground">{model.description}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[14px] font-bold text-foreground">{formatCurrencyTHB(model.costTHB)}</span>
                    <span className="whitespace-nowrap text-[10px] font-medium text-muted-foreground">{model.pricing}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>การใช้โทเคน</span>
                    <span>{formatNumber(model.tokens)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div className="h-2 rounded-full bg-primary/80" style={{ width: `${width}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </article>
    </DashboardPageShell>
  );
}

