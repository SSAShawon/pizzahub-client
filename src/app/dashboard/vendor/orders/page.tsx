
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import VendorSidebar from "@/components/dashboard/VendorSidebar";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Eye,
  Filter,
  Mail,
  MapPin,
  Package,
  Phone,
  RefreshCw,
  ShoppingBag,
  Store,
  XCircle,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

type OrderStatus = "pending" | "accepted" | "rejected" | "cancelled";
type FilterStatus = "all" | OrderStatus;

type VendorOrder = {
  _id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  pizzaName: string;
  pizzaImage: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  specialInstructions: string;
  status: OrderStatus;
  createdAt: string;
};

const filters: { label: string; value: FilterStatus }[] = [
  { label: "All Orders", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Accepted", value: "accepted" },
  { label: "Rejected", value: "rejected" },
  { label: "Cancelled", value: "cancelled" },
];

const statusStyles: Record<OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-700",
  accepted: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  cancelled: "bg-gray-100 text-gray-600",
};

export default function VendorOrdersPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;
  const role = user?.role || "customer";
  const vendorName = user?.name || "Vendor";

  const [orders, setOrders] = useState<VendorOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<VendorOrder | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (isPending) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (role === "customer") {
      router.replace("/dashboard/customer");
    } else if (role === "admin") {
      router.replace("/dashboard/admin");
    }
  }, [user, role, isPending, router]);

  const fetchOrders = useCallback(async () => {
    try {
      setError("");

      const response = await fetch("/api/orders/vendor", {
        credentials: "include",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to load restaurant orders.");
      }

      setOrders(data.orders || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isPending && user && role === "vendor") {
      fetchOrders();
    }
  }, [isPending, user, role, fetchOrders]);

  const handleStatusUpdate = async (
    orderId: string,
    newStatus: "accepted" | "rejected"
  ) => {
    const action = newStatus === "accepted" ? "accept" : "reject";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} this order?`
    );

    if (!confirmed) return;

    try {
      setUpdatingId(orderId);
      setError("");
      setSuccess("");

      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || `Unable to ${action} order.`);
      }

      setSuccess(
        newStatus === "accepted"
          ? "Order accepted successfully."
          : "Order rejected successfully."
      );

      setSelectedOrder(null);
      await fetchOrders();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update order."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  if (isPending || !user || role !== "vendor") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F7F5EF]">
        <div className="text-center">
          <Store className="mx-auto animate-pulse text-[#42634D]" size={40} />
          <p className="mt-4 text-sm font-medium text-[#706F63]">
            Preparing your restaurant orders...
          </p>
        </div>
      </main>
    );
  }

  const filteredOrders =
    filter === "all"
      ? orders
      : orders.filter((order) => order.status === filter);

  const pendingCount = orders.filter(
    (order) => order.status === "pending"
  ).length;

  const acceptedCount = orders.filter(
    (order) => order.status === "accepted"
  ).length;

  const totalRevenue = orders
    .filter((order) => order.status === "accepted")
    .reduce((total, order) => total + Number(order.totalPrice || 0), 0);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <main className="min-h-screen bg-[#F7F5EF] text-[#24352C]">
      <div className="flex min-h-screen flex-col lg:flex-row">
        {/* Shared Vendor Sidebar */}
        <VendorSidebar />

        {/* Main Content */}
        <section className="min-w-0 flex-1">
          {/* Topbar */}
          <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#DED8C9] bg-[#FBF8F1] px-5 py-5 sm:px-8">
            <div>
              <p className="text-xs font-medium text-[#8A887B]">
                WORKSPACE / ORDERS
              </p>
              <h1 className="mt-1 text-xl font-bold text-[#172B25] sm:text-2xl">
                Order Management
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <span className="rounded-full border border-[#D9C7A7] bg-[#F4EBDD] px-3 py-1.5 text-xs font-semibold text-[#8B683A]">
                Vendor Account
              </span>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#29483A] text-sm font-bold text-white">
                {vendorName.charAt(0).toUpperCase()}
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-7xl space-y-7 p-5 sm:p-8">
            {/* Welcome */}
            <div className="flex flex-col justify-between gap-5 rounded-2xl bg-[#29483A] p-6 text-white sm:flex-row sm:items-center sm:p-8">
              <div>
                <p className="text-sm text-white/65">
                  WELCOME BACK, {vendorName.toUpperCase()}
                </p>

                <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                  Manage Your Orders.
                </h2>

                <p className="mt-2 max-w-lg text-sm leading-6 text-white/70">
                  Review incoming orders, respond to customers and keep your
                  restaurant running smoothly.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setLoading(true);
                  fetchOrders();
                }}
                disabled={loading}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#C69B62] px-5 py-3 text-sm font-bold text-[#172B25] transition hover:bg-[#D5B27E] disabled:opacity-60"
              >
                <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
                Refresh Orders
              </button>
            </div>

            {/* Statistics */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                {
                  title: "Total Orders",
                  value: orders.length,
                  icon: ShoppingBag,
                  color: "bg-[#EAEDE5] text-[#42634D]",
                },
                {
                  title: "Pending Orders",
                  value: pendingCount,
                  icon: Clock3,
                  color: "bg-[#F8EBD2] text-[#9A6A20]",
                },
                {
                  title: "Accepted Orders",
                  value: acceptedCount,
                  icon: CheckCircle2,
                  color: "bg-[#E4EDE3] text-[#42634D]",
                },
                {
                  title: "Accepted Order Value",
                  value: `৳${totalRevenue.toFixed(2)}`,
                  icon: Package,
                  color: "bg-[#F4EBDD] text-[#A08050]",
                },
              ].map((stat) => {
                const Icon = stat.icon;

                return (
                  <div
                    key={stat.title}
                    className="rounded-2xl border border-[#DED8C9] bg-[#FBF8F1] p-5"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-[#777568]">{stat.title}</p>

                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.color}`}
                      >
                        <Icon size={19} />
                      </div>
                    </div>

                    <h3 className="mt-4 text-2xl font-bold text-[#172B25]">
                      {stat.value}
                    </h3>
                  </div>
                );
              })}
            </div>

            {/* Feedback */}
            {error && (
              <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                <XCircle size={19} className="mt-0.5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {success && (
              <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700">
                {success}
              </div>
            )}

            {/* Filters */}
            <div className="rounded-2xl border border-[#DED8C9] bg-[#FBF8F1] p-5">
              <div className="mb-4 flex items-center gap-2">
                <Filter size={17} className="text-[#42634D]" />
                <h3 className="text-sm font-bold text-[#172B25]">
                  Filter Orders
                </h3>
              </div>

              <div className="flex flex-wrap gap-2">
                {filters.map((item) => {
                  const count =
                    item.value === "all"
                      ? orders.length
                      : orders.filter(
                          (order) => order.status === item.value
                        ).length;

                  return (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setFilter(item.value)}
                      className={`rounded-full px-4 py-2.5 text-xs font-semibold transition ${
                        filter === item.value
                          ? "bg-[#172B25] text-white"
                          : "border border-[#DED8C9] bg-white text-[#706F63] hover:border-[#71866B] hover:text-[#172B25]"
                      }`}
                    >
                      {item.label} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Orders */}
            <div>
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-[#172B25]">
                    {filter === "all"
                      ? "All Orders"
                      : `${filter.charAt(0).toUpperCase()}${filter.slice(1)} Orders`}
                  </h3>
                  <p className="mt-1 text-xs text-[#8A887B]">
                    {filteredOrders.length} order(s) found
                  </p>
                </div>

                <Link
                  href="/dashboard/vendor"
                  className="hidden items-center gap-1 text-xs font-semibold text-[#42634D] hover:text-[#172B25] sm:flex"
                >
                  <ArrowLeft size={14} />
                  Dashboard
                </Link>
              </div>

              {loading ? (
                <div className="rounded-2xl border border-[#DED8C9] bg-[#FBF8F1] px-5 py-16 text-center">
                  <RefreshCw
                    className="mx-auto animate-spin text-[#42634D]"
                    size={32}
                  />
                  <p className="mt-4 text-sm font-medium text-[#706F63]">
                    Loading restaurant orders...
                  </p>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#DED8C9] bg-[#FBF8F1] px-5 py-16 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#EAEDE5] text-[#42634D]">
                    <ShoppingBag size={30} />
                  </div>

                  <h3 className="mt-5 font-bold text-[#172B25]">
                    {filter === "all"
                      ? "No Orders Yet"
                      : `No ${filter} Orders`}
                  </h3>

                  <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#858174]">
                    {filter === "all"
                      ? "When customers order from your restaurant, their orders will appear here."
                      : "There are currently no orders with this status."}
                  </p>

                  {filter !== "all" && (
                    <button
                      type="button"
                      onClick={() => setFilter("all")}
                      className="mt-5 text-sm font-bold text-[#42634D] hover:underline"
                    >
                      View All Orders
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-5">
                  {filteredOrders.map((order) => (
                    <article
                      key={order._id}
                      className="overflow-hidden rounded-2xl border border-[#DED8C9] bg-[#FBF8F1] p-5 shadow-sm transition hover:shadow-md sm:p-6"
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
                              <Package size={38} />
                            </div>
                          )}
                        </div>

                        {/* Details */}
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col justify-between gap-3 sm:flex-row">
                            <div>
                              <h4 className="font-bold text-[#172B25]">
                                {order.pizzaName}
                              </h4>
                              <p className="mt-1 text-xs text-[#858174]">
                                Order ID: {order._id}
                              </p>
                            </div>

                            <span
                              className={`h-fit w-fit rounded-full px-3 py-1.5 text-xs font-bold capitalize ${statusStyles[order.status] || statusStyles.pending}`}
                            >
                              {order.status}
                            </span>
                          </div>

                          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                            <div>
                              <p className="text-xs text-[#858174]">Customer</p>
                              <p className="mt-1 truncate text-sm font-semibold text-[#29483A]">
                                {order.customerName}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs text-[#858174]">Quantity</p>
                              <p className="mt-1 text-sm font-semibold text-[#29483A]">
                                {order.quantity}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs text-[#858174]">Total Amount</p>
                              <p className="mt-1 text-sm font-bold text-[#172B25]">
                                ৳{Number(order.totalPrice).toFixed(2)}
                              </p>
                            </div>
                          </div>

                          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-[#858174]">
                            <span className="inline-flex items-center gap-1.5">
                              <Clock3 size={14} />
                              {formatDate(order.createdAt)}
                            </span>
                          </div>

                          <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-[#EAE5D9] pt-4">
                            <button
                              type="button"
                              onClick={() => setSelectedOrder(order)}
                              className="inline-flex items-center gap-2 rounded-lg border border-[#DED8C9] px-4 py-2.5 text-xs font-bold text-[#42634D] transition hover:bg-[#F0EDE4]"
                            >
                              <Eye size={15} />
                              View Details
                            </button>

                            {order.status === "pending" && (
                              <>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleStatusUpdate(order._id, "accepted")
                                  }
                                  disabled={updatingId === order._id}
                                  className="inline-flex items-center gap-2 rounded-lg bg-[#29483A] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#172B25] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  <CheckCircle2 size={15} />
                                  {updatingId === order._id
                                    ? "Updating..."
                                    : "Accept Order"}
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleStatusUpdate(order._id, "rejected")
                                  }
                                  disabled={updatingId === order._id}
                                  className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-xs font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  <XCircle size={15} />
                                  Reject Order
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="order-details-title"
            className="my-auto w-full max-w-xl rounded-2xl bg-[#FBF8F1] p-6 shadow-2xl sm:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[2px] text-[#C69B62]">
                  Order Information
                </p>
                <h2
                  id="order-details-title"
                  className="mt-2 font-serif text-2xl font-bold text-[#172B25]"
                >
                  Order Details
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                aria-label="Close order details"
                className="rounded-lg p-2 text-[#706F63] transition hover:bg-[#F0EDE4]"
              >
                <XCircle size={22} />
              </button>
            </div>

            <div className="mt-6 space-y-5">
              <div className="flex items-center gap-4">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#F2EBDD]">
                  {selectedOrder.pizzaImage ? (
                    <Image
                      src={selectedOrder.pizzaImage}
                      alt={selectedOrder.pizzaName}
                      fill
                      sizes="80px"
                      unoptimized
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[#42634D]">
                      <Package size={30} />
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-[#29483A]">
                    {selectedOrder.pizzaName}
                  </h3>
                  <p className="mt-1 text-xs text-[#858174]">
                    Quantity: {selectedOrder.quantity}
                  </p>
                  <p className="mt-1 text-sm font-bold text-[#172B25]">
                    ৳{Number(selectedOrder.totalPrice).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-[#DED8C9] p-4">
                <h3 className="mb-4 text-sm font-bold text-[#172B25]">
                  Customer Information
                </h3>

                <div className="space-y-3 text-sm">
                  <p className="flex items-center gap-3 text-[#42634D]">
                    <Store size={16} />
                    {selectedOrder.customerName}
                  </p>

                  <p className="flex items-center gap-3 break-all text-[#706F63]">
                    <Mail size={16} />
                    {selectedOrder.customerEmail}
                  </p>

                  <p className="flex items-center gap-3 text-[#706F63]">
                    <Phone size={16} />
                    {selectedOrder.customerPhone}
                  </p>

                  <p className="flex items-start gap-3 text-[#706F63]">
                    <MapPin size={16} className="mt-0.5 shrink-0" />
                    {selectedOrder.deliveryAddress}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-[#DED8C9] p-4">
                <h3 className="mb-2 text-sm font-bold text-[#172B25]">
                  Special Instructions
                </h3>
                <p className="text-sm leading-6 text-[#706F63]">
                  {selectedOrder.specialInstructions?.trim() ||
                    "No special instructions provided."}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-[#858174]">Order Status</p>
                  <span
                    className={`mt-2 inline-flex rounded-full px-3 py-1.5 text-xs font-bold capitalize ${statusStyles[selectedOrder.status] || statusStyles.pending}`}
                  >
                    {selectedOrder.status}
                  </span>
                </div>

                <div className="text-right">
                  <p className="text-xs text-[#858174]">Order Date</p>
                  <p className="mt-2 text-sm font-semibold text-[#29483A]">
                    {formatDate(selectedOrder.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            {selectedOrder.status === "pending" && (
              <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-[#DED8C9] pt-5">
                <button
                  type="button"
                  onClick={() =>
                    handleStatusUpdate(selectedOrder._id, "rejected")
                  }
                  disabled={updatingId === selectedOrder._id}
                  className="rounded-lg border border-red-200 px-4 py-2.5 text-xs font-bold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                >
                  Reject
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleStatusUpdate(selectedOrder._id, "accepted")
                  }
                  disabled={updatingId === selectedOrder._id}
                  className="rounded-lg bg-[#29483A] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#172B25] disabled:opacity-50"
                >
                  Accept Order
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
