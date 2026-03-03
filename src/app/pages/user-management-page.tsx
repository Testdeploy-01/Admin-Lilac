import { useMemo, useState } from "react";
import { managedUsers } from "../../mocks/dashboard-features.mock";

type UserFilter = "all" | "visitor" | "active" | "suspended";

const filters: Array<{ key: UserFilter; label: string }> = [
  { key: "all", label: "All" },
  { key: "visitor", label: "Visitors" },
  { key: "active", label: "Active" },
  { key: "suspended", label: "Suspended" },
];

const categoryStyles: Record<string, string> = {
  Study: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
  Finance: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
  Lifestyle: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
};

export function UserManagementPage() {
  const [users, setUsers] = useState(managedUsers);
  const [filter, setFilter] = useState<UserFilter>("all");
  const [selectedUserId, setSelectedUserId] = useState<string>(managedUsers[0]?.id ?? "");

  const filteredUsers = useMemo(() => {
    if (filter === "all") return users;
    return users.filter((user) => user.status === filter);
  }, [filter, users]);

  const selectedUser = users.find((user) => user.id === selectedUserId) ?? users[0];

  const setUserStatus = (status: "active" | "visitor" | "suspended") => {
    if (!selectedUser) return;
    setUsers((prev) =>
      prev.map((candidate) => (candidate.id === selectedUser.id ? { ...candidate, status } : candidate)),
    );
  };

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="mt-2 text-sm text-muted-foreground">User table, segment filters, and side panel actions.</p>
      </header>

      <div className="grid gap-4 xl:grid-cols-[2.1fr_1fr]">
        <article className="rounded-xl bg-card p-6 shadow-card">
          <div className="flex flex-wrap items-center gap-2">
            {filters.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => setFilter(option.key)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition ${filter === option.key
                    ? "bg-primary text-primary-foreground"
                    : "bg-background text-muted-foreground hover:bg-muted"
                  }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[860px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-foreground font-medium">
                  <th className="pb-2">User</th>
                  <th className="pb-2">Plan</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2">Fav Category</th>
                  <th className="pb-2">Last Login</th>
                  <th className="pb-2">Quota</th>
                  <th className="pb-2">Purchases</th>
                  <th className="pb-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-border/70 last:border-none">
                    <td className="py-3">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.id}</p>
                    </td>
                    <td className="py-3">{user.plan}</td>
                    <td className="py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${user.status === "active"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300"
                            : user.status === "visitor"
                              ? "bg-sky-100 text-sky-700 dark:bg-sky-900/60 dark:text-sky-300"
                              : "bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300"
                          }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${categoryStyles[user.favoriteCategory] ?? "bg-muted text-muted-foreground"
                          }`}
                      >
                        {user.favoriteCategory}
                      </span>
                    </td>
                    <td className="py-3">{user.lastLogin}</td>
                    <td className="py-3">{user.quotaRemaining}</td>
                    <td className="py-3">{user.purchases}</td>
                    <td className="py-3">
                      <button
                        type="button"
                        onClick={() => setSelectedUserId(user.id)}
                        className="rounded-md bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground transition hover:bg-accent"
                      >
                        View details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="rounded-xl bg-card p-6 shadow-card">
          <h2 className="text-lg font-semibold">User Side Panel</h2>
          <p className="text-sm text-muted-foreground">Latest login, quota remaining, and quick moderation.</p>
          {selectedUser ? (
            <div className="mt-4 space-y-3">
              <div className="rounded-lg bg-background p-3">
                <p className="text-sm font-semibold">{selectedUser.name}</p>
                <p className="text-xs text-muted-foreground">{selectedUser.id}</p>
              </div>
              <div className="rounded-lg bg-background p-3 text-sm">
                <p>Last Login: {selectedUser.lastLogin}</p>
                <p>Quota Remaining: {selectedUser.quotaRemaining}</p>
                <p>Purchase History: {selectedUser.purchases} item(s)</p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setUserStatus("visitor")}
                  className="rounded-md bg-amber-500/15 px-2 py-1 text-xs font-semibold text-amber-600 transition hover:bg-amber-500 hover:text-white"
                >
                  Warn
                </button>
                <button
                  type="button"
                  onClick={() => setUserStatus("suspended")}
                  className="rounded-md bg-rose-500/15 px-2 py-1 text-xs font-semibold text-rose-600 transition hover:bg-rose-500 hover:text-white"
                >
                  Suspend
                </button>
                <button
                  type="button"
                  onClick={() => setUserStatus("active")}
                  className="rounded-md bg-slate-500/20 px-2 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-500 hover:text-white dark:text-slate-300"
                >
                  Temp Ban
                </button>
              </div>
            </div>
          ) : null}
        </article>
      </div>
    </section>
  );
}

