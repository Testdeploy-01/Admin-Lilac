import {
  aiUsageRows,
  appHealthApis,
  broadcastLogs,
  feedbackEntries,
  financeCategoryUsage,
  invoices,
  lifestyleRecommendations,
  managedUsers,
  overviewKpis,
  PLAN_LABELS,
  popularFeatures,
  studyTrendingEvents,
  subscriptionPlans,
  systemLogs,
} from "@/mocks/dashboard-features.mock";
import { findRouteMeta, type DashboardRouteKey } from "@/app/routes/dashboard-routes";

function rowsByKey(key: DashboardRouteKey): Array<Record<string, string | number>> {
  switch (key) {
    case "overview":
      return [
        ...overviewKpis.map((kpi) => ({ ประเภท: "KPI", ชื่อ: kpi.label, ค่า: kpi.value, เปลี่ยนแปลง: kpi.delta })),
        ...popularFeatures.map((item) => ({ ประเภท: "Popular Feature", ชื่อ: item.feature, ค่า: item.calls, เปลี่ยนแปลง: "-" })),
      ];
    case "ai-manager":
      return aiUsageRows.map((row) => ({
        ผู้ใช้: row.userId,
        แพลน: PLAN_LABELS[row.plan],
        "Voice Input": row.inputVoiceTokens,
        "Text Input": row.inputTextTokens,
        "Text Output": row.outputTextTokens,
        รายได้THB: row.revenueTHB,
        ต้นทุนTHB: row.costTHB,
      }));
    case "study-config":
      return studyTrendingEvents.map((item) => ({
        รหัส: item.id,
        หัวข้อ: item.title,
        มหาวิทยาลัย: item.university,
        ชั้นปี: item.year,
        กำหนดส่ง: item.dueIn,
        Insight: item.insight,
      }));
    case "finance":
      return financeCategoryUsage.map((item) => ({
        หมวด: item.category,
        รายรับ: item.income,
        รายจ่าย: item.expense,
        สัดส่วน: `${item.ratio}%`,
      }));
    case "lifestyle":
      return lifestyleRecommendations.map((item) => ({
        รหัส: item.id,
        ประเภท: item.type,
        รายการ: item.title,
        CTR: `${item.ctr}%`,
        MoodTag: item.moodTag,
      }));
    case "user-management":
      return managedUsers.map((user) => ({
        รหัสผู้ใช้: user.id,
        ชื่อ: user.name,
        แพลน: PLAN_LABELS[user.plan],
        สมัครเมื่อ: user.signupDate,
        หมวดหลัก: user.favoriteCategory,
        Alert: user.systemAlert,
        "Voice InputTokens": user.inputVoiceTokens,
        "Text InputTokens": user.inputTextTokens,
        "Text OutputTokens": user.outputTextTokens,
        AICostTHB: user.aiCostTHB,
        สถานะ: user.status,
      }));
    case "subscriptions":
      return subscriptionPlans.map((plan) => ({
        ชื่อแพ็กเกจ: plan.name,
        รอบบิล: plan.cycle,
        ราคาTHB: plan.priceTHB,
        อายุแพ็กเกจวัน: plan.durationDays,
        เปิดใช้งาน: plan.active ? "เปิด" : "ปิด",
      }));
    case "notifications":
      return broadcastLogs.map((row) => ({
        รหัส: row.id,
        หัวข้อ: row.title,
        หมวด: row.category,
        กลุ่มเป้าหมาย: row.audience,
        เวลา: row.sentAt,
        สถานะ: row.status,
      }));
    case "settings":
      return [{ หมวด: "ตั้งค่าระบบ", ค่า: "System Settings Snapshot" }];
    case "logs":
      return systemLogs.map((row) => ({
        เวลา: row.timestamp,
        ระดับ: row.level,
        source: row.source,
        message: row.message,
        traceId: row.traceId,
        userId: row.userId,
        errorCode: row.errorCode,
      }));
    case "feedback":
      return feedbackEntries.map((row) => ({
        รหัส: row.id,
        ผู้ใช้: row.userName,
        ประเภท: row.tag,
        ดาว: row.rating,
        ข้อความ: row.comment,
        สถานะ: row.status,
      }));
    case "app-health":
      return appHealthApis.map((row) => ({
        endpoint: row.name,
        method: row.method,
        path: row.path,
        status: row.status,
        latencyMs: row.latencyMs,
        lastChecked: row.lastChecked,
      }));
    default:
      return invoices.map((invoice) => ({
        เลขที่ใบแจ้งหนี้: invoice.invoice,
        ผู้ใช้: invoice.user,
        แพลน: invoice.plan,
        จำนวนเงิน: invoice.amountTHB,
        วันที่: invoice.issuedAt,
        สถานะ: invoice.status,
      }));
  }
}

export function resolveExportByPath(pathname: string) {
  const meta = findRouteMeta(pathname);
  return {
    title: meta.titleTH,
    filename: `${meta.key}-${new Date().toISOString().slice(0, 10)}`,
    rows: rowsByKey(meta.exportKey),
  };
}

