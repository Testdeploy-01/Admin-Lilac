import {
  aiUsageRows,
  auditLog,
  broadcastLogs,
  managedUsers,
  PLAN_LABELS,
  transactionHistory,
} from "@/mocks/dashboard-features.mock";
import { overviewKpis } from "@/mocks/dashboard-insights.mock";
import { findRouteMeta, type DashboardRouteKey } from "@/app/routes/dashboard-routes";

function rowsByKey(key: DashboardRouteKey): Array<Record<string, string | number>> {
  switch (key) {
    case "overview":
      return overviewKpis.map((kpi) => ({
        ชื่อ: kpi.label,
        ค่า: kpi.value,
        เปลี่ยนแปลง: kpi.delta ?? "",
      }));
    case "user-management":
      return managedUsers.slice(0, 200).map((user) => ({
        รหัสผู้ใช้: user.id,
        ชื่อ: user.name,
        อีเมล: user.email,
        แพลน: PLAN_LABELS[user.plan],
        สถานะ: user.status,
        สมัครเมื่อ: user.signupDate,
        "Last Active": user.lastActive,
        "AI Calls": user.aiCallsTotal,
        "จำนวนวิดเจ็ต": user.widgetInstalls,
        "Voice Tokens": user.inputVoiceTokens,
        "Text Tokens": user.inputTextTokens + user.outputTextTokens,
        "AI Cost THB": user.aiCostTHB,
      }));
    case "ai-monitor":
      return aiUsageRows.map((row) => ({
        ผู้ใช้: row.userId,
        แพลน: PLAN_LABELS[row.plan],
        "Voice Input": row.inputVoiceTokens,
        "Text Input": row.inputTextTokens,
        "Text Output": row.outputTextTokens,
        รายได้THB: row.revenueTHB,
        ต้นทุนTHB: row.costTHB,
      }));
    case "finance":
      return transactionHistory.map((transaction) => ({
        รหัส: transaction.id,
        วันที่: transaction.date,
        ผู้ใช้: transaction.user,
        จำนวนเงิน: transaction.amount,
        แพ็กเกจ: transaction.plan,
        วิธีชำระ: transaction.paymentMethod,
        สถานะ:
          transaction.status === "success"
            ? "สำเร็จ"
            : transaction.status === "failed"
              ? "ล้มเหลว"
              : "คืนเงิน",
      }));
    case "notifications":
      return broadcastLogs.map((row) => ({
        รหัส: row.id,
        หัวข้อ: row.title,
        หมวด: row.category,
        ประเภท: row.type,
        กลุ่มเป้าหมาย: row.audience,
        เวลา: row.sentAt,
        สถานะ: row.status,
      }));
    case "settings":
      return auditLog.map((entry) => ({
        เวลา: entry.timestamp,
        Admin: entry.adminName,
        Action: entry.action,
        รายละเอียด: entry.details,
      }));
    case "reports":
      return [{ หมวด: "ใช้ปุ่ม Export ในหน้ารายงาน", ค่า: "-" }];
    default:
      return [{ หมวด: "ไม่มีข้อมูล", ค่า: "-" }];
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
