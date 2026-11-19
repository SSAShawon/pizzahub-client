
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Store,
  Users,
  Crown,
  Search,
  RefreshCw,
  LoaderCircle,
  ShieldCheck,
  Ban,
  CheckCircle2,
  Mail,
  MapPin,
  Phone,
  CalendarDays,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

type Vendor = {
  _id: string;
  name: string;
  email: string;
  image?: string;
  isBlocked?: boolean;
  restaurantName?: string;
  restaurantAddress?: string;
  contactNumber?: string;
  subscriptionPlan: "free" | "premium";
  subscriptionExpiresAt?: string | null;
  createdAt?: string;
  activeMenuItems: number;
};

type PlanFilter = "all" | "free" | "premium";
type StatusFilter = "all" | "active" | "blocked";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const formatDate = (date?: string | null) => {
  if (!date) return "No expiry date";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "Unavailable";

  return parsedDate.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function AdminVendorsPage() {
  const { data: session, isPending: sessionLoading } =
    authClient.useSession();

  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState<PlanFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [error, setError] = useState("");

  const loadVendors = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/admin/vendors`, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to load vendors.");
      }

      setVendors(data.vendors || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading vendors.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (sessionLoading) return;

    if (session?.user?.role === "admin") {
      loadVendors();
    } else {
      setLoading(false);
    }
  }, [sessionLoading, session?.user?.role, loadVendors]);

  const counts = useMemo(
    () => ({
      total: vendors.length,
      premium: vendors.filter(
        (vendor) => vendor.subscriptionPlan === "premium",
      ).length,
      free: vendors.filter(
        (vendor) => vendor.subscriptionPlan === "free",
      ).length,
      blocked: vendors.filter((vendor) => vendor.isBlocked).length,
    }),
    [vendors],
  );

  const filteredVendors = useMemo(() => {
    const query = search.trim().toLowerCase();

    return vendors.filter((vendor) => {
      const matchesPlan =
        planFilter === "all" ||
        vendor.subscriptionPlan === planFilter;

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "blocked"
          ? Boolean(vendor.isBlocked)
          : !vendor.isBlocked);

      const matchesSearch =
        !query ||
        (vendor.name || "").toLowerCase().includes(query) ||
        (vendor.email || "").toLowerCase().includes(query) ||
        (vendor.restaurantName || "").toLowerCase().includes(query) ||
        (vendor.restaurantAddress || "").toLowerCase().includes(query);

      return matchesPlan && matchesStatus && matchesSearch;
    });
  }, [vendors, search, planFilter, statusFilter]);

  if (sessionLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F6F3EB]">
        <div className="text-center">
          <LoaderCircle
            size={34}
            className="mx-auto mb-3 animate-spin text-[#42634D]"
          />
          <p className="text-sm font-medium text-[#706F63]">
            Loading vendor management...
          </p>
        </div>
      </div>
    );
  }

  if (!session?.user || session.user.role !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F6F3EB] px-5">
        <div className="max-w-md rounded-3xl bg-[#FBF8F1] p-9 text-center shadow-sm">
          <ShieldCheck
            size={42}
            className="mx-auto mb-4 text-[#C69B62]"
          />
          <h1 className="mb-2 font-serif text-2xl font-bold text-[#172B25]">
            Access Restricted
          </h1>
          <p className="mb-6 text-sm text-[#706F63]">
            This page is only available to authorized administrators.
          </p>
          <Link
            href="/login"
            className="inline-flex rounded-xl bg-[#29483A] px-6 py-3 text-sm font-semibold text-white"
          >
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F3EB] text-[#24352C]">
      {/* Header */}
      <header className="border-b border-[#DED8C9] bg-[#FBF8F1]">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
          <div>
            <Link
              href="/dashboard/admin"
              className="mb-2 inline-flex items-center gap-2 text-xs font-semibold text-[#858173] transition hover:text-[#29483A]"
            >
              <ArrowLeft size={14} />
              Back to Dashboard
            </Link>

            <h1 className="font-serif text-2xl font-bold text-[#172B25] sm:text-3xl">
              Vendor Management
            </h1>

            <p className="mt-1 text-xs text-[#858173] sm:text-sm">
              Monitor restaurants, vendor accounts and subscriptions.
            </p>
          </div>

          <button
            onClick={loadVendors}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-[#DED8C9] bg-white px-4 py-3 text-xs font-bold text-[#42634D] transition hover:bg-[#F2EBDD] disabled:opacity-50"
          >
            <RefreshCw size={16} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[1500px] px-5 py-8 sm:px-8 lg:px-12">
        {/* Statistics */}
        <section className="mb-8 grid grid-cols-2 gap-4 xl:grid-cols-4">
          {[
            {
              label: "Total Vendors",
              value: counts.total,
              icon: Store,
              color: "bg-[#E8EEDC] text-[#42634D]",
            },
            {
              label: "Premium Vendors",
              value: counts.premium,
              icon: Crown,
              color: "bg-[#F5EBD9] text-[#A77938]",
            },
            {
              label: "Free Plan Vendors",
              value: counts.free,
              icon: Users,
              color: "bg-[#E5EAF2] text-[#536E91]",
            },
            {
              label: "Blocked Accounts",
              value: counts.blocked,
              icon: Ban,
              color: "bg-[#F4E3DF] text-[#B65D4E]",
            },
          ].map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-[#E5DFD2] bg-[#FBF8F1] p-5"
              >
                <div
                  className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${stat.color}`}
                >
                  <Icon size={20} />
                </div>
                <p className="text-xs font-medium text-[#858173]">
                  {stat.label}
                </p>
                <p className="mt-1 font-serif text-3xl font-bold text-[#172B25]">
                  {stat.value}
                </p>
              </div>
            );
          })}
        </section>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-start justify-between gap-4 rounded-xl border border-[#E6C5BD] bg-[#F9EAE6] p-4 text-sm text-[#A65A4F]">
            <p>{error}</p>
            <button
              onClick={() => setError("")}
              aria-label="Dismiss error"
            >
              <X size={17} />
            </button>
          </div>
        )}

        {/* Search and Filters */}
        <section className="mb-6 rounded-2xl border border-[#E5DFD2] bg-[#FBF8F1] p-4 sm:p-5">
          <div className="mb-5 relative">
            <Search
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A09B8D]"
            />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search restaurant, owner, email or address..."
              className="w-full rounded-xl border border-[#DED8C9] bg-white py-3 pl-11 pr-4 text-xs text-[#24352C] outline-none transition placeholder:text-[#A09B8D] focus:border-[#71866B]"
            />
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[#938E80]">
                Subscription Plan
              </p>

              <div className="flex flex-wrap gap-2">
                {[
                  { label: "All Plans", value: "all" },
                  { label: "Free", value: "free" },
                  { label: "Premium", value: "premium" },
                ].map((item) => (
                  <button
                    key={item.value}
                    onClick={() =>
                      setPlanFilter(item.value as PlanFilter)
                    }
                    className={`rounded-xl px-4 py-2.5 text-xs font-bold transition ${
                      planFilter === item.value
                        ? "bg-[#29483A] text-white"
                        : "border border-[#DED8C9] text-[#706F63] hover:bg-[#F2EBDD]"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[#938E80]">
                Account Status
              </p>

              <div className="flex flex-wrap gap-2">
                {[
                  { label: "All", value: "all" },
                  { label: "Active", value: "active" },
                  { label: "Blocked", value: "blocked" },
                ].map((item) => (
                  <button
                    key={item.value}
                    onClick={() =>
                      setStatusFilter(item.value as StatusFilter)
                    }
                    className={`rounded-xl px-4 py-2.5 text-xs font-bold transition ${
                      statusFilter === item.value
                        ? "bg-[#29483A] text-white"
                        : "border border-[#DED8C9] text-[#706F63] hover:bg-[#F2EBDD]"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Vendor Cards */}
        <section>
          <div className="mb-5">
            <h2 className="font-serif text-xl font-bold text-[#172B25]">
              Registered Restaurants
            </h2>
            <p className="mt-1 text-xs text-[#938E80]">
              Showing {filteredVendors.length} of {vendors.length} vendors
            </p>
          </div>

          {filteredVendors.length === 0 ? (
            <div className="rounded-2xl border border-[#E5DFD2] bg-[#FBF8F1] px-5 py-16 text-center">
              <Store
                size={36}
                className="mx-auto mb-4 text-[#B8B1A1]"
              />
              <h3 className="font-serif text-xl font-bold text-[#29483A]">
                No vendors found
              </h3>
              <p className="mt-2 text-sm text-[#938E80]">
                Try changing your search or filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 2xl:grid-cols-3">
              {filteredVendors.map((vendor) => (
                <article
                  key={vendor._id}
                  className="overflow-hidden rounded-2xl border border-[#E5DFD2] bg-[#FBF8F1]"
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3 border-b border-[#EDE8DD] p-5">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#E8EEDC] text-[#42634D]">
                        {vendor.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={vendor.image}
                            alt={vendor.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Store size={23} />
                        )}
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate font-serif text-lg font-bold text-[#172B25]">
                          {vendor.restaurantName || "Unnamed Restaurant"}
                        </h3>
                        <p className="mt-1 truncate text-xs text-[#858173]">
                          Owner: {vendor.name || "Unavailable"}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-3 py-1.5 text-[9px] font-bold uppercase ${
                        vendor.isBlocked
                          ? "bg-[#F4E3DF] text-[#B65D4E]"
                          : "bg-[#E3EEE5] text-[#42634D]"
                      }`}
                    >
                      {vendor.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </div>

                  {/* Vendor Information */}
                  <div className="space-y-3 p-5">
                    <div className="flex items-center gap-3 text-xs text-[#706F63]">
                      <Mail
                        size={15}
                        className="shrink-0 text-[#A77938]"
                      />
                      <span className="break-all">{vendor.email}</span>
                    </div>

                    <div className="flex items-start gap-3 text-xs text-[#706F63]">
                      <MapPin
                        size={15}
                        className="mt-0.5 shrink-0 text-[#A77938]"
                      />
                      <span>
                        {vendor.restaurantAddress || "Address unavailable"}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-[#706F63]">
                      <Phone
                        size={15}
                        className="shrink-0 text-[#A77938]"
                      />
                      <span>
                        {vendor.contactNumber || "Contact unavailable"}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-[#706F63]">
                      <CalendarDays
                        size={15}
                        className="shrink-0 text-[#A77938]"
                      />
                      <span>
                        Joined: {formatDate(vendor.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Subscription */}
                  <div className="mx-5 mb-5 rounded-xl bg-[#F2EBDD] p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Crown
                          size={17}
                          className={
                            vendor.subscriptionPlan === "premium"
                              ? "text-[#A77938]"
                              : "text-[#858173]"
                          }
                        />
                        <span className="text-xs font-bold text-[#29483A]">
                          Subscription
                        </span>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-[9px] font-bold uppercase ${
                          vendor.subscriptionPlan === "premium"
                            ? "bg-[#E8D8B9] text-[#88632D]"
                            : "bg-[#E5E2D9] text-[#706F63]"
                        }`}
                      >
                        {vendor.subscriptionPlan}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3 text-xs">
                      <span className="text-[#858173]">
                        {vendor.subscriptionPlan === "premium"
                          ? "Expires on"
                          : "Menu item limit"}
                      </span>
                      <span className="font-semibold text-[#29483A]">
                        {vendor.subscriptionPlan === "premium"
                          ? formatDate(vendor.subscriptionExpiresAt)
                          : "3 active items"}
                      </span>
                    </div>
                  </div>

                  {/* Menu and Status */}
                  <div className="flex items-center justify-between gap-3 border-t border-[#EDE8DD] px-5 py-4">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#706F63]">
                      <UtensilsCrossed
                        size={16}
                        className="text-[#71866B]"
                      />
                      {vendor.activeMenuItems} Active Menu Items
                    </div>

                    {vendor.isBlocked ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#B65D4E]">
                        <Ban size={13} />
                        Account Blocked
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#42634D]">
                        <CheckCircle2 size={13} />
                        Account Active
                      </span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <footer className="mt-12 border-t border-[#DED8C9] py-6 text-center text-xs text-[#A09B8D]">
          © {new Date().getFullYear()} PizzaHub. Crafted with Passion. Delivered with Love.
        </footer>
      </main>
    </div>
  );
}
