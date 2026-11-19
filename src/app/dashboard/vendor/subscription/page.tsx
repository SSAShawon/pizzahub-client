"use client";

import { useEffect, useState } from "react";
import {
  Store,
  Check,
  Crown,
  Sparkles,
  Infinity,
  LoaderCircle,
  AlertCircle,
  CalendarDays,
  ArrowUpRight,
  ShieldCheck,
  TrendingUp,
  Zap,
} from "lucide-react";

import VendorSidebar from "@/components/dashboard/VendorSidebar";

type Subscription = {
  plan: string;
  isPremium: boolean;
  expiresAt: string | null;
  activeItems: number;
  freePlanLimit: number;
};

const premiumFeatures = [
  "Unlimited active menu items",
  "Priority restaurant visibility",
  "Advanced order analytics",
  "Premium restaurant badge",
  "More room to grow your menu",
  "Premium subscription management",
];

const freeFeatures = [
  "Up to 3 active menu items",
  "Standard restaurant visibility",
  "Basic order management",
  "Standard restaurant listing",
];

export default function VendorSubscriptionPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/menu", {
          credentials: "include",
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load subscription information.",
          );
        }

        if (!data.subscription) {
          throw new Error("Subscription information was not found.");
        }

        setSubscription(data.subscription);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, []);

  const isPremium = subscription?.isPremium ?? false;
  const activeItems = subscription?.activeItems ?? 0;
  const freePlanLimit = subscription?.freePlanLimit ?? 3;

  const usagePercentage =
    freePlanLimit > 0 ? Math.min((activeItems / freePlanLimit) * 100, 100) : 0;

  const expiryDate = subscription?.expiresAt
    ? new Date(subscription.expiresAt).toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="min-h-screen bg-[#F2EBDD] text-[#24352C]">
      <div className="flex min-h-screen max-w-[1600px] flex-col lg:flex-row">
        <VendorSidebar />

        {/* Main Content */}
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-10">
          {/* Header */}
          <div className="mb-8">
            <p className="mb-2 text-xs font-bold uppercase tracking-[2px] text-[#71866B]">
              Account & Billing
            </p>

            <h1 className="text-2xl font-bold tracking-tight text-[#172B25] sm:text-3xl">
              Subscription Plans
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-[#706F63]">
              Choose the right plan for your restaurant and unlock more
              opportunities to grow your business.
            </p>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex min-h-[350px] flex-col items-center justify-center gap-3">
              <LoaderCircle size={30} className="animate-spin text-[#42634D]" />
              <p className="text-sm text-[#706F63]">
                Loading subscription details...
              </p>
            </div>
          ) : error ? (
            <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
              <AlertCircle size={20} className="mt-0.5 shrink-0" />
              <p>{error}</p>
            </div>
          ) : subscription ? (
            <div className="mx-auto max-w-6xl space-y-8">
              {/* Current Plan */}
              <section className="rounded-2xl border border-[#DED8C9] bg-[#FBF8F1] p-5 shadow-sm sm:p-7">
                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                        isPremium
                          ? "bg-[#C69B62]/15 text-[#A77A42]"
                          : "bg-[#42634D]/10 text-[#42634D]"
                      }`}
                    >
                      {isPremium ? <Crown size={27} /> : <Store size={27} />}
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[1.5px] text-[#999487]">
                        Your Current Plan
                      </p>

                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <h2 className="text-xl font-bold text-[#172B25]">
                          {isPremium ? "Premium Plan" : "Free Plan"}
                        </h2>

                        <span
                          className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                            isPremium
                              ? "bg-[#C69B62]/15 text-[#956C34]"
                              : "bg-[#42634D]/10 text-[#42634D]"
                          }`}
                        >
                          {isPremium ? "Premium Member" : "Active"}
                        </span>
                      </div>

                      <p className="mt-1 text-sm text-[#706F63]">
                        {isPremium
                          ? "Enjoy your premium restaurant benefits."
                          : "You are currently using the free subscription."}
                      </p>
                    </div>
                  </div>

                  {isPremium && expiryDate && (
                    <div className="rounded-xl border border-[#DED8C9] bg-white/60 px-4 py-3">
                      <p className="text-xs text-[#999487]">
                        Subscription Expires
                      </p>

                      <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-[#29483A]">
                        <CalendarDays size={16} />
                        {expiryDate}
                      </p>
                    </div>
                  )}
                </div>

                {/* Usage */}
                {!isPremium && (
                  <div className="mt-7 border-t border-[#DED8C9] pt-6">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-bold text-[#29483A]">
                          Menu Item Usage
                        </p>
                        <p className="mt-1 text-xs text-[#706F63]">
                          Your free plan allows up to {freePlanLimit} active
                          items.
                        </p>
                      </div>

                      <p className="text-sm font-bold tabular-nums text-[#29483A]">
                        {activeItems} / {freePlanLimit}
                      </p>
                    </div>

                    <div className="h-2.5 overflow-hidden rounded-full bg-[#E8E2D5]">
                      <div
                        className="h-full rounded-full bg-[#42634D] transition-all"
                        style={{ width: `${usagePercentage}%` }}
                      />
                    </div>

                    {activeItems >= freePlanLimit && (
                      <p className="mt-3 flex items-center gap-2 text-xs font-medium text-[#A77A42]">
                        <AlertCircle size={15} />
                        You have reached your free plan menu limit.
                      </p>
                    )}
                  </div>
                )}
              </section>

              {/* Plans Heading */}
              <div className="text-center">
                <p className="mb-2 text-xs font-bold uppercase tracking-[2px] text-[#A77A42]">
                  Simple & Transparent Pricing
                </p>

                <h2 className="text-2xl font-bold text-[#172B25] sm:text-3xl">
                  Choose Your Growth Plan
                </h2>

                <p className="mt-2 text-sm text-[#706F63]">
                  Start free and upgrade whenever your restaurant is ready.
                </p>
              </div>

              {/* Pricing Cards */}
              <div className="grid gap-5 lg:grid-cols-2">
                {/* Free Plan */}
                <div className="flex flex-col rounded-2xl border border-[#DED8C9] bg-[#FBF8F1] p-6 shadow-sm sm:p-8">
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#42634D]/10 text-[#42634D]">
                      <Store size={22} />
                    </div>

                    {!isPremium && (
                      <span className="rounded-full bg-[#42634D]/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#42634D]">
                        Current Plan
                      </span>
                    )}
                  </div>

                  <h3 className="mt-6 text-xl font-bold text-[#172B25]">
                    Free
                  </h3>

                  <p className="mt-2 text-sm text-[#706F63]">
                    Everything you need to get started.
                  </p>

                  <div className="my-6 flex items-baseline gap-1">
                    <span className="text-4xl font-bold tracking-tight text-[#172B25]">
                      $0
                    </span>
                    <span className="text-sm text-[#999487]">/ forever</span>
                  </div>

                  <div className="mb-6 h-px bg-[#DED8C9]" />

                  <p className="mb-4 text-xs font-bold uppercase tracking-wider text-[#71866B]">
                    What's Included
                  </p>

                  <ul className="flex-1 space-y-4">
                    {freeFeatures.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-3 text-sm text-[#706F63]"
                      >
                        <Check
                          size={17}
                          className="mt-0.5 shrink-0 text-[#42634D]"
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8">
                    <div className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#DED8C9] bg-[#F2EBDD] px-5 py-3.5 text-sm font-semibold text-[#42634D]">
                      {isPremium ? "Free Plan" : "Your Current Plan"}
                      {!isPremium && <Check size={17} />}
                    </div>
                  </div>
                </div>

                {/* Premium Plan */}
                <div className="relative flex flex-col overflow-hidden rounded-2xl border border-[#42634D] bg-[#172B25] p-6 text-white shadow-xl sm:p-8">
                  {/* Decorative Background */}
                  <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#C69B62]/10 blur-3xl" />

                  <div className="relative flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#C69B62]/15 text-[#D6B47C]">
                      <Crown size={23} />
                    </div>

                    <span className="rounded-full bg-[#C69B62] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#172B25]">
                      Best Value
                    </span>
                  </div>

                  <h3 className="relative mt-6 text-xl font-bold">Premium</h3>

                  <p className="relative mt-2 text-sm text-white/60">
                    More freedom, more visibility, more growth.
                  </p>

                  <div className="relative my-6 flex items-baseline gap-1">
                    <span className="text-4xl font-bold tracking-tight">
                      $10
                    </span>
                    <span className="text-sm text-white/55">/ month</span>
                  </div>

                  <div className="relative mb-6 h-px bg-white/15" />

                  <p className="relative mb-4 text-xs font-bold uppercase tracking-wider text-[#C69B62]">
                    Everything in Free, plus
                  </p>

                  <ul className="relative flex-1 space-y-4">
                    {premiumFeatures.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-3 text-sm text-white/80"
                      >
                        <span className="mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-[#C69B62]/20 text-[#D6B47C]">
                          <Check size={12} />
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="relative mt-8">
                    {isPremium ? (
                      <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#C69B62]/15 px-5 py-3.5 text-sm font-semibold text-[#E5C996]">
                        <ShieldCheck size={18} />
                        Your Premium Plan
                      </div>
                    ) : (
                      <button
                        type="button"
                        disabled
                        title="Premium upgrades will be available soon."
                        className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-[#C69B62] px-5 py-3.5 text-sm font-bold text-[#172B25] opacity-80"
                      >
                        <Sparkles size={17} />
                        Upgrade to Premium
                        <ArrowUpRight size={17} />
                      </button>
                    )}

                    <p className="mt-3 text-center text-[11px] text-white/45">
                      {isPremium
                        ? "Thank you for being a Premium member."
                        : "Premium checkout will be available soon."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Benefits Section */}
              <section className="rounded-2xl border border-[#DED8C9] bg-[#FBF8F1] p-6 sm:p-8">
                <div className="mb-6">
                  <p className="mb-2 text-xs font-bold uppercase tracking-[2px] text-[#71866B]">
                    Why Go Premium?
                  </p>

                  <h2 className="text-xl font-bold text-[#172B25]">
                    Built for Growing Restaurants
                  </h2>

                  <p className="mt-2 text-sm text-[#706F63]">
                    Give your restaurant more room to grow with premium tools
                    and benefits.
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="rounded-xl bg-[#F2EBDD] p-5">
                    <Infinity size={23} className="text-[#42634D]" />
                    <h3 className="mt-3 text-sm font-bold text-[#29483A]">
                      Unlimited Menu
                    </h3>
                    <p className="mt-2 text-xs leading-5 text-[#706F63]">
                      Add as many active menu items as your restaurant needs.
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#F2EBDD] p-5">
                    <TrendingUp size={23} className="text-[#42634D]" />
                    <h3 className="mt-3 text-sm font-bold text-[#29483A]">
                      Better Visibility
                    </h3>
                    <p className="mt-2 text-xs leading-5 text-[#706F63]">
                      Get priority visibility to help more customers discover
                      your restaurant.
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#F2EBDD] p-5">
                    <Zap size={23} className="text-[#42634D]" />
                    <h3 className="mt-3 text-sm font-bold text-[#29483A]">
                      Advanced Insights
                    </h3>
                    <p className="mt-2 text-xs leading-5 text-[#706F63]">
                      Understand your restaurant's order performance with
                      advanced analytics.
                    </p>
                  </div>
                </div>
              </section>

              {/* Footer Note */}
              <div className="flex items-start gap-3 rounded-xl border border-[#DED8C9] bg-[#FBF8F1] p-4">
                <ShieldCheck
                  size={19}
                  className="mt-0.5 shrink-0 text-[#71866B]"
                />

                <p className="text-xs leading-5 text-[#706F63]">
                  Your subscription status and menu limits are verified by
                  PizzaHub's server. Premium upgrades and secure billing will be
                  enabled when payment integration is ready.
                </p>
              </div>
            </div>
          ) : null}
        </main>
      </div>
    </div>
  );
}
