import { useMemo, useState } from "react";
import { lifestyleCards, lifestyleUsageStats } from "../../mocks/dashboard-features.mock";

type LifestyleStatusFilter = "ALL" | "Published" | "Draft";

export function LifestylePage() {
  const [cards, setCards] = useState(lifestyleCards);
  const [filter, setFilter] = useState<LifestyleStatusFilter>("ALL");
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState("Quote Card");

  const filteredCards = useMemo(() => {
    return cards.filter((card) => filter === "ALL" || card.status === filter);
  }, [cards, filter]);

  const publishedCount = cards.filter((card) => card.status === "Published").length;
  const draftCount = cards.filter((card) => card.status === "Draft").length;

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Lifestyle Content</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage daily cards, prompts, and wellness content distribution.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {lifestyleUsageStats.map((stat) => (
          <article key={stat.metric} className="rounded-xl bg-card p-5 shadow-card">
            <p className="text-sm text-muted-foreground">{stat.metric}</p>
            <p className="mt-3 text-2xl font-bold">{stat.value}</p>
          </article>
        ))}
      </div>

      <article className="rounded-xl bg-card p-6 shadow-card">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Card Manager</h2>
            <p className="text-sm text-muted-foreground">Quote cards, banners, and wellness prompts.</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value as LifestyleStatusFilter)}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="ALL">All Status</option>
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
            </select>
            <p className="rounded-md bg-background px-3 py-2 text-xs text-muted-foreground">
              Published: {publishedCount} | Draft: {draftCount}
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-2 rounded-lg bg-background p-3 sm:grid-cols-[1fr_auto_auto]">
          <input
            value={newTitle}
            onChange={(event) => setNewTitle(event.target.value)}
            placeholder="New card title..."
            className="rounded-md border border-input bg-card px-3 py-2 text-sm"
          />
          <select
            value={newType}
            onChange={(event) => setNewType(event.target.value)}
            className="rounded-md border border-input bg-card px-3 py-2 text-sm"
          >
            <option>Quote Card</option>
            <option>Health Prompt</option>
            <option>Journal Prompt</option>
            <option>Banner</option>
          </select>
          <button
            type="button"
            onClick={() => {
              if (newTitle.trim().length === 0) return;
              setCards((prev) => [
                {
                  id: `LC-${String(prev.length + 1).padStart(3, "0")}`,
                  title: newTitle.trim(),
                  type: newType,
                  schedule: "Daily 18:00",
                  status: "Draft",
                },
                ...prev,
              ]);
              setNewTitle("");
            }}
            className="rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition hover:opacity-90"
          >
            Add Card (Mock)
          </button>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="pb-2">ID</th>
                <th className="pb-2">Title</th>
                <th className="pb-2">Type</th>
                <th className="pb-2">Schedule</th>
                <th className="pb-2">Status</th>
                <th className="pb-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredCards.map((card) => (
                <tr key={card.id} className="border-b border-border/70 last:border-none">
                  <td className="py-3 font-medium">{card.id}</td>
                  <td className="py-3">{card.title}</td>
                  <td className="py-3">{card.type}</td>
                  <td className="py-3">{card.schedule}</td>
                  <td className="py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        card.status === "Published"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {card.status}
                    </span>
                  </td>
                  <td className="py-3">
                    <button
                      type="button"
                      onClick={() =>
                        setCards((prev) =>
                          prev.map((candidate) =>
                            candidate.id === card.id
                              ? { ...candidate, status: candidate.status === "Published" ? "Draft" : "Published" }
                              : candidate,
                          ),
                        )
                      }
                      className="rounded-md bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground transition hover:bg-accent"
                    >
                      {card.status === "Published" ? "Move to Draft" : "Publish"}
                    </button>
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
