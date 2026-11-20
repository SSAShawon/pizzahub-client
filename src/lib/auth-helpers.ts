
import type { UserRole } from "@/lib/auth";

export const MIN_PASSWORD_LENGTH = 6;
export const MAX_PASSWORD_LENGTH = 128;

export const normalizeRole = (role: unknown): UserRole => {
  return role === "admin" || role === "vendor" || role === "customer"
    ? role
    : "customer";
};

export const dashboardPathForRole = (role: unknown): string => {
  switch (normalizeRole(role)) {
    case "admin":
      return "/dashboard/admin";
    case "vendor":
      return "/dashboard/vendor";
    default:
      return "/dashboard/customer";
  }
};

export const getPasswordError = (password: string): string | null => {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Password must contain at least ${MIN_PASSWORD_LENGTH} characters.`;
  }

  if (password.length > MAX_PASSWORD_LENGTH) {
    return `Password cannot exceed ${MAX_PASSWORD_LENGTH} characters.`;
  }

  return null;
};
