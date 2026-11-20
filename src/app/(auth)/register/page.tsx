
"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { getPasswordError, MIN_PASSWORD_LENGTH } from "@/lib/auth-helpers";

type AccountType = "customer" | "vendor";

const getErrorMessage = (error: unknown, fallback: string): string =>
  error instanceof Error ? error.message : fallback;

const inputClass =
  "w-full rounded-lg border border-[#C6CDBF] bg-[#EEF1E9] px-4 py-3 text-sm text-[#24352C] placeholder:text-[#858C7F] outline-none transition focus:border-[#42634D] focus:bg-white focus:ring-2 focus:ring-[#42634D]/15";

function CustomerRegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [name, setName] = useState(() => searchParams.get("name") || "");
  const [email, setEmail] = useState(() => searchParams.get("email") || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [image, setImage] = useState(() => searchParams.get("image") || "");
  const [accountType, setAccountType] = useState<AccountType>(() =>
    searchParams.get("type") === "vendor" ? "vendor" : "customer"
  );
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    const passwordError = getPasswordError(password);
    if (passwordError) {
      setErrorMessage(passwordError);
      return;
    }

    if (image.trim()) {
      try {
        new URL(image.trim());
      } catch {
        setErrorMessage("Please provide a valid profile image URL.");
        return;
      }
    }

    if (!agreeTerms) {
      setErrorMessage("Please agree to the Terms and Conditions.");
      return;
    }

    if (accountType === "vendor") {
      const params = new URLSearchParams({
        name: name.trim(),
        email: email.trim(),
      });
      if (image.trim()) params.set("image", image.trim());
      router.push(`/vendor/register?${params.toString()}`);
      return;
    }

    try {
      setLoading(true);

      // Role and block status are never sent from the client. New accounts are customers.
      const result = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
        image: image.trim() || undefined,
      });

      if (result.error) {
        setErrorMessage(
          result.error.message || "Registration failed. Please try again."
        );
        return;
      }

      setSuccessMessage("Account created successfully! Redirecting to sign in...");
      setTimeout(() => router.replace("/login?registered=1"), 1500);
    } catch (error) {
      setErrorMessage(
        getErrorMessage(error, "Something went wrong. Please try again.")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    try {
      setGoogleLoading(true);

      const origin = window.location.origin;
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: `${origin}/auth/callback`,
        newUserCallbackURL: `${origin}/auth/callback`,
        errorCallbackURL: `${origin}/register`,
      });

      if (result.error) {
        setErrorMessage(
          result.error.message || "Unable to continue with Google."
        );
        return;
      }

      setSuccessMessage("Redirecting to Google...");
    } catch (error) {
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
            Create Your Account
          </h1>

          <p className="mt-2 text-sm text-[#706F63]">
            Join PizzaHub and discover your favorite pizza.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <fieldset>
            <legend className="mb-2 text-sm font-medium text-[#24352C]">
              Account Type
            </legend>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-[#C6CDBF] bg-white px-3 py-2 text-sm text-[#24352C]">
                <input
                  type="radio"
                  name="accountType"
                  value="customer"
                  checked={accountType === "customer"}
                  onChange={() => setAccountType("customer")}
                  className="accent-[#42634D]"
                />
                Customer
              </label>
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-[#C6CDBF] bg-white px-3 py-2 text-sm text-[#24352C]">
                <input
                  type="radio"
                  name="accountType"
                  value="vendor"
                  checked={accountType === "vendor"}
                  onChange={() => setAccountType("vendor")}
                  className="accent-[#42634D]"
                />
                Vendor
              </label>
            </div>
            {accountType === "vendor" && (
              <p className="mt-2 text-xs text-[#706F63]">
                You’ll add your restaurant details on the next step.
              </p>
            )}
          </fieldset>

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
            <label htmlFor="image" className="mb-2 block text-sm font-medium text-[#24352C]">
              Profile Image URL <span className="text-[#858C7F]">(optional)</span>
            </label>
            <input
              id="image"
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://example.com/photo.jpg"
              autoComplete="off"
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
              minLength={MIN_PASSWORD_LENGTH}
              autoComplete="new-password"
              className={inputClass}
            />
            <p className="mt-1 text-xs text-[#858C7F]">
              At least {MIN_PASSWORD_LENGTH} characters with an uppercase and a lowercase letter.
            </p>
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
              minLength={MIN_PASSWORD_LENGTH}
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
            disabled={loading || googleLoading}
            className="w-full rounded-lg bg-[#29483A] px-4 py-3 font-semibold text-white transition hover:bg-[#42634D] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Creating Account..."
              : accountType === "vendor"
                ? "Continue to Restaurant Details"
                : "Create Account"}
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
          onClick={handleGoogleSignUp}
          disabled={loading || googleLoading}
          className="mt-5 w-full rounded-lg border border-[#C6CDBF] bg-white px-4 py-3 font-semibold text-[#24352C] transition hover:bg-[#EEF1E9] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {googleLoading ? "Connecting to Google..." : "Continue with Google"}
        </button>

        <p className="mt-6 text-center text-sm text-[#706F63]">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-[#42634D] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function CustomerRegisterPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#E8E5D9]">
          <p className="text-sm font-medium text-[#706F63]">Loading registration...</p>
        </main>
      }
    >
      <CustomerRegisterForm />
    </Suspense>
  );
}
