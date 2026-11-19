
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

function PizzaDetailsContent() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;
  const role = user?.role || "customer";

  const [pizza, setPizza] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [orderMessage, setOrderMessage] = useState("");

  // Fetch pizza details from the backend
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

  // Check whether the visitor came from the Order Now button
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);

    if (searchParams.get("order") === "true") {
      setOrderMessage("Please review your pizza before placing an order.");
    }
  }, []);

  // Handle Order button
  const handleOrder = () => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (role === "customer") {
      setOrderMessage(
        "Your pizza is selected! The order placement system will be connected in the next step.",
      );
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

            {/* Order Button: Visitor and Customer only */}
            {!isPending && (!user || role === "customer") && (
              <div className="mt-8">
                <button
                  onClick={handleOrder}
                  className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#29483A] px-7 py-4 text-base font-bold text-white shadow-md transition hover:bg-[#172B25]"
                >
                  <ShoppingBag size={20} />
                  Order Now
                </button>

                {orderMessage && (
                  <div className="mt-4 rounded-xl border border-[#DED8C9] bg-white p-4 text-sm leading-6 text-[#42634D]">
                    {orderMessage}
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