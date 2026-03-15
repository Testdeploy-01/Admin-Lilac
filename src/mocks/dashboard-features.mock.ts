export type TrendType = "up" | "down" | "neutral";
export type StatsCardItem = {
  label: string;
  value: string;
  delta?: string;
  trend?: TrendType;
  note?: string;
};

export type AiPeriod = "7d" | "month" | "4months" | "year";

export type HealthStatus = "operational" | "degraded" | "down";

/* ──────────────────────────────────────────────
 * Subscription Plans – single source of truth
 * ────────────────────────────────────────────── */
export type PlanKey = "FREE" | "PLUS_MONTHLY" | "PLUS_TERM" | "PLUS_YEARLY";
export type UserFeatureName = "การเงิน" | "การเรียน" | "ไลฟ์สไตล์";
export type UserFeatureUsage = {
  feature: UserFeatureName;
  calls: number;
  costTHB: number;
};

export const PLAN_LABELS: Record<PlanKey, string> = {
  FREE: "FREE",
  PLUS_MONTHLY: "PLUS+ รายเดือน",
  PLUS_TERM: "PLUS+ รายเทอม",
  PLUS_YEARLY: "PLUS+ รายปี",
};

export const PLAN_PRICES: Record<PlanKey, number> = {
  FREE: 0,
  PLUS_MONTHLY: 79,
  PLUS_TERM: 259,
  PLUS_YEARLY: 699,
};

export const subscriptionPlans = [
  {
    id: "plan-monthly",
    name: "Plus+ Monthly",
    cycle: "รายเดือน",
    priceTHB: 79,
    durationDays: 30,
    active: true,
    badge: "Starter",
  },
  {
    id: "plan-term",
    name: "Plus+ Term",
    cycle: "รายเทอม (4 เดือน)",
    priceTHB: 259,
    durationDays: 120,
    active: true,
    badge: "Popular",
  },
  {
    id: "plan-yearly",
    name: "Plus+ Yearly",
    cycle: "รายปี",
    priceTHB: 699,
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
  signupChannel: "เบอร์โทร" | "Google" | "Apple" | "LINE";
  signupDate: string;
  lastActive: string;
  favoriteCategory: "การเงิน" | "การเรียน" | "ไลฟ์สไตล์";
  systemAlert: string;
  inputVoiceTokens: number;
  inputTextTokens: number;
  outputTextTokens: number;
  aiCostTHB: number;
  aiCallsTotal: number;
  voiceCommands: number;
  textCommands: number;
  aiFeatureUsage: UserFeatureUsage[];
  heyLilacActivations: number;
  widgetInstalls: number;
  status: "active" | "suspended";
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
const CATEGORIES: Array<UserTableRowExpanded["favoriteCategory"]> = ["การเงิน", "การเรียน", "ไลฟ์สไตล์"];
const SIGNUP_CHANNELS: Array<UserTableRowExpanded["signupChannel"]> = ["เบอร์โทร", "Google", "Apple", "LINE"];
const FEATURE_BUCKETS: UserFeatureName[] = ["การเงิน", "การเรียน", "ไลฟ์สไตล์"];
const ALERTS = ["ปกติ", "ปกติ", "ปกติ", "ปกติ", "ต้องติดตาม", "ใช้โทเคนสูงผิดปกติ", "ต้นทุน AI สูง", "ปกติ"];
const STATUSES: Array<"active" | "suspended"> = ["active", "active", "active", "active", "active", "active", "suspended", "active"];

const TOTAL_USERS = 6456;
const CURRENT_DATE = new Date("2026-03-11T12:00:00");
const rand = seededRandom(42);

function genDate(startYear: number, endYear: number) {
  const start = new Date(`${startYear}-01-01`).getTime();
  const end = Math.min(new Date(`${endYear}-12-31`).getTime(), CURRENT_DATE.getTime());
  const d = new Date(start + rand() * (end - start));
  return d.toISOString().slice(0, 10);
}

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function genLastLogin(baseDate: Date) {
  const loginDate = new Date(baseDate);
  const h = String(Math.floor(rand() * 24)).padStart(2, "0");
  const m = String(Math.floor(rand() * 60)).padStart(2, "0");
  loginDate.setHours(Number(h), Number(m), 0, 0);
  return `${formatDate(loginDate)} ${h}:${m}`;
}

function splitIntegerTotal(total: number, weights: number[]) {
  const weightSum = weights.reduce((sum, weight) => sum + weight, 0);
  const rawValues = weights.map((weight) => (weight / weightSum) * total);
  const baseValues = rawValues.map((value) => Math.floor(value));
  const remainder = total - baseValues.reduce((sum, value) => sum + value, 0);

  const rankedFractions = rawValues
    .map((value, index) => ({ index, fraction: value - Math.floor(value) }))
    .sort((a, b) => b.fraction - a.fraction);

  for (let i = 0; i < remainder; i += 1) {
    baseValues[rankedFractions[i % rankedFractions.length].index] += 1;
  }

  return baseValues;
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
  const signupDate = genDate(2025, 2026);
  const signupDateTime = new Date(`${signupDate}T00:00:00`).getTime();
  const daysSinceSignup = Math.max(1, Math.floor((CURRENT_DATE.getTime() - signupDateTime) / 86_400_000));
  const daysAgo = Math.floor(rand() * Math.min(daysSinceSignup, 30));
  const lastActiveDate = new Date(CURRENT_DATE);
  lastActiveDate.setDate(lastActiveDate.getDate() - daysAgo);
  const streak = Math.floor(rand() * Math.min(daysSinceSignup, 14)) + 1;
  const aiCallsTotal = plan === "FREE"
    ? Math.floor(rand() * 43 + 8)
    : Math.floor(rand() * 260 + 60);
  const voiceCommands = Math.max(1, Math.floor(aiCallsTotal * (plan === "FREE" ? 0.24 + rand() * 0.1 : 0.2 + rand() * 0.12)));
  const textCommands = aiCallsTotal - voiceCommands;
  const inputVoiceTokens = Math.floor(aiCallsTotal * (plan === "FREE" ? 7 + rand() * 6 : 10 + rand() * 8));
  const inputTextTokens = Math.floor(aiCallsTotal * (plan === "FREE" ? 12 + rand() * 10 : 18 + rand() * 12));
  const outputTextTokens = Math.floor(aiCallsTotal * (plan === "FREE" ? 16 + rand() * 10 : 24 + rand() * 14));
  const expectedTotalTokens = inputVoiceTokens + inputTextTokens + outputTextTokens;
  const costPerToken = plan === "FREE" ? 0.001 : 0.0014;
  const totalCostSatang = Math.round(expectedTotalTokens * costPerToken * 100);
  const featureCallWeights = FEATURE_BUCKETS.map(() => 0.8 + rand() * 1.4);
  const featureCalls = splitIntegerTotal(aiCallsTotal, featureCallWeights);
  const featureCostWeights = featureCalls.map((calls) => calls * (0.85 + rand() * 0.3));
  const featureCostSatang = splitIntegerTotal(totalCostSatang, featureCostWeights);
  const aiFeatureUsage = FEATURE_BUCKETS.map((feature, index) => ({
    feature,
    calls: featureCalls[index],
    costTHB: featureCostSatang[index] / 100,
  }));
  const heyLilacActivations = Math.floor(aiCallsTotal * (0.2 + rand() * 0.5));
  const widgetInstalls = Math.floor(rand() * 200);
  const status = STATUSES[Math.floor(rand() * STATUSES.length)];
  const signupChannel = SIGNUP_CHANNELS[Math.floor(rand() * SIGNUP_CHANNELS.length)];

  return {
    id: `U-${String(i + 1).padStart(4, "0")}`,
    name: `${firstName} ${lastInit}`,
    email: `${firstName.toLowerCase()}.${lastInit.toLowerCase().replace(".", "")}@mail.com`,
    avatar: `https://ui.shadcn.com/avatars/0${(i % 6) + 1}.png`,
    plan,
    signupChannel,
    signupDate,
    lastActive: formatDate(lastActiveDate),
    favoriteCategory: CATEGORIES[Math.floor(rand() * CATEGORIES.length)],
    systemAlert: ALERTS[Math.floor(rand() * ALERTS.length)],
    inputVoiceTokens,
    inputTextTokens,
    outputTextTokens,
    aiCostTHB: totalCostSatang / 100,
    aiCallsTotal,
    voiceCommands,
    textCommands,
    aiFeatureUsage,
    heyLilacActivations,
    widgetInstalls,
    status,
    lastLogin: genLastLogin(lastActiveDate),
    streak,
  };
});

export const pendingUsersCount = 0;

/* ──────────────────────────────────────────────
 * Computed KPIs (synced from users dataset)
 * ────────────────────────────────────────────── */
const totalUsers = managedUsers.length;
const freeUsers = managedUsers.filter((u) => u.plan === "FREE").length;
const plusUsers = totalUsers - freeUsers;
const plusMonthly = managedUsers.filter((u) => u.plan === "PLUS_MONTHLY").length;
const plusTerm = managedUsers.filter((u) => u.plan === "PLUS_TERM").length;
const plusYearly = managedUsers.filter((u) => u.plan === "PLUS_YEARLY").length;
const totalAiCalls = managedUsers.reduce((s, u) => s + u.aiCallsTotal, 0);

// MRR calculation from real plan mix
const mrr = (plusMonthly * 79) + (plusTerm * Math.round(259 / 4)) + (plusYearly * Math.round(699 / 12));
const arr = mrr * 12;
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

// 1.3 User Growth Chart (FREE vs PLUS)
export const overviewGrowthFreeVsPlus = (() => {
  const data: Array<{ month: string; free: number; plus: number }> = [];
  const growthRand = seededRandom(4201);
  const months = ["เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค.", "ม.ค.", "ก.พ.", "มี.ค."];
  let freeBase = freeUsers - 700;
  let plusBase = plusUsers - 420;
  for (const month of months) {
    freeBase += Math.floor(growthRand() * 70 + 35);
    plusBase += Math.floor(growthRand() * 55 + 22);
    data.push({ month, free: freeBase, plus: plusBase });
  }
  return data;
})();

// 1.4 Weekly Return by Plan
export const weeklyRetentionByPlan = [
  { week: "สัปดาห์ที่ 1", free: 1764, plus: 3127 },
  { week: "สัปดาห์ที่ 2", free: 1421, plus: 2804 },
  { week: "สัปดาห์ที่ 3", free: 1103, plus: 2604 },
  { week: "สัปดาห์ที่ 4", free: 858, plus: 2484 },
  { week: "สัปดาห์ที่ 5", free: 686, plus: 2323 },
  { week: "สัปดาห์ที่ 6", free: 539, plus: 2283 },
  { week: "สัปดาห์ที่ 7", free: 441, plus: 2203 },
  { week: "สัปดาห์ที่ 8", free: 490, plus: 2203 },
];

// 1.5 Weekly Drop-off After Signup
export const weeklyDropoffUsers = [
  { week: "สัปดาห์ที่ 1", lastWeek: 280, thisWeek: 320 },
  { week: "สัปดาห์ที่ 2", lastWeek: 180, thisWeek: 210 },
  { week: "สัปดาห์ที่ 3", lastWeek: 140, thisWeek: 150 },
  { week: "สัปดาห์ที่ 4", lastWeek: 100, thisWeek: 130 },
  { week: "สัปดาห์ที่ 5", lastWeek: 90, thisWeek: 100 },
  { week: "สัปดาห์ที่ 6", lastWeek: 70, thisWeek: 80 },
  { week: "สัปดาห์ที่ 7", lastWeek: 55, thisWeek: 65 },
  { week: "สัปดาห์ที่ 8", lastWeek: 30, thisWeek: 40 },
];

// 1.6 Feature Usage Donut
export const featureUsageDonut = [
  { feature: "การเรียน", value: 45 },
  { feature: "การเงิน", value: 32 },
  { feature: "ไลฟ์สไตล์", value: 23 },
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
  { id: "EV-001", type: "join", userName: "Pimnara T.", text: "สมัครผ่านเบอร์โทรศัพท์", time: "2 นาทีที่แล้ว" },
  { id: "EV-002", type: "upgrade", userName: "Napat K.", text: "อัปเกรดเป็น PLUS รายปี", time: "7 นาทีที่แล้ว" },
  { id: "EV-006", type: "churn", userName: "Mild S.", text: "ยกเลิกแพ็กเกจรายปี", time: "1 ชั่วโมงที่แล้ว" },
  { id: "EV-003", type: "join", userName: "Korn P.", text: "สมัครใหม่จากแคมเปญ LINE OA", time: "15 นาทีที่แล้ว" },
  { id: "EV-004", type: "upgrade", userName: "Film R.", text: "อัปเกรดเป็น PLUS รายเดือน", time: "27 นาทีที่แล้ว" },
  { id: "EV-005", type: "churn", userName: "Palm W.", text: "ยกเลิกแพ็กเกจรายเดือน", time: "43 นาทีที่แล้ว" },
];

// 1.9 Top AI Prompts
export const topTextPrompts = [
  { prompt: "ช่วยสรุปบทเรียนวิชาฟิสิกส์", count: 4820, percentage: 16.8, feature: "การเรียน" },
  { prompt: "จัดตารางอ่านหนังสือสอบ", count: 4390, percentage: 15.3, feature: "การเรียน" },
  { prompt: "อธิบายงบกำไรขาดทุนแบบง่าย", count: 3720, percentage: 13.0, feature: "การเงิน" },
  { prompt: "แปลเนื้อหานี้เป็นภาษาอังกฤษ", count: 3185, percentage: 11.1, feature: "AI Chat" },
  { prompt: "ช่วยวางแผนการเงินรายเดือน", count: 2950, percentage: 10.3, feature: "การเงิน" },
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
export const userStatsBar: StatsCardItem[] = [
  { label: "ผู้ใช้ทั้งหมด", value: totalUsers.toLocaleString(), delta: "+5.2%", trend: "up", note: "ตั้งแต่เปิดตัว" },
  { label: "ใช้งานใน 7 วัน", value: Math.round(totalUsers * 0.68).toLocaleString(), delta: "+2.8%", trend: "up", note: "~68% ของทั้งหมด" },
  { label: "สมาชิก FREE", value: freeUsers.toLocaleString(), delta: "+4.1%", trend: "up", note: "ของทั้งหมด" },
  { label: "สมาชิก PLUS", value: plusUsers.toLocaleString(), delta: "+8.6%", trend: "up", note: "ของทั้งหมด" },
  { label: "ผู้ใช้ใหม่วันนี้", value: Math.round(totalUsers * 0.008).toLocaleString(), delta: "+12.3%", trend: "up", note: "เทียบกับเมื่อวาน" },
  { label: "ยกเลิกใน 30 วัน", value: Math.round(totalUsers * 0.021).toLocaleString(), delta: "-1.4%", trend: "down", note: "เทียบกับ 30 วันก่อนหน้า" },
];

export type ComparePlanBenchmarkRow = {
  metric: string;
  free: string;
  plus: string;
  winner: "free" | "plus" | null;
};

export const compareWidgetUsage = [
  { label: "ติดตั้งวิดเจ็ต", free: "83%", plus: "92%" },
  { label: "แตะวิดเจ็ตต่อวัน", free: "0.8 ครั้ง", plus: "2.4 ครั้ง" },
  { label: "ทำรายการสำเร็จผ่านวิดเจ็ต", free: "71%", plus: "86%" },
] as const;

export const comparePlanBenchmarks: ComparePlanBenchmarkRow[] = [
  { metric: "กลับมาใช้งานหลังสมัคร 4 สัปดาห์", free: "34.8%", plus: "74.6%", winner: "plus" },
  { metric: "จำนวนวันที่ใช้งานต่อเดือน", free: "8 วัน", plus: "19 วัน", winner: "plus" },
  { metric: "ฟีเจอร์ที่ใช้บ่อยที่สุด", free: "การเรียน 42%", plus: "การเงิน 58%", winner: "plus" },
  { metric: "ช่องทางที่ใช้บันทึกบ่อยที่สุด", free: "AI Input 54% / Manual 46%", plus: "AI Input 86% / Manual 14%", winner: "plus" },
  { metric: "เวลาที่ใช้แอปบ่อยที่สุด", free: "18.00-21.00 (24%)", plus: "19.00-22.00 (51%)", winner: "plus" },
  { metric: "อุปกรณ์ที่ใช้", free: "Android 66% / iOS 34%", plus: "iOS 61% / Android 39%", winner: "plus" },
  { metric: "คำสั่ง AI ต่อวัน", free: "3.2 ครั้ง", plus: "10.4 ครั้ง", winner: "plus" },
  { metric: "ค่าใช้จ่าย AI ต่อผู้ใช้ต่อเดือน", free: "฿18.50", plus: "฿124.00", winner: "plus" },
  { metric: "จำนวนครั้งที่เปิดแอปต่อวัน", free: "1.8 ครั้ง", plus: "4.4 ครั้ง", winner: "plus" },
  { metric: "จำนวนข้อมูลที่บันทึกต่อเดือน", free: "12 รายการ", plus: "31 รายการ", winner: "plus" },
];

export const compareFirstFeatureAfterSignup = [
  { feature: "การเงิน", free: 48, plus: 41 },
  { feature: "การเรียน", free: 37, plus: 46 },
  { feature: "ไลฟ์สไตล์", free: 15, plus: 13 },
];

export const compareFirstFeatureInsight = "การเงินและการเรียนคือ Hook หลักหลังสมัคร โดย PLUS เริ่มจากการเรียนมากกว่า ส่วน FREE เริ่มจากการเงินก่อน";

export const compareNotificationSetup = {
  free: 24,
  plus: 61,
  insight: "PLUS ตั้งการแจ้งเตือนมากกว่า FREE อย่างชัดเจน สะท้อนว่าผู้ใช้ที่เห็นประโยชน์เร็วมักผูกแอปเข้ากับกิจวัตรประจำวัน",
};

export const retentionCohorts = [
  { cohort: "2025-10", users: 1320, w1: 68, w2: 55, w4: 43, w8: 31 },
  { cohort: "2025-11", users: 1365, w1: 69, w2: 57, w4: 45, w8: 33 },
  { cohort: "2025-12", users: 1410, w1: 71, w2: 59, w4: 47, w8: 35 },
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
    reason: [
      "ราคาแพง",
      "ยังไม่เห็นความต่างจาก FREE",
      "ใช้งานไม่ต่อเนื่อง",
      "AI ไม่แม่นยำพอ",
      "ไม่ได้ใช้ฟีเจอร์ PLUS คุ้มค่า",
      "หยุดเรียนแล้ว",
    ][idx % 6],
    plusDuration: `${Math.round(1 + rand() * 10)} เดือน`,
    aiCallsBefore: u.aiCallsTotal,
    aiCostBeforeTHB: Number((u.aiCostTHB * (1.1 + (idx % 4) * 0.2)).toFixed(2)),
    churnedAt: `2026-0${((idx % 3) + 1)}-${String((idx % 27) + 1).padStart(2, "0")}`,
  }));

/* ──────────────────────────────────────────────
 * 3. AI Monitor – Page 3
 * ────────────────────────────────────────────── */
const AI_AVG_VOICE_SECONDS = 8;
const AI_DAYS_PER_MONTH = 30;
const USD_TO_THB = 32;
const WHISPER_PRICE_PER_MINUTE_USD = 0.006;
const COHERE_PRICE_PER_MILLION_TOKENS_USD = 0.12;
const HAIKU_INPUT_PRICE_PER_MILLION_TOKENS_USD = 0.8;
const HAIKU_OUTPUT_PRICE_PER_MILLION_TOKENS_USD = 4;

const aiUsersThisMonth = managedUsers.filter((u) => u.aiCallsTotal > 0).length;
const totalTextCommands = managedUsers.reduce((sum, user) => sum + user.textCommands, 0);
const totalVoiceCommands = managedUsers.reduce((sum, user) => sum + user.voiceCommands, 0);
const totalInputVoiceTokens = managedUsers.reduce((sum, user) => sum + user.inputVoiceTokens, 0);
const totalInputTextTokens = managedUsers.reduce((sum, user) => sum + user.inputTextTokens, 0);
const totalOutputTokensPerMonth = managedUsers.reduce((sum, user) => sum + user.outputTextTokens, 0);
const totalInputTokensPerMonth = totalInputVoiceTokens + totalInputTextTokens;
const totalTokensPerMonth = totalInputTokensPerMonth + totalOutputTokensPerMonth;
const totalMonthlyAiCostTHB = managedUsers.reduce((sum, user) => sum + user.aiCostTHB, 0);
const totalMonthlyAiCostUSD = totalMonthlyAiCostTHB / USD_TO_THB;
const avgCommandsPerUserPerDay = totalAiCalls / Math.max(aiUsersThisMonth, 1) / AI_DAYS_PER_MONTH;
const todayCommandCount = Math.round(totalAiCalls / AI_DAYS_PER_MONTH);
const todayTextCommands = Math.round(todayCommandCount * (totalTextCommands / Math.max(totalAiCalls, 1)));
const todayVoiceCommands = todayCommandCount - todayTextCommands;
const whisperMinutesPerMonth = totalVoiceCommands * (AI_AVG_VOICE_SECONDS / 60);
const whisperMinutesPerDay = todayVoiceCommands * (AI_AVG_VOICE_SECONDS / 60);
const aiCostPerCommandTHB = totalMonthlyAiCostTHB / Math.max(totalAiCalls, 1);
const costPerUserPerMonthTHB = totalMonthlyAiCostTHB / Math.max(aiUsersThisMonth, 1);
const costPerUserPerDayTHB = costPerUserPerMonthTHB / AI_DAYS_PER_MONTH;
const freeMonthlyAiCostTHB = managedUsers.filter((u) => u.plan === "FREE").reduce((sum, user) => sum + user.aiCostTHB, 0);
const plusMonthlyAiCostTHB = managedUsers.filter((u) => u.plan !== "FREE").reduce((sum, user) => sum + user.aiCostTHB, 0);
const freeCostPerUserPerMonthTHB = freeMonthlyAiCostTHB / Math.max(freeUsers, 1);
const plusCostPerUserPerMonthTHB = plusMonthlyAiCostTHB / Math.max(plusUsers, 1);
const monthlyFailureRate = Math.min(0.08, ((totalVoiceCommands / Math.max(totalAiCalls, 1)) * 0.04) + ((freeUsers / Math.max(totalUsers, 1)) * 0.05));
const aiSuccessRate = +(100 - (monthlyFailureRate * 100)).toFixed(1);
const plusPriceTHB = PLAN_PRICES.PLUS_MONTHLY;
const rollingYearLabels = ["เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค.", "ม.ค.", "ก.พ.", "มี.ค."];
const rollingYearMultipliers = [0.84, 0.87, 0.9, 0.92, 0.95, 0.97, 1, 1.02, 1.04, 1.07, 1.05, 1.09];

const buildScaledCommandSeries = (labels: string[], multipliers: number[]) => labels.map((label, index) => {
  const commands = Math.round(totalAiCalls * multipliers[index]);
  const text = Math.round(commands * (totalTextCommands / Math.max(totalAiCalls, 1)));
  return {
    label,
    text,
    voice: commands - text,
  };
});

const monthDayWeights = Array.from({ length: AI_DAYS_PER_MONTH }, (_, index) => (
  1
  + (Math.sin((index + 1) * 0.72) * 0.14)
  + ((index % 7) >= 5 ? 0.12 : -0.03)
  + (index % 9 === 0 ? 0.06 : 0)
));
const monthTextSeries = splitIntegerTotal(totalTextCommands, monthDayWeights);
const monthVoiceSeries = splitIntegerTotal(totalVoiceCommands, monthDayWeights);

const textHourlyWeights = [
  0.44, 0.42, 0.4, 0.39, 0.38, 0.42, 0.56, 0.72, 0.84, 0.91, 0.95, 0.98,
  1, 1.04, 1.02, 0.98, 0.96, 0.99, 1.08, 1.12, 1.14, 1.06, 0.82, 0.62,
];
const voiceHourlyWeights = [
  0.36, 0.34, 0.33, 0.32, 0.31, 0.35, 0.44, 0.56, 0.64, 0.72, 0.76, 0.82,
  0.88, 0.93, 0.98, 1, 1.02, 1.08, 1.16, 1.22, 1.18, 1.04, 0.82, 0.58,
];
const hourlyTextSeries = splitIntegerTotal(todayTextCommands, textHourlyWeights);
const hourlyVoiceSeries = splitIntegerTotal(todayVoiceCommands, voiceHourlyWeights);
const sixMonthCommandSeries = buildScaledCommandSeries(rollingYearLabels.slice(-6), rollingYearMultipliers.slice(-6));
const yearCommandSeries = buildScaledCommandSeries(rollingYearLabels, rollingYearMultipliers);

const totalCommandsPerMonth = totalAiCalls;
const totalCommandsLast6Months = sixMonthCommandSeries.reduce((sum, item) => sum + item.text + item.voice, 0);
const totalCommandsLastYear = yearCommandSeries.reduce((sum, item) => sum + item.text + item.voice, 0);

export const aiCostSummary = {
  users: aiUsersThisMonth,
  commandsPerUserPerDay: +avgCommandsPerUserPerDay.toFixed(1),
  totalCommandsPerDay: todayCommandCount,
  voiceCommandsPerDay: todayVoiceCommands,
  textCommandsPerDay: todayTextCommands,
  voiceMinutesPerDay: whisperMinutesPerDay,
  inputTokensPerMonth: totalInputTokensPerMonth,
  outputTokensPerMonth: totalOutputTokensPerMonth,
  totalMonthlyCostUSD: totalMonthlyAiCostUSD,
  totalMonthlyCostTHB: totalMonthlyAiCostTHB,
  costPerUserPerMonthTHB,
  costPerUserPerDayTHB,
  plusProfitPerMonthTHB: plusPriceTHB - costPerUserPerMonthTHB,
  freeLossPerMonthTHB: costPerUserPerMonthTHB,
};

export const aiMonitorStats = [
  { label: "คำสั่ง AI", value: totalCommandsPerMonth.toLocaleString(), note: "รวม 30 วันล่าสุด" },
  { label: "ผู้ใช้ที่ใช้ AI", value: aiUsersThisMonth.toLocaleString(), note: "ผู้ใช้ที่มีการเรียก AI ในเดือนนี้" },
  { label: "อัตราสำเร็จ", value: `${aiSuccessRate.toFixed(1)}%`, note: "คำสั่งที่ระบบตอบกลับสำเร็จ" },
  { label: "ต้นทุนต่อคำสั่ง", value: `฿${aiCostPerCommandTHB.toFixed(2)}`, note: "เฉลี่ยต่อ 1 คำสั่ง" },
];

export const aiCallVolumeMonthly = monthTextSeries.map((text, index) => ({
  day: String(index + 1),
  text,
  voice: monthVoiceSeries[index],
}));

export type AiMonitorPeriod = "today" | "month" | "6months" | "year";

export const aiCommandSeriesByPeriod = {
  today: Array.from({ length: 24 }, (_, hour) => ({
    label: `${String(hour).padStart(2, "0")}:00`,
    text: hourlyTextSeries[hour],
    voice: hourlyVoiceSeries[hour],
  })),
  month: aiCallVolumeMonthly.map((item) => ({
    label: item.day,
    text: item.text,
    voice: item.voice,
  })),
  "6months": sixMonthCommandSeries,
  year: yearCommandSeries,
} satisfies Record<AiMonitorPeriod, Array<{ label: string; text: number; voice: number }>>;

export const aiStatsByPeriod = {
  today: {
    commands: todayCommandCount,
    users: dau,
    successRate: Math.min(99.9, +(aiSuccessRate + 0.4).toFixed(1)),
    costPerCommandTHB: aiCostPerCommandTHB,
    totalCostTHB: totalMonthlyAiCostTHB / AI_DAYS_PER_MONTH,
    commandNote: "รวมวันนี้",
    usersNote: "ผู้ใช้ที่เรียก AI วันนี้",
    successNote: "คำสั่งที่ระบบตอบกลับสำเร็จวันนี้",
    totalCostNote: "ต้นทุนรวมวันนี้",
  },
  month: {
    commands: totalCommandsPerMonth,
    users: aiUsersThisMonth,
    successRate: aiSuccessRate,
    costPerCommandTHB: aiCostPerCommandTHB,
    totalCostTHB: totalMonthlyAiCostTHB,
    commandNote: "รวม 30 วันล่าสุด",
    usersNote: "ผู้ใช้ที่มีการเรียก AI ในเดือนนี้",
    successNote: "คำสั่งที่ระบบตอบกลับสำเร็จ",
    totalCostNote: "ต้นทุนรวมเดือนนี้",
  },
  "6months": {
    commands: totalCommandsLast6Months,
    users: aiUsersThisMonth,
    successRate: Math.max(90, +(aiSuccessRate - 0.3).toFixed(1)),
    costPerCommandTHB: aiCostPerCommandTHB,
    totalCostTHB: totalCommandsLast6Months * aiCostPerCommandTHB,
    commandNote: "รวม 6 เดือนล่าสุด",
    usersNote: "ผู้ใช้ที่มีการเรียก AI ในช่วง 6 เดือน",
    successNote: "ค่าเฉลี่ยสำเร็จย้อนหลัง 6 เดือน",
    totalCostNote: "ต้นทุนรวม 6 เดือนล่าสุด",
  },
  year: {
    commands: totalCommandsLastYear,
    users: totalUsers,
    successRate: Math.max(90, +(aiSuccessRate - 0.7).toFixed(1)),
    costPerCommandTHB: aiCostPerCommandTHB,
    totalCostTHB: totalCommandsLastYear * aiCostPerCommandTHB,
    commandNote: "รวม 12 เดือนล่าสุด",
    usersNote: "ผู้ใช้ที่มีการเรียก AI ในรอบ 1 ปี",
    successNote: "ค่าเฉลี่ยสำเร็จย้อนหลัง 1 ปี",
    totalCostNote: "ต้นทุนรวม 1 ปีที่ผ่านมา",
  },
} satisfies Record<AiMonitorPeriod, {
  commands: number;
  users: number;
  successRate: number;
  costPerCommandTHB: number;
  totalCostTHB: number;
  commandNote: string;
  usersNote: string;
  successNote: string;
  totalCostNote: string;
}>;

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
  { query: "ราคาทองวันนี้เท่าไหร่", count: 67, category: "off-topic" },
  { query: "แปลโค้ด Python นี้ให้หน่อย", count: 45, category: "off-topic" },
  { query: "วิเคราะห์หุ้น xxx ให้หน่อย", count: 38, category: "off-topic" },
  { query: "เขียน essay ภาษาจีนให้หน่อย", count: 31, category: "off-topic" },
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
  today: { tokens: Math.round(totalTokensPerMonth / AI_DAYS_PER_MONTH), cost: totalMonthlyAiCostTHB / AI_DAYS_PER_MONTH },
  thisMonth: { tokens: totalTokensPerMonth, cost: totalMonthlyAiCostTHB },
  lastMonth: { tokens: Math.round(totalTokensPerMonth * 0.94), cost: +(totalMonthlyAiCostTHB * 0.94).toFixed(2) },
  costPerUserFree: freeCostPerUserPerMonthTHB,
  costPerUserPlus: plusCostPerUserPerMonthTHB,
};

const aiFeatureUsageSummaryMonth = FEATURE_BUCKETS
  .map((feature) => {
    const commands = managedUsers.reduce((sum, user) => (
      sum + (user.aiFeatureUsage.find((item) => item.feature === feature)?.calls ?? 0)
    ), 0);
    const costTHB = managedUsers.reduce((sum, user) => (
      sum + (user.aiFeatureUsage.find((item) => item.feature === feature)?.costTHB ?? 0)
    ), 0);

    return {
      feature,
      commands,
      costTHB: +costTHB.toFixed(2),
      sharePercent: Math.round((commands / Math.max(totalCommandsPerMonth, 1)) * 100),
    };
  })
  .sort((a, b) => b.commands - a.commands);

const aiPeriodCommandRatio = {
  today: aiStatsByPeriod.today.commands / Math.max(totalCommandsPerMonth, 1),
  month: 1,
  "6months": aiStatsByPeriod["6months"].commands / Math.max(totalCommandsPerMonth, 1),
  year: aiStatsByPeriod.year.commands / Math.max(totalCommandsPerMonth, 1),
} satisfies Record<AiMonitorPeriod, number>;

const aiPeriodCostRatio = {
  today: aiStatsByPeriod.today.totalCostTHB / Math.max(totalMonthlyAiCostTHB, 1),
  month: 1,
  "6months": aiStatsByPeriod["6months"].totalCostTHB / Math.max(totalMonthlyAiCostTHB, 1),
  year: aiStatsByPeriod.year.totalCostTHB / Math.max(totalMonthlyAiCostTHB, 1),
} satisfies Record<AiMonitorPeriod, number>;

const aiFeaturePeriodWeights: Record<AiMonitorPeriod, Record<UserFeatureName, number>> = {
  today: { การเงิน: 1.06, การเรียน: 0.96, ไลฟ์สไตล์: 0.98 },
  month: { การเงิน: 1, การเรียน: 1, ไลฟ์สไตล์: 1 },
  "6months": { การเงิน: 1.02, การเรียน: 1.04, ไลฟ์สไตล์: 0.94 },
  year: { การเงิน: 1.08, การเรียน: 0.99, ไลฟ์สไตล์: 0.93 },
};

function scaleByRatio(value: number, ratio: number) {
  return Math.max(1, Math.round(value * ratio));
}

export const aiFeatureUsageSummaryByPeriod = Object.fromEntries(
  (Object.keys(aiStatsByPeriod) as AiMonitorPeriod[]).map((period) => {
    const weightedCommands = aiFeatureUsageSummaryMonth.map((item) => ({
      ...item,
      commands: item.commands * aiPeriodCommandRatio[period] * aiFeaturePeriodWeights[period][item.feature],
      costTHB: item.costTHB * aiPeriodCostRatio[period] * aiFeaturePeriodWeights[period][item.feature],
    }));
    const totalCommands = weightedCommands.reduce((sum, item) => sum + item.commands, 0);

    return [period, weightedCommands
      .map((item) => ({
        feature: item.feature,
        commands: Math.max(1, Math.round(item.commands)),
        costTHB: +item.costTHB.toFixed(2),
        sharePercent: Math.round((item.commands / Math.max(totalCommands, 1)) * 100),
      }))
      .sort((a, b) => b.commands - a.commands)];
  }),
) as Record<AiMonitorPeriod, typeof aiFeatureUsageSummaryMonth>;

export const aiFeatureUsageSummary = aiFeatureUsageSummaryByPeriod.month;

const tokenUsageDailySeries = splitIntegerTotal(totalTokensPerMonth, monthDayWeights);

export const tokenUsageDaily = tokenUsageDailySeries.map((tokens, index) => ({
  day: String(index + 1),
  tokens,
  cost: +((tokens / Math.max(totalTokensPerMonth, 1)) * totalMonthlyAiCostTHB).toFixed(2),
}));

export const aiTokenSummary = {
  totalTokens: totalTokensPerMonth,
  totalTokensLabel: `${(totalTokensPerMonth / 1_000_000).toFixed(2)}M tokens`,
  inputTokens: totalInputTokensPerMonth,
  outputTokens: totalOutputTokensPerMonth,
  monthlyCostTHB: totalMonthlyAiCostTHB,
  costPerUserPerMonthTHB,
  costPerCommandTHB: aiCostPerCommandTHB,
};

const aiPromptTemplates: Record<UserFeatureName, [string, string]> = {
  การเงิน: ["สรุปรายจ่ายเดือนนี้ให้หน่อย", "เดือนนี้ใช้จ่ายหมวดไหนเยอะสุด"],
  การเรียน: ["สัปดาห์นี้มีการบ้านอะไรต้องส่งบ้าง", "วันนี้เรียนวิชาอะไร ห้องไหน"],
  ไลฟ์สไตล์: ["พรุ่งนี้มีนัดอะไรบ้าง", "ตั้งเตือนงานสำคัญให้หน่อย"],
};

export const aiTopPromptsByFeatureByPeriod = Object.fromEntries(
  (Object.keys(aiStatsByPeriod) as AiMonitorPeriod[]).map((period) => [period, aiFeatureUsageSummaryByPeriod[period].map((featureUsage) => ({
    feature: featureUsage.feature,
    prompts: [
      { prompt: aiPromptTemplates[featureUsage.feature][0], count: Math.max(1, Math.round(featureUsage.commands * 0.18)) },
      { prompt: aiPromptTemplates[featureUsage.feature][1], count: Math.max(1, Math.round(featureUsage.commands * 0.14)) },
    ],
  }))]),
) as Record<AiMonitorPeriod, Array<{
  feature: UserFeatureName;
  prompts: Array<{ prompt: string; count: number }>;
}>>;

export const aiTopPromptsByFeature = aiTopPromptsByFeatureByPeriod.month;

const whisperMonthlyCostUSD = whisperMinutesPerMonth * WHISPER_PRICE_PER_MINUTE_USD;
const cohereMonthlyCostUSD = (totalInputTokensPerMonth / 1_000_000) * COHERE_PRICE_PER_MILLION_TOKENS_USD;
const haikuInputMonthlyCostUSD = (totalInputTokensPerMonth / 1_000_000) * HAIKU_INPUT_PRICE_PER_MILLION_TOKENS_USD;
const haikuOutputMonthlyCostUSD = (totalOutputTokensPerMonth / 1_000_000) * HAIKU_OUTPUT_PRICE_PER_MILLION_TOKENS_USD;
const haikuMonthlyCostUSD = haikuInputMonthlyCostUSD + haikuOutputMonthlyCostUSD;
const theoreticalMonthlyAiCostTHB = (whisperMonthlyCostUSD + cohereMonthlyCostUSD + haikuMonthlyCostUSD) * USD_TO_THB;
const whisperAllocatedCostTHB = theoreticalMonthlyAiCostTHB > 0
  ? +((totalMonthlyAiCostTHB * ((whisperMonthlyCostUSD * USD_TO_THB) / theoreticalMonthlyAiCostTHB)).toFixed(2))
  : 0;
const cohereAllocatedCostTHB = theoreticalMonthlyAiCostTHB > 0
  ? +((totalMonthlyAiCostTHB * ((cohereMonthlyCostUSD * USD_TO_THB) / theoreticalMonthlyAiCostTHB)).toFixed(2))
  : 0;
const haikuAllocatedCostTHB = +(totalMonthlyAiCostTHB - whisperAllocatedCostTHB - cohereAllocatedCostTHB).toFixed(2);

export const aiModelUsage = [
  {
    model: "Claude Haiku 3.5",
    inputTokens: totalInputTokensPerMonth,
    outputTokens: totalOutputTokensPerMonth,
    costTHB: haikuAllocatedCostTHB,
    costUSD: haikuAllocatedCostTHB / USD_TO_THB,
    unit: "tokens" as const,
  },
  {
    model: "Cohere Embed v4",
    inputTokens: totalInputTokensPerMonth,
    outputTokens: 0,
    costTHB: cohereAllocatedCostTHB,
    costUSD: cohereAllocatedCostTHB / USD_TO_THB,
    unit: "tokens" as const,
  },
  {
    model: "OpenAI Whisper",
    inputTokens: Math.round(whisperMinutesPerMonth),
    outputTokens: 0,
    costTHB: whisperAllocatedCostTHB,
    costUSD: whisperAllocatedCostTHB / USD_TO_THB,
    unit: "minutes" as const,
  },
];

const aiModelPeriodWeights: Record<AiMonitorPeriod, Record<string, number>> = {
  today: { "Claude Haiku 3.5": 1.02, "Cohere Embed v4": 1, "OpenAI Whisper": 0.98 },
  month: { "Claude Haiku 3.5": 1, "Cohere Embed v4": 1, "OpenAI Whisper": 1 },
  "6months": { "Claude Haiku 3.5": 1.04, "Cohere Embed v4": 1.01, "OpenAI Whisper": 0.95 },
  year: { "Claude Haiku 3.5": 1.08, "Cohere Embed v4": 1.03, "OpenAI Whisper": 0.91 },
};

export const aiModelUsageByPeriod = Object.fromEntries(
  (Object.keys(aiStatsByPeriod) as AiMonitorPeriod[]).map((period) => {
    const scaledModels = aiModelUsage.map((model) => {
      const tokenRatio = model.unit === "minutes" ? aiPeriodCommandRatio[period] : aiPeriodCommandRatio[period] * aiModelPeriodWeights[period][model.model];
      const costRatio = aiPeriodCostRatio[period] * aiModelPeriodWeights[period][model.model];

      return {
        ...model,
        inputTokens: scaleByRatio(model.inputTokens, tokenRatio),
        outputTokens: model.outputTokens > 0 ? scaleByRatio(model.outputTokens, tokenRatio) : 0,
        costTHB: +(model.costTHB * costRatio).toFixed(2),
        costUSD: +((model.costTHB * costRatio) / USD_TO_THB).toFixed(2),
      };
    });

    return [period, scaledModels];
  }),
) as Record<AiMonitorPeriod, typeof aiModelUsage>;

type UnresolvedQuery = typeof unresolvedQueries[number];

const unresolvedQueriesMonth: UnresolvedQuery[] = [
  { query: "ช่วยจองตั๋วเครื่องบินให้หน่อย", count: 89, category: "off-topic" },
  { query: "ราคาทองวันนี้เท่าไหร่", count: 67, category: "off-topic" },
  { query: "แปลโค้ด Python นี้ให้หน่อย", count: 45, category: "off-topic" },
  { query: "วิเคราะห์หุ้น xxx ให้หน่อย", count: 38, category: "off-topic" },
  { query: "เขียน essay ภาษาจีนให้หน่อย", count: 31, category: "off-topic" },
];

const unresolvedPeriodWeights = {
  today: [0.92, 1.04, 0.96, 1.02, 0.9],
  month: [1, 1, 1, 1, 1],
  "6months": [1.08, 0.94, 1.12, 1.05, 1.09],
  year: [1.12, 0.9, 1.16, 1.08, 1.12],
} satisfies Record<AiMonitorPeriod, number[]>;

export const unresolvedQueriesByPeriod = Object.fromEntries(
  (Object.keys(aiStatsByPeriod) as AiMonitorPeriod[]).map((period) => [period, unresolvedQueriesMonth
    .map((query, index) => ({
      ...query,
      count: scaleByRatio(query.count, aiPeriodCommandRatio[period] * unresolvedPeriodWeights[period][index]),
    }))
    .sort((a, b) => b.count - a.count)]),
) as Record<AiMonitorPeriod, UnresolvedQuery[]>;

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
  { plan: "Plus+ Monthly", revenue: plusMonthly * 79, percentage: Math.round((plusMonthly * 79) / Math.max(mrr, 1) * 100) },
  { plan: "Plus+ Term", revenue: plusTerm * Math.round(259 / 4), percentage: Math.round((plusTerm * Math.round(259 / 4)) / Math.max(mrr, 1) * 100) },
  { plan: "Plus+ Yearly", revenue: plusYearly * Math.round(699 / 12), percentage: Math.round((plusYearly * Math.round(699 / 12)) / Math.max(mrr, 1) * 100) },
];

// 4.6 Transaction History Table
export const transactionHistory = managedUsers
  .filter((u) => u.plan !== "FREE")
  .slice(0, 20)
  .map((u, i) => ({
    id: `TXN-${String(i + 1).padStart(4, "0")}`,
    date: `2026-03-${String(11 - (i % 4)).padStart(2, "0")}`,
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
  { id: "NTF-001", title: "แจ้งเตือนระบบชำระเงิน", category: "การเงิน", type: "Push Notification", audience: "ผู้ใช้ทั้งหมด", sentAt: "2026-03-11 10:20", status: "Sent", metrics: { sent: 6456, delivered: 6320, opened: 3120, clicked: 890 } },
  { id: "NTF-002", title: "โปรโมชัน Plus+ สุดสัปดาห์", category: "สำคัญ", type: "In-App Banner", audience: "ผู้ใช้ FREE ทั้งหมด", sentAt: "2026-03-10 19:11", status: "Sent", metrics: { sent: 2453, delivered: 2410, opened: 1680, clicked: 520 } },
  { id: "NTF-003", title: "ลองใช้วิดเจ็ตสิ!", category: "ระบบ", type: "In-App Modal", audience: "ยังไม่เคยติดตั้งวิดเจ็ต", sentAt: "2026-03-09 08:00", status: "Sent", metrics: { sent: 1200, delivered: 1180, opened: 780, clicked: 340 } },
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
  { id: "AB-001", name: "Upgrade CTA", variantA: "อัปเกรดตอนนี้!", variantB: "ลองใช้ PLUS ฟรี 7 วัน", metric: "Click Rate", status: "completed", resultA: 12, resultB: 18, winner: "B" },
  { id: "AB-002", name: "Win-back Message", variantA: "เราคิดถึงคุณ", variantB: "มีฟีเจอร์ใหม่รอคุณอยู่", metric: "Open Rate", status: "running", resultA: 45, resultB: 52 },
];

/* ──────────────────────────────────────────────
 * 6. Settings – Page 6
 * ────────────────────────────────────────────── */

// 6.1 Admin Accounts & Roles
export type AdminAccount = {
  id: string;
  name: string;
  username: string;
  role: string;
  lastLogin: string;
  avatar: string;
};

export const adminAccounts: AdminAccount[] = [
  { id: "ADM-01", name: "Theodore Finch", username: "theodore", role: "System Owner", lastLogin: "2026-03-04 14:30", avatar: "https://ui.shadcn.com/avatars/01.png" },
  { id: "ADM-02", name: "Natthaphon Sriwan", username: "natthaphon", role: "Admin", lastLogin: "2026-03-04 12:15", avatar: "https://ui.shadcn.com/avatars/02.png" },
  { id: "ADM-03", name: "Pimchanok Teerawat", username: "pimchanok", role: "Admin", lastLogin: "2026-03-03 09:00", avatar: "https://ui.shadcn.com/avatars/03.png" },
];

export const adminRoles = [
  { role: "Owner", access: "เข้าถึงทุกหน้า ทุก action รวมถึงลบและเพิ่มผู้ดูแลได้", users: 1 },
  { role: "ซุปเปอร์แอดมิน", access: "เข้าถึงทุกหน้า ทุก action รวมถึงตั้งค่าระบบ", users: 1 },
  { role: "Admin", access: "เข้าถึงทุกหน้า ยกเว้น ตั้งค่าระบบ > จัดการผู้ดูแล", users: 2 },
  { role: "การเงิน", access: "เข้าถึงหน้า การสมัครสมาชิก เท่านั้น", users: 1 },
  { role: "ซัพพอร์ต", access: "เข้าถึงหน้า จัดการผู้ใช้ และ ภาพรวม", users: 3 },
  { role: "การตลาด", access: "เข้าถึงหน้า การแจ้งเตือน และ ภาพรวม", users: 1 },
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
  avatar: string;
  action: string;
  targetUserId?: string;
  targetUserName?: string;
  details: string;
};

export const auditLog: AuditLogEntry[] = [
  { id: "AUD-01", timestamp: "2026-03-11 14:30", adminName: "Theodore", avatar: "https://ui.shadcn.com/avatars/01.png", action: "แก้ไขราคาแพ็กเกจ", details: "PLUS รายเดือน ฿59 → ฿79" },
  { id: "AUD-02", timestamp: "2026-03-11 12:15", adminName: "Natthaphon", avatar: "https://ui.shadcn.com/avatars/02.png", action: "เปลี่ยนแพ็กเกจผู้ใช้", targetUserId: "U-0042", targetUserName: "Somsak P.", details: "FREE → PLUS รายเดือน" },
  { id: "AUD-03", timestamp: "2026-03-11 10:00", adminName: "Pimchanok", avatar: "https://ui.shadcn.com/avatars/03.png", action: "ระงับบัญชีผู้ใช้", targetUserId: "U-1293", targetUserName: "Wichai S.", details: "เหตุผล: พฤติกรรมไม่เหมาะสม" },
  { id: "AUD-04", timestamp: "2026-03-10 18:45", adminName: "Theodore", avatar: "https://ui.shadcn.com/avatars/01.png", action: "เปิดฟีเจอร์", details: "Voice Input · เปิดใช้งานแล้ว" },
  { id: "AUD-05", timestamp: "2026-03-10 15:20", adminName: "Natthaphon", avatar: "https://ui.shadcn.com/avatars/02.png", action: "ส่งการแจ้งเตือน", targetUserName: "ผู้ใช้ทุกคน", details: "NTF-003 · \"อัปเดตระบบชำระเงินคืนนี้\"" },
  { id: "AUD-06", timestamp: "2026-03-10 11:00", adminName: "Pimchanok", avatar: "https://ui.shadcn.com/avatars/03.png", action: "ตอบกลับ Feedback", targetUserId: "U-0891", targetUserName: "Anong K.", details: "\"ขอบคุณที่แจ้งมานะคะ ทีมกำลังแก้ไขอยู่\"" },
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
  defaultModel: "claude-haiku-3.5" as string,
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
