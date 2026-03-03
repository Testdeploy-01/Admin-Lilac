import { useMemo, useState } from "react";
import { audienceTargets, noticeCategories } from "../../mocks/dashboard-features.mock";

type BroadcastHistory = {
  id: string;
  title: string;
  category: string;
  audience: string;
  sentAt: string;
};

export function NotificationsPage() {
  const [title, setTitle] = useState("PLUS+ Special Weekend");
  const [message, setMessage] = useState("Unlock premium study packs with 20% discount this weekend only.");
  const [category, setCategory] = useState(noticeCategories[1]);
  const [audience, setAudience] = useState(audienceTargets[0]);
  const [history, setHistory] = useState<BroadcastHistory[]>([]);

  const canSend = title.trim().length > 3 && message.trim().length > 8;

  const previewTone = useMemo(() => {
    if (category.includes("System")) return "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300";
    if (category.includes("Promotion")) return "bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300";
    if (category.includes("Lifestyle")) return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300";
    return "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300";
  }, [category]);

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Notifications Broadcast</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Notice builder with category and audience targeting options.
        </p>
      </header>

      <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <article className="rounded-xl bg-card p-6 shadow-card">
          <h2 className="text-lg font-semibold">Notice Builder</h2>
          <div className="mt-4 space-y-3 text-sm">
            <label className="block">
              <span className="text-muted-foreground">Headline</span>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
              />
            </label>
            <label className="block">
              <span className="text-muted-foreground">Category</span>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
              >
                {noticeCategories.map((entry) => (
                  <option key={entry}>{entry}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-muted-foreground">Message</span>
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                rows={5}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
              />
            </label>
          </div>
        </article>

        <article className="rounded-xl bg-card p-6 shadow-card">
          <h2 className="text-lg font-semibold">Category & Audience Targeting</h2>
          <div className="mt-4 space-y-3 text-sm">
            <label className="block">
              <span className="text-muted-foreground">Audience</span>
              <select
                value={audience}
                onChange={(event) => setAudience(event.target.value)}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
              >
                {audienceTargets.map((entry) => (
                  <option key={entry}>{entry}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-5 rounded-lg border border-dashed border-border bg-background p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Preview</p>
            <p className="mt-2 text-sm font-semibold">{title || "Untitled notice"}</p>
            <p className="mt-1 text-xs">
              <span className={`inline-flex rounded-full px-2 py-1 ${previewTone}`}>{category}</span>
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{message || "No message yet"}</p>
            <p className="mt-3 text-xs text-muted-foreground">Target: {audience}</p>
          </div>

          <button
            type="button"
            disabled={!canSend}
            onClick={() =>
              setHistory((prev) => [
                {
                  id: `NTF-${String(prev.length + 1).padStart(3, "0")}`,
                  title,
                  category,
                  audience,
                  sentAt: new Date().toLocaleString(),
                },
                ...prev,
              ])
            }
            className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Send Broadcast (Mock)
          </button>
        </article>
      </div>

      <article className="rounded-xl bg-card p-6 shadow-card">
        <h2 className="text-lg font-semibold">Recent Broadcasts</h2>
        <p className="text-sm text-muted-foreground">Local mock history of sent notifications.</p>
        <div className="mt-4 space-y-2">
          {history.length === 0 ? (
            <p className="text-sm text-muted-foreground">No broadcasts yet.</p>
          ) : (
            history.map((item) => (
              <div key={item.id} className="rounded-lg bg-background p-3 text-sm">
                <p className="font-semibold">{item.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {item.category} - {item.audience} - {item.sentAt}
                </p>
              </div>
            ))
          )}
        </div>
      </article>
    </section>
  );
}
