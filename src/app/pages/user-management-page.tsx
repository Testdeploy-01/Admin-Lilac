import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
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
import {
  PLAN_LABELS,
  churnList,
  dauWeekly,
  managedUsers,
  retentionCohorts,
  retentionCurve,
  userStatsBar,
  type UserTableRowExpanded,
} from "../../mocks/dashboard-features.mock";
import { formatCurrencyTHB, formatNumber } from "../../lib/formatters";
import { exportCSV } from "../../lib/exporters";

type TabKey = "all" | "compare" | "retention" | "churn";
type StatusFilter = "all" | "active" | "inactive" | "suspended";
type PlanFilter = "all" | "FREE" | "PLUS_MONTHLY" | "PLUS_TERM" | "PLUS_YEARLY";
type SortField = "name" | "aiCallsTotal" | "lastActive" | "signupDate";
type SortDir = "asc" | "desc";
type BulkAction = "" | "export" | "suspend" | "activate";

const PAGE_SIZE = 15;

export function UserManagementPage() {
  const [tab, setTab] = useState<TabKey>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [signupDateFilter, setSignupDateFilter] = useState("");
  const [planFilter, setPlanFilter] = useState<PlanFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [churnReasonFilter, setChurnReasonFilter] = useState("all");
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
      else if (sortField === "aiCallsTotal") cmp = a.aiCallsTotal - b.aiCallsTotal;
      else if (sortField === "lastActive") cmp = a.lastActive.localeCompare(b.lastActive);
      else if (sortField === "signupDate") cmp = a.signupDate.localeCompare(b.signupDate);
      return sortDir === "desc" ? -cmp : cmp;
    });

    return result;
  }, [users, searchQuery, signupDateFilter, planFilter, statusFilter, sortField, sortDir]);

  const churnReasonOptions = useMemo(() => Array.from(new Set(churnList.map((item) => item.reason))), []);
  const filteredChurnList = useMemo(
    () => churnList.filter((item) => churnReasonFilter === "all" || item.reason === churnReasonFilter),
    [churnReasonFilter],
  );

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
    <DashboardPageShell title="ผู้ใช้งาน" description="ค้นหา กรอง และจัดการผู้ใช้ทั้งหมดในระบบ">
      <AppTabs
        value={tab}
        onValueChange={(value) => setTab(value as TabKey)}
        items={[
          { value: "all", label: "ผู้ใช้ทั้งหมด" },
          { value: "compare", label: "เปรียบเทียบผู้ใช้" },
          { value: "retention", label: "การรักษาผู้ใช้" },
          { value: "churn", label: "รายชื่อผู้ยกเลิก" },
        ]}
      />

      {tab === "all" ? (
        <>
          <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-6">
            {userStatsBar.map((item) => (
              <MetricCard key={item.label} label={item.label} value={item.value} />
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
                  <SelectItem value="PLUS_MONTHLY">Plus+ รายเดือน</SelectItem>
                  <SelectItem value="PLUS_TERM">Plus+ รายเทอม</SelectItem>
                  <SelectItem value="PLUS_YEARLY">Plus+ รายปี</SelectItem>
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
                  <SelectItem value="active">ใช้งานอยู่</SelectItem>
                  <SelectItem value="inactive">ไม่ใช้งาน</SelectItem>
                  <SelectItem value="suspended">ถูกระงับ</SelectItem>
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
                    <Button variant="ghost" size="sm" className="h-auto p-0" onClick={() => toggleSort("aiCallsTotal")}>
                      การใช้ AI{sortIndicator("aiCallsTotal")}
                    </Button>
                  </TableHead>
                  <TableHead>จำนวนวิดเจ็ต</TableHead>
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
                        <Badge variant={user.plan === "FREE" ? "secondary" : "default"}>{PLAN_LABELS[user.plan]}</Badge>
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
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatNumber(user.aiCallsTotal)}</TableCell>
                      <TableCell>{formatNumber(user.widgetInstalls)}</TableCell>
                      <TableCell className="text-muted-foreground">{user.lastActive}</TableCell>
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
        <DataTableShell caption="เปรียบเทียบกลุ่มผู้ใช้งาน (มีวิดเจ็ต vs ไม่มีวิดเจ็ต)" minWidthClass="min-w-[700px]">
          <div className="mb-3">
            <h3 className="text-base font-semibold">เปรียบเทียบผู้ใช้งาน</h3>
            <p className="text-sm text-muted-foreground">เปรียบเทียบพฤติกรรมระหว่างกลุ่มผู้ใช้งาน</p>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ตัวชี้วัด</TableHead>
                <TableHead>ผู้ใช้งานที่มีวิดเจ็ต</TableHead>
                <TableHead>ผู้ใช้งานที่ไม่มีวิดเจ็ต</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">จำนวนผู้ใช้งาน</TableCell>
                <TableCell>{formatNumber(users.filter((user) => user.widgetInstalls > 0).length)}</TableCell>
                <TableCell>{formatNumber(users.filter((user) => user.widgetInstalls === 0).length)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">กลับมาใช้งานหลังสมัคร 4 สัปดาห์</TableCell>
                <TableCell>68.5%</TableCell>
                <TableCell>42.1%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">อัตราการอัปเกรดเป็น PLUS</TableCell>
                <TableCell>12.4%</TableCell>
                <TableCell>3.2%</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </DataTableShell>
      ) : tab === "retention" ? (
        <>
          <div className="grid gap-4 xl:grid-cols-2">
            <article className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div>
                <h3 className="text-base font-semibold">ผู้ใช้งานวันละกี่คน</h3>
                <p className="text-sm text-muted-foreground">เทียบสัปดาห์นี้กับสัปดาห์ก่อนหน้า</p>
              </div>
              <div className="mt-4 h-64 w-full">
                <ResponsiveContainer>
                  <BarChart data={dauWeekly} margin={{ left: 8, right: 8, top: 6 }}>
                    <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.5} />
                    <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Bar dataKey="lastWeek" fill="#94a3b8" radius={[4, 4, 0, 0]} name="สัปดาห์ก่อน" />
                    <Bar dataKey="thisWeek" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="สัปดาห์นี้" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </article>

            <article className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div>
                <h3 className="text-base font-semibold">อัตราการกลับมาใช้งาน</h3>
                <p className="text-sm text-muted-foreground">Retention W1-W8 เทียบค่าเฉลี่ยที่ตั้งเป้า</p>
              </div>
              <div className="mt-4 h-64 w-full">
                <ResponsiveContainer>
                  <LineChart data={retentionCurve} margin={{ left: 8, right: 8, top: 6 }}>
                    <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.5} />
                    <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                    <Tooltip />
                    <Line type="natural" dataKey="retention" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4 }} name="Lilac" />
                    <Line
                      type="natural"
                      dataKey="benchmark"
                      stroke="#94a3b8"
                      strokeWidth={2}
                      strokeDasharray="6 4"
                      dot={{ r: 3 }}
                      name="ค่าเฉลี่ยที่ตั้งเป้า"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </article>
          </div>

          <DataTableShell caption="ตาราง Retention Cohort แบบ Heat Map" minWidthClass="min-w-[700px]">
          <div className="mb-3">
            <h3 className="text-base font-semibold">ตารางการรักษาผู้ใช้</h3>
            <p className="text-sm text-muted-foreground">แสดง % ผู้ใช้ที่ยังใช้งานอยู่ แยกตามรุ่นที่สมัคร</p>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>เดือนที่สมัคร</TableHead>
                <TableHead>จำนวนคน</TableHead>
                <TableHead className="text-center">W1</TableHead>
                <TableHead className="text-center">W2</TableHead>
                <TableHead className="text-center">W4</TableHead>
                <TableHead className="text-center">W8</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {retentionCohorts.map((cohort) => (
                <TableRow key={cohort.cohort}>
                  <TableCell className="font-medium">{cohort.cohort}</TableCell>
                  <TableCell>{formatNumber(cohort.users)}</TableCell>
                  {([cohort.w1, cohort.w2, cohort.w4, cohort.w8] as number[]).map((value, index) => {
                    const intensity = value / 100;
                    return (
                      <TableCell key={`${cohort.cohort}-w${index}`} className="text-center">
                        <span
                          className="inline-block rounded-md px-3 py-1 text-xs font-bold"
                          style={{
                            backgroundColor: `oklch(from hsl(var(--primary)) calc(l + ${(1 - intensity) * 0.3}) c h / ${0.15 + intensity * 0.4})`,
                            color: intensity > 0.5 ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                          }}
                        >
                          {value}%
                        </span>
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DataTableShell>
        </>
      ) : (
        <DataTableShell caption="รายชื่อผู้ใช้ที่ยกเลิก PLUS สำหรับ win-back" minWidthClass="min-w-[800px]">
          <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-base font-semibold">รายชื่อผู้ยกเลิก (ดึงกลับ)</h3>
              <p className="text-sm text-muted-foreground">ผู้ใช้ที่ยกเลิก PLUS พร้อมข้อมูลสำหรับดึงกลับ</p>
            </div>
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
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User ID</TableHead>
                <TableHead>ชื่อ</TableHead>
                <TableHead>เหตุผล</TableHead>
                <TableHead>ระยะเวลาเป็น PLUS</TableHead>
                <TableHead>การใช้ AI ก่อนยกเลิก</TableHead>
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
                  <TableCell>{formatNumber(item.aiCallsBefore)}</TableCell>
                  <TableCell className="text-muted-foreground">{item.churnedAt}</TableCell>
                  <TableCell>
                    <Button size="sm" title="ส่งข้อเสนอ win-back ตามเหตุผลที่ผู้ใช้ยกเลิกแพ็กเกจ">
                      ส่งข้อเสนอ
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DataTableShell>
      )}

      <Sheet open={Boolean(selectedUser)} onOpenChange={(open) => !open && setSelectedUser(null)}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
          {selectedUser ? (
            <>
              <SheetHeader className="text-left">
                <SheetTitle className="flex items-center gap-3">
                  <img src={selectedUser.avatar} alt={selectedUser.name} className="h-12 w-12 rounded-full border border-primary/30" />
                  <span>{selectedUser.name}</span>
                </SheetTitle>
                <SheetDescription>{selectedUser.id} • {selectedUser.email}</SheetDescription>
              </SheetHeader>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-border bg-background p-3">
                  <p className="text-xs text-muted-foreground">แพ็กเกจ</p>
                  <p className="mt-1 font-bold">{PLAN_LABELS[selectedUser.plan]}</p>
                </div>
                <div className="rounded-lg border border-border bg-background p-3">
                  <p className="text-xs text-muted-foreground">สถานะ</p>
                  <p
                    className={`mt-1 font-bold ${selectedUser.status === "active"
                      ? "text-emerald-600"
                      : selectedUser.status === "suspended"
                        ? "text-rose-600"
                        : "text-amber-600"
                      }`}
                  >
                    {selectedUser.status}
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-background p-3">
                  <p className="text-xs text-muted-foreground">ใช้งานล่าสุด</p>
                  <p className="mt-1 font-semibold">{selectedUser.lastActive}</p>
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
                  <p className="text-xs text-muted-foreground">ฟีเจอร์หลัก</p>
                  <p className="mt-1 font-semibold">{selectedUser.favoriteCategory}</p>
                </div>
              </div>

              <Separator className="my-5" />

              <div className="rounded-lg border border-border bg-background p-4">
                <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">การใช้งาน AI</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">จำนวนเรียก AI</p>
                    <p className="font-bold">{formatNumber(selectedUser.aiCallsTotal)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">จำนวนวิดเจ็ต</p>
                    <p className="font-bold">{formatNumber(selectedUser.widgetInstalls)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">เสียง (จำนวนคำ)</p>
                    <p className="font-bold">{formatNumber(selectedUser.inputVoiceTokens)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">ข้อความ (จำนวนคำ)</p>
                    <p className="font-bold">{formatNumber(selectedUser.inputTextTokens + selectedUser.outputTextTokens)}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-muted-foreground">ค่าใช้จ่าย AI</p>
                    <p className="font-bold">{formatCurrencyTHB(selectedUser.aiCostTHB)}</p>
                  </div>
                </div>
              </div>

              {selectedUser.systemAlert !== "Normal" ? (
                <div className="mt-3 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm dark:border-amber-900/50 dark:bg-amber-950/30">
                  <p className="font-semibold text-amber-800 dark:text-amber-200">{selectedUser.systemAlert}</p>
                </div>
              ) : null}

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
                      <SelectItem value="FREE">FREE</SelectItem>
                      <SelectItem value="PLUS_MONTHLY">Plus+ รายเดือน</SelectItem>
                      <SelectItem value="PLUS_TERM">Plus+ รายเทอม</SelectItem>
                      <SelectItem value="PLUS_YEARLY">Plus+ รายปี</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant={selectedUser.status === "suspended" ? "secondary" : "destructive"}
                    onClick={() => handleToggleStatus(selectedUser.id)}
                  >
                    {selectedUser.status === "suspended" ? "เปิดใช้งาน" : "ระงับบัญชี"}
                  </Button>
                </div>
              </div>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </DashboardPageShell>
  );
}
