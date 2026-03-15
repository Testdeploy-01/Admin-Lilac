import { useMemo, useState } from "react";
import { DashboardPageShell } from "@/components/dashboard/ui/dashboard-page-shell";
import { MetricCard } from "@/components/dashboard/ui/metric-card";
import { DataTableShell } from "@/components/dashboard/ui/data-table-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { formatCurrencyTHB, formatNumber, formatPercent } from "../../lib/formatters";
import {
  managedUsers,
  aiCostSummary,
} from "@/mocks/dashboard-features.mock";

/* ──────────────────────────────────────────────
 * Types & Constants
 * ────────────────────────────────────────────── */
type TimeRange = "today" | "month" | "quarter" | "year";
type ReportCategory = "all" | "users" | "subscription" | "ai";

const timeRangeLabels: Record<TimeRange, string> = {
  today: "วันนี้",
  month: "เดือนนี้",
  quarter: "เทอมนี้",
  year: "ปีนี้",
};

const categoryLabels: Record<ReportCategory, string> = {
  all: "ทั้งหมด",
  users: "ผู้ใช้",
  subscription: "การสมัครสมาชิก",
  ai: "AI",
};

const monthNames = [
  "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
  "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค.",
];

/* ──────────────────────────────────────────────
 * Data Helpers
 * ────────────────────────────────────────────── */

function seededRand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

type MonthlyRow = {
  period: string;
  newUsers: number;
  revenue: number;
  aiCommands: number;
  newPlus: number;
  churnRate: number;
  avgAiPerUser: number;
  conversionRate: number;
};

function buildMonthlyData(range: TimeRange): MonthlyRow[] {
  const rand = seededRand(9001);
  const totalUsers = managedUsers.length;
  const plusUsers = managedUsers.filter((u) => u.plan !== "FREE").length;
  const totalAiCalls = managedUsers.reduce((s, u) => s + u.aiCallsTotal, 0);

  const baseNewUsers = Math.round(totalUsers * 0.04);
  const baseRevenue = plusUsers * 79;
  const baseAiCommands = Math.round(totalAiCalls / 12);
  const baseNewPlus = Math.round(plusUsers * 0.06);

  const monthCount = range === "today" ? 1 : range === "month" ? 1 : range === "quarter" ? 3 : 12;

  // For "month", use current month March 2026
  const actualStart = range === "year" ? 0 : range === "quarter" ? 0 : 2;

  const rows: MonthlyRow[] = [];
  for (let i = 0; i < monthCount; i++) {
    const monthIdx = (actualStart + i) % 12;
    const growthFactor = 1 + i * 0.03 + rand() * 0.06;

    // Adjust logic slightly for 'today'
    const isToday = range === "today";
    const divider = isToday ? 30 : 1;

    const newUsers = Math.round((baseNewUsers * growthFactor * (0.9 + rand() * 0.2)) / divider);
    const revenue = Math.round((baseRevenue * growthFactor * (0.9 + rand() * 0.2)) / divider);
    const aiCommands = Math.round((baseAiCommands * growthFactor * (0.9 + rand() * 0.2)) / divider);
    const newPlus = Math.round((baseNewPlus * growthFactor * (0.9 + rand() * 0.2)) / divider);
    const churnRate = isToday ? +(0.1 + rand() * 0.1).toFixed(1) : +(1.5 + rand() * 1.5).toFixed(1);
    const avgAiPerUser = +(aiCommands / Math.max(newUsers + (totalUsers * 0.3) / divider, 1)).toFixed(1);
    const conversionRate = +((newPlus / Math.max(newUsers, 1)) * 100).toFixed(1);

    const periodLabel = isToday ? new Date().toLocaleDateString("th-TH", { day: 'numeric', month: 'short' }) : monthNames[monthIdx];

    rows.push({
      period: periodLabel,
      newUsers,
      revenue,
      aiCommands,
      newPlus,
      churnRate,
      avgAiPerUser,
      conversionRate,
    });
  }

  return rows;
}

type ReportSummary = {
  totalUsers: number;
  totalRevenue: number;
  totalAiCommands: number;
  totalPlusNew: number;
  usersDelta: string;
  revenueDelta: string;
  aiDelta: string;
  plusDelta: string;
  usersTrend: "up" | "down";
  revenueTrend: "up" | "down";
  aiTrend: "up" | "down";
  plusTrend: "up" | "down";
  rows: MonthlyRow[];
  highlights: ReportHighlight[];
};

type ReportHighlight = {
  text: string;
};

function buildReportSummary(range: TimeRange, category: ReportCategory): ReportSummary {
  const rows = buildMonthlyData(range);
  const totalUsers = managedUsers.length;
  const plusUsers = managedUsers.filter((u) => u.plan !== "FREE").length;

  const totalRevenue = rows.reduce((s, r) => s + r.revenue, 0);
  const totalAiCommands = rows.reduce((s, r) => s + r.aiCommands, 0);
  const totalPlusNew = rows.reduce((s, r) => s + r.newPlus, 0);
  const totalNewUsers = rows.reduce((s, r) => s + r.newUsers, 0);

  const highlights: ReportHighlight[] = [];

  if (category === "all" || category === "users") {
    highlights.push({
      text: `ผู้ใช้ใหม่ ${formatNumber(totalNewUsers)} คน ในช่วง${timeRangeLabels[range]}`,
    });
    const avgChurn = +(rows.reduce((s, r) => s + r.churnRate, 0) / rows.length).toFixed(1);
    highlights.push({
      text: `อัตราการยกเลิกเฉลี่ย ${avgChurn}%`,
    });
  }

  if (category === "all" || category === "subscription") {
    const avgConversion = +(rows.reduce((s, r) => s + r.conversionRate, 0) / rows.length).toFixed(1);
    highlights.push({
      text: `FREE → PLUS เฉลี่ย ${avgConversion}%`,
    });
    highlights.push({
      text: `แพ็กเกจยอดนิยม PLUS รายเดือน ${formatPercent((managedUsers.filter(u => u.plan === "PLUS_MONTHLY").length / plusUsers) * 100)}`,
    });
  }

  if (category === "all" || category === "ai") {
    highlights.push({
      text: `คำสั่ง AI รวม ${formatNumber(totalAiCommands)} คำสั่ง ในช่วง${timeRangeLabels[range]}`,
    });
    const avgAiPerUser = +(totalAiCommands / Math.max(totalUsers, 1)).toFixed(1);

    // adjust cost rough estimate for 'today'
    const costFactor = range === "today" ? (1 / 30) : range === "month" ? 1 : range === "quarter" ? 3 : 12;
    highlights.push({
      text: `เฉลี่ย ${avgAiPerUser} คำสั่ง/ผู้ใช้ · ต้นทุน AI ${formatCurrencyTHB(aiCostSummary.totalMonthlyCostTHB * costFactor)}`,
    });
  }

  return {
    totalUsers,
    totalRevenue,
    totalAiCommands,
    totalPlusNew,
    usersDelta: "+5.2%",
    revenueDelta: range === "month" ? "+12.5%" : range === "quarter" ? "+26.4%" : "+65.8%",
    aiDelta: "+8.3%",
    plusDelta: "+6.1%",
    usersTrend: "up",
    revenueTrend: "up",
    aiTrend: "up",
    plusTrend: "up",
    rows,
    highlights,
  };
}

/* ──────────────────────────────────────────────
 * Export Helpers
 * ────────────────────────────────────────────── */
function exportCsv(summary: ReportSummary, range: TimeRange) {
  const headers = ["ช่วงเวลา", "ผู้ใช้ใหม่", "รายได้ (฿)", "คำสั่ง AI", "สมาชิก PLUS ใหม่", "Churn Rate (%)", "AI/ผู้ใช้", "Conversion (%)"];
  const rows = summary.rows.map((r) =>
    [r.period, r.newUsers, r.revenue, r.aiCommands, r.newPlus, r.churnRate, r.avgAiPerUser, r.conversionRate].join(",")
  );
  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `report_${range}_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function exportPdf(summary: ReportSummary, range: TimeRange) {
  // Generate a print-friendly page and trigger print dialog
  const printContent = `
    <html><head><meta charset="utf-8">
    <title>รายงาน Lilac — ${timeRangeLabels[range]}</title>
    <style>
      body { font-family: 'Segoe UI', Tahoma, sans-serif; padding: 40px; color: #1a1a2e; }
      h1 { font-size: 24px; margin-bottom: 4px; }
      h2 { font-size: 16px; color: #666; margin-bottom: 24px; }
      .summary { display: flex; gap: 24px; margin-bottom: 32px; }
      .card { border: 1px solid #e2e2e2; border-radius: 12px; padding: 16px 20px; min-width: 160px; }
      .card-label { font-size: 12px; color: #888; margin-bottom: 4px; }
      .card-value { font-size: 22px; font-weight: 700; }
      table { width: 100%; border-collapse: collapse; margin-top: 16px; }
      th, td { text-align: left; padding: 10px 12px; border-bottom: 1px solid #eee; font-size: 13px; }
      th { background: #f8f8f8; font-weight: 600; }
      .highlights { margin-top: 24px; }
      .highlight { padding: 8px 0; font-size: 13px; display: flex; align-items: center; gap: 8px; }
      .footer { margin-top: 40px; font-size: 11px; color: #aaa; border-top: 1px solid #eee; padding-top: 12px; }
    </style></head><body>
    <h1>รายงานสรุป Lilac</h1>
    <h2>ช่วงเวลา: ${timeRangeLabels[range]} · สร้างเมื่อ ${new Date().toLocaleDateString("th-TH", { dateStyle: "long" })}</h2>
    <div class="summary">
      <div class="card"><div class="card-label">ผู้ใช้ทั้งหมด</div><div class="card-value">${formatNumber(summary.totalUsers)}</div></div>
      <div class="card"><div class="card-label">รายได้รวม</div><div class="card-value">${formatCurrencyTHB(summary.totalRevenue)}</div></div>
      <div class="card"><div class="card-label">คำสั่ง AI</div><div class="card-value">${formatNumber(summary.totalAiCommands)}</div></div>
      <div class="card"><div class="card-label">สมาชิก PLUS ใหม่</div><div class="card-value">${formatNumber(summary.totalPlusNew)}</div></div>
    </div>
    <table>
      <thead><tr>
        <th>ช่วงเวลา</th><th>ผู้ใช้ใหม่</th><th>รายได้ (฿)</th><th>คำสั่ง AI</th><th>PLUS ใหม่</th><th>อัตราการยกเลิก</th><th>คำสั่ง AI/ผู้ใช้</th><th>FREE → PLUS</th>
      </tr></thead>
      <tbody>${summary.rows.map(r => `<tr><td>${r.period}</td><td>${formatNumber(r.newUsers)}</td><td>${formatCurrencyTHB(r.revenue)}</td><td>${formatNumber(r.aiCommands)}</td><td>${formatNumber(r.newPlus)}</td><td>${r.churnRate}%</td><td>${r.avgAiPerUser}</td><td>${r.conversionRate}%</td></tr>`).join("")}</tbody>
    </table>
    <div class="highlights">
      <h3 style="font-size:14px; margin-bottom:8px;">ไฮไลท์สำคัญ</h3>
      ${summary.highlights.map(h => `<div class="highlight">• ${h.text}</div>`).join("")}
    </div>
    <div class="footer">สร้างโดย Lilac Admin Platform · ${new Date().toLocaleString("th-TH")}</div>
    </body></html>
  `;
  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 300);
  } else {
    alert("ป๊อปอัปถูกบล็อก กรุณาอนุญาต popup สำหรับเว็บนี้แล้วลองอีกครั้ง");
  }
}

/* ──────────────────────────────────────────────
 * Page Component
 * ────────────────────────────────────────────── */
const sectionCardClass = "rounded-xl border border-border bg-card p-4 lg:p-6 shadow-sm";

export function ReportsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>("month");
  const [category, setCategory] = useState<ReportCategory>("all");

  const summary = useMemo(() => buildReportSummary(timeRange, category), [timeRange, category]);

  const showUsers = category === "all" || category === "users";
  const showSubscription = category === "all" || category === "subscription";
  const showAi = category === "all" || category === "ai";

  return (
    <DashboardPageShell
      title="รายงาน"
      actions={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportPdf(summary, timeRange)}
          >
            Export PDF
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportCsv(summary, timeRange)}
          >
            Export CSV
          </Button>
        </div>
      }
    >
      <div className={cn(sectionCardClass, "flex flex-wrap items-center gap-3 py-3 lg:py-4")}>
        <span className="text-sm font-medium text-foreground mr-1">ตัวกรอง</span>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground">ช่วงเวลา:</span>
          <Select value={timeRange} onValueChange={(v) => setTimeRange(v as TimeRange)}>
            <SelectTrigger className="w-[140px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(timeRangeLabels) as TimeRange[]).map((key) => (
                <SelectItem key={key} value={key}>{timeRangeLabels[key]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground">ประเภท:</span>
          <Select value={category} onValueChange={(v) => setCategory(v as ReportCategory)}>
            <SelectTrigger className="w-[160px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(categoryLabels) as ReportCategory[]).map((key) => (
                <SelectItem key={key} value={key}>{categoryLabels[key]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="ml-auto hidden sm:block">
          <span className="text-xs text-muted-foreground mr-1">
            อัปเดตล่าสุด: {new Date().toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>
      </div>

      {/* ── Summary Cards ── */}
      <div className={cn(
        "grid gap-4",
        showUsers && showSubscription && showAi
          ? "sm:grid-cols-2 lg:grid-cols-4"
          : "sm:grid-cols-2 lg:grid-cols-3"
      )}>
        {showUsers && (
          <MetricCard
            label="ผู้ใช้ทั้งหมด"
            value={formatNumber(summary.totalUsers)}
            delta={summary.usersDelta}
            trend={summary.usersTrend}
            note={`ผู้ใช้ใหม่ ${formatNumber(summary.rows.reduce((s, r) => s + r.newUsers, 0))} คน`}
            className="min-h-[132px] p-5"
          />
        )}
        {showSubscription && (
          <MetricCard
            label="รายได้รวม"
            value={formatCurrencyTHB(summary.totalRevenue)}
            delta={summary.revenueDelta}
            trend={summary.revenueTrend}
            note={`ตามช่วง${timeRangeLabels[timeRange]}`}
            className="min-h-[132px] p-5"
          />
        )}
        {showAi && (
          <MetricCard
            label="คำสั่ง AI"
            value={formatNumber(summary.totalAiCommands)}
            delta={summary.aiDelta}
            trend={summary.aiTrend}
            note={`เฉลี่ย ${(summary.totalAiCommands / Math.max(summary.totalUsers, 1)).toFixed(1)} คำสั่ง/ผู้ใช้`}
            className="min-h-[132px] p-5"
          />
        )}
        {showSubscription && (
          <MetricCard
            label="สมาชิก PLUS ใหม่"
            value={formatNumber(summary.totalPlusNew)}
            delta={summary.plusDelta}
            trend={summary.plusTrend}
            note={`จากทั้งหมด ${formatNumber(managedUsers.filter(u => u.plan !== "FREE").length)} คน`}
            className="min-h-[132px] p-5"
          />
        )}
      </div>

      <article className={sectionCardClass}>
        <div className="mb-4">
          <h3 className="text-base font-semibold text-foreground">ไฮไลท์สำคัญ</h3>
        </div>
        <div className="space-y-2">
          {summary.highlights.map((h, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-xl border border-border/60 bg-background/40 p-3"
            >
              <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
              <span className="text-sm text-foreground">{h.text}</span>
            </div>
          ))}
        </div>
      </article>

      <DataTableShell
        caption={`ตารางรายละเอียด — ${timeRangeLabels[timeRange]}`}
        minWidthClass="min-w-[800px]"
        toolbar={
          <div className="flex items-center justify-between gap-3 px-1 mb-4">
            <h3 className="text-base font-semibold text-foreground">รายละเอียดตามช่วงเวลา</h3>
            <Badge variant="secondary" className="rounded-full px-3 py-1 shrink-0">
              {summary.rows.length} แถว
            </Badge>
          </div>
        }
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ช่วงเวลา</TableHead>
              {showUsers && <TableHead>ผู้ใช้ใหม่</TableHead>}
              {showSubscription && <TableHead>รายได้</TableHead>}
              {showAi && <TableHead>คำสั่ง AI</TableHead>}
              {showSubscription && <TableHead>PLUS ใหม่</TableHead>}
              {showUsers && <TableHead>อัตราการยกเลิก</TableHead>}
              {showAi && <TableHead>คำสั่ง AI/ผู้ใช้</TableHead>}
              {showSubscription && <TableHead>FREE → PLUS</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {summary.rows.map((row) => (
              <TableRow key={row.period}>
                <TableCell className="font-medium">{row.period}</TableCell>
                {showUsers && <TableCell>{formatNumber(row.newUsers)}</TableCell>}
                {showSubscription && <TableCell className="font-semibold">{formatCurrencyTHB(row.revenue)}</TableCell>}
                {showAi && <TableCell>{formatNumber(row.aiCommands)}</TableCell>}
                {showSubscription && <TableCell>{formatNumber(row.newPlus)}</TableCell>}
                {showUsers && (
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        "font-normal",
                        row.churnRate > (timeRange === "today" ? 0.3 : 2.5)
                          ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                          : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                      )}
                    >
                      {row.churnRate}%
                    </Badge>
                  </TableCell>
                )}
                {showAi && (
                  <TableCell className="text-muted-foreground">{row.avgAiPerUser}</TableCell>
                )}
                {showSubscription && (
                  <TableCell>
                    <span className="text-muted-foreground">{row.conversionRate}%</span>
                  </TableCell>
                )}
              </TableRow>
            ))}
            {/* Totals row */}
            <TableRow className="bg-muted/30 font-semibold border-t-2 border-border">
              <TableCell>รวม</TableCell>
              {showUsers && <TableCell>{formatNumber(summary.rows.reduce((s, r) => s + r.newUsers, 0))}</TableCell>}
              {showSubscription && <TableCell>{formatCurrencyTHB(summary.totalRevenue)}</TableCell>}
              {showAi && <TableCell>{formatNumber(summary.totalAiCommands)}</TableCell>}
              {showSubscription && <TableCell>{formatNumber(summary.totalPlusNew)}</TableCell>}
              {showUsers && (
                <TableCell>
                  <span className="text-muted-foreground">เฉลี่ย {(summary.rows.reduce((s, r) => s + r.churnRate, 0) / summary.rows.length).toFixed(1)}%</span>
                </TableCell>
              )}
              {showAi && (
                <TableCell className="text-muted-foreground">
                  {(summary.rows.reduce((s, r) => s + r.avgAiPerUser, 0) / summary.rows.length).toFixed(1)}
                </TableCell>
              )}
              {showSubscription && (
                <TableCell>
                  <span className="text-muted-foreground">
                    เฉลี่ย {(summary.rows.reduce((s, r) => s + r.conversionRate, 0) / summary.rows.length).toFixed(1)}%
                  </span>
                </TableCell>
              )}
            </TableRow>
          </TableBody>
        </Table>
      </DataTableShell>


    </DashboardPageShell>
  );
}
