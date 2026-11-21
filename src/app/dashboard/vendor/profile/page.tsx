"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import VendorSidebar from "@/components/dashboard/VendorSidebar";
import {
  Save,
  LoaderCircle,
  CheckCircle2,
  AlertCircle,
  Mail,
  User,
  MapPin,
  Phone,
  Building2,
  ArrowLeft,
  Store,
} from "lucide-react";
import { messageFromError, notify } from "@/lib/toast";

type VendorProfile = {
  ownerName: string;
  email: string;
  restaurantName: string;
  restaurantAddress: string;
  contactNumber: string;
};

const initialProfile: VendorProfile = {
  ownerName: "",
  email: "",
  restaurantName: "",
  restaurantAddress: "",
  contactNumber: "",
};

export default function VendorProfilePage() {
  const [profile, setProfile] = useState<VendorProfile>(initialProfile);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/vendors/profile", {
          credentials: "include",
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load restaurant profile.");
        }

        setProfile({
          ownerName: data.profile.ownerName || "",
          email: data.profile.email || "",
          restaurantName: data.profile.restaurantName || "",
          restaurantAddress: data.profile.restaurantAddress || "",
          contactNumber: data.profile.contactNumber || "",
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (field: keyof VendorProfile, value: string) => {
    setProfile((previous) => ({
      ...previous,
      [field]: value,
    }));

    setSuccess("");
    setError("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await fetch("/api/vendors/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          ownerName: profile.ownerName,
          restaurantName: profile.restaurantName,
          restaurantAddress: profile.restaurantAddress,
          contactNumber: profile.contactNumber,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile.");
      }

      setProfile({
        ownerName: data.profile.ownerName || "",
        email: data.profile.email || "",
        restaurantName: data.profile.restaurantName || "",
        restaurantAddress: data.profile.restaurantAddress || "",
        contactNumber: data.profile.contactNumber || "",
      });

      const successMessage = "Restaurant profile updated successfully!";

      setSuccess(successMessage);
      notify.success(successMessage, "vendor-profile-update");
    } catch (err) {
      const errorMessage = messageFromError(err, "Something went wrong.");

      setError(errorMessage);
      notify.error(errorMessage, "vendor-profile-update-error");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-[#DED8C9] bg-[#FBF8F1] px-4 py-3 text-sm text-[#24352C] outline-none transition placeholder:text-[#999487] focus:border-[#42634D] focus:ring-2 focus:ring-[#42634D]/10";

  const labelClass = "mb-2 block text-sm font-semibold text-[#29483A]";

  return (
    <div className="min-h-screen bg-[#F2EBDD] text-[#24352C]">
      <div className="flex min-h-screen max-w-[1600px] flex-col lg:flex-row">
        {" "}
        <VendorSidebar />
        {/* Main Content */}
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-10">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/dashboard/vendor"
              className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-[#71866B] transition hover:text-[#29483A]"
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </Link>

            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[2px] text-[#71866B]">
                Restaurant Management
              </p>

              <h1 className="text-2xl font-bold tracking-tight text-[#172B25] sm:text-3xl">
                Restaurant Profile
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-[#706F63]">
                Manage your restaurant information and keep your business
                details up to date.
              </p>
            </div>
          </div>

          {/* Profile Form */}
          <div className="max-w-4xl overflow-hidden rounded-2xl border border-[#DED8C9] bg-[#FBF8F1] shadow-sm">
            <div className="border-b border-[#DED8C9] px-5 py-5 sm:px-8">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#29483A]/10 text-[#29483A]">
                  <Store size={23} />
                </div>

                <div>
                  <h2 className="font-bold text-[#172B25]">
                    Business Information
                  </h2>
                  <p className="mt-1 text-xs text-[#706F63]">
                    Update your restaurant and owner details.
                  </p>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex min-h-[350px] flex-col items-center justify-center gap-3">
                <LoaderCircle
                  size={30}
                  className="animate-spin text-[#42634D]"
                />
                <p className="text-sm text-[#706F63]">
                  Loading restaurant profile...
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="space-y-6 p-5 sm:p-8">
                  {error && (
                    <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                      <AlertCircle size={19} className="mt-0.5 shrink-0" />
                      <p>{error}</p>
                    </div>
                  )}

                  {success && (
                    <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
                      <CheckCircle2 size={19} className="mt-0.5 shrink-0" />
                      <p>{success}</p>
                    </div>
                  )}

                  {/* Owner Information */}
                  <div>
                    <h3 className="mb-4 text-sm font-bold text-[#29483A]">
                      Owner Information
                    </h3>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label htmlFor="ownerName" className={labelClass}>
                          Owner Name
                        </label>

                        <div className="relative">
                          <User
                            size={17}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#71866B]"
                          />

                          <input
                            id="ownerName"
                            type="text"
                            required
                            minLength={2}
                            maxLength={80}
                            value={profile.ownerName}
                            onChange={(e) =>
                              handleChange("ownerName", e.target.value)
                            }
                            placeholder="Enter owner name"
                            className={`${inputClass} pl-11`}
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="email" className={labelClass}>
                          Email Address
                        </label>

                        <div className="relative">
                          <Mail
                            size={17}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999487]"
                          />

                          <input
                            id="email"
                            type="email"
                            value={profile.email}
                            readOnly
                            className={`${inputClass} cursor-not-allowed bg-[#F2EBDD] pl-11 text-[#706F63]`}
                          />
                        </div>

                        <p className="mt-2 text-xs text-[#999487]">
                          Email address cannot be changed.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-[#DED8C9]" />

                  {/* Restaurant Information */}
                  <div>
                    <h3 className="mb-4 text-sm font-bold text-[#29483A]">
                      Restaurant Information
                    </h3>

                    <div className="space-y-5">
                      <div>
                        <label htmlFor="restaurantName" className={labelClass}>
                          Restaurant Name
                        </label>

                        <div className="relative">
                          <Building2
                            size={17}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#71866B]"
                          />

                          <input
                            id="restaurantName"
                            type="text"
                            required
                            minLength={2}
                            maxLength={100}
                            value={profile.restaurantName}
                            onChange={(e) =>
                              handleChange("restaurantName", e.target.value)
                            }
                            placeholder="Enter restaurant name"
                            className={`${inputClass} pl-11`}
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="restaurantAddress"
                          className={labelClass}
                        >
                          Restaurant Address
                        </label>

                        <div className="relative">
                          <MapPin
                            size={17}
                            className="absolute left-4 top-4 text-[#71866B]"
                          />

                          <textarea
                            id="restaurantAddress"
                            required
                            minLength={10}
                            maxLength={300}
                            rows={3}
                            value={profile.restaurantAddress}
                            onChange={(e) =>
                              handleChange("restaurantAddress", e.target.value)
                            }
                            placeholder="Enter complete restaurant address"
                            className={`${inputClass} resize-none pl-11`}
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="contactNumber" className={labelClass}>
                          Contact Number
                        </label>

                        <div className="relative">
                          <Phone
                            size={17}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#71866B]"
                          />

                          <input
                            id="contactNumber"
                            type="tel"
                            required
                            minLength={7}
                            maxLength={25}
                            value={profile.contactNumber}
                            onChange={(e) =>
                              handleChange("contactNumber", e.target.value)
                            }
                            placeholder="Enter restaurant contact number"
                            className={`${inputClass} pl-11`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Footer */}
                <div className="flex flex-col-reverse gap-3 border-t border-[#DED8C9] bg-[#F2EBDD]/60 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                  <p className="text-xs text-[#706F63]">
                    Make sure your restaurant details are accurate.
                  </p>

                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#29483A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#172B25] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? (
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
                </div>
              </form>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
