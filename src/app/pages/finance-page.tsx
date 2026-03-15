import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
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
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { formatCurrencyTHB, formatNumber, formatPercent } from "../../lib/formatters";
import {
  managedUsers,
  type PlanKey,
  weeklyRetentionByPlan,
} from "../../mocks/dashboard-features.mock";

type TimeRange = "today" | "month" | "6months" | "year";

type FinanceSeriesPoint = {
  label: string;
  revenue: number;
};

type PackagePlan = {
  planKey: Exclude<PlanKey, "FREE">;
  label: string;
  priceLabel: string;
  monthlyEquivalentRevenue: number;
  fullPrice: number;
};

const periodTabs = [
  { value: "today", label: "วันนี้" },
  { value: "month", label: "เดือนนี้" },
  { value: "6months", label: "6 เดือนที่ผ่านมา" },
  { value: "year", label: "1 ปีที่ผ่านมา" },
] as const;

const periodMeta: Record<TimeRange, {
  tickInterval: number;
  monthsEquivalent: number;
}> = {
  today: {
    tickInterval: 2,
    monthsEquivalent: 1 / 30,
  },
  month: {
    tickInterval: 4,
    monthsEquivalent: 1,
  },
  "6months": {
    tickInterval: 0,
    monthsEquivalent: 6,
  },
  year: {
    tickInterval: 0,
    monthsEquivalent: 12,
  },
};

const packagePlans: PackagePlan[] = [
  {
    planKey: "PLUS_MONTHLY",
    label: "Lilac PLUS รายเดือน",
    priceLabel: "฿79/เดือน",
    monthlyEquivalentRevenue: 79,
    fullPrice: 79,
  },
  {
    planKey: "PLUS_TERM",
    label: "Lilac PLUS รายเทอม",
    priceLabel: "฿259/เทอม",
    monthlyEquivalentRevenue: 259 / 4,
    fullPrice: 259,
  },
  {
    planKey: "PLUS_YEARLY",
    label: "Lilac PLUS รายปี",
    priceLabel: "฿699/ปี",
    monthlyEquivalentRevenue: 699 / 12,
    fullPrice: 699,
  },
];

const yearlyTrendFactors = [
  { label: "เม.ย.", revenueFactor: 0.74 },
  { label: "พ.ค.", revenueFactor: 0.79 },
  { label: "มิ.ย.", revenueFactor: 0.83 },
  { label: "ก.ค.", revenueFactor: 0.87 },
  { label: "ส.ค.", revenueFactor: 0.9 },
  { label: "ก.ย.", revenueFactor: 0.93 },
  { label: "ต.ค.", revenueFactor: 0.95 },
  { label: "พ.ย.", revenueFactor: 0.98 },
  { label: "ธ.ค.", revenueFactor: 1.01 },
  { label: "ม.ค.", revenueFactor: 1.03 },
  { label: "ก.พ.", revenueFactor: 1.01 },
  { label: "มี.ค.", revenueFactor: 1.06 },
];

const financeChartConfig = {
  revenue: {
    label: "รายได้",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

const sectionCardClass = "card-gray-gradient rounded-xl border border-border p-5 shadow-sm lg:p-6";

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

function buildFinanceSeries(range: TimeRange, baseMonthlyRevenue: number): FinanceSeriesPoint[] {
  if (range === "today") {
    const revenueWeights = Array.from({ length: 24 }, (_, hour) => {
      const businessPeak = hour >= 10 && hour <= 21 ? 0.42 : 0;
      const morningLift = hour >= 7 && hour <= 9 ? 0.18 : 0;
      const overnightDip = hour <= 4 ? -0.18 : 0;
      return Math.max(0.2, 0.55 + businessPeak + morningLift + overnightDip + Math.sin((hour / 24) * Math.PI * 2 - 1.2) * 0.14);
    });

    const revenueSeries = distributeTotal(baseMonthlyRevenue / 30, revenueWeights);

    return Array.from({ length: 24 }, (_, hour) => ({
      label: `${String(hour).padStart(2, "0")}:00`,
      revenue: revenueSeries[hour],
    }));
  }

  if (range === "month") {
    const revenueWeights = Array.from({ length: 30 }, (_, index) => (
      1
      + (Math.sin((index + 1) * 0.45) * 0.16)
      + ((index % 7) >= 5 ? 0.1 : -0.03)
      + (index % 6 === 0 ? 0.06 : 0)
    ));

    const revenueSeries = distributeTotal(baseMonthlyRevenue, revenueWeights);

    return Array.from({ length: 30 }, (_, index) => ({
      label: String(index + 1),
      revenue: revenueSeries[index],
    }));
  }

  const trendWindow = range === "6months" ? yearlyTrendFactors.slice(-6) : yearlyTrendFactors;

  return trendWindow.map((item) => ({
    label: item.label,
    revenue: roundToTwo(baseMonthlyRevenue * item.revenueFactor),
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
             <span className="flex items-center gap-1.5">
               <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: "var(--color-revenue)" }} />
               <span className="text-muted-foreground">{entry.name}</span>
             </span>
            <span className="font-semibold text-foreground">{formatCurrencyTHB(Number(entry.value ?? 0))}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const planAccentColors = [
  "bg-primary/40",
  "bg-primary/60",
  "bg-primary/80",
];

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

    const baseMonthlySignups = {
      PLUS_MONTHLY: Math.round(planCounts.PLUS_MONTHLY * 0.22),
      PLUS_TERM: Math.round(planCounts.PLUS_TERM * 0.12),
      PLUS_YEARLY: Math.round(planCounts.PLUS_YEARLY * 0.08),
    };

    const baseMonthlyRevenueByPlan = {
      PLUS_MONTHLY: baseMonthlySignups.PLUS_MONTHLY * packagePlans[0].fullPrice,
      PLUS_TERM: baseMonthlySignups.PLUS_TERM * packagePlans[1].fullPrice,
      PLUS_YEARLY: baseMonthlySignups.PLUS_YEARLY * packagePlans[2].fullPrice,
    };

    const baseMonthlyRevenue =
      baseMonthlyRevenueByPlan.PLUS_MONTHLY
      + baseMonthlyRevenueByPlan.PLUS_TERM
      + baseMonthlyRevenueByPlan.PLUS_YEARLY;

    const series = buildFinanceSeries(period, baseMonthlyRevenue);
    const seriesTotal = roundToTwo(series.reduce((sum, item) => sum + item.revenue, 0));

    const rangeRevenueMultiplier = baseMonthlyRevenue > 0 ? seriesTotal / baseMonthlyRevenue : 0;

    const packageRows = packagePlans.map((plan) => {
      const estimatedRevenue = baseMonthlyRevenueByPlan[plan.planKey as keyof typeof baseMonthlyRevenueByPlan] * rangeRevenueMultiplier;
      const users = Math.max(0, Math.round(estimatedRevenue / plan.fullPrice));
      const exactRevenue = users * plan.fullPrice;

      return {
        ...plan,
        users,
        revenue: exactRevenue,
        usersShare: 0,
        revenueShare: 0,
      };
    });

    const totalRevenue = packageRows.reduce((sum, row) => sum + row.revenue, 0);
    const paidUsers = packageRows.reduce((sum, row) => sum + row.users, 0);
    const newMembers = paidUsers;

    packageRows.forEach((row) => {
      row.usersShare = paidUsers > 0 ? (row.users / paidUsers) * 100 : 0;
      row.revenueShare = totalRevenue > 0 ? (row.revenue / totalRevenue) * 100 : 0;
    });

    const leadingPlan = packageRows.reduce((best, row) => (row.users > best.users ? row : best), packageRows[0]);

    const plusRetentionRate = weeklyRetentionByPlan.length > 0
      ? (weeklyRetentionByPlan[weeklyRetentionByPlan.length - 1].plus / Math.max(weeklyRetentionByPlan[0].plus, 1)) * 100
      : 0;
    // คำนวณเปอร์เซ็นต์แบบสะสมสมจริง (Cumulative Metrics)
    const trialToPaidRate = period === "today" ? 12.8 : period === "month" ? 12.4 : period === "6months" ? 12.1 : 11.8;
    const churnRate = period === "today" ? 0.12 : period === "month" ? 2.1 : period === "6months" ? 11.4 : 22.3;
    const successfulReferrals = Math.max(3, Math.round(118 * rangeRevenueMultiplier));
    const arpu = totalRevenue / Math.max(paidUsers, 1);

    type DeltaEntry = { value: string; trend: "up" | "down"; color: "positive" | "negative" };
    type PeriodDeltas = { revenue: DeltaEntry; newMembers: DeltaEntry; conversion: DeltaEntry; churn: DeltaEntry; referrals: DeltaEntry };
    const mockDeltasByPeriod: Record<TimeRange, PeriodDeltas> = {
      today: {
        revenue: { value: "4.2%", trend: "up", color: "positive" },
        newMembers: { value: "1.5%", trend: "up", color: "positive" },
        conversion: { value: "0.2%", trend: "up", color: "positive" },
        churn: { value: "0.01%", trend: "down", color: "positive" },
        referrals: { value: "2", trend: "up", color: "positive" },
      },
      month: {
        revenue: { value: "12.5%", trend: "up", color: "positive" },
        newMembers: { value: "8.2%", trend: "up", color: "positive" },
        conversion: { value: "0.4%", trend: "up", color: "positive" },
        churn: { value: "0.2%", trend: "down", color: "positive" },
        referrals: { value: "14", trend: "up", color: "positive" },
      },
      "6months": {
        revenue: { value: "26.4%", trend: "up", color: "positive" },
        newMembers: { value: "18.5%", trend: "up", color: "positive" },
        conversion: { value: "0.3%", trend: "down", color: "negative" },
        churn: { value: "1.1%", trend: "up", color: "negative" },
        referrals: { value: "89", trend: "up", color: "positive" },
      },
      year: {
        revenue: { value: "65.8%", trend: "up", color: "positive" },
        newMembers: { value: "42.1%", trend: "up", color: "positive" },
        conversion: { value: "1.2%", trend: "up", color: "positive" },
        churn: { value: "0.8%", trend: "down", color: "positive" },
        referrals: { value: "215", trend: "up", color: "positive" },
      },
    };

    const mockDeltas = mockDeltasByPeriod[period];

    return {
      meta,
      paidUsers,
      series,
      totalRevenue,
      packageRows,
      leadingPlan,
      plusRetentionRate,
      trialToPaidRate,
      churnRate,
      newMembers,
      successfulReferrals,
      arpu,
      mockDeltas,
    };
  }, [period]);

  return (
    <DashboardPageShell title="การสมัครสมาชิก">
      <AppTabs
        value={period}
        onValueChange={(value) => setPeriod(value as TimeRange)}
        items={[...periodTabs]}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <MetricCard
          label="รายได้รวม"
          value={formatCurrencyTHB(financeModel.totalRevenue)}
          note="ตามช่วงเวลาที่เลือก"
          delta={financeModel.mockDeltas.revenue.value}
          trend={financeModel.mockDeltas.revenue.trend}
          className="min-h-[132px] p-5"
        />
        <MetricCard
          label="สมาชิกใหม่"
          value={formatNumber(financeModel.newMembers)}
          note="ตามช่วงเวลาที่เลือก"
          delta={financeModel.mockDeltas.newMembers.value}
          trend={financeModel.mockDeltas.newMembers.trend}
          className="min-h-[132px] p-5"
        />
        <MetricCard
          label="FREE → PLUS"
          value={formatPercent(financeModel.trialToPaidRate)}
          note="อัตราการเปลี่ยนเป็นสมาชิก"
          delta={financeModel.mockDeltas.conversion.value}
          trend={financeModel.mockDeltas.conversion.trend}
          className="min-h-[132px] p-5"
        />
        <MetricCard
          label="อัตราการยกเลิก"
          value={formatPercent(financeModel.churnRate)}
          note="ตามช่วงเวลาที่เลือก"
          delta={financeModel.mockDeltas.churn.value}
          trend={financeModel.mockDeltas.churn.trend}
          className="min-h-[132px] p-5"
        />
        <MetricCard
          label="ชวนเพื่อนสมัครสำเร็จ"
          value={formatNumber(financeModel.successfulReferrals)}
          note="ตามช่วงเวลาที่เลือก"
          delta={financeModel.mockDeltas.referrals.value}
          trend={financeModel.mockDeltas.referrals.trend}
          className="min-h-[132px] p-5"
        />
      </div>

      <article className={sectionCardClass}>
        <div className="mb-4 flex items-start justify-between gap-3">
           <div>
             <h3 className="text-base font-semibold text-foreground">รายได้</h3>
           </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-background/40 p-3">
          <ChartContainer config={financeChartConfig} className="h-[250px] w-full mt-4">
            <AreaChart data={financeModel.series} margin={{ left: 0, right: 12, top: 10, bottom: 12 }}>
              <defs>
                <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.4} strokeDasharray="3 3" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} minTickGap={20} interval={financeModel.meta.tickInterval} tick={{ fill: "hsl(var(--muted-foreground))" }} tickMargin={12} />
              <YAxis tickLine={false} axisLine={false} width={70} tickFormatter={(value) => formatCompactCurrency(Number(value))} tick={{ fill: "hsl(var(--muted-foreground))" }} tickMargin={12} />
              <ChartTooltip content={<FinanceChartTooltip />} cursor={{ stroke: "hsl(var(--border))", strokeWidth: 1, strokeDasharray: "3 3" }} />
              <Area type="monotone" dataKey="revenue" name="รายได้" stroke="var(--color-revenue)" strokeWidth={3} fill="url(#fillRevenue)" dot={false} activeDot={{ r: 6, fill: "var(--color-revenue)", stroke: "hsl(var(--background))", strokeWidth: 2 }} />
            </AreaChart>
          </ChartContainer>
        </div>
      </article>

      <DataTableShell
        caption="ตารางรายได้แยกตามแพ็กเกจ"
        minWidthClass="min-w-[650px]"
        className="h-full min-w-0"
        toolbar={(
          <div className="mb-4 flex items-center justify-between gap-3 px-1">
            <h3 className="text-base font-semibold text-foreground">รายได้แยกตามแพ็กเกจ</h3>
            <Badge variant="secondary" className="rounded-full px-3 py-1">แพ็กเกจ</Badge>
          </div>
        )}
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>แพ็กเกจ</TableHead>
              <TableHead>ราคา</TableHead>
              <TableHead>จำนวน</TableHead>
              <TableHead>รายได้</TableHead>
              <TableHead>สัดส่วนผู้ใช้</TableHead>
              <TableHead>สัดส่วนรายได้</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {financeModel.packageRows.map((row, i) => (
              <TableRow key={row.planKey}>
                <TableCell>
                  <div className="flex items-center gap-2">
                     <span className={cn("inline-block h-2 w-2 rounded-full", planAccentColors[i % planAccentColors.length])} />
                     <div>
                       <p className="font-medium text-foreground">{row.label}</p>
                      {row.planKey === financeModel.leadingPlan.planKey && (
                        <Badge className="mt-1 border-none bg-primary text-primary-foreground hover:bg-primary/90">
                          แพ็กเกจยอดนิยม
                        </Badge>
                      )}
                     </div>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{row.priceLabel}</TableCell>
                <TableCell className="font-semibold">{formatNumber(row.users)}</TableCell>
                <TableCell className="font-semibold">{formatCurrencyTHB(row.revenue)}</TableCell>
                <TableCell>
                  <div className="space-y-1.5 min-w-[100px]">
                    <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                      <span>{formatPercent(row.usersShare)}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted">
                      <div className={cn("h-1.5 rounded-full", planAccentColors[i % planAccentColors.length])} style={{ width: `${row.usersShare}%` }} />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1.5 min-w-[100px]">
                    <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                      <span>{formatPercent(row.revenueShare)}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted">
                      <div className={cn("h-1.5 rounded-full", planAccentColors[i % planAccentColors.length])} style={{ width: `${row.revenueShare}%` }} />
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DataTableShell>
    </DashboardPageShell>
  );
}
