
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CreditCard,
  Wallet,
  CheckCircle2,
  XCircle,
  Clock3,
  Search,
  RefreshCw,
  LoaderCircle,
  ShieldCheck,
  CalendarDays,
  Store,
  Receipt,
  X,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

type Transaction = {
  _id: string;
  vendorEmail: string;
  vendorName: string;
  amount: number;
  currency: string;
  status: string;
  paymentMethod: string;
  stripeSessionId: string;
  stripePaymentIntentId: string;
  createdAt: string | null;
};

type Statistics = {
  totalTransactions: number;
  successfulPayments: number;
  failedPayments: number;
  pendingPayments: number;
  totalRevenue: number;
  currency: string;
};

type StatusFilter = "all" | "success" | "failed" | "pending";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const formatAmount = (amount: number, currency: string) => {
  const normalizedCurrency = (currency || "bdt").toUpperCase();

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: normalizedCurrency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${normalizedCurrency} ${amount.toFixed(2)}`;
  }
};

const formatDate = (date?: string | null) => {
  if (!date) return "Unavailable";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "Unavailable";

  return parsedDate.toLocaleString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const getStatusType = (status: string): StatusFilter => {
  const value = status.toLowerCase();

  if (["succeeded", "paid", "completed", "success"].includes(value)) {
    return "success";
  }

  if (["failed", "canceled", "cancelled"].includes(value)) {
    return "failed";
  }

  return "pending";
};

const getStatusLabel = (status: string) => {
  const type = getStatusType(status);

  if (type === "success") return "Successful";
  if (type === "failed") return "Failed";
  return "Pending";
};

export default function AdminTransactionsPage() {
  const { data: session, isPending: sessionLoading } =
    authClient.useSession();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [statistics, setStatistics] = useState<Statistics>({
    totalTransactions: 0,
    successfulPayments: 0,
    failedPayments: 0,
    pendingPayments: 0,
    totalRevenue: 0,
    currency: "bdt",
  });

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [error, setError] = useState("");

  const loadTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/admin/transactions`,
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to load transactions.");
      }

      setTransactions(data.transactions || []);
      setStatistics(data.statistics || statistics);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading transactions.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (sessionLoading) return;

    if (session?.user?.role === "admin") {
      loadTransactions();
    } else {
      setLoading(false);
    }
  }, [sessionLoading, session?.user?.role, loadTransactions]);

  const filteredTransactions = useMemo(() => {
    const query = search.trim().toLowerCase();

    return transactions.filter((transaction) => {
      const matchesStatus =
        statusFilter === "all" ||
        getStatusType(transaction.status) === statusFilter;

      const matchesSearch =
        !query ||
        transaction.vendorName.toLowerCase().includes(query) ||
        transaction.vendorEmail.toLowerCase().includes(query) ||
        transaction._id.toLowerCase().includes(query) ||
        transaction.stripeSessionId.toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [transactions, search, statusFilter]);

  if (sessionLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F6F3EB]">
        <div className="text-center">
          <LoaderCircle
            size={34}
            className="mx-auto mb-3 animate-spin text-[#42634D]"
          />
          <p className="text-sm font-medium text-[#706F63]">
            Loading transactions...
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
              Transactions
            </h1>

            <p className="mt-1 text-xs text-[#858173] sm:text-sm">
              Monitor subscription payments and revenue.
            </p>
          </div>

          <button
            onClick={loadTransactions}
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
              label: "Total Revenue",
              value: formatAmount(
                statistics.totalRevenue,
                statistics.currency,
              ),
              icon: Wallet,
              color: "bg-[#E8EEDC] text-[#42634D]",
            },
            {
              label: "Successful Payments",
              value: statistics.successfulPayments,
              icon: CheckCircle2,
              color: "bg-[#E3EEE5] text-[#42634D]",
            },
            {
              label: "Pending Payments",
              value: statistics.pendingPayments,
              icon: Clock3,
              color: "bg-[#F5EBD9] text-[#A77938]",
            },
            {
              label: "Failed Payments",
              value: statistics.failedPayments,
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
                <p className="mt-1 font-serif text-2xl font-bold text-[#172B25] sm:text-3xl">
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

        {/* Filters */}
        <section className="mb-6 rounded-2xl border border-[#E5DFD2] bg-[#FBF8F1] p-4 sm:p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap gap-2">
              {[
                { label: "All Transactions", value: "all" },
                { label: "Successful", value: "success" },
                { label: "Pending", value: "pending" },
                { label: "Failed", value: "failed" },
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

            <div className="relative w-full xl:max-w-[320px]">
              <Search
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A09B8D]"
              />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search vendor or transaction ID..."
                className="w-full rounded-xl border border-[#DED8C9] bg-white py-3 pl-11 pr-4 text-xs text-[#24352C] outline-none transition placeholder:text-[#A09B8D] focus:border-[#71866B]"
              />
            </div>
          </div>
        </section>

        {/* Transaction Table */}
        <section className="overflow-hidden rounded-2xl border border-[#E5DFD2] bg-[#FBF8F1]">
          <div className="border-b border-[#E5DFD2] px-5 py-5 sm:px-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-xl font-bold text-[#172B25]">
                  Payment History
                </h2>
                <p className="mt-1 text-xs text-[#938E80]">
                  Showing {filteredTransactions.length} of{" "}
                  {transactions.length} transactions
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-[#858173]">
                <Receipt size={17} />
                {statistics.totalTransactions} Total
              </div>
            </div>
          </div>

          {filteredTransactions.length === 0 ? (
            <div className="px-5 py-16 text-center">
              <CreditCard
                size={36}
                className="mx-auto mb-4 text-[#B8B1A1]"
              />
              <h3 className="font-serif text-xl font-bold text-[#29483A]">
                No transactions found
              </h3>
              <p className="mt-2 text-sm text-[#938E80]">
                {transactions.length === 0
                  ? "No payment transactions have been recorded yet."
                  : "Try changing your search or filters."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] text-left">
                <thead>
                  <tr className="border-b border-[#E5DFD2] bg-[#F5F1E8] text-[10px] font-bold uppercase tracking-wider text-[#938E80]">
                    <th className="px-6 py-4">Vendor</th>
                    <th className="px-6 py-4">Transaction ID</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Payment Method</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredTransactions.map((transaction) => {
                    const statusType = getStatusType(transaction.status);

                    return (
                      <tr
                        key={transaction._id}
                        className="border-b border-[#EDE8DD] last:border-0 transition hover:bg-[#F8F5ED]"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E8EEDC] text-[#42634D]">
                              <Store size={18} />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-[#29483A]">
                                {transaction.vendorName}
                              </p>
                              <p className="mt-1 text-xs text-[#938E80]">
                                {transaction.vendorEmail || "Email unavailable"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <p
                            title={transaction.stripeSessionId || transaction._id}
                            className="max-w-[170px] truncate font-mono text-[11px] text-[#706F63]"
                          >
                            {transaction.stripeSessionId || transaction._id}
                          </p>
                        </td>

                        <td className="px-6 py-5">
                          <span className="text-sm font-bold text-[#172B25]">
                            {formatAmount(
                              transaction.amount,
                              transaction.currency,
                            )}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <span className="inline-flex items-center gap-2 text-xs text-[#706F63]">
                            <CreditCard
                              size={15}
                              className="text-[#A77938]"
                            />
                            {transaction.paymentMethod}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <span className="flex items-center gap-2 text-xs text-[#706F63]">
                            <CalendarDays
                              size={14}
                              className="text-[#A09B8D]"
                            />
                            {formatDate(transaction.createdAt)}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold ${
                              statusType === "success"
                                ? "bg-[#E3EEE5] text-[#42634D]"
                                : statusType === "failed"
                                  ? "bg-[#F4E3DF] text-[#B65D4E]"
                                  : "bg-[#F5EBD9] text-[#A77938]"
                            }`}
                          >
                            {statusType === "success" ? (
                              <CheckCircle2 size={12} />
                            ) : statusType === "failed" ? (
                              <XCircle size={12} />
                            ) : (
                              <Clock3 size={12} />
                            )}
                            {getStatusLabel(transaction.status)}
                          </span>
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
