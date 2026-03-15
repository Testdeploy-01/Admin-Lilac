import type { AdminProfile } from "../types/admin-profile";

/**
 * ⚠️  MOCK DATA ONLY — Do NOT use in production.
 * These credentials exist purely for local UI development.
 * Replace with a real authentication provider before deployment.
 */

export const ownerProfileMock: AdminProfile = {
  name: "Theodore Finch",
  email: "owner@lilac.ai",
  avatarUrl: "https://ui.shadcn.com/avatars/01.png",
  role: "system-owner",
};

export const adminProfileMock: AdminProfile = {
  name: "Natthaphon Sriwan",
  email: "admin@lilac.ai",
  avatarUrl: "https://ui.shadcn.com/avatars/02.png",
  role: "admin",
};

export const mockCredentials = [
  { username: "Owner", password: "12345", profile: ownerProfileMock },
  { username: "Admin", password: "12345", profile: adminProfileMock },
] as const;
