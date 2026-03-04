import { useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { DashboardPageShell } from "@/components/dashboard/ui/dashboard-page-shell";
import { MetricCard } from "@/components/dashboard/ui/metric-card";
import { AppTabs } from "@/components/dashboard/ui/app-tabs";
import { DataTableShell } from "@/components/dashboard/ui/data-table-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NotificationList, type NotificationListItem } from "@/components/ui/notification-list";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  abTests,
  audienceTargets,
  broadcastLogs,
  noticeCategories,
  notificationCategoryPerformance,
  notificationDeliveryTrend,
  notificationEffectivenessKpis,
  notificationTypes,
  scheduleRecurrence,
  type ABTest,
  type BroadcastLogRow,
} from "../../mocks/dashboard-features.mock";

type TabKey = "compose" | "history" | "abtest";

export function NotificationsPage() {
  const [tab, setTab] = useState<TabKey>("compose");
  const [logs, setLogs] = useState<BroadcastLogRow[]>(broadcastLogs);
  const [tests, setTests] = useState<ABTest[]>(abTests);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState(noticeCategories[0]);
  const [type, setType] = useState(notificationTypes[0]);
  const [audience, setAudience] = useState(audienceTargets[0]);
  const [scheduleMode, setScheduleMode] = useState<"now" | "scheduled">("now");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [recurrence, setRecurrence] = useState(scheduleRecurrence[0]);
  const [preview, setPreview] = useState(false);

  const drafts = logs.filter((log) => log.status === "Draft");
  const sentLogs = logs.filter((log) => log.status !== "Draft");

  const handleSend = () => {
    if (!title.trim() || !body.trim()) return;
    const newLog: BroadcastLogRow = {
      id: `NTF-${String(logs.length + 1).padStart(3, "0")}`,
      title,
      category,
      type,
      audience,
      sentAt: scheduleMode === "now" ? new Date().toLocaleString("th-TH") : `${scheduleDate} ${scheduleTime}`,
      status: scheduleMode === "now" ? "Sent" : "Scheduled",
      metrics: scheduleMode === "now" ? { sent: 0, delivered: 0, opened: 0, clicked: 0 } : undefined,
    };
    setLogs((prev) => [newLog, ...prev]);
    setTitle("");
    setBody("");
    setTab("history");
  };

  const handleSaveDraft = () => {
    if (!title.trim()) return;
    const newLog: BroadcastLogRow = {
      id: `NTF-${String(logs.length + 1).padStart(3, "0")}`,
      title,
      category,
      type,
      audience,
      sentAt: "",
      status: "Draft",
    };
    setLogs((prev) => [newLog, ...prev]);
    setTitle("");
    setBody("");
  };

  const draftItems: NotificationListItem[] = drafts.map((draft) => ({
    id: draft.id,
    title: draft.title,
    description: `${draft.type} • ${draft.audience}`,
    action: (
      <Button
        size="sm"
        variant="secondary"
        onClick={() => {
          setTitle(draft.title);
          setType(draft.type);
          setCategory(draft.category);
          setAudience(draft.audience);
          setLogs((prev) => prev.filter((item) => item.id !== draft.id));
        }}
      >
        แก้ไข
      </Button>
    ),
  }));

  return (
    <DashboardPageShell title="แจ้งเตือนและประกาศ" description="สร้างข้อความ ส่งประกาศ ดูผลลัพธ์ และทดสอบเปรียบเทียบ">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {notificationEffectivenessKpis.map((item) => (
          <MetricCard key={item.label} label={item.label} value={item.value} note={item.note} />
        ))}
      </div>

      <AppTabs
        value={tab}
        onValueChange={(value) => setTab(value as TabKey)}
        items={[
          { value: "compose", label: "สร้างข้อความ" },
          { value: "history", label: "ประวัติและผลลัพธ์" },
          { value: "abtest", label: "ทดสอบเปรียบเทียบ" },
        ]}
      />

      {tab === "compose" ? (
        <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
          <article className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-base font-semibold">สร้างข้อความ</h3>
            <div className="mt-4 space-y-4">
              <div>
                <p className="mb-1 text-sm text-muted-foreground">หัวข้อ</p>
                <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="ใส่หัวข้อแจ้งเตือน..." />
              </div>
              <div>
                <p className="mb-1 text-sm text-muted-foreground">เนื้อหา</p>
                <Textarea
                  value={body}
                  onChange={(event) => setBody(event.target.value)}
                  rows={4}
                  placeholder="พิมพ์ข้อความ... ({{name}} = ชื่อผู้ใช้, {{plan}} = แพ็กเกจ)"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="mb-1 text-sm text-muted-foreground">หมวดหมู่</p>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {noticeCategories.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <p className="mb-1 text-sm text-muted-foreground">ประเภท</p>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {notificationTypes.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <p className="mb-1 text-sm text-muted-foreground">กลุ่มเป้าหมาย</p>
                <Select value={audience} onValueChange={setAudience}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {audienceTargets.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-lg border border-border bg-background p-4">
                <p className="mb-2 text-sm font-semibold">ตั้งเวลาส่ง</p>
                <RadioGroup value={scheduleMode} onValueChange={(value) => setScheduleMode(value as "now" | "scheduled")} className="mb-3 flex gap-4">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="now" id="schedule-now" />
                    <label htmlFor="schedule-now" className="text-sm">ส่งทันที</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="scheduled" id="schedule-planned" />
                    <label htmlFor="schedule-planned" className="text-sm">ตั้งเวลา</label>
                  </div>
                </RadioGroup>
                {scheduleMode === "scheduled" ? (
                  <div className="grid grid-cols-3 gap-2">
                    <Input type="date" value={scheduleDate} onChange={(event) => setScheduleDate(event.target.value)} />
                    <Input type="time" value={scheduleTime} onChange={(event) => setScheduleTime(event.target.value)} />
                    <Select value={recurrence} onValueChange={setRecurrence}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {scheduleRecurrence.map((item) => (
                          <SelectItem key={item} value={item}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : null}
              </div>

              <Button variant="ghost" className="px-0 text-primary" onClick={() => setPreview(!preview)}>
                {preview ? "ซ่อนตัวอย่าง" : "ดูตัวอย่าง"}
              </Button>

              {preview && title.trim() ? (
                <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
                  <p className="mb-1 text-xs text-muted-foreground">ตัวอย่าง ({type})</p>
                  <p className="font-bold">{title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{body || "(ยังไม่มีเนื้อหา)"}</p>
                  <p className="mt-2 text-xs text-muted-foreground">กลุ่ม: {audience} • หมวด: {category}</p>
                </div>
              ) : null}

              <div className="flex gap-2">
                <Button onClick={handleSend} disabled={!title.trim() || !body.trim()}>
                  {scheduleMode === "now" ? "ส่งประกาศ" : "ตั้งเวลาส่ง"}
                </Button>
                <Button variant="secondary" onClick={handleSaveDraft} disabled={!title.trim()}>
                  บันทึกแบบร่าง
                </Button>
              </div>
            </div>
          </article>

          <article className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-base font-semibold">แบบร่าง ({drafts.length})</h3>
            {draftItems.length === 0 ? <p className="mt-4 text-sm text-muted-foreground">ไม่มีแบบร่าง</p> : <NotificationList className="mt-4" items={draftItems} />}
          </article>
        </div>
      ) : tab === "history" ? (
        <>
          <article className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-base font-semibold">สถิติการส่ง (7 วัน)</h3>
            <div className="mt-4 h-72 w-full">
              <ResponsiveContainer>
                <BarChart data={notificationDeliveryTrend} margin={{ left: 8, right: 8, top: 6 }}>
                  <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.5} />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Bar dataKey="sent" fill="#94a3b8" name="ส่งแล้ว" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="opened" fill="hsl(var(--primary))" name="เปิดอ่าน" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="clicked" fill="#14b8a6" name="คลิก" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="acted" fill="#f59e0b" name="ดำเนินการ" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </article>

          <DataTableShell caption="ประสิทธิภาพการส่งแจ้งเตือนแยกตามหมวดหมู่" minWidthClass="min-w-[600px]">
            <div className="mb-3">
              <h3 className="text-base font-semibold">ผลลัพธ์แยกตามหมวด</h3>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>หมวด</TableHead>
                  <TableHead>ส่งแล้ว</TableHead>
                  <TableHead>อัตราเปิดอ่าน</TableHead>
                  <TableHead>อัตราคลิก</TableHead>
                  <TableHead>อัตราดำเนินการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notificationCategoryPerformance.map((categoryItem) => (
                  <TableRow key={categoryItem.category}>
                    <TableCell className="font-medium">{categoryItem.category}</TableCell>
                    <TableCell>{categoryItem.sent.toLocaleString()}</TableCell>
                    <TableCell>{categoryItem.openRate}%</TableCell>
                    <TableCell>{categoryItem.clickRate}%</TableCell>
                    <TableCell>{categoryItem.actionRate}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </DataTableShell>

          <DataTableShell caption="ประวัติการส่งแจ้งเตือน" minWidthClass="min-w-[900px]">
            <div className="mb-3">
              <h3 className="text-base font-semibold">ประวัติการส่ง</h3>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>หัวข้อ</TableHead>
                  <TableHead>ประเภท</TableHead>
                  <TableHead>กลุ่ม</TableHead>
                  <TableHead>วันส่ง</TableHead>
                  <TableHead>สถานะ</TableHead>
                  <TableHead>ผลลัพธ์</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sentLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">{log.id}</TableCell>
                    <TableCell>{log.title}</TableCell>
                    <TableCell>{log.type}</TableCell>
                    <TableCell>{log.audience}</TableCell>
                    <TableCell>{log.sentAt}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          log.status === "Sent"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300"
                            : log.status === "Scheduled"
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300"
                              : "bg-muted text-muted-foreground"
                        }
                      >
                        {log.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {log.metrics ? (
                        <span>ส่ง {log.metrics.sent} → ส่งถึง {log.metrics.delivered} → เปิด {log.metrics.opened} → คลิก {log.metrics.clicked}</span>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </DataTableShell>
        </>
      ) : (
        <article className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-base font-semibold">ทดสอบเปรียบเทียบ</h3>
          <p className="text-sm text-muted-foreground">ทดสอบข้อความ 2 แบบ เพื่อหาแบบที่ได้ผลดีกว่า</p>
          <div className="mt-4 space-y-4">
            {tests.map((test) => (
              <div key={test.id} className="rounded-xl border border-border bg-background p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold">{test.name}</p>
                    <p className="text-xs text-muted-foreground">ตัวชี้วัด: {test.metric}</p>
                  </div>
                  <Badge className={test.status === "running" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300"}>
                    {test.status === "running" ? "กำลังทดสอบ" : "เสร็จสิ้น"}
                  </Badge>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className={`rounded-lg border p-4 ${test.winner === "A" ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-950/30" : "border-border"}`}>
                    <p className="text-xs font-semibold text-muted-foreground">แบบ A {test.winner === "A" ? "🏆" : ""}</p>
                    <p className="mt-1 text-sm">{test.variantA}</p>
                    <p className="mt-2 text-xl font-bold">{test.resultA}%</p>
                  </div>
                  <div className={`rounded-lg border p-4 ${test.winner === "B" ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-950/30" : "border-border"}`}>
                    <p className="text-xs font-semibold text-muted-foreground">แบบ B {test.winner === "B" ? "🏆" : ""}</p>
                    <p className="mt-1 text-sm">{test.variantB}</p>
                    <p className="mt-2 text-xl font-bold">{test.resultB}%</p>
                  </div>
                </div>
                {test.status === "running" ? (
                  <Button
                    className="mt-3"
                    size="sm"
                    onClick={() =>
                      setTests((prev) =>
                        prev.map((item) =>
                          item.id === test.id
                            ? { ...item, status: "completed" as const, winner: item.resultB > item.resultA ? ("B" as const) : ("A" as const) }
                            : item,
                        ),
                      )
                    }
                  >
                    สิ้นสุดการทดสอบ
                  </Button>
                ) : null}
              </div>
            ))}
          </div>
        </article>
      )}
    </DashboardPageShell>
  );
}

