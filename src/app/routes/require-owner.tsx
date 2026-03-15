import { Navigate } from "react-router-dom";
import { useAuth } from "@/app/context/auth-context";
import type { ReactNode } from "react";

/** Redirects to /login when no authenticated session exists. */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { profile } = useAuth();
  if (!profile) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

/** Requires system-owner role; non-owners are sent to /overview. */
export function RequireOwner({ children }: { children: ReactNode }) {
  const { isOwner, profile } = useAuth();

  // Not logged in → login page
  if (!profile) return <Navigate to="/login" replace />;

  // Logged in but not owner → redirect to overview
  if (!isOwner) return <Navigate to="/overview" replace />;

  return <>{children}</>;
}
