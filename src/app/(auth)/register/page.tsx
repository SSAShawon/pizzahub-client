
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function CustomerRegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const inputClass =
    "w-full rounded-lg border border-[#C6CDBF] bg-[#EEF1E9] px-4 py-3 text-sm text-[#24352C] placeholder:text-[#858C7F] outline-none transition focus:border-[#42634D] focus:bg-white focus:ring-2 focus:ring-[#42634D]/15";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Password must contain at least 8 characters.");
      return;
    }

    if (!agreeTerms) {
      setErrorMessage("Please agree to the Terms and Conditions.");
      return;
    }

    try {
      setLoading(true);

      const result = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      if (result.error) {
        setErrorMessage(
          result.error.message || "Registration failed. Please try again."
        );
        return;
      }

      setSuccessMessage(
        "Account created successfully! Redirecting to login..."
      );

      setTimeout(() => router.push("/login"), 1500);
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
            Create Your Account
          </h1>

          <p className="mt-2 text-sm text-[#706F63]">
            Join PizzaHub and discover your favorite pizza.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium text-[#24352C]">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
              autoComplete="name"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-[#24352C]">
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
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-[#24352C]">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              required
              minLength={8}
              autoComplete="new-password"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-[#24352C]">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
              minLength={8}
              autoComplete="new-password"
              className={inputClass}
            />
          </div>

          <label className="flex items-start gap-3 text-sm text-[#706F63]">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-1 accent-[#42634D]"
            />
            <span>
              I agree to the Terms and Conditions and Privacy Policy.
            </span>
          </label>

          {errorMessage && (
            <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {errorMessage}
            </p>
          )}

          {successMessage && (
            <p role="status" className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
              {successMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#29483A] px-4 py-3 font-semibold text-white transition hover:bg-[#42634D] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#706F63]">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-[#42634D] hover:underline">
            Sign in
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
