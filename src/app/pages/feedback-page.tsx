import { useMemo, useState } from "react";
import { feedbackEntries } from "../../mocks/dashboard-features.mock";

type TagFilter = "ทั้งหมด" | "คำชม" | "ข้อเสนอแนะ" | "ปัญหา";
type StatusFilter = "ทั้งหมด" | "รอดำเนินการ" | "กำลังตรวจสอบ" | "แก้แล้ว";

const tagButtons: TagFilter[] = ["ทั้งหมด", "คำชม", "ข้อเสนอแนะ", "ปัญหา"];
const statusOptions: StatusFilter[] = ["ทั้งหมด", "รอดำเนินการ", "กำลังตรวจสอบ", "แก้แล้ว"];

export function FeedbackPage() {
  const [rows, setRows] = useState(feedbackEntries);
  const [tag, setTag] = useState<TagFilter>("ทั้งหมด");
  const [status, setStatus] = useState<StatusFilter>("ทั้งหมด");

  const filtered = useMemo(() => {
    return rows.filter((row) => {
      const passTag = tag === "ทั้งหมด" || row.tag === tag;
      const passStatus = status === "ทั้งหมด" || row.status === status;
      return passTag && passStatus;
    });
  }, [rows, status, tag]);

  const total = rows.length;
  const avgRating = rows.reduce((sum, row) => sum + row.rating, 0) / Math.max(1, rows.length);
  const openBugs = rows.filter((row) => row.tag === "ปัญหา" && row.status !== "แก้แล้ว").length;

  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold tracking-tight">ความคิดเห็น (Feedback)</h2>
        <p className="mt-1 text-sm text-muted-foreground">คัดกรองคำชม, ข้อเสนอแนะ และ Bug Report เพื่อปรับปรุงระบบอย่างต่อเนื่อง</p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <article className="rounded-xl bg-card p-5 shadow-card">
          <p className="text-sm text-muted-foreground">Feedback ทั้งหมด</p>
          <p className="mt-3 text-2xl font-bold">{total.toLocaleString()}</p>
        </article>
        <article className="rounded-xl bg-card p-5 shadow-card">
          <p className="text-sm text-muted-foreground">Rating เฉลี่ย</p>
          <p className="mt-3 text-2xl font-bold">{avgRating.toFixed(1)} / 5</p>
        </article>
        <article className="rounded-xl bg-card p-5 shadow-card">
          <p className="text-sm text-muted-foreground">Bug Report ที่รอแก้</p>
          <p className="mt-3 text-2xl font-bold">{openBugs}</p>
        </article>
      </div>

      <article className="rounded-xl bg-card p-6 shadow-card">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {tagButtons.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setTag(item)}
                aria-pressed={tag === item}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${tag === item ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:bg-accent"
                  }`}
              >
                {item}
              </button>
            ))}
          </div>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as StatusFilter)}
            aria-label="กรองสถานะ Feedback"
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            {statusOptions.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[980px] text-sm">
            <caption className="sr-only">ตารางคิวความคิดเห็นผู้ใช้ พร้อมคะแนนและสถานะการแก้ไข</caption>
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th scope="col" className="pb-2">ผู้ใช้</th>
                <th scope="col" className="pb-2">ประเภท</th>
                <th scope="col" className="pb-2">ดาว</th>
                <th scope="col" className="pb-2">ข้อความ</th>
                <th scope="col" className="pb-2">วันที่</th>
                <th scope="col" className="pb-2">สถานะ</th>
                <th scope="col" className="pb-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-sm text-muted-foreground">
                    ไม่พบรายการ Feedback ตามเงื่อนไขที่เลือก
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="border-b border-border/70 last:border-none">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <img src={item.avatar} alt={item.userName} className="h-8 w-8 rounded-full border border-border" />
                        <div>
                          <p className="font-medium">{item.userName}</p>
                          <p className="text-xs text-muted-foreground">{item.userId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">{item.tag}</td>
                    <td className="py-3">{item.rating}/5</td>
                    <td className="py-3">{item.comment}</td>
                    <td className="py-3">{item.date}</td>
                    <td className="py-3">
                      <span className="rounded-full bg-muted px-2 py-1 text-xs font-semibold text-muted-foreground">
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3">
                      <select
                        value={item.status}
                        aria-label={`เปลี่ยนสถานะ ${item.id}`}
                        onChange={(event) =>
                          setRows((prev) =>
                            prev.map((row) =>
                              row.id === item.id ? { ...row, status: event.target.value as (typeof row.status) } : row,
                            ),
                          )
                        }
                        className="rounded-md border border-input bg-background px-2 py-1 text-xs"
                      >
                        <option>รอดำเนินการ</option>
                        <option>กำลังตรวจสอบ</option>
                        <option>แก้แล้ว</option>
                      </select>
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

