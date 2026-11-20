
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  PackageCheck,
  Pizza,
  ShoppingBag,
  XCircle,
} from "lucide-react";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { authClient } from "@/lib/auth-client";

type OrderStatus = "pending" | "accepted" | "rejected" | "cancelled";

type CustomerOrder = {
  _id: string;
  pizzaName: string;
  pizzaImage: string;
  quantity: number;
  totalPrice: number;
  status: OrderStatus;
  restaurantName: string;
  createdAt: string;
  deliveryDate?: string;
};

// Format YYYY-MM-DD without timezone shifting.
function formatDeliveryDate(date?: string) {
  if (!date) return "Not specified";

  const [year, month, day] = date.split("-").map(Number);

  if (!year || !month || !day) return "Not specified";

  return new Date(year, month - 1, day).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const statusStyles: Record<OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-700",
  accepted: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  cancelled: "bg-gray-100 text-gray-600",
};

export default function CustomerOrdersPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;
  const role = user?.role || "customer";

  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

  const fetchOrders = useCallback(async () => {
    try {
      setError("");

      const response = await fetch("/api/orders/my", {
        credentials: "include",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to load your orders.");
      }

      setOrders(data.orders || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isPending && user && role === "customer") {
      fetchOrders();
    }
  }, [isPending, user, role, fetchOrders]);

  const handleCancelOrder = async (orderId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?",
    );

    if (!confirmed) return;

    try {
      setCancellingId(orderId);
      setError("");
      setSuccess("");

      const response = await fetch(`/api/orders/${orderId}/cancel`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to cancel this order.");
      }

      setSuccess("Your order has been cancelled successfully.");
      await fetchOrders();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to cancel order.");
    } finally {
      setCancellingId(null);
    }
  };

  if (isPending || !user || role !== "customer") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FBF8F1]">
        <div className="text-center">
          <Pizza className="mx-auto animate-pulse text-[#42634D]" size={42} />
          <p className="mt-4 text-sm font-medium text-[#706F63]">
            Loading your orders...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FBF8F1] text-[#24352C]">
      <Navbar />

      <section className="mx-auto min-h-[70vh] max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
        {/* Page Heading */}
        <div className="mb-8">
          <Link
            href="/dashboard/customer"
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#71866B] transition hover:text-[#172B25]"
          >
            <ArrowLeft size={17} />
            Back to Dashboard
          </Link>

          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[2px] text-[#C69B62]">
                Your PizzaHub Activity
              </p>

              <h1 className="mt-2 font-serif text-3xl font-bold text-[#172B25] sm:text-4xl">
                My Orders
              </h1>

              <p className="mt-3 text-sm leading-6 text-[#858174]">
                Track your orders and manage your pizza deliveries.
              </p>
            </div>

            <Link
              href="/menu"
              className="inline-flex w-fit items-center gap-2 rounded-full bg-[#29483A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#172B25]"
            >
              <ShoppingBag size={17} />
              Explore Menu
            </Link>
          </div>
        </div>

        {/* Order Count */}
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-[#DED8C9] bg-white p-5 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8EDE5] text-[#42634D]">
            <PackageCheck size={22} />
          </div>

          <div>
            <p className="text-xs text-[#858174]">Total Orders</p>
            <p className="text-xl font-bold text-[#172B25]">
              {orders.length}
            </p>
          </div>
        </div>

        {/* Feedback Messages */}
        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <XCircle size={19} className="mt-0.5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700">
            {success}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="rounded-2xl border border-[#DED8C9] bg-white px-5 py-16 text-center">
            <Pizza className="mx-auto animate-pulse text-[#42634D]" size={38} />
            <p className="mt-4 text-sm font-medium text-[#706F63]">
              Loading your order history...
            </p>
          </div>
        ) : orders.length === 0 ? (
          /* Empty State */
          <div className="rounded-2xl border border-dashed border-[#DED8C9] bg-white px-5 py-16 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#E8EDE5] text-[#42634D]">
              <PackageCheck size={38} strokeWidth={1.5} />
            </div>

            <h2 className="mt-6 font-serif text-2xl font-bold text-[#172B25]">
              No Orders Yet
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#858174]">
              You haven't placed any orders yet. Explore our menu and discover
              your favorite handcrafted pizza.
            </p>

            <Link
              href="/menu"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#29483A] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#172B25]"
            >
              Browse Our Menu
              <ArrowRight size={17} />
            </Link>
          </div>
        ) : (
          /* Orders List */
          <div className="space-y-5">
            {orders.map((order) => (
              <article
                key={order._id}
                className="overflow-hidden rounded-2xl border border-[#DED8C9] bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6"
              >
                <div className="flex flex-col gap-5 sm:flex-row">
                  {/* Pizza Image */}
                  <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-xl bg-[#F2EBDD] sm:h-28 sm:w-32">
                    {order.pizzaImage ? (
                      <Image
                        src={order.pizzaImage}
                        alt={order.pizzaName}
                        fill
                        sizes="(max-width: 640px) 100vw, 128px"
                        unoptimized
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[#42634D]">
                        <Pizza size={38} />
                      </div>
                    )}
                  </div>

                  {/* Order Details */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col justify-between gap-3 sm:flex-row">
                      <div>
                        <h2 className="font-serif text-xl font-bold text-[#172B25]">
                          {order.pizzaName}
                        </h2>

                        <p className="mt-1 text-sm text-[#858174]">
                          {order.restaurantName}
                        </p>
                      </div>

                      <span
                        className={`h-fit w-fit rounded-full px-3 py-1.5 text-xs font-bold capitalize ${
                          statusStyles[order.status] || statusStyles.pending
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>

                    {/* Order Information */}
                    <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                      <div>
                        <p className="text-xs text-[#858174]">Quantity</p>
                        <p className="mt-1 text-sm font-bold text-[#29483A]">
                          {order.quantity}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-[#858174]">Total Price</p>
                        <p className="mt-1 text-sm font-bold text-[#29483A]">
                          ৳{Number(order.totalPrice).toFixed(2)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-[#858174]">Order Date</p>
                        <p className="mt-1 text-sm font-bold text-[#29483A]">
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-GB",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </p>
                      </div>

                      {/* Delivery Date */}
                      <div>
                        <p className="text-xs text-[#858174]">Delivery Date</p>

                        <p className="mt-1 flex items-center gap-1.5 text-sm font-bold text-[#29483A]">
                          <CalendarDays
                            size={15}
                            className="shrink-0 text-[#C69B62]"
                          />
                          {formatDeliveryDate(order.deliveryDate)}
                        </p>
                      </div>
                    </div>

                    {/* Cancel Button */}
                    {order.status === "pending" && (
                      <div className="mt-5 border-t border-[#DED8C9] pt-4">
                        <button
                          type="button"
                          onClick={() => handleCancelOrder(order._id)}
                          disabled={cancellingId === order._id}
                          className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-xs font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <XCircle size={16} />
                          {cancellingId === order._id
                            ? "Cancelling..."
                            : "Cancel Order"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#42634D] transition hover:text-[#172B25]"
          >
            Want something delicious? Explore more pizzas
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
