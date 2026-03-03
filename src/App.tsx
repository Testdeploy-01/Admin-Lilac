import { AiManagerPage } from "./app/pages/ai-manager-page";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppHealthPage } from "./app/pages/app-health-page";
import { DashboardLayout } from "./app/layout/dashboard-layout";
import { FeedbackPage } from "./app/pages/feedback-page";
import { FinancePage } from "./app/pages/finance-page";
import { LifestylePage } from "./app/pages/lifestyle-page";
import { LogsPage } from "./app/pages/logs-page";
import { NotificationsPage } from "./app/pages/notifications-page";
import { OverviewPage } from "./app/pages/overview-page";
import { SettingsPage } from "./app/pages/settings-page";
import { StudyConfigPage } from "./app/pages/study-config-page";
import { SubscriptionsPage } from "./app/pages/subscriptions-page";
import { UserManagementPage } from "./app/pages/user-management-page";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/overview" replace />} />
          <Route path="overview" element={<OverviewPage />} />
          <Route path="ai-manager" element={<AiManagerPage />} />
          <Route path="study-config" element={<StudyConfigPage />} />
          <Route path="finance" element={<FinancePage />} />
          <Route path="lifestyle" element={<LifestylePage />} />
          <Route path="user-management" element={<UserManagementPage />} />
          <Route path="subscriptions" element={<SubscriptionsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="logs" element={<LogsPage />} />
          <Route path="feedback" element={<FeedbackPage />} />
          <Route path="app-health" element={<AppHealthPage />} />
          <Route path="*" element={<Navigate to="/overview" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
