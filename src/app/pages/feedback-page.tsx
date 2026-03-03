import { useMemo, useState } from "react";
import { feedbackEntries } from "../../mocks/dashboard-features.mock";

type FeedbackTag = "all" | "issues" | "feature" | "praise";
type FeedbackStatus = "all" | "Open" | "In Review" | "Closed";

const tagButtons: Array<{ key: FeedbackTag; label: string }> = [
  { key: "all", label: "All" },
  { key: "issues", label: "Issues" },
  { key: "feature", label: "Feature Suggestions" },
  { key: "praise", label: "Praise" },
];

const statusButtons: Array<{ key: FeedbackStatus; label: string }> = [
  { key: "all", label: "All Status" },
  { key: "Open", label: "Open" },
  { key: "In Review", label: "In Review" },
  { key: "Closed", label: "Closed" },
];

export function FeedbackPage() {
  const [tag, setTag] = useState<FeedbackTag>("all");
  const [status, setStatus] = useState<FeedbackStatus>("all");
  const [entries, setEntries] = useState(feedbackEntries);

  const filtered = useMemo(() => {
    return entries.filter((item) => {
      const passTag = tag === "all" || item.tag === tag;
      const passStatus = status === "all" || item.status === status;
      return passTag && passStatus;
    });
  }, [entries, status, tag]);

  const totalReviews = entries.length;
  const averageRating = entries.reduce((sum, item) => sum + item.rating, 0) / Math.max(totalReviews, 1);
  const openIssues = entries.filter((item) => item.status !== "Closed").length;

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Customer Feedback</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          KPI summary, tag-based sorting, and feedback table for sprint triage.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <article className="rounded-xl bg-card p-5 shadow-card">
          <p className="text-sm text-muted-foreground">Total Reviews</p>
          <p className="mt-3 text-2xl font-bold">{totalReviews.toLocaleString()}</p>
        </article>
        <article className="rounded-xl bg-card p-5 shadow-card">
          <p className="text-sm text-muted-foreground">Average Rating</p>
          <p className="mt-3 text-2xl font-bold">{averageRating.toFixed(1)} / 5</p>
        </article>
        <article className="rounded-xl bg-card p-5 shadow-card">
          <p className="text-sm text-muted-foreground">Open Issues</p>
          <p className="mt-3 text-2xl font-bold">{openIssues.toLocaleString()}</p>
        </article>
      </div>

      <article className="rounded-xl bg-card p-6 shadow-card">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {tagButtons.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => setTag(option.key)}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  tag === option.key
                    ? "bg-primary text-primary-foreground"
                    : "bg-background text-muted-foreground hover:bg-muted"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {statusButtons.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => setStatus(option.key)}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  status === option.key
                    ? "bg-primary text-primary-foreground"
                    : "bg-background text-muted-foreground hover:bg-muted"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="pb-2">Feedback ID</th>
                <th className="pb-2">User</th>
                <th className="pb-2">Tag</th>
                <th className="pb-2">Rating</th>
                <th className="pb-2">Comment</th>
                <th className="pb-2">Date</th>
                <th className="pb-2">Status</th>
                <th className="pb-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className="border-b border-border/70 last:border-none">
                  <td className="py-3 font-medium">{item.id}</td>
                  <td className="py-3">{item.userId}</td>
                  <td className="py-3">
                    <span className="rounded-full bg-muted px-2 py-1 text-xs font-semibold">{item.tag}</span>
                  </td>
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
                      onChange={(event) =>
                        setEntries((prev) =>
                          prev.map((candidate) =>
                            candidate.id === item.id
                              ? { ...candidate, status: event.target.value as (typeof candidate)["status"] }
                              : candidate,
                          ),
                        )
                      }
                      className="rounded-md border border-input bg-background px-2 py-1 text-xs"
                    >
                      <option>Open</option>
                      <option>In Review</option>
                      <option>Closed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}
