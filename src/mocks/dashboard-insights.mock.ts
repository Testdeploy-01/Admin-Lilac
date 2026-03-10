import { managedUsers, transactionHistory, type HealthStatus } from "./dashboard-features.mock";

export type OverviewKpi = {
  label: string;
  value: number | string;
  delta?: string;
  trend?: "up" | "down" | "neutral";
  note?: string;
};

export type OverviewFeatureUsageItem = {
  feature: string;
  value: number;
  note?: string;
};

export type OverviewSystemStatus = {
  key: string;
  label: string;
  status: HealthStatus;
  detail: string;
  meta?: string;
};

const overviewRevenueDate = "2026-03-04";
const totalUsers = managedUsers.length;
const plusUsers = managedUsers.filter((user) => user.plan !== "FREE").length;
const totalAiCalls = managedUsers.reduce((sum, user) => sum + user.aiCallsTotal, 0);
const dau = Math.round(totalUsers * 0.26);
const conversionRate = ((plusUsers / totalUsers) * 100).toFixed(1);
const revenueTodayTransactions = transactionHistory.filter(
  (transaction) => transaction.date === overviewRevenueDate && transaction.status === "success",
);
const revenueToday = revenueTodayTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);

export const overviewKpis: OverviewKpi[] = [
  { label: "ผู้ใช้ทั้งหมด", value: totalUsers.toLocaleString(), delta: "+5.2%", trend: "up" },
  { label: "ผู้ใช้งานวันนี้", value: dau.toLocaleString(), delta: "+3.1%", trend: "up" },
  { label: "สมาชิก PLUS", value: plusUsers.toLocaleString(), delta: `${conversionRate}% อัปเกรด`, trend: "up" },
  { label: "คำสั่ง AI วันนี้", value: Math.round(totalAiCalls / 30).toLocaleString(), delta: `~${(totalAiCalls / 30 / dau).toFixed(1)}/คน`, trend: "up" },
  {
    label: "รายได้วันนี้",
    value: new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
      maximumFractionDigits: 0,
    }).format(revenueToday),
    delta: `ธุรกรรมสำเร็จ ${revenueTodayTransactions.length} รายการ`,
    trend: "up",
    note: `คำนวณจากธุรกรรมที่ชำระสำเร็จในวันที่ ${overviewRevenueDate} ไม่ใช่รายได้รวมจากสมาชิก PLUS ทั้งหมด`,
  },
];

export const overviewFeatureUsageDonut: OverviewFeatureUsageItem[] = [
  { feature: "AI Chat", value: 31 },
  { feature: "การเรียน", value: 24 },
  { feature: "การเงิน", value: 18 },
  { feature: "ไลฟ์สไตล์", value: 11 },
  { feature: "วิดเจ็ต", value: 10 },
  { feature: "อื่นๆ", value: 6, note: "รวมหมวดย่อย เช่น สุขภาพ, เตือนความจำ, โปรไฟล์ และการตั้งค่า" },
];

export const overviewSystemStatus: OverviewSystemStatus[] = [
  {
    key: "ai",
    label: "AI",
    status: "operational",
    detail: "Latency เฉลี่ย 1.4 วินาที",
    meta: "Error rate 1.2% ต่ำกว่าค่าที่เฝ้าระวัง",
  },
  {
    key: "server",
    label: "Server",
    status: "operational",
    detail: "API และฐานข้อมูลออนไลน์",
    meta: "Uptime วันนี้ 99.98%",
  },
  {
    key: "widget-data",
    label: "Widget/Data",
    status: "degraded",
    detail: "ความเร็วอัปเดตข้อมูล เฉลี่ย 2.8 นาที",
    meta: "ข้อมูล Widget อัปเดตช้ากว่าปกติ 0.3 นาที",
  },
];

export const manualInputUsage = [
  { intent: "สรุปบทเรียน", count: 4180, percentage: 29.4, note: "พิมพ์คำสั่งเพื่อสรุปเนื้อหาและโน้ตเรียน" },
  { intent: "วางแผนการเงิน", count: 3350, percentage: 23.6, note: "กรอกโจทย์รายรับรายจ่ายหรือเป้าหมายออม" },
  { intent: "แปลและเรียบเรียงข้อความ", count: 3120, percentage: 22.0, note: "ข้อความยาวเพื่อแปลหรือปรับโทนภาษา" },
  { intent: "วางตารางงาน/อ่านหนังสือ", count: 2780, percentage: 19.6, note: "ขอจัดตารางจากข้อความที่ผู้ใช้พิมพ์เอง" },
  { intent: "ถามตอบทั่วไป", count: 770, percentage: 5.4, note: "manual prompt ที่ไม่เข้าหมวดหลัก" },
];
