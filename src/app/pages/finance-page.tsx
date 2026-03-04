import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Bot, PiggyBank, ShieldAlert, TrendingUp } from "lucide-react";
import { useMemo } from "react";
import { financeCategoryUsage, financeDailyEntries, financeInputMethodShare, financeKpis } from "../../mocks/dashboard-features.mock";
import { formatCurrencyTHB, formatNumber } from "../../lib/formatters";

const kpiIcons = [TrendingUp, ShieldAlert, Bot, PiggyBank];

export function FinancePage() {
  const inputMethodColors = useMemo(() => ["hsl(var(--primary))", "#14b8a6", "#f59e0b"], []);

  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold tracking-tight">โมดูลการเงิน</h2>
        <p className="mt-1 text-sm text-muted-foreground">วิเคราะห์พฤติกรรมทางการเงินและวิธีการบันทึกบัญชีของผู้ใช้</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {financeKpis.map((item, index) => {
          const Icon = kpiIcons[index % kpiIcons.length];
          return (
            <article key={item.label} className="kpi-card">
              <div className="kpi-card-inner">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                </div>
                <p className="mt-3 text-3xl font-bold tracking-tight">{item.value}</p>
                <p className="mt-2 text-xs text-muted-foreground">{item.note}</p>
              </div>
            </article>
          );
        })}
      </div>

      <article className="rounded-xl bg-card p-6 shadow-card">
        <h3 className="text-base font-semibold">ตารางสรุปยอดหมวดหมู่</h3>
        <p className="text-sm text-muted-foreground">แสดงรายรับ/รายจ่าย และสัดส่วนการใช้งานแต่ละหมวด</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[860px] text-sm">
            <caption className="sr-only">ตารางวิเคราะห์การเงินแยกตามหมวดหมู่และสัดส่วนการใช้งาน</caption>
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th scope="col" className="pb-2">หมวดหมู่</th>
                <th scope="col" className="pb-2">รายรับรวม</th>
                <th scope="col" className="pb-2">รายจ่ายรวม</th>
                <th scope="col" className="pb-2">สัดส่วนในระบบ</th>
                <th scope="col" className="pb-2">Progress</th>
              </tr>
            </thead>
            <tbody>
              {financeCategoryUsage.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-sm text-muted-foreground">
                    ยังไม่มีข้อมูลหมวดการเงินสำหรับช่วงเวลานี้
                  </td>
                </tr>
              ) : (
                financeCategoryUsage.map((item) => (
                  <tr key={item.category} className="border-b border-border/70 last:border-none">
                    <td className="py-3 font-medium">{item.category}</td>
                    <td className="py-3">{formatCurrencyTHB(item.income)}</td>
                    <td className="py-3">{formatCurrencyTHB(item.expense)}</td>
                    <td className="py-3">{item.ratio}%</td>
                    <td className="py-3">
                      <div className="h-2 w-48 rounded-full bg-muted">
                        <div className="h-2 rounded-full bg-primary" style={{ width: `${item.ratio}%` }} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </article>

      <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <article className="rounded-xl bg-card p-6 shadow-card">
          <h3 className="text-base font-semibold">ความถี่การบันทึกบัญชีต่อวัน</h3>
          <p className="text-sm text-muted-foreground">รวมจำนวนรายการบันทึกรายวัน</p>
          <div className="mt-4 h-64 w-full">
            <ResponsiveContainer>
              <BarChart data={financeDailyEntries} margin={{ left: 8, right: 8, top: 6 }}>
                <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.5} />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="total" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} name="Entries" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            รวมทั้งสัปดาห์: {formatNumber(financeDailyEntries.reduce((sum, item) => sum + item.total, 0))} รายการ
          </p>
        </article>

        <article className="rounded-xl bg-card p-6 shadow-card">
          <h3 className="text-base font-semibold">วิธีลงบัญชี (Manual vs AI)</h3>
          <div className="mt-4 h-56 w-full">
            <ResponsiveContainer>
              <PieChart>
                <Tooltip />
                <Pie
                  data={financeInputMethodShare}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={86}
                  paddingAngle={3}
                  stroke="hsl(var(--background))"
                  strokeWidth={2}
                >
                  {financeInputMethodShare.map((item, index) => (
                    <Cell key={item.name} fill={inputMethodColors[index % inputMethodColors.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {financeInputMethodShare.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{item.name}</span>
                <span className="font-semibold">{item.value}%</span>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}

