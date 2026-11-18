
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Store, User, Mail, Lock, MapPin, Phone } from "lucide-react";

export default function VendorRegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    ownerName: "",
    restaurantName: "",
    email: "",
    password: "",
    confirmPassword: "",
    restaurantAddress: "",
    contactNumber: "",
  });

  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const inputClass =
    "w-full rounded-lg border border-[#DED8C9] bg-[#FBF8F1] px-4 py-3 text-sm text-[#24352C] outline-none transition placeholder:text-[#99998F] focus:border-[#42634D] focus:ring-2 focus:ring-[#42634D]/15";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    if (formData.password.length < 8) {
      setErrorMessage("Password must contain at least 8 characters.");
      return;
    }

    if (!agreeTerms) {
      setErrorMessage("Please agree to the Terms and Conditions.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/vendors/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ownerName: formData.ownerName,
            restaurantName: formData.restaurantName,
            email: formData.email,
            password: formData.password,
            restaurantAddress: formData.restaurantAddress,
            contactNumber: formData.contactNumber,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed.");
      }

      setSuccessMessage(
        "Vendor account created successfully! Redirecting to login..."
      );

      setTimeout(() => {
        router.push("/login");
      }, 2000);
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
      <div className="w-full max-w-2xl rounded-2xl border border-[#D5D2C5] bg-[#FBF8F1] p-6 shadow-xl sm:p-10">
        <div className="mb-8 text-center">
          <Link href="/" className="text-3xl font-bold text-[#172B25]">
            Pizza<span className="text-[#C69B62]">Hub</span>
          </Link>

          <p className="mt-2 text-sm italic text-[#71866B]">
            Crafted with Passion. Delivered with Love.
          </p>

          <div className="mx-auto mt-7 flex h-14 w-14 items-center justify-center rounded-full bg-[#29483A] text-white">
            <Store size={26} />
          </div>

          <h1 className="mt-4 text-2xl font-bold text-[#172B25]">
            Register Your Restaurant
          </h1>

          <p className="mt-2 text-sm text-[#706F63]">
            Join PizzaHub and start growing your restaurant business.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#24352C]">
                Owner Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3.5 text-[#71866B]" size={18} />
                <input
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleChange}
                  placeholder="Enter owner name"
                  required
                  maxLength={100}
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#24352C]">
                Restaurant Name
              </label>
              <div className="relative">
                <Store className="absolute left-3 top-3.5 text-[#71866B]" size={18} />
                <input
                  name="restaurantName"
                  value={formData.restaurantName}
                  onChange={handleChange}
                  placeholder="Enter restaurant name"
                  required
                  maxLength={120}
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-[#24352C]">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 text-[#71866B]" size={18} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#24352C]">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 text-[#71866B]" size={18} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create password"
                  required
                  minLength={8}
                  maxLength={128}
                  autoComplete="new-password"
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#24352C]">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 text-[#71866B]" size={18} />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  required
                  minLength={8}
                  maxLength={128}
                  autoComplete="new-password"
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-[#24352C]">
                Restaurant Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3.5 text-[#71866B]" size={18} />
                <input
                  name="restaurantAddress"
                  value={formData.restaurantAddress}
                  onChange={handleChange}
                  placeholder="Enter complete restaurant address"
                  required
                  maxLength={300}
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-[#24352C]">
                Contact Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3.5 text-[#71866B]" size={18} />
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  placeholder="Enter contact number"
                  required
                  maxLength={25}
                  autoComplete="tel"
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>
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
            className="w-full rounded-lg bg-[#29483A] px-4 py-3 font-semibold text-white transition hover:bg-[#172B25] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating Vendor Account..." : "Create Vendor Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#706F63]">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-[#42634D] hover:underline">
            Sign In
          </Link>
        </p>

        <p className="mt-4 text-center text-sm text-[#706F63]">
          Want to order pizza instead?{" "}
          <Link href="/register" className="font-semibold text-[#42634D] hover:underline">
            Customer Registration
          </Link>
        </p>
      </div>
    </main>
  );
}
