import { useMemo, useState } from "react";
import { coreModels, knowledgeEntries, tokenUsage } from "../../mocks/dashboard-features.mock";

const ownerFilters = ["All", ...new Set(knowledgeEntries.map((entry) => entry.owner))];

export function AiManagerPage() {
  const [models, setModels] = useState(coreModels);
  const [ownerFilter, setOwnerFilter] = useState(ownerFilters[0]);
  const [query, setQuery] = useState("");
  const [persona, setPersona] = useState("Mentor Coach");
  const [prompt, setPrompt] = useState(
    "Always answer with concise guidance, explain key terms, and provide one practical next step.",
  );
  const [lastSavedAt, setLastSavedAt] = useState("Not saved yet");

  const filteredKnowledge = useMemo(() => {
    return knowledgeEntries.filter((entry) => {
      const passOwner = ownerFilter === "All" || entry.owner === ownerFilter;
      const passQuery =
        query.trim().length === 0 ||
        `${entry.topic} ${entry.version} ${entry.owner}`.toLowerCase().includes(query.toLowerCase());
      return passOwner && passQuery;
    });
  }, [ownerFilter, query]);

  const maxTokens = Math.max(...tokenUsage.byModel.map((entry) => entry.tokens));

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">AI Manager</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Core model settings, knowledge base persona, and performance monitoring panel.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        {models.map((model) => (
          <article key={model.id} className="rounded-xl bg-card p-5 shadow-card">
            <p className="text-sm text-muted-foreground">Core Model</p>
            <h2 className="mt-2 text-lg font-semibold">{model.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">Avg latency: {model.latency}</p>
            <span
              className={`mt-4 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                model.status === "Active"
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"
                  : model.status === "Standby"
                    ? "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {model.status}
            </span>
            <button
              type="button"
              onClick={() =>
                setModels((prev) =>
                  prev.map((candidate) => ({
                    ...candidate,
                    status: candidate.id === model.id ? "Active" : candidate.status === "Retired" ? "Retired" : "Standby",
                  })),
                )
              }
              className="mt-4 rounded-md bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground transition hover:opacity-90"
            >
              Set Active
            </button>
          </article>
        ))}
      </div>

      <article className="rounded-xl bg-card p-6 shadow-card">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Knowledge Base / Persona</h2>
            <p className="text-sm text-muted-foreground">Prompt and personality datasets currently loaded.</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search topic/owner..."
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            <select
              value={ownerFilter}
              onChange={(event) => setOwnerFilter(event.target.value)}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {ownerFilters.map((owner) => (
                <option key={owner}>{owner}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-foreground font-medium">
                <th className="pb-2">Topic</th>
                <th className="pb-2">Version</th>
                <th className="pb-2">Updated</th>
                <th className="pb-2">Owner</th>
              </tr>
            </thead>
            <tbody>
              {filteredKnowledge.map((entry) => (
                <tr key={entry.topic} className="border-b border-border/60 last:border-none">
                  <td className="py-3 font-medium">{entry.topic}</td>
                  <td className="py-3">{entry.version}</td>
                  <td className="py-3">{entry.updatedAt}</td>
                  <td className="py-3">{entry.owner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>

      <article className="rounded-xl bg-card p-6 shadow-card">
        <h2 className="text-lg font-semibold">Persona / Prompt Control</h2>
        <div className="mt-4 grid gap-3 text-sm">
          <label className="block">
            <span className="text-muted-foreground">Persona</span>
            <select
              value={persona}
              onChange={(event) => setPersona(event.target.value)}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
            >
              <option>Mentor Coach</option>
              <option>Calm Study Buddy</option>
              <option>Results-driven Tutor</option>
            </select>
          </label>
          <label className="block">
            <span className="text-muted-foreground">Master Prompt</span>
            <textarea
              rows={4}
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
            />
          </label>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setLastSavedAt(new Date().toLocaleString())}
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              Save Prompt (Mock)
            </button>
            <p className="text-xs text-muted-foreground">Last saved: {lastSavedAt}</p>
          </div>
        </div>
      </article>

      <article className="rounded-xl bg-card p-6 shadow-card">
        <h2 className="text-lg font-semibold">Performance Monitoring</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-background p-4">
            <p className="text-xs text-muted-foreground">Token Usage</p>
            <p className="mt-2 text-xl font-bold">{tokenUsage.monthlyTotal}</p>
          </div>
          <div className="rounded-lg bg-background p-4">
            <p className="text-xs text-muted-foreground">Average Latency</p>
            <p className="mt-2 text-xl font-bold">{tokenUsage.averageLatency}</p>
          </div>
          <div className="rounded-lg bg-background p-4">
            <p className="text-xs text-muted-foreground">Success Rate</p>
            <p className="mt-2 text-xl font-bold">{tokenUsage.successRate}</p>
          </div>
        </div>

        <div className="mt-5 space-y-2">
          {tokenUsage.byModel.map((entry) => {
            const percent = (entry.tokens / maxTokens) * 100;
            return (
              <div key={entry.model} className="rounded-lg bg-background p-3">
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground">{entry.model}</span>
                  <span className="text-muted-foreground">{entry.tokens.toLocaleString()} tokens</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div className="h-2 rounded-full bg-primary" style={{ width: `${percent}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </article>
    </section>
  );
}
