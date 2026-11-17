
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function CustomerLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const inputClass =
    "w-full rounded-lg border border-[#C6CDBF] bg-[#EEF1E9] px-4 py-3 text-sm text-[#24352C] placeholder:text-[#858C7F] outline-none transition focus:border-[#42634D] focus:bg-white focus:ring-2 focus:ring-[#42634D]/15";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

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

      router.push("/");
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#E8E5D9] px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-[#D5D2C5] bg-[#FBF8F1] p-8 shadow-xl">

        {/* Brand */}
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

        {/* Login Form */}
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
            disabled={loading}
            className="w-full rounded-lg bg-[#29483A] px-4 py-3 font-semibold text-white transition hover:bg-[#42634D] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Registration Link */}
        <p className="mt-6 text-center text-sm text-[#706F63]">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-[#42634D] hover:underline"
          >
            Create Account
          </Link>
        </p>

        {/* Vendor Link */}
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
