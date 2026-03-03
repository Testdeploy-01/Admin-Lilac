/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type DashboardUIContextValue = {
  refreshTick: number;
  triggerRefresh: () => void;
  commandOpen: boolean;
  setCommandOpen: (open: boolean) => void;
};

const DashboardUIContext = createContext<DashboardUIContextValue | null>(null);

export function DashboardUIProvider({ children }: { children: ReactNode }) {
  const [refreshTick, setRefreshTick] = useState(0);
  const [commandOpen, setCommandOpen] = useState(false);

  const value = useMemo<DashboardUIContextValue>(
    () => ({
      refreshTick,
      triggerRefresh: () => setRefreshTick((current) => current + 1),
      commandOpen,
      setCommandOpen,
    }),
    [commandOpen, refreshTick],
  );

  return <DashboardUIContext.Provider value={value}>{children}</DashboardUIContext.Provider>;
}

export function useDashboardUI() {
  const context = useContext(DashboardUIContext);
  if (!context) {
    throw new Error("useDashboardUI must be used within DashboardUIProvider");
  }
  return context;
}

