import { useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { DashboardPageShell } from "@/components/dashboard/ui/dashboard-page-shell";
import { AppTabs } from "@/components/dashboard/ui/app-tabs";
import { DataTableShell } from "@/components/dashboard/ui/data-table-shell";
import { MetricCard } from "@/components/dashboard/ui/metric-card";
import { Badge } from "@/components/ui/badge";
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { formatCurrencyTHB, formatNumber, formatPercent } from "../../lib/formatters";
import {
  aiCostSummary,
  churnAnalysis,
  managedUsers,
  type PlanKey,
  weeklyRetentionByPlan,
} from "../../mocks/dashboard-features.mock";

type TimeRange = "today" | "month" | "6months" | "year";

type FinanceSeriesPoint = {
  label: string;
  revenue: number;
  aiCost: number;
};

type PackagePlan = {
  planKey: Exclude<PlanKey, "FREE">;
  label: string;
  priceLabel: string;
  monthlyEquivalentRevenue: number;
};

const periodTabs = [
  { value: "today", label: "วันนี้" },
  { value: "month", label: "เดือนนี้" },
  { value: "6months", label: "6 เดือนที่ผ่านมา" },
  { value: "year", label: "1 ปีที่ผ่านมา" },
] as const;

const periodMeta: Record<TimeRange, {
  narrative: string;
  chartCaption: string;
  tickInterval: number;
  monthsEquivalent: number;
}> = {
  today: {
    narrative: "โฟกัสเงินเข้าเทียบ AI burn แบบรายชั่วโมงเพื่อจับ anomaly ในวันเดียวกัน",
    chartCaption: "แกน X แสดงเป็นรายชั่วโมง และแกน Y เป็นบาท",
    tickInterval: 2,
    monthsEquivalent: 1 / 30,
  },
  month: {
    narrative: "ดูรายได้รับรู้และต้นทุน AI แบบรายวันของเดือนปัจจุบันเพื่ออ่านคุณภาพรายได้อย่างใกล้ชิด",
    chartCaption: "แกน X แสดงเป็นรายวัน และแกน Y เป็นบาท",
    tickInterval: 4,
    monthsEquivalent: 1,
  },
  "6months": {
    narrative: "อ่าน momentum ของรายได้เทียบต้นทุนในครึ่งปีล่าสุดว่ากำไรโตตามรายได้หรือไม่",
    chartCaption: "แกน X แสดงเป็นรายเดือนย้อนหลัง 6 เดือน และแกน Y เป็นบาท",
    tickInterval: 0,
    monthsEquivalent: 6,
  },
  year: {
    narrative: "ใช้มุมมองรอบปีเพื่อเทียบ margin, mix ของแพ็กเกจ และความเสี่ยงจาก churn",
    chartCaption: "แกน X แสดงเป็นรายเดือนย้อนหลัง 12 เดือน และแกน Y เป็นบาท",
    tickInterval: 0,
    monthsEquivalent: 12,
  },
};

const packagePlans: PackagePlan[] = [
  {
    planKey: "PLUS_MONTHLY",
    label: "Lilac PLUS รายเดือน",
    priceLabel: "฿59/เดือน",
    monthlyEquivalentRevenue: 59,
  },
  {
    planKey: "PLUS_TERM",
    label: "Lilac PLUS รายเทอม",
    priceLabel: "฿199/เทอม",
    monthlyEquivalentRevenue: 199 / 4,
  },
  {
    planKey: "PLUS_YEARLY",
    label: "Lilac PLUS รายปี",
    priceLabel: "฿599/ปี",
    monthlyEquivalentRevenue: 599 / 12,
  },
];

const yearlyTrendFactors = [
  { label: "เม.ย.", revenueFactor: 0.74, costFactor: 0.8 },
  { label: "พ.ค.", revenueFactor: 0.79, costFactor: 0.83 },
  { label: "มิ.ย.", revenueFactor: 0.83, costFactor: 0.86 },
  { label: "ก.ค.", revenueFactor: 0.87, costFactor: 0.89 },
  { label: "ส.ค.", revenueFactor: 0.9, costFactor: 0.92 },
  { label: "ก.ย.", revenueFactor: 0.93, costFactor: 0.95 },
  { label: "ต.ค.", revenueFactor: 0.95, costFactor: 0.97 },
  { label: "พ.ย.", revenueFactor: 0.98, costFactor: 0.99 },
  { label: "ธ.ค.", revenueFactor: 1.01, costFactor: 1.01 },
  { label: "ม.ค.", revenueFactor: 1.03, costFactor: 1.02 },
  { label: "ก.พ.", revenueFactor: 1.01, costFactor: 1.01 },
  { label: "มี.ค.", revenueFactor: 1.06, costFactor: 1.03 },
];

const financeChartConfig = {
  revenue: {
    label: "รายได้",
    color: "hsl(var(--chart-2))",
  },
  aiCost: {
    label: "ค่าใช้จ่าย AI",
    color: "hsl(var(--destructive))",
  },
} satisfies ChartConfig;

const sectionCardClass = "card-gray-gradient rounded-xl border border-border p-5 shadow-sm lg:p-6";
const sectionHeaderClass = "mb-4 flex items-start justify-between gap-3";
const sectionTitleClass = "text-base font-semibold text-foreground";
const innerPanelClass = "rounded-xl border border-border/70 bg-background/80 p-4";
const chartPanelClass = "rounded-xl border border-border/70 bg-background/70 p-3";

function roundToTwo(value: number) {
  return Number(value.toFixed(2));
}

function distributeTotal(total: number, weights: number[]) {
  const weightSum = weights.reduce((sum, weight) => sum + weight, 0);
  return weights.map((weight) => roundToTwo((weight / Math.max(weightSum, 1)) * total));
}

function formatCompactCurrency(value: number) {
  const absolute = Math.abs(value);

  if (absolute >= 1_000_000) {
    return `฿${(value / 1_000_000).toFixed(absolute >= 10_000_000 ? 0 : 1)}M`;
  }

  if (absolute >= 1_000) {
    return `฿${Math.round(value / 1_000)}k`;
  }

  return `฿${Math.round(value)}`;
}

function buildFinanceSeries(range: TimeRange, baseMonthlyRevenue: number, baseMonthlyAiCost: number): FinanceSeriesPoint[] {
  if (range === "today") {
    const revenueWeights = Array.from({ length: 24 }, (_, hour) => {
      const businessPeak = hour >= 10 && hour <= 21 ? 0.42 : 0;
      const morningLift = hour >= 7 && hour <= 9 ? 0.18 : 0;
      const overnightDip = hour <= 4 ? -0.18 : 0;
      return Math.max(0.2, 0.55 + businessPeak + morningLift + overnightDip + Math.sin((hour / 24) * Math.PI * 2 - 1.2) * 0.14);
    });

    const costWeights = Array.from({ length: 24 }, (_, hour) => {
      const eveningUsage = hour >= 18 && hour <= 23 ? 0.28 : 0;
      const afternoonLift = hour >= 12 && hour <= 17 ? 0.15 : 0;
      const overnightDip = hour <= 5 ? -0.12 : 0;
      return Math.max(0.24, 0.62 + eveningUsage + afternoonLift + overnightDip + Math.cos((hour / 24) * Math.PI * 2 - 0.3) * 0.08);
    });

    const revenueSeries = distributeTotal(baseMonthlyRevenue / 30, revenueWeights);
    const costSeries = distributeTotal(baseMonthlyAiCost / 30, costWeights);

    return Array.from({ length: 24 }, (_, hour) => ({
      label: `${String(hour).padStart(2, "0")}:00`,
      revenue: revenueSeries[hour],
      aiCost: costSeries[hour],
    }));
  }

  if (range === "month") {
    const revenueWeights = Array.from({ length: 30 }, (_, index) => (
      1
      + (Math.sin((index + 1) * 0.45) * 0.16)
      + ((index % 7) >= 5 ? 0.1 : -0.03)
      + (index % 6 === 0 ? 0.06 : 0)
    ));

    const costWeights = Array.from({ length: 30 }, (_, index) => (
      1
      + (Math.cos((index + 1) * 0.38) * 0.1)
      + ((index % 7) >= 5 ? 0.12 : -0.01)
      + (index % 9 === 0 ? 0.04 : 0)
    ));

    const revenueSeries = distributeTotal(baseMonthlyRevenue, revenueWeights);
    const costSeries = distributeTotal(baseMonthlyAiCost, costWeights);

    return Array.from({ length: 30 }, (_, index) => ({
      label: String(index + 1),
      revenue: revenueSeries[index],
      aiCost: costSeries[index],
    }));
  }

  const trendWindow = range === "6months" ? yearlyTrendFactors.slice(-6) : yearlyTrendFactors;

  return trendWindow.map((item) => ({
    label: item.label,
    revenue: roundToTwo(baseMonthlyRevenue * item.revenueFactor),
    aiCost: roundToTwo(baseMonthlyAiCost * item.costFactor),
  }));
}

function FinanceChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number | string; color?: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-lg border border-border bg-background px-3 py-2 shadow-sm">
      {label ? <p className="text-sm font-semibold text-foreground">{label}</p> : null}
      <div className="mt-2 space-y-1.5">
        {payload.map((entry) => (
          <div key={`${entry.name}-${entry.color}`} className="flex items-center justify-between gap-4 text-xs">
            <span className="text-muted-foreground">{entry.name}</span>
            <span className="font-semibold text-foreground">{formatCurrencyTHB(Number(entry.value ?? 0))}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionToolbar({
  title,
  description,
  badge,
}: {
  title: string;
  description?: string;
  badge: string;
}) {
  return (
    <div className={sectionHeaderClass}>
      <div>
        <h3 className={sectionTitleClass}>{title}</h3>
        {description ? <p className="text-sm leading-6 text-muted-foreground">{description}</p> : null}
      </div>
      <Badge variant="secondary" className="rounded-full px-3 py-1">
        {badge}
      </Badge>
    </div>
  );
}

function FinanceDetailCard({
  label,
  value,
  tone = "neutral",
  meter,
}: {
  label: string;
  value: string;
  tone?: "positive" | "warning" | "neutral";
  meter?: number;
}) {
  const toneClass =
    tone === "positive"
      ? "text-emerald-600 dark:text-emerald-400"
      : tone === "warning"
        ? "text-rose-600 dark:text-rose-400"
        : "text-foreground";

  const meterClass =
    tone === "positive"
      ? "bg-emerald-500"
      : tone === "warning"
        ? "bg-rose-500"
        : "bg-primary";

  return (
    <div className={cn(innerPanelClass, "flex h-full flex-col justify-between")}>
      <div>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className={cn("mt-2 text-lg font-semibold", toneClass)}>{value}</p>
      </div>
      {typeof meter === "number" ? (
        <div className="mt-3 h-2 rounded-full bg-muted">
          <div className={cn("h-2 rounded-full", meterClass)} style={{ width: `${Math.min(Math.max(meter, 0), 100)}%` }} />
        </div>
      ) : null}
    </div>
  );
}

export function FinancePage() {
  const [period, setPeriod] = useState<TimeRange>("month");

  const financeModel = useMemo(() => {
    const meta = periodMeta[period];
    const initialPlanCounts: Record<PlanKey, number> = {
      FREE: 0,
      PLUS_MONTHLY: 0,
      PLUS_TERM: 0,
      PLUS_YEARLY: 0,
    };

    const planCounts = managedUsers.reduce((counts, user) => {
      counts[user.plan] += 1;
      return counts;
    }, initialPlanCounts);

    const totalUsers = managedUsers.length;
    const freeUsers = planCounts.FREE;
    const paidUsers = totalUsers - freeUsers;

    let freeCostTotal = 0;
    let plusCostTotal = 0;

    for (const user of managedUsers) {
      if (user.plan === "FREE") freeCostTotal += user.aiCostTHB;
      else plusCostTotal += user.aiCostTHB;
    }

    const baseMonthlyRevenueByPlan = {
      PLUS_MONTHLY: planCounts.PLUS_MONTHLY * packagePlans[0].monthlyEquivalentRevenue,
      PLUS_TERM: planCounts.PLUS_TERM * packagePlans[1].monthlyEquivalentRevenue,
      PLUS_YEARLY: planCounts.PLUS_YEARLY * packagePlans[2].monthlyEquivalentRevenue,
    };

    const baseMonthlyRevenue =
      baseMonthlyRevenueByPlan.PLUS_MONTHLY
      + baseMonthlyRevenueByPlan.PLUS_TERM
      + baseMonthlyRevenueByPlan.PLUS_YEARLY;

    const baseMonthlyAiCost = aiCostSummary.totalMonthlyCostTHB;
    const series = buildFinanceSeries(period, baseMonthlyRevenue, baseMonthlyAiCost);
    const totalRevenue = roundToTwo(series.reduce((sum, item) => sum + item.revenue, 0));
    const totalAiCost = roundToTwo(series.reduce((sum, item) => sum + item.aiCost, 0));
    const netProfit = roundToTwo(totalRevenue - totalAiCost);
    const marginRate = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
    const costLoadRate = totalRevenue > 0 ? (totalAiCost / totalRevenue) * 100 : 0;
    const rangeRevenueMultiplier = baseMonthlyRevenue > 0 ? totalRevenue / baseMonthlyRevenue : 0;
    const paidShare = (paidUsers / Math.max(totalUsers, 1)) * 100;

    const packageRows = packagePlans.map((plan) => {
      const revenue = roundToTwo(baseMonthlyRevenueByPlan[plan.planKey] * rangeRevenueMultiplier);
      return {
        ...plan,
        users: planCounts[plan.planKey],
        revenue,
        share: totalRevenue > 0 ? (revenue / totalRevenue) * 100 : 0,
      };
    });

    const leadingPlan = packageRows.reduce((best, row) => (row.revenue > best.revenue ? row : best), packageRows[0]);
    const freeCostPerUser = freeCostTotal / Math.max(freeUsers, 1);
    const plusCostPerUser = plusCostTotal / Math.max(paidUsers, 1);
    const plusRevenuePerUser = baseMonthlyRevenue / Math.max(paidUsers, 1);
    const plusProfitPerUser = plusRevenuePerUser - plusCostPerUser;
    const plusRetentionRate = weeklyRetentionByPlan.length > 0
      ? (weeklyRetentionByPlan[weeklyRetentionByPlan.length - 1].plus / Math.max(weeklyRetentionByPlan[0].plus, 1)) * 100
      : 0;
    const trialToPaidRate = period === "today" ? 39.8 : period === "month" ? 41.6 : period === "6months" ? 43.1 : 42.4;
    const churnRate = 100 * (1 - Math.pow(1 - (churnAnalysis.churnRate / 100), meta.monthsEquivalent));
    const successfulReferrals = Math.max(3, Math.round(118 * rangeRevenueMultiplier));
    const arpu = totalRevenue / Math.max(paidUsers, 1);

    return {
      meta,
      totalUsers,
      paidUsers,
      paidShare,
      freeUsers,
      freeCostTotal,
      series,
      totalRevenue,
      totalAiCost,
      netProfit,
      marginRate,
      costLoadRate,
      packageRows,
      leadingPlan,
      freeCostPerUser,
      plusCostPerUser,
      plusRevenuePerUser,
      plusProfitPerUser,
      plusRetentionRate,
      trialToPaidRate,
      churnRate,
      successfulReferrals,
      arpu,
    };
  }, [period]);

  const summaryCards = [
    {
      label: "รายได้รวม",
      value: formatCurrencyTHB(financeModel.totalRevenue),
    },
    {
      label: "ค่าใช้จ่าย AI",
      value: formatCurrencyTHB(financeModel.totalAiCost),
    },
    {
      label: "กำไรสุทธิ",
      value: formatCurrencyTHB(financeModel.netProfit),
    },
    {
      label: "อัตรากำไร",
      value: formatPercent(financeModel.marginRate),
    },
  ];

  return (
    <DashboardPageShell
      title="การเงิน"
      description="ติดตามรายได้ PLUS, ต้นทุน AI และคุณภาพของรายได้ให้สอดคล้องกับภาพรวม dashboard"
    >
      <AppTabs
        value={period}
        onValueChange={(value) => setPeriod(value as TimeRange)}
        items={[...periodTabs]}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((item) => (
          <MetricCard key={item.label} label={item.label} value={item.value} className="min-h-[132px] p-5" />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <article className={sectionCardClass}>
          <SectionToolbar
            title="ภาพรวมธุรกิจ"
            badge={`มุมมอง ${periodTabs.find((item) => item.value === period)?.label}`}
          />
          <div className="grid gap-3 md:grid-cols-2">
            <FinanceDetailCard
              label="ฐานผู้ใช้ที่จ่ายเงิน"
              value={formatNumber(financeModel.paidUsers)}
            />
            <FinanceDetailCard
              label="แพ็กเกจนำรายได้"
              value={financeModel.leadingPlan.label}
            />
            <FinanceDetailCard
              label="AI burn ต่อรายได้"
              value={formatPercent(financeModel.costLoadRate)}
              tone={financeModel.costLoadRate > 45 ? "warning" : "neutral"}
              meter={financeModel.costLoadRate}
            />
            <FinanceDetailCard
              label="PLUS retention"
              value={formatPercent(financeModel.plusRetentionRate)}
              tone="positive"
              meter={financeModel.plusRetentionRate}
            />
          </div>
        </article>

        <article className={sectionCardClass}>
          <SectionToolbar
            title="จุดที่ต้องเฝ้าระวัง"
            badge="จุดเสี่ยง"
          />
          <div className="grid gap-3 md:grid-cols-2">
            <FinanceDetailCard
              label="FREE burn ต่อเดือน"
              value={formatCurrencyTHB(financeModel.freeCostTotal)}
              tone="warning"
            />
            <FinanceDetailCard
              label="Spread ของ PLUS ต่อคน"
              value={formatCurrencyTHB(financeModel.plusProfitPerUser)}
              tone="positive"
            />
            <FinanceDetailCard
              label="ความเสี่ยงจาก churn"
              value={formatPercent(financeModel.churnRate)}
              tone="warning"
              meter={financeModel.churnRate}
            />
            <FinanceDetailCard
              label="Referral ที่ปิดได้"
              value={formatNumber(financeModel.successfulReferrals)}
            />
          </div>
        </article>
      </div>

      <article className={sectionCardClass}>
        <SectionToolbar
          title="รายได้เทียบค่าใช้จ่าย AI"
          badge="แนวโน้ม"
        />

        <div className="mb-4 grid gap-3 sm:grid-cols-2">
          <div className={innerPanelClass}>
            <p className="text-xs text-muted-foreground">รายได้สะสม</p>
            <p className="mt-1 text-base font-semibold text-foreground">{formatCurrencyTHB(financeModel.totalRevenue)}</p>
          </div>
          <div className={innerPanelClass}>
            <p className="text-xs text-muted-foreground">กำไรสะสม</p>
            <p className="mt-1 text-base font-semibold text-foreground">{formatCurrencyTHB(financeModel.netProfit)}</p>
          </div>
        </div>

        <div className={chartPanelClass}>
          <ChartContainer config={financeChartConfig} className="h-[160px] w-full">
            <LineChart data={financeModel.series} margin={{ left: 8, right: 8, top: 10 }}>
              <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.45} />
              <XAxis dataKey="label" tickLine={false} axisLine={false} minTickGap={20} interval={financeModel.meta.tickInterval} />
              <YAxis tickLine={false} axisLine={false} width={74} tickFormatter={(value) => formatCompactCurrency(Number(value))} />
              <ChartTooltip content={<FinanceChartTooltip />} />
              <Line type="monotone" dataKey="revenue" name="รายได้" stroke="var(--color-revenue)" strokeWidth={3} dot={false} activeDot={false} />
              <Line type="monotone" dataKey="aiCost" name="ค่าใช้จ่าย AI" stroke="var(--color-aiCost)" strokeWidth={3} dot={false} activeDot={false} />
            </LineChart>
          </ChartContainer>
        </div>
      </article>

      <div className="grid gap-4">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.18fr)_minmax(0,0.82fr)]">
        <DataTableShell
          caption="ตารางรายได้แยกตามแพ็กเกจ"
          minWidthClass="min-w-[760px]"
          className="h-full min-w-0"
          toolbar={(
            <SectionToolbar
              title="รายได้แยกตามแพ็กเกจ"
              badge="แพ็กเกจ"
            />
          )}
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>แพ็กเกจ</TableHead>
                <TableHead>ราคา</TableHead>
                <TableHead>จำนวนผู้ใช้</TableHead>
                <TableHead>รายได้</TableHead>
                <TableHead>สัดส่วน</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {financeModel.packageRows.map((row) => (
                <TableRow key={row.planKey}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">{row.label}</p>
                      {row.planKey === financeModel.leadingPlan.planKey ? (
                        <p className="text-xs text-muted-foreground">แพ็กเกจนำรายได้ในช่วงนี้</p>
                      ) : null}
                    </div>
                  </TableCell>
                  <TableCell>{row.priceLabel}</TableCell>
                  <TableCell className="font-semibold text-foreground">{formatNumber(row.users)}</TableCell>
                  <TableCell className="font-semibold text-foreground">{formatCurrencyTHB(row.revenue)}</TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                        <span>{formatPercent(row.share)}</span>
                        {row.planKey === financeModel.leadingPlan.planKey ? (
                          <Badge variant="secondary" className="rounded-full px-2.5 py-1 text-[11px]">
                            เด่นสุด
                          </Badge>
                        ) : null}
                      </div>
                      <div className="h-2 rounded-full bg-muted">
                        <div className="h-2 rounded-full bg-primary" style={{ width: `${row.share}%` }} />
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3}>รวม</TableCell>
                <TableCell className="font-semibold">{formatCurrencyTHB(financeModel.totalRevenue)}</TableCell>
                <TableCell>{formatPercent(100)}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </DataTableShell>
        <DataTableShell
          caption="ตารางต้นทุนและกำไรต่อผู้ใช้"
          minWidthClass="min-w-[480px]"
          className="h-full min-w-0"
          toolbar={(
            <SectionToolbar
              title="ต้นทุนและกำไรต่อผู้ใช้"
              badge="ต่อผู้ใช้"
            />
          )}
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ตัวชี้วัด</TableHead>
                <TableHead>FREE</TableHead>
                <TableHead>PLUS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">รายได้/คน/เดือน</TableCell>
                <TableCell>
                  <p className="font-semibold text-foreground">{formatCurrencyTHB(0)}</p>
                  <p className="text-xs text-muted-foreground">ไม่มี recurring revenue</p>
                </TableCell>
                <TableCell>
                  <p className="font-semibold text-foreground">{formatCurrencyTHB(financeModel.plusRevenuePerUser)}</p>
                  <p className="text-xs text-muted-foreground">เฉลี่ยจาก mix ของแพ็กเกจ PLUS</p>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">ต้นทุน AI/คน/เดือน</TableCell>
                <TableCell>
                  <p className="font-semibold text-foreground">{formatCurrencyTHB(financeModel.freeCostPerUser)}</p>
                  <p className="text-xs text-muted-foreground">FREE ยังมีต้นทุนตรงจากการใช้ AI</p>
                </TableCell>
                <TableCell>
                  <p className="font-semibold text-foreground">{formatCurrencyTHB(financeModel.plusCostPerUser)}</p>
                  <p className="text-xs text-muted-foreground">ผู้ใช้ PLUS ใช้ AI หนาแน่นกว่า</p>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">กำไร/คน/เดือน</TableCell>
                <TableCell>
                  <p className="font-semibold text-rose-600 dark:text-rose-400">ขาดทุน {formatCurrencyTHB(financeModel.freeCostPerUser)}</p>
                  <p className="text-xs text-muted-foreground">FREE เป็น cost ด้าน acquisition และ engagement</p>
                </TableCell>
                <TableCell>
                  <p className="font-semibold text-emerald-600 dark:text-emerald-400">กำไร {formatCurrencyTHB(financeModel.plusProfitPerUser)}</p>
                  <p className="text-xs text-muted-foreground">PLUS ยังมี spread บวกต่อคนอย่างชัดเจน</p>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </DataTableShell>
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <article className={sectionCardClass}>
          <SectionToolbar
            title="การแปลงและการรักษาผู้ใช้"
            badge="การรักษา"
          />

          <div className="grid gap-3 md:grid-cols-2">
            <FinanceDetailCard
              label="ทดลองใช้ → สมัครจริง"
              value={formatPercent(financeModel.trialToPaidRate)}
              tone="positive"
              meter={financeModel.trialToPaidRate}
            />
            <FinanceDetailCard
              label="อัตราการยกเลิก"
              value={formatPercent(financeModel.churnRate)}
              tone="warning"
              meter={financeModel.churnRate}
            />
            <FinanceDetailCard
              label="ชวนเพื่อนสำเร็จ"
              value={formatNumber(financeModel.successfulReferrals)}
            />
            <FinanceDetailCard
              label="รายได้เฉลี่ยต่อผู้ใช้"
              value={formatCurrencyTHB(financeModel.arpu)}
            />
          </div>

          <div className="mt-4 rounded-xl border border-border/70 bg-background/80 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="font-semibold text-foreground">เหตุผลยกเลิกหลัก</p>
              <span className="text-sm font-semibold text-foreground">{formatPercent(churnAnalysis.churnRate)}</span>
            </div>
            <div className="mt-3 space-y-3">
              {churnAnalysis.churnReasons.slice(0, 3).map((item) => (
                <div key={item.reason}>
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-muted-foreground">{item.reason}</span>
                    <span className="font-semibold text-foreground">{item.ratio}%</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-muted">
                    <div className="h-2 rounded-full bg-amber-500" style={{ width: `${item.ratio}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </article>

        <article className={cn(sectionCardClass, "min-w-0")}>
          <SectionToolbar
            title="แรงกดต่อ margin"
            badge="แรงกด"
          />

          <div className="grid gap-3">
            <FinanceDetailCard
              label="FREE burn รวม"
              value={formatCurrencyTHB(financeModel.freeCostTotal)}
              tone="warning"
            />
            <FinanceDetailCard
              label="สัดส่วนรายได้จากแพ็กเกจนำ"
              value={formatPercent(financeModel.leadingPlan.share)}
            />
            <FinanceDetailCard
              label="AI cost load"
              value={formatPercent(financeModel.costLoadRate)}
              tone={financeModel.costLoadRate > 45 ? "warning" : "neutral"}
              meter={financeModel.costLoadRate}
            />
            <FinanceDetailCard
              label="กำไรต่อ PLUS หนึ่งคน"
              value={formatCurrencyTHB(financeModel.plusProfitPerUser)}
              tone="positive"
            />
          </div>
        </article>
        </div>
      </div>
    </DashboardPageShell>
  );
}
