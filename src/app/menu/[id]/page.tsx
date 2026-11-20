
"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ShoppingBag,
  MapPin,
  Pizza,
  Store,
  LoaderCircle,
  CheckCircle2,
  AlertCircle,
  Minus,
  Plus,
  X,
  CalendarDays,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

type MenuItem = {
  _id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  status: "approved" | "pending" | "rejected";
  isAvailable: boolean;
  vendor?: {
    name: string;
    restaurantName: string;
    restaurantAddress: string;
  };
};

// Get today's date using the user's local calendar date
const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

function PizzaDetailsContent() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;
  const role = user?.role || "customer";

  const [pizza, setPizza] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showOrderForm, setShowOrderForm] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryDate, setDeliveryDate] = useState(getTodayDate);
  const [specialInstructions, setSpecialInstructions] = useState("");

  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [orderSuccess, setOrderSuccess] = useState("");

  const totalPrice = pizza ? Number(pizza.price) * quantity : 0;

  // Fetch pizza details
  useEffect(() => {
    const fetchPizzaDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`/api/menu/public/${params.id}`, {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Unable to load pizza details.");
        }

        setPizza(data.menuItem);
      } catch (err) {
        console.error("Pizza Details Error:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while loading this pizza.",
        );
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchPizzaDetails();
    }
  }, [params.id]);

  // Open order form when arriving from Order Now
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);

    if (searchParams.get("order") === "true") {
      setShowOrderForm(true);
    }
  }, []);

  // Handle Order button
  const handleOrder = () => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (role === "customer") {
      setOrderError("");
      setOrderSuccess("");
      setShowOrderForm(true);
    }
  };

  // Submit order
  const handlePlaceOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user || role !== "customer") {
      router.push("/login");
      return;
    }

    if (!pizza) return;

    try {
      setPlacingOrder(true);
      setOrderError("");
      setOrderSuccess("");

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          menuItemId: pizza._id,
          quantity,
          phoneNumber,
          deliveryAddress,
          deliveryDate,
          specialInstructions,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to place your order.");
      }

      setOrderSuccess(
        `Your order has been placed successfully for ${deliveryDate}! The restaurant will review your order shortly.`,
      );

      setQuantity(1);
      setPhoneNumber("");
      setDeliveryAddress("");
      setDeliveryDate(getTodayDate());
      setSpecialInstructions("");
      setShowOrderForm(false);
    } catch (err) {
      console.error("Place Order Error:", err);

      setOrderError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  // Loading State
  if (loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#FBF8F1]">
        <div className="text-center">
          <LoaderCircle
            size={40}
            className="mx-auto animate-spin text-[#42634D]"
          />
          <p className="mt-4 text-sm font-medium text-[#706F63]">
            Loading pizza details...
          </p>
        </div>
      </main>
    );
  }

  // Error State
  if (error || !pizza) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#FBF8F1] px-5">
        <div className="max-w-md rounded-2xl border border-[#DED8C9] bg-white p-8 text-center shadow-sm">
          <AlertCircle size={45} className="mx-auto text-red-500" />

          <h1 className="mt-5 font-serif text-2xl font-bold text-[#172B25]">
            Pizza Not Found
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#706F63]">
            {error || "This pizza may have been removed or is unavailable."}
          </p>

          <Link
            href="/menu"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#29483A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#172B25]"
          >
            <ArrowLeft size={17} />
            Back to Menu
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FBF8F1] text-[#24352C]">
      {/* Breadcrumb */}
      <section className="mx-auto max-w-7xl px-5 pt-8 sm:px-8 lg:px-10">
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#42634D] transition hover:text-[#C69B62]"
        >
          <ArrowLeft size={17} />
          Back to Our Menu
        </Link>
      </section>

      {/* Pizza Details */}
      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10 lg:py-16">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Pizza Image */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-[#DED8C9] bg-[#E8E5D9] shadow-lg">
            {pizza.image ? (
              <Image
                src={pizza.image}
                alt={pizza.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Pizza size={80} className="text-[#71866B]" />
              </div>
            )}

            <span className="absolute left-5 top-5 rounded-full bg-[#FBF8F1] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#29483A] shadow">
              {pizza.category}
            </span>
          </div>

          {/* Pizza Information */}
          <div className="flex flex-col">
            <span className="text-xs font-bold uppercase tracking-[3px] text-[#C69B62]">
              Freshly Crafted
            </span>

            <h1 className="mt-3 font-serif text-4xl font-bold leading-tight text-[#172B25] sm:text-5xl">
              {pizza.name}
            </h1>

            <p className="mt-5 text-3xl font-bold text-[#42634D]">
              ${Number(pizza.price).toFixed(2)}
            </p>

            <div className="my-7 h-px bg-[#DED8C9]" />

            <h2 className="font-serif text-xl font-bold text-[#172B25]">
              About This Pizza
            </h2>

            <p className="mt-3 text-sm leading-8 text-[#706F63] sm:text-base">
              {pizza.description}
            </p>

            {/* Availability */}
            <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-[#42634D]">
              <CheckCircle2 size={18} />
              Available to Order
            </div>

            {/* Restaurant Information */}
            {pizza.vendor && (
              <div className="mt-8 rounded-2xl border border-[#DED8C9] bg-[#F2EBDD] p-5">
                <div className="flex items-center gap-2">
                  <Store size={20} className="text-[#42634D]" />

                  <h2 className="font-serif text-lg font-bold text-[#172B25]">
                    Restaurant Information
                  </h2>
                </div>

                <p className="mt-4 text-base font-bold text-[#29483A]">
                  {pizza.vendor.restaurantName || "PizzaHub Restaurant"}
                </p>

                {pizza.vendor.name && (
                  <p className="mt-2 text-sm text-[#706F63]">
                    Managed by {pizza.vendor.name}
                  </p>
                )}

                {pizza.vendor.restaurantAddress && (
                  <div className="mt-3 flex items-start gap-2 text-sm leading-6 text-[#706F63]">
                    <MapPin size={17} className="mt-1 shrink-0" />
                    <span>{pizza.vendor.restaurantAddress}</span>
                  </div>
                )}
              </div>
            )}

            {/* Order Button */}
            {!isPending && (!user || role === "customer") && (
              <div className="mt-8">
                {!showOrderForm && (
                  <button
                    onClick={handleOrder}
                    className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#29483A] px-7 py-4 text-base font-bold text-white shadow-md transition hover:bg-[#172B25]"
                  >
                    <ShoppingBag size={20} />
                    Order Now
                  </button>
                )}

                {/* Order Form */}
                {showOrderForm && (
                  <div className="rounded-2xl border border-[#DED8C9] bg-white p-5 shadow-sm sm:p-7">
                    <div className="mb-6 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-[2px] text-[#C69B62]">
                          Almost There
                        </span>

                        <h2 className="mt-1 font-serif text-2xl font-bold text-[#172B25]">
                          Complete Your Order
                        </h2>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setShowOrderForm(false);
                          setOrderError("");
                        }}
                        className="rounded-full p-2 text-[#706F63] transition hover:bg-[#F2EBDD]"
                        aria-label="Close order form"
                      >
                        <X size={20} />
                      </button>
                    </div>

                    <form onSubmit={handlePlaceOrder} className="space-y-5">
                      {/* Quantity */}
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-[#29483A]">
                          Quantity
                        </label>

                        <div className="flex w-fit items-center overflow-hidden rounded-xl border border-[#DED8C9]">
                          <button
                            type="button"
                            onClick={() =>
                              setQuantity((previous) =>
                                Math.max(1, previous - 1),
                              )
                            }
                            disabled={quantity <= 1}
                            className="p-3 text-[#29483A] transition hover:bg-[#F2EBDD] disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={17} />
                          </button>

                          <span className="min-w-12 text-center font-bold text-[#172B25]">
                            {quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              setQuantity((previous) =>
                                Math.min(20, previous + 1),
                              )
                            }
                            disabled={quantity >= 20}
                            className="p-3 text-[#29483A] transition hover:bg-[#F2EBDD] disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label="Increase quantity"
                          >
                            <Plus size={17} />
                          </button>
                        </div>
                      </div>

                      {/* Delivery Date */}
                      <div>
                        <label
                          htmlFor="order-delivery-date"
                          className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#29483A]"
                        >
                          <CalendarDays size={17} />
                          Delivery Date *
                        </label>

                        <input
                          id="order-delivery-date"
                          type="date"
                          required
                          min={getTodayDate()}
                          value={deliveryDate}
                          onChange={(e) => setDeliveryDate(e.target.value)}
                          className="w-full rounded-xl border border-[#DED8C9] bg-[#FBF8F1] px-4 py-3 text-sm text-[#24352C] outline-none transition focus:border-[#71866B] focus:ring-2 focus:ring-[#71866B]/20"
                        />

                        <p className="mt-1.5 text-xs text-[#8A887C]">
                          Choose today or a future date for your delivery.
                        </p>
                      </div>

                      {/* Phone Number */}
                      <div>
                        <label
                          htmlFor="order-phone"
                          className="mb-2 block text-sm font-semibold text-[#29483A]"
                        >
                          Phone Number *
                        </label>

                        <input
                          id="order-phone"
                          type="tel"
                          required
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="01XXXXXXXXX"
                          className="w-full rounded-xl border border-[#DED8C9] bg-[#FBF8F1] px-4 py-3 text-sm text-[#24352C] outline-none transition placeholder:text-[#A5A092] focus:border-[#71866B] focus:ring-2 focus:ring-[#71866B]/20"
                        />

                        <p className="mt-1.5 text-xs text-[#8A887C]">
                          Enter a valid Bangladeshi mobile number.
                        </p>
                      </div>

                      {/* Delivery Address */}
                      <div>
                        <label
                          htmlFor="order-address"
                          className="mb-2 block text-sm font-semibold text-[#29483A]"
                        >
                          Delivery Address *
                        </label>

                        <textarea
                          id="order-address"
                          required
                          minLength={10}
                          maxLength={300}
                          rows={3}
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                          placeholder="House, Road, Area, City..."
                          className="w-full resize-y rounded-xl border border-[#DED8C9] bg-[#FBF8F1] px-4 py-3 text-sm text-[#24352C] outline-none transition placeholder:text-[#A5A092] focus:border-[#71866B] focus:ring-2 focus:ring-[#71866B]/20"
                        />
                      </div>

                      {/* Special Instructions */}
                      <div>
                        <label
                          htmlFor="order-instructions"
                          className="mb-2 block text-sm font-semibold text-[#29483A]"
                        >
                          Special Instructions{" "}
                          <span className="font-normal text-[#8A887C]">
                            (Optional)
                          </span>
                        </label>

                        <textarea
                          id="order-instructions"
                          rows={2}
                          maxLength={500}
                          value={specialInstructions}
                          onChange={(e) =>
                            setSpecialInstructions(e.target.value)
                          }
                          placeholder="Any special requests for your order?"
                          className="w-full resize-y rounded-xl border border-[#DED8C9] bg-[#FBF8F1] px-4 py-3 text-sm text-[#24352C] outline-none transition placeholder:text-[#A5A092] focus:border-[#71866B] focus:ring-2 focus:ring-[#71866B]/20"
                        />
                      </div>

                      {/* Total */}
                      <div className="rounded-xl bg-[#F2EBDD] p-4">
                        <div className="flex items-center justify-between text-sm text-[#706F63]">
                          <span>
                            ${Number(pizza.price).toFixed(2)} × {quantity}
                          </span>

                          <span className="font-semibold text-[#29483A]">
                            ${totalPrice.toFixed(2)}
                          </span>
                        </div>

                        <div className="my-3 h-px bg-[#DED8C9]" />

                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#172B25]">
                            Total Amount
                          </span>

                          <span className="text-2xl font-bold text-[#42634D]">
                            ${totalPrice.toFixed(2)}
                          </span>
                        </div>

                        <p className="mt-2 text-xs text-[#8A887C]">
                          Your pizza will be scheduled for the selected
                          delivery date.
                        </p>
                      </div>

                      {/* Error */}
                      {orderError && (
                        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                          <AlertCircle size={18} className="mt-0.5 shrink-0" />
                          <p>{orderError}</p>
                        </div>
                      )}

                      {/* Submit */}
                      <button
                        type="submit"
                        disabled={placingOrder}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#29483A] px-6 py-4 text-sm font-bold text-white shadow-md transition hover:bg-[#172B25] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {placingOrder ? (
                          <>
                            <LoaderCircle size={19} className="animate-spin" />
                            Placing Your Order...
                          </>
                        ) : (
                          <>
                            <ShoppingBag size={19} />
                            Place Order · ${totalPrice.toFixed(2)}
                          </>
                        )}
                      </button>

                      <p className="text-center text-xs text-[#8A887C]">
                        Please review your delivery information before placing
                        your order.
                      </p>
                    </form>
                  </div>
                )}

                {/* Order Success */}
                {orderSuccess && (
                  <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2
                        size={22}
                        className="mt-0.5 shrink-0 text-green-700"
                      />

                      <div>
                        <h3 className="font-bold text-green-800">
                          Order Placed Successfully!
                        </h3>

                        <p className="mt-1 text-sm leading-6 text-green-700">
                          {orderSuccess}
                        </p>

                        <Link
                          href="/dashboard/customer"
                          className="mt-3 inline-block text-sm font-bold text-green-800 underline underline-offset-4"
                        >
                          Go to Customer Dashboard
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

                <p className="mt-3 text-center text-xs text-[#706F63]">
                  Crafted with Passion. Delivered with Love.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default function PizzaDetailsPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-[70vh] items-center justify-center bg-[#FBF8F1]">
          <div className="text-center">
            <LoaderCircle
              size={40}
              className="mx-auto animate-spin text-[#42634D]"
            />
            <p className="mt-4 text-sm font-medium text-[#706F63]">
              Loading pizza details...
            </p>
          </div>
        </main>
      }
    >
      <PizzaDetailsContent />
    </Suspense>
  );
}
