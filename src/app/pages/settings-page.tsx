import { useState } from "react";
import { DashboardPageShell } from "@/components/dashboard/ui/dashboard-page-shell";
import { AppTabs } from "@/components/dashboard/ui/app-tabs";
import { DataTableShell } from "@/components/dashboard/ui/data-table-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  adminAccounts,
  adminRoles,
  auditLog,
  defaultApiSettings,
  defaultSystemPolicy,
  defaultSystemSettings,
  featureFlags,
  planPricingSettings,
  plusFeatures,
  subscriptionPlans,
  type AdminAccount,
  type FeatureFlag,
} from "../../mocks/dashboard-features.mock";
import { formatCurrencyTHB } from "../../lib/formatters";

type TabKey = "admins" | "features" | "logs" | "api" | "plans";

export function SettingsPage() {
  const [tab, setTab] = useState<TabKey>("admins");
  const [flags, setFlags] = useState<FeatureFlag[]>(featureFlags);
  const [admins, setAdmins] = useState<AdminAccount[]>(adminAccounts);
  const [sysSettings, setSysSettings] = useState(defaultSystemSettings);
  const [apiSettings, setApiSettings] = useState(defaultApiSettings);
  const [policy, setPolicy] = useState(defaultSystemPolicy);
  const [plans, setPlans] = useState(subscriptionPlans);
  const [features, setFeatures] = useState(plusFeatures);
  const [savedAt, setSavedAt] = useState("ยังไม่บันทึก");
  const [trialDays, setTrialDays] = useState(String(planPricingSettings.freeTrialDays));
  const [freeDailyAiLimit, setFreeDailyAiLimit] = useState(String(planPricingSettings.freeDailyAiLimit));

  const handleSave = () => setSavedAt(new Date().toLocaleString("th-TH"));

  return (
    <DashboardPageShell title="ตั้งค่าระบบ" description="จัดการผู้ดูแล ฟีเจอร์ ระบบ API และแพ็กเกจราคา">
      <AppTabs
        value={tab}
        onValueChange={(value) => setTab(value as TabKey)}
        items={[
          { value: "admins", label: "ผู้ดูแลและสิทธิ์" },
          { value: "features", label: "เปิด/ปิดฟีเจอร์" },
          { value: "logs", label: "บันทึกการใช้งาน" },
          { value: "api", label: "ตั้งค่า API" },
          { value: "plans", label: "แพ็กเกจและราคา" },
        ]}
      />

      {tab === "admins" ? (
        <>
          <DataTableShell
            caption="ตารางรายชื่อ Admin และ Role"
            minWidthClass="min-w-[700px]"
            toolbar={
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold">บัญชีผู้ดูแล</h3>
                <Button
                  size="sm"
                  onClick={() => {
                    const name = prompt("ชื่อ Admin ใหม่:");
                    const email = prompt("อีเมล:");
                    const role = prompt("ตำแหน่ง (Super Admin / Admin / Finance / Support / Marketing):");
                    if (name && email && role) {
                      setAdmins((prev) => [
                        ...prev,
                        {
                          id: `ADM-${String(prev.length + 1).padStart(2, "0")}`,
                          name,
                          email,
                          role,
                          lastLogin: "-",
                          avatar: `https://ui.shadcn.com/avatars/0${(prev.length % 6) + 1}.png`,
                        },
                      ]);
                    }
                  }}
                >
                  + เพิ่มผู้ดูแล
                </Button>
              </div>
            }
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ผู้ดูแล</TableHead>
                  <TableHead>อีเมล</TableHead>
                  <TableHead>ตำแหน่ง</TableHead>
                  <TableHead>เข้าใช้ล่าสุด</TableHead>
                  <TableHead>จัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <img src={admin.avatar} alt={admin.name} className="h-8 w-8 rounded-full border border-border" />
                        <span className="font-medium">{admin.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{admin.email}</TableCell>
                    <TableCell>
                      <Badge className="bg-primary/10 text-primary">{admin.role}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{admin.lastLogin}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="destructive" onClick={() => setAdmins((prev) => prev.filter((item) => item.id !== admin.id))}>
                        ลบ
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </DataTableShell>

          <DataTableShell caption="ตาราง Roles และสิทธิ์การเข้าถึง" minWidthClass="min-w-[500px]">
            <div className="mb-3">
              <h3 className="text-base font-semibold">ตำแหน่งและสิทธิ์การเข้าถึง</h3>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ตำแหน่ง</TableHead>
                  <TableHead>สิทธิ์</TableHead>
                  <TableHead>จำนวนคน</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {adminRoles.map((role) => (
                  <TableRow key={role.role}>
                    <TableCell className="font-semibold">{role.role}</TableCell>
                    <TableCell className="text-muted-foreground">{role.access}</TableCell>
                    <TableCell>{role.users}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </DataTableShell>
        </>
      ) : null}

      {tab === "features" ? (
        <article className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-base font-semibold">เปิด/ปิดฟีเจอร์</h3>
          <p className="text-sm text-muted-foreground">เปิด/ปิดฟีเจอร์ พร้อมตั้ง % rollout และกลุ่มเป้าหมาย</p>
          <div className="mt-4 space-y-4">
            {flags.map((flag) => (
              <div key={flag.id} className="rounded-xl border border-border bg-background p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{flag.name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{flag.description}</p>
                    <p className="mt-1 text-xs text-muted-foreground">กลุ่ม: {flag.targetGroup}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-muted-foreground">เปิดให้ใช้ %</label>
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        value={flag.rolloutPercent}
                        onChange={(event) =>
                          setFlags((prev) => prev.map((item) => (item.id === flag.id ? { ...item, rolloutPercent: Number(event.target.value) } : item)))
                        }
                        className="w-20 text-center"
                      />
                    </div>
                    <Switch
                      checked={flag.enabled}
                      onCheckedChange={(checked) => setFlags((prev) => prev.map((item) => (item.id === flag.id ? { ...item, enabled: checked } : item)))}
                    />
                  </div>
                </div>
                {flag.enabled ? (
                  <div className="mt-3 h-2 rounded-full bg-muted">
                    <div className="h-2 rounded-full bg-emerald-500 transition-all" style={{ width: `${flag.rolloutPercent}%` }} />
                  </div>
                ) : null}
              </div>
            ))}
          </div>
          <Button className="mt-4" onClick={handleSave}>
            บันทึกการตั้งค่าฟีเจอร์
          </Button>
          <p className="mt-2 text-xs text-muted-foreground">อัปเดตล่าสุด: {savedAt}</p>
        </article>
      ) : null}

      {tab === "logs" ? (
        <DataTableShell caption="ตาราง Audit Log บันทึกการกระทำของ Admin" minWidthClass="min-w-[900px]">
          <div className="mb-3">
            <h3 className="text-base font-semibold">บันทึกการใช้งาน</h3>
            <p className="text-sm text-muted-foreground">ทุกการกระทำของผู้ดูแลจะถูกบันทึกไว้ที่นี่</p>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>เวลา</TableHead>
                <TableHead>ผู้ดูแล</TableHead>
                <TableHead>การกระทำ</TableHead>
                <TableHead>เป้าหมาย</TableHead>
                <TableHead>ก่อน</TableHead>
                <TableHead>หลัง</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditLog.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="text-muted-foreground">{entry.timestamp}</TableCell>
                  <TableCell className="font-medium">{entry.adminName}</TableCell>
                  <TableCell>{entry.action}</TableCell>
                  <TableCell><Badge variant="secondary">{entry.target}</Badge></TableCell>
                  <TableCell className="text-rose-600 dark:text-rose-400">{entry.before}</TableCell>
                  <TableCell className="text-emerald-600 dark:text-emerald-400">{entry.after}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DataTableShell>
      ) : null}

      {tab === "api" ? (
        <article className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-base font-semibold">ตั้งค่า API และการเชื่อมต่อ</h3>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <div className="space-y-4">
              <h4 className="text-sm font-semibold uppercase text-muted-foreground">ตั้งค่าทั่วไป</h4>
              <div>
                <p className="mb-1 text-sm text-muted-foreground">ชื่อโปรเจค</p>
                <Input value={sysSettings.projectName} onChange={(event) => setSysSettings({ ...sysSettings, projectName: event.target.value })} />
              </div>
              <div>
                <p className="mb-1 text-sm text-muted-foreground">Base URL</p>
                <Input value={sysSettings.baseUrl} onChange={(event) => setSysSettings({ ...sysSettings, baseUrl: event.target.value })} />
              </div>
              <div>
                <p className="mb-1 text-sm text-muted-foreground">Support Email</p>
                <Input value={sysSettings.supportEmail} onChange={(event) => setSysSettings({ ...sysSettings, supportEmail: event.target.value })} />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold uppercase text-muted-foreground">ตั้งค่า AI</h4>
              <div>
                <p className="mb-1 text-sm text-muted-foreground">Anthropic API Key</p>
                <Input type="password" value={apiSettings.anthropicKey} onChange={(event) => setApiSettings({ ...apiSettings, anthropicKey: event.target.value })} />
              </div>
              <div>
                <p className="mb-1 text-sm text-muted-foreground">โมเดลหลัก</p>
                <Input value={apiSettings.defaultModel} onChange={(event) => setApiSettings({ ...apiSettings, defaultModel: event.target.value })} />
              </div>
              <div>
                <p className="mb-1 text-sm text-muted-foreground">จำกัดการเรียกต่อผู้ใช้ (ครั้ง/วัน)</p>
                <Input type="number" value={apiSettings.rateLimitPerUser} onChange={(event) => setApiSettings({ ...apiSettings, rateLimitPerUser: Number(event.target.value) })} />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold uppercase text-muted-foreground">การตั้งค่าวิดเจ็ต (Widget)</h4>
              <div>
                <p className="mb-1 text-sm text-muted-foreground">ความถี่ในการอัปเดตข้อมูล (นาที)</p>
                <Input
                  type="number"
                  step={0.1}
                  min={0}
                  max={1}
                  value={apiSettings.wakeWordSensitivity}
                  onChange={(event) => setApiSettings({ ...apiSettings, wakeWordSensitivity: Number(event.target.value) })}
                />
              </div>
              <div>
                <p className="mb-1 text-sm text-muted-foreground">Cache Timeout (วินาที)</p>
                <Input type="number" value={apiSettings.voiceTimeout} onChange={(event) => setApiSettings({ ...apiSettings, voiceTimeout: Number(event.target.value) })} />
              </div>
              <div>
                <p className="mb-1 text-sm text-muted-foreground">เมื่อวิดเจ็ตโหลดไม่สำเร็จ</p>
                <Select value={apiSettings.voiceFallbackBehavior} onValueChange={(value) => setApiSettings({ ...apiSettings, voiceFallbackBehavior: value })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text-input">แสดงข้อมูลล่าสุด</SelectItem>
                    <SelectItem value="retry">ลองโหลดใหม่อัตโนมัติ</SelectItem>
                    <SelectItem value="error-message">แสดงข้อความผิดพลาด</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold uppercase text-muted-foreground">นโยบายความปลอดภัยเนื้อหา</h4>
              <div className="flex items-center gap-3">
                <Checkbox checked={policy.nsfwCheck} onCheckedChange={(checked) => setPolicy({ ...policy, nsfwCheck: Boolean(checked) })} />
                <span className="text-sm">เปิดตัวกรองเนื้อหาไม่เหมาะสม</span>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox checked={policy.autoSuspend150} onCheckedChange={(checked) => setPolicy({ ...policy, autoSuspend150: Boolean(checked) })} />
                <span className="text-sm">ระงับบัญชีอัตโนมัติเมื่อใช้เกิน 150%</span>
              </div>
              <div>
                <p className="mb-1 text-sm text-muted-foreground">Webhook URL (Payment)</p>
                <Input value={apiSettings.webhookUrl} onChange={(event) => setApiSettings({ ...apiSettings, webhookUrl: event.target.value })} />
              </div>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-3">
            <Button onClick={handleSave}>บันทึก</Button>
            <p className="text-xs text-muted-foreground">อัปเดตล่าสุด: {savedAt}</p>
          </div>
        </article>
      ) : null}

      {tab === "plans" ? (
        <>
          <article className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-base font-semibold">ตั้งค่าราคาแพ็กเกจ</h3>
            <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {plans.map((plan) => (
                <div key={plan.id} className="rounded-xl border border-border bg-background p-6">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-primary">{plan.cycle}</p>
                      <p className="mt-1 text-lg font-bold">{plan.name}</p>
                    </div>
                    <Badge className="bg-primary/10 text-primary">{plan.badge}</Badge>
                  </div>
                  <div className="mt-5">
                    <p className="text-3xl font-black">{formatCurrencyTHB(plan.priceTHB)}</p>
                    <p className="mt-1 text-sm text-muted-foreground">อายุแพ็กเกจ {plan.durationDays} วัน</p>
                  </div>
                  <div className="mt-6 border-t border-border pt-5">
                    <Button
                      className="w-full"
                      variant={plan.active ? "default" : "secondary"}
                      onClick={() => setPlans((prev) => prev.map((row) => (row.id === plan.id ? { ...row, active: !row.active } : row)))}
                    >
                      {plan.active ? "เปิดใช้งานอยู่" : "คลิกเพื่อเปิดใช้งาน"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
            <article className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h3 className="text-base font-semibold">ตั้งค่าส่วนกลาง</h3>
              <div className="mt-4 space-y-3 text-sm">
                <div>
                  <p className="mb-1 text-muted-foreground">ทดลองใช้ฟรี (วัน)</p>
                  <Input value={trialDays} onChange={(event) => setTrialDays(event.target.value)} />
                </div>
                <div>
                  <p className="mb-1 text-muted-foreground">จำกัด AI ต่อวัน สำหรับ FREE (ครั้ง/วัน)</p>
                  <Input value={freeDailyAiLimit} onChange={(event) => setFreeDailyAiLimit(event.target.value)} />
                </div>
                <Button onClick={handleSave}>บันทึกการตั้งค่า</Button>
                <p className="text-xs text-muted-foreground">อัปเดตล่าสุด: {savedAt}</p>
              </div>
            </article>

            <article className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h3 className="text-base font-semibold">ตั้งค่าสิทธิพิเศษ PLUS+</h3>
              <p className="text-sm text-muted-foreground">ฟีเจอร์ที่เปิดแสดงอยู่ {features.filter((item) => item.visible).length} / {features.length}</p>
              <div className="mt-4 space-y-3">
                {features.map((feature) => (
                  <div key={feature.id} className="flex items-center justify-between gap-3 rounded-lg bg-background p-3">
                    <div>
                      <p className="text-sm font-semibold">{feature.title}</p>
                      <p className="text-xs text-muted-foreground">{feature.description}</p>
                    </div>
                    <Switch
                      checked={feature.visible}
                      onCheckedChange={(checked) => setFeatures((prev) => prev.map((item) => (item.id === feature.id ? { ...item, visible: checked } : item)))}
                    />
                  </div>
                ))}
              </div>
            </article>
          </div>
        </>
      ) : null}
    </DashboardPageShell>
  );
}

