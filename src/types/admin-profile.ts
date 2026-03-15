export type AdminRole = "system-owner" | "admin";

export interface AdminProfile {
  name: string;
  email: string;
  avatarUrl: string;
  role: AdminRole;
}
