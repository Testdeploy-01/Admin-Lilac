import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { DashboardLayout } from "./app/layout/dashboard-layout";

const OverviewPage = lazy(() => import("./app/pages/overview-page").then((m) => ({ default: m.OverviewPage })));
const UserManagementPage = lazy(() => import("./app/pages/user-management-page").then((m) => ({ default: m.UserManagementPage })));
const AiMonitorPage = lazy(() => import("./app/pages/ai-monitor-page").then((m) => ({ default: m.AiMonitorPage })));
const FinancePage = lazy(() => import("./app/pages/finance-page").then((m) => ({ default: m.FinancePage })));
const NotificationsPage = lazy(() => import("./app/pages/notifications-page").then((m) => ({ default: m.NotificationsPage })));
const SettingsPage = lazy(() => import("./app/pages/settings-page").then((m) => ({ default: m.SettingsPage })));

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/overview" replace />} />
          <Route path="overview" element={<Suspense><OverviewPage /></Suspense>} />
          <Route path="user-management" element={<Suspense><UserManagementPage /></Suspense>} />
          <Route path="ai-monitor" element={<Suspense><AiMonitorPage /></Suspense>} />
          <Route path="finance" element={<Suspense><FinancePage /></Suspense>} />
          <Route path="notifications" element={<Suspense><NotificationsPage /></Suspense>} />
          <Route path="settings" element={<Suspense><SettingsPage /></Suspense>} />
          <Route path="*" element={<Navigate to="/overview" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
