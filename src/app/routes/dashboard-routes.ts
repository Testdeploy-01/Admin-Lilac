export type DashboardRouteKey =
  | "overview"
  | "user-management"
  | "ai-monitor"
  | "finance"
  | "notifications"
  | "settings";

export type DashboardRouteGroup = "หลัก" | "การจัดการ" | "ระบบ";

export type DashboardRouteMeta = {
  key: DashboardRouteKey;
  path: string;
  titleTH: string;
  group: DashboardRouteGroup;
  searchKeywords: string[];
  exportKey: DashboardRouteKey;
};

export const dashboardRouteMeta: DashboardRouteMeta[] = [
  {
    key: "overview",
    path: "/overview",
    titleTH: "แดชบอร์ด",
    group: "หลัก",
    searchKeywords: ["dashboard", "kpi", "overview", "สรุป", "ภาพรวม", "system status", "revenue today", "health"],
    exportKey: "overview",
  },
  {
    key: "user-management",
    path: "/user-management",
    titleTH: "ผู้ใช้งาน",
    group: "การจัดการ",
    searchKeywords: ["users", "plan", "suspend", "ผู้ใช้", "churn", "retention", "cohort", "dau", "manual input"],
    exportKey: "user-management",
  },
  {
    key: "ai-monitor",
    path: "/ai-monitor",
    titleTH: "AI Monitor",
    group: "การจัดการ",
    searchKeywords: ["ai", "token", "widget", "วิดเจ็ต", "error rate", "staleness", "prompt", "top prompts", "questions"],
    exportKey: "ai-monitor",
  },
  {
    key: "finance",
    path: "/finance",
    titleTH: "การเงิน",
    group: "การจัดการ",
    searchKeywords: ["finance", "mrr", "arr", "revenue", "churn", "arpu", "ltv", "transaction", "plus funnel", "upgrade path"],
    exportKey: "finance",
  },
  {
    key: "notifications",
    path: "/notifications",
    titleTH: "แจ้งเตือน",
    group: "ระบบ",
    searchKeywords: ["notifications", "broadcast", "campaign", "a/b test", "แจ้งเตือน", "schedule"],
    exportKey: "notifications",
  },
  {
    key: "settings",
    path: "/settings",
    titleTH: "ตั้งค่า",
    group: "ระบบ",
    searchKeywords: ["settings", "api", "admin", "role", "feature flag", "audit", "plan", "pricing"],
    exportKey: "settings",
  },
];

export function findRouteMeta(pathname: string) {
  return (
    dashboardRouteMeta.find((route) => pathname === route.path || pathname.startsWith(`${route.path}/`)) ??
    dashboardRouteMeta[0]
  );
}
