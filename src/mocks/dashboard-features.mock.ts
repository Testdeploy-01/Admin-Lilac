export type TrendType = "up" | "down" | "neutral";

export type AiPeriod = "today" | "7d" | "month" | "year";

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
  avatar: string;
  plan: PlanKey;
  signupDate: string;
  favoriteCategory: "Study" | "Finance" | "Lifestyle";
  systemAlert: string;
  inputVoiceTokens: number;
  inputTextTokens: number;
  outputTextTokens: number;
  aiCostTHB: number;
  status: "active" | "suspended" | "new";
  lastLogin: string;
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
const CATEGORIES: Array<"Study" | "Finance" | "Lifestyle"> = ["Study", "Finance", "Lifestyle"];
const ALERTS = ["Normal", "Normal", "Normal", "Normal", "Needs follow-up", "High token burn", "Margin low", "Normal"];
const STATUSES: Array<"active" | "suspended" | "new"> = ["active", "active", "active", "active", "active", "suspended", "new", "new"];

const TOTAL_USERS = 6456;
const rand = seededRandom(42);

function genDate(startYear: number, endYear: number) {
  const start = new Date(`${startYear}-01-01`).getTime();
  const end = new Date(`${endYear}-12-31`).getTime();
  const d = new Date(start + rand() * (end - start));
  return d.toISOString().slice(0, 10);
}

function genLastLogin() {
  const day = Math.floor(rand() * 3) + 1; // 1-3 march
  const h = String(Math.floor(rand() * 24)).padStart(2, "0");
  const m = String(Math.floor(rand() * 60)).padStart(2, "0");
  return `2026-03-0${day} ${h}:${m}`;
}

function pickPlan(): PlanKey {
  const r = rand();
  // ~38% FREE, ~25% Monthly, ~22% Term, ~15% Yearly
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

  // Distribute total tokens into Voice Input, Text Input, and Text Output
  const inputVoiceTokens = Math.floor(expectedTotalTokens * 0.35); // Approx 35% Voice Input
  const inputTextTokens = Math.floor(expectedTotalTokens * 0.25); // Approx 25% Text Input
  const outputTextTokens = expectedTotalTokens - inputVoiceTokens - inputTextTokens; // Remaining 40% Text Output

  const costPerToken = 0.0045 + rand() * 0.002;
  return {
    id: `U-${String(i + 1).padStart(4, "0")}`,
    name: `${firstName} ${lastInit}`,
    avatar: `https://ui.shadcn.com/avatars/0${(i % 6) + 1}.png`,
    plan,
    signupDate: genDate(2025, 2026),
    favoriteCategory: CATEGORIES[Math.floor(rand() * CATEGORIES.length)],
    systemAlert: ALERTS[Math.floor(rand() * ALERTS.length)],
    inputVoiceTokens,
    inputTextTokens,
    outputTextTokens,
    aiCostTHB: Math.round(expectedTotalTokens * costPerToken),
    status: STATUSES[Math.floor(rand() * STATUSES.length)],
    lastLogin: genLastLogin(),
  };
});

export const pendingUsersCount = managedUsers.filter((u) => u.status === "new").length;

/* ──────────────────────────────────────────────
 * Computed KPIs (synced from users dataset)
 * ────────────────────────────────────────────── */
const totalUsers = managedUsers.length;
const freeUsers = managedUsers.filter((u) => u.plan === "FREE").length;
const plusUsers = totalUsers - freeUsers;
const plusMonthly = managedUsers.filter((u) => u.plan === "PLUS_MONTHLY").length;
const plusTerm = managedUsers.filter((u) => u.plan === "PLUS_TERM").length;
const plusYearly = managedUsers.filter((u) => u.plan === "PLUS_YEARLY").length;
// activeUsers / suspendedUsers / newUsers can be computed where needed
const totalMonthlyTokens = managedUsers.reduce((s, u) => s + u.inputVoiceTokens + u.inputTextTokens + u.outputTextTokens, 0);
const totalAiCost = managedUsers.reduce((s, u) => s + u.aiCostTHB, 0);

// MRR calculation from real plan mix
const mrr = (plusMonthly * 59) + (plusTerm * Math.round(199 / 4)) + (plusYearly * Math.round(599 / 12));
const conversionRate = ((plusUsers / totalUsers) * 100).toFixed(1);
const dau = Math.round(totalUsers * 0.26); // ~26% DAU

export const overviewKpis = [
  { label: "ผู้ใช้ทั้งหมด", value: totalUsers.toLocaleString(), delta: "+5.2%", trend: "up" as TrendType },
  { label: "ผู้ใช้วันนี้ (DAU)", value: dau.toLocaleString(), delta: "+3.1%", trend: "up" as TrendType },
  { label: "สมาชิก Plus+", value: plusUsers.toLocaleString(), delta: `${conversionRate}% conv`, trend: "up" as TrendType },
  { label: "ใช้งาน Shortcut วันนี้", value: Math.round(dau * 0.58).toLocaleString(), delta: "-1.3%", trend: "down" as TrendType },
];

export const overviewGrowth30d = (() => {
  const data: Array<{ day: string; users: number }> = [];
  let base = totalUsers - 600;
  for (let i = 1; i <= 30; i++) {
    base += Math.floor(rand() * 28 + 12);
    data.push({ day: String(i), users: base });
  }
  return data;
})();

export const overviewUsageByModule = [
  { module: "การเรียน", value: 46 },
  { module: "การเงิน", value: 31 },
  { module: "ไลฟ์สไตล์", value: 23 },
];

export const recentActivities = [
  { id: "ACT-01", text: "U-0042 สมัครแพ็กเกจ Plus+ รายปี", time: "2 นาทีที่แล้ว", kind: "payment" },
  { id: "ACT-02", text: "U-1293 เปิดใช้งาน Study Planner 3 ครั้ง", time: "9 นาทีที่แล้ว", kind: "user" },
  { id: "ACT-03", text: "ส่งแจ้งเตือนแคมเปญการเงินครบทุกกลุ่มแล้ว", time: "17 นาทีที่แล้ว", kind: "system" },
  { id: "ACT-04", text: "U-3210 รายงานปัญหาการรับ OTP", time: "24 นาทีที่แล้ว", kind: "feedback" },
  { id: "ACT-05", text: "ทีมแอดมินอัปเดต fallback model เป็น v4.1", time: "41 นาทีที่แล้ว", kind: "admin" },
];

export const popularFeatures = [
  { feature: "AI Study Summary", calls: 14230 },
  { feature: "Budget Auto-Categorization", calls: 12894 },
  { feature: "Lifestyle Mood Coach", calls: 11052 },
  { feature: "Exam Reminder", calls: 9821 },
  { feature: "Subscription Upgrade Prompt", calls: 7740 },
];

/* ──────────────────────────────────────────────
 * AI Manager
 * ────────────────────────────────────────────── */
export const aiAlert = {
  enabled: true,
  message: "พบการเรียก API สูงผิดปกติในช่วง 1 ชั่วโมงที่ผ่านมา",
};

export const aiPeriodStats: Record<
  AiPeriod,
  {
    kpis: Array<{ label: string; value: string; note: string }>;
    tokenCostBars: Array<{ label: string; tokens: number; costTHB: number }>;
    categoryShare: Array<{ category: string; value: number }>;
  }
> = {
  today: {
    kpis: [
      { label: "Token ทั้งหมด", value: Math.round(totalMonthlyTokens / 30).toLocaleString(), note: `จาก ${totalUsers.toLocaleString()} ผู้ใช้` },
      { label: "ต้นทุน AI", value: `฿${Math.round(totalAiCost / 30).toLocaleString()}`, note: "USD rate 35.8" },
      { label: "ความแม่นยำ Intent", value: "96.8%", note: `จาก ${Math.round(dau * 1.8).toLocaleString()} requests` },
      { label: "กำไรขั้นต้น", value: "61.2%", note: "เทียบกับรายได้สมาชิก" },
    ],
    tokenCostBars: [
      { label: "เช้า", tokens: 51200, costTHB: 1240 },
      { label: "บ่าย", tokens: 60400, costTHB: 1510 },
      { label: "เย็น", tokens: 56800, costTHB: 1392 },
      { label: "ดึก", tokens: 46500, costTHB: 1200 },
    ],
    categoryShare: [
      { category: "Study", value: 48 },
      { category: "Finance", value: 30 },
      { category: "Lifestyle", value: 22 },
    ],
  },
  "7d": {
    kpis: [
      { label: "Token ทั้งหมด", value: Math.round((totalMonthlyTokens / 30) * 7).toLocaleString(), note: `7 วัน • ${totalUsers.toLocaleString()} ผู้ใช้` },
      { label: "ต้นทุน AI", value: `฿${Math.round((totalAiCost / 30) * 7).toLocaleString()}`, note: "USD rate 35.8" },
      { label: "ความแม่นยำ Intent", value: "97.3%", note: `จาก ${Math.round(dau * 1.8 * 7).toLocaleString()} requests` },
      { label: "กำไรขั้นต้น", value: "58.4%", note: "เทียบกับรายได้สมาชิก" },
    ],
    tokenCostBars: [
      { label: "จันทร์", tokens: 178000, costTHB: 4320 },
      { label: "อังคาร", tokens: 169000, costTHB: 4250 },
      { label: "พุธ", tokens: 181000, costTHB: 4510 },
      { label: "พฤหัส", tokens: 176000, costTHB: 4430 },
      { label: "ศุกร์", tokens: 190000, costTHB: 4700 },
      { label: "เสาร์", tokens: 172000, costTHB: 4325 },
      { label: "อาทิตย์", tokens: 174000, costTHB: 4305 },
    ],
    categoryShare: [
      { category: "Study", value: 45 },
      { category: "Finance", value: 33 },
      { category: "Lifestyle", value: 22 },
    ],
  },
  month: {
    kpis: [
      { label: "Token ทั้งหมด", value: totalMonthlyTokens.toLocaleString(), note: `เดือนนี้ • ${totalUsers.toLocaleString()} ผู้ใช้` },
      { label: "ต้นทุน AI", value: `฿${totalAiCost.toLocaleString()}`, note: "USD rate 35.8" },
      { label: "ความแม่นยำ Intent", value: "97.1%", note: `จาก ${Math.round(dau * 1.8 * 30).toLocaleString()} requests` },
      { label: "กำไรขั้นต้น", value: "57.9%", note: "เทียบกับรายได้สมาชิก" },
    ],
    tokenCostBars: [
      { label: "สัปดาห์ 1", tokens: Math.round(totalMonthlyTokens * 0.24), costTHB: Math.round(totalAiCost * 0.24) },
      { label: "สัปดาห์ 2", tokens: Math.round(totalMonthlyTokens * 0.25), costTHB: Math.round(totalAiCost * 0.25) },
      { label: "สัปดาห์ 3", tokens: Math.round(totalMonthlyTokens * 0.26), costTHB: Math.round(totalAiCost * 0.26) },
      { label: "สัปดาห์ 4", tokens: Math.round(totalMonthlyTokens * 0.25), costTHB: Math.round(totalAiCost * 0.25) },
    ],
    categoryShare: [
      { category: "Study", value: 44 },
      { category: "Finance", value: 34 },
      { category: "Lifestyle", value: 22 },
    ],
  },
  year: {
    kpis: [
      { label: "Token ทั้งหมด", value: (totalMonthlyTokens * 12).toLocaleString(), note: `ปีนี้ • ${totalUsers.toLocaleString()} ผู้ใช้` },
      { label: "ต้นทุน AI", value: `฿${(totalAiCost * 12).toLocaleString()}`, note: "USD rate 35.8" },
      { label: "ความแม่นยำ Intent", value: "96.7%", note: `จาก ${(Math.round(dau * 1.8 * 365 / 1000000 * 100) / 100).toFixed(2)}M requests` },
      { label: "กำไรขั้นต้น", value: "55.8%", note: "เทียบกับรายได้สมาชิก" },
    ],
    tokenCostBars: [
      { label: "Q1", tokens: totalMonthlyTokens * 3, costTHB: totalAiCost * 3 },
      { label: "Q2", tokens: Math.round(totalMonthlyTokens * 3.1), costTHB: Math.round(totalAiCost * 3.1) },
      { label: "Q3", tokens: Math.round(totalMonthlyTokens * 3.05), costTHB: Math.round(totalAiCost * 3.05) },
      { label: "Q4", tokens: Math.round(totalMonthlyTokens * 2.85), costTHB: Math.round(totalAiCost * 2.85) },
    ],
    categoryShare: [
      { category: "Study", value: 43 },
      { category: "Finance", value: 35 },
      { category: "Lifestyle", value: 22 },
    ],
  },
};

export const aiModelUsage = [
  { model: "Claude Haiku", tokens: Math.round(totalMonthlyTokens * 0.62), costTHB: Math.round(totalAiCost * 0.42) },
  { model: "Claude Sonnet", tokens: Math.round(totalMonthlyTokens * 0.28), costTHB: Math.round(totalAiCost * 0.35) },
  { model: "Claude Opus", tokens: Math.round(totalMonthlyTokens * 0.10), costTHB: Math.round(totalAiCost * 0.23) },
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
 * Study Config
 * ────────────────────────────────────────────── */
const studyUsers = managedUsers.filter((u) => u.favoriteCategory === "Study");
const studyPercent = ((studyUsers.length / totalUsers) * 100).toFixed(0);

export const studyKpis = [
  { label: "ผู้ใช้สร้างตารางเรียน", value: `${studyPercent}%`, note: "ของผู้ใช้ทั้งหมด" },
  { label: "Event สอบ/โปรเจกต์ต่อสัปดาห์", value: Math.round(studyUsers.length * 0.45).toLocaleString(), note: "เพิ่มขึ้น 9.4%" },
  { label: "เปิดแอปตรงเวลาเรียน", value: "74%", note: "ค่าเฉลี่ยความสม่ำเสมอ" },
  { label: "วิชายอดนิยม", value: "คณิตศาสตร์", note: "31% ของทั้งหมด" },
];

export const studyWorkloadTrend = [
  { label: "สัปดาห์ 1", events: 312, upcoming: 180 },
  { label: "สัปดาห์ 2", events: 350, upcoming: 196 },
  { label: "สัปดาห์ 3", events: 372, upcoming: 215 },
  { label: "สัปดาห์ 4", events: 448, upcoming: 262 },
];

export const studyUpcomingShare = [
  { name: "Upcoming", value: 62 },
  { name: "Completed", value: 38 },
];

export type StudyTrendingEvent = {
  id: string;
  title: string;
  university: string;
  year: string;
  dueIn: string;
  insight: string;
};

export const studyTrendingEvents: StudyTrendingEvent[] = [
  { id: "STD-001", title: "Midterm Calculus", university: "จุฬาลงกรณ์มหาวิทยาลัย", year: "ปี 1", dueIn: "อีก 3 วัน", insight: "คำถาม AI วิชานี้เพิ่มขึ้น +22%" },
  { id: "STD-002", title: "Data Structure Project", university: "มหาวิทยาลัยธรรมศาสตร์", year: "ปี 2", dueIn: "อีก 5 วัน", insight: "ผู้ใช้ถามเรื่องการออกแบบอัลกอริทึมเพิ่มขึ้น +18%" },
  { id: "STD-003", title: "Organic Chemistry Quiz", university: "มหาวิทยาลัยเชียงใหม่", year: "ปี 1", dueIn: "อีก 2 วัน", insight: "บทเรียนทบทวนถูกเรียกใช้สูงกว่าปกติ +17%" },
  { id: "STD-004", title: "Business Analytics Presentation", university: "มหาวิทยาลัยเกษตรศาสตร์", year: "ปี 3", dueIn: "อีก 6 วัน", insight: "AI สรุปสไลด์ถูกใช้งานเพิ่มขึ้น +26%" },
];

/* ──────────────────────────────────────────────
 * Finance
 * ────────────────────────────────────────────── */
const financeUsers = managedUsers.filter((u) => u.favoriteCategory === "Finance");

export const financeKpis = [
  { label: "ผู้ใช้ที่คุมงบได้ (On-track)", value: "57%", note: `+2.8% (${financeUsers.length.toLocaleString()} คน)` },
  { label: "ผู้ใช้ที่ใช้เงินเกินงบ", value: "21%", note: "ต้องการแจ้งเตือน" },
  { label: "ใช้ AI บันทึกบัญชี", value: "63%", note: "แชท 41% / เสียง 22%" },
  { label: "บันทึกบัญชีเอง", value: "37%", note: "Manual mode" },
];

export type FinanceCategoryUsage = {
  category: string;
  income: number;
  expense: number;
  ratio: number;
};

export const financeCategoryUsage: FinanceCategoryUsage[] = [
  { category: "อาหาร", income: 840000, expense: 410000, ratio: 39 },
  { category: "เดินทาง", income: 340000, expense: 190000, ratio: 18 },
  { category: "ช็อปปิ้ง", income: 510000, expense: 276000, ratio: 26 },
  { category: "บันเทิง", income: 290000, expense: 124000, ratio: 12 },
  { category: "อื่น ๆ", income: 220000, expense: 64000, ratio: 5 },
];

export const financeDailyEntries = [
  { day: "จ", total: 840 },
  { day: "อ", total: 920 },
  { day: "พ", total: 1010 },
  { day: "พฤ", total: 980 },
  { day: "ศ", total: 1102 },
  { day: "ส", total: 942 },
  { day: "อา", total: 890 },
];

export const financeInputMethodShare = [
  { name: "กรอกเอง", value: 37 },
  { name: "AI Chat", value: 41 },
  { name: "AI Voice", value: 22 },
];

/* ──────────────────────────────────────────────
 * Lifestyle
 * ────────────────────────────────────────────── */
const lifestyleUsers = managedUsers.filter((u) => u.favoriteCategory === "Lifestyle");

export const lifestyleKpis = [
  { label: "ผู้ใช้ที่มี Routine", value: "72%", note: `จาก ${lifestyleUsers.length.toLocaleString()} คน` },
  { label: "ไดอารี่ที่แนบรูปภาพ", value: Math.round(lifestyleUsers.length * 1.4).toLocaleString(), note: "ช่วง 30 วันล่าสุด" },
  { label: "Mood Index", value: "78/100", note: "ดีขึ้น +4 คะแนน" },
  { label: "กลุ่มเสี่ยงความเครียด", value: "11%", note: "พักผ่อนน้อย/นอนดึก" },
];

export type LifestyleRecommendation = {
  id: string;
  type: "food" | "series";
  title: string;
  ctr: number;
  moodTag: string;
};

export const lifestyleRecommendations: LifestyleRecommendation[] = [
  { id: "LIFE-001", type: "food", title: "ข้าวหน้าปลาแซลมอน", ctr: 42, moodTag: "เติมพลังงาน" },
  { id: "LIFE-002", type: "food", title: "สลัดไก่อบ", ctr: 38, moodTag: "คุมแคลอรี่" },
  { id: "LIFE-003", type: "food", title: "ซุปฟักทอง", ctr: 29, moodTag: "ผ่อนคลาย" },
  { id: "LIFE-101", type: "series", title: "The Last Lecture", ctr: 34, moodTag: "แรงบันดาลใจ" },
  { id: "LIFE-102", type: "series", title: "Chef's Table", ctr: 27, moodTag: "พักสมอง" },
  { id: "LIFE-103", type: "series", title: "Minimalism", ctr: 23, moodTag: "จัดระเบียบชีวิต" },
];

export const lifestyleMoodTrend = [
  { week: "W1", positive: 58, neutral: 30, stressed: 12 },
  { week: "W2", positive: 61, neutral: 28, stressed: 11 },
  { week: "W3", positive: 64, neutral: 26, stressed: 10 },
  { week: "W4", positive: 66, neutral: 25, stressed: 9 },
];

export const lifestyleAlarmSlots = [
  { slot: "06:00", users: Math.round(lifestyleUsers.length * 0.28) },
  { slot: "07:00", users: Math.round(lifestyleUsers.length * 0.46) },
  { slot: "17:00", users: Math.round(lifestyleUsers.length * 0.37) },
  { slot: "21:00", users: Math.round(lifestyleUsers.length * 0.29) },
];

/* ──────────────────────────────────────────────
 * Subscriptions – synced KPIs
 * ────────────────────────────────────────────── */
export const subscriptionOverviewKpis = [
  { label: "MRR", value: `฿${mrr.toLocaleString()}`, note: "+6.2%" },
  { label: "สมาชิก Plus+", value: plusUsers.toLocaleString(), note: `${conversionRate}% ของทั้งหมด` },
  { label: "Conversion Rate", value: `${conversionRate}%`, note: "ย้อนหลัง 30 วัน" },
  { label: "Churn", value: "2.1%", note: "ลดลง -0.4%" },
];

export const plusFeatures = [
  { id: "pf-01", title: "Priority AI Responses", description: "ลดเวลา Response ในช่วง Peak", visible: true },
  { id: "pf-02", title: "Extended Token Quota", description: "เพิ่มโควตา Token รายเดือน", visible: true },
  { id: "pf-03", title: "Advanced Insights", description: "รายงานเชิงลึกรายบุคคล", visible: false },
];

// Generate invoices from the first 10 Plus users
export const invoices = managedUsers
  .filter((u) => u.plan !== "FREE")
  .slice(0, 10)
  .map((u, i) => ({
    invoice: `INV-202603-${String(i + 1).padStart(3, "0")}`,
    user: u.id,
    plan: PLAN_LABELS[u.plan],
    amountTHB: PLAN_PRICES[u.plan],
    issuedAt: `2026-03-0${Math.min(3, (i % 3) + 1)}`,
    status: i % 3 === 1 ? "Pending" : "Paid",
  }));

/* ──────────────────────────────────────────────
 * Notifications
 * ────────────────────────────────────────────── */
export const audienceTargets = ["ทุกคน", "กลุ่ม FREE", "กลุ่ม Plus+", "กลุ่มกำหนดเอง"];
export const noticeCategories = ["รวม", "สำคัญ", "ระบบ", "การเงิน"];

export type BroadcastLogRow = {
  id: string;
  title: string;
  category: string;
  audience: string;
  sentAt: string;
  status: "Sent" | "Draft";
};

export const broadcastLogs: BroadcastLogRow[] = [
  { id: "NTF-001", title: "แจ้งเตือนระบบชำระเงิน", category: "การเงิน", audience: "ทุกคน", sentAt: "2026-03-03 10:20", status: "Sent" },
  { id: "NTF-002", title: "โปรโมชัน Plus+ สุดสัปดาห์", category: "สำคัญ", audience: "กลุ่ม FREE", sentAt: "2026-03-02 19:11", status: "Sent" },
];

/* ──────────────────────────────────────────────
 * Settings
 * ────────────────────────────────────────────── */
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
  defaultModel: "claude-sonnet-4",
};

export const defaultSystemPolicy: SystemPolicyConfig = {
  nsfwCheck: true,
  autoSuspend150: false,
};

export const adminRoles = [
  { role: "Super Admin", access: "Full system + billing + AI tuning", users: 2 },
  { role: "Operations Admin", access: "Users + notifications + feedback", users: 4 },
  { role: "Support Staff", access: "Read-only + user assist tools", users: 6 },
];

/* ──────────────────────────────────────────────
 * Logs
 * ────────────────────────────────────────────── */
export const systemLogs = [
  { timestamp: "2026-03-03 12:11:02", level: "INFO", source: "scheduler", message: "Nightly lifestyle sync finished", traceId: "TRC-9011", userId: "U-0042", errorCode: "-" },
  { timestamp: "2026-03-03 12:04:29", level: "ERROR", source: "payment-gateway", message: "PromptPay callback timeout", traceId: "TRC-9008", userId: "U-1293", errorCode: "PAY-504" },
  { timestamp: "2026-03-03 11:58:16", level: "WARN", source: "ai-manager", message: "Token usage reached 82% of daily budget", traceId: "TRC-9001", userId: "-", errorCode: "AI-THRESHOLD" },
  { timestamp: "2026-03-03 11:41:50", level: "INFO", source: "user-service", message: "User segment cache refreshed", traceId: "TRC-8998", userId: "U-3210", errorCode: "-" },
];

/* ──────────────────────────────────────────────
 * Feedback
 * ────────────────────────────────────────────── */
export const feedbackEntries = [
  { id: "FB-101", userId: "U-0042", userName: "Napat K.", avatar: "https://ui.shadcn.com/avatars/01.png", tag: "ปัญหา", rating: 2, comment: "วิดีโอค้างช่วงนาทีที่ 12:10", date: "2026-03-03", status: "รอดำเนินการ" },
  { id: "FB-102", userId: "U-1293", userName: "Pimnara T.", avatar: "https://ui.shadcn.com/avatars/05.png", tag: "ข้อเสนอแนะ", rating: 4, comment: "อยากได้โหมด challenge รายสัปดาห์", date: "2026-03-02", status: "กำลังตรวจสอบ" },
  { id: "FB-103", userId: "U-3210", userName: "Tanawat L.", avatar: "https://ui.shadcn.com/avatars/06.png", tag: "คำชม", rating: 5, comment: "คุณภาพคำตอบ AI ดีขึ้นมาก", date: "2026-03-01", status: "แก้แล้ว" },
  { id: "FB-104", userId: "U-0098", userName: "Sirin P.", avatar: "https://ui.shadcn.com/avatars/02.png", tag: "ปัญหา", rating: 3, comment: "แจ้งเตือนเข้าไม่สม่ำเสมอ", date: "2026-03-01", status: "รอดำเนินการ" },
];

/* ──────────────────────────────────────────────
 * App Health
 * ────────────────────────────────────────────── */
export const appHealthKpis = [
  { label: "API Availability", value: "99.93%", note: "Last 24h rolling" },
  { label: "Avg API Latency", value: "182 ms", note: "P95 across core endpoints" },
  { label: "Open Incidents", value: "1", note: "Includes degraded dependencies" },
  { label: "Last Deployment", value: "2026-03-03 11:40", note: "admin-console@v2.8.1" },
];

export const appHealthServices: Array<{
  id: string;
  name: string;
  status: HealthStatus;
  uptime: string;
  note: string;
}> = [
    { id: "svc-api-gateway", name: "API Gateway", status: "operational", uptime: "99.99%", note: "Edge routing healthy" },
    { id: "svc-auth", name: "Auth Service", status: "operational", uptime: "99.97%", note: "Token validation stable" },
    { id: "svc-db", name: "Primary Database", status: "degraded", uptime: "99.62%", note: "Read latency elevated" },
    { id: "svc-queue", name: "Background Queue", status: "operational", uptime: "99.95%", note: "Jobs processing normal" },
  ];

export const appHealthApis: Array<{
  id: string;
  method: "GET" | "POST";
  name: string;
  path: string;
  status: HealthStatus;
  latencyMs: number;
  lastChecked: string;
}> = [
    { id: "api-profile", method: "GET", name: "Get Profile", path: "/api/v1/users/profile", status: "operational", latencyMs: 138, lastChecked: "2026-03-03 12:14" },
    { id: "api-subscription", method: "GET", name: "Subscription Summary", path: "/api/v1/subscriptions/summary", status: "operational", latencyMs: 202, lastChecked: "2026-03-03 12:14" },
    { id: "api-notice", method: "POST", name: "Send Broadcast", path: "/api/v1/notifications/broadcast", status: "degraded", latencyMs: 514, lastChecked: "2026-03-03 12:12" },
    { id: "api-reports", method: "GET", name: "Usage Reports", path: "/api/v1/reports/usage", status: "down", latencyMs: 0, lastChecked: "2026-03-03 12:11" },
  ];
