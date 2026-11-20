"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { dashboardPathForRole, normalizeRole } from "@/lib/auth-helpers";
import type { UserRole as Role } from "@/lib/auth";

const protectedRoutes: Array<{ prefix: string; role: Role }> = [
  { prefix: "/dashboard/admin", role: "admin" },
  { prefix: "/dashboard/vendor", role: "vendor" },
  { prefix: "/dashboard/customer", role: "customer" },
  { prefix: "/profile", role: "customer" },
];

const requiredRoleForPath = (pathname: string): Role | null => {
  const match = protectedRoutes.find(
    ({ prefix }) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  return match?.role ?? null;
};

function AccessMessage({ message }: { message: string }) {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#F2EBDD] px-5">
      <div className="rounded-2xl border border-[#DED8C9] bg-[#FBF8F1] px-8 py-10 text-center shadow-sm">
        <p className="text-sm font-medium text-[#706F63]">{message}</p>
      </div>
    </main>
  );
}

export default function RouteGuard({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const signingOut = useRef(false);

  const { data: session, isPending, refetch } = authClient.useSession();
  const requiredRole = requiredRoleForPath(pathname);

  useEffect(() => {
    if (!requiredRole) return;

    void refetch();

    const handleFocus = () => {
      void refetch();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [refetch, requiredRole]);

  useEffect(() => {
    if (!requiredRole || isPending) return;

    const user = session?.user;

    if (!user) {
      // signOut() clears the session before the blocked redirect completes;
      // don't let the unauthenticated branch overwrite that message.
      if (!signingOut.current) {
        router.replace("/login");
      }
      return;
    }

    if (user.isBlocked === true) {
      if (!signingOut.current) {
        signingOut.current = true;
        void authClient.signOut().finally(() => {
          router.replace("/login?blocked=1");
        });
      }

      return;
    }

    const role = normalizeRole(user.role);

    if (role !== requiredRole) {
      router.replace(dashboardPathForRole(role));
    }
  }, [isPending, pathname, requiredRole, router, session?.user]);

  if (!requiredRole) {
    return <>{children}</>;
  }

  if (isPending) {
    return <AccessMessage message="Checking your access..." />;
  }

  if (!session?.user || session.user.isBlocked === true) {
    return <AccessMessage message="Redirecting..." />;
  }

  if (normalizeRole(session.user.role) !== requiredRole) {
    return <AccessMessage message="Redirecting to your dashboard..." />;
  }

  return <>{children}</>;
}
