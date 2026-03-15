/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { AdminProfile, AdminRole } from "@/types/admin-profile";

const SESSION_KEY = "lilac-auth-session";

type AuthContextValue = {
  profile: AdminProfile | null;
  role: AdminRole | null;
  isOwner: boolean;
  login: (profile: AdminProfile) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const VALID_ROLES: ReadonlySet<string> = new Set<AdminRole>(["system-owner", "admin"]);

function isValidProfile(data: unknown): data is AdminProfile {
  if (typeof data !== "object" || data === null) return false;
  const obj = data as Record<string, unknown>;
  return (
    typeof obj.name === "string" &&
    typeof obj.email === "string" &&
    typeof obj.role === "string" &&
    VALID_ROLES.has(obj.role)
  );
}

function loadSession(): AdminProfile | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!isValidProfile(parsed)) {
      sessionStorage.removeItem(SESSION_KEY);
      return null;
    }
    return parsed;
  } catch {
    sessionStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<AdminProfile | null>(loadSession);

  const login = useCallback((p: AdminProfile) => {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(p));
    setProfile(p);
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setProfile(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      profile,
      role: profile?.role ?? null,
      isOwner: profile?.role === "system-owner",
      login,
      logout,
    }),
    [profile, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
