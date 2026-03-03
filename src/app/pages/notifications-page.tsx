import { useMemo, useState } from "react";
import { audienceTargets, broadcastLogs, noticeCategories, type BroadcastLogRow } from "../../mocks/dashboard-features.mock";

type Tab = "ทั้งหมด" | "รวม" | "สำคัญ" | "ระบบ" | "การเงิน";

export function NotificationsPage() {
  const [tab, setTab] = useState<Tab>("ทั้งหมด");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState(noticeCategories[0]);
  const [audience, setAudience] = useState(audienceTargets[0]);
  const [logs, setLogs] = useState<BroadcastLogRow[]>(broadcastLogs);

  const filteredLogs = useMemo(() => {
    if (tab === "ทั้งหมด") {
      return logs;
    }
    return logs.filter((log) => log.category === tab);
  }, [logs, tab]);

  const canSubmit = title.trim().length >= 3 && message.trim().length >= 8;

  const pushLog = (status: "Sent" | "Draft") => {
    if (!canSubmit) {
      return;
    }
    const next: BroadcastLogRow = {
      id: `NTF-${String(logs.length + 1).padStart(3, "0")}`,
      title: title.trim(),
      category,
      audience,
      sentAt: new Date().toLocaleString(),
      status,
    };
    setLogs((prev) => [next, ...prev]);
    setTitle("");
    setMessage("");
  };

  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold tracking-tight">แจ้งเตือน / Broadcast</h2>
        <p className="mt-1 text-sm text-muted-foreground">สร้างข้อความแจ้งเตือน เลือกกลุ่มเป้าหมาย และตรวจสอบประวัติการส่ง</p>
      </header>

      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <article className="rounded-xl bg-card p-6 shadow-card">
          <h3 className="text-base font-semibold">Broadcaster Tool</h3>
          <div className="mt-4 space-y-3 text-sm">
            <label className="block">
              <span className="text-muted-foreground">หัวข้อ</span>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                aria-label="หัวข้อการแจ้งเตือน"
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
              />
            </label>
            <label className="block">
              <span className="text-muted-foreground">รายละเอียด</span>
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                aria-label="รายละเอียดการแจ้งเตือน"
                rows={5}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
              />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="text-muted-foreground">หมวดหมู่</span>
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  aria-label="เลือกหมวดหมู่การแจ้งเตือน"
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
                >
                  {noticeCategories.map((entry) => (
                    <option key={entry}>{entry}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-muted-foreground">กลุ่มผู้ชม</span>
                <select
                  value={audience}
                  onChange={(event) => setAudience(event.target.value)}
                  aria-label="เลือกกลุ่มผู้ชม"
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
                >
                  {audienceTargets.map((entry) => (
                    <option key={entry}>{entry}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                disabled={!canSubmit}
                onClick={() => pushLog("Sent")}
                className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
              >
                ส่งทันที
              </button>
              <button
                type="button"
                disabled={!canSubmit}
                onClick={() => pushLog("Draft")}
                className="rounded-md border border-input bg-background px-4 py-2 text-sm font-semibold disabled:opacity-50"
              >
                เซฟแบบร่าง
              </button>
            </div>
          </div>
        </article>

        <article className="rounded-xl bg-card p-6 shadow-card">
          <h3 className="text-base font-semibold">Preview</h3>
          <div className="mt-4 rounded-lg border border-dashed border-border bg-background p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{category}</p>
            <p className="mt-2 text-sm font-semibold">{title || "(ยังไม่ได้ใส่หัวข้อ)"}</p>
            <p className="mt-2 text-sm text-muted-foreground">{message || "(ยังไม่ได้ใส่รายละเอียด)"}</p>
            <p className="mt-3 text-xs text-muted-foreground">กลุ่มเป้าหมาย: {audience}</p>
          </div>
        </article>
      </div>

      <article className="rounded-xl bg-card p-6 shadow-card">
        <div className="flex flex-wrap items-center gap-2">
          {(["ทั้งหมด", ...noticeCategories] as Tab[]).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setTab(item)}
              aria-pressed={tab === item}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                tab === item ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:bg-accent"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[860px] text-sm">
            <caption className="sr-only">ตารางประวัติการส่งข้อความและสถานะแบบร่าง</caption>
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th scope="col" className="pb-2">รหัส</th>
                <th scope="col" className="pb-2">หัวข้อ</th>
                <th scope="col" className="pb-2">หมวด</th>
                <th scope="col" className="pb-2">กลุ่มเป้าหมาย</th>
                <th scope="col" className="pb-2">เวลา</th>
                <th scope="col" className="pb-2">สถานะ</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-sm text-muted-foreground">
                    ไม่พบประวัติการส่งในหมวดที่เลือก
                  </td>
                </tr>
              ) : (
                filteredLogs.map((row) => (
                  <tr key={row.id} className="border-b border-border/70 last:border-none">
                    <td className="py-3 font-medium">{row.id}</td>
                    <td className="py-3">{row.title}</td>
                    <td className="py-3">{row.category}</td>
                    <td className="py-3">{row.audience}</td>
                    <td className="py-3">{row.sentAt}</td>
                    <td className="py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          row.status === "Sent"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300"
                        }`}
                      >
                        {row.status}
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

