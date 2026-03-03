export type DashboardRouteKey =
  | "overview"
  | "ai-manager"
  | "study-config"
  | "finance"
  | "lifestyle"
  | "user-management"
  | "subscriptions"
  | "notifications"
  | "settings"
  | "logs"
  | "feedback"
  | "app-health";

export type DashboardRouteGroup = "หลัก" | "โมดูลแอป" | "ผู้ใช้งาน" | "ระบบ";

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
    titleTH: "ภาพรวม",
    group: "หลัก",
    searchKeywords: ["dashboard", "kpi", "overview", "สรุป", "ภาพรวม"],
    exportKey: "overview",
  },
  {
    key: "ai-manager",
    path: "/ai-manager",
    titleTH: "จัดการ AI",
    group: "โมดูลแอป",
    searchKeywords: ["ai", "token", "margin", "cost", "โมเดล"],
    exportKey: "ai-manager",
  },
  {
    key: "study-config",
    path: "/study-config",
    titleTH: "การเรียน",
    group: "โมดูลแอป",
    searchKeywords: ["study", "exam", "event", "การเรียน", "มหาวิทยาลัย"],
    exportKey: "study-config",
  },
  {
    key: "finance",
    path: "/finance",
    titleTH: "การเงิน",
    group: "โมดูลแอป",
    searchKeywords: ["finance", "budget", "expense", "รายจ่าย", "งบประมาณ"],
    exportKey: "finance",
  },
  {
    key: "lifestyle",
    path: "/lifestyle",
    titleTH: "ไลฟ์สไตล์",
    group: "โมดูลแอป",
    searchKeywords: ["lifestyle", "mood", "routine", "alarm", "แนะนำ"],
    exportKey: "lifestyle",
  },
  {
    key: "user-management",
    path: "/user-management",
    titleTH: "ผู้ใช้งาน",
    group: "ผู้ใช้งาน",
    searchKeywords: ["users", "plan", "suspend", "ผู้ใช้", "แอดมิน"],
    exportKey: "user-management",
  },
  {
    key: "subscriptions",
    path: "/subscriptions",
    titleTH: "สมาชิก",
    group: "ผู้ใช้งาน",
    searchKeywords: ["subscriptions", "invoice", "mrr", "plan", "แพ็กเกจ"],
    exportKey: "subscriptions",
  },
  {
    key: "notifications",
    path: "/notifications",
    titleTH: "แจ้งเตือน",
    group: "ระบบ",
    searchKeywords: ["notifications", "broadcast", "draft", "แจ้งเตือน"],
    exportKey: "notifications",
  },
  {
    key: "settings",
    path: "/settings",
    titleTH: "ตั้งค่า",
    group: "ระบบ",
    searchKeywords: ["settings", "api", "model", "safety", "policy"],
    exportKey: "settings",
  },
  {
    key: "logs",
    path: "/logs",
    titleTH: "บันทึกระบบ",
    group: "ระบบ",
    searchKeywords: ["logs", "error", "trace", "live feed", "บันทึก"],
    exportKey: "logs",
  },
  {
    key: "feedback",
    path: "/feedback",
    titleTH: "ความคิดเห็น",
    group: "ระบบ",
    searchKeywords: ["feedback", "bug", "rating", "รีวิว", "ข้อเสนอแนะ"],
    exportKey: "feedback",
  },
  {
    key: "app-health",
    path: "/app-health",
    titleTH: "สุขภาพระบบ",
    group: "ระบบ",
    searchKeywords: ["health", "status", "latency", "incident", "uptime"],
    exportKey: "app-health",
  },
];

export function findRouteMeta(pathname: string) {
  return (
    dashboardRouteMeta.find((route) => pathname === route.path || pathname.startsWith(`${route.path}/`)) ??
    dashboardRouteMeta[0]
  );
}

