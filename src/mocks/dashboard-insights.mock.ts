import { managedUsers, tokenUsageCost, transactionHistory, type HealthStatus } from "./dashboard-features.mock";

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

export type OverviewSystemOwner = {
  id: string;
  name: string;
  role: string;
  team: string;
  contact: string;
  systems: string[];
};

const overviewRevenueDate = "2026-03-04";
const overviewToday = "2026-03-11";
const overviewYesterday = "2026-03-10";
const totalUsers = managedUsers.length;
const dau = Math.round(totalUsers * 0.26);
const newUsersToday = managedUsers.filter((user) => user.signupDate === overviewToday).length;
const newUsersYesterday = managedUsers.filter((user) => user.signupDate === overviewYesterday).length;
const aiCostToday = Math.round((tokenUsageCost.thisMonth.cost / 30) * (dau / Math.max(totalUsers, 1)));
const aiCostPerActiveUser = aiCostToday / Math.max(dau, 1);
const revenueTodayTransactions = transactionHistory.filter(
  (transaction) => transaction.date === overviewRevenueDate && transaction.status === "success",
);
const revenueToday = revenueTodayTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
const newUsersDelta = newUsersYesterday
  ? `${newUsersToday >= newUsersYesterday ? "+" : ""}${(((newUsersToday - newUsersYesterday) / newUsersYesterday) * 100).toFixed(1)}%`
  : "+0.0%";
const newUsersTrend = newUsersToday >= newUsersYesterday ? "up" : "down";

export const overviewKpis: OverviewKpi[] = [
  { label: "ผู้ใช้ทั้งหมด", value: totalUsers.toLocaleString(), delta: "+5.2%", trend: "up" },
  { label: "ผู้ใช้งานวันนี้", value: dau.toLocaleString(), delta: "+3.1%", trend: "up" },
  { label: "ผู้ใช้ใหม่วันนี้", value: newUsersToday.toLocaleString(), delta: newUsersDelta, trend: newUsersTrend },
  {
    label: "ค่าใช้จ่าย AI วันนี้",
    value: new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
      maximumFractionDigits: 0,
    }).format(aiCostToday),
    delta: `~฿${aiCostPerActiveUser.toFixed(2)}/คน`,
    trend: "up",
  },
];

export const overviewRevenueKpi: OverviewKpi = {
  label: "รายได้วันนี้",
  value: new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0,
  }).format(revenueToday),
  delta: `ธุรกรรมสำเร็จ ${revenueTodayTransactions.length} รายการ`,
  trend: "up",
};

export const overviewTopFeaturesDonut: OverviewFeatureUsageItem[] = [
  { feature: "การเรียน", value: 58, note: "จัดการการบ้านและตารางเรียน" },
  { feature: "การเงิน", value: 20, note: "บันทึกรายรับรายจ่าย" },
  { feature: "ไลฟ์สไตล์", value: 22, note: "บันทึกนัดหมายและชีวิตประจำวัน" },
];

export const overviewInputChannelDonut: OverviewFeatureUsageItem[] = [
  { feature: "Ai Input", value: 60, note: "สั่งบันทึกด้วยเสียงหรือพิมพ์" },
  { feature: "Manual Input", value: 40, note: "กรอกข้อมูลด้วยตัวเองโดยไม่ผ่าน AI" },
];

export const overviewSystemStatus: OverviewSystemStatus[] = [
  {
    key: "ai",
    label: "AI",
    status: "operational",
    detail: "Latency เฉลี่ย 1.4 วินาที",
    meta: "Error rate 1.2% ต่ำกว่าเกณฑ์ที่กำหนด",
  },
  {
    key: "database",
    label: "Database",
    status: "operational",
    detail: "Query เฉลี่ย 120 ms",
    meta: "Replication lag ต่ำกว่า 1 วินาที",
  },
  {
    key: "api",
    label: "API",
    status: "operational",
    detail: "Response time เฉลี่ย 280 ms",
    meta: "Uptime วันนี้ 99.98%",
  },
  {
    key: "auth",
    label: "Auth",
    status: "down",
    detail: "Login latency สูงขึ้นเล็กน้อย",
    meta: "พบการตอบกลับช้ากว่าปกติบางช่วง",
  },
  {
    key: "payment-gateway",
    label: "Payment Gateway",
    status: "operational",
    detail: "Webhook settlement ล่าช้าเฉลี่ย 2.8 นาที",
    meta: "ธุรกรรมสำเร็จยังเข้าระบบครบถ้วน",
  },
];

export const overviewSystemOwners: OverviewSystemOwner[] = [
  {
    id: "owner-01",
    name: "Napat K.",
    role: "AI Operations Lead",
    team: "AI Platform",
    contact: "@napat-ai",
    systems: ["AI"],
  },
  {
    id: "owner-02",
    name: "Mali R.",
    role: "Backend Engineer",
    team: "Core Services",
    contact: "@mali-backend",
    systems: ["Database", "API"],
  },
  {
    id: "owner-03",
    name: "Tanawat S.",
    role: "Security Engineer",
    team: "Platform Security",
    contact: "@tanawat-sec",
    systems: ["Auth"],
  },
  {
    id: "owner-04",
    name: "Praew L.",
    role: "Payments Manager",
    team: "Billing Ops",
    contact: "@praew-pay",
    systems: ["Payment Gateway"],
  },
];

export const manualInputUsage = [
  { intent: "สรุปบทเรียน", count: 4180, percentage: 29.4, note: "พิมพ์คำสั่งเพื่อสรุปเนื้อหาและโน้ตเรียน" },
  { intent: "วางแผนการเงิน", count: 3350, percentage: 23.6, note: "กรอกโจทย์รายรับรายจ่ายหรือเป้าหมายออม" },
  { intent: "แปลและเรียบเรียงข้อความ", count: 3120, percentage: 22.0, note: "ข้อความยาวเพื่อแปลหรือปรับโทนภาษา" },
  { intent: "วางตารางงาน/อ่านหนังสือ", count: 2780, percentage: 19.6, note: "ขอจัดตารางจากข้อความที่ผู้ใช้พิมพ์เอง" },
  { intent: "คำสั่งที่ไม่อยู่ในหมวดหลัก", count: 770, percentage: 5.4, note: "คำสั่งที่ไม่อยู่ในหมวดหลัก" },
];

export const compareEntryMethodShare = [
  { label: "AI Input", value: 78, colorClass: "bg-primary" },
  { label: "Manual Input", value: 22, colorClass: "bg-slate-400" },
];

export const compareInputBreakdownByFeature = [
  {
    category: "การเงิน",
    rows: [{ label: "เพิ่มรายจ่าย", aiInput: 82, manualInput: 18 }],
  },
  {
    category: "การเรียน",
    rows: [
      { label: "เพิ่มงาน", aiInput: 74, manualInput: 26 },
      { label: "จดโน้ต", aiInput: 63, manualInput: 37 },
    ],
  },
  {
    category: "ไลฟ์สไตล์",
    rows: [
      { label: "นัดหมาย", aiInput: 57, manualInput: 43 },
      { label: "ตั้งปลุก", aiInput: 28, manualInput: 72 },
      { label: "บันทึก", aiInput: 61, manualInput: 39 },
    ],
  },
] as const;

export const compareInputBreakdownInsight =
  "ตั้งปลุกมี Manual Input สูงที่สุด แสดงว่าผู้ใช้ต้องการความแม่นยำในการตั้งเวลา ควรพัฒนา AI ให้รองรับการตั้งปลุกได้ดีขึ้น";
