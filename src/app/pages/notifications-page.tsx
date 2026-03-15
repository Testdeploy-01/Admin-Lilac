import { useMemo, useState } from "react";
import { AppTabs } from "@/components/dashboard/ui/app-tabs";
import { DashboardPageShell } from "@/components/dashboard/ui/dashboard-page-shell";
import { DataTableShell } from "@/components/dashboard/ui/data-table-shell";
import { MetricCard } from "@/components/dashboard/ui/metric-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type Audience = "ทุกคน" | "เฉพาะ FREE" | "เฉพาะ PLUS";
type NotificationType = "ประกาศ" | "อัปเดตฟีเจอร์" | "แจ้งปัญหา" | "โปรโมชัน";
type FeedbackCategory = "ติชม" | "แจ้งบัก" | "ขอฟีเจอร์";
type FeedbackStatus = "รอตอบกลับ" | "ตอบแล้ว";
type TabKey = "notifications" | "feedback";

type NotificationHistoryItem = {
  id: string;
  title: string;
  audience: Audience;
  type: NotificationType;
  sentAt: string;
  openRate: number | null;
  status: "sent" | "scheduled" | "cancelled";
};

type FeedbackItem = {
  id: string;
  userLabel: string;
  message: string;
  category: FeedbackCategory;
  submittedAt: string;
  status: FeedbackStatus;
  adminReply?: string;
  repliedAt?: string;
};

const notificationAudienceOptions: Audience[] = ["ทุกคน", "เฉพาะ FREE", "เฉพาะ PLUS"];
const notificationTypeOptions: NotificationType[] = ["ประกาศ", "อัปเดตฟีเจอร์", "แจ้งปัญหา", "โปรโมชัน"];
const feedbackCategoryOptions: Array<FeedbackCategory | "ทั้งหมด"> = ["ทั้งหมด", "ติชม", "แจ้งบัก", "ขอฟีเจอร์"];
const feedbackStatusOptions: Array<FeedbackStatus | "ทั้งหมด"> = ["ทั้งหมด", "รอตอบกลับ", "ตอบแล้ว"];

const initialNotificationHistory: NotificationHistoryItem[] = [
  {
    id: "NT-104",
    title: "อัปเดตระบบชำระเงินคืนนี้",
    audience: "ทุกคน",
    type: "แจ้งปัญหา",
    sentAt: "14 มี.ค. 2026, 18:30",
    openRate: 72,
    status: "sent",
  },
  {
    id: "NT-103",
    title: "เปิดใช้สรุปข้อความแบบใหม่สำหรับ PLUS",
    audience: "เฉพาะ PLUS",
    type: "อัปเดตฟีเจอร์",
    sentAt: "13 มี.ค. 2026, 09:15",
    openRate: 64,
    status: "sent",
  },
  {
    id: "NT-102",
    title: "แนะนำแพ็กเกจ PLUS รายเดือน",
    audience: "เฉพาะ FREE",
    type: "โปรโมชัน",
    sentAt: "12 มี.ค. 2026, 20:00",
    openRate: 41,
    status: "sent",
  },
  {
    id: "NT-101",
    title: "แจ้งปิดปรับปรุงระบบค้นหา",
    audience: "ทุกคน",
    type: "ประกาศ",
    sentAt: "11 มี.ค. 2026, 11:45",
    openRate: 58,
    status: "sent",
  },
  {
    id: "NT-100",
    title: "ระบบขัดข้องชั่วคราว",
    audience: "ทุกคน",
    type: "แจ้งปัญหา",
    sentAt: "10 มี.ค. 2026, 12:00",
    openRate: null,
    status: "cancelled",
  },
];

const initialFeedback: FeedbackItem[] = [
  {
    id: "FB-201",
    userLabel: "User #184",
    message: "อยากให้มีประวัติคำตอบ AI ย้อนหลังแยกตามวัน ดูง่ายขึ้นมาก",
    category: "ขอฟีเจอร์",
    submittedAt: "14 มี.ค. 2026, 08:20",
    status: "รอตอบกลับ",
  },
  {
    id: "FB-200",
    userLabel: "User #092",
    message: "ปุ่มอัดเสียงค้างหลังอัปเดตล่าสุด ต้องปิดแอปแล้วเข้าใหม่",
    category: "แจ้งบัก",
    submittedAt: "13 มี.ค. 2026, 21:05",
    status: "รอตอบกลับ",
  },
  {
    id: "FB-199",
    userLabel: "User #331",
    message: "ชอบหน้าใหม่มาก ใช้งานง่ายกว่าเดิม โดยเฉพาะ flow การสร้างโน้ต",
    category: "ติชม",
    submittedAt: "13 มี.ค. 2026, 16:40",
    status: "ตอบแล้ว",
    adminReply: "ขอบคุณสำหรับ feedback ทีมจะรักษาแนวทางนี้ต่อในรอบถัดไป",
    repliedAt: "13 มี.ค. 2026, 17:10",
  },
  {
    id: "FB-198",
    userLabel: "User #447",
    message: "อยากเลือก template ข้อความได้หลายแบบตอนส่งแจ้งเตือน",
    category: "ขอฟีเจอร์",
    submittedAt: "12 มี.ค. 2026, 14:12",
    status: "ตอบแล้ว",
    adminReply: "รับไว้ใน backlog แล้ว หากเริ่มพัฒนาจะอัปเดตผ่านประกาศในแอป",
    repliedAt: "12 มี.ค. 2026, 16:30",
  },
  {
    id: "FB-197",
    userLabel: "User #508",
    message: "พอเปิดแอปแล้ว banner โปรโมชันขึ้นซ้ำค่อนข้างบ่อย",
    category: "แจ้งบัก",
    submittedAt: "11 มี.ค. 2026, 10:48",
    status: "รอตอบกลับ",
  },
];

const mutedPanelClass = "rounded-xl border border-border/70 bg-background/80 p-4";

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatScheduleDate(date: string, time: string) {
  const combined = `${date}T${time || "09:00"}`;
  const scheduledDate = new Date(combined);

  if (Number.isNaN(scheduledDate.getTime())) {
    return `${date} ${time}`;
  }

  return formatDateTime(scheduledDate);
}

function getNotificationStatusBadgeClass(status: NotificationHistoryItem["status"]) {
  if (status === "sent") return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300";
  if (status === "scheduled") return "bg-sky-500/10 text-sky-700 dark:text-sky-300";
  return "bg-rose-500/10 text-rose-700 dark:text-rose-300";
}

function getFeedbackStatusBadgeClass(status: FeedbackStatus) {
  return status === "ตอบแล้ว"
    ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
    : "bg-primary/10 text-primary";
}

function getFeedbackCategoryBadgeClass(category: FeedbackCategory) {
  if (category === "แจ้งบัก") return "bg-rose-500/10 text-rose-700 dark:text-rose-300";
  if (category === "ขอฟีเจอร์") return "bg-sky-500/10 text-sky-700 dark:text-sky-300";
  return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300";
}

function SectionHeader({
  title,
}: {
  title: string;
}) {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
    </div>
  );
}

export function NotificationsPage() {
  const [tab, setTab] = useState<TabKey>("notifications");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState<Audience>("ทุกคน");
  const [type, setType] = useState<NotificationType>("ประกาศ");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [history, setHistory] = useState<NotificationHistoryItem[]>(initialNotificationHistory);
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>(initialFeedback);
  const [feedbackCategoryFilter, setFeedbackCategoryFilter] = useState<FeedbackCategory | "ทั้งหมด">("ทั้งหมด");
  const [feedbackStatusFilter, setFeedbackStatusFilter] = useState<FeedbackStatus | "ทั้งหมด">("ทั้งหมด");
  const [activeFeedbackId, setActiveFeedbackId] = useState<string | null>(null);
  const [replyDraft, setReplyDraft] = useState("");
  const [isComposeModalOpen, setIsComposeModalOpen] = useState(false);

  const selectedFeedback = useMemo(
    () => feedbackItems.find((item) => item.id === activeFeedbackId) ?? null,
    [activeFeedbackId, feedbackItems],
  );

  const filteredFeedback = useMemo(
    () =>
      feedbackItems.filter(
        (item) =>
          (feedbackCategoryFilter === "ทั้งหมด" || item.category === feedbackCategoryFilter) &&
          (feedbackStatusFilter === "ทั้งหมด" || item.status === feedbackStatusFilter),
      ),
    [feedbackCategoryFilter, feedbackItems, feedbackStatusFilter],
  );

  const feedbackStats = useMemo(() => {
    const total = feedbackItems.length;
    const pending = feedbackItems.filter((item) => item.status === "รอตอบกลับ").length;
    const compliment = feedbackItems.filter((item) => item.category === "ติชม").length;
    const bugs = feedbackItems.filter((item) => item.category === "แจ้งบัก").length;

    return {
      total,
      pending,
      complimentRate: total > 0 ? Math.round((compliment / total) * 100) : 0,
      bugRate: total > 0 ? Math.round((bugs / total) * 100) : 0,
    };
  }, [feedbackItems]);

  const canSubmit = title.trim().length > 0 && message.trim().length > 0;

  const resetComposer = () => {
    setTitle("");
    setMessage("");
    setAudience("ทุกคน");
    setType("ประกาศ");
    setScheduleDate("");
    setScheduleTime("");
  };

  const handleCreateNotification = (mode: "sent" | "scheduled") => {
    if (!canSubmit) return;
    if (mode === "scheduled" && (!scheduleDate || !scheduleTime)) return;

    const nextId = `NT-${String(history.length + 101).padStart(3, "0")}`;
    const nextItem: NotificationHistoryItem = {
      id: nextId,
      title: title.trim(),
      audience,
      type,
      sentAt: mode === "sent" ? formatDateTime(new Date()) : formatScheduleDate(scheduleDate, scheduleTime),
      openRate: mode === "sent" ? 0 : null,
      status: mode,
    };

    setHistory((prev) => [nextItem, ...prev]);
    setIsComposeModalOpen(false);
    resetComposer();
  };

  const openReplyDialog = (item: FeedbackItem) => {
    setActiveFeedbackId(item.id);
    setReplyDraft(item.adminReply ?? "");
  };

  const handleReplySubmit = () => {
    if (!selectedFeedback || !replyDraft.trim()) return;

    setFeedbackItems((prev) =>
      prev.map((item) =>
        item.id === selectedFeedback.id
          ? {
              ...item,
              status: "ตอบแล้ว",
              adminReply: replyDraft.trim(),
              repliedAt: formatDateTime(new Date()),
            }
          : item,
      ),
    );
    setActiveFeedbackId(null);
    setReplyDraft("");
  };

  return (
    <DashboardPageShell title="การแจ้งเตือน">
      <AppTabs
        value={tab}
        onValueChange={(value) => setTab(value as TabKey)}
        items={[
          { value: "notifications", label: "ส่งการแจ้งเตือน" },
          { value: "feedback", label: "Feedback ผู้ใช้" },
        ]}
      />

      {tab === "notifications" ? (
        <>
          <DataTableShell
            caption="ตารางประวัติการแจ้งเตือนที่ส่งแล้ว"
            minWidthClass="min-w-[800px]"
            toolbar={
              <div className="flex w-full items-center justify-between">
                <SectionHeader title="ประวัติการแจ้งเตือนที่ส่งแล้ว" />
                <Button onClick={() => setIsComposeModalOpen(true)}>ส่งการแจ้งเตือนใหม่</Button>
              </div>
            }
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>หัวข้อ</TableHead>
                  <TableHead>ประเภท</TableHead>
                  <TableHead>ส่งถึง</TableHead>
                  <TableHead>วันที่ส่ง</TableHead>
                  <TableHead>สถานะ</TableHead>
                  <TableHead className="text-right w-[150px]">อัตราเปิดอ่าน</TableHead>
                  <TableHead className="text-right w-[100px]">จัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="min-w-[260px]">
                      <div className="space-y-1">
                        <p className="font-medium text-foreground">{item.title}</p>
                        <span className="text-xs text-muted-foreground">{item.id}</span>
                      </div>
                    </TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>{item.audience}</TableCell>
                    <TableCell>{item.sentAt}</TableCell>
                    <TableCell>
                      <Badge className={cn("rounded-full", getNotificationStatusBadgeClass(item.status))}>
                        {item.status === "sent" ? "ส่งแล้ว" : item.status === "scheduled" ? "ตั้งเวลา" : "ยกเลิก"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {item.openRate === null ? (
                        <span className="text-muted-foreground">-</span>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-secondary">
                            <div className="h-full bg-primary" style={{ width: `${item.openRate}%` }} />
                          </div>
                          <span className="font-medium text-foreground min-w-[32px]">{item.openRate}%</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">ส่งซ้ำ</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </DataTableShell>

          <Dialog open={isComposeModalOpen} onOpenChange={setIsComposeModalOpen}>
            <DialogContent className="max-w-2xl border-border bg-card">
              <DialogHeader>
                <DialogTitle>ส่งการแจ้งเตือนใหม่</DialogTitle>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2 text-sm font-medium text-foreground">
                    <span>หัวข้อ</span>
                    <Input
                      value={title}
                      onChange={(event) => setTitle(event.target.value)}
                      placeholder="เช่น แจ้งอัปเดตฟีเจอร์ใหม่"
                    />
                  </label>
                  <label className="grid gap-2 text-sm font-medium text-foreground">
                    <span>ส่งถึง</span>
                    <Select value={audience} onValueChange={(value) => setAudience(value as Audience)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {notificationAudienceOptions.map((opt) => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </label>
                </div>
                <label className="grid gap-2 text-sm font-medium text-foreground">
                  <span>ข้อความ</span>
                  <Textarea
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder="พิมพ์เนื้อหาที่ต้องการส่งถึงผู้ใช้"
                    rows={4}
                  />
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2 text-sm font-medium text-foreground">
                    <span>ประเภท</span>
                    <Select value={type} onValueChange={(value) => setType(value as NotificationType)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {notificationTypeOptions.map((opt) => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </label>
                  <div className="grid gap-2 text-sm font-medium text-foreground">
                    <span>ตั้งเวลาส่งล่วงหน้า (เว้นว่างเพื่อส่งทันที)</span>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="date"
                        value={scheduleDate}
                        onChange={(event) => setScheduleDate(event.target.value)}
                      />
                      <Input
                        type="time"
                        value={scheduleTime}
                        onChange={(event) => setScheduleTime(event.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-2 rounded-xl border border-border/70 bg-background/50 p-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Preview (สิ่งที่ผู้ใช้เห็น)</p>
                  <p className="text-sm font-semibold text-foreground">{title.trim() || "หัวข้อการแจ้งเตือน"}</p>
                  <p className="mt-2 text-sm text-muted-foreground whitespace-pre-line">{message.trim() || "ข้อความตัวอย่างจะปรากฏที่นี่"}</p>
                </div>
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                <Button variant="ghost" onClick={() => setIsComposeModalOpen(false)}>ยกเลิก</Button>
                {scheduleDate && scheduleTime ? (
                  <Button onClick={() => handleCreateNotification("scheduled")} disabled={!canSubmit}>ตั้งเวลา</Button>
                ) : (
                  <Button onClick={() => handleCreateNotification("sent")} disabled={!canSubmit}>ส่งทันที</Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <MetricCard label="Feedback ทั้งหมด" value={feedbackStats.total} className="min-h-[110px] p-5" />
            <MetricCard label="รอตอบกลับ" value={feedbackStats.pending} className="min-h-[110px] p-5" />
            <MetricCard label="ตอบแล้ว" value={feedbackStats.total - feedbackStats.pending} className="min-h-[110px] p-5" />
          </div>

      <DataTableShell
        caption="ตาราง feedback จากผู้ใช้"
        minWidthClass="min-w-[920px]"
        toolbar={
          <div className="space-y-4">
            <SectionHeader
              title="Feedback จากผู้ใช้"
            />

            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <Select
                  value={feedbackCategoryFilter}
                  onValueChange={(value) => setFeedbackCategoryFilter(value as FeedbackCategory | "ทั้งหมด")}
                >
                  <SelectTrigger className="w-[180px]" aria-label="กรองหมวด feedback">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {feedbackCategoryOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={feedbackStatusFilter}
                  onValueChange={(value) => setFeedbackStatusFilter(value as FeedbackStatus | "ทั้งหมด")}
                >
                  <SelectTrigger className="w-[180px]" aria-label="กรองสถานะ feedback">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {feedbackStatusOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <p className="text-sm text-muted-foreground">
                feedback รอตอบกลับ {feedbackStats.pending} จากทั้งหมด {feedbackStats.total} รายการ
              </p>
            </div>
          </div>
        }
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ผู้ใช้</TableHead>
              <TableHead>ข้อความ</TableHead>
              <TableHead>หมวด</TableHead>
              <TableHead>วันที่</TableHead>
              <TableHead>สถานะ</TableHead>
              <TableHead className="text-right">จัดการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFeedback.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium text-foreground">{item.userLabel}</TableCell>
                <TableCell className="min-w-[320px] max-w-[420px] whitespace-normal text-sm leading-6 text-muted-foreground">
                  {item.message}
                </TableCell>
                <TableCell>
                  <Badge className={cn("rounded-full", getFeedbackCategoryBadgeClass(item.category))}>
                    {item.category}
                  </Badge>
                </TableCell>
                <TableCell>{item.submittedAt}</TableCell>
                <TableCell>
                  <Badge className={cn("rounded-full", getFeedbackStatusBadgeClass(item.status))}>
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant={item.status === "ตอบแล้ว" ? "outline" : "default"} onClick={() => openReplyDialog(item)}>
                    ตอบกลับ
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DataTableShell>
        </div>
      )}

      <Dialog
        open={selectedFeedback !== null}
        onOpenChange={(open) => {
          if (!open) {
            setActiveFeedbackId(null);
            setReplyDraft("");
          }
        }}
      >
        <DialogContent className="max-w-2xl border-border bg-card">
          <DialogHeader>
            <DialogTitle>ตอบกลับ Feedback</DialogTitle>
          </DialogHeader>

          {selectedFeedback ? (
            <div className="grid gap-4">
              <div className={mutedPanelClass}>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-foreground">{selectedFeedback.userLabel}</p>
                  <Badge className={cn("rounded-full", getFeedbackCategoryBadgeClass(selectedFeedback.category))}>
                    {selectedFeedback.category}
                  </Badge>
                  <Badge className={cn("rounded-full", getFeedbackStatusBadgeClass(selectedFeedback.status))}>
                    {selectedFeedback.status}
                  </Badge>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{selectedFeedback.message}</p>
                <p className="mt-3 text-xs text-muted-foreground">ส่งเข้ามาเมื่อ {selectedFeedback.submittedAt}</p>
              </div>

              <label className="grid gap-2 text-sm font-medium text-foreground">
                <span>ข้อความตอบกลับ</span>
                <Textarea
                  value={replyDraft}
                  onChange={(event) => setReplyDraft(event.target.value)}
                  rows={5}
                  placeholder="พิมพ์คำตอบที่ต้องการส่งกลับถึงผู้ใช้"
                  aria-label="ข้อความตอบกลับ feedback"
                />
              </label>

              {selectedFeedback.adminReply ? (
                <div className={mutedPanelClass}>
                  <p className="text-sm leading-6 text-muted-foreground">{selectedFeedback.adminReply}</p>
                  {selectedFeedback.repliedAt ? (
                    <p className="mt-2 text-xs text-muted-foreground">ตอบกลับเมื่อ {selectedFeedback.repliedAt}</p>
                  ) : null}
                </div>
              ) : null}
            </div>
          ) : null}

          <DialogFooter>
            <Button variant="ghost" onClick={() => setActiveFeedbackId(null)}>
              ปิด
            </Button>
            <Button onClick={handleReplySubmit} disabled={!replyDraft.trim()}>
              บันทึกคำตอบ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardPageShell>
  );
}
