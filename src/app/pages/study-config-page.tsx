import { useMemo, useState } from "react";
import { CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { studyKpis, studyUpcomingShare, studyWorkloadTrend, studyTrendingEvents } from "../../mocks/dashboard-features.mock";

export function StudyConfigPage() {
  const [university, setUniversity] = useState("ทั้งหมด");
  const [year, setYear] = useState("ทั้งหมด");
  const upcomingColors = ["hsl(var(--primary))", "#14b8a6"];

  const universities = useMemo(() => ["ทั้งหมด", ...new Set(studyTrendingEvents.map((item) => item.university))], []);
  const years = useMemo(() => ["ทั้งหมด", ...new Set(studyTrendingEvents.map((item) => item.year))], []);

  const filteredEvents = useMemo(() => {
    return studyTrendingEvents.filter((item) => {
      const passUniversity = university === "ทั้งหมด" || item.university === university;
      const passYear = year === "ทั้งหมด" || item.year === year;
      return passUniversity && passYear;
    });
  }, [university, year]);

  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold tracking-tight">โมดูลการเรียน</h2>
        <p className="mt-1 text-sm text-muted-foreground">สรุปพฤติกรรมการเรียนและติดตาม Event ที่กำลังมาแรง</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {studyKpis.map((item) => {
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

      <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <article className="rounded-xl bg-card p-6 shadow-card">
          <h3 className="text-base font-semibold">ยอดรวมงาน/สอบรายสัปดาห์</h3>
          <div className="mt-4 h-64 w-full">
            <ResponsiveContainer>
              <LineChart data={studyWorkloadTrend} margin={{ left: 8, right: 8, top: 6 }}>
                <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.5} />
                <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Line type="natural" dataKey="events" stroke="hsl(var(--primary))" strokeWidth={2.8} dot={false} activeDot={{ r: 5 }} name="งานทั้งหมด" />
                <Line type="monotone" dataKey="upcoming" stroke="#14b8a6" strokeWidth={2.4} strokeDasharray="8 4" dot={{ r: 2 }} activeDot={{ r: 5 }} name="Upcoming" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="rounded-xl bg-card p-6 shadow-card">
          <h3 className="text-base font-semibold">สัดส่วน Upcoming Events</h3>
          <div className="mt-4 h-56 w-full">
            <ResponsiveContainer>
              <PieChart>
                <Tooltip />
                <Pie
                  data={studyUpcomingShare}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={86}
                  paddingAngle={3}
                  stroke="hsl(var(--background))"
                  strokeWidth={2}
                >
                  {studyUpcomingShare.map((item, index) => (
                    <Cell key={item.name} fill={upcomingColors[index % upcomingColors.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {studyUpcomingShare.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{item.name}</span>
                <span className="font-semibold">{item.value}%</span>
              </div>
            ))}
          </div>
        </article>
      </div>

      <article className="rounded-xl bg-card p-6 shadow-card">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="text-base font-semibold">Trending Events Feed</h3>
            <p className="text-sm text-muted-foreground">ติดตามงานด่วนและการสอบที่ผู้ใช้ถาม AI สูงผิดปกติ</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <select
              value={university}
              onChange={(event) => setUniversity(event.target.value)}
              aria-label="กรองมหาวิทยาลัย"
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {universities.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <select
              value={year}
              onChange={(event) => setYear(event.target.value)}
              aria-label="กรองชั้นปี"
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {years.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {filteredEvents.length === 0 ? (
            <p className="col-span-full rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">ไม่พบข้อมูลตามตัวกรองที่เลือก</p>
          ) : (
            filteredEvents.map((event) => (
              <div key={event.id} className="group rounded-xl border border-border bg-background p-5 transition-colors hover:border-primary/30">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">{event.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {event.university} • {event.year}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold text-primary">
                    {event.dueIn}
                  </span>
                </div>
                <div className="mt-4 border-t border-border/50 pt-3">
                  <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">💡 {event.insight}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </article>
    </section>
  );
}

