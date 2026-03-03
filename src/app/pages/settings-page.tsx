import { useMemo, useState } from "react";
import {
  adminRoles,
  defaultApiSettings,
  defaultSystemPolicy,
  defaultSystemSettings,
  type SystemPolicyConfig,
} from "../../mocks/dashboard-features.mock";

type GeneralSettings = typeof defaultSystemSettings;
type ApiSettings = typeof defaultApiSettings;

const initialGeneral: GeneralSettings = { ...defaultSystemSettings };
const initialApi: ApiSettings = { ...defaultApiSettings };
const initialPolicy: SystemPolicyConfig = { ...defaultSystemPolicy };

export function SettingsPage() {
  const [general, setGeneral] = useState<GeneralSettings>(initialGeneral);
  const [apiSettings, setApiSettings] = useState<ApiSettings>(initialApi);
  const [policy, setPolicy] = useState<SystemPolicyConfig>(initialPolicy);
  const [showApiKey, setShowApiKey] = useState(false);
  const [savedAt, setSavedAt] = useState("ยังไม่บันทึก");

  const dirty = useMemo(() => {
    return (
      JSON.stringify(general) !== JSON.stringify(initialGeneral) ||
      JSON.stringify(apiSettings) !== JSON.stringify(initialApi) ||
      JSON.stringify(policy) !== JSON.stringify(initialPolicy)
    );
  }, [apiSettings, general, policy]);

  const onSave = () => {
    Object.assign(initialGeneral, general);
    Object.assign(initialApi, apiSettings);
    Object.assign(initialPolicy, policy);
    setSavedAt(new Date().toLocaleString());
  };

  const onDiscard = () => {
    setGeneral({ ...initialGeneral });
    setApiSettings({ ...initialApi });
    setPolicy({ ...initialPolicy });
  };

  return (
    <section className="space-y-6 pb-24">
      <header>
        <h2 className="text-2xl font-bold tracking-tight">ตั้งค่าระบบ</h2>
        <p className="mt-1 text-sm text-muted-foreground">ปรับจูนโครงสร้างระบบ, API/AI และนโยบายความปลอดภัย</p>
      </header>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
        <article className="rounded-xl bg-card p-6 shadow-card">
          <h3 className="text-base font-semibold">General Settings</h3>
          <div className="mt-4 space-y-3 text-sm">
            <label className="block">
              <span className="text-muted-foreground">ชื่อโครงการ</span>
              <input
                value={general.projectName}
                onChange={(event) => setGeneral((prev) => ({ ...prev, projectName: event.target.value }))}
                aria-label="ชื่อโครงการ"
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
              />
            </label>
            <label className="block">
              <span className="text-muted-foreground">Base URL</span>
              <input
                value={general.baseUrl}
                onChange={(event) => setGeneral((prev) => ({ ...prev, baseUrl: event.target.value }))}
                aria-label="Base URL"
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
              />
            </label>
            <label className="block">
              <span className="text-muted-foreground">Support Email</span>
              <input
                value={general.supportEmail}
                onChange={(event) => setGeneral((prev) => ({ ...prev, supportEmail: event.target.value }))}
                aria-label="Support Email"
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
              />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="text-muted-foreground">Timezone</span>
                <select
                  value={general.timezone}
                  onChange={(event) => setGeneral((prev) => ({ ...prev, timezone: event.target.value }))}
                  aria-label="Timezone"
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
                >
                  <option>Asia/Bangkok</option>
                  <option>UTC</option>
                  <option>America/New_York</option>
                </select>
              </label>
              <label className="block">
                <span className="text-muted-foreground">แจ้งเตือน error เข้าอีเมลแอดมิน</span>
                <select
                  value={general.adminErrorEmail ? "เปิด" : "ปิด"}
                  onChange={(event) =>
                    setGeneral((prev) => ({ ...prev, adminErrorEmail: event.target.value === "เปิด" }))
                  }
                  aria-label="แจ้งเตือน Error เข้าอีเมลแอดมิน"
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
                >
                  <option>เปิด</option>
                  <option>ปิด</option>
                </select>
              </label>
            </div>
          </div>
        </article>

        <article className="rounded-xl bg-card p-6 shadow-card">
          <h3 className="text-base font-semibold">API / AI Settings</h3>
          <div className="mt-4 space-y-3 text-sm">
            <label className="block">
              <span className="text-muted-foreground">Anthropic API Key</span>
              <div className="mt-1 flex gap-2">
                <input
                  type={showApiKey ? "text" : "password"}
                  value={apiSettings.anthropicKey}
                  onChange={(event) => setApiSettings((prev) => ({ ...prev, anthropicKey: event.target.value }))}
                  aria-label="Anthropic API Key"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey((current) => !current)}
                  className="rounded-md border border-input px-3 py-2 text-xs font-semibold"
                >
                  {showApiKey ? "ซ่อน" : "แสดง"}
                </button>
              </div>
            </label>
            <label className="block">
              <span className="text-muted-foreground">Default fallback model</span>
              <select
                value={apiSettings.defaultModel}
                onChange={(event) => setApiSettings((prev) => ({ ...prev, defaultModel: event.target.value }))}
                aria-label="Default fallback model"
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
              >
                <option value="claude-haiku-4">claude-haiku-4</option>
                <option value="claude-sonnet-4">claude-sonnet-4</option>
                <option value="claude-opus-4">claude-opus-4</option>
              </select>
            </label>

            <div className="rounded-lg border border-border bg-background p-3">
              <p className="text-sm font-semibold">Safety</p>
              <div className="mt-3 space-y-2 text-sm">
                <label className="flex items-center justify-between gap-2">
                  <span>NSFW Check</span>
                  <button
                    type="button"
                    onClick={() => setPolicy((prev) => ({ ...prev, nsfwCheck: !prev.nsfwCheck }))}
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      policy.nsfwCheck ? "bg-emerald-600 text-white" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {policy.nsfwCheck ? "เปิด" : "ปิด"}
                  </button>
                </label>
                <label className="flex items-center justify-between gap-2">
                  <span>Auto-Suspend 150%</span>
                  <button
                    type="button"
                    onClick={() => setPolicy((prev) => ({ ...prev, autoSuspend150: !prev.autoSuspend150 }))}
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      policy.autoSuspend150 ? "bg-emerald-600 text-white" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {policy.autoSuspend150 ? "เปิด" : "ปิด"}
                  </button>
                </label>
              </div>
            </div>
          </div>
        </article>
      </div>

      <article className="rounded-xl bg-card p-6 shadow-card">
        <h3 className="text-base font-semibold">Admin Access Controller</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[620px] text-sm">
            <caption className="sr-only">ตารางสิทธิ์การเข้าถึงระบบของผู้ดูแลแต่ละบทบาท</caption>
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th scope="col" className="pb-2">Role</th>
                <th scope="col" className="pb-2">Access Scope</th>
                <th scope="col" className="pb-2">Assigned Users</th>
              </tr>
            </thead>
            <tbody>
              {adminRoles.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-sm text-muted-foreground">
                    ไม่พบบทบาทผู้ดูแลระบบ
                  </td>
                </tr>
              ) : (
                adminRoles.map((role) => (
                  <tr key={role.role} className="border-b border-border/70 last:border-none">
                    <td className="py-3 font-semibold">{role.role}</td>
                    <td className="py-3">{role.access}</td>
                    <td className="py-3">{role.users}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </article>

      {dirty ? (
        <div className="fixed inset-x-0 bottom-20 z-40 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between rounded-xl border border-border bg-card px-4 py-3 shadow-xl">
            <p className="text-sm text-muted-foreground">มีการเปลี่ยนแปลงที่ยังไม่บันทึก</p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onDiscard}
                className="rounded-md border border-input px-3 py-1.5 text-xs font-semibold"
              >
                ละทิ้ง
              </button>
              <button
                type="button"
                onClick={onSave}
                className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
              >
                บันทึก
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">บันทึกล่าสุด: {savedAt}</p>
      )}
    </section>
  );
}

