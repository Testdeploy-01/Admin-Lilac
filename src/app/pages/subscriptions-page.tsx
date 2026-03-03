import { useState } from "react";
import { plusFeatures, pricingTiers, subscriptionAnalytics } from "../../mocks/dashboard-features.mock";

export function SubscriptionsPage() {
  const [tiers, setTiers] = useState(pricingTiers);
  const [features, setFeatures] = useState(plusFeatures);
  const [trialDays, setTrialDays] = useState("7");
  const [monthlyTokens, setMonthlyTokens] = useState("20000");
  const [rollover, setRollover] = useState("No rollover");
  const [savedAt, setSavedAt] = useState("Not saved yet");

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Subscriptions Plan Setup</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sales analytics, pricing tiers, global allowances, and PLUS+ feature builder.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {subscriptionAnalytics.map((item) => (
          <article key={item.label} className="rounded-xl bg-card p-5 shadow-card">
            <p className="text-sm text-muted-foreground">{item.label}</p>
            <p className="mt-3 text-2xl font-bold">{item.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{item.note}</p>
          </article>
        ))}
      </div>

      <article className="rounded-xl bg-card p-6 shadow-card">
        <h2 className="text-lg font-semibold">Pricing Tier Configuration</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          {tiers.map((tier) => (
            <div key={tier.id} className="rounded-lg bg-background p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm text-muted-foreground">{tier.cycle}</p>
                  <p className="text-base font-semibold">{tier.name}</p>
                </div>
                <span className="rounded-full bg-muted px-2 py-1 text-xs font-semibold">{tier.badge}</span>
              </div>
              <p className="mt-3 text-2xl font-bold">{tier.price}</p>
              <button
                type="button"
                onClick={() =>
                  setTiers((prev) =>
                    prev.map((candidate) => ({
                      ...candidate,
                      highlighted: candidate.id === tier.id,
                    })),
                  )
                }
                className={`mt-3 rounded-md px-3 py-1 text-xs font-semibold ${
                  tier.highlighted
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-accent"
                }`}
              >
                {tier.highlighted ? "Highlighted Plan" : "Set Highlight"}
              </button>
            </div>
          ))}
        </div>
      </article>

      <div className="grid gap-4 lg:grid-cols-[1fr_1.4fr]">
        <article className="rounded-xl bg-card p-6 shadow-card">
          <h2 className="text-lg font-semibold">Global Allowances</h2>
          <div className="mt-4 space-y-3 text-sm">
            <label className="block">
              <span className="text-muted-foreground">Free Trial Days</span>
              <input
                value={trialDays}
                onChange={(event) => setTrialDays(event.target.value)}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
              />
            </label>
            <label className="block">
              <span className="text-muted-foreground">Monthly Free Tokens</span>
              <input
                value={monthlyTokens}
                onChange={(event) => setMonthlyTokens(event.target.value)}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
              />
            </label>
            <label className="block">
              <span className="text-muted-foreground">Token Rollover Policy</span>
              <select
                value={rollover}
                onChange={(event) => setRollover(event.target.value)}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
              >
                <option>No rollover</option>
                <option>Carry 25%</option>
                <option>Carry 50%</option>
              </select>
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setSavedAt(new Date().toLocaleString())}
                className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
              >
                Save Global Config (Mock)
              </button>
              <p className="text-xs text-muted-foreground">Last saved: {savedAt}</p>
            </div>
          </div>
        </article>

        <article className="rounded-xl bg-card p-6 shadow-card">
          <h2 className="text-lg font-semibold">PLUS+ Features Builder</h2>
          <p className="text-sm text-muted-foreground">Toggle feature visibility for in-app promotion blocks.</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Visible features: {features.filter((feature) => feature.visible).length} / {features.length}
          </p>
          <div className="mt-4 space-y-3">
            {features.map((feature) => (
              <div
                key={feature.id}
                className="flex flex-col gap-3 rounded-lg bg-background p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-semibold">{feature.title}</p>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setFeatures((prev) =>
                      prev.map((candidate) =>
                        candidate.id === feature.id ? { ...candidate, visible: !candidate.visible } : candidate,
                      ),
                    )
                  }
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    feature.visible
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {feature.visible ? "Visible" : "Hidden"}
                </button>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}

