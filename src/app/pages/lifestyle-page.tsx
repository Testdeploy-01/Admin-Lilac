import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { lifestyleAlarmSlots, lifestyleKpis, lifestyleMoodTrend, lifestyleRecommendations } from "../../mocks/dashboard-features.mock";

export function LifestylePage() {
  const [tab, setTab] = useState<"food" | "series">("food");

  const filteredRecommendations = useMemo(
    () => lifestyleRecommendations.filter((item) => item.type === tab),
    [tab],
  );

  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold tracking-tight">โมดูลไลฟ์สไตล์</h2>
        <p className="mt-1 text-sm text-muted-foreground">ดูภาพรวมสุขภาพใจ พฤติกรรม และผลลัพธ์จาก AI Recommendation</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {lifestyleKpis.map((item) => {
          return (
            <article key={item.label} className="kpi-card">
              <div className="kpi-card-inner flex flex-col justify-center">
                <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                <p className="mt-2 text-3xl font-bold tracking-tight">{item.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{item.note}</p>
              </div>
            </article>
          );
        })}
      </div>

      <article className="rounded-xl bg-card p-6 shadow-card">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="section-divider">
            <h3 className="text-base font-semibold">AI Recommendations</h3>
            <p className="text-sm text-muted-foreground">สลับดูเมนูอาหารหรือซีรีส์ พร้อมดู CTR</p>
          </div>
          <div className="inline-flex rounded-lg border border-border bg-background p-1">
            <button
              type="button"
              onClick={() => setTab("food")}
              aria-pressed={tab === "food"}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${tab === "food" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"
                }`}
            >
              เมนูอาหาร
            </button>
            <button
              type="button"
              onClick={() => setTab("series")}
              aria-pressed={tab === "series"}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${tab === "series" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"
                }`}
            >
              ภาพยนตร์/ซีรีส์
            </button>
          </div>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          {filteredRecommendations.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-border bg-background p-6"
            >
              <h4 className="text-base font-semibold">{item.title}</h4>
              <p className="mt-2 text-sm text-muted-foreground">อารมณ์: <span className="font-medium text-foreground">{item.moodTag}</span></p>
              <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                <p className="text-sm text-muted-foreground">Click Rate</p>
                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{item.ctr}%</p>
              </div>
            </div>
          ))}
        </div>
      </article>

      <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <article className="rounded-xl bg-card p-6 shadow-card">
          <h3 className="text-base font-semibold">แนวโน้มอารมณ์ภาพรวม</h3>
          <p className="text-sm text-muted-foreground">Positive / Neutral / Stressed ต่อสัปดาห์</p>
          <div className="mt-4 h-64 w-full">
            <ResponsiveContainer>
              <LineChart data={lifestyleMoodTrend} margin={{ left: 8, right: 8, top: 6 }}>
                <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.5} />
                <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="positive" stroke="#16a34a" strokeWidth={2.8} dot={false} activeDot={{ r: 4 }} name="Positive" />
                <Line type="natural" dataKey="neutral" stroke="#0284c7" strokeWidth={2.4} strokeDasharray="7 4" dot={{ r: 2 }} name="Neutral" />
                <Line type="linear" dataKey="stressed" stroke="#f59e0b" strokeWidth={2.4} strokeDasharray="3 3" dot={{ r: 2 }} name="Stressed" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="rounded-xl bg-card p-6 shadow-card">
          <h3 className="text-base font-semibold">เวลาปลุกยอดฮิต</h3>
          <p className="text-sm text-muted-foreground">ช่วงเวลาตั้งปลุกอัจฉริยะที่ใช้งานบ่อยที่สุด</p>
          <div className="mt-4 h-64 w-full">
            <ResponsiveContainer>
              <BarChart data={lifestyleAlarmSlots} margin={{ left: 8, right: 8, top: 6 }}>
                <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.5} />
                <XAxis dataKey="slot" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="users" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} name="Users" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>
      </div>
    </section>
  );
}

