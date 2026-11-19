
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  UtensilsCrossed,
  Users,
  Store,
  CreditCard,
  Settings,
  LogOut,
  Bell,
  Search,
  ArrowUpRight,
  Clock3,
  CheckCircle2,
  XCircle,
  Menu,
  ShieldCheck,
  LoaderCircle,
  RefreshCw,
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
  isAvailable: boolean;
  createdAt: string;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const navigation = [
  {
    label: "Overview",
    href: "/dashboard/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Menu Approvals",
    href: "/dashboard/admin/menu",
    icon: UtensilsCrossed,
  },
  {
    label: "Users",
    href: "/dashboard/admin/users",
    icon: Users,
  },
  {
    label: "Vendors",
    href: "/dashboard/admin/vendors",
    icon: Store,
  },
  {
    label: "Transactions",
    href: "/dashboard/admin/transactions",
    icon: CreditCard,
  },
  {
    label: "Settings",
    href: "/dashboard/admin/settings",
    icon: Settings,
  },
];

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function AdminDashboardPage() {
  const { data: session, isPending } = authClient.useSession();

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const adminName = session?.user?.name || "Administrator";
  const adminInitial = adminName.charAt(0).toUpperCase();

  const loadDashboard = async () => {
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
        throw new Error(data.message || "Unable to load dashboard.");
      }

      setMenuItems(data.menuItems || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isPending && session?.user?.role === "admin") {
      loadDashboard();
    } else if (!isPending && session?.user) {
      setError("Access denied. Admin account required.");
      setLoading(false);
    } else if (!isPending) {
      setLoading(false);
    }
  }, [isPending, session?.user?.role]);

  const pendingItems = menuItems.filter(
    (item) => item.status === "pending",
  );

  const approvedItems = menuItems.filter(
    (item) => item.status === "approved",
  );

  const rejectedItems = menuItems.filter(
    (item) => item.status === "rejected",
  );

  const stats = [
    {
      title: "Total Menu Items",
      value: menuItems.length,
      description: "All submitted menu items",
      icon: UtensilsCrossed,
      color: "bg-[#E8EEDC] text-[#42634D]",
    },
    {
      title: "Pending Approvals",
      value: pendingItems.length,
      description: "Awaiting your review",
      icon: Clock3,
      color: "bg-[#F5EBD9] text-[#A77938]",
    },
    {
      title: "Approved Items",
      value: approvedItems.length,
      description: "Successfully approved",
      icon: CheckCircle2,
      color: "bg-[#E3EEE5] text-[#42634D]",
    },
    {
      title: "Rejected Items",
      value: rejectedItems.length,
      description: "Not approved",
      icon: XCircle,
      color: "bg-[#F4E3DF] text-[#B65D4E]",
    },
  ];

  const handleLogout = async () => {
    await authClient.signOut();
    window.location.href = "/login";
  };

  if (isPending || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F2EBDD]">
        <div className="text-center">
          <LoaderCircle className="mx-auto mb-3 animate-spin text-[#42634D]" size={34} />
          <p className="text-sm font-medium text-[#706F63]">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!session?.user || session.user.role !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F2EBDD] px-5">
        <div className="max-w-md rounded-3xl bg-white p-9 text-center shadow-sm">
          <ShieldCheck className="mx-auto mb-4 text-[#A77938]" size={44} />
          <h1 className="mb-2 font-serif text-2xl text-[#172B25]">
            Access Restricted
          </h1>
          <p className="mb-6 text-sm text-[#706F63]">
            This area is reserved for authorized administrators.
          </p>
          <Link
            href="/login"
            className="inline-flex rounded-xl bg-[#29483A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#42634D]"
          >
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F3EB] text-[#24352C]">
      {/* Mobile Header */}
      <header className="sticky top-0 z-40 flex h-[72px] items-center justify-between border-b border-[#DED8C9] bg-[#FBF8F1] px-5 lg:hidden">
        <Link href="/" className="font-serif text-2xl font-bold text-[#172B25]">
          Pizza<span className="text-[#C69B62]">Hub.</span>
        </Link>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="rounded-xl p-2 hover:bg-[#F2EBDD]"
          aria-label="Toggle menu"
        >
          <Menu size={23} />
        </button>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 flex w-[270px] flex-col border-r border-[#DED8C9] bg-[#FBF8F1] transition-transform duration-300 lg:translate-x-0 ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          } lg:sticky lg:top-0 lg:h-screen`}
        >
          <div className="flex h-[88px] items-center justify-between border-b border-[#DED8C9] px-7">
            <Link href="/" className="font-serif text-[27px] font-bold tracking-tight text-[#172B25]">
              Pizza<span className="text-[#C69B62]">Hub.</span>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg p-2 hover:bg-[#F2EBDD] lg:hidden"
              aria-label="Close menu"
            >
              <XCircle size={20} />
            </button>
          </div>

          <div className="px-6 pb-5 pt-7">
            <p className="text-[10px] font-bold uppercase tracking-[2px] text-[#A09B8D]">
              Management
            </p>
          </div>

          <nav className="flex-1 space-y-1 px-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = item.href === "/dashboard/admin";

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    active
                      ? "bg-[#29483A] text-white shadow-sm"
                      : "text-[#706F63] hover:bg-[#F2EBDD] hover:text-[#29483A]"
                  }`}
                >
                  <Icon size={19} />
                  {item.label}
                  {item.label === "Menu Approvals" &&
                    pendingItems.length > 0 && (
                      <span className="ml-auto rounded-full bg-[#C69B62] px-2 py-0.5 text-[10px] font-bold text-white">
                        {pendingItems.length}
                      </span>
                    )}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-[#DED8C9] p-5">
            <div className="mb-4 flex items-center gap-3 rounded-xl bg-[#F2EBDD] p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#29483A] font-serif text-lg font-bold text-white">
                {adminInitial}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-[#24352C]">
                  {adminName}
                </p>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#A77938]">
                  Administrator
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-[#A65A4F] transition hover:bg-[#F4E3DF]"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Mobile Overlay */}
        {mobileMenuOpen && (
          <button
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close navigation"
          />
        )}

        {/* Main Content */}
        <main className="min-w-0 flex-1">
          {/* Topbar */}
          <header className="hidden h-[88px] items-center justify-between border-b border-[#DED8C9] bg-[#FBF8F1] px-8 lg:flex xl:px-12">
            <div>
              <p className="text-xs font-medium text-[#9A9587]">
                PizzaHub / Administration
              </p>
              <h1 className="mt-1 font-serif text-xl font-bold text-[#172B25]">
                Dashboard Overview
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={loadDashboard}
                className="rounded-xl border border-[#DED8C9] p-3 text-[#706F63] transition hover:bg-[#F2EBDD]"
                aria-label="Refresh dashboard"
              >
                <RefreshCw size={18} />
              </button>

              <button
                className="relative rounded-xl border border-[#DED8C9] p-3 text-[#706F63] hover:bg-[#F2EBDD]"
                aria-label="Notifications"
              >
                <Bell size={18} />
                {pendingItems.length > 0 && (
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#C69B62]" />
                )}
              </button>

              <div className="flex items-center gap-3 border-l border-[#DED8C9] pl-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#29483A] font-serif font-bold text-white">
                  {adminInitial}
                </div>
                <div>
                  <p className="text-sm font-bold text-[#24352C]">
                    {adminName}
                  </p>
                  <p className="text-[11px] text-[#A77938]">
                    Super Administrator
                  </p>
                </div>
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-[1500px] px-5 py-8 sm:px-8 lg:px-10 xl:px-12">
            {/* Welcome */}
            <section className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#D8C7A8] bg-[#F5EBD9] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[1.5px] text-[#94703E]">
                  <ShieldCheck size={13} />
                  Administration Panel
                </div>

                <h2 className="font-serif text-3xl font-bold tracking-tight text-[#172B25] sm:text-4xl">
                  Welcome back, {adminName.split(" ")[0]}.
                </h2>

                <p className="mt-2 max-w-xl text-sm leading-6 text-[#858173]">
                  Here is what is happening with your PizzaHub platform today.
                </p>
              </div>

              <Link
                href="/dashboard/admin/menu"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#29483A] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#42634D]"
              >
                Review Menu Items
                <ArrowUpRight size={17} />
              </Link>
            </section>

            {/* Error */}
            {error && (
              <div className="mb-6 rounded-xl border border-[#E6C5BD] bg-[#F9EAE6] p-4 text-sm text-[#A65A4F]">
                {error}
                <button
                  onClick={loadDashboard}
                  className="ml-3 font-bold underline"
                >
                  Try again
                </button>
              </div>
            )}

            {/* Statistics */}
            <section className="mb-9 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <div
                    key={stat.title}
                    className="rounded-2xl border border-[#E5DFD2] bg-[#FBF8F1] p-5 shadow-[0_3px_15px_rgba(36,53,44,0.025)] transition hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="mb-5 flex items-center justify-between">
                      <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.color}`}>
                        <Icon size={21} />
                      </div>
                      <ArrowUpRight size={17} className="text-[#B7B0A0]" />
                    </div>

                    <p className="text-sm font-medium text-[#858173]">
                      {stat.title}
                    </p>
                    <h3 className="mt-1 font-serif text-3xl font-bold text-[#172B25]">
                      {stat.value}
                    </h3>
                    <p className="mt-2 text-xs text-[#A09B8D]">
                      {stat.description}
                    </p>
                  </div>
                );
              })}
            </section>

            {/* Main Grid */}
            <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr_1fr]">
              {/* Recent Submissions */}
              <div className="overflow-hidden rounded-2xl border border-[#E5DFD2] bg-[#FBF8F1]">
                <div className="flex flex-col justify-between gap-3 border-b border-[#E5DFD2] p-5 sm:flex-row sm:items-center sm:px-6">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#172B25]">
                      Recent Submissions
                    </h3>
                    <p className="mt-1 text-xs text-[#938E80]">
                      Latest menu items submitted by vendors
                    </p>
                  </div>

                  <Link
                    href="/dashboard/admin/menu"
                    className="text-xs font-bold text-[#A77938] transition hover:text-[#29483A]"
                  >
                    View all items →
                  </Link>
                </div>

                {loading ? (
                  <div className="flex justify-center py-12">
                    <LoaderCircle className="animate-spin text-[#42634D]" size={25} />
                  </div>
                ) : menuItems.length === 0 ? (
                  <div className="px-6 py-12 text-center">
                    <UtensilsCrossed className="mx-auto mb-3 text-[#B8B1A1]" size={30} />
                    <p className="text-sm font-medium text-[#706F63]">
                      No menu submissions yet.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-[#EDE8DD]">
                    {menuItems.slice(0, 5).map((item) => (
                      <div
                        key={item._id}
                        className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#E8EEDC]">
                            {item.image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <UtensilsCrossed size={21} className="text-[#71866B]" />
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-[#24352C]">
                              {item.name}
                            </p>
                            <p className="mt-1 truncate text-xs text-[#938E80]">
                              {item.category} · ৳{item.price} · {formatDate(item.createdAt)}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`w-fit shrink-0 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider ${
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
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="space-y-6">
                <div className="rounded-2xl border border-[#E5DFD2] bg-[#FBF8F1] p-6">
                  <h3 className="font-serif text-xl font-bold text-[#172B25]">
                    Quick Actions
                  </h3>
                  <p className="mt-1 text-xs text-[#938E80]">
                    Manage your platform efficiently
                  </p>

                  <div className="mt-6 space-y-3">
                    <Link
                      href="/dashboard/admin/menu"
                      className="flex items-center gap-4 rounded-xl border border-[#E5DFD2] p-4 transition hover:border-[#C69B62] hover:bg-[#F8F3E8]"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5EBD9] text-[#A77938]">
                        <UtensilsCrossed size={19} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-[#29483A]">
                          Review Menu Items
                        </p>
                        <p className="mt-1 text-xs text-[#938E80]">
                          Approve or reject submissions
                        </p>
                      </div>
                      <span className="rounded-full bg-[#F5EBD9] px-2.5 py-1 text-xs font-bold text-[#A77938]">
                        {pendingItems.length}
                      </span>
                    </Link>

                    <Link
                      href="/dashboard/admin/users"
                      className="flex items-center gap-4 rounded-xl border border-[#E5DFD2] p-4 transition hover:border-[#C69B62] hover:bg-[#F8F3E8]"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8EEDC] text-[#42634D]">
                        <Users size={19} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-[#29483A]">
                          Manage Users
                        </p>
                        <p className="mt-1 text-xs text-[#938E80]">
                          Manage customer accounts
                        </p>
                      </div>
                      <ArrowUpRight size={17} className="text-[#A09B8D]" />
                    </Link>

                    <Link
                      href="/dashboard/admin/vendors"
                      className="flex items-center gap-4 rounded-xl border border-[#E5DFD2] p-4 transition hover:border-[#C69B62] hover:bg-[#F8F3E8]"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E9E6F0] text-[#77709B]">
                        <Store size={19} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-[#29483A]">
                          Manage Vendors
                        </p>
                        <p className="mt-1 text-xs text-[#938E80]">
                          View restaurant accounts
                        </p>
                      </div>
                      <ArrowUpRight size={17} className="text-[#A09B8D]" />
                    </Link>

                    <Link
                      href="/dashboard/admin/transactions"
                      className="flex items-center gap-4 rounded-xl border border-[#E5DFD2] p-4 transition hover:border-[#C69B62] hover:bg-[#F8F3E8]"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E3EEE5] text-[#42634D]">
                        <CreditCard size={19} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-[#29483A]">
                          Transactions
                        </p>
                        <p className="mt-1 text-xs text-[#938E80]">
                          Review payment records
                        </p>
                      </div>
                      <ArrowUpRight size={17} className="text-[#A09B8D]" />
                    </Link>
                  </div>
                </div>

                {/* Pending Notice */}
                <div className="relative overflow-hidden rounded-2xl bg-[#29483A] p-6 text-white">
                  <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full border-[20px] border-white/5" />
                  <div className="relative">
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                      <Clock3 size={21} className="text-[#D9B77E]" />
                    </div>

                    <p className="text-xs font-bold uppercase tracking-[1.5px] text-[#D9B77E]">
                      Requires Attention
                    </p>
                    <h3 className="mt-2 font-serif text-3xl font-bold">
                      {pendingItems.length} Pending
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-white/65">
                      Menu items are waiting for your review. Keep the platform quality consistent.
                    </p>

                    <Link
                      href="/dashboard/admin/menu"
                      className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#C69B62] px-4 py-2.5 text-xs font-bold text-[#172B25] transition hover:bg-[#D9B77E]"
                    >
                      Review Now
                      <ArrowUpRight size={15} />
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            <footer className="mt-10 border-t border-[#DED8C9] py-6 text-center text-xs text-[#A09B8D]">
              © {new Date().getFullYear()} PizzaHub. Crafted with Passion. Delivered with Love.
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
