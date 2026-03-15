import { useMemo, useState } from "react";
import { DashboardPageShell } from "@/components/dashboard/ui/dashboard-page-shell";
import { MetricCard } from "@/components/dashboard/ui/metric-card";
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
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tooltip as UiTooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  PLAN_LABELS,
  churnList,
  comparePlanBenchmarks,
  compareWidgetUsage,
  managedUsers,
  userStatsBar,
  type UserTableRowExpanded,
} from "../../mocks/dashboard-features.mock";
import {
  compareEntryMethodShare,
  compareInputBreakdownByFeature,
} from "../../mocks/dashboard-insights.mock";
import { formatNumber } from "../../lib/formatters";
import { exportCSV } from "../../lib/exporters";

type TabKey = "all" | "compare" | "churn";
type StatusFilter = "all" | "active" | "suspended";
type PlanFilter = "all" | "FREE" | "PLUS_MONTHLY" | "PLUS_TERM" | "PLUS_YEARLY";
type SortField = "name" | "aiCostTHB" | "lastActive" | "signupDate";
type SortDir = "asc" | "desc";
type BulkAction = "" | "export" | "suspend" | "activate";

const PAGE_SIZE = 15;
const PLAN_LABEL = {
  FREE: "สมาชิก FREE",
  PLUS_MONTHLY: "PLUS รายเดือน",
  PLUS_TERM: "PLUS รายเทอม",
  PLUS_YEARLY: "PLUS รายปี",
} as const;

const STATUS_LABEL = {
  active: "ปกติ",
  suspended: "ระงับ",
} as const;

const LAST_ACTIVE_REFERENCE_DATE = new Date("2026-03-11T12:00:00");
function getInactiveDays(dateString: string) {
  const lastActiveDate = new Date(`${dateString}T00:00:00`);
  return Math.max(
    0,
    Math.floor((LAST_ACTIVE_REFERENCE_DATE.getTime() - lastActiveDate.getTime()) / 86_400_000),
  );
}

function formatLastActiveLabel(dateString: string) {
  const diffDays = getInactiveDays(dateString);

  if (diffDays === 0) return "วันนี้";
  if (diffDays === 1) return "เมื่อวาน";
  return `${diffDays} วันที่แล้ว`;
}

function getMaskedPhoneSuffix(user: Pick<UserTableRowExpanded, "id" | "email">) {
  const seed = `${user.id}${user.email}`
    .split("")
    .reduce((total, char) => total + char.charCodeAt(0), 0);
  return String(seed % 100).padStart(2, "0");
}

function maskEmail(email: string) {
  const [localPart = "", domain = ""] = email.split("@");
  const domainName = domain.split(".")[0] ?? "";
  const domainSuffix = domain.includes(".") ? `.${domain.split(".").slice(1).join(".")}` : "";

  const maskedLocal =
    localPart.length <= 2
      ? `${localPart.slice(0, 1)}***`
      : `${localPart.slice(0, 2)}***${localPart.slice(-1)}`;
  const maskedDomain =
    domainName.length <= 2
      ? `${domainName.slice(0, 1)}***`
      : `${domainName.slice(0, 2)}***${domainName.slice(-1)}`;

  return `${maskedLocal}@${maskedDomain}${domainSuffix}`;
}

function formatUserContact(user: Pick<UserTableRowExpanded, "id" | "email" | "signupChannel">) {
  if (user.signupChannel === "เบอร์โทร") {
    return `${user.id} • 08X-XXX-XX${getMaskedPhoneSuffix(user)}`;
  }

  return `${user.id} • ${maskEmail(user.email)}`;
}

export function UserManagementPage() {
  const [tab, setTab] = useState<TabKey>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [signupDateFilter, setSignupDateFilter] = useState("");
  const [planFilter, setPlanFilter] = useState<PlanFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [churnReasonFilter, setChurnReasonFilter] = useState("all");
  const [churnDateFilter, setChurnDateFilter] = useState("all");
  const [sortField, setSortField] = useState<SortField>("lastActive");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [bulkAction, setBulkAction] = useState<BulkAction>("export");
  const [page, setPage] = useState(0);
  const [selectedUser, setSelectedUser] = useState<UserTableRowExpanded | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [users, setUsers] = useState(managedUsers);

  const filtered = useMemo(() => {
    let result = users;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((u) => u.id.toLowerCase().includes(q) || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    }

    if (planFilter !== "all") {
      result = result.filter((u) => u.plan === planFilter);
    }

    if (statusFilter !== "all") {
      result = result.filter((u) => u.status === statusFilter);
    }

    if (signupDateFilter) {
      result = result.filter((u) => u.signupDate === signupDateFilter);
    }

    result = [...result].sort((a, b) => {
      let cmp = 0;
      if (sortField === "name") cmp = a.name.localeCompare(b.name);
      else if (sortField === "aiCostTHB") cmp = a.aiCostTHB - b.aiCostTHB;
      else if (sortField === "lastActive") cmp = a.lastActive.localeCompare(b.lastActive);
      else if (sortField === "signupDate") cmp = a.signupDate.localeCompare(b.signupDate);
      return sortDir === "desc" ? -cmp : cmp;
    });

    return result;
  }, [users, searchQuery, signupDateFilter, planFilter, statusFilter, sortField, sortDir]);

  const churnReasonOptions = useMemo(() => Array.from(new Set(churnList.map((item) => item.reason))), []);
  const churnDateOptions = useMemo(() => Array.from(new Set(churnList.map((item) => item.churnedAt))).sort().reverse(), []);
  const filteredChurnList = useMemo(
    () =>
      churnList.filter(
        (item) =>
          (churnReasonFilter === "all" || item.reason === churnReasonFilter) &&
          (churnDateFilter === "all" || item.churnedAt === churnDateFilter),
      ),
    [churnDateFilter, churnReasonFilter],
  );
  const churnSummary = useMemo(() => {
    const currentMonth = "2026-03";
    const reasonCounts = churnList.reduce<Record<string, number>>((acc, item) => {
      acc[item.reason] = (acc[item.reason] ?? 0) + 1;
      return acc;
    }, {});
    const topReason =
      Object.entries(reasonCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "-";

    return {
      total: churnList.length.toLocaleString(),
      thisMonth: churnList.filter((item) => item.churnedAt.startsWith(currentMonth)).length.toLocaleString(),
      topReason,
    };
  }, []);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageData = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("desc");
    }
    setPage(0);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === pageData.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(pageData.map((u) => u.id)));
  };

  const handleBulkAction = (action: string) => {
    if (selectedIds.size === 0) return;
    if (action === "export") {
      const rows = users.filter((u) => selectedIds.has(u.id)).map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        plan: PLAN_LABELS[u.plan],
        status: u.status,
        aiCalls: u.aiCallsTotal,
        lastActive: u.lastActive,
      }));
      exportCSV("selected-users", rows);
      return;
    }
    if (action === "suspend") setUsers((prev) => prev.map((u) => (selectedIds.has(u.id) ? { ...u, status: "suspended" as const } : u)));
    if (action === "activate") setUsers((prev) => prev.map((u) => (selectedIds.has(u.id) ? { ...u, status: "active" as const } : u)));
    setSelectedIds(new Set());
  };

  const handleChangePlan = (userId: string, newPlan: UserTableRowExpanded["plan"]) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, plan: newPlan } : u)));
    if (selectedUser && selectedUser.id === userId) setSelectedUser({ ...selectedUser, plan: newPlan });
  };

  const handleToggleStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== userId) return u;
        return { ...u, status: u.status === "suspended" ? ("active" as const) : ("suspended" as const) };
      }),
    );
    if (selectedUser?.id === userId) {
      setSelectedUser({
        ...selectedUser,
        status: selectedUser.status === "suspended" ? "active" : "suspended",
      });
    }
  };

  const sortIndicator = (field: SortField) => {
    if (sortField !== field) return "";
    return sortDir === "asc" ? " ↑" : " ↓";
  };

  return (
    <DashboardPageShell title="ผู้ใช้งาน">
      <AppTabs
        value={tab}
        onValueChange={(value) => setTab(value as TabKey)}
        items={[
          { value: "all", label: "ผู้ใช้ทั้งหมด" },
          { value: "compare", label: "เปรียบเทียบผู้ใช้" },
          { value: "churn", label: "รายชื่อผู้ยกเลิก" },
        ]}
      />

      {tab === "all" ? (
        <>


          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
            {userStatsBar.map((item) => (
              <MetricCard
                key={item.label}
                label={item.label}
                value={item.value}
                delta={item.delta}
                trend={item.trend}
                note={item.note}
                className="min-h-[132px] p-5"
              />
            ))}
          </div>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <Input
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setPage(0);
              }}
              placeholder="ค้นหา User ID, ชื่อ, อีเมล..."
              aria-label="ค้นหา User"
              className="w-full max-w-md"
            />

            <div className="flex flex-wrap items-center gap-2">
              <Input
                type="date"
                value={signupDateFilter}
                onChange={(event) => {
                  setSignupDateFilter(event.target.value);
                  setPage(0);
                }}
                aria-label="กรองตามวันที่สมัคร"
                className="w-[180px]"
              />
              <Select
                value={planFilter}
                onValueChange={(value) => {
                  setPlanFilter(value as PlanFilter);
                  setPage(0);
                }}
              >
                <SelectTrigger className="w-[170px]">
                  <SelectValue placeholder="ทุกแพ็กเกจ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทุกแพ็กเกจ</SelectItem>
                  <SelectItem value="FREE">FREE</SelectItem>
                  <SelectItem value="PLUS_MONTHLY">PLUS รายเดือน</SelectItem>
                  <SelectItem value="PLUS_TERM">PLUS รายเทอม</SelectItem>
                  <SelectItem value="PLUS_YEARLY">PLUS รายปี</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value as StatusFilter);
                  setPage(0);
                }}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="ทุกสถานะ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทุกสถานะ</SelectItem>
                  <SelectItem value="active">ปกติ</SelectItem>
                  <SelectItem value="suspended">ระงับ</SelectItem>
                </SelectContent>
              </Select>

              <p className="text-xs text-muted-foreground">แสดง {filtered.length.toLocaleString()} จาก {users.length.toLocaleString()} คน</p>
            </div>
          </div>

          {selectedIds.size > 0 ? (
            <div className="flex flex-wrap items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 p-3">
              <span className="text-sm font-semibold">เลือก {selectedIds.size} คน</span>
              <Select value={bulkAction} onValueChange={(value) => setBulkAction(value as BulkAction)}>
                <SelectTrigger className="w-[180px] bg-background">
                  <SelectValue placeholder="เลือก Bulk Action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="export">ดาวน์โหลด CSV</SelectItem>
                  <SelectItem value="suspend">ระงับบัญชี</SelectItem>
                  <SelectItem value="activate">เปิดใช้งาน</SelectItem>
                </SelectContent>
              </Select>
              <Button size="sm" onClick={() => handleBulkAction(bulkAction)} disabled={!bulkAction}>
                ใช้กับที่เลือก
              </Button>
              <Button size="sm" variant="ghost" className="ml-auto" onClick={() => setSelectedIds(new Set())}>
                ยกเลิก
              </Button>
            </div>
          ) : null}

          <DataTableShell caption="ตารางรายชื่อผู้ใช้งานพร้อมข้อมูลแผนและสถานะ" minWidthClass="min-w-[1100px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">
                    <Checkbox
                      checked={selectedIds.size === pageData.length && pageData.length > 0}
                      onCheckedChange={toggleSelectAll}
                      aria-label="เลือกทั้งหมด"
                    />
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" size="sm" className="h-auto p-0" onClick={() => toggleSort("name")}>
                      ชื่อ{sortIndicator("name")}
                    </Button>
                  </TableHead>
                  <TableHead>แพ็กเกจ</TableHead>
                  <TableHead>สถานะ</TableHead>
                  <TableHead>
                    <Button variant="ghost" size="sm" className="h-auto p-0" onClick={() => toggleSort("aiCostTHB")}>
                      ค่าใช้จ่าย AI{sortIndicator("aiCostTHB")}
                    </Button>
                  </TableHead>
                  <TableHead>ช่องทางสมัคร</TableHead>
                  <TableHead>
                    <Button variant="ghost" size="sm" className="h-auto p-0" onClick={() => toggleSort("lastActive")}>
                      ใช้งานล่าสุด{sortIndicator("lastActive")}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" size="sm" className="h-auto p-0" onClick={() => toggleSort("signupDate")}>
                      วันที่สมัคร{sortIndicator("signupDate")}
                    </Button>
                  </TableHead>
                  <TableHead>จัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="py-8 text-center text-muted-foreground">
                      ไม่พบผู้ใช้
                    </TableCell>
                  </TableRow>
                ) : (
                  pageData.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Checkbox checked={selectedIds.has(user.id)} onCheckedChange={() => toggleSelect(user.id)} aria-label={`เลือก ${user.name}`} />
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent" onClick={() => setSelectedUser(user)}>
                          <div className="flex items-center gap-2 text-left">
                            <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full border border-border" />
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-xs text-muted-foreground">{user.id}</p>
                            </div>
                          </div>
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.plan === "FREE" ? "secondary" : "default"}>{PLAN_LABEL[user.plan]}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            user.status === "active"
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300"
                              : user.status === "suspended"
                                ? "bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300"
                                : "bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300"
                          }
                        >
                          {STATUS_LABEL[user.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <TooltipProvider delayDuration={150}>
                          <UiTooltip>
                            <TooltipTrigger asChild>
                              <span className="cursor-help font-medium">{`฿${user.aiCostTHB.toFixed(2)}`}</span>
                            </TooltipTrigger>
                            <TooltipContent>
                              {`คำนวณจาก ${formatNumber(user.inputVoiceTokens + user.inputTextTokens + user.outputTextTokens)} tokens`}
                            </TooltipContent>
                          </UiTooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell>{user.signupChannel}</TableCell>
                      <TableCell className="text-muted-foreground">{formatLastActiveLabel(user.lastActive)}</TableCell>
                      <TableCell className="text-muted-foreground">{user.signupDate}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="secondary" onClick={() => setSelectedUser(user)}>
                          ดูรายละเอียด
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </DataTableShell>

          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">หน้า {page + 1} / {totalPages}</p>
            <div className="flex gap-1">
              <Button size="sm" variant="secondary" disabled={page === 0} onClick={() => setPage(page - 1)}>
                ก่อนหน้า
              </Button>
              <Button size="sm" variant="secondary" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>
                ถัดไป
              </Button>
            </div>
          </div>
        </>
      ) : tab === "compare" ? (
        <>
          <div className="space-y-4">
            <article className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div>
                <h3 className="text-base font-semibold">AI Input vs Manual Input</h3>
              </div>
              <div className="mt-5 overflow-hidden rounded-full bg-muted">
                <div className="flex h-4 w-full">
                  {compareEntryMethodShare.map((item) => (
                    <div
                      key={item.label}
                      className={item.colorClass}
                      style={{ width: `${item.value}%` }}
                      title={`${item.label} ${item.value}%`}
                    />
                  ))}
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
                {compareEntryMethodShare.map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${item.colorClass}`} />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
              <Separator className="my-6" />
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {compareInputBreakdownByFeature.map((section) => (
                  <article key={section.category} className="rounded-xl border border-border/70 bg-background/40 p-4">
                    <h4 className="text-sm font-semibold">{section.category}</h4>
                    <div className="mt-3 overflow-hidden rounded-lg border border-border/70">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>รายการ</TableHead>
                            <TableHead className="text-right">AI Input</TableHead>
                            <TableHead className="text-right">Manual Input</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {section.rows.map((row) => (
                            <TableRow key={row.label}>
                              <TableCell className="font-medium">{row.label}</TableCell>
                              <TableCell className="text-right text-primary">{row.aiInput}%</TableCell>
                              <TableCell className="text-right text-muted-foreground">{row.manualInput}%</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </article>
                ))}
              </div>
            </article>

            <article className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div>
                <h3 className="text-base font-semibold">การใช้วิดเจ็ต</h3>
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {compareWidgetUsage.map((item) => (
                  <div key={item.label} className="rounded-xl border border-border/70 bg-background/40 p-4">
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-lg border border-border bg-muted/20 p-4">
                        <p className="text-sm text-muted-foreground">FREE</p>
                        <p className="mt-2 text-2xl font-semibold">{item.free}</p>
                      </div>
                      <div className="rounded-lg border border-primary/25 bg-primary/10 p-4">
                        <p className="text-sm text-primary">PLUS</p>
                        <p className="mt-2 text-2xl font-semibold text-primary">{item.plus}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <DataTableShell caption="เปรียบเทียบ FREE กับ PLUS" minWidthClass="min-w-[720px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ตัวชี้วัด</TableHead>
                    <TableHead>FREE</TableHead>
                    <TableHead className="text-primary">PLUS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comparePlanBenchmarks.map((row) => (
                    <TableRow key={row.metric}>
                      <TableCell className="font-medium no-underline decoration-transparent">
                        {row.metric === "เฉลี่ยวันที่ใช้ก่อนอัปเกรด" ? (
                          <p>{row.metric}</p>
                        ) : (
                          row.metric
                        )}
                      </TableCell>
                      <TableCell
                        className={
                          row.winner === "free"
                            ? "font-semibold text-emerald-600 dark:text-emerald-400"
                            : "text-muted-foreground"
                        }
                      >
                        {row.free}
                      </TableCell>
                      <TableCell
                        className={
                          row.winner === "plus"
                            ? "font-semibold text-primary"
                            : "text-muted-foreground"
                        }
                      >
                        {row.plus}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </DataTableShell>
          </div>
        </>
      ) : (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <MetricCard label="ยกเลิกทั้งหมด" value={churnSummary.total} delta="+3.2%" trend="down" className="min-h-[132px] p-5" />
            <MetricCard label="ยกเลิกเดือนนี้" value={churnSummary.thisMonth} delta="-8.5%" trend="up" className="min-h-[132px] p-5" />
            <MetricCard
              label="เหตุผลยอดนิยม"
              value={churnSummary.topReason}
              delta={`${churnSummary.total} คน`}
              trend="neutral"
              note={`จากทั้งหมด ${churnSummary.total.toLocaleString()} คน`}
              className="min-h-[132px] p-5"
            />
          </div>
        <DataTableShell caption="รายชื่อผู้ใช้ที่ยกเลิก PLUS สำหรับ win-back" minWidthClass="min-w-[880px]">
          <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-base font-semibold">รายชื่อผู้ยกเลิก (ดึงกลับ)</h3>
              <p className="text-sm text-muted-foreground">ผู้ใช้ที่ยกเลิก PLUS พร้อมข้อมูลสำหรับดึงกลับ</p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Select value={churnReasonFilter} onValueChange={setChurnReasonFilter}>
                <SelectTrigger className="w-full sm:w-[220px]">
                  <SelectValue placeholder="กรองตามเหตุผล" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทุกเหตุผล</SelectItem>
                  {churnReasonOptions.map((reason) => (
                    <SelectItem key={reason} value={reason}>
                      {reason}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={churnDateFilter} onValueChange={setChurnDateFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="วันที่ยกเลิก" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทุกวันที่</SelectItem>
                  {churnDateOptions.map((date) => (
                    <SelectItem key={date} value={date}>
                      {date}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User ID</TableHead>
                <TableHead>ชื่อ</TableHead>
                <TableHead>เหตุผล</TableHead>
                <TableHead>ระยะเวลาเป็น PLUS</TableHead>
                <TableHead>ค่าใช้จ่าย AI ก่อนยกเลิก</TableHead>
                <TableHead>ยกเลิกเมื่อ</TableHead>
                <TableHead>จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredChurnList.map((item) => (
                <TableRow key={item.userId}>
                  <TableCell className="font-medium">{item.userId}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell className="text-muted-foreground">{item.reason}</TableCell>
                  <TableCell>{item.plusDuration}</TableCell>
                  <TableCell>{`฿${item.aiCostBeforeTHB.toFixed(2)}`}</TableCell>
                  <TableCell className="text-muted-foreground">{item.churnedAt}</TableCell>
                  <TableCell>
                    <Button size="sm" title="ส่งข้อเสนอ win-back ตามเหตุผลที่ผู้ใช้ยกเลิกแพ็กเกจ">
                      ส่งข้อเสนอดึงกลับ
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DataTableShell>
        </div>
      )}

      <Sheet open={Boolean(selectedUser)} onOpenChange={(open) => !open && setSelectedUser(null)}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-xl lg:max-w-2xl">
          {selectedUser ? (
            <>
              <SheetHeader className="text-left">
                <SheetTitle className="flex items-center gap-3">
                  <img src={selectedUser.avatar} alt={selectedUser.name} className="h-12 w-12 rounded-full border border-primary/30" />
                  <span>{selectedUser.name}</span>
                </SheetTitle>
                <SheetDescription>{formatUserContact(selectedUser)}</SheetDescription>
              </SheetHeader>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-border bg-background p-3">
                  <p className="text-xs text-muted-foreground">แพ็กเกจ</p>
                  <p className="mt-1 font-bold">{PLAN_LABEL[selectedUser.plan]}</p>
                </div>
                <div className="rounded-lg border border-border bg-background p-3">
                  <p className="text-xs text-muted-foreground">สถานะ</p>
                  <p
                    className={`mt-1 font-bold ${selectedUser.status === "active"
                      ? "text-emerald-600"
                      : selectedUser.status === "suspended"
                        ? "text-rose-600"
                        : "text-foreground"
                      }`}
                  >
                    {STATUS_LABEL[selectedUser.status]}
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-background p-3">
                  <p className="text-xs text-muted-foreground">ใช้งานล่าสุด</p>
                  <p className="mt-1 font-semibold">{formatLastActiveLabel(selectedUser.lastActive)}</p>
                </div>
                <div className="rounded-lg border border-border bg-background p-3">
                  <p className="text-xs text-muted-foreground">สมัครเมื่อ</p>
                  <p className="mt-1 font-semibold">{selectedUser.signupDate}</p>
                </div>
                <div className="rounded-lg border border-border bg-background p-3">
                  <p className="text-xs text-muted-foreground">ใช้งานต่อเนื่อง</p>
                  <p className="mt-1 font-bold">{selectedUser.streak} วัน</p>
                </div>
                <div className="rounded-lg border border-border bg-background p-3">
                  <p className="text-xs text-muted-foreground">ช่องทางสมัคร</p>
                  <p className="mt-1 font-semibold">{selectedUser.signupChannel}</p>
                </div>
              </div>

              <Separator className="my-5" />

              <div className="rounded-lg border border-border bg-background p-4">
                <p className="mb-3 text-xs font-semibold uppercase text-muted-foreground">การใช้ AI</p>
                <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                  <div className="rounded-md border border-border/70 bg-card/60 p-3">
                    <p className="text-muted-foreground">คำสั่งทั้งหมด</p>
                    <p className="mt-1 font-bold">{formatNumber(selectedUser.aiCallsTotal)} ครั้ง</p>
                  </div>
                  <div className="rounded-md border border-border/70 bg-card/60 p-3">
                    <p className="text-muted-foreground">คำสั่งเสียง</p>
                    <p className="mt-1 font-bold">{formatNumber(selectedUser.voiceCommands)} ครั้ง</p>
                  </div>
                  <div className="rounded-md border border-border/70 bg-card/60 p-3">
                    <p className="text-muted-foreground">คำสั่งข้อความ</p>
                    <p className="mt-1 font-bold">{formatNumber(selectedUser.textCommands)} ครั้ง</p>
                  </div>
                  <div className="rounded-md border border-border/70 bg-card/60 p-3">
                    <p className="text-muted-foreground">ค่าใช้จ่าย AI</p>
                    <p className="mt-1 font-bold">฿{selectedUser.aiCostTHB.toFixed(2)}</p>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="overflow-hidden rounded-md border border-border/70">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ฟีเจอร์</TableHead>
                        <TableHead className="text-right">คำสั่ง</TableHead>
                        <TableHead className="text-right">ค่าใช้จ่าย</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedUser.aiFeatureUsage.map((item) => (
                        <TableRow key={item.feature}>
                          <TableCell className="font-medium">{item.feature}</TableCell>
                          <TableCell className="text-right text-muted-foreground">{formatNumber(item.calls)} ครั้ง</TableCell>
                          <TableCell className="text-right font-medium">฿{item.costTHB.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <p className="text-xs font-semibold uppercase text-muted-foreground">การจัดการ</p>
                <div className="grid grid-cols-2 gap-2">
                  <Select
                    value={selectedUser.plan}
                    onValueChange={(value) => handleChangePlan(selectedUser.id, value as UserTableRowExpanded["plan"])}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกแพ็กเกจ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FREE">{PLAN_LABEL.FREE}</SelectItem>
                      <SelectItem value="PLUS_MONTHLY">{PLAN_LABEL.PLUS_MONTHLY}</SelectItem>
                      <SelectItem value="PLUS_TERM">{PLAN_LABEL.PLUS_TERM}</SelectItem>
                      <SelectItem value="PLUS_YEARLY">{PLAN_LABEL.PLUS_YEARLY}</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant={selectedUser.status === "suspended" ? "secondary" : "destructive"}
                    onClick={() => handleToggleStatus(selectedUser.id)}
                  >
                    {selectedUser.status === "suspended" ? "เปิดใช้งาน" : "ระงับบัญชี"}
                  </Button>
                </div>
                {selectedUser.plan === "FREE" ? (
                  <Button className="w-full" variant="secondary">
                    ส่งข้อเสนออัปเกรด
                  </Button>
                ) : null}
              </div>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </DashboardPageShell>
  );
}
