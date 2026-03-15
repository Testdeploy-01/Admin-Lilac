import { useState } from "react";
import { DashboardPageShell } from "@/components/dashboard/ui/dashboard-page-shell";
import { AppTabs } from "@/components/dashboard/ui/app-tabs";
import { DataTableShell } from "@/components/dashboard/ui/data-table-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Check, X } from "lucide-react";
import {
  adminAccounts,
  auditLog,
  planPricingSettings,
  type AdminAccount,
} from "../../mocks/dashboard-features.mock";

type TabKey = "admins" | "logs" | "plans";

export function SettingsPage() {
  const [tab, setTab] = useState<TabKey>("admins");
  const [admins, setAdmins] = useState<AdminAccount[]>(adminAccounts);
  const [savedAt, setSavedAt] = useState("ยังไม่บันทึก");
  const [trialDays, setTrialDays] = useState(String(planPricingSettings.freeTrialDays));
  const [freeDailyAiLimit, setFreeDailyAiLimit] = useState(String(planPricingSettings.freeDailyAiLimit));
  
  const [editingAdmin, setEditingAdmin] = useState<AdminAccount | null>(null);

  const handleSave = () => setSavedAt(new Date().toLocaleString("th-TH"));

  return (
    <DashboardPageShell title="ตั้งค่าระบบ" description="จัดการผู้ดูแล ฟีเจอร์ และข้อมูล">
      <AppTabs
        value={tab}
        onValueChange={(value) => setTab(value as TabKey)}
        items={[
          { value: "admins", label: "ผู้ดูแลและสิทธิ์" },
          { value: "logs", label: "บันทึกการใช้งาน" },
          { value: "plans", label: "แพ็กเกจและราคา" },
        ]}
      />

      {tab === "admins" ? (
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
                  const username = prompt("ชื่อผู้ใช้:");
                  const role = prompt("ตำแหน่ง (Owner / ซุปเปอร์แอดมิน / Admin / การเงิน / ซัพพอร์ต / การตลาด):");
                  if (name && username && role) {
                    setAdmins((prev) => [
                      ...prev,
                      {
                        id: `ADM-${String(prev.length + 1).padStart(2, "0")}`,
                        name,
                        username,
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
                <TableHead>ชื่อผู้ใช้</TableHead>
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
                  <TableCell className="text-muted-foreground">{admin.username}</TableCell>
                  <TableCell>
                    <Badge 
                      className={admin.role === "System Owner" ? "bg-[#7f68a8] text-white hover:bg-[#7f68a8]/90 border-transparent" : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700"}
                      variant={admin.role === "System Owner" ? "default" : "outline"}
                    >
                      {admin.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{admin.lastLogin}</TableCell>
                  <TableCell>
                    {admin.role === "System Owner" ? (
                      <span className="text-sm text-muted-foreground">-</span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" onClick={() => setEditingAdmin(admin)}>
                          แก้ไข
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => setAdmins((prev) => prev.filter((item) => item.id !== admin.id))}>
                          ลบ
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DataTableShell>
      ) : null}

      <Dialog open={!!editingAdmin} onOpenChange={(open) => !open && setEditingAdmin(null)}>
        <DialogContent className="max-w-[425px]">
          <DialogHeader>
            <DialogTitle>แก้ไขบัญชีผู้ดูแล</DialogTitle>
          </DialogHeader>
          <div className="mt-2 space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">ตำแหน่ง (Role)</label>
              <select 
                className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                value={editingAdmin?.role || "Admin"}
                onChange={(e) => {
                  const newRole = e.target.value;
                  if (editingAdmin) {
                    setAdmins(prev => prev.map(a => a.id === editingAdmin.id ? { ...a, role: newRole } : a));
                    setEditingAdmin({ ...editingAdmin, role: newRole });
                  }
                }}
              >
                <option value="System Owner" className="bg-background text-foreground">System Owner</option>
                <option value="Admin" className="bg-background text-foreground">Admin</option>
              </select>
            </div>
            
            <div className="rounded-xl border border-border bg-muted/20 p-4">
              <p className="text-xs font-semibold uppercase text-muted-foreground mb-3 tracking-wider">สิทธิ์การเข้าถึง ({editingAdmin?.role})</p>
              <div className="space-y-2.5">
                {editingAdmin?.role === "System Owner" ? (
                  <>
                    <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500 shrink-0" /><span className="text-sm">ดูทุกหน้า</span></div>
                    <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500 shrink-0" /><span className="text-sm">เพิ่ม/ลบ/แก้ไขบัญชีผู้ดูแล</span></div>
                    <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500 shrink-0" /><span className="text-sm">เปลี่ยน Role ของ Admin</span></div>
                    <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500 shrink-0" /><span className="text-sm">เปิด/ปิดฟีเจอร์</span></div>
                    <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500 shrink-0" /><span className="text-sm">แก้ไขราคาแพ็กเกจ</span></div>
                    <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500 shrink-0" /><span className="text-sm">แก้ไขขีดจำกัด FREE</span></div>
                    <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500 shrink-0" /><span className="text-sm">แก้ไขระยะเวลา Trial</span></div>
                    <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500 shrink-0" /><span className="text-sm">ดูบันทึกการใช้งานทุกคน</span></div>
                    <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500 shrink-0" /><span className="text-sm">ส่งการแจ้งเตือน</span></div>
                    <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500 shrink-0" /><span className="text-sm">ตอบกลับ Feedback</span></div>
                    <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500 shrink-0" /><span className="text-sm">จัดการผู้ใช้ทั้งหมด</span></div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500 shrink-0" /><span className="text-sm">ดูทุกหน้า <span className="text-rose-500/80 font-medium">ยกเว้นหน้าตั้งค่า</span></span></div>
                    <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500 shrink-0" /><span className="text-sm">ส่งการแจ้งเตือน</span></div>
                    <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500 shrink-0" /><span className="text-sm">ตอบกลับ Feedback</span></div>
                    <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500 shrink-0" /><span className="text-sm">จัดการผู้ใช้ทั้งหมด</span></div>
                    <div className="flex items-center gap-2 text-muted-foreground pt-1"><X className="h-4 w-4 text-rose-500 shrink-0" /><span className="text-sm text-muted-foreground/80">แก้ไขราคาแพ็กเกจ</span></div>
                    <div className="flex items-center gap-2 text-muted-foreground"><X className="h-4 w-4 text-rose-500 shrink-0" /><span className="text-sm text-muted-foreground/80">เปิด/ปิดฟีเจอร์</span></div>
                    <div className="flex items-center gap-2 text-muted-foreground"><X className="h-4 w-4 text-rose-500 shrink-0" /><span className="text-sm text-muted-foreground/80">เพิ่ม/ลบผู้ดูแล</span></div>
                  </>
                )}
              </div>
            </div>
            <div className="pt-2 flex justify-end gap-2">
              <Button onClick={() => setEditingAdmin(null)}>บันทึก / ปิด</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>



      {tab === "logs" ? (
        <article className="rounded-xl border border-border bg-card p-6 shadow-sm w-full">
          <div className="mb-8">
            <h3 className="text-base font-semibold">ประวัติการใช้งานระบบ</h3>
            <p className="text-sm text-muted-foreground">บันทึกทุกการเคลื่อนไหวและการตั้งค่าต่างๆ โดยผู้ดูแลระบบ</p>
          </div>
          <div className="space-y-3">
            {auditLog.map((entry) => (
              <div key={entry.id} className="p-4 rounded-xl border border-border/80 bg-background/50 hover:bg-muted/10 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <p className="text-sm font-semibold">
                    <span className="text-foreground">{entry.adminName}</span>
                    <span className="text-muted-foreground font-normal mx-2">/</span>
                    <span className="text-primary font-medium">{entry.action}</span>
                  </p>
                  <div className="flex items-center gap-4 sm:justify-end">
                    <span className="text-[10px] text-muted-foreground/40 font-mono tracking-tighter">#{entry.id}</span>
                    <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-tight">
                      {entry.timestamp}
                    </span>
                  </div>
                </div>
                <div className="mt-1.5">
                  <p className="text-sm leading-relaxed">
                    {entry.targetUserName && (
                      <>
                        <span className="font-bold text-foreground mr-1.5">{entry.targetUserName}</span>
                        {entry.targetUserId && (
                          <span className="text-muted-foreground font-normal mr-1.5">({entry.targetUserId})</span>
                        )}
                        <span className="text-muted-foreground/30 mr-2">/</span>
                      </>
                    )}
                    <span className="text-foreground/80">{entry.details}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </article>
      ) : null}

      {tab === "plans" ? (
        <div className="grid gap-6">
          <article className="rounded-xl border border-border bg-card p-6 shadow-sm w-full">
            <h3 className="text-base font-semibold">แพ็กเกจและราคา</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-6">ปรับแต่งราคาและรายละเอียดของแพ็กเกจ Lilac PLUS</p>
            <div className="grid gap-5 sm:grid-cols-3">
              <div className="rounded-xl border border-border bg-background p-5">
                <p className="font-semibold text-lg text-primary">Lilac PLUS รายเดือน</p>
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-2xl font-bold">฿</span>
                  <Input defaultValue="79" className="text-xl font-bold w-24" />
                  <span className="text-muted-foreground">/เดือน</span>
                </div>
                <Button variant="outline" className="w-full mt-6">บันทึกราคา</Button>
              </div>
              <div className="rounded-xl border border-border bg-background p-5">
                <p className="font-semibold text-lg text-primary">Lilac PLUS รายเทอม</p>
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-2xl font-bold">฿</span>
                  <Input defaultValue="259" className="text-xl font-bold w-24" />
                  <span className="text-muted-foreground">/เทอม</span>
                </div>
                <Button variant="outline" className="w-full mt-6">บันทึกราคา</Button>
              </div>
              <div className="rounded-xl border border-border bg-background p-5">
                <p className="font-semibold text-lg text-primary">Lilac PLUS รายปี</p>
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-2xl font-bold">฿</span>
                  <Input defaultValue="699" className="text-xl font-bold w-24" />
                  <span className="text-muted-foreground">/ปี</span>
                </div>
                <Button variant="outline" className="w-full mt-6">บันทึกราคา</Button>
              </div>
            </div>
          </article>

          <div className="grid gap-6 lg:grid-cols-2">
            <article className="rounded-xl border border-border bg-card p-6 shadow-sm w-full">
              <h3 className="text-lg font-semibold">ระยะเวลาทดลองใช้ (Trial)</h3>
              <p className="mb-6 text-sm text-muted-foreground">ระยะเวลาให้ผู้ใช้ใหม่ทดลองใช้แพ็กเกจ PLUS ฟรี</p>
              <div className="rounded-xl border border-border bg-background p-5">
                <p className="font-semibold text-base mb-4">ต่อเนื่องเป็นเวลา</p>
                <div className="flex items-center gap-3">
                  <Input value={trialDays} onChange={(event) => setTrialDays(event.target.value)} className="w-24 text-xl font-bold text-center h-12" />
                  <span className="text-base text-muted-foreground font-medium">วัน</span>
                </div>
                <Button onClick={handleSave} className="mt-6">บันทึกระยะเวลา</Button>
              </div>
            </article>

            <article className="rounded-xl border border-border bg-card p-6 shadow-sm w-full">
              <h3 className="text-lg font-semibold text-primary">FREE Plan</h3>
              <p className="mb-6 text-sm text-muted-foreground">ขีดจำกัดการใช้งานสำหรับผู้ใช้ทั่วไป</p>
              <div className="rounded-xl border border-border bg-background p-5">
                <p className="font-semibold text-base mb-4">Voice Input สูงสุด (นาที/วัน)</p>
                <div className="flex items-center gap-3">
                  <Input 
                    value={freeDailyAiLimit} 
                    onChange={(e) => setFreeDailyAiLimit(e.target.value)} 
                    className="w-24 text-xl font-bold text-center h-12"
                  />
                  <span className="text-base text-muted-foreground font-medium">นาที</span>
                </div>
                <Button onClick={handleSave} className="mt-6">บันทึกขีดจำกัด</Button>
              </div>
              {savedAt !== "ยังไม่บันทึก" && <p className="mt-3 text-xs text-muted-foreground">อัปเดตล่าสุด: {savedAt}</p>}
            </article>
          </div>
        </div>
      ) : null}

    </DashboardPageShell>
  );
}
