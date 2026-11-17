
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  Heart,
  Package,
  UserRound,
  MapPin,
  ArrowRight,
  LogOut,
  Pizza,
  LayoutDashboard,
} from "lucide-react";

export default function CustomerDashboardPage() {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login");
    router.refresh();
  };

  if (isPending) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#E8E5D9]">
        <p className="font-medium text-[#29483A]">Loading Dashboard...</p>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#E8E5D9] px-4">
        <div className="rounded-2xl bg-[#FBF8F1] p-8 text-center shadow-lg">
          <h1 className="text-2xl font-bold text-[#172B25]">
            Login Required
          </h1>
          <p className="mt-2 text-sm text-[#706F63]">
            Please sign in to access your dashboard.
          </p>
          <Link
            href="/login"
            className="mt-5 inline-block rounded-lg bg-[#29483A] px-6 py-3 font-semibold text-white hover:bg-[#42634D]"
          >
            Sign In
          </Link>
        </div>
      </main>
    );
  }

  if (session.user.role !== "customer") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#E8E5D9] px-4">
        <div className="rounded-2xl bg-[#FBF8F1] p-8 text-center shadow-lg">
          <h1 className="text-2xl font-bold text-[#172B25]">
            Access Denied
          </h1>
          <p className="mt-2 text-sm text-[#706F63]">
            This dashboard is only available to customer accounts.
          </p>
          <Link
            href="/"
            className="mt-5 inline-block rounded-lg bg-[#29483A] px-6 py-3 font-semibold text-white hover:bg-[#42634D]"
          >
            Go Home
          </Link>
        </div>
      </main>
    );
  }

  const userName = session.user.name || "Customer";

  const stats = [
    {
      title: "Total Orders",
      value: "0",
      icon: ShoppingBag,
      description: "All your orders",
    },
    {
      title: "Active Orders",
      value: "0",
      icon: Clock,
      description: "Currently in progress",
    },
    {
      title: "Completed",
      value: "0",
      icon: CheckCircle2,
      description: "Successfully delivered",
    },
  ];

  const quickLinks = [
    {
      title: "Browse Menu",
      description: "Explore our delicious pizzas.",
      icon: Pizza,
      href: "/menu",
    },
    {
      title: "My Orders",
      description: "Track and manage your orders.",
      icon: Package,
      href: "/dashboard/customer/orders",
    },
    {
      title: "My Favorites",
      description: "Your saved favorite pizzas.",
      icon: Heart,
      href: "/dashboard/customer/favorites",
    },
    {
      title: "My Profile",
      description: "Manage your personal information.",
      icon: UserRound,
      href: "/dashboard/customer/profile",
    },
  ];

  return (
    <main className="min-h-screen bg-[#E8E5D9]">
      {/* Header */}
      <header className="border-b border-[#DED8C9] bg-[#FBF8F1]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Link
            href="/"
            className="text-2xl font-bold text-[#172B25]"
          >
            Pizza<span className="text-[#C69B62]">Hub</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="hidden text-sm font-medium text-[#29483A] sm:block">
              {userName}
            </span>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg border border-[#DED8C9] px-4 py-2 text-sm font-medium text-[#29483A] transition hover:bg-[#EEF1E9]"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-10">
        {/* Welcome */}
        <section className="rounded-2xl bg-[#172B25] p-8 text-[#F2EBDD] shadow-lg sm:p-10">
          <div className="flex items-center gap-2 text-sm text-[#C6CDBF]">
            <LayoutDashboard size={16} />
            Customer Dashboard
          </div>

          <h1 className="mt-4 text-3xl font-bold sm:text-4xl">
            Welcome back, {userName}!
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-[#C6CDBF]">
            Your next favorite pizza is just a few clicks away.
            Explore our menu and enjoy freshly crafted pizzas.
          </p>

          <Link
            href="/menu"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#C69B62] px-5 py-3 text-sm font-semibold text-[#172B25] transition hover:bg-[#D5B17F]"
          >
            Explore Menu
            <ArrowRight size={17} />
          </Link>
        </section>

        {/* Statistics */}
        <section className="mt-9">
          <h2 className="text-xl font-bold text-[#172B25]">
            Order Overview
          </h2>

          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.title}
                  className="rounded-xl border border-[#D5D2C5] bg-[#FBF8F1] p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-[#706F63]">
                      {stat.title}
                    </p>
                    <div className="rounded-lg bg-[#EEF1E9] p-3 text-[#42634D]">
                      <Icon size={21} />
                    </div>
                  </div>

                  <p className="mt-5 text-3xl font-bold text-[#172B25]">
                    {stat.value}
                  </p>

                  <p className="mt-1 text-xs text-[#858C7F]">
                    {stat.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Quick Links */}
        <section className="mt-10">
          <h2 className="text-xl font-bold text-[#172B25]">
            Quick Access
          </h2>

          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {quickLinks.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group rounded-xl border border-[#D5D2C5] bg-[#FBF8F1] p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className="rounded-lg bg-[#EEF1E9] p-3 text-[#42634D]">
                      <Icon size={22} />
                    </div>

                    <ArrowRight
                      size={18}
                      className="text-[#858C7F] transition group-hover:translate-x-1 group-hover:text-[#42634D]"
                    />
                  </div>

                  <h3 className="mt-5 font-bold text-[#172B25]">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-5 text-[#706F63]">
                    {item.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Empty Orders */}
        <section className="mt-10 rounded-xl border border-[#D5D2C5] bg-[#FBF8F1] p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#EEF1E9] text-[#42634D]">
            <ShoppingBag size={25} />
          </div>

          <h2 className="mt-4 text-xl font-bold text-[#172B25]">
            No Orders Yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-[#706F63]">
            You haven't placed any orders yet. Discover our menu
            and find your perfect pizza.
          </p>

          <Link
            href="/menu"
            className="mt-5 inline-flex items-center gap-2 font-semibold text-[#42634D] hover:underline"
          >
            Browse Menu
            <ArrowRight size={16} />
          </Link>
        </section>

        {/* Account Information */}
        <section className="mt-10 rounded-xl border border-[#D5D2C5] bg-[#FBF8F1] p-6">
          <div className="flex items-center gap-3">
            <UserRound className="text-[#42634D]" size={22} />
            <h2 className="text-lg font-bold text-[#172B25]">
              Account Information
            </h2>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs text-[#858C7F]">Full Name</p>
              <p className="mt-1 font-medium text-[#24352C]">
                {session.user.name}
              </p>
            </div>

            <div>
              <p className="text-xs text-[#858C7F]">Email Address</p>
              <p className="mt-1 break-all font-medium text-[#24352C]">
                {session.user.email}
              </p>
            </div>

            <div>
              <p className="text-xs text-[#858C7F]">Account Type</p>
              <p className="mt-1 font-medium capitalize text-[#24352C]">
                {session.user.role}
              </p>
            </div>

            <div>
              <p className="text-xs text-[#858C7F]">Account Status</p>
              <p className="mt-1 font-medium text-[#42634D]">
                Active
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
