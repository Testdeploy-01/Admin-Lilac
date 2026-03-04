import { useMemo, useState } from "react";
import { CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { aiAlert, aiModelUsage, aiPeriodStats, aiUsageRows, PLAN_LABELS, type AiPeriod } from "../../mocks/dashboard-features.mock";
import { formatCurrencyTHB, formatNumber } from "../../lib/formatters";

const periodOptions: Array<{ key: AiPeriod; label: string }> = [
  { key: "7d", label: "7 วัน" },
  { key: "month", label: "1 เดือน" },
  { key: "4months", label: "4 เดือน" },
  { key: "year", label: "1 ปี" },
];


export function AiManagerPage() {
  const [period, setPeriod] = useState<AiPeriod>("month");
  const categoryColors = ["hsl(var(--primary))", "#14b8a6", "#f59e0b"];

  const periodData = aiPeriodStats[period];
  const maxModelTokens = Math.max(...aiModelUsage.map((entry) => entry.tokens));

  const marginRows = useMemo(() => {
    let multiplier = 1;
    if (period === "7d") multiplier = 7 / 30;
    else if (period === "month") multiplier = 1;
    else if (period === "4months") multiplier = 4;
    else if (period === "year") multiplier = 12;

    return aiUsageRows.map((row) => {
      const scaledVoice = Math.round(row.inputVoiceTokens * multiplier);
      const scaledTextIn = Math.round(row.inputTextTokens * multiplier);
      const scaledTextOut = Math.round(row.outputTextTokens * multiplier);

      const scaledRevenue = Math.round(row.revenueTHB * multiplier);
      const scaledCost = Math.round(row.costTHB * multiplier);

      const margin = scaledRevenue - scaledCost;

      return {
        ...row,
        inputVoiceTokens: scaledVoice,
        inputTextTokens: scaledTextIn,
        outputTextTokens: scaledTextOut,
        revenueTHB: scaledRevenue,
        costTHB: scaledCost,
        margin
      };
    });
  }, [period]);

  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold tracking-tight">จัดการ AI</h2>
        <p className="mt-1 text-sm text-muted-foreground">ติดตามต้นทุน Token, ประสิทธิภาพ Model และความเสี่ยงด้าน Margin</p>
      </header>

      {aiAlert.enabled ? (
        <div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
          <p className="font-semibold">⚠️ แจ้งเตือนสำคัญ</p>
          <p className="mt-1">{aiAlert.message}</p>
        </div>
      ) : null}

      <div className="inline-flex rounded-lg border border-border bg-card p-1">
        {periodOptions.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setPeriod(item.key)}
            aria-pressed={period === item.key}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${period === item.key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"
              }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {periodData.kpis.map((kpi) => {
          return (
            <article key={kpi.label} className="kpi-card">
              <div className="kpi-card-inner flex flex-col justify-center">
                <p className="text-sm font-medium text-muted-foreground">{kpi.label}</p>
                <p className="mt-2 text-3xl font-bold tracking-tight">{kpi.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{kpi.note}</p>
              </div>
            </article>
          );
        })}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <article className="rounded-xl bg-card p-6 shadow-card">
          <div className="section-divider">
            <h3 className="text-base font-semibold">Token และต้นทุน</h3>
            <p className="text-sm text-muted-foreground">เปรียบเทียบปริมาณ Token และค่าใช้จ่ายในช่วงเวลาที่เลือก</p>
          </div>
          <div className="mt-4 h-64 w-full">
            <ResponsiveContainer>
              <LineChart data={periodData.tokenCostBars} margin={{ left: 8, right: 8, top: 6 }}>
                <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.5} />
                <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} />
                <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="tokens"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2.8}
                  dot={false}
                  activeDot={{ r: 5 }}
                  name="Tokens"
                />
                <Line
                  yAxisId="right"
                  type="linear"
                  dataKey="costTHB"
                  stroke="#14b8a6"
                  strokeWidth={2.4}
                  strokeDasharray="8 4"
                  dot={{ r: 2 }}
                  activeDot={{ r: 5 }}
                  name="Cost (THB)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="rounded-xl bg-card p-6 shadow-card">
          <h3 className="text-base font-semibold">สัดส่วนการใช้งานตามหมวด</h3>
          <div className="mt-4 h-52 w-full">
            <ResponsiveContainer>
              <PieChart>
                <Tooltip />
                <Pie
                  data={periodData.categoryShare}
                  dataKey="value"
                  nameKey="category"
                  innerRadius={50}
                  outerRadius={86}
                  paddingAngle={3}
                  stroke="hsl(var(--background))"
                  strokeWidth={2}
                >
                  {periodData.categoryShare.map((item, index) => (
                    <Cell key={item.category} fill={categoryColors[index % categoryColors.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {periodData.categoryShare.map((item) => (
              <div key={item.category} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{item.category}</span>
                <span className="font-semibold">{item.value}%</span>
              </div>
            ))}
          </div>
        </article>
      </div>

      <article className="rounded-xl bg-card p-6 shadow-card">
        <h3 className="text-base font-semibold">การใช้ Token แยกตาม Model</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {aiModelUsage.map((model) => {
            const width = (model.tokens / maxModelTokens) * 100;
            return (
              <div key={model.model} className="rounded-xl border border-border bg-background p-5 text-card-foreground">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-foreground">{model.model}</h4>
                    <p className="mt-0.5 text-xs text-muted-foreground">{model.description}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[14px] font-bold text-foreground">{formatCurrencyTHB(model.costTHB)}</span>
                    <span className="text-[10px] font-medium text-muted-foreground whitespace-nowrap">{model.pricing}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Token Usage</span>
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

      <article className="rounded-xl bg-card p-6 shadow-card">
        <h3 className="text-base font-semibold">สถิติรายบุคคล</h3>
        <p className="text-sm text-muted-foreground">ติดตามการใช้ Token และส่วนต่างกำไรต่อผู้ใช้</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm">
            <caption className="sr-only">ตารางต้นทุน รายได้ และกำไรของผู้ใช้งาน AI รายบุคคล</caption>
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th scope="col" className="pb-2">ผู้ใช้</th>
                <th scope="col" className="pb-2">แพลน</th>
                <th scope="col" className="pb-2">Voice Input</th>
                <th scope="col" className="pb-2">Text Input</th>
                <th scope="col" className="pb-2">Text Output</th>
                <th scope="col" className="pb-2">รายได้</th>
                <th scope="col" className="pb-2">ต้นทุน</th>
                <th scope="col" className="pb-2">Margin</th>
              </tr>
            </thead>
            <tbody>
              {marginRows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-sm text-muted-foreground">
                    ไม่พบข้อมูลผู้ใช้งานในช่วงเวลาที่เลือก
                  </td>
                </tr>
              ) : (
                marginRows.map((row) => (
                  <tr key={row.userId} className="border-b border-border/70 last:border-none">
                    <td className="py-3 font-medium">{row.userId}</td>
                    <td className="py-3">{PLAN_LABELS[row.plan]}</td>
                    <td className="py-3">{formatNumber(row.inputVoiceTokens)}</td>
                    <td className="py-3">{formatNumber(row.inputTextTokens)}</td>
                    <td className="py-3">{formatNumber(row.outputTextTokens)}</td>
                    <td className="py-3">{formatCurrencyTHB(row.revenueTHB)}</td>
                    <td className="py-3">{formatCurrencyTHB(row.costTHB)}</td>
                    <td className="py-3">
                      <span className={row.margin >= 0 ? "text-emerald-600 dark:text-emerald-300" : "text-rose-600 dark:text-rose-300"}>
                        {formatCurrencyTHB(row.margin)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}

