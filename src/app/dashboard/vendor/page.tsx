
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import VendorSidebar from "@/components/dashboard/VendorSidebar";
import {
  ShoppingBag,
  TrendingUp,
  Clock,
  CheckCircle2,
  Package,
  ArrowUpRight,
  Plus,
  Eye,
  RefreshCw,
  Store,
  UtensilsCrossed,
  CreditCard,
} from "lucide-react";

type OrderStatus = "pending" | "accepted" | "rejected" | "cancelled";

type VendorOrder = {
  _id: string;
  customerName: string;
  pizzaName: string;
  quantity: number;
  totalPrice: number;
  status: OrderStatus;
  createdAt: string;
};

type MenuItem = {
  _id: string;
  name: string;
  category: string;
  price: number;
  status: "pending" | "approved" | "rejected";
  isAvailable: boolean;
};

type Subscription = {
  plan: "free" | "premium";
  isPremium: boolean;
  activeItems: number;
  freePlanLimit: number;
};

const statusStyles: Record<string, string> = {
  pending: "bg-[#F8EBD2] text-[#9A6A20]",
  accepted: "bg-[#E4EDE3] text-[#42634D]",
  rejected: "bg-[#F5E2DF] text-[#A34D43]",
  cancelled: "bg-gray-100 text-gray-600",
  approved: "bg-[#E4EDE3] text-[#42634D]",
};

const formatPrice = (price: number) => {
  return `৳${Number(price || 0).toLocaleString("en-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function VendorDashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;
  const vendorName = user?.name || "Vendor";
  const vendorInitial = vendorName.charAt(0).toUpperCase();
  const role = user?.role || "customer";

  const [orders, setOrders] = useState<VendorOrder[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [ordersResponse, menuResponse] = await Promise.all([
        fetch("/api/orders/vendor", {
          credentials: "include",
          cache: "no-store",
        }),
        fetch("/api/menu", {
          credentials: "include",
          cache: "no-store",
        }),
      ]);

      const [ordersData, menuData] = await Promise.all([
        ordersResponse.json(),
        menuResponse.json(),
      ]);

      if (!ordersResponse.ok || !ordersData.success) {
        throw new Error(
          ordersData.message || "Unable to load restaurant orders."
        );
      }

      if (!menuResponse.ok || !menuData.success) {
        throw new Error(
          menuData.message || "Unable to load restaurant menu."
        );
      }

      setOrders(ordersData.orders || []);
      setMenuItems(menuData.menuItems || []);
      setSubscription(menuData.subscription || null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load dashboard information."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isPending) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (role !== "vendor") {
      router.replace(
        role === "admin" ? "/dashboard/admin" : "/dashboard/customer"
      );
      return;
    }

    fetchDashboardData();
  }, [isPending, user, role, router, fetchDashboardData]);

  if (isPending || !user || role !== "vendor") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F7F5EF]">
        <div className="text-center">
          <Store className="mx-auto animate-pulse text-[#42634D]" size={40} />
          <p className="mt-4 text-sm font-medium text-[#706F63]">
            Preparing your restaurant dashboard...
          </p>
        </div>
      </main>
    );
  }

  const pendingOrders = orders.filter(
    (order) => order.status === "pending"
  ).length;

  const acceptedOrders = orders.filter(
    (order) => order.status === "accepted"
  );

  const acceptedOrderValue = acceptedOrders.reduce(
    (total, order) => total + Number(order.totalPrice || 0),
    0
  );

  const activeMenuItems =
    subscription?.activeItems ??
    menuItems.filter(
      (item) => item.status === "approved" && item.isAvailable
    ).length;

  const planName = subscription?.plan || "free";
  const isPremium = planName === "premium";

  const stats = [
    {
      title: "Total Orders",
      value: orders.length,
      change: "All customer orders",
      icon: ShoppingBag,
    },
    {
      title: "Accepted Order Value",
      value: formatPrice(acceptedOrderValue),
      change: "Accepted orders only",
      icon: TrendingUp,
    },
    {
      title: "Active Menu Items",
      value: activeMenuItems,
      change: isPremium ? "Premium Plan" : `Free Plan · ${activeMenuItems}/3`,
      icon: UtensilsCrossed,
    },
    {
      title: "Pending Orders",
      value: pendingOrders,
      change: pendingOrders > 0 ? "Needs attention" : "All caught up",
      icon: Clock,
    },
  ];

  const recentOrders = orders.slice(0, 3);
  const latestMenuItems = menuItems.slice(0, 3);

  return (
    <main className="min-h-screen bg-[#F7F5EF] text-[#24352C]">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <VendorSidebar />

        {/* Main Content */}
        <section className="min-w-0 flex-1">
          {/* Topbar */}
          <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#DED8C9] bg-[#FBF8F1] px-5 py-5 sm:px-8">
            <div>
              <p className="text-xs font-medium text-[#8A887B]">
                WORKSPACE / OVERVIEW
              </p>
              <h1 className="mt-1 text-xl font-bold text-[#172B25] sm:text-2xl">
                Restaurant Overview
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <span className="rounded-full border border-[#D9C7A7] bg-[#F4EBDD] px-3 py-1.5 text-xs font-semibold capitalize text-[#8B683A]">
                {isPremium ? "Premium Plan" : "Free Plan"}
              </span>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#29483A] text-sm font-bold text-white">
                {isPending ? "..." : vendorInitial}
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-7xl space-y-8 p-5 sm:p-8">
            {/* Welcome */}
            <div className="flex flex-col justify-between gap-5 rounded-2xl bg-[#29483A] p-6 text-white sm:flex-row sm:items-center sm:p-8">
              <div>
                <p className="text-sm text-white/65">
                  WELCOME BACK, {vendorName.toUpperCase()}
                </p>

                <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                  Your restaurant, your success.
                </h2>

                <p className="mt-2 max-w-lg text-sm leading-6 text-white/70">
                  Manage your menu, track incoming orders and keep your
                  restaurant running smoothly.
                </p>
              </div>

              <Link
                href="/dashboard/vendor/menu"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#C69B62] px-5 py-3 text-sm font-bold text-[#172B25] transition hover:bg-[#D5B27E]"
              >
                <Plus size={17} /> Add Menu Item
              </Link>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex flex-col justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 sm:flex-row sm:items-center">
                <p>{error}</p>
                <button
                  type="button"
                  onClick={fetchDashboardData}
                  className="inline-flex shrink-0 items-center gap-2 font-bold hover:underline"
                >
                  <RefreshCw size={15} />
                  Try Again
                </button>
              </div>
            )}

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <div
                    key={stat.title}
                    className="rounded-2xl border border-[#DED8C9] bg-[#FBF8F1] p-5"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-[#777568]">{stat.title}</p>

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAEDE5] text-[#42634D]">
                        <Icon size={19} />
                      </div>
                    </div>

                    <h3 className="mt-4 text-2xl font-bold text-[#172B25]">
                      {loading ? "..." : stat.value}
                    </h3>

                    <p className="mt-1 text-xs text-[#71866B]">
                      {stat.change}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Content Grid */}
            <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
              {/* Recent Orders */}
              <div className="overflow-hidden rounded-2xl border border-[#DED8C9] bg-[#FBF8F1]">
                <div className="flex items-center justify-between border-b border-[#DED8C9] px-5 py-5">
                  <div>
                    <h3 className="font-bold text-[#172B25]">Recent Orders</h3>
                    <p className="mt-1 text-xs text-[#8A887B]">
                      Your latest customer orders
                    </p>
                  </div>

                  <Link
                    href="/dashboard/vendor/orders"
                    className="flex items-center gap-1 text-xs font-semibold text-[#42634D] hover:text-[#172B25]"
                  >
                    View All <ArrowUpRight size={14} />
                  </Link>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[650px] text-left text-sm">
                    <thead className="bg-[#F3F0E7] text-xs text-[#777568]">
                      <tr>
                        <th className="px-5 py-3 font-semibold">ORDER</th>
                        <th className="px-5 py-3 font-semibold">CUSTOMER</th>
                        <th className="px-5 py-3 font-semibold">AMOUNT</th>
                        <th className="px-5 py-3 font-semibold">STATUS</th>
                      </tr>
                    </thead>

                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan={4} className="px-5 py-10 text-center text-sm text-[#929082]">
                            Loading recent orders...
                          </td>
                        </tr>
                      ) : recentOrders.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-5 py-10 text-center text-sm text-[#929082]">
                            No orders received yet.
                          </td>
                        </tr>
                      ) : (
                        recentOrders.map((order) => (
                          <tr
                            key={order._id}
                            className="border-t border-[#EAE5D9]"
                          >
                            <td className="px-5 py-4">
                              <p className="font-semibold text-[#29483A]">
                                #{order._id.slice(-6).toUpperCase()}
                              </p>
                              <p className="mt-1 text-xs text-[#929082]">
                                {order.pizzaName} × {order.quantity}
                              </p>
                            </td>

                            <td className="px-5 py-4">
                              <p className="font-medium">
                                {order.customerName}
                              </p>
                              <p className="mt-1 text-xs text-[#929082]">
                                {formatDate(order.createdAt)}
                              </p>
                            </td>

                            <td className="px-5 py-4 font-semibold">
                              {formatPrice(order.totalPrice)}
                            </td>

                            <td className="px-5 py-4">
                              <span
                                className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                                  statusStyles[order.status] ||
                                  "bg-gray-100 text-gray-600"
                                }`}
                              >
                                {order.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Menu Overview */}
              <div className="rounded-2xl border border-[#DED8C9] bg-[#FBF8F1]">
                <div className="flex items-center justify-between border-b border-[#DED8C9] px-5 py-5">
                  <div>
                    <h3 className="font-bold text-[#172B25]">Menu Overview</h3>
                    <p className="mt-1 text-xs text-[#8A887B]">
                      Your latest menu items
                    </p>
                  </div>

                  <Link
                    href="/dashboard/vendor/menu"
                    className="text-xs font-semibold text-[#42634D] hover:text-[#172B25]"
                  >
                    Manage
                  </Link>
                </div>

                <div className="space-y-4 p-5">
                  {loading ? (
                    <p className="py-8 text-center text-sm text-[#929082]">
                      Loading menu items...
                    </p>
                  ) : latestMenuItems.length === 0 ? (
                    <div className="py-8 text-center">
                      <Package
                        size={30}
                        className="mx-auto text-[#71866B]"
                      />
                      <p className="mt-3 text-sm text-[#929082]">
                        No menu items yet.
                      </p>
                      <Link
                        href="/dashboard/vendor/menu"
                        className="mt-3 inline-block text-xs font-bold text-[#42634D] hover:underline"
                      >
                        Add your first item
                      </Link>
                    </div>
                  ) : (
                    latestMenuItems.map((item) => (
                      <div
                        key={item._id}
                        className="flex items-center justify-between gap-3"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EAEDE5] text-[#42634D]">
                            <Package size={18} />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-[#29483A]">
                              {item.name}
                            </p>
                            <p className="mt-1 text-xs text-[#929082]">
                              {item.category}
                            </p>
                          </div>
                        </div>

                        <div className="shrink-0 text-right">
                          <p className="text-sm font-bold">
                            {formatPrice(item.price)}
                          </p>
                          <p
                            className={`mt-1 text-[10px] font-semibold capitalize ${
                              item.status === "approved" && !item.isAvailable
                                ? "text-gray-500"
                                : item.status === "approved"
                                  ? "text-[#56805A]"
                                  : item.status === "pending"
                                    ? "text-[#B1843E]"
                                    : "text-[#A34D43]"
                            }`}
                          >
                            {item.status === "approved" && !item.isAvailable
                              ? "Unavailable"
                              : item.status}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Cards */}
            <div className="grid gap-5 md:grid-cols-2">
              <div className="flex items-center justify-between gap-4 rounded-2xl border border-[#DED8C9] bg-[#FBF8F1] p-5">
                <div>
                  <div className="flex items-center gap-2 text-[#42634D]">
                    <CheckCircle2 size={18} />
                    <p className="text-sm font-bold">Restaurant Profile</p>
                  </div>

                  <p className="mt-2 text-xs text-[#777568]">
                    Keep your restaurant information up to date.
                  </p>

                  <Link
                    href="/dashboard/vendor/profile"
                    className="mt-3 inline-block text-xs font-bold text-[#42634D] hover:underline"
                  >
                    Update Profile →
                  </Link>
                </div>

                <Store size={38} className="shrink-0 text-[#C69B62]" />
              </div>

              <div className="flex items-center justify-between gap-4 rounded-2xl border border-[#DED8C9] bg-[#FBF8F1] p-5">
                <div>
                  <div className="flex items-center gap-2 text-[#42634D]">
                    <CreditCard size={18} />
                    <p className="text-sm font-bold">Subscription Plan</p>
                  </div>

                  <p className="mt-2 text-xs text-[#777568]">
                    You are currently using the {planName} plan.
                  </p>

                  <Link
                    href="/dashboard/vendor/subscription"
                    className="mt-3 inline-block text-xs font-bold text-[#42634D] hover:underline"
                  >
                    View Plans →
                  </Link>
                </div>

                <Eye size={38} className="shrink-0 text-[#C69B62]" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
