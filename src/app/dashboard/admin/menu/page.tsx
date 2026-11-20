
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Clock3,
  LoaderCircle,
  RefreshCw,
  Search,
  ShieldCheck,
  UtensilsCrossed,
  X,
  XCircle,
  Power,
  Trash2,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

type MenuItem = {
  _id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image?: string;
  vendorId: string;
  vendorEmail?: string;
  status: "pending" | "approved" | "rejected";
  isAvailable?: boolean;
  createdAt: string;
};

type FilterStatus = "all" | "pending" | "approved" | "rejected";
type AvailabilityFilter = "all" | "active" | "inactive";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const filters: { label: string; value: FilterStatus }[] = [
  { label: "All Items", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

const formatDate = (date: string) => {
  if (!date) return "Date unavailable";

  return new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function AdminMenuPage() {
  const { data: session, isPending: sessionLoading } =
    authClient.useSession();

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [availabilityFilter, setAvailabilityFilter] =
    useState<AvailabilityFilter>("all");

  const loadMenuItems = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/admin/menu`, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to load menu items.");
      }

      setMenuItems(data.menuItems || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading menu items.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (sessionLoading) return;

    if (session?.user?.role === "admin") {
      loadMenuItems();
    } else {
      setLoading(false);
    }
  }, [sessionLoading, session?.user?.role, loadMenuItems]);

  const counts = useMemo(
    () => ({
      all: menuItems.length,
      pending: menuItems.filter((item) => item.status === "pending").length,
      approved: menuItems.filter((item) => item.status === "approved").length,
      rejected: menuItems.filter((item) => item.status === "rejected").length,
      active: menuItems.filter(
        (item) => item.status === "approved" && item.isAvailable === true,
      ).length,
      inactive: menuItems.filter(
        (item) => item.status === "approved" && item.isAvailable !== true,
      ).length,
    }),
    [menuItems],
  );

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    return menuItems.filter((item) => {
      const matchesStatus =
        filter === "all" || item.status === filter;

      const matchesAvailability =
        availabilityFilter === "all" ||
        (availabilityFilter === "active" &&
          item.status === "approved" &&
          item.isAvailable === true) ||
        (availabilityFilter === "inactive" &&
          item.status === "approved" &&
          item.isAvailable !== true);

      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        (item.vendorEmail || "").toLowerCase().includes(query);

      return matchesStatus && matchesAvailability && matchesSearch;
    });
  }, [menuItems, filter, availabilityFilter, search]);

  const handleReview = async (
    item: MenuItem,
    status: "approved" | "rejected",
  ) => {
    if (processingId) return;

    const actionLabel = status === "approved" ? "approve" : "reject";

    if (
      status === "rejected" &&
      !window.confirm(`Are you sure you want to reject "${item.name}"?`)
    ) {
      return;
    }

    try {
      setProcessingId(item._id);
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_URL}/api/admin/menu/${item._id}/review`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ status }),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || `Unable to ${actionLabel} item.`);
      }

      setMenuItems((previous) =>
        previous.map((menuItem) =>
          menuItem._id === item._id
            ? data.menuItem
            : menuItem,
        ),
      );

      setSuccess(
        status === "approved"
          ? `${item.name} has been approved successfully.`
          : `${item.name} has been rejected.`,
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handleAvailability = async (item: MenuItem) => {
    if (processingId || item.status !== "approved") return;

    const nextAvailability = item.isAvailable !== true;

    try {
      setProcessingId(item._id);
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_URL}/api/admin/menu/${item._id}/availability`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ isAvailable: nextAvailability }),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        if (data.code === "FREE_PLAN_LIMIT_REACHED") {
          throw new Error(
            data.message ||
              "This vendor has reached the Free plan limit of 3 active menu items.",
          );
        }

        throw new Error(
          data.message || "Unable to update item availability.",
        );
      }

      setMenuItems((previous) =>
        previous.map((menuItem) =>
          menuItem._id === item._id
            ? { ...menuItem, ...data.menuItem }
            : menuItem,
        ),
      );

      setSuccess(
        data.message ||
          `${item.name} has been ${
            nextAvailability ? "activated" : "deactivated"
          } successfully.`,
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (item: MenuItem) => {
    if (processingId) return;

    const confirmed = window.confirm(
      `Are you sure you want to permanently delete "${item.name}"?\n\nThis action cannot be undone.`,
    );

    if (!confirmed) return;

    try {
      setProcessingId(item._id);
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_URL}/api/admin/menu/${item._id}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        if (response.status === 409 || data.code === "ACTIVE_ORDERS_EXIST") {
          throw new Error(
            data.message ||
              "This item has pending or accepted orders. Deactivate it instead of deleting it.",
          );
        }

        throw new Error(data.message || "Unable to delete this menu item.");
      }

      setMenuItems((previous) =>
        previous.filter((menuItem) => menuItem._id !== item._id),
      );

      setSuccess(data.message || `${item.name} has been deleted successfully.`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setProcessingId(null);
    }
  };

  if (sessionLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F6F3EB]">
        <div className="text-center">
          <LoaderCircle
            size={34}
            className="mx-auto mb-3 animate-spin text-[#42634D]"
          />
          <p className="text-sm font-medium text-[#706F63]">
            Loading menu submissions...
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
              Menu Approvals
            </h1>

            <p className="mt-1 text-xs text-[#858173] sm:text-sm">
              Review and manage vendor menu submissions.
            </p>
          </div>

          <button
            onClick={loadMenuItems}
            disabled={loading || Boolean(processingId)}
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
              label: "Total Submissions",
              value: counts.all,
              icon: UtensilsCrossed,
              color: "bg-[#E8EEDC] text-[#42634D]",
            },
            {
              label: "Pending Review",
              value: counts.pending,
              icon: Clock3,
              color: "bg-[#F5EBD9] text-[#A77938]",
            },
            {
              label: "Approved",
              value: counts.approved,
              icon: CheckCircle2,
              color: "bg-[#E3EEE5] text-[#42634D]",
            },
            {
              label: "Rejected",
              value: counts.rejected,
              icon: XCircle,
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

        {/* Availability Summary */}
        <section className="mb-8 grid grid-cols-2 gap-4">
          <div className="rounded-2xl border border-[#D5E2D2] bg-[#FBF8F1] p-5">
            <div className="flex items-center gap-2 text-[#42634D]">
              <Power size={18} />
              <p className="text-xs font-bold">Active Menu Items</p>
            </div>
            <p className="mt-2 font-serif text-3xl font-bold text-[#172B25]">
              {counts.active}
            </p>
            <p className="mt-1 text-xs text-[#858173]">
              Approved and available to customers
            </p>
          </div>

          <div className="rounded-2xl border border-[#E5DFD2] bg-[#FBF8F1] p-5">
            <div className="flex items-center gap-2 text-[#A77938]">
              <Power size={18} />
              <p className="text-xs font-bold">Inactive Menu Items</p>
            </div>
            <p className="mt-2 font-serif text-3xl font-bold text-[#172B25]">
              {counts.inactive}
            </p>
            <p className="mt-1 text-xs text-[#858173]">
              Approved but hidden from customers
            </p>
          </div>
        </section>

        {/* Alerts */}
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

        {success && (
          <div className="mb-6 flex items-start justify-between gap-4 rounded-xl border border-[#C8DDC8] bg-[#EAF3E9] p-4 text-sm text-[#42634D]">
            <p>{success}</p>
            <button
              onClick={() => setSuccess("")}
              aria-label="Dismiss success message"
            >
              <X size={17} />
            </button>
          </div>
        )}

        {/* Filters and Search */}
        <section className="mb-6 rounded-2xl border border-[#E5DFD2] bg-[#FBF8F1] p-4 sm:p-5">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-2">
              {filters.map((item) => (
                <button
                  key={item.value}
                  onClick={() => setFilter(item.value)}
                  className={`rounded-xl px-4 py-2.5 text-xs font-bold transition ${
                    filter === item.value
                      ? "bg-[#29483A] text-white"
                      : "border border-[#DED8C9] text-[#706F63] hover:bg-[#F2EBDD]"
                  }`}
                >
                  {item.label}
                  <span className="ml-2 opacity-70">
                    {counts[item.value]}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3 border-t border-[#E5DFD2] pt-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <span className="mr-1 text-xs font-semibold text-[#858173]">
                  Availability:
                </span>

                {[
                  { label: "All", value: "all" },
                  { label: `Active (${counts.active})`, value: "active" },
                  {
                    label: `Inactive (${counts.inactive})`,
                    value: "inactive",
                  },
                ].map((item) => (
                  <button
                    key={item.value}
                    onClick={() =>
                      setAvailabilityFilter(
                        item.value as AvailabilityFilter,
                      )
                    }
                    className={`rounded-lg px-3 py-2 text-xs font-bold transition ${
                      availabilityFilter === item.value
                        ? "bg-[#E8EEDC] text-[#29483A]"
                        : "border border-[#DED8C9] text-[#706F63] hover:bg-[#F2EBDD]"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:max-w-[300px]">
                <Search
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A09B8D]"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search name, category or vendor..."
                  className="w-full rounded-xl border border-[#DED8C9] bg-white py-3 pl-11 pr-4 text-xs text-[#24352C] outline-none transition placeholder:text-[#A09B8D] focus:border-[#71866B]"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Menu Items */}
        <section>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#172B25]">
                Menu Submissions
              </h2>
              <p className="mt-1 text-xs text-[#938E80]">
                Showing {filteredItems.length} of {menuItems.length} items
              </p>
            </div>
          </div>

          {filteredItems.length === 0 ? (
            <div className="rounded-2xl border border-[#E5DFD2] bg-[#FBF8F1] px-5 py-16 text-center">
              <UtensilsCrossed
                size={36}
                className="mx-auto mb-4 text-[#B8B1A1]"
              />
              <h3 className="font-serif text-xl font-bold text-[#29483A]">
                No menu items found
              </h3>
              <p className="mt-2 text-sm text-[#938E80]">
                Try another filter or search term.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-3">
              {filteredItems.map((item) => {
                const isProcessing = processingId === item._id;
                const isActive = item.isAvailable === true;

                return (
                  <article
                    key={item._id}
                    className="overflow-hidden rounded-2xl border border-[#E5DFD2] bg-[#FBF8F1] shadow-[0_3px_15px_rgba(36,53,44,0.025)]"
                  >
                    {/* Image */}
                    <div className="relative h-[210px] overflow-hidden bg-[#E8EEDC]">
                      {item.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover transition duration-500 hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <UtensilsCrossed
                            size={42}
                            className="text-[#71866B]"
                          />
                        </div>
                      )}

                      <div className="absolute left-4 top-4">
                        <span
                          className={`rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider ${
                            item.status === "approved"
                              ? "bg-[#E3EEE5] text-[#42634D]"
                              : item.status === "rejected"
                                ? "bg-[#F4E3DF] text-[#B65D4E]"
                                : "bg-[#F5EBD9] text-[#A77938]"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>

                      <div className="absolute bottom-4 right-4 rounded-xl bg-[#172B25]/90 px-3 py-2 text-sm font-bold text-white backdrop-blur-sm">
                        ৳{item.price}
                      </div>
                    </div>

                    {/* Details */}
                    <div className="p-5">
                      <div className="mb-2 flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold uppercase tracking-[1.5px] text-[#A77938]">
                            {item.category}
                          </p>
                          <h3 className="mt-1 truncate font-serif text-xl font-bold text-[#172B25]">
                            {item.name}
                          </h3>
                        </div>
                      </div>

                      <p className="line-clamp-2 min-h-10 text-xs leading-5 text-[#858173]">
                        {item.description}
                      </p>

                      <div className="mt-4 rounded-xl bg-[#F2EBDD] p-3">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#A09B8D]">
                          Submitted By
                        </p>
                        <p className="mt-1 break-all text-xs font-semibold text-[#29483A]">
                          {item.vendorEmail || "Vendor email unavailable"}
                        </p>
                        <p className="mt-1 text-[10px] text-[#938E80]">
                          Submitted on {formatDate(item.createdAt)}
                        </p>
                      </div>

                      {/* Availability Status */}
                      {item.status === "approved" && (
                        <div className="mt-4 flex items-center justify-between rounded-xl border border-[#E5DFD2] px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span
                              className={`h-2.5 w-2.5 rounded-full ${
                                isActive ? "bg-[#42634D]" : "bg-[#A77938]"
                              }`}
                            />
                            <span className="text-xs font-semibold text-[#706F63]">
                              {isActive ? "Active on menu" : "Inactive"}
                            </span>
                          </div>

                          <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                              isActive
                                ? "bg-[#E3EEE5] text-[#42634D]"
                                : "bg-[#F5EBD9] text-[#A77938]"
                            }`}
                          >
                            {isActive ? "ACTIVE" : "INACTIVE"}
                          </span>
                        </div>
                      )}

                      {/* Approval Actions */}
                      {item.status === "pending" && (
                        <div className="mt-5 grid grid-cols-2 gap-3">
                          <button
                            onClick={() => handleReview(item, "approved")}
                            disabled={Boolean(processingId)}
                            className="flex items-center justify-center gap-2 rounded-xl bg-[#29483A] px-3 py-3 text-xs font-bold text-white transition hover:bg-[#42634D] disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {isProcessing ? (
                              <LoaderCircle
                                size={15}
                                className="animate-spin"
                              />
                            ) : (
                              <Check size={16} />
                            )}
                            Approve
                          </button>

                          <button
                            onClick={() => handleReview(item, "rejected")}
                            disabled={Boolean(processingId)}
                            className="flex items-center justify-center gap-2 rounded-xl border border-[#E6C5BD] bg-[#F9EAE6] px-3 py-3 text-xs font-bold text-[#A65A4F] transition hover:bg-[#F4E3DF] disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {isProcessing ? (
                              <LoaderCircle
                                size={15}
                                className="animate-spin"
                              />
                            ) : (
                              <X size={16} />
                            )}
                            Reject
                          </button>
                        </div>
                      )}

                      {item.status === "rejected" && (
                        <div className="mt-5 flex items-center gap-2 rounded-xl border border-[#E5DFD2] px-4 py-3 text-xs font-semibold text-[#858173]">
                          <XCircle
                            size={17}
                            className="text-[#B65D4E]"
                          />
                          This item has been rejected.
                        </div>
                      )}

                      {/* Management Actions */}
                      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {item.status === "approved" && (
                          <button
                            onClick={() => handleAvailability(item)}
                            disabled={Boolean(processingId)}
                            className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                              isActive
                                ? "border border-[#E6C5BD] bg-[#F9EAE6] text-[#A65A4F] hover:bg-[#F4E3DF]"
                                : "bg-[#29483A] text-white hover:bg-[#42634D]"
                            }`}
                          >
                            {isProcessing ? (
                              <LoaderCircle
                                size={15}
                                className="animate-spin"
                              />
                            ) : (
                              <Power size={15} />
                            )}
                            {isActive ? "Deactivate Item" : "Activate Item"}
                          </button>
                        )}

                        <button
                          onClick={() => handleDelete(item)}
                          disabled={Boolean(processingId)}
                          className={`flex items-center justify-center gap-2 rounded-xl border border-[#E6C5BD] bg-[#F9EAE6] px-3 py-3 text-xs font-bold text-[#A65A4F] transition hover:bg-[#F4E3DF] disabled:cursor-not-allowed disabled:opacity-50 ${
                            item.status !== "approved" ? "sm:col-span-2" : ""
                          }`}
                        >
                          {isProcessing ? (
                            <LoaderCircle
                              size={15}
                              className="animate-spin"
                            />
                          ) : (
                            <Trash2 size={15} />
                          )}
                          Delete Item
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
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
