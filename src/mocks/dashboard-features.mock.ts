export type TrendType = "up" | "down" | "neutral";

export type AiPeriod = "today" | "7d" | "month" | "year";

export type HealthStatus = "operational" | "degraded" | "down";

export const overviewKpis = [
  { label: "ผู้ใช้ทั้งหมด", value: "48,921", delta: "+5.2%", trend: "up" as TrendType },
  { label: "ผู้ใช้วันนี้ (DAU)", value: "12,384", delta: "+3.1%", trend: "up" as TrendType },
  { label: "การแจ้งเตือนที่ใช้งานอยู่", value: "182", delta: "+2.4%", trend: "up" as TrendType },
  { label: "ใช้งาน Shortcut วันนี้", value: "7,140", delta: "-1.3%", trend: "down" as TrendType },
];

export const overviewGrowth30d = [
  { day: "1", users: 312 },
  { day: "2", users: 326 },
  { day: "3", users: 340 },
  { day: "4", users: 355 },
  { day: "5", users: 362 },
  { day: "6", users: 371 },
  { day: "7", users: 380 },
  { day: "8", users: 392 },
  { day: "9", users: 405 },
  { day: "10", users: 412 },
  { day: "11", users: 420 },
  { day: "12", users: 432 },
  { day: "13", users: 439 },
  { day: "14", users: 451 },
  { day: "15", users: 460 },
  { day: "16", users: 470 },
  { day: "17", users: 478 },
  { day: "18", users: 488 },
  { day: "19", users: 495 },
  { day: "20", users: 502 },
  { day: "21", users: 510 },
  { day: "22", users: 520 },
  { day: "23", users: 532 },
  { day: "24", users: 540 },
  { day: "25", users: 550 },
  { day: "26", users: 559 },
  { day: "27", users: 566 },
  { day: "28", users: 575 },
  { day: "29", users: 582 },
  { day: "30", users: 594 },
];

export const overviewUsageByModule = [
  { module: "การเรียน", value: 46 },
  { module: "การเงิน", value: 31 },
  { module: "ไลฟ์สไตล์", value: 23 },
];

export const recentActivities = [
  { id: "ACT-01", text: "U-1092 สมัครแพ็กเกจ PLUS+ รายปี", time: "2 นาทีที่แล้ว", kind: "payment" },
  { id: "ACT-02", text: "U-8831 เปิดใช้งาน Study Planner 3 ครั้ง", time: "9 นาทีที่แล้ว", kind: "user" },
  { id: "ACT-03", text: "ส่งแจ้งเตือนแคมเปญการเงินครบทุกกลุ่มแล้ว", time: "17 นาทีที่แล้ว", kind: "system" },
  { id: "ACT-04", text: "U-4421 รายงานปัญหาการรับ OTP", time: "24 นาทีที่แล้ว", kind: "feedback" },
  { id: "ACT-05", text: "ทีมแอดมินอัปเดต fallback model เป็น v4.1", time: "41 นาทีที่แล้ว", kind: "admin" },
];

export const popularFeatures = [
  { feature: "AI Study Summary", calls: 14230 },
  { feature: "Budget Auto-Categorization", calls: 12894 },
  { feature: "Lifestyle Mood Coach", calls: 11052 },
  { feature: "Exam Reminder", calls: 9821 },
  { feature: "Subscription Upgrade Prompt", calls: 7740 },
];

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
      { label: "Token ทั้งหมด", value: "214,900", note: "เข้า 124,500 / ออก 90,400" },
      { label: "ต้นทุน AI", value: "฿5,342", note: "USD rate 35.8" },
      { label: "ความแม่นยำ Intent", value: "96.8%", note: "จาก 8,302 requests" },
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
      { label: "Token ทั้งหมด", value: "1,240,000", note: "เข้า 732,100 / ออก 507,900" },
      { label: "ต้นทุน AI", value: "฿30,840", note: "USD rate 35.8" },
      { label: "ความแม่นยำ Intent", value: "97.3%", note: "จาก 52,810 requests" },
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
      { label: "Token ทั้งหมด", value: "5,920,000", note: "เข้า 3,441,000 / ออก 2,479,000" },
      { label: "ต้นทุน AI", value: "฿147,530", note: "USD rate 35.8" },
      { label: "ความแม่นยำ Intent", value: "97.1%", note: "จาก 243,100 requests" },
      { label: "กำไรขั้นต้น", value: "57.9%", note: "เทียบกับรายได้สมาชิก" },
    ],
    tokenCostBars: [
      { label: "สัปดาห์ 1", tokens: 1410000, costTHB: 35210 },
      { label: "สัปดาห์ 2", tokens: 1470000, costTHB: 36720 },
      { label: "สัปดาห์ 3", tokens: 1510000, costTHB: 37650 },
      { label: "สัปดาห์ 4", tokens: 1530000, costTHB: 37950 },
    ],
    categoryShare: [
      { category: "Study", value: 44 },
      { category: "Finance", value: 34 },
      { category: "Lifestyle", value: 22 },
    ],
  },
  year: {
    kpis: [
      { label: "Token ทั้งหมด", value: "64,300,000", note: "เข้า 37,450,000 / ออก 26,850,000" },
      { label: "ต้นทุน AI", value: "฿1,610,400", note: "USD rate 35.8" },
      { label: "ความแม่นยำ Intent", value: "96.7%", note: "จาก 2.61M requests" },
      { label: "กำไรขั้นต้น", value: "55.8%", note: "เทียบกับรายได้สมาชิก" },
    ],
    tokenCostBars: [
      { label: "Q1", tokens: 15600000, costTHB: 390200 },
      { label: "Q2", tokens: 16000000, costTHB: 401800 },
      { label: "Q3", tokens: 16300000, costTHB: 409300 },
      { label: "Q4", tokens: 16400000, costTHB: 409100 },
    ],
    categoryShare: [
      { category: "Study", value: 43 },
      { category: "Finance", value: 35 },
      { category: "Lifestyle", value: 22 },
    ],
  },
};

export const aiModelUsage = [
  { model: "Claude Haiku", tokens: 860000, costTHB: 20400 },
  { model: "Claude Sonnet", tokens: 310000, costTHB: 9100 },
  { model: "Claude Opus", tokens: 70000, costTHB: 5340 },
];

export type AiUsageRow = {
  userId: string;
  plan: "FREE" | "PLUS+";
  inputTokens: number;
  outputTokens: number;
  revenueTHB: number;
  costTHB: number;
};

export const aiUsageRows: AiUsageRow[] = [
  { userId: "U-1092", plan: "PLUS+", inputTokens: 18230, outputTokens: 9220, revenueTHB: 420, costTHB: 121 },
  { userId: "U-8831", plan: "FREE", inputTokens: 6240, outputTokens: 2880, revenueTHB: 0, costTHB: 57 },
  { userId: "U-4421", plan: "PLUS+", inputTokens: 26110, outputTokens: 13110, revenueTHB: 420, costTHB: 176 },
  { userId: "U-7340", plan: "PLUS+", inputTokens: 10420, outputTokens: 5122, revenueTHB: 420, costTHB: 84 },
  { userId: "U-5521", plan: "FREE", inputTokens: 8120, outputTokens: 4200, revenueTHB: 0, costTHB: 71 },
];

export const studyKpis = [
  { label: "ผู้ใช้สร้างตารางเรียน", value: "68%", note: "ของผู้ใช้ทั้งหมด" },
  { label: "Event สอบ/โปรเจกต์ต่อสัปดาห์", value: "1,482", note: "เพิ่มขึ้น 9.4%" },
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
  {
    id: "STD-001",
    title: "Midterm Calculus",
    university: "จุฬาลงกรณ์มหาวิทยาลัย",
    year: "ปี 1",
    dueIn: "อีก 3 วัน",
    insight: "คำถาม AI วิชานี้เพิ่มขึ้น +22%",
  },
  {
    id: "STD-002",
    title: "Data Structure Project",
    university: "มหาวิทยาลัยธรรมศาสตร์",
    year: "ปี 2",
    dueIn: "อีก 5 วัน",
    insight: "ผู้ใช้ถามเรื่องการออกแบบอัลกอริทึมเพิ่มขึ้น +18%",
  },
  {
    id: "STD-003",
    title: "Organic Chemistry Quiz",
    university: "มหาวิทยาลัยเชียงใหม่",
    year: "ปี 1",
    dueIn: "อีก 2 วัน",
    insight: "บทเรียนทบทวนถูกเรียกใช้สูงกว่าปกติ +17%",
  },
  {
    id: "STD-004",
    title: "Business Analytics Presentation",
    university: "มหาวิทยาลัยเกษตรศาสตร์",
    year: "ปี 3",
    dueIn: "อีก 6 วัน",
    insight: "AI สรุปสไลด์ถูกใช้งานเพิ่มขึ้น +26%",
  },
];

export const financeKpis = [
  { label: "ผู้ใช้ที่คุมงบได้ (On-track)", value: "57%", note: "+2.8% จากสัปดาห์ก่อน" },
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

export const lifestyleKpis = [
  { label: "ผู้ใช้ที่มี Routine", value: "72%", note: "ตั้งเตือนอย่างน้อย 1 รายการ" },
  { label: "ไดอารี่ที่แนบรูปภาพ", value: "9,432", note: "ช่วง 30 วันล่าสุด" },
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
  { slot: "06:00", users: 1860 },
  { slot: "07:00", users: 3022 },
  { slot: "17:00", users: 2410 },
  { slot: "21:00", users: 1902 },
];

export type UserTableRowExpanded = {
  id: string;
  name: string;
  avatar: string;
  plan: "PLUS+" | "FREE";
  signupDate: string;
  favoriteCategory: "Study" | "Finance" | "Lifestyle";
  systemAlert: string;
  monthlyTokens: number;
  aiCostTHB: number;
  status: "active" | "suspended" | "new";
  lastLogin: string;
};

export const managedUsers: UserTableRowExpanded[] = [
  {
    id: "U-1092",
    name: "Napat K.",
    avatar: "https://ui.shadcn.com/avatars/01.png",
    plan: "PLUS+",
    signupDate: "2026-01-10",
    favoriteCategory: "Study",
    systemAlert: "Normal",
    monthlyTokens: 28230,
    aiCostTHB: 121,
    status: "active",
    lastLogin: "2026-03-03 08:14",
  },
  {
    id: "U-8831",
    name: "Sirin P.",
    avatar: "https://ui.shadcn.com/avatars/02.png",
    plan: "FREE",
    signupDate: "2026-02-27",
    favoriteCategory: "Lifestyle",
    systemAlert: "Needs follow-up",
    monthlyTokens: 9120,
    aiCostTHB: 57,
    status: "new",
    lastLogin: "2026-03-03 07:51",
  },
  {
    id: "U-4421",
    name: "Anon C.",
    avatar: "https://ui.shadcn.com/avatars/03.png",
    plan: "PLUS+",
    signupDate: "2025-11-02",
    favoriteCategory: "Finance",
    systemAlert: "High token burn",
    monthlyTokens: 39220,
    aiCostTHB: 176,
    status: "suspended",
    lastLogin: "2026-03-01 22:04",
  },
  {
    id: "U-6604",
    name: "Mali R.",
    avatar: "https://ui.shadcn.com/avatars/04.png",
    plan: "FREE",
    signupDate: "2026-02-25",
    favoriteCategory: "Study",
    systemAlert: "Normal",
    monthlyTokens: 11540,
    aiCostTHB: 84,
    status: "new",
    lastLogin: "2026-03-03 11:42",
  },
  {
    id: "U-5521",
    name: "Pimnara T.",
    avatar: "https://ui.shadcn.com/avatars/05.png",
    plan: "PLUS+",
    signupDate: "2025-12-18",
    favoriteCategory: "Lifestyle",
    systemAlert: "Normal",
    monthlyTokens: 20110,
    aiCostTHB: 98,
    status: "active",
    lastLogin: "2026-03-03 10:02",
  },
  {
    id: "U-7340",
    name: "Tanawat L.",
    avatar: "https://ui.shadcn.com/avatars/06.png",
    plan: "PLUS+",
    signupDate: "2025-10-03",
    favoriteCategory: "Finance",
    systemAlert: "Margin low",
    monthlyTokens: 22350,
    aiCostTHB: 111,
    status: "active",
    lastLogin: "2026-03-03 09:38",
  },
];

export const pendingUsersCount = managedUsers.filter((user) => user.status === "new").length;

export const subscriptionOverviewKpis = [
  { label: "MRR", value: "฿1,842,000", note: "+6.2%" },
  { label: "สมาชิก PLUS+", value: "12,421", note: "25.4% ของทั้งหมด" },
  { label: "Conversion Rate", value: "6.8%", note: "ย้อนหลัง 30 วัน" },
  { label: "Churn", value: "2.1%", note: "ลดลง -0.4%" },
];

export const subscriptionPlans = [
  {
    id: "plan-monthly",
    name: "PLUS+ Monthly",
    cycle: "รายเดือน",
    priceTHB: 399,
    durationDays: 30,
    active: true,
    badge: "Starter",
  },
  {
    id: "plan-semester",
    name: "PLUS+ Semester",
    cycle: "รายเทอม",
    priceTHB: 990,
    durationDays: 120,
    active: true,
    badge: "Popular",
  },
  {
    id: "plan-yearly",
    name: "PLUS+ Yearly",
    cycle: "รายปี",
    priceTHB: 3490,
    durationDays: 365,
    active: false,
    badge: "Best Value",
  },
];

export const plusFeatures = [
  { id: "pf-01", title: "Priority AI Responses", description: "ลดเวลา Response ในช่วง Peak", visible: true },
  { id: "pf-02", title: "Extended Token Quota", description: "เพิ่มโควตา Token รายเดือน", visible: true },
  { id: "pf-03", title: "Advanced Insights", description: "รายงานเชิงลึกรายบุคคล", visible: false },
];

export const invoices = [
  {
    invoice: "INV-202603-001",
    user: "U-1092",
    plan: "PLUS+ Semester",
    amountTHB: 990,
    issuedAt: "2026-03-02",
    status: "Paid",
  },
  {
    invoice: "INV-202603-002",
    user: "U-8831",
    plan: "PLUS+ Monthly",
    amountTHB: 399,
    issuedAt: "2026-03-02",
    status: "Pending",
  },
  {
    invoice: "INV-202603-003",
    user: "U-5521",
    plan: "PLUS+ Yearly",
    amountTHB: 3490,
    issuedAt: "2026-03-01",
    status: "Paid",
  },
];

export const audienceTargets = ["ทุกคน", "กลุ่ม FREE", "กลุ่ม PLUS+", "กลุ่มกำหนดเอง"];
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
  {
    id: "NTF-001",
    title: "แจ้งเตือนระบบชำระเงิน",
    category: "การเงิน",
    audience: "ทุกคน",
    sentAt: "2026-03-03 10:20",
    status: "Sent",
  },
  {
    id: "NTF-002",
    title: "โปรโมชัน PLUS+ สุดสัปดาห์",
    category: "สำคัญ",
    audience: "กลุ่ม FREE",
    sentAt: "2026-03-02 19:11",
    status: "Sent",
  },
];

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

export const systemLogs = [
  {
    timestamp: "2026-03-03 12:11:02",
    level: "INFO",
    source: "scheduler",
    message: "Nightly lifestyle sync finished",
    traceId: "TRC-9011",
    userId: "U-1092",
    errorCode: "-",
  },
  {
    timestamp: "2026-03-03 12:04:29",
    level: "ERROR",
    source: "payment-gateway",
    message: "PromptPay callback timeout",
    traceId: "TRC-9008",
    userId: "U-8831",
    errorCode: "PAY-504",
  },
  {
    timestamp: "2026-03-03 11:58:16",
    level: "WARN",
    source: "ai-manager",
    message: "Token usage reached 82% of daily budget",
    traceId: "TRC-9001",
    userId: "-",
    errorCode: "AI-THRESHOLD",
  },
  {
    timestamp: "2026-03-03 11:41:50",
    level: "INFO",
    source: "user-service",
    message: "User segment cache refreshed",
    traceId: "TRC-8998",
    userId: "U-5521",
    errorCode: "-",
  },
];

export const feedbackEntries = [
  {
    id: "FB-101",
    userId: "U-1092",
    userName: "Napat K.",
    avatar: "https://ui.shadcn.com/avatars/01.png",
    tag: "ปัญหา",
    rating: 2,
    comment: "วิดีโอค้างช่วงนาทีที่ 12:10",
    date: "2026-03-03",
    status: "รอดำเนินการ",
  },
  {
    id: "FB-102",
    userId: "U-5521",
    userName: "Pimnara T.",
    avatar: "https://ui.shadcn.com/avatars/05.png",
    tag: "ข้อเสนอแนะ",
    rating: 4,
    comment: "อยากได้โหมด challenge รายสัปดาห์",
    date: "2026-03-02",
    status: "กำลังตรวจสอบ",
  },
  {
    id: "FB-103",
    userId: "U-7340",
    userName: "Tanawat L.",
    avatar: "https://ui.shadcn.com/avatars/06.png",
    tag: "คำชม",
    rating: 5,
    comment: "คุณภาพคำตอบ AI ดีขึ้นมาก",
    date: "2026-03-01",
    status: "แก้แล้ว",
  },
  {
    id: "FB-104",
    userId: "U-8831",
    userName: "Sirin P.",
    avatar: "https://ui.shadcn.com/avatars/02.png",
    tag: "ปัญหา",
    rating: 3,
    comment: "แจ้งเตือนเข้าไม่สม่ำเสมอ",
    date: "2026-03-01",
    status: "รอดำเนินการ",
  },
];

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
