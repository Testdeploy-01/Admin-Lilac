import { Navigate } from "react-router-dom";
import { useAuth } from "@/app/context/auth-context";
import type { ReactNode } from "react";

export function RequireOwner({ children }: { children: ReactNode }) {
  const { isOwner, profile } = useAuth();

  // Not logged in → login page
  if (!profile) return <Navigate to="/login" replace />;

  // Logged in but not owner → redirect to overview
  if (!isOwner) return <Navigate to="/overview" replace />;

  return <>{children}</>;
}
