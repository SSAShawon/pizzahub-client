"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ShoppingBag,
  Clock3,
  CheckCircle2,
  Heart,
  ArrowRight,
  Pizza,
  MapPin,
  UserRound,
  Mail,
  Sparkles,
  UtensilsCrossed,
  PackageCheck,
  ChevronRight,
  Plus,
  LogOut,
} from "lucide-react";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { authClient } from "@/lib/auth-client";
import { messageFromError, notify } from "@/lib/toast";

export default function CustomerDashboard() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;
  const role = user?.role || "customer";
  type CustomerOrder = {
    _id: string;
    pizzaName: string;
    pizzaImage: string;
    quantity: number;
    totalPrice: number;
    status: "pending" | "accepted" | "rejected" | "cancelled";
    restaurantName: string;
    createdAt: string;
  };

  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (isPending || !user || role !== "customer") return;

    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders/my", {
          credentials: "include",
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Unable to load orders.");
        }

        setOrders(data.orders || []);
      } catch (error) {
        console.error("Customer Orders Error:", error);
        notify.error(
          messageFromError(error, "Unable to load orders."),
          "customer-dashboard-orders",
        );
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, [user, role, isPending]);

  useEffect(() => {
    if (isPending) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (role === "vendor") {
      router.replace("/dashboard/vendor");
    } else if (role === "admin") {
      router.replace("/dashboard/admin");
    }
  }, [user, role, isPending, router]);

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      notify.success("You have been signed out.", "sign-out");
      router.push("/login");
    } catch (error) {
      notify.error(
        messageFromError(error, "Unable to sign out. Please try again."),
        "sign-out-error",
      );
    }
  };

  if (isPending || !user || role !== "customer") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FBF8F1]">
        <div className="text-center">
          <Pizza className="mx-auto animate-pulse text-[#42634D]" size={42} />
          <p className="mt-4 text-sm font-medium text-[#706F63]">
            Preparing your dashboard...
          </p>
        </div>
      </main>
    );
  }

  const firstName = user.name?.trim().split(" ")[0] || "Food Lover";

  const pendingOrders = orders.filter(
    (order) => order.status === "pending",
  ).length;

  const acceptedOrders = orders.filter(
    (order) => order.status === "accepted",
  ).length;

  const stats = [
    {
      label: "Total Orders",
      value: String(orders.length),
      icon: ShoppingBag,
      description: "Your order history",
    },
    {
      label: "Pending Orders",
      value: String(pendingOrders),
      icon: Clock3,
      description: "Waiting for confirmation",
    },
    {
      label: "Accepted Orders",
      value: String(acceptedOrders),
      icon: CheckCircle2,
      description: "Confirmed by restaurants",
    },
    {
      label: "My Favorites",
      value: "0",
      icon: Heart,
      description: "Your favorite pizzas",
    },
  ];

  return (
    <main className="min-h-screen bg-[#FBF8F1] text-[#24352C]">
      <Navbar />

      {/* Dashboard Content */}
      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
        {/* Welcome Section */}
        <div className="relative overflow-hidden rounded-3xl bg-[#172B25] px-6 py-8 text-white shadow-xl sm:px-10 sm:py-10">
          <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full border-[35px] border-white/5" />
          <div className="pointer-events-none absolute -bottom-32 right-36 h-64 w-64 rounded-full border-[35px] border-[#C69B62]/10" />

          <div className="relative z-10 flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#C69B62]/30 bg-white/5 px-4 py-2 text-xs font-semibold tracking-wider text-[#E0BD8A]">
                <Sparkles size={14} />
                CUSTOMER DASHBOARD
              </div>

              <h1 className="font-serif text-3xl font-bold sm:text-4xl lg:text-5xl">
                Welcome back, {firstName}!
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-7 text-white/65 sm:text-base">
                Your next delicious moment is just a few clicks away. Explore
                our handcrafted pizzas and make every meal special.
              </p>

              <Link
                href="/menu"
                className="mt-7 inline-flex items-center gap-3 rounded-full bg-[#C69B62] px-6 py-3.5 text-sm font-bold text-[#172B25] transition hover:bg-[#E0BD8A]"
              >
                <UtensilsCrossed size={18} />
                Explore Our Menu
                <ArrowRight size={17} />
              </Link>
            </div>

            <div className="hidden shrink-0 md:block">
              <div className="flex h-36 w-36 items-center justify-center rounded-full border border-[#C69B62]/30 bg-white/5">
                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[#29483A]">
                  <Pizza
                    size={62}
                    className="text-[#E0BD8A]"
                    strokeWidth={1.2}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="mt-9">
          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-[2px] text-[#C69B62]">
              Your Activity
            </p>
            <h2 className="mt-2 font-serif text-2xl font-bold text-[#172B25]">
              Dashboard Overview
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-[#DED8C9] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8EDE5] text-[#42634D]">
                      <Icon size={21} />
                    </div>
                    <span className="text-2xl font-bold tabular-nums text-[#172B25]">
                      {stat.value}
                    </span>
                  </div>

                  <h3 className="mt-5 text-sm font-bold text-[#29483A]">
                    {stat.label}
                  </h3>
                  <p className="mt-1 text-xs text-[#858174]">
                    {stat.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="mt-10 grid grid-cols-1 gap-7 lg:grid-cols-3">
          {/* Recent Orders */}
          {/* Recent Orders */}
          <div className="rounded-2xl border border-[#DED8C9] bg-white p-6 shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[2px] text-[#C69B62]">
                  Order Activity
                </p>
                <h2 className="mt-2 font-serif text-xl font-bold text-[#172B25]">
                  Recent Orders
                </h2>
              </div>

              <span className="rounded-full bg-[#E8EDE5] px-3 py-1.5 text-xs font-semibold text-[#42634D]">
                {orders.length} Orders
              </span>
            </div>

            {ordersLoading ? (
              <div className="mt-7 flex items-center justify-center rounded-2xl bg-[#FBF8F1] px-5 py-12">
                <p className="text-sm font-medium text-[#706F63]">
                  Loading your orders...
                </p>
              </div>
            ) : orders.length === 0 ? (
              <div className="mt-7 flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#DED8C9] bg-[#FBF8F1] px-5 py-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#E8EDE5] text-[#42634D]">
                  <PackageCheck size={31} strokeWidth={1.5} />
                </div>

                <h3 className="mt-5 font-serif text-lg font-bold text-[#172B25]">
                  No Orders Yet
                </h3>

                <p className="mt-2 max-w-sm text-sm leading-6 text-[#858174]">
                  Your delicious journey starts here. Browse our menu and
                  discover your new favorite pizza.
                </p>

                <Link
                  href="/menu"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#29483A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#172B25]"
                >
                  Order Your First Pizza
                  <ArrowRight size={16} />
                </Link>
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {orders.slice(0, 3).map((order) => (
                  <div
                    key={order._id}
                    className="flex flex-col gap-4 rounded-xl border border-[#DED8C9] p-4 sm:flex-row sm:items-center"
                  >
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#F2EBDD]">
                      {order.pizzaImage ? (
                        <Image
                          src={order.pizzaImage}
                          alt={order.pizzaName}
                          width={80}
                          height={80}
                          unoptimized
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[#42634D]">
                          <Pizza size={30} />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-[#29483A]">
                        {order.pizzaName}
                      </h3>

                      <p className="mt-1 text-xs text-[#858174]">
                        {order.restaurantName} · Quantity: {order.quantity}
                      </p>

                      <p className="mt-2 text-sm font-bold text-[#172B25]">
                        ৳{Number(order.totalPrice).toFixed(2)}
                      </p>

                      <p className="mt-1 text-xs text-[#858174]">
                        {new Date(order.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>

                    <span
                      className={`w-fit rounded-full px-3 py-1.5 text-xs font-bold capitalize ${
                        order.status === "pending"
                          ? "bg-amber-100 text-amber-700"
                          : order.status === "accepted"
                            ? "bg-green-100 text-green-700"
                            : order.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="rounded-2xl border border-[#DED8C9] bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[2px] text-[#C69B62]">
              Quick Navigation
            </p>

            <h2 className="mt-2 font-serif text-xl font-bold text-[#172B25]">
              Quick Actions
            </h2>

            <div className="mt-6 space-y-3">
              <Link
                href="/menu"
                className="group flex items-center gap-3 rounded-xl border border-[#DED8C9] p-4 transition hover:border-[#71866B] hover:bg-[#FBF8F1]"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E8EDE5] text-[#42634D]">
                  <Pizza size={20} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-[#29483A]">
                    Browse Menu
                  </p>
                  <p className="mt-1 text-xs text-[#858174]">
                    Discover delicious pizzas
                  </p>
                </div>

                <ChevronRight
                  size={18}
                  className="text-[#858174] transition group-hover:translate-x-1"
                />
              </Link>

              <div className="flex cursor-not-allowed items-center gap-3 rounded-xl border border-[#DED8C9] p-4 opacity-70">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F2EBDD] text-[#A08050]">
                  <ShoppingBag size={20} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-[#29483A]">My Orders</p>
                  <p className="mt-1 text-xs text-[#858174]">
                    Order history coming soon
                  </p>
                </div>

                <Clock3 size={17} className="text-[#A08050]" />
              </div>

              <div className="flex cursor-not-allowed items-center gap-3 rounded-xl border border-[#DED8C9] p-4 opacity-70">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F8E8E9] text-[#B66D78]">
                  <Heart size={20} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-[#29483A]">
                    My Favorites
                  </p>
                  <p className="mt-1 text-xs text-[#858174]">
                    Favorite collection coming soon
                  </p>
                </div>

                <Clock3 size={17} className="text-[#A08050]" />
              </div>
            </div>

            <div className="mt-6 rounded-xl bg-[#172B25] p-5 text-white">
              <Sparkles size={20} className="text-[#C69B62]" />
              <h3 className="mt-3 font-serif text-lg font-bold">
                Made for Pizza Lovers
              </h3>
              <p className="mt-2 text-xs leading-6 text-white/60">
                Crafted with Passion. Delivered with Love.
              </p>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="mt-9 rounded-2xl border border-[#DED8C9] bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[2px] text-[#C69B62]">
                Personal Information
              </p>
              <h2 className="mt-2 font-serif text-2xl font-bold text-[#172B25]">
                My Account
              </h2>
              <p className="mt-2 text-sm text-[#858174]">
                Your account details and membership information.
              </p>
            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E8EDE5] text-[#42634D]">
              <UserRound size={27} />
            </div>
          </div>

          <div className="mt-7 grid grid-cols-1 gap-5 border-t border-[#DED8C9] pt-6 sm:grid-cols-2">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E8EDE5] text-[#42634D]">
                <UserRound size={19} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-[#858174]">Full Name</p>
                <p className="mt-1 truncate text-sm font-bold text-[#29483A]">
                  {user.name || "Not provided"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F2EBDD] text-[#A08050]">
                <Mail size={19} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-[#858174]">Email Address</p>
                <p className="mt-1 truncate text-sm font-bold text-[#29483A]">
                  {user.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E8EDE5] text-[#42634D]">
                <CheckCircle2 size={19} />
              </div>
              <div>
                <p className="text-xs text-[#858174]">Account Type</p>
                <p className="mt-1 text-sm font-bold capitalize text-[#29483A]">
                  {role}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F2EBDD] text-[#A08050]">
                <MapPin size={19} />
              </div>
              <div>
                <p className="text-xs text-[#858174]">Membership</p>
                <p className="mt-1 text-sm font-bold text-[#29483A]">
                  PizzaHub Customer
                </p>
              </div>
            </div>
          </div>

          <div className="mt-7 flex flex-col justify-between gap-4 border-t border-[#DED8C9] pt-6 sm:flex-row sm:items-center">
            <p className="text-xs leading-5 text-[#858174]">
              Thank you for being part of the PizzaHub community.
            </p>

            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
            >
              <LogOut size={17} />
              Sign Out
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
