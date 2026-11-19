
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  Users,
  UserRound,
  Store,
  ShieldCheck,
  Ban,
  CheckCircle2,
  LoaderCircle,
  RefreshCw,
  X,
  Mail,
  CalendarDays,
  Check,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

type UserRole = "customer" | "vendor";

type ManagedUser = {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  image?: string;
  isBlocked?: boolean;
  restaurantName?: string;
  createdAt?: string;
};

type RoleFilter = "all" | "customer" | "vendor";
type StatusFilter = "all" | "active" | "blocked";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const formatDate = (date?: string) => {
  if (!date) return "Unavailable";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "Unavailable";

  return parsedDate.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function AdminUsersPage() {
  const { data: session, isPending: sessionLoading } =
    authClient.useSession();

  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/admin/users`, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to load users.");
      }

      setUsers(data.users || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading users.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (sessionLoading) return;

    if (session?.user?.role === "admin") {
      loadUsers();
    } else {
      setLoading(false);
    }
  }, [sessionLoading, session?.user?.role, loadUsers]);

  const counts = useMemo(
    () => ({
      total: users.length,
      customers: users.filter((user) => user.role === "customer").length,
      vendors: users.filter((user) => user.role === "vendor").length,
      blocked: users.filter((user) => user.isBlocked).length,
    }),
    [users],
  );

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesRole =
        roleFilter === "all" || user.role === roleFilter;

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "blocked"
          ? Boolean(user.isBlocked)
          : !user.isBlocked);

      const matchesSearch =
        !query ||
        (user.name || "").toLowerCase().includes(query) ||
        (user.email || "").toLowerCase().includes(query) ||
        (user.restaurantName || "").toLowerCase().includes(query);

      return matchesRole && matchesStatus && matchesSearch;
    });
  }, [users, search, roleFilter, statusFilter]);

  const handleStatusChange = async (user: ManagedUser) => {
    if (processingId) return;

    const nextBlockedStatus = !user.isBlocked;

    const action = nextBlockedStatus ? "block" : "unblock";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} ${user.name}'s account?`,
    );

    if (!confirmed) return;

    try {
      setProcessingId(user._id);
      setError("");
      setSuccess("");

      const response = await fetch(`${API_URL}/api/admin/users/${encodeURIComponent(user.email)}/status`,
        
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            isBlocked: nextBlockedStatus,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || `Unable to ${action} user.`);
      }

      setUsers((previous) =>
        previous.map((item) =>
          item._id === user._id
            ? { ...item, isBlocked: nextBlockedStatus }
            : item,
        ),
      );

      setSuccess(
        nextBlockedStatus
          ? `${user.name}'s account has been blocked.`
          : `${user.name}'s account has been unblocked.`,
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

  if (sessionLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F6F3EB]">
        <div className="text-center">
          <LoaderCircle
            size={34}
            className="mx-auto mb-3 animate-spin text-[#42634D]"
          />
          <p className="text-sm font-medium text-[#706F63]">
            Loading user management...
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
              User Management
            </h1>

            <p className="mt-1 text-xs text-[#858173] sm:text-sm">
              Manage customer and vendor accounts.
            </p>
          </div>

          <button
            onClick={loadUsers}
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
              label: "Total Users",
              value: counts.total,
              icon: Users,
              color: "bg-[#E8EEDC] text-[#42634D]",
            },
            {
              label: "Customers",
              value: counts.customers,
              icon: UserRound,
              color: "bg-[#E5EAF2] text-[#536E91]",
            },
            {
              label: "Vendors",
              value: counts.vendors,
              icon: Store,
              color: "bg-[#F5EBD9] text-[#A77938]",
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
              aria-label="Dismiss success"
            >
              <X size={17} />
            </button>
          </div>
        )}

        {/* Filters */}
        <section className="mb-6 rounded-2xl border border-[#E5DFD2] bg-[#FBF8F1] p-4 sm:p-5">
          <div className="flex flex-col gap-5">
            <div className="relative w-full">
              <Search
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A09B8D]"
              />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by name, email or restaurant..."
                className="w-full rounded-xl border border-[#DED8C9] bg-white py-3 pl-11 pr-4 text-xs text-[#24352C] outline-none transition placeholder:text-[#A09B8D] focus:border-[#71866B]"
              />
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[#938E80]">
                  Account Type
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "All Users", value: "all" },
                    { label: "Customers", value: "customer" },
                    { label: "Vendors", value: "vendor" },
                  ].map((item) => (
                    <button
                      key={item.value}
                      onClick={() =>
                        setRoleFilter(item.value as RoleFilter)
                      }
                      className={`rounded-xl px-4 py-2.5 text-xs font-bold transition ${
                        roleFilter === item.value
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
          </div>
        </section>

        {/* User Table */}
        <section className="overflow-hidden rounded-2xl border border-[#E5DFD2] bg-[#FBF8F1]">
          <div className="border-b border-[#E5DFD2] px-5 py-5 sm:px-6">
            <h2 className="font-serif text-xl font-bold text-[#172B25]">
              Registered Accounts
            </h2>
            <p className="mt-1 text-xs text-[#938E80]">
              Showing {filteredUsers.length} of {users.length} accounts
            </p>
          </div>

          {filteredUsers.length === 0 ? (
            <div className="px-5 py-16 text-center">
              <Users
                size={36}
                className="mx-auto mb-4 text-[#B8B1A1]"
              />
              <h3 className="font-serif text-xl font-bold text-[#29483A]">
                No users found
              </h3>
              <p className="mt-2 text-sm text-[#938E80]">
                Try changing your search or filters.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left">
                <thead>
                  <tr className="border-b border-[#E5DFD2] bg-[#F5F1E8] text-[10px] font-bold uppercase tracking-wider text-[#938E80]">
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Account Type</th>
                    <th className="px-6 py-4">Joined</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((user) => {
                    const isProcessing = processingId === user._id;

                    return (
                      <tr
                        key={user._id}
                        className="border-b border-[#EDE8DD] last:border-0 transition hover:bg-[#F8F5ED]"
                      >
                        {/* User */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#E8EEDC] text-sm font-bold text-[#42634D]">
                              {user.image ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={user.image}
                                  alt={user.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                (user.name || "U")
                                  .charAt(0)
                                  .toUpperCase()
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="max-w-[230px] truncate text-sm font-bold text-[#29483A]">
                                {user.name || "Unnamed User"}
                              </p>
                              <p className="mt-1 flex items-center gap-1.5 text-xs text-[#938E80]">
                                <Mail size={12} />
                                <span className="max-w-[230px] truncate">
                                  {user.email}
                                </span>
                              </p>

                              {user.role === "vendor" &&
                                user.restaurantName && (
                                  <p className="mt-1 text-[10px] font-medium text-[#A77938]">
                                    {user.restaurantName}
                                  </p>
                                )}
                            </div>
                          </div>
                        </td>

                        {/* Role */}
                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase ${
                              user.role === "vendor"
                                ? "bg-[#F5EBD9] text-[#A77938]"
                                : "bg-[#E5EAF2] text-[#536E91]"
                            }`}
                          >
                            {user.role === "vendor" ? (
                              <Store size={12} />
                            ) : (
                              <UserRound size={12} />
                            )}
                            {user.role}
                          </span>
                        </td>

                        {/* Joined */}
                        <td className="px-6 py-5">
                          <span className="flex items-center gap-2 text-xs text-[#706F63]">
                            <CalendarDays
                              size={14}
                              className="text-[#A09B8D]"
                            />
                            {formatDate(user.createdAt)}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-5">
                          {user.isBlocked ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F4E3DF] px-3 py-1.5 text-[10px] font-bold text-[#B65D4E]">
                              <Ban size={12} />
                              Blocked
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E3EEE5] px-3 py-1.5 text-[10px] font-bold text-[#42634D]">
                              <CheckCircle2 size={12} />
                              Active
                            </span>
                          )}
                        </td>

                        {/* Action */}
                        <td className="px-6 py-5 text-right">
                          <button
                            onClick={() => handleStatusChange(user)}
                            disabled={Boolean(processingId)}
                            className={`inline-flex min-w-[112px] items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-[11px] font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                              user.isBlocked
                                ? "bg-[#E3EEE5] text-[#42634D] hover:bg-[#D6E8D7]"
                                : "bg-[#F4E3DF] text-[#B65D4E] hover:bg-[#EED5CF]"
                            }`}
                          >
                            {isProcessing ? (
                              <LoaderCircle
                                size={14}
                                className="animate-spin"
                              />
                            ) : user.isBlocked ? (
                              <Check size={14} />
                            ) : (
                              <Ban size={14} />
                            )}

                            {user.isBlocked ? "Unblock" : "Block"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
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
