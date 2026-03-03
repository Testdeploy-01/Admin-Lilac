import { useEffect, useMemo, useState } from "react";
import { systemLogs } from "../../mocks/dashboard-features.mock";

type LogLevelFilter = "ALL" | "ERROR";

const mockRealtimeSources = ["scheduler", "ai-manager", "gateway", "notifier", "user-service"];
const mockRealtimeMessages = [
  "Cache warmed for dashboard widgets",
  "Prompt routing latency spike detected",
  "Retry worker completed payout callback",
  "Notification queue consumed successfully",
  "Session refresh token rotation complete",
];

export function LogsPage() {
  const [query, setQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState<LogLevelFilter>("ALL");
  const [realtime, setRealtime] = useState(true);
  const [logs, setLogs] = useState(systemLogs);

  useEffect(() => {
    if (!realtime) return;
    const timer = window.setInterval(() => {
      const source = mockRealtimeSources[Math.floor(Math.random() * mockRealtimeSources.length)];
      const message = mockRealtimeMessages[Math.floor(Math.random() * mockRealtimeMessages.length)];
      const pick = Math.random();
      const level = pick < 0.1 ? "ERROR" : pick < 0.35 ? "WARN" : "INFO";

      const now = new Date();
      const stamp = now.toISOString().replace("T", " ").slice(0, 19);
      const traceId = `TRC-${Math.floor(1000 + Math.random() * 9000)}`;

      setLogs((prev) =>
        [{ timestamp: stamp, level, source, message, traceId }, ...prev].slice(0, 60),
      );
    }, 3000);

    return () => window.clearInterval(timer);
  }, [realtime]);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const passLevel = levelFilter === "ALL" || log.level === "ERROR";
      const passQuery =
        query.trim().length === 0 ||
        `${log.source} ${log.message} ${log.traceId}`.toLowerCase().includes(query.toLowerCase());
      return passLevel && passQuery;
    });
  }, [levelFilter, logs, query]);

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">System Logs Feed</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Realtime dark terminal simulation with error-only filtering and log search.
        </p>
      </header>

      <article className="rounded-xl border border-slate-700 bg-slate-950 p-6 shadow-card">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setLevelFilter("ALL")}
              className={`rounded-md px-3 py-1 text-xs font-semibold ${
                levelFilter === "ALL" ? "bg-slate-100 text-slate-900" : "bg-slate-800 text-slate-300"
              }`}
            >
              All Levels
            </button>
            <button
              type="button"
              onClick={() => setLevelFilter("ERROR")}
              className={`rounded-md px-3 py-1 text-xs font-semibold ${
                levelFilter === "ERROR" ? "bg-rose-500 text-white" : "bg-slate-800 text-slate-300"
              }`}
            >
              Errors Only
            </button>
            <button
              type="button"
              onClick={() => setRealtime((current) => !current)}
              className={`rounded-md px-3 py-1 text-xs font-semibold ${
                realtime ? "bg-emerald-500 text-white" : "bg-slate-700 text-slate-200"
              }`}
            >
              {realtime ? "Realtime ON" : "Realtime OFF"}
            </button>
            <button
              type="button"
              onClick={() => setLogs([])}
              className="rounded-md bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-300 hover:bg-slate-700"
            >
              Clear
            </button>
          </div>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search logs..."
            className="w-full max-w-xs rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none ring-0 placeholder:text-slate-500"
          />
        </div>

        <div className="mt-4 space-y-2 font-mono text-sm">
          {filteredLogs.length === 0 ? (
            <p className="rounded-md bg-slate-900/70 px-3 py-2 text-slate-400">No log entries found.</p>
          ) : (
            filteredLogs.map((log) => (
              <div key={`${log.traceId}-${log.timestamp}`} className="rounded-md border border-slate-800 bg-slate-900/70 px-3 py-2">
                <p className="text-slate-300">
                  <span className="text-slate-500">{log.timestamp}</span>{" "}
                  <span
                    className={`font-semibold ${
                      log.level === "ERROR"
                        ? "text-rose-400"
                        : log.level === "WARN"
                          ? "text-amber-400"
                          : "text-emerald-400"
                    }`}
                  >
                    {log.level}
                  </span>{" "}
                  <span className="text-slate-400">[{log.source}]</span>
                </p>
                <p className="mt-1 text-slate-200">{log.message}</p>
                <p className="mt-1 text-xs text-slate-500">{log.traceId}</p>
              </div>
            ))
          )}
        </div>
      </article>
    </section>
  );
}
