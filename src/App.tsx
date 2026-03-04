import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { DashboardLayout } from "./app/layout/dashboard-layout";
import { OverviewPage } from "./app/pages/overview-page";
import { UserManagementPage } from "./app/pages/user-management-page";
import { AiMonitorPage } from "./app/pages/ai-monitor-page";
import { FinancePage } from "./app/pages/finance-page";
import { NotificationsPage } from "./app/pages/notifications-page";
import { SettingsPage } from "./app/pages/settings-page";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/overview" replace />} />
          <Route path="overview" element={<OverviewPage />} />
          <Route path="user-management" element={<UserManagementPage />} />
          <Route path="ai-monitor" element={<AiMonitorPage />} />
          <Route path="finance" element={<FinancePage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/overview" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
