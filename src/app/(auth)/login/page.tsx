
"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  dashboardPathForRole,
  normalizeRole,
} from "@/lib/auth-helpers";

const getErrorMessage = (error: unknown, fallback: string): string =>
  error instanceof Error ? error.message : fallback;

const inputClass =
  "w-full rounded-lg border border-[#C6CDBF] bg-[#EEF1E9] px-4 py-3 text-sm text-[#24352C] placeholder:text-[#858C7F] outline-none transition focus:border-[#42634D] focus:bg-white focus:ring-2 focus:ring-[#42634D]/15";

function CustomerLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState(() => {
    if (searchParams.get("blocked") === "1") {
      return "Your account has been blocked. Please contact support.";
    }

    if (searchParams.get("error")) {
      return "Google sign-in was cancelled or could not be completed.";
    }

    return "";
  });

  const [successMessage, setSuccessMessage] = useState(() => {
    if (searchParams.get("registered") === "1") {
      return "Account created successfully. Please sign in.";
    }

    if (searchParams.get("signedIn") === "1") {
      return "Sign in successful!";
    }

    return "";
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (!email.trim() || !password) {
      setErrorMessage("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const result = await authClient.signIn.email({
        email: email.trim(),
        password,
      });

      if (result.error) {
        setErrorMessage(
          result.error.message || "Invalid email or password."
        );
        return;
      }

      const sessionResult = await authClient.getSession();
      const user = sessionResult.data?.user;

      if (!user) {
        await authClient.signOut();
        setErrorMessage("Unable to verify your account. Please try again.");
        return;
      }

      if (user.isBlocked) {
        await authClient.signOut();
        setErrorMessage(
          "Your account has been blocked. Please contact support."
        );
        return;
      }

      const role = normalizeRole(user.role);

      setSuccessMessage(
        "Sign in successful! Redirecting to your dashboard..."
      );

      router.replace(`${dashboardPathForRole(role)}?signedIn=1`);
    } catch (error) {
      console.error("Login error:", error);

      setErrorMessage(
        getErrorMessage(error, "Something went wrong. Please try again.")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    try {
      setGoogleLoading(true);

      const origin = window.location.origin;

      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: `${origin}/auth/callback`,
        newUserCallbackURL: `${origin}/auth/callback`,
        errorCallbackURL: `${origin}/login`,
      });

      if (result.error) {
        setErrorMessage(
          result.error.message || "Unable to continue with Google."
        );
        return;
      }

      setSuccessMessage("Redirecting to Google...");
    } catch (error) {
      console.error("Google sign-in error:", error);

      setErrorMessage(
        getErrorMessage(error, "Unable to continue with Google.")
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#E8E5D9] px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-[#D5D2C5] bg-[#FBF8F1] p-8 shadow-xl">

        <div className="mb-8 text-center">
          <Link
            href="/"
            className="text-3xl font-bold tracking-tight text-[#172B25]"
          >
            Pizza<span className="text-[#C69B62]">Hub</span>
          </Link>

          <p className="mt-2 text-sm italic text-[#71866B]">
            Crafted with Passion. Delivered with Love.
          </p>

          <h1 className="mt-8 text-2xl font-bold text-[#172B25]">
            Welcome Back!
          </h1>

          <p className="mt-2 text-sm text-[#706F63]">
            Sign in to continue your PizzaHub experience.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-[#24352C]"
            >
              Email Address
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-[#24352C]"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
              className={inputClass}
            />
          </div>

          {successMessage && (
            <p
              role="status"
              className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700"
            >
              {successMessage}
            </p>
          )}

          {errorMessage && (
            <p
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            >
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full rounded-lg bg-[#29483A] px-4 py-3 font-semibold text-white transition hover:bg-[#42634D] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="mt-5 flex items-center gap-3">
          <span className="h-px flex-1 bg-[#DED8C9]" />
          <span className="text-xs uppercase tracking-wide text-[#858C7F]">
            or
          </span>
          <span className="h-px flex-1 bg-[#DED8C9]" />
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading || googleLoading}
          className="mt-5 w-full rounded-lg border border-[#C6CDBF] bg-white px-4 py-3 font-semibold text-[#24352C] transition hover:bg-[#EEF1E9] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {googleLoading ? "Connecting to Google..." : "Continue with Google"}
        </button>

        <p className="mt-6 text-center text-sm text-[#706F63]">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-[#42634D] hover:underline"
          >
            Create Account
          </Link>
        </p>

        <div className="mt-6 border-t border-[#DED8C9] pt-5 text-center">
          <p className="text-sm text-[#706F63]">
            Are you a restaurant owner?
          </p>

          <Link
            href="/vendor/register"
            className="mt-2 inline-block text-sm font-semibold text-[#C69B62] hover:underline"
          >
            Register as a Vendor
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function CustomerLoginPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#E8E5D9]">
          <p className="text-sm font-medium text-[#706F63]">
            Loading sign in...
          </p>
        </main>
      }
    >
      <CustomerLoginForm />
    </Suspense>
  );
}
