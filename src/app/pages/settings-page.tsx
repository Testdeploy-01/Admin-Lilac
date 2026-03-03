import { useState } from "react";
import { adminRoles } from "../../mocks/dashboard-features.mock";

export function SettingsPage() {
  const [systemName, setSystemName] = useState("Lilac Admin Platform");
  const [organization, setOrganization] = useState("Lilac Education Co., Ltd.");
  const [supportEmail, setSupportEmail] = useState("support@lilac.mock");
  const [timezone, setTimezone] = useState("Asia/Bangkok");
  const [language, setLanguage] = useState("English");
  const [roles, setRoles] = useState(adminRoles);
  const [lastSaved, setLastSaved] = useState("Not saved yet");

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
        <p className="mt-2 text-sm text-muted-foreground">Organization profile and admin access controller.</p>
      </header>

      <div className="grid gap-4 xl:grid-cols-[1fr_1.2fr]">
        <article className="h-full rounded-xl bg-card p-6 shadow-card">
          <h2 className="text-lg font-semibold">Profile Settings</h2>
          <div className="mt-4 space-y-3 text-sm">
            <label className="block">
              <span className="text-muted-foreground">System Name</span>
              <input
                value={systemName}
                onChange={(event) => setSystemName(event.target.value)}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
              />
            </label>
            <label className="block">
              <span className="text-muted-foreground">Organization</span>
              <input
                value={organization}
                onChange={(event) => setOrganization(event.target.value)}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
              />
            </label>
            <label className="block">
              <span className="text-muted-foreground">Support Email</span>
              <input
                value={supportEmail}
                onChange={(event) => setSupportEmail(event.target.value)}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
              />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="text-muted-foreground">Timezone</span>
                <select
                  value={timezone}
                  onChange={(event) => setTimezone(event.target.value)}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
                >
                  <option>Asia/Bangkok</option>
                  <option>UTC</option>
                  <option>America/New_York</option>
                </select>
              </label>
              <label className="block">
                <span className="text-muted-foreground">Language</span>
                <select
                  value={language}
                  onChange={(event) => setLanguage(event.target.value)}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
                >
                  <option>English</option>
                  <option>Thai</option>
                </select>
              </label>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setLastSaved(new Date().toLocaleString())}
                className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
              >
                Save Settings (Mock)
              </button>
              <p className="text-xs text-muted-foreground">Last saved: {lastSaved}</p>
            </div>
          </div>
        </article>

        <article className="h-full rounded-xl bg-card p-6 shadow-card">
          <h2 className="text-lg font-semibold">Admin Access Controller</h2>
          <p className="text-sm text-muted-foreground">Permission tier overview for internal admin team.</p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[620px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-foreground font-medium">
                  <th className="pb-2">Role</th>
                  <th className="pb-2">Access Scope</th>
                  <th className="pb-2">Assigned Users</th>
                  <th className="pb-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((role) => (
                  <tr key={role.role} className="border-b border-border/70 last:border-none">
                    <td className="py-3 font-semibold">{role.role}</td>
                    <td className="py-3">{role.access}</td>
                    <td className="py-3">{role.users}</td>
                    <td className="py-3">
                      <button
                        type="button"
                        onClick={() =>
                          setRoles((prev) =>
                            prev.map((candidate) =>
                              candidate.role === role.role ? { ...candidate, users: candidate.users + 1 } : candidate,
                            ),
                          )
                        }
                        className="rounded-md bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground hover:bg-accent"
                      >
                        Add User (Mock)
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </div>
    </section>
  );
}
