
import type { authClient } from "@/lib/auth-client";

export type AuthSession = typeof authClient.$Infer.Session;

export type UserRole = "customer" | "vendor" | "admin";

export type User = AuthSession["user"];
