import { useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { DashboardPageShell } from "@/components/dashboard/ui/dashboard-page-shell";
import { MetricCard } from "@/components/dashboard/ui/metric-card";
import { AppTabs } from "@/components/dashboard/ui/app-tabs";
import { DataTableShell } from "@/components/dashboard/ui/data-table-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  churnAnalysis,
  financeRevenueStats,
  mrrTrend,
  mrrWaterfall,
  projectedMrr,
  revenueByPlan,
  transactionHistory,
  trialConversionTrend,
} from "../../mocks/dashboard-features.mock";
import { formatCurrencyTHB } from "../../lib/formatters";
import { exportCSV } from "../../lib/exporters";

type TabKey = "overview" | "transactions";
const planColors = ["hsl(var(--primary))", "#14b8a6", "#f59e0b"];

export function FinancePage() {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredTransactions = transactionHistory.filter((transaction) => statusFilter === "all" || transaction.status === statusFilter);

  return (
    <DashboardPageShell title="การเงิน" description="ภาพรวมรายได้ รายการธุรกรรม และสัญญาณ churn เพื่อการตัดสินใจเชิงธุรกิจ">
      <AppTabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as TabKey)}
        items={[
          { value: "overview", label: "ภาพรวมรายได้" },
          { value: "transactions", label: "รายการธุรกรรม" },
        ]}
      />

      {activeTab === "overview" ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {financeRevenueStats.map((item) => (
              <MetricCard
                key={item.label}
                label={item.label}
                value={item.value}
                delta={item.delta}
                trend={item.trend === "up" ? "up" : "down"}
              />
            ))}
          </div>

          <article className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div>
              <h3 className="text-base font-semibold">แนวโน้มรายได้รายเดือน (12 เดือน)</h3>
              <p className="text-sm text-muted-foreground">แยกรายได้ใหม่, การอัปเกรด, การยกเลิก ต่อเดือน</p>
            </div>
            <div className="mt-4 h-72 w-full">
              <ResponsiveContainer>
                <BarChart data={mrrTrend} margin={{ left: 8, right: 8, top: 6 }}>
                  <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.5} />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Bar dataKey="newMRR" stackId="a" fill="hsl(var(--primary))" name="รายได้ใหม่" />
                  <Bar dataKey="expansionMRR" stackId="a" fill="#14b8a6" name="การอัปเกรด" />
                  <Bar dataKey="churnedMRR" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} name="การยกเลิก" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </article>

          <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
            <article className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div>
                <h3 className="text-base font-semibold">การเปลี่ยนแปลงรายได้รายเดือน</h3>
                <p className="text-sm text-muted-foreground">ดูว่ารายได้เดือนนี้เปลี่ยนแปลงจากอะไรบ้าง</p>
              </div>
              <div className="mt-4 space-y-3">
                {mrrWaterfall.map((item) => (
                  <div key={item.label} className="flex items-center justify-between rounded-lg border border-border bg-background p-3">
                    <p className="text-sm font-semibold">{item.label}</p>
                    <span
                      className={`text-sm font-bold ${
                        item.type === "add"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : item.type === "subtract"
                            ? "text-rose-600 dark:text-rose-400"
                            : "text-foreground"
                      }`}
                    >
                      {item.type === "add" ? "+" : ""}
                      {formatCurrencyTHB(Math.abs(item.value))}
                    </span>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h3 className="text-base font-semibold">รายได้แยกตามแพ็กเกจ</h3>
              <div className="mt-4 h-56 w-full">
                <ResponsiveContainer>
                  <PieChart>
                    <Tooltip />
                    <Pie
                      data={revenueByPlan}
                      dataKey="revenue"
                      nameKey="plan"
                      innerRadius={50}
                      outerRadius={86}
                      paddingAngle={3}
                      stroke="hsl(var(--background))"
                      strokeWidth={2}
                    >
                      {revenueByPlan.map((item, index) => (
                        <Cell key={item.plan} fill={planColors[index % planColors.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 space-y-2">
                {revenueByPlan.map((item) => (
                  <div key={item.plan} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{item.plan}</span>
                    <span className="font-semibold">{item.percentage}% ({formatCurrencyTHB(item.revenue)})</span>
                  </div>
                ))}
              </div>
            </article>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <article className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h3 className="text-base font-semibold">วิเคราะห์การยกเลิก</h3>
              <p className="text-sm text-muted-foreground">อัตราการยกเลิก: <span className="font-bold text-rose-500">{churnAnalysis.churnRate}%</span></p>
              <div className="mt-4 space-y-4">
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">ยกเลิกตามระยะเวลาใช้งาน</p>
                  {churnAnalysis.churnByTenure.map((item) => (
                    <div key={item.tenure} className="mb-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{item.tenure}</span>
                        <span className="font-semibold">{item.rate}%</span>
                      </div>
                      <div className="mt-1 h-2 rounded-full bg-muted">
                        <div className="h-2 rounded-full bg-rose-500" style={{ width: `${(item.rate / 10) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">สาเหตุการยกเลิก</p>
                  {churnAnalysis.churnReasons.map((item) => (
                    <div key={item.reason} className="mb-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{item.reason}</span>
                        <span className="font-semibold">{item.ratio}%</span>
                      </div>
                      <div className="mt-1 h-2 rounded-full bg-muted">
                        <div className="h-2 rounded-full bg-amber-500" style={{ width: `${item.ratio}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </article>

            <article className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div>
                <h3 className="text-base font-semibold">การเปลี่ยนจากทดลองเป็นสมาชิก</h3>
                <p className="text-sm text-muted-foreground">อัตราการเปลี่ยนรายสัปดาห์</p>
              </div>
              <div className="mt-4 h-64 w-full">
                <ResponsiveContainer>
                  <BarChart data={trialConversionTrend} margin={{ left: 8, right: 8, top: 6 }}>
                    <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.5} />
                    <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Bar dataKey="trialStarted" fill="#94a3b8" radius={[8, 8, 0, 0]} name="เริ่มทดลอง" />
                    <Bar dataKey="paid" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} name="เป็นสมาชิก" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 rounded-lg border border-border bg-background p-4">
                <p className="mb-3 text-sm font-semibold text-muted-foreground">รายได้รายเดือน (คาดการณ์เดือนหน้า)</p>
                <div className="grid grid-cols-3 gap-3 text-center text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">แย่สุด</p>
                    <p className="mt-1 font-bold text-rose-500">{formatCurrencyTHB(projectedMrr.pessimistic)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">ปกติ</p>
                    <p className="mt-1 font-bold">{formatCurrencyTHB(projectedMrr.base)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">ดีสุด</p>
                    <p className="mt-1 font-bold text-emerald-600 dark:text-emerald-400">{formatCurrencyTHB(projectedMrr.optimistic)}</p>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3 text-center text-xs text-muted-foreground">
                  <p>ต่ออายุ ≈ {projectedMrr.renewals} คน</p>
                  <p>หมดอายุ ≈ {projectedMrr.expiring} คน</p>
                </div>
              </div>
            </article>
          </div>
        </>
      ) : (
        <DataTableShell
          caption="ตารางประวัติธุรกรรมและการชำระเงิน"
          minWidthClass="min-w-[900px]"
          toolbar={
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-base font-semibold">รายการธุรกรรม</h3>
                <p className="text-sm text-muted-foreground">ประวัติการชำระเงิน รีฟันด์ และรายการล้มเหลว</p>
              </div>
              <div className="flex items-center gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="ทุกสถานะ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ทุกสถานะ</SelectItem>
                    <SelectItem value="success">สำเร็จ</SelectItem>
                    <SelectItem value="failed">ล้มเหลว</SelectItem>
                    <SelectItem value="refunded">คืนเงิน</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  size="sm"
                  onClick={() =>
                    exportCSV(
                      "transactions",
                      filteredTransactions.map((transaction) => ({
                        id: transaction.id,
                        date: transaction.date,
                        user: transaction.user,
                        userId: transaction.userId,
                        amount: transaction.amount,
                        plan: transaction.plan,
                        paymentMethod: transaction.paymentMethod,
                        status: transaction.status,
                      })),
                    )
                  }
                >
                  Export CSV
                </Button>
              </div>
            </div>
          }
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>วันที่</TableHead>
                <TableHead>ผู้ใช้</TableHead>
                <TableHead>จำนวนเงิน</TableHead>
                <TableHead>แพ็กเกจ</TableHead>
                <TableHead>วิธีชำระ</TableHead>
                <TableHead>สถานะ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-8 text-center text-sm text-muted-foreground">
                    ไม่พบรายการตามเงื่อนไข
                  </TableCell>
                </TableRow>
              ) : (
                filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">{transaction.id}</TableCell>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>
                      <p className="font-medium">{transaction.user}</p>
                      <p className="text-xs text-muted-foreground">{transaction.userId}</p>
                    </TableCell>
                    <TableCell className="font-semibold">{formatCurrencyTHB(transaction.amount)}</TableCell>
                    <TableCell>{transaction.plan}</TableCell>
                    <TableCell>{transaction.paymentMethod}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          transaction.status === "success"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300"
                            : transaction.status === "failed"
                              ? "bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300"
                              : "bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300"
                        }
                      >
                        {transaction.status === "success" ? "สำเร็จ" : transaction.status === "failed" ? "ล้มเหลว" : "คืนเงิน"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </DataTableShell>
      )}
    </DashboardPageShell>
  );
}

