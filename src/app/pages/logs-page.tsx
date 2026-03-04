import { useEffect, useMemo, useState } from "react";
import { downloadText } from "../../lib/exporters";
import { systemLogs } from "../../mocks/dashboard-features.mock";

type LogLevel = "INFO" | "WARN" | "ERROR";
type LogRow = (typeof systemLogs)[number];

const sources = ["scheduler", "ai-manager", "gateway", "notifier", "user-service"];
const messages = [
  "Cache warmed for dashboard widgets",
  "Prompt routing latency spike detected",
  "Retry worker completed payout callback",
  "Notification queue consumed successfully",
  "Session refresh token rotation complete",
];

function nowStamp() {
  const now = new Date();
  return now.toISOString().replace("T", " ").slice(0, 19);
}

export function LogsPage() {
  const [logs, setLogs] = useState<LogRow[]>(systemLogs);
  const [query, setQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState<"ALL" | LogLevel>("ALL");
  const [live, setLive] = useState(true);

  useEffect(() => {
    if (!live) {
      return;
    }

    const timer = window.setInterval(() => {
      const levelPick = Math.random();
      const level: LogLevel = levelPick < 0.1 ? "ERROR" : levelPick < 0.35 ? "WARN" : "INFO";
      const source = sources[Math.floor(Math.random() * sources.length)];
      const message = messages[Math.floor(Math.random() * messages.length)];

      setLogs((prev) => [
        {
          timestamp: nowStamp(),
          level,
          source,
          message,
          traceId: `TRC-${Math.floor(1000 + Math.random() * 9000)}`,
          userId: Math.random() > 0.5 ? `U-${Math.floor(1000 + Math.random() * 9000)}` : "-",
          errorCode: level === "ERROR" ? `ERR-${Math.floor(100 + Math.random() * 900)}` : "-",
        },
        ...prev,
      ].slice(0, 90));
    }, 2800);

    return () => window.clearInterval(timer);
  }, [live]);

  const filtered = useMemo(() => {
    return logs.filter((log) => {
      const passLevel = levelFilter === "ALL" || log.level === levelFilter;
      const passQuery =
        query.trim().length === 0 ||
        `${log.message} ${log.source} ${log.traceId} ${log.userId} ${log.errorCode}`.toLowerCase().includes(query.toLowerCase());
      return passLevel && passQuery;
    });
  }, [levelFilter, logs, query]);

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">บันทึกระบบ (System Logs)</h2>
          <p className="mt-1 text-sm text-muted-foreground">ติดตาม Log แบบ Real-time พร้อมเครื่องมือค้นหาและ Export</p>
        </div>
        <span aria-live="polite" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs">
          <span className="sr-only">สถานะสตรีมบันทึกระบบ</span>
          <span className={`h-2.5 w-2.5 rounded-full ${live ? "animate-pulse bg-emerald-500" : "bg-muted-foreground"}`} />
          {live ? "Live Feed" : "Paused"}
        </span>
      </header>

      <article className="rounded-xl border border-slate-700 bg-slate-950 p-6 shadow-card">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setLevelFilter("ALL")}
              className={`rounded-md px-3 py-1 text-xs font-semibold ${levelFilter === "ALL" ? "bg-slate-100 text-slate-900" : "bg-slate-800 text-slate-300"
                }`}
            >
              ทุกระดับ
            </button>
            <button
              type="button"
              onClick={() => setLevelFilter("ERROR")}
              className={`rounded-md px-3 py-1 text-xs font-semibold ${levelFilter === "ERROR" ? "bg-rose-500 text-white" : "bg-slate-800 text-slate-300"
                }`}
            >
              Errors Only
            </button>
            <button
              type="button"
              onClick={() => setLive((current) => !current)}
              className={`rounded-md px-3 py-1 text-xs font-semibold ${live ? "bg-amber-500 text-slate-900" : "bg-emerald-500 text-white"
                }`}
            >
              {live ? "Pause" : "Resume"}
            </button>
            <button
              type="button"
              onClick={() => downloadText("system-logs", filtered.map((item) => JSON.stringify(item)).join("\n"), "txt")}
              className="rounded-md bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-300"
            >
              Export .txt
            </button>
            <button
              type="button"
              onClick={() => downloadText("system-logs", JSON.stringify(filtered, null, 2), "json")}
              className="rounded-md bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-300"
            >
              Export .json
            </button>
          </div>

          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="ค้นหาจาก Error Code หรือ User ID"
            placeholder="ค้นหา Error Code หรือ User ID..."
            className="w-full max-w-xs rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500"
          />
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[1020px] text-sm font-mono">
            <caption className="sr-only">ตารางบันทึกระบบแบบเรียลไทม์พร้อมระดับความรุนแรงและรหัสติดตาม</caption>
            <thead>
              <tr className="border-b border-slate-800 text-left text-slate-500">
                <th scope="col" className="pb-2">timestamp</th>
                <th scope="col" className="pb-2">level</th>
                <th scope="col" className="pb-2">source</th>
                <th scope="col" className="pb-2">message</th>
                <th scope="col" className="pb-2">traceId</th>
                <th scope="col" className="pb-2">userId</th>
                <th scope="col" className="pb-2">errorCode</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-sm text-slate-400">
                    ไม่พบบันทึกระบบตามเงื่อนไขที่ค้นหา
                  </td>
                </tr>
              ) : (
                filtered.map((log) => (
                  <tr key={`${log.traceId}-${log.timestamp}`} className="border-b border-slate-900/80 last:border-none text-slate-300">
                    <td className="py-2">{log.timestamp}</td>
                    <td
                      className={`py-2 font-semibold ${log.level === "ERROR"
                          ? "text-rose-400"
                          : log.level === "WARN"
                            ? "text-amber-400"
                            : "text-emerald-400"
                        }`}
                    >
                      {log.level}
                    </td>
                    <td className="py-2">{log.source}</td>
                    <td className="py-2">{log.message}</td>
                    <td className="py-2 text-slate-400">{log.traceId}</td>
                    <td className="py-2 text-slate-400">{log.userId}</td>
                    <td className="py-2 text-slate-400">{log.errorCode}</td>
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
