import { lazy, Suspense } from "react";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./app/context/auth-context";
import { DashboardLayout } from "./app/layout/dashboard-layout";
import { RequireAuth, RequireOwner } from "./app/routes/require-owner";

const LoginPage = lazy(() => import("./app/pages/login-page").then((m) => ({ default: m.LoginPage })));
const OverviewPage = lazy(() => import("./app/pages/overview-page").then((m) => ({ default: m.OverviewPage })));
const UserManagementPage = lazy(() => import("./app/pages/user-management-page").then((m) => ({ default: m.UserManagementPage })));
const AiMonitorPage = lazy(() => import("./app/pages/ai-monitor-page").then((m) => ({ default: m.AiMonitorPage })));
const FinancePage = lazy(() => import("./app/pages/finance-page").then((m) => ({ default: m.FinancePage })));
const NotificationsPage = lazy(() => import("./app/pages/notifications-page").then((m) => ({ default: m.NotificationsPage })));
const ReportsPage = lazy(() => import("./app/pages/reports-page").then((m) => ({ default: m.ReportsPage })));
const SettingsPage = lazy(() => import("./app/pages/settings-page").then((m) => ({ default: m.SettingsPage })));

/** Minimal generic fallback for chunk loading to prevent layout jumps */
function ChunkSuspense({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<div className="min-h-screen bg-background" />}>{children}</Suspense>;
}

function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <Routes>
          {/* Login — outside DashboardLayout (no dock / sidebar) */}
          <Route path="login" element={<Suspense><LoginPage /></Suspense>} />

          <Route element={<RequireAuth><DashboardLayout /></RequireAuth>}>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="overview" element={<ChunkSuspense><OverviewPage /></ChunkSuspense>} />
            <Route path="user-management" element={<ChunkSuspense><UserManagementPage /></ChunkSuspense>} />
            <Route path="ai-monitor" element={<ChunkSuspense><AiMonitorPage /></ChunkSuspense>} />
            <Route path="finance" element={<ChunkSuspense><FinancePage /></ChunkSuspense>} />
            <Route path="notifications" element={<ChunkSuspense><NotificationsPage /></ChunkSuspense>} />
            <Route path="reports" element={<ChunkSuspense><ReportsPage /></ChunkSuspense>} />
            <Route path="settings" element={<RequireOwner><ChunkSuspense><SettingsPage /></ChunkSuspense></RequireOwner>} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </HashRouter>
  );
}

export default App;
