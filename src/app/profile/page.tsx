
"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  UserCircle,
  Mail,
  Phone,
  MapPin,
  Pencil,
  Save,
  X,
  ArrowLeft,
  ShieldCheck,
  LoaderCircle,
} from "lucide-react";
import { messageFromError, notify } from "@/lib/toast";

interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  deliveryAddress?: string;
}

export default function CustomerProfilePage() {
  const [profile, setProfile] = useState<CustomerProfile | null>(null);

  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch customer profile
  useEffect(() => {
    let isActive = true;

    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/users/me", {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load profile.");
        }

        if (isActive) {
          setProfile(data.user);
          setName(data.user.name || "");
          setPhoneNumber(data.user.phoneNumber || "");
          setDeliveryAddress(data.user.deliveryAddress || "");
        }
      } catch (err) {
        if (isActive) {
          setError(
            err instanceof Error
              ? err.message
              : "Something went wrong while loading your profile."
          );
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    fetchProfile();

    return () => {
      isActive = false;
    };
  }, []);

  // Update customer profile
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const cleanName = name.trim();
    const cleanPhone = phoneNumber.trim();
    const cleanAddress = deliveryAddress.trim();

    if (cleanName.length < 2 || cleanName.length > 50) {
      setError("Name must be between 2 and 50 characters.");
      return;
    }

    const phoneRegex = /^(01[3-9]\d{8}|\+8801[3-9]\d{8})$/;

    if (!phoneRegex.test(cleanPhone.replace(/[\s-]/g, ""))) {
      setError("Please enter a valid Bangladeshi phone number.");
      return;
    }

    if (cleanAddress.length < 10 || cleanAddress.length > 300) {
      setError("Delivery address must be between 10 and 300 characters.");
      return;
    }

    try {
      setIsSaving(true);

      const response = await fetch("/api/users/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: cleanName,
          phoneNumber: cleanPhone,
          deliveryAddress: cleanAddress,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile.");
      }

      setProfile(data.user);
      setName(data.user.name || "");
      setPhoneNumber(data.user.phoneNumber || "");
      setDeliveryAddress(data.user.deliveryAddress || "");

      const successMessage = "Your profile has been updated successfully.";

      setIsEditing(false);
      setSuccess(successMessage);
      notify.success(successMessage, "customer-profile-update");
    } catch (err) {
      const errorMessage = messageFromError(
        err,
        "Something went wrong while updating your profile.",
      );

      setError(errorMessage);
      notify.error(errorMessage, "customer-profile-update-error");
    } finally {
      setIsSaving(false);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    if (profile) {
      setName(profile.name || "");
      setPhoneNumber(profile.phoneNumber || "");
      setDeliveryAddress(profile.deliveryAddress || "");
    }

    setIsEditing(false);
    setError("");
    setSuccess("");
  };

  if (isLoading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#F2EBDD]">
        <div className="flex flex-col items-center gap-3">
          <LoaderCircle size={36} className="animate-spin text-[#29483A]" />
          <p className="text-sm font-medium text-[#706F63]">
            Loading your profile...
          </p>
        </div>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#F2EBDD] px-5">
        <div className="w-full max-w-md rounded-2xl border border-[#DED8C9] bg-[#FBF8F1] p-8 text-center shadow-sm">
          <UserCircle size={48} className="mx-auto text-[#71866B]" />

          <h2 className="mt-4 font-serif text-2xl font-bold text-[#172B25]">
            Profile Not Available
          </h2>

          <p className="mt-2 text-sm text-[#706F63]">
            {error || "We couldn't retrieve your profile information."}
          </p>

          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#29483A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#172B25]"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F2EBDD] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">

        {/* Back Navigation */}
        <Link
          href="/"
          className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-[#42634D] transition hover:text-[#C69B62]"
        >
          <ArrowLeft size={17} />
          Back to Home
        </Link>

        {/* Page Heading */}
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[3px] text-[#C69B62]">
            Account Settings
          </p>

          <h1 className="mt-2 font-serif text-3xl font-bold text-[#172B25] sm:text-4xl">
            My Profile
          </h1>

          <p className="mt-2 text-sm text-[#706F63]">
            Manage your personal information and delivery details.
          </p>
        </div>

        {/* Profile Layout */}
        <div className="grid gap-7 lg:grid-cols-[300px_1fr]">

          {/* Profile Overview Card */}
          <section className="h-fit rounded-2xl border border-[#DED8C9] bg-[#FBF8F1] p-7 shadow-sm">
            <div className="flex flex-col items-center text-center">

              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#29483A] text-[#F2EBDD]">
                <UserCircle size={58} strokeWidth={1.4} />
              </div>

              <h2 className="mt-5 break-words font-serif text-xl font-bold text-[#172B25]">
                {profile.name}
              </h2>

              <p className="mt-1 break-all text-sm text-[#706F63]">
                {profile.email}
              </p>

              <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#E8E5D9] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#29483A]">
                <ShieldCheck size={15} />
                Customer Account
              </span>
            </div>

            <div className="mt-7 border-t border-[#DED8C9] pt-5">
              <p className="text-xs leading-6 text-[#706F63]">
                Your account information is securely managed by PizzaHub.
                You can update your name, phone number and delivery address
                whenever needed.
              </p>
            </div>
          </section>

          {/* Personal Information */}
          <section className="rounded-2xl border border-[#DED8C9] bg-[#FBF8F1] p-6 shadow-sm sm:p-8">

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#172B25]">
                  Personal Information
                </h2>

                <p className="mt-1 text-sm text-[#706F63]">
                  Your personal and delivery information.
                </p>
              </div>

              {!isEditing && (
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setError("");
                    setSuccess("");
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-[#29483A] px-5 py-2.5 text-sm font-semibold text-[#29483A] transition hover:bg-[#29483A] hover:text-white"
                >
                  <Pencil size={15} />
                  Edit Profile
                </button>
              )}
            </div>

            {/* Success Message */}
            {success && (
              <div className="mt-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                {success}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">

              {/* Full Name */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#24352C]">
                  Full Name
                </label>

                <div className="relative">
                  <UserCircle
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#71866B]"
                  />

                  <input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    readOnly={!isEditing}
                    placeholder="Enter your full name"
                    maxLength={50}
                    className={`w-full rounded-xl border border-[#DED8C9] py-3.5 pl-12 pr-4 text-sm text-[#24352C] outline-none transition focus:border-[#71866B] ${
                      isEditing
                        ? "bg-white"
                        : "bg-[#F2EBDD]/60 text-[#706F63]"
                    }`}
                  />
                </div>

                {isEditing && (
                  <p className="mt-1.5 text-xs text-[#8B887D]">
                    Name must be between 2 and 50 characters.
                  </p>
                )}
              </div>

              {/* Email Address */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#24352C]">
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#71866B]"
                  />

                  <input
                    type="email"
                    value={profile.email}
                    readOnly
                    className="w-full rounded-xl border border-[#DED8C9] bg-[#F2EBDD]/60 py-3.5 pl-12 pr-4 text-sm text-[#706F63] outline-none"
                  />
                </div>

                <p className="mt-1.5 text-xs text-[#8B887D]">
                  Email address is linked to your account.
                </p>
              </div>

              {/* Phone Number */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#24352C]">
                  Phone Number
                </label>

                <div className="relative">
                  <Phone
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#71866B]"
                  />

                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(event) => setPhoneNumber(event.target.value)}
                    readOnly={!isEditing}
                    placeholder="01XXXXXXXXX"
                    maxLength={14}
                    className={`w-full rounded-xl border border-[#DED8C9] py-3.5 pl-12 pr-4 text-sm text-[#24352C] outline-none transition focus:border-[#71866B] ${
                      isEditing
                        ? "bg-white"
                        : "bg-[#F2EBDD]/60 text-[#706F63]"
                    }`}
                  />
                </div>
              </div>

              {/* Delivery Address */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#24352C]">
                  Delivery Address
                </label>

                <div className="relative">
                  <MapPin
                    size={19}
                    className="absolute left-4 top-4 text-[#71866B]"
                  />

                  <textarea
                    value={deliveryAddress}
                    onChange={(event) =>
                      setDeliveryAddress(event.target.value)
                    }
                    readOnly={!isEditing}
                    placeholder="Enter your complete delivery address..."
                    rows={4}
                    maxLength={300}
                    className={`w-full resize-none rounded-xl border border-[#DED8C9] py-3.5 pl-12 pr-4 text-sm text-[#24352C] outline-none transition focus:border-[#71866B] ${
                      isEditing
                        ? "bg-white"
                        : "bg-[#F2EBDD]/60 text-[#706F63]"
                    }`}
                  />
                </div>

                {isEditing && (
                  <p className="mt-1.5 text-right text-xs text-[#8B887D]">
                    {deliveryAddress.length}/300 characters
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex flex-wrap gap-3 border-t border-[#DED8C9] pt-6">

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#29483A] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#172B25] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSaving ? (
                      <>
                        <LoaderCircle size={17} className="animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={17} />
                        Save Changes
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-[#DED8C9] px-7 py-3 text-sm font-semibold text-[#706F63] transition hover:bg-[#E8E5D9] disabled:opacity-60"
                  >
                    <X size={17} />
                    Cancel
                  </button>
                </div>
              )}
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
