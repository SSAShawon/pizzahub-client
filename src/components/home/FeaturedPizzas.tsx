
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Flame,
  Leaf,
  ShoppingBag,
  Pizza,
  Store,
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

export default function FeaturedPizzas() {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const role = user?.role || "customer";

  const [pizzas, setPizzas] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch approved and available pizzas
  useEffect(() => {
    const fetchFeaturedPizzas = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/menu/public", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Unable to load featured pizzas.");
        }

        const availablePizzas: MenuItem[] = (data.menuItems || []).filter(
          (item: MenuItem) =>
            item.status === "approved" && item.isAvailable === true,
        );

        setPizzas(availablePizzas.slice(0, 6));
      } catch (err) {
        console.error("Featured Pizzas Error:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while loading pizzas.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedPizzas();
  }, []);

  // Handle Order button
  const handleOrder = (itemId: string) => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (role === "customer") {
      router.push(`/menu/${itemId}?order=true`);
    }
  };

  return (
    <section className="bg-[#FBF8F1] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
      <div className="mx-auto max-w-7xl">

        {/* Section Heading */}
        <div className="mb-14 flex flex-col gap-7 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-10 bg-[#C69B62]" />

              <span className="text-[10px] font-bold uppercase tracking-[3px] text-[#71866B]">
                A Taste Worth Remembering
              </span>
            </div>

            <h2 className="font-serif text-4xl leading-[1.12] text-[#172B25] sm:text-5xl lg:text-6xl">
              A Few of Our
              <br />
              <span className="italic text-[#71866B]">
                Favourite Creations.
              </span>
            </h2>
          </div>

          <div className="max-w-md">
            <p className="text-sm leading-8 text-[#706F63]">
              From timeless favourites to bold new combinations, every creation
              is made with carefully selected ingredients and a little extra
              love.
            </p>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 items-stretch gap-7 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex h-full flex-col overflow-hidden rounded-2xl border border-[#DED8C9] bg-white"
              >
                <div className="aspect-[4/3] animate-pulse bg-[#E8E1D3]" />

                <div className="flex flex-1 flex-col p-6">
                  <div className="h-3 w-1/3 animate-pulse rounded bg-[#E8E1D3]" />
                  <div className="mt-5 h-7 w-2/3 animate-pulse rounded bg-[#E8E1D3]" />
                  <div className="mt-4 h-16 animate-pulse rounded bg-[#E8E1D3]" />
                  <div className="mt-auto pt-6">
                    <div className="h-10 animate-pulse rounded bg-[#E8E1D3]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="border border-[#DED8C9] bg-white px-6 py-14 text-center">
            <Pizza size={42} className="mx-auto text-[#71866B]" />

            <h3 className="mt-4 font-serif text-2xl font-bold text-[#172B25]">
              Unable to Load Pizzas
            </h3>

            <p className="mt-2 text-sm text-[#706F63]">{error}</p>

            <button
              onClick={() => window.location.reload()}
              className="mt-5 rounded-full bg-[#29483A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#172B25]"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && pizzas.length === 0 && (
          <div className="border border-[#DED8C9] bg-white px-6 py-14 text-center">
            <Pizza size={42} className="mx-auto text-[#71866B]" />

            <h3 className="mt-4 font-serif text-2xl font-bold text-[#172B25]">
              Something Delicious Is Coming
            </h3>

            <p className="mt-2 text-sm text-[#706F63]">
              Our featured pizzas will appear here once they are available.
            </p>
          </div>
        )}

        {/* Pizza Cards */}
        {!loading && !error && pizzas.length > 0 && (
          <div className="grid grid-cols-1 items-stretch gap-7 md:grid-cols-2 lg:grid-cols-3">
            {pizzas.map((pizza, index) => (
              <article
                key={pizza._id}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#DED8C9] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#C69B62]/60 hover:shadow-[0_18px_45px_-20px_rgba(23,43,37,0.28)]"
              >
                {/* Pizza Image */}
                <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-[#E8E1D3]">
                  {pizza.image ? (
                    <Image
                      src={pizza.image}
                      alt={pizza.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Pizza size={55} className="text-[#71866B]" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-[#172B25]/40 via-transparent to-transparent" />

                  {/* Category */}
                  <div className="absolute left-5 top-5">
                    <span className="rounded-sm bg-[#FBF8F1] px-4 py-2 text-[9px] font-bold uppercase tracking-[1.8px] text-[#29483A] shadow-sm">
                      {pizza.category}
                    </span>
                  </div>

                  {/* Card Number */}
                  <div className="absolute bottom-4 right-5 flex size-10 items-center justify-center rounded-full border border-white/50 bg-[#172B25]/40 font-serif text-sm text-white backdrop-blur-sm">
                    0{index + 1}
                  </div>
                </div>

                {/* Card Content */}
                <div className="flex flex-1 flex-col p-6">

                  {/* Restaurant Name */}
                  <div className="flex h-5 items-center gap-2 overflow-hidden">
                    {index === 0 ? (
                      <Flame size={14} className="shrink-0 text-[#C69B62]" />
                    ) : (
                      <Leaf size={14} className="shrink-0 text-[#71866B]" />
                    )}

                    <span className="truncate text-[9px] font-bold uppercase tracking-[1.8px] text-[#71866B]">
                      {pizza.vendor?.restaurantName || "Freshly Crafted"}
                    </span>
                  </div>

                  {/* Pizza Name: Fixed Height */}
                  <h3 className="mt-4 line-clamp-2 h-[3.5rem] overflow-hidden font-serif text-2xl leading-7 text-[#172B25]">
                    {pizza.name}
                  </h3>

                  {/* Description: Fixed Height */}
                  <p className="mt-3 line-clamp-3 h-[4.5rem] overflow-hidden text-sm leading-6 text-[#706F63]">
                    {pizza.description}
                  </p>

                  {/* Price and Details */}
                  <div className="mt-auto border-t border-[#DED8C9] pt-5">
                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <span className="text-[9px] font-semibold uppercase tracking-[1.5px] text-[#8B887B]">
                          Price
                        </span>

                        <p className="mt-1 font-serif text-2xl font-bold text-[#29483A]">
                          ${Number(pizza.price).toFixed(2)}
                        </p>
                      </div>

                      <Link
                        href={`/menu/${pizza._id}`}
                        className="mb-1 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[1px] text-[#29483A] transition hover:text-[#C69B62]"
                      >
                        Details
                        <ArrowRight size={16} />
                      </Link>
                    </div>

                    {/* Order Button */}
                    {!isPending && (!user || role === "customer") && (
                      <button
                        onClick={() => handleOrder(pizza._id)}
                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-[#29483A] px-5 py-3.5 text-xs font-bold uppercase tracking-[1.5px] text-white transition hover:bg-[#172B25]"
                      >
                        <ShoppingBag size={16} />
                        Order Now
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Explore All Pizzas - Bottom */}
        {!loading && !error && pizzas.length > 0 && (
          <div className="mt-16 flex flex-col items-center border-t border-[#DED8C9] pt-10 text-center">
            <p className="mb-5 text-sm text-[#706F63]">
              Looking for something different? Discover our complete collection.
            </p>

            <Link
              href="/menu"
              className="group inline-flex items-center gap-3 rounded-full border border-[#29483A] bg-[#29483A] px-8 py-4 text-xs font-bold uppercase tracking-[1.5px] text-white transition duration-300 hover:border-[#172B25] hover:bg-[#172B25]"
            >
              Explore All Pizzas

              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

            <p className="mt-8 font-serif text-xl italic text-[#71866B] sm:text-2xl">
              Crafted with Passion. Delivered with Love.
            </p>
          </div>
        )}

      </div>
    </section>
  );
}
