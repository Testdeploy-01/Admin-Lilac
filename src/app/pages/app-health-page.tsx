import { Activity, CircleAlert, RefreshCcw, ServerCrash } from "lucide-react";
import { useMemo, useState } from "react";
import {
  appHealthApis,
  appHealthKpis,
  appHealthServices,
  type HealthStatus,
} from "../../mocks/dashboard-features.mock";

type ServiceRecord = (typeof appHealthServices)[number];
type ApiRecord = (typeof appHealthApis)[number];

function formatTimestamp(date = new Date()) {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(
    date.getMinutes(),
  )}`;
}

function statusTone(status: HealthStatus) {
  if (status === "operational") {
    return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300";
  }

  if (status === "degraded") {
    return "bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300";
  }

  return "bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300";
}

function nextServiceStatus(current: HealthStatus): HealthStatus {
  if (current === "down") return "degraded";
  if (current === "degraded") return "operational";
  return "operational";
}

function probeApi(api: ApiRecord): ApiRecord {
  const nextStatus = api.status === "down" ? "degraded" : api.status === "degraded" ? "operational" : "operational";
  const nextLatency = api.status === "down" ? 380 : Math.max(95, Math.round(api.latencyMs * 0.92));

  return {
    ...api,
    status: nextStatus,
    latencyMs: nextLatency,
    lastChecked: formatTimestamp(),
  };
}

export function AppHealthPage() {
  const [services, setServices] = useState<ServiceRecord[]>(appHealthServices);
  const [apis, setApis] = useState<ApiRecord[]>(appHealthApis);
  const [checkingAll, setCheckingAll] = useState(false);
  const [lastSweepAt, setLastSweepAt] = useState(formatTimestamp());

  const openIncidents = useMemo(() => {
    const degradedServices = services.filter((service) => service.status !== "operational").length;
    const degradedApis = apis.filter((api) => api.status !== "operational").length;
    return degradedServices + degradedApis;
  }, [apis, services]);

  const handleCheckAll = () => {
    setCheckingAll(true);
    window.setTimeout(() => {
      setServices((current) =>
        current.map((service) => ({
          ...service,
          status: nextServiceStatus(service.status),
          note:
            service.status === "operational"
              ? service.note
              : service.status === "degraded"
                ? "Recovered after recent probe"
                : "Service is recovering and under watch",
        })),
      );
      setApis((current) => current.map((api) => probeApi(api)));
      setLastSweepAt(formatTimestamp());
      setCheckingAll(false);
    }, 420);
  };

  const handleProbeApi = (id: string) => {
    setApis((current) => current.map((api) => (api.id === id ? probeApi(api) : api)));
    setLastSweepAt(formatTimestamp());
  };

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">App Health</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Mock status board to monitor service/API availability and response quality.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Last sweep: {lastSweepAt}</span>
          <button
            type="button"
            onClick={handleCheckAll}
            disabled={checkingAll}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-70"
          >
            <RefreshCcw className={`h-3.5 w-3.5 ${checkingAll ? "animate-spin" : ""}`} />
            Check All (Mock)
          </button>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {appHealthKpis.map((item) => (
          <article key={item.label} className="rounded-xl bg-card p-5 shadow-card">
            <p className="text-sm text-muted-foreground">{item.label}</p>
            <p className="mt-3 text-2xl font-bold">{item.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{item.note}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.25fr_1fr]">
        <article className="rounded-xl bg-card p-6 shadow-card">
          <h2 className="text-lg font-semibold">Service Status</h2>
          <p className="text-sm text-muted-foreground">Core dependencies and internal modules.</p>
          <div className="mt-4 space-y-3">
            {services.map((service) => (
              <div key={service.id} className="rounded-lg bg-background p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-semibold">{service.name}</p>
                  </div>
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold capitalize ${statusTone(service.status)}`}>
                    {service.status}
                  </span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">Uptime: {service.uptime}</p>
                <p className="mt-1 text-xs text-muted-foreground">{service.note}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-xl bg-card p-6 shadow-card">
          <h2 className="text-lg font-semibold">Incident Summary</h2>
          <p className="text-sm text-muted-foreground">Current non-operational states from mock probes.</p>
          <div className="mt-4 grid gap-3">
            <div className="rounded-lg bg-background p-4">
              <p className="text-xs text-muted-foreground">Open Incidents</p>
              <p className="mt-2 text-2xl font-bold">{openIncidents}</p>
            </div>
            <div className="rounded-lg bg-background p-4">
              <p className="text-xs text-muted-foreground">Degraded APIs</p>
              <p className="mt-2 text-2xl font-bold">
                {apis.filter((api) => api.status === "degraded").length}
              </p>
            </div>
            <div className="rounded-lg bg-background p-4">
              <p className="text-xs text-muted-foreground">Down APIs</p>
              <p className="mt-2 text-2xl font-bold text-rose-500">{apis.filter((api) => api.status === "down").length}</p>
            </div>
          </div>
          <div className="mt-4 rounded-lg bg-background p-4 text-xs text-muted-foreground">
            <p className="flex items-center gap-2 font-medium text-foreground">
              <CircleAlert className="h-4 w-4 text-amber-500" />
              Suggested action
            </p>
            <p className="mt-2">Review degraded/down API handlers and verify fallback paths before next release.</p>
          </div>
        </article>
      </div>

      <article className="rounded-xl bg-card p-6 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold">API Endpoint Probe</h2>
            <p className="text-sm text-muted-foreground">Mock checks for endpoint availability and latency trend.</p>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[780px] text-sm">
            <caption className="sr-only">ตารางสถานะ API endpoint พร้อม latency และปุ่ม recheck</caption>
            <thead>
              <tr className="border-b border-border text-left font-medium text-foreground">
                <th scope="col" className="pb-2">Method</th>
                <th scope="col" className="pb-2">Endpoint</th>
                <th scope="col" className="pb-2">Status</th>
                <th scope="col" className="pb-2">Latency</th>
                <th scope="col" className="pb-2">Last Checked</th>
                <th scope="col" className="pb-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {apis.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-sm text-muted-foreground">
                    ไม่มีรายการ API สำหรับตรวจสอบ
                  </td>
                </tr>
              ) : (
                apis.map((api) => (
                  <tr key={api.id} className="border-b border-border/70 last:border-none">
                    <td className="py-3">
                      <span className="inline-flex rounded-md bg-background px-2 py-1 text-xs font-semibold">
                        {api.method}
                      </span>
                    </td>
                    <td className="py-3">
                      <p className="font-medium">{api.name}</p>
                      <p className="text-xs text-muted-foreground">{api.path}</p>
                    </td>
                    <td className="py-3">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold capitalize ${statusTone(api.status)}`}>
                        {api.status}
                      </span>
                    </td>
                    <td className="py-3">{api.latencyMs > 0 ? `${api.latencyMs} ms` : "-"}</td>
                    <td className="py-3 text-muted-foreground">{api.lastChecked}</td>
                    <td className="py-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleProbeApi(api.id)}
                        className="inline-flex items-center gap-1 rounded-md bg-background px-2.5 py-1.5 text-xs font-semibold text-foreground transition hover:bg-primary-soft"
                      >
                        <ServerCrash className="h-3.5 w-3.5" />
                        Recheck
                      </button>
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
