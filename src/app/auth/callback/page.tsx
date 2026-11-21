"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { dashboardPathForRole, normalizeRole } from "@/lib/auth-helpers";
import { notify } from "@/lib/toast";

export default function AuthCallbackPage() {
  const router = useRouter();
  const redirected = useRef(false);
  const [message, setMessage] = useState("Completing sign in...");

  useEffect(() => {
    if (redirected.current) return;

    const finishSignIn = async () => {
      const params = new URLSearchParams(window.location.search);
      const authError = params.get("error");

      if (authError) {
        redirected.current = true;
        router.replace(`/login?error=${encodeURIComponent(authError)}`);
        return;
      }

      try {
        const result = await authClient.getSession();
        const user = result.data?.user;

        if (!user) {
          redirected.current = true;
          router.replace("/login");
          return;
        }

        if (user.isBlocked === true) {
          redirected.current = true;
          setMessage("This account has been blocked.");
          await authClient.signOut();
          router.replace("/login?blocked=1");
          return;
        }

        redirected.current = true;
        setMessage("Signed in successfully. Redirecting...");
        notify.success("Signed in successfully!", "google-sign-in");
        router.replace(dashboardPathForRole(normalizeRole(user.role)));
      } catch (error) {
        console.error("Auth callback error:", error);
        redirected.current = true;
        router.replace("/login?error=session");
      }
    };

    void finishSignIn();
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#E8E5D9] px-4">
      <div className="rounded-2xl border border-[#D5D2C5] bg-[#FBF8F1] px-10 py-12 text-center shadow-xl">
        <p className="text-sm font-medium text-[#706F63]">{message}</p>
      </div>
    </main>
  );
}
