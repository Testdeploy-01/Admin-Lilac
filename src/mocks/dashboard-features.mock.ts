export type TrendType = "up" | "down" | "neutral";

export const overviewKpis = [
  { label: "Total Users", value: "48,921", delta: "+5.2%", trend: "up" as TrendType },
  { label: "New PLUS+ Subs", value: "1,208", delta: "+12.4%", trend: "up" as TrendType },
  { label: "Revenue Summary", value: "$92,430", delta: "+7.9%", trend: "up" as TrendType },
  { label: "System Health", value: "99.95%", delta: "-0.03%", trend: "down" as TrendType },
];

export const overviewTrend = [
  { label: "Mon", value: 62 },
  { label: "Tue", value: 68 },
  { label: "Wed", value: 74 },
  { label: "Thu", value: 70 },
  { label: "Fri", value: 82 },
  { label: "Sat", value: 76 },
  { label: "Sun", value: 88 },
];

export const recentActivities = [
  { id: "ACT-01", text: "User ID 1092 started Fast-Track study mode", time: "2 mins ago", kind: "user" },
  { id: "ACT-02", text: "User ID 8831 upgraded to PLUS+ annual plan", time: "15 mins ago", kind: "payment" },
  { id: "ACT-03", text: "Nightly system backup completed successfully", time: "1 hour ago", kind: "system" },
  { id: "ACT-04", text: "Admin P. updated AI core model to v4.0", time: "3 hours ago", kind: "admin" },
  { id: "ACT-05", text: "User ID 4421 reported login issue", time: "5 hours ago", kind: "feedback" },
];

export const coreModels = [
  { id: "llm-4.1", name: "LLM Core v4.1", latency: "1.8s", status: "Active" },
  { id: "llm-4.0", name: "LLM Core v4.0", latency: "2.1s", status: "Standby" },
  { id: "llm-3.9", name: "LLM Legacy v3.9", latency: "2.9s", status: "Retired" },
];

export const knowledgeEntries = [
  { topic: "University Admissions", version: "v2.1", updatedAt: "2026-03-01", owner: "Curriculum AI" },
  { topic: "Personal Finance Basics", version: "v1.7", updatedAt: "2026-02-28", owner: "Finance Team" },
  { topic: "Lifestyle Wellness", version: "v1.3", updatedAt: "2026-02-24", owner: "Content Ops" },
];

export const tokenUsage = {
  monthlyTotal: "1.24M / 2.00M",
  averageLatency: "1.86 sec",
  successRate: "99.2%",
  byModel: [
    { model: "LLM Core v4.1", tokens: 820_000 },
    { model: "LLM Core v4.0", tokens: 360_000 },
    { model: "LLM Legacy v3.9", tokens: 60_000 },
  ],
};

export const courseLibrary = [
  { code: "MATH-101", title: "Foundations of Algebra", lessons: 18, quizzes: 6, activeLearners: 1432 },
  { code: "SCI-202", title: "Biology for Entrance Exams", lessons: 24, quizzes: 9, activeLearners: 980 },
  { code: "LANG-304", title: "Academic English Essentials", lessons: 16, quizzes: 5, activeLearners: 1210 },
];

export const learnerStatistics = [
  { metric: "Most Popular Subject", value: "Mathematics", note: "31% of total enrollments" },
  { metric: "Avg. Completion Rate", value: "74%", note: "Across all active cohorts" },
  { metric: "Weekly Active Learners", value: "12,090", note: "Latest 7-day snapshot" },
];

export const invoiceHistory = [
  { invoice: "INV-202603-001", user: "U-1092", amount: "$120.00", method: "Credit Card", status: "Paid", date: "2026-03-02" },
  { invoice: "INV-202603-002", user: "U-8831", amount: "$49.00", method: "PromptPay", status: "Pending", date: "2026-03-02" },
  { invoice: "INV-202603-003", user: "U-4421", amount: "$12.00", method: "Bank Transfer", status: "Paid", date: "2026-03-01" },
];

export const manualApprovals = [
  { requestId: "APR-9011", user: "U-5521", amount: "$49.00", submittedAt: "2026-03-02 09:20", bankRef: "TTB-9810021" },
  { requestId: "APR-9012", user: "U-7340", amount: "$120.00", submittedAt: "2026-03-02 10:14", bankRef: "KTB-1209910" },
];

export const lifestyleCards = [
  { id: "LC-001", title: "Morning Focus Ritual", type: "Quote Card", schedule: "Daily 07:00", status: "Published" },
  { id: "LC-002", title: "Hydration Reminder", type: "Health Prompt", schedule: "Daily 14:00", status: "Published" },
  { id: "LC-003", title: "Evening Reflection", type: "Journal Prompt", schedule: "Daily 20:30", status: "Draft" },
];

export const lifestyleUsageStats = [
  { metric: "Bookmarks", value: "18,230" },
  { metric: "Likes", value: "51,904" },
  { metric: "Shares", value: "7,112" },
];

export const managedUsers = [
  {
    id: "U-1092",
    name: "Napat K.",
    plan: "PLUS+",
    status: "active",
    favoriteCategory: "Study",
    lastLogin: "2026-03-03 08:14",
    quotaRemaining: "42%",
    purchases: 3,
  },
  {
    id: "U-8831",
    name: "Sirin P.",
    plan: "FREE",
    status: "visitor",
    favoriteCategory: "Lifestyle",
    lastLogin: "2026-03-03 07:51",
    quotaRemaining: "100%",
    purchases: 0,
  },
  {
    id: "U-4421",
    name: "Anon C.",
    plan: "PLUS+",
    status: "suspended",
    favoriteCategory: "Finance",
    lastLogin: "2026-03-01 22:04",
    quotaRemaining: "0%",
    purchases: 8,
  },
  {
    id: "U-6604",
    name: "Mali R.",
    plan: "FREE",
    status: "active",
    favoriteCategory: "Study",
    lastLogin: "2026-03-03 11:42",
    quotaRemaining: "76%",
    purchases: 1,
  },
];

export const subscriptionAnalytics = [
  { label: "FREE Users", value: "36,500", note: "74.6%" },
  { label: "PLUS+ Users", value: "12,421", note: "25.4%" },
  { label: "Conversion Rate", value: "6.8%", note: "30-day rolling" },
];

export const pricingTiers = [
  { id: "tier-monthly", name: "PLUS+ Monthly", cycle: "Monthly", price: "$12", badge: "Starter", highlighted: false },
  { id: "tier-quarterly", name: "PLUS+ Quarterly", cycle: "Quarterly", price: "$30", badge: "Popular", highlighted: true },
  { id: "tier-annual", name: "PLUS+ Annual", cycle: "Yearly", price: "$120", badge: "Best Value", highlighted: false },
];

export const plusFeatures = [
  { id: "pf-01", title: "Priority AI Responses", description: "Lower latency during peak hours", visible: true },
  { id: "pf-02", title: "Extended Token Quota", description: "Higher monthly token allowance", visible: true },
  { id: "pf-03", title: "Advanced Progress Insights", description: "Deep analytics breakdown", visible: false },
];

export const audienceTargets = ["All Users", "FREE Segment", "PLUS+ Segment", "Dormant Users"];
export const noticeCategories = ["System Notice", "Promotion", "Learning Update", "Lifestyle Campaign"];

export const adminRoles = [
  { role: "Super Admin", access: "Full system + billing + AI tuning", users: 2 },
  { role: "Operations Admin", access: "Users + notifications + feedback", users: 4 },
  { role: "Support Staff", access: "Read-only + user assist tools", users: 6 },
];

export const systemLogs = [
  { timestamp: "2026-03-03 12:11:02", level: "INFO", source: "scheduler", message: "Nightly lifestyle sync finished", traceId: "TRC-9011" },
  { timestamp: "2026-03-03 12:04:29", level: "ERROR", source: "payment-gateway", message: "PromptPay callback timeout", traceId: "TRC-9008" },
  { timestamp: "2026-03-03 11:58:16", level: "WARN", source: "ai-manager", message: "Token usage reached 82% of daily budget", traceId: "TRC-9001" },
  { timestamp: "2026-03-03 11:41:50", level: "INFO", source: "user-service", message: "User segment cache refreshed", traceId: "TRC-8998" },
];

export const feedbackKpis = [
  { label: "Total Reviews", value: "2,341" },
  { label: "Average Rating", value: "4.4 / 5" },
  { label: "Open Issues", value: "57" },
];

export const feedbackEntries = [
  { id: "FB-101", userId: "U-1092", tag: "issues", rating: 2, comment: "Video lesson freezes at 12:10", date: "2026-03-03", status: "Open" },
  { id: "FB-102", userId: "U-5521", tag: "feature", rating: 4, comment: "Need weekly finance challenge mode", date: "2026-03-02", status: "In Review" },
  { id: "FB-103", userId: "U-7340", tag: "praise", rating: 5, comment: "AI explanation quality improved a lot", date: "2026-03-01", status: "Closed" },
  { id: "FB-104", userId: "U-8831", tag: "issues", rating: 3, comment: "Push notifications are sometimes delayed", date: "2026-03-01", status: "Open" },
];

export type HealthStatus = "operational" | "degraded" | "down";

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
