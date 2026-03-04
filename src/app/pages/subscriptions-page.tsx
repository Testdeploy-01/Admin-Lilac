import { useMemo, useState } from "react";
import { downloadText } from "../../lib/exporters";
import { formatCurrencyTHB } from "../../lib/formatters";
import { invoices, plusFeatures, subscriptionOverviewKpis, subscriptionPlans } from "../../mocks/dashboard-features.mock";


type TabKey = "overview" | "plans" | "invoices";

export function SubscriptionsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [plans, setPlans] = useState(subscriptionPlans);
  const [features, setFeatures] = useState(plusFeatures);
  const [trialDays, setTrialDays] = useState("7");
  const [starterTokens, setStarterTokens] = useState("20000");
  const [savedAt, setSavedAt] = useState("ยังไม่บันทึก");

  const visibleFeatures = useMemo(() => features.filter((feature) => feature.visible).length, [features]);

  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold tracking-tight">สมาชิก / แพ็กเกจ</h2>
        <p className="mt-1 text-sm text-muted-foreground">จัดการข้อมูลธุรกิจ Subscription ทั้งภาพรวม แพ็กเกจ และใบแจ้งหนี้</p>
      </header>

      <div className="inline-flex rounded-lg border border-border bg-card p-1">
        <button
          type="button"
          onClick={() => setActiveTab("overview")}
          aria-pressed={activeTab === "overview"}
          className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${activeTab === "overview" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"
            }`}
        >
          ภาพรวม
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("plans")}
          aria-pressed={activeTab === "plans"}
          className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${activeTab === "plans" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"
            }`}
        >
          แพ็กเกจ
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("invoices")}
          aria-pressed={activeTab === "invoices"}
          className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${activeTab === "invoices" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"
            }`}
        >
          ใบแจ้งหนี้
        </button>
      </div>

      {activeTab === "overview" ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {subscriptionOverviewKpis.map((item) => {
            return (
              <article key={item.label} className="kpi-card">
                <div className="kpi-card-inner flex flex-col justify-center">
                  <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                  <p className="mt-2 text-3xl font-bold tracking-tight">{item.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{item.note}</p>
                </div>
              </article>
            );
          })}
        </div>
      ) : null}

      {activeTab === "plans" ? (
        <>
          <article className="rounded-xl bg-card p-6 shadow-card">
            <h3 className="text-base font-semibold">Pricing Configuration</h3>
            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              {plans.map((plan) => (
                <div key={plan.id} className="rounded-xl border border-border bg-background p-6">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-primary">{plan.cycle}</p>
                      <p className="mt-1 text-lg font-bold">{plan.name}</p>
                    </div>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold text-primary">{plan.badge}</span>
                  </div>
                  <div className="mt-5">
                    <p className="text-3xl font-black">{formatCurrencyTHB(plan.priceTHB)}</p>
                    <p className="mt-1 text-sm text-muted-foreground">อายุแพ็กเกจ {plan.durationDays} วัน</p>
                  </div>
                  <div className="mt-6 border-t border-border pt-5">
                    <button
                      type="button"
                      onClick={() =>
                        setPlans((prev) => prev.map((row) => (row.id === plan.id ? { ...row, active: !row.active } : row)))
                      }
                      className={`w-full rounded-lg px-4 py-2.5 text-sm font-bold transition-all ${plan.active
                        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700"
                        : "bg-muted text-muted-foreground hover:bg-accent"
                        }`}
                    >
                      {plan.active ? "เปิดใช้งานอยู่" : "คลิกเพื่อเปิดใช้งาน"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
            <article className="rounded-xl bg-card p-6 shadow-card">
              <h3 className="text-base font-semibold">ตั้งค่าส่วนกลาง</h3>
              <div className="mt-4 space-y-3 text-sm">
                <label className="block">
                  <span className="text-muted-foreground">Free Trial (วัน)</span>
                  <input
                    value={trialDays}
                    onChange={(event) => setTrialDays(event.target.value)}
                    aria-label="จำนวนวันทดลองใช้งาน"
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
                  />
                </label>
                <label className="block">
                  <span className="text-muted-foreground">โทเคนเริ่มต้นผู้ใช้ใหม่</span>
                  <input
                    value={starterTokens}
                    onChange={(event) => setStarterTokens(event.target.value)}
                    aria-label="โทเคนเริ่มต้นผู้ใช้ใหม่"
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => setSavedAt(new Date().toLocaleString())}
                  className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                >
                  บันทึกการตั้งค่า
                </button>
                <p className="text-xs text-muted-foreground">อัปเดตล่าสุด: {savedAt}</p>
              </div>
            </article>

            <article className="rounded-xl bg-card p-6 shadow-card">
              <h3 className="text-base font-semibold">ตั้งค่าสิทธิพิเศษ PLUS+</h3>
              <p className="text-sm text-muted-foreground">
                ฟีเจอร์ที่เปิดแสดงอยู่ {visibleFeatures} / {features.length}
              </p>
              <div className="mt-4 space-y-3">
                {features.map((feature) => (
                  <div key={feature.id} className="flex items-center justify-between gap-3 rounded-lg bg-background p-3">
                    <div>
                      <p className="text-sm font-semibold">{feature.title}</p>
                      <p className="text-xs text-muted-foreground">{feature.description}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setFeatures((prev) =>
                          prev.map((row) => (row.id === feature.id ? { ...row, visible: !row.visible } : row)),
                        )
                      }
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${feature.visible
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
        </>
      ) : null}

      {activeTab === "invoices" ? (
        <article className="rounded-xl bg-card p-6 shadow-card">
          <h3 className="text-base font-semibold">Invoices / Statement</h3>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[860px] text-sm">
              <caption className="sr-only">ตารางใบแจ้งหนี้สมาชิกและปุ่มดาวน์โหลด statement</caption>
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th scope="col" className="pb-2">เลขที่ใบแจ้งหนี้</th>
                  <th scope="col" className="pb-2">ผู้ใช้</th>
                  <th scope="col" className="pb-2">แพ็กเกจ</th>
                  <th scope="col" className="pb-2">จำนวนเงิน</th>
                  <th scope="col" className="pb-2">วันที่ออก</th>
                  <th scope="col" className="pb-2">สถานะ</th>
                  <th scope="col" className="pb-2">ดาวน์โหลด</th>
                </tr>
              </thead>
              <tbody>
                {invoices.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-sm text-muted-foreground">
                      ไม่พบใบแจ้งหนี้ในระบบ
                    </td>
                  </tr>
                ) : (
                  invoices.map((invoice) => (
                    <tr key={invoice.invoice} className="border-b border-border/70 last:border-none">
                      <td className="py-3 font-medium">{invoice.invoice}</td>
                      <td className="py-3">{invoice.user}</td>
                      <td className="py-3">{invoice.plan}</td>
                      <td className="py-3">{formatCurrencyTHB(invoice.amountTHB)}</td>
                      <td className="py-3">{invoice.issuedAt}</td>
                      <td className="py-3">{invoice.status}</td>
                      <td className="py-3">
                        <button
                          type="button"
                          onClick={() =>
                            downloadText(
                              invoice.invoice,
                              JSON.stringify(invoice, null, 2),
                              "json",
                            )
                          }
                          className="rounded-md bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground hover:bg-accent"
                        >
                          Statement
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </article>
      ) : null}
    </section>
  );
}

