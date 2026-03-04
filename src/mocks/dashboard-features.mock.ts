export type TrendType = "up" | "down" | "neutral";

export type AiPeriod = "7d" | "month" | "4months" | "year";

export type HealthStatus = "operational" | "degraded" | "down";

/* ──────────────────────────────────────────────
 * Subscription Plans – single source of truth
 * ────────────────────────────────────────────── */
export type PlanKey = "FREE" | "PLUS_MONTHLY" | "PLUS_TERM" | "PLUS_YEARLY";

export const PLAN_LABELS: Record<PlanKey, string> = {
  FREE: "FREE",
  PLUS_MONTHLY: "Plus+ รายเดือน",
  PLUS_TERM: "Plus+ รายเทอม",
  PLUS_YEARLY: "Plus+ รายปี",
};

export const PLAN_PRICES: Record<PlanKey, number> = {
  FREE: 0,
  PLUS_MONTHLY: 59,
  PLUS_TERM: 199,
  PLUS_YEARLY: 599,
};

export const subscriptionPlans = [
  {
    id: "plan-monthly",
    name: "Plus+ Monthly",
    cycle: "รายเดือน",
    priceTHB: 59,
    durationDays: 30,
    active: true,
    badge: "Starter",
  },
  {
    id: "plan-term",
    name: "Plus+ Term",
    cycle: "รายเทอม (4 เดือน)",
    priceTHB: 199,
    durationDays: 120,
    active: true,
    badge: "Popular",
  },
  {
    id: "plan-yearly",
    name: "Plus+ Yearly",
    cycle: "รายปี",
    priceTHB: 599,
    durationDays: 365,
    active: true,
    badge: "Best Value",
  },
];

/* ──────────────────────────────────────────────
 * User Generator – 6,456 users
 * ────────────────────────────────────────────── */
export type UserTableRowExpanded = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  plan: PlanKey;
  signupDate: string;
  lastActive: string;
  favoriteCategory: "AI Chat" | "การเรียน" | "การเงิน" | "ปฏิทิน" | "วิดเจ็ต" | "ไลฟ์สไตล์";
  systemAlert: string;
  inputVoiceTokens: number;
  inputTextTokens: number;
  outputTextTokens: number;
  aiCostTHB: number;
  aiCallsTotal: number;
  heyLilacActivations: number;
  widgetInstalls: number;
  status: "active" | "inactive" | "suspended";
  lastLogin: string;
  streak: number;
  churnedAt?: string;
  churnReason?: string;
};

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

const FIRST_NAMES = [
  "Napat", "Sirin", "Anon", "Mali", "Pimnara", "Tanawat", "Korn", "Praew", "Phat", "Fern",
  "Palm", "Mind", "Bright", "Ice", "Fluke", "Oat", "Pim", "Bank", "Jane", "Gun",
  "Pond", "Earth", "Film", "Kay", "New", "Am", "Pop", "Mild", "Tong", "Bam",
  "Pluem", "Grace", "Nut", "Boss", "Pang", "Gift", "Peach", "Ploy", "Beam", "Net",
  "Mook", "Win", "Air", "Pin", "First", "Kwan", "Mint", "Ple", "View", "Gam",
];
const LAST_INITIALS = ["K.", "P.", "C.", "R.", "T.", "L.", "S.", "W.", "M.", "B.", "N.", "J.", "D.", "A.", "H."];
const CATEGORIES: Array<UserTableRowExpanded["favoriteCategory"]> = ["AI Chat", "การเรียน", "การเงิน", "ปฏิทิน", "วิดเจ็ต", "ไลฟ์สไตล์"];
const ALERTS = ["Normal", "Normal", "Normal", "Normal", "Needs follow-up", "High token burn", "Margin low", "Normal"];
const STATUSES: Array<"active" | "inactive" | "suspended"> = ["active", "active", "active", "active", "active", "inactive", "suspended", "active"];

const TOTAL_USERS = 6456;
const rand = seededRandom(42);

function genDate(startYear: number, endYear: number) {
  const start = new Date(`${startYear}-01-01`).getTime();
  const end = new Date(`${endYear}-12-31`).getTime();
  const d = new Date(start + rand() * (end - start));
  return d.toISOString().slice(0, 10);
}

function genLastLogin() {
  const day = Math.floor(rand() * 3) + 1;
  const h = String(Math.floor(rand() * 24)).padStart(2, "0");
  const m = String(Math.floor(rand() * 60)).padStart(2, "0");
  return `2026-03-0${day} ${h}:${m}`;
}

function pickPlan(): PlanKey {
  const r = rand();
  if (r < 0.38) return "FREE";
  if (r < 0.63) return "PLUS_MONTHLY";
  if (r < 0.85) return "PLUS_TERM";
  return "PLUS_YEARLY";
}

export const managedUsers: UserTableRowExpanded[] = Array.from({ length: TOTAL_USERS }, (_, i) => {
  const plan = pickPlan();
  const firstName = FIRST_NAMES[Math.floor(rand() * FIRST_NAMES.length)];
  const lastInit = LAST_INITIALS[Math.floor(rand() * LAST_INITIALS.length)];
  const expectedTotalTokens = plan === "FREE"
    ? Math.floor(rand() * 8000 + 2000)
    : Math.floor(rand() * 40000 + 5000);

  const inputVoiceTokens = Math.floor(expectedTotalTokens * 0.35);
  const inputTextTokens = Math.floor(expectedTotalTokens * 0.25);
  const outputTextTokens = expectedTotalTokens - inputVoiceTokens - inputTextTokens;

  const costPerToken = 0.0045 + rand() * 0.002;
  const aiCallsTotal = Math.floor(rand() * 500 + 50);
  const heyLilacActivations = Math.floor(aiCallsTotal * (0.2 + rand() * 0.5));
  const widgetInstalls = Math.floor(rand() * 200);
  const streak = Math.floor(rand() * 30);
  const status = STATUSES[Math.floor(rand() * STATUSES.length)];
  const signupDate = genDate(2025, 2026);
  const daysAgo = Math.floor(rand() * 30);
  const lastActiveDate = new Date();
  lastActiveDate.setDate(lastActiveDate.getDate() - daysAgo);

  return {
    id: `U-${String(i + 1).padStart(4, "0")}`,
    name: `${firstName} ${lastInit}`,
    email: `${firstName.toLowerCase()}.${lastInit.toLowerCase().replace(".", "")}@mail.com`,
    avatar: `https://ui.shadcn.com/avatars/0${(i % 6) + 1}.png`,
    plan,
    signupDate,
    lastActive: lastActiveDate.toISOString().slice(0, 10),
    favoriteCategory: CATEGORIES[Math.floor(rand() * CATEGORIES.length)],
    systemAlert: ALERTS[Math.floor(rand() * ALERTS.length)],
    inputVoiceTokens,
    inputTextTokens,
    outputTextTokens,
    aiCostTHB: Math.round(expectedTotalTokens * costPerToken),
    aiCallsTotal,
    heyLilacActivations,
    widgetInstalls,
    status,
    lastLogin: genLastLogin(),
    streak,
  };
});

export const pendingUsersCount = managedUsers.filter((u) => u.status === "inactive").length;

/* ──────────────────────────────────────────────
 * Computed KPIs (synced from users dataset)
 * ────────────────────────────────────────────── */
const totalUsers = managedUsers.length;
const freeUsers = managedUsers.filter((u) => u.plan === "FREE").length;
const plusUsers = totalUsers - freeUsers;
const plusMonthly = managedUsers.filter((u) => u.plan === "PLUS_MONTHLY").length;
const plusTerm = managedUsers.filter((u) => u.plan === "PLUS_TERM").length;
const plusYearly = managedUsers.filter((u) => u.plan === "PLUS_YEARLY").length;
const totalMonthlyTokens = managedUsers.reduce((s, u) => s + u.inputVoiceTokens + u.inputTextTokens + u.outputTextTokens, 0);
const totalAiCost = managedUsers.reduce((s, u) => s + u.aiCostTHB, 0);
const totalAiCalls = managedUsers.reduce((s, u) => s + u.aiCallsTotal, 0);
const totalWidgetInstalls = managedUsers.reduce((s, u) => s + u.widgetInstalls, 0);

// MRR calculation from real plan mix
const mrr = (plusMonthly * 59) + (plusTerm * Math.round(199 / 4)) + (plusYearly * Math.round(599 / 12));
const arr = mrr * 12;
const conversionRate = ((plusUsers / totalUsers) * 100).toFixed(1);
const dau = Math.round(totalUsers * 0.26);
const arpu = Math.round(mrr / Math.max(plusUsers, 1));
const ltv = Math.round(arpu * 14);

/* ──────────────────────────────────────────────
 * 1. Dashboard (Overview) – Page 1
 * ────────────────────────────────────────────── */

// 1.1 System Alert Banner
export type SystemAlert = {
  id: string;
  severity: "critical" | "warning" | "info";
  title: string;
  message: string;
  linkTo: string;
  linkLabel: string;
  dismissed: boolean;
};

export const systemAlerts: SystemAlert[] = [
  {
    id: "SA-001",
    severity: "critical",
    title: "อัตราข้อผิดพลาด AI สูง",
    message: "อัตราข้อผิดพลาดเกิน 2% ในช่วง 1 ชั่วโมงที่ผ่านมา (ปัจจุบัน 3.2%)",
    linkTo: "/ai-monitor",
    linkLabel: "ดูตรวจสอบ AI",
    dismissed: false,
  },
  {
    id: "SA-002",
    severity: "warning",
    title: "วิดเจ็ตตอบสนองช้า",
    message: "ข้อมูลบนวิดเจ็ตอัปเดตช้าเฉลี่ย 2.8 นาที เกินเป้าหมาย 2.5 นาที",
    linkTo: "/ai-monitor",
    linkLabel: "ดูรายละเอียด",
    dismissed: false,
  },
  {
    id: "SA-003",
    severity: "info",
    title: "คำถามที่ถูกตั้งธงเพิ่มขึ้น",
    message: "พบคำถามที่ถูกตั้งธงเพิ่มขึ้น 15% ในรอบ 24 ชั่วโมง",
    linkTo: "/ai-monitor",
    linkLabel: "ตรวจสอบ",
    dismissed: false,
  },
];

// 1.2 Stat Cards (5 cards)
export const overviewKpis = [
  { label: "ผู้ใช้ทั้งหมด", value: totalUsers.toLocaleString(), delta: "+5.2%", trend: "up" as TrendType },
  { label: "ผู้ใช้งานวันนี้ (DAU)", value: dau.toLocaleString(), delta: "+3.1%", trend: "up" as TrendType },
  { label: "สมาชิก PLUS", value: plusUsers.toLocaleString(), delta: `${conversionRate}% อัปเกรด`, trend: "up" as TrendType },
  { label: "AI Calls วันนี้", value: Math.round(totalAiCalls / 30).toLocaleString(), delta: `~${(totalAiCalls / 30 / dau).toFixed(1)}/คน`, trend: "up" as TrendType },
  { label: "ผู้ใช้งานที่ติดตั้งวิดเจ็ต", value: Math.round(totalWidgetInstalls / 30).toLocaleString(), delta: `${((managedUsers.filter((u) => u.widgetInstalls > 0).length / totalUsers) * 100).toFixed(0)}% ใช้งาน`, trend: "up" as TrendType },
];

// 1.3 User Growth Chart (FREE vs PLUS)
export const overviewGrowthFreeVsPlus = (() => {
  const data: Array<{ month: string; free: number; plus: number }> = [];
  const months = ["ต.ค.", "พ.ย.", "ธ.ค.", "ม.ค.", "ก.พ.", "มี.ค."];
  let freeBase = freeUsers - 300;
  let plusBase = plusUsers - 200;
  for (const month of months) {
    freeBase += Math.floor(rand() * 60 + 30);
    plusBase += Math.floor(rand() * 50 + 20);
    data.push({ month, free: freeBase, plus: plusBase });
  }
  return data;
})();

// 1.4 DAU Weekly
export const dauWeekly = ["จ", "อ", "พ", "พฤ", "ศ", "ส", "อา"].map((day) => {
  const lastWeek = Math.round(dau * (0.88 + rand() * 0.2));
  const thisWeek = Math.round(lastWeek * (0.94 + rand() * 0.2));
  return { day, lastWeek, thisWeek };
});

// 1.5 Retention Curve
export const retentionCurve = [
  { week: "W1", retention: 72, benchmark: 68 },
  { week: "W2", retention: 61, benchmark: 57 },
  { week: "W3", retention: 54, benchmark: 51 },
  { week: "W4", retention: 49, benchmark: 46 },
  { week: "W5", retention: 45, benchmark: 42 },
  { week: "W6", retention: 42, benchmark: 38 },
  { week: "W7", retention: 39, benchmark: 35 },
  { week: "W8", retention: 36, benchmark: 33 },
];

// 1.6 Feature Usage Donut
export const featureUsageDonut = [
  { feature: "AI Chat", value: 31 },
  { feature: "การเรียน", value: 24 },
  { feature: "การเงิน", value: 18 },
  { feature: "ปฏิทิน", value: 11 },
  { feature: "วิดเจ็ต", value: 10 },
  { feature: "อื่นๆ", value: 6 },
];

// 1.7 Conversion Funnel
export const conversionFunnel = [
  { step: "สมัครใหม่", users: 6200, dropOff: 0 },
  { step: "ใช้งาน 3 วัน", users: 4380, dropOff: 29.3 },
  { step: "ครบ 7 วัน", users: 3070, dropOff: 29.9 },
  { step: "อัปเกรด PLUS", users: plusUsers, dropOff: +(((3070 - plusUsers) / 3070) * 100).toFixed(1) },
];

// 1.8 Activity Feed
export const activityFeed = [
  { id: "EV-001", type: "join", userName: "Pimnara T.", text: "สมัครใหม่และเริ่มใช้งานทันที", time: "2 นาทีที่แล้ว" },
  { id: "EV-002", type: "upgrade", userName: "Napat K.", text: "อัปเกรดเป็น Plus+ รายปี", time: "7 นาทีที่แล้ว" },
  { id: "EV-003", type: "warning", userName: "System", text: "Wake word accuracy ลดลงในบางภูมิภาค", time: "15 นาทีที่แล้ว" },
  { id: "EV-004", type: "milestone", userName: "Film R.", text: "ใช้งาน AI ครบ 1,000 ครั้ง", time: "27 นาทีที่แล้ว" },
  { id: "EV-005", type: "churn", userName: "Palm W.", text: "ยกเลิกแพ็กเกจรายเดือน", time: "43 นาทีที่แล้ว" },
  { id: "EV-006", type: "voice_error", userName: "System", text: "พบเสียงผิดพลาดสูงกว่าปกติ 1.8%", time: "1 ชั่วโมงที่แล้ว" },
];

// 1.9 Top AI Prompts
export const topTextPrompts = [
  { prompt: "ช่วยสรุปบทเรียนวิชาฟิสิกส์", count: 4820, percentage: 16.8 },
  { prompt: "จัดตารางอ่านหนังสือสอบ", count: 4390, percentage: 15.3 },
  { prompt: "อธิบายงบกำไรขาดทุนแบบง่าย", count: 3720, percentage: 13.0 },
  { prompt: "แปลเนื้อหานี้เป็นภาษาอังกฤษ", count: 3185, percentage: 11.1 },
  { prompt: "ช่วยวางแผนการเงินรายเดือน", count: 2950, percentage: 10.3 },
];


export const widgetQuickActions = [
  { prompt: "แตะดูตารางเรียน", count: 3920, percentage: 33.4 },
  { prompt: "แตะบันทึกรายจ่าย", count: 3050, percentage: 26.0 },
  { prompt: "แตะสรุปงานวันนี้", count: 2810, percentage: 23.9 },
  { prompt: "แตะเปิด AI Chat", count: 1960, percentage: 16.7 },
];

/* ──────────────────────────────────────────────
 * 2. Users – Page 2
 * ────────────────────────────────────────────── */
export const userStatsBar = [
  { label: "ผู้ใช้ทั้งหมด", value: totalUsers.toLocaleString() },
  { label: "Active 7 วัน", value: Math.round(totalUsers * 0.68).toLocaleString() },
  { label: "FREE", value: freeUsers.toLocaleString() },
  { label: "PLUS", value: plusUsers.toLocaleString() },
  { label: "ผู้ใช้ใหม่วันนี้", value: Math.round(totalUsers * 0.008).toLocaleString() },
  { label: "Churn 30 วัน", value: Math.round(totalUsers * 0.021).toLocaleString() },
];

export const retentionCohorts = [
  { cohort: "2026-01", users: 1480, w1: 74, w2: 62, w4: 50, w8: 38 },
  { cohort: "2026-02", users: 1550, w1: 76, w2: 64, w4: 53, w8: 40 },
  { cohort: "2026-03", users: 1680, w1: 79, w2: 67, w4: 56, w8: 43 },
];

export const churnList = managedUsers
  .filter((u) => u.plan !== "FREE")
  .slice(0, 30)
  .map((u, idx) => ({
    userId: u.id,
    name: u.name,
    reason: ["ราคาแพง", "ยังไม่เห็นความต่าง", "ใช้งานไม่ต่อเนื่อง", "ปัญหาด้านเสียง", "เปลี่ยนความต้องการ"][idx % 5],
    plusDuration: `${Math.round(1 + rand() * 10)} เดือน`,
    aiCallsBefore: u.aiCallsTotal,
    churnedAt: `2026-0${((idx % 3) + 1)}-${String((idx % 27) + 1).padStart(2, "0")}`,
  }));

/* ──────────────────────────────────────────────
 * 3. AI Monitor – Page 3
 * ────────────────────────────────────────────── */
export const aiMonitorStats = [
  { label: "AI Calls วันนี้", value: Math.round(totalAiCalls / 30).toLocaleString(), note: "ข้อความ + วิดเจ็ต" },
  { label: "อัตราการแตะวิดเจ็ตต่อวัน", value: "12,450", note: "การแตะวิดเจ็ตเฉลี่ย" },
  { label: "วิดเจ็ตโหลดข้อมูลไม่สำเร็จ", value: "1.8%", note: "เป้าหมาย < 2%" },
  { label: "ความล่าช้าของข้อมูล", value: "1.4m", note: "ความล่าช้าเฉลี่ย < 2m" },
  { label: "ทำรายการสำเร็จ", value: "93.2%", note: "หลังแตะวิดเจ็ต" },
  { label: "หยุดกลางคัน", value: "0.3%", note: "หลังเปิดแอปจากวิดเจ็ต" },
];

export const aiCallVolumeHourly = (() => {
  const data: Array<{ hour: string; text: number; voice: number }> = [];
  for (let h = 0; h < 24; h++) {
    const baseText = h >= 7 && h <= 22 ? 180 + Math.floor(rand() * 120) : 30 + Math.floor(rand() * 40);
    const baseVoice = h >= 7 && h <= 22 ? 80 + Math.floor(rand() * 60) : 10 + Math.floor(rand() * 15);
    data.push({ hour: `${String(h).padStart(2, "0")}:00`, text: baseText, voice: baseVoice });
  }
  return data;
})();

export const errorRateHourly = (() => {
  const data: Array<{ hour: string; errorRate: number; median: number; p95: number }> = [];
  for (let h = 0; h < 24; h++) {
    data.push({
      hour: `${String(h).padStart(2, "0")}:00`,
      errorRate: +(0.8 + rand() * 2.5).toFixed(1),
      median: Math.round(800 + rand() * 600),
      p95: Math.round(1500 + rand() * 1200),
    });
  }
  return data;
})();

export const voiceMonitorMetrics = {
  wakeWordDetectionRate: 94.2,
  falseActivationRate: 0.7,
  voiceRecognitionAccuracy: { overall: 93.8, thai: 94.6, english: 92.4, mixed: 91.8 },
  voiceResponseLatency: { total: 2.3, stt: 0.8, aiProcessing: 0.9, tts: 0.6 },
  dropOffAfterWakeWord: 18.1,
  voiceAdoptionRate: { everUsed: 62.4, primaryUsers: 21.8 },
};

export const widgetInsightsMetrics = {
  installRate: 35.2,
  uninstallRate: 4.5,
  timeToInstall: { d1: 45.2, d3: 20.5, d7: 15.1, d30: 19.2 },
  tapRate: { daily: 12.5, weekly: 45.2, monthly: 78.4 },
  tapToActionCompletion: 88.5,
  dropOffAfterTap: 11.5,
  widgetLoadError: 1.2,
  dataStaleness: 0.8,
};

export const unresolvedQueries = [
  { query: "ช่วยจองตั๋วเครื่องบินให้หน่อย", count: 89, category: "off-topic" },
  { query: "ราคาทองวันนี้เท่าไหร่", count: 67, category: "ไลฟ์สไตล์" },
  { query: "แปลโค้ด Python นี้ให้หน่อย", count: 45, category: "การเรียน" },
  { query: "วิเคราะห์หุ้น xxx ให้หน่อย", count: 38, category: "การเงิน" },
  { query: "เขียน essay ภาษาจีนให้หน่อย", count: 31, category: "การเรียน" },
];

export type FlaggedPrompt = {
  id: string;
  query: string;
  category: "inappropriate" | "privacy-sensitive" | "off-topic";
  count: number;
  isFalsePositive: boolean;
};

export const flaggedPrompts: FlaggedPrompt[] = [
  { id: "FP-01", query: "***ข้อมูลส่วนบุคคลของคนอื่น***", category: "privacy-sensitive", count: 12, isFalsePositive: false },
  { id: "FP-02", query: "***เนื้อหาไม่เหมาะสม***", category: "inappropriate", count: 8, isFalsePositive: false },
  { id: "FP-03", query: "สลอตออนไลน์เล่นยังไง", category: "off-topic", count: 6, isFalsePositive: false },
  { id: "FP-04", query: "ช่วยเขียนใบลาให้ (mock false)", category: "off-topic", count: 4, isFalsePositive: true },
];

export const tokenUsageCost = {
  today: { tokens: Math.round(totalMonthlyTokens / 30), cost: Math.round(totalAiCost / 30) },
  thisMonth: { tokens: totalMonthlyTokens, cost: totalAiCost },
  lastMonth: { tokens: Math.round(totalMonthlyTokens * 0.92), cost: Math.round(totalAiCost * 0.92) },
  costPerUserFree: Math.round(totalAiCost / Math.max(freeUsers, 1) * 0.3),
  costPerUserPlus: Math.round(totalAiCost / Math.max(plusUsers, 1) * 0.7),
};

export const tokenUsageDaily = (() => {
  const data: Array<{ day: string; tokens: number; cost: number }> = [];
  for (let i = 1; i <= 30; i++) {
    data.push({
      day: String(i),
      tokens: Math.round((totalMonthlyTokens / 30) * (0.85 + rand() * 0.3)),
      cost: Math.round((totalAiCost / 30) * (0.85 + rand() * 0.3)),
    });
  }
  return data;
})();

export const aiModelUsage = [
  {
    model: "GPT-4o mini",
    description: "ประมวลผลข้อความและการโต้ตอบ (Text Input/Output)",
    pricing: "In: ฿5.37 / Out: ฿21.48 (ต่อ 1M Token)",
    tokens: Math.round(totalMonthlyTokens * 0.55),
    costTHB: Math.round(totalAiCost * 0.30)
  },
  {
    model: "Claude 3.5 Haiku",
    description: "สรุปเนื้อหายาว และจัดรูปแบบโน้ต (Text Output)",
    pricing: "In: ฿9.00 / Out: ฿45.00 (ต่อ 1M Token)",
    tokens: Math.round(totalMonthlyTokens * 0.25),
    costTHB: Math.round(totalAiCost * 0.20)
  },
  {
    model: "OpenAI Whisper",
    description: "ถอดเสียงบรรยายเป็นข้อความ (Voice to Text)",
    pricing: "฿0.21 ต่อความยาวเสียง 1 นาที",
    tokens: Math.round(totalMonthlyTokens * 0.20),
    costTHB: Math.round(totalAiCost * 0.50)
  },
];

export type AiUsageRow = {
  userId: string;
  plan: PlanKey;
  inputVoiceTokens: number;
  inputTextTokens: number;
  outputTextTokens: number;
  revenueTHB: number;
  costTHB: number;
};

export const aiUsageRows: AiUsageRow[] = [...managedUsers]
  .sort((a, b) => (b.inputVoiceTokens + b.inputTextTokens + b.outputTextTokens) - (a.inputVoiceTokens + a.inputTextTokens + a.outputTextTokens))
  .slice(0, 20)
  .map((u) => ({
    userId: u.id,
    plan: u.plan,
    inputVoiceTokens: u.inputVoiceTokens,
    inputTextTokens: u.inputTextTokens,
    outputTextTokens: u.outputTextTokens,
    revenueTHB: PLAN_PRICES[u.plan],
    costTHB: u.aiCostTHB,
  }));

/* ──────────────────────────────────────────────
 * 4. Finance – Page 4 (Business Revenue)
 * ────────────────────────────────────────────── */

// 4.1 Revenue Stats Bar
export const financeRevenueStats = [
  { label: "MRR", value: `฿${mrr.toLocaleString()}`, delta: "+6.2%", trend: "up" as TrendType },
  { label: "ARR", value: `฿${arr.toLocaleString()}`, delta: "+6.2%", trend: "up" as TrendType },
  { label: "ARPU", value: `฿${arpu}`, delta: "+2.1%", trend: "up" as TrendType },
  { label: "LTV", value: `฿${ltv.toLocaleString()}`, delta: "+3.8%", trend: "up" as TrendType },
];

// 4.2 MRR Trend Chart (12 months)
export const mrrTrend = (() => {
  const data: Array<{ month: string; newMRR: number; expansionMRR: number; churnedMRR: number; netMRR: number }> = [];
  const months = ["เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค.", "ม.ค.", "ก.พ.", "มี.ค."];
  let baseMrr = Math.round(mrr * 0.5);
  for (const month of months) {
    const newMrr = Math.round(baseMrr * 0.12 + rand() * baseMrr * 0.05);
    const expansion = Math.round(baseMrr * 0.04 + rand() * baseMrr * 0.02);
    const churned = Math.round(baseMrr * 0.04 + rand() * baseMrr * 0.02);
    const net = baseMrr + newMrr + expansion - churned;
    data.push({ month, newMRR: newMrr, expansionMRR: expansion, churnedMRR: churned, netMRR: net });
    baseMrr = net;
  }
  return data;
})();

// 4.3 MRR Movement Waterfall
const lastMonthMrr = Math.round(mrr * 0.94);
const newMrrMovement = Math.round(mrr * 0.08);
const expansionMrrMovement = Math.round(mrr * 0.03);
const churnedMrrMovement = Math.round(mrr * 0.04);
const contractionMrrMovement = Math.round(mrr * 0.01);

export const mrrWaterfall = [
  { label: "MRR เดือนที่แล้ว", value: lastMonthMrr, type: "start" as const },
  { label: "New MRR", value: newMrrMovement, type: "add" as const },
  { label: "Expansion MRR", value: expansionMrrMovement, type: "add" as const },
  { label: "Churned MRR", value: -churnedMrrMovement, type: "subtract" as const },
  { label: "Contraction MRR", value: -contractionMrrMovement, type: "subtract" as const },
  { label: "MRR เดือนนี้", value: mrr, type: "end" as const },
];

// 4.4 Churn Analysis
export const churnAnalysis = {
  churnRate: 2.1,
  churnByTenure: [
    { tenure: "1 เดือน", rate: 8.2 },
    { tenure: "2-3 เดือน", rate: 4.5 },
    { tenure: "4-6 เดือน", rate: 2.1 },
    { tenure: "6+ เดือน", rate: 0.8 },
  ],
  churnReasons: [
    { reason: "ราคาแพงเกินไป", ratio: 31 },
    { reason: "ไม่ได้ใช้งาน", ratio: 27 },
    { reason: "ต้องการฟีเจอร์เพิ่ม", ratio: 21 },
    { reason: "ปัญหาทางเทคนิค", ratio: 13 },
    { reason: "อื่นๆ", ratio: 8 },
  ],
};

// 4.5 Revenue by Plan & Billing Cycle
export const revenueByPlan = [
  { plan: "Plus+ Monthly", revenue: plusMonthly * 59, percentage: Math.round((plusMonthly * 59) / Math.max(mrr, 1) * 100) },
  { plan: "Plus+ Term", revenue: plusTerm * Math.round(199 / 4), percentage: Math.round((plusTerm * Math.round(199 / 4)) / Math.max(mrr, 1) * 100) },
  { plan: "Plus+ Yearly", revenue: plusYearly * Math.round(599 / 12), percentage: Math.round((plusYearly * Math.round(599 / 12)) / Math.max(mrr, 1) * 100) },
];

// 4.6 Transaction History Table
export const transactionHistory = managedUsers
  .filter((u) => u.plan !== "FREE")
  .slice(0, 20)
  .map((u, i) => ({
    id: `TXN-${String(i + 1).padStart(4, "0")}`,
    date: `2026-03-0${Math.min(4, (i % 4) + 1)}`,
    user: u.name,
    userId: u.id,
    amount: PLAN_PRICES[u.plan],
    plan: PLAN_LABELS[u.plan],
    paymentMethod: i % 3 === 0 ? "Credit Card" : i % 3 === 1 ? "PromptPay" : "Mobile Banking",
    status: i % 5 === 3 ? "failed" as const : i % 7 === 4 ? "refunded" as const : "success" as const,
  }));

// 4.7 Projected MRR
export const projectedMrr = {
  optimistic: Math.round(mrr * 1.08),
  base: Math.round(mrr * 1.04),
  pessimistic: Math.round(mrr * 0.97),
  renewals: Math.round(plusUsers * 0.85),
  expiring: Math.round(plusUsers * 0.15),
};

/* ──────────────────────────────────────────────
 * 5. Notifications & Broadcast – Page 5
 * ────────────────────────────────────────────── */

// 5.1 Campaign Stats
export const notificationEffectivenessKpis = [
  { label: "แคมเปญเดือนนี้", value: "18", note: "ส่งแล้ว 14 / แบบร่าง 4" },
  { label: "อัตราเปิดอ่านเฉลี่ย", value: "48%", note: "เฉลี่ยทุกแคมเปญ" },
  { label: "อัตราคลิกเฉลี่ย", value: "18%", note: "กดเข้าเนื้อหา" },
  { label: "ผู้ใช้ที่กลับมา", value: "342", note: "กลับมาใช้งานจากการแจ้งเตือน" },
];

// 5.2 Notification categories & audience targets
export const noticeCategories = ["รวม", "สำคัญ", "ระบบ", "การเงิน"];
export const notificationTypes = ["Push Notification", "In-App Banner", "In-App Modal"];
export const audienceTargets = [
  "ผู้ใช้ทั้งหมด",
  "ผู้ใช้ FREE ทั้งหมด",
  "ผู้ใช้ PLUS ทั้งหมด",
  "ไม่ใช้งาน 3 วัน",
  "ไม่ใช้งาน 7 วัน",
  "ยังไม่เคยติดตั้งวิดเจ็ต",
  "PLUS กำลังหมดอายุ 7 วัน",
  "สมัครใหม่ 3 วัน (ต้อนรับ)",
  "ยกเลิก PLUS 30 วัน (ดึงกลับ)",
  "กำหนดเอง",
];

export type BroadcastLogRow = {
  id: string;
  title: string;
  category: string;
  type: string;
  audience: string;
  sentAt: string;
  status: "Sent" | "Draft" | "Scheduled";
  metrics?: { sent: number; delivered: number; opened: number; clicked: number };
};

export const broadcastLogs: BroadcastLogRow[] = [
  { id: "NTF-001", title: "แจ้งเตือนระบบชำระเงิน", category: "การเงิน", type: "Push Notification", audience: "ผู้ใช้ทั้งหมด", sentAt: "2026-03-03 10:20", status: "Sent", metrics: { sent: 6456, delivered: 6320, opened: 3120, clicked: 890 } },
  { id: "NTF-002", title: "โปรโมชัน Plus+ สุดสัปดาห์", category: "สำคัญ", type: "In-App Banner", audience: "FREE users ทั้งหมด", sentAt: "2026-03-02 19:11", status: "Sent", metrics: { sent: 2453, delivered: 2410, opened: 1680, clicked: 520 } },
  { id: "NTF-003", title: "ลองใช้วิดเจ็ตสิ!", category: "ระบบ", type: "In-App Modal", audience: "ยังไม่เคยติดตั้งวิดเจ็ต", sentAt: "2026-03-01 08:00", status: "Sent", metrics: { sent: 1200, delivered: 1180, opened: 780, clicked: 340 } },
  { id: "NTF-004", title: "Win-back: มาใช้ PLUS อีกครั้ง", category: "สำคัญ", type: "Push Notification", audience: "ยกเลิก PLUS 30 วัน (win-back)", sentAt: "", status: "Draft" },
];

// 5.5 Schedule
export const scheduleTimezones = ["Asia/Bangkok", "UTC", "America/New_York"];
export const scheduleRecurrence = ["ไม่ซ้ำ", "ทุกวัน", "ทุกสัปดาห์", "ทุกเดือน"];

// 5.6 Campaign Performance
export const notificationDeliveryTrend = [
  { day: "จ", sent: 4510, opened: 2130, clicked: 808, acted: 492 },
  { day: "อ", sent: 4620, opened: 2240, clicked: 842, acted: 510 },
  { day: "พ", sent: 4700, opened: 2286, clicked: 871, acted: 535 },
  { day: "พฤ", sent: 4880, opened: 2345, clicked: 905, acted: 560 },
  { day: "ศ", sent: 5015, opened: 2410, clicked: 928, acted: 590 },
  { day: "ส", sent: 4380, opened: 2035, clicked: 730, acted: 448 },
  { day: "อา", sent: 4345, opened: 1985, clicked: 756, acted: 429 },
];

export const notificationCategoryPerformance = [
  { category: "รวม", sent: 11200, openRate: 46, clickRate: 17, actionRate: 10 },
  { category: "สำคัญ", sent: 9400, openRate: 57, clickRate: 24, actionRate: 15 },
  { category: "ระบบ", sent: 6100, openRate: 52, clickRate: 12, actionRate: 9 },
  { category: "การเงิน", sent: 5750, openRate: 43, clickRate: 19, actionRate: 11 },
];

// 5.7 A/B Test
export type ABTest = {
  id: string;
  name: string;
  variantA: string;
  variantB: string;
  metric: string;
  status: "running" | "completed";
  resultA: number;
  resultB: number;
  winner?: "A" | "B";
};

export const abTests: ABTest[] = [
  { id: "AB-001", name: "Upgrade CTA", variantA: "🎉 อัปเกรดตอนนี้!", variantB: "ลองใช้ PLUS ฟรี 7 วัน", metric: "Click Rate", status: "completed", resultA: 12, resultB: 18, winner: "B" },
  { id: "AB-002", name: "Win-back Message", variantA: "เราคิดถึงคุณ", variantB: "มีฟีเจอร์ใหม่รอคุณอยู่", metric: "Open Rate", status: "running", resultA: 45, resultB: 52 },
];

/* ──────────────────────────────────────────────
 * 6. Settings – Page 6
 * ────────────────────────────────────────────── */

// 6.1 Admin Accounts & Roles
export type AdminAccount = {
  id: string;
  name: string;
  email: string;
  role: string;
  lastLogin: string;
  avatar: string;
};

export const adminAccounts: AdminAccount[] = [
  { id: "ADM-01", name: "Admin User", email: "admin@lilac.ai", role: "Super Admin", lastLogin: "2026-03-04 14:30", avatar: "https://ui.shadcn.com/avatars/01.png" },
  { id: "ADM-02", name: "Operations Lead", email: "ops@lilac.ai", role: "Admin", lastLogin: "2026-03-04 12:15", avatar: "https://ui.shadcn.com/avatars/02.png" },
  { id: "ADM-03", name: "Finance Viewer", email: "finance@lilac.ai", role: "Finance", lastLogin: "2026-03-03 09:00", avatar: "https://ui.shadcn.com/avatars/03.png" },
  { id: "ADM-04", name: "Support Staff 1", email: "support1@lilac.ai", role: "Support", lastLogin: "2026-03-04 10:45", avatar: "https://ui.shadcn.com/avatars/04.png" },
  { id: "ADM-05", name: "Marketing Lead", email: "marketing@lilac.ai", role: "Marketing", lastLogin: "2026-03-04 08:30", avatar: "https://ui.shadcn.com/avatars/05.png" },
];

export const adminRoles = [
  { role: "Super Admin", access: "เข้าถึงทุกหน้า ทุก action รวมถึง Settings", users: 1 },
  { role: "Admin", access: "เข้าถึงทุกหน้า ยกเว้น Settings > Admin Management", users: 2 },
  { role: "Finance", access: "เข้าถึงหน้า Finance เท่านั้น (read-only)", users: 1 },
  { role: "Support", access: "เข้าถึงหน้า Users (read + basic actions) และ Dashboard", users: 3 },
  { role: "Marketing", access: "เข้าถึงหน้า Notifications และ Dashboard", users: 1 },
];

// 6.2 Feature Flags
export type FeatureFlag = {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  rolloutPercent: number;
  targetGroup: string;
};

export const featureFlags: FeatureFlag[] = [
  { id: "FF-01", name: "Widget Insights Feature", description: "เปิด/ปิดฟีเจอร์ Widget Insights ทั้งระบบ", enabled: true, rolloutPercent: 100, targetGroup: "ทุกคน" },
  { id: "FF-02", name: "PLUS Upgrade Prompt", description: "แสดง upsell banner ใน app", enabled: true, rolloutPercent: 80, targetGroup: "FREE users" },
  { id: "FF-03", name: "New Onboarding Flow", description: "Onboarding flow ใหม่สำหรับ A/B test", enabled: true, rolloutPercent: 50, targetGroup: "ผู้ใช้ใหม่" },
  { id: "FF-04", name: "AI Model V2", description: "สลับไปใช้ AI model version ใหม่", enabled: false, rolloutPercent: 0, targetGroup: "PLUS users" },
];

// 6.3 Audit Log
export type AuditLogEntry = {
  id: string;
  timestamp: string;
  adminName: string;
  action: string;
  target: string;
  before: string;
  after: string;
};

export const auditLog: AuditLogEntry[] = [
  { id: "AUD-01", timestamp: "2026-03-04 14:30", adminName: "Admin User", action: "เปลี่ยนแผน user", target: "U-0042", before: "FREE", after: "PLUS_MONTHLY" },
  { id: "AUD-02", timestamp: "2026-03-04 12:15", adminName: "Operations Lead", action: "ระงับบัญชี", target: "U-1293", before: "active", after: "suspended" },
  { id: "AUD-03", timestamp: "2026-03-04 10:00", adminName: "Admin User", action: "เปลี่ยน Feature Flag", target: "FF-03", before: "rollout 30%", after: "rollout 50%" },
  { id: "AUD-04", timestamp: "2026-03-03 18:45", adminName: "Admin User", action: "อัปเดต API Key", target: "Anthropic API", before: "sk-***old", after: "sk-***new" },
  { id: "AUD-05", timestamp: "2026-03-03 15:20", adminName: "Operations Lead", action: "ส่ง Broadcast", target: "NTF-003", before: "Draft", after: "Sent" },
  { id: "AUD-06", timestamp: "2026-03-03 11:00", adminName: "Admin User", action: "เปลี่ยนราคาแพ็กเกจ", target: "Plus+ Monthly", before: "฿49", after: "฿59" },
];

// 6.4 API & Integration Config
export type SystemPolicyConfig = {
  nsfwCheck: boolean;
  autoSuspend150: boolean;
};

export const defaultSystemSettings = {
  projectName: "Lilac Admin Platform",
  baseUrl: "https://admin.lilac.mock",
  supportEmail: "support@lilac.mock",
  adminErrorEmail: true,
  timezone: "Asia/Bangkok",
};

export const defaultApiSettings = {
  anthropicKey: "sk-ant-xxxxx-xxxxx",
  defaultModel: "claude-sonnet-4" as string,
  maxTokensPerRequest: 4096,
  rateLimitPerUser: 100,
  wakeWordSensitivity: 0.7,
  voiceTimeout: 5,
  voiceFallbackBehavior: "text-input" as string,
  webhookUrl: "https://api.lilac.mock/webhooks/payment",
};

export const defaultSystemPolicy: SystemPolicyConfig = {
  nsfwCheck: true,
  autoSuspend150: false,
};

// 6.5 Plan & Pricing Settings
export const planPricingSettings = {
  plans: subscriptionPlans,
  freeTrialDays: 7,
  requireCreditCard: false,
  gracePeriodDays: 3,
  freeDailyAiLimit: 20,
  plusUnlimitedVoice: true,
};

// Additional exports needed by other files
export const plusFeatures = [
  { id: "pf-01", title: "Priority AI Responses", description: "ลดเวลา Response ในช่วง Peak", visible: true },
  { id: "pf-02", title: "Extended Token Quota", description: "เพิ่มโควตา Token รายเดือน", visible: true },
  { id: "pf-03", title: "Advanced Insights", description: "รายงานเชิงลึกรายบุคคล", visible: false },
  { id: "pf-04", title: "Widget Usage", description: "ใช้ Widget ได้ไม่จำกัด", visible: true },
];

export const invoices = transactionHistory.filter(t => t.status === "success").map((t, i) => ({
  invoice: `INV-202603-${String(i + 1).padStart(3, "0")}`,
  user: t.userId,
  plan: t.plan,
  amountTHB: t.amount,
  issuedAt: t.date,
  status: "Paid" as const,
}));

export const churnReasonBreakdown = churnAnalysis.churnReasons.map(r => ({
  reason: r.reason,
  users: Math.round(134 * r.ratio / 100),
  ratio: r.ratio,
}));

export const subscriptionHealthKpis = [
  { label: "MRR", value: `฿${mrr.toLocaleString()}`, note: "Recurring ต่อเดือน" },
  { label: "Trial → Paid", value: "32.8%", note: "ย้อนหลัง 30 วัน" },
  { label: "Churn", value: "2.1%", note: "ลดลง 0.4%" },
  { label: "Estimated LTV", value: `฿${ltv.toLocaleString()}`, note: "เฉลี่ยต่อผู้ใช้ Plus+" },
];

export const trialConversionTrend = [
  { week: "W1", trialStarted: 820, paid: 255 },
  { week: "W2", trialStarted: 845, paid: 271 },
  { week: "W3", trialStarted: 801, paid: 259 },
  { week: "W4", trialStarted: 876, paid: 294 },
];
