
"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import {
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingBag,
  Store,
  CreditCard,
  Settings,
  TrendingUp,
  Clock,
  CheckCircle2,
  Package,
  ArrowUpRight,
  Plus,
  Eye,
} from "lucide-react";

const stats = [
  {
    title: "Total Orders",
    value: "128",
    change: "+12.5%",
    icon: ShoppingBag,
  },
  {
    title: "Total Revenue",
    value: "$2,450",
    change: "+8.2%",
    icon: TrendingUp,
  },
  {
    title: "Active Menu Items",
    value: "3",
    change: "Free Plan",
    icon: UtensilsCrossed,
  },
  {
    title: "Pending Orders",
    value: "08",
    change: "Needs attention",
    icon: Clock,
  },
];

const recentOrders = [
  {
    id: "#PH-1028",
    customer: "John Smith",
    item: "Margherita Pizza",
    date: "Nov 18, 2026",
    amount: "$18.00",
    status: "Pending",
  },
  {
    id: "#PH-1027",
    customer: "Emily Johnson",
    item: "Pepperoni Pizza",
    date: "Nov 18, 2026",
    amount: "$22.00",
    status: "Accepted",
  },
  {
    id: "#PH-1026",
    customer: "Michael Brown",
    item: "Four Cheese Pizza",
    date: "Nov 17, 2026",
    amount: "$25.00",
    status: "Rejected",
  },
];

const menuItems = [
  {
    name: "Margherita Pizza",
    category: "Classic Pizza",
    price: "$18.00",
    status: "Approved",
  },
  {
    name: "Pepperoni Pizza",
    category: "Classic Pizza",
    price: "$22.00",
    status: "Approved",
  },
  {
    name: "Four Cheese Pizza",
    category: "Special Pizza",
    price: "$25.00",
    status: "Pending",
  },
];

const navigation = [
  { label: "Overview", href: "/dashboard/vendor", icon: LayoutDashboard },
  { label: "My Menu", href: "/dashboard/vendor/menu", icon: UtensilsCrossed },
  { label: "Orders", href: "/dashboard/vendor/orders", icon: ShoppingBag },
  { label: "Restaurant Profile", href: "/dashboard/vendor/profile", icon: Store },
  { label: "Subscription", href: "/dashboard/vendor/subscription", icon: CreditCard },
  { label: "Settings", href: "/dashboard/vendor/settings", icon: Settings },
];

export default function VendorDashboardPage() {
  const { data: session, isPending } = authClient.useSession();

  const vendorName = session?.user?.name || "Vendor";
  const vendorInitial = vendorName.charAt(0).toUpperCase();

  return (
    <main className="min-h-screen bg-[#F7F5EF] text-[#24352C]">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 border-r border-[#DED8C9] bg-[#FBF8F1] lg:flex lg:flex-col">
          <div className="border-b border-[#DED8C9] px-7 py-7">
            <Link
              href="/"
              className="text-2xl font-bold tracking-tight text-[#172B25]"
            >
              Pizza<span className="text-[#C69B62]">Hub.</span>
            </Link>
            <p className="mt-1 text-xs tracking-[0.18em] text-[#71866B]">
              RESTAURANT PANEL
            </p>
          </div>

          <div className="px-5 py-6">
            <p className="mb-4 px-3 text-[10px] font-bold tracking-[0.2em] text-[#999487]">
              WORKSPACE
            </p>

            <nav className="space-y-1">
              {navigation.map((item, index) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                      index === 0
                        ? "bg-[#172B25] text-white"
                        : "text-[#706F63] hover:bg-[#F0EDE4] hover:text-[#172B25]"
                    }`}
                  >
                    <Icon size={18} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="mt-auto p-5">
            <div className="rounded-2xl bg-[#172B25] p-5 text-white">
              <p className="text-sm font-semibold">Upgrade your plan</p>
              <p className="mt-2 text-xs leading-5 text-white/65">
                Unlock unlimited menu items and grow your restaurant.
              </p>
              <Link
                href="/dashboard/vendor/subscription"
                className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-[#C69B62] px-3 py-2.5 text-xs font-bold text-[#172B25]"
              >
                Explore Premium <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </aside>

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
              <span className="rounded-full border border-[#D9C7A7] bg-[#F4EBDD] px-3 py-1.5 text-xs font-semibold text-[#8B683A]">
                Free Plan
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
                  {isPending
                    ? "WELCOME BACK"
                    : `WELCOME BACK, ${vendorName.toUpperCase()}`}
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
                      {stat.value}
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
                      {recentOrders.map((order) => (
                        <tr
                          key={order.id}
                          className="border-t border-[#EAE5D9]"
                        >
                          <td className="px-5 py-4">
                            <p className="font-semibold text-[#29483A]">
                              {order.id}
                            </p>
                            <p className="mt-1 text-xs text-[#929082]">
                              {order.item}
                            </p>
                          </td>

                          <td className="px-5 py-4">
                            <p className="font-medium">{order.customer}</p>
                            <p className="mt-1 text-xs text-[#929082]">
                              {order.date}
                            </p>
                          </td>

                          <td className="px-5 py-4 font-semibold">
                            {order.amount}
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                order.status === "Pending"
                                  ? "bg-[#F8EBD2] text-[#9A6A20]"
                                  : order.status === "Accepted"
                                    ? "bg-[#E4EDE3] text-[#42634D]"
                                    : "bg-[#F5E2DF] text-[#A34D43]"
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
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
                  {menuItems.map((item) => (
                    <div
                      key={item.name}
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
                        <p className="text-sm font-bold">{item.price}</p>
                        <p
                          className={`mt-1 text-[10px] font-semibold ${
                            item.status === "Approved"
                              ? "text-[#56805A]"
                              : "text-[#B1843E]"
                          }`}
                        >
                          {item.status}
                        </p>
                      </div>
                    </div>
                  ))}
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
                    You are currently using the Free plan.
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
