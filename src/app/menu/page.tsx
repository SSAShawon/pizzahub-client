
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  ShoppingBag,
  ArrowUpDown,
  Pizza,
  MapPin,
  Eye,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

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

type Pagination = {
  currentPage: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

const ITEMS_PER_PAGE = 9;

export default function MenuPage() {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const role = user?.role || "customer";

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryKey, setRetryKey] = useState(0);

  // Filter states
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    limit: ITEMS_PER_PAGE,
    totalItems: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setCurrentPage(1);
    }, 350);

    return () => clearTimeout(timer);
  }, [search]);

  // Fetch menu from backend
  useEffect(() => {
    const controller = new AbortController();

    const fetchMenu = async () => {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams();

        if (debouncedSearch) {
          params.set("search", debouncedSearch);
        }

        if (selectedCategory !== "All") {
          params.set("category", selectedCategory);
        }

        if (minPrice.trim()) {
          params.set("minPrice", minPrice.trim());
        }

        if (maxPrice.trim()) {
          params.set("maxPrice", maxPrice.trim());
        }

        params.set("sort", sortOrder);
        params.set("page", String(currentPage));
        params.set("limit", String(ITEMS_PER_PAGE));

        const response = await fetch(
          `/api/menu/public?${params.toString()}`,
          {
            cache: "no-store",
            signal: controller.signal,
          },
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Unable to load menu.");
        }

        setMenuItems(data.menuItems || []);

        // Categories now come from the backend,
        // so all categories remain available across pages.
        if (Array.isArray(data.categories)) {
          setCategories(
            data.categories.filter(
              (category: unknown): category is string =>
                typeof category === "string" && category.trim().length > 0,
            ),
          );
        }

        setPagination(
          data.pagination || {
            currentPage,
            limit: ITEMS_PER_PAGE,
            totalItems: (data.menuItems || []).length,
            totalPages: 1,
            hasNextPage: false,
            hasPreviousPage: false,
          },
        );
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        console.error("Menu Fetch Error:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while loading the menu.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchMenu();

    return () => controller.abort();
  }, [
    debouncedSearch,
    selectedCategory,
    sortOrder,
    minPrice,
    maxPrice,
    currentPage,
    retryKey,
  ]);

  // All categories received from backend
  const allCategories = [
    "All",
    ...new Set([
      ...categories,
      ...(selectedCategory !== "All" ? [selectedCategory] : []),
    ]),
  ];

  // Handle filter changes
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSortChange = (value: string) => {
    setSortOrder(value);
    setCurrentPage(1);
  };

  const handlePriceChange = (
    setter: (value: string) => void,
    value: string,
  ) => {
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setter(value);
      setCurrentPage(1);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setSelectedCategory("All");
    setSortOrder("newest");
    setMinPrice("");
    setMaxPrice("");
    setCurrentPage(1);
  };

  // Retry fetching menu
  const handleRetry = () => {
    setRetryKey((previous) => previous + 1);
  };

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
    <main className="min-h-screen bg-[#FBF8F1] text-[#24352C]">
      <Navbar />

      {/* Page Heading */}
      <section className="border-b border-[#DED8C9] bg-[#F2EBDD] px-5 py-16 text-center sm:py-20">
        <div className="mx-auto max-w-3xl">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#29483A] px-4 py-2 text-xs font-semibold uppercase tracking-[2px] text-white">
            <Pizza size={15} />
            Freshly Made With Love
          </span>

          <h1 className="font-serif text-4xl font-bold text-[#172B25] sm:text-5xl lg:text-6xl">
            Explore Our Menu
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#706F63] sm:text-base">
            Discover handcrafted pizzas made with fresh ingredients,
            authentic flavors, and a passion for great food.
          </p>
        </div>
      </section>

      {/* Menu Content */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
        {/* Search */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#71866B]"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search pizzas, categories, restaurants..."
              className="w-full rounded-xl border border-[#DED8C9] bg-white py-3.5 pl-12 pr-4 text-sm text-[#24352C] outline-none transition placeholder:text-[#A09B8D] focus:border-[#42634D] focus:ring-2 focus:ring-[#42634D]/10"
            />
          </div>

          {/* Sorting */}
          <div className="relative w-full lg:w-56">
            <ArrowUpDown
              size={17}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#71866B]"
            />

            <select
              value={sortOrder}
              onChange={(e) => handleSortChange(e.target.value)}
              className="w-full appearance-none rounded-xl border border-[#DED8C9] bg-white py-3.5 pl-11 pr-4 text-sm text-[#24352C] outline-none focus:border-[#42634D]"
            >
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name_asc">Name: A to Z</option>
              <option value="name_desc">Name: Z to A</option>
            </select>
          </div>
        </div>

        {/* Price Filters */}
        <div className="mb-8 rounded-2xl border border-[#DED8C9] bg-white p-4 sm:p-5">
          <div className="mb-4 flex items-center gap-2">
            <SlidersHorizontal size={18} className="text-[#42634D]" />
            <h2 className="text-sm font-bold text-[#172B25]">
              Filter By Price
            </h2>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="w-full">
              <label
                htmlFor="min-price"
                className="mb-1.5 block text-xs font-medium text-[#706F63]"
              >
                Minimum Price ($)
              </label>

              <input
                id="min-price"
                type="text"
                inputMode="decimal"
                value={minPrice}
                onChange={(e) =>
                  handlePriceChange(setMinPrice, e.target.value)
                }
                placeholder="e.g. 5"
                className="w-full rounded-xl border border-[#DED8C9] bg-[#FBF8F1] px-4 py-3 text-sm outline-none focus:border-[#42634D]"
              />
            </div>

            <div className="w-full">
              <label
                htmlFor="max-price"
                className="mb-1.5 block text-xs font-medium text-[#706F63]"
              >
                Maximum Price ($)
              </label>

              <input
                id="max-price"
                type="text"
                inputMode="decimal"
                value={maxPrice}
                onChange={(e) =>
                  handlePriceChange(setMaxPrice, e.target.value)
                }
                placeholder="e.g. 25"
                className="w-full rounded-xl border border-[#DED8C9] bg-[#FBF8F1] px-4 py-3 text-sm outline-none focus:border-[#42634D]"
              />
            </div>

            <button
              onClick={clearFilters}
              className="w-full rounded-xl border border-[#29483A] px-5 py-3 text-sm font-semibold text-[#29483A] transition hover:bg-[#F2EBDD] sm:mt-5 sm:w-auto"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="mb-10 flex flex-wrap gap-2">
          {allCategories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                selectedCategory === category
                  ? "bg-[#29483A] text-white shadow-md"
                  : "border border-[#DED8C9] bg-white text-[#42634D] hover:border-[#42634D] hover:bg-[#F2EBDD]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Result Count */}
        {!loading && !error && (
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-[#706F63]">
              Showing{" "}
              <span className="font-bold text-[#172B25]">
                {menuItems.length}
              </span>{" "}
              {menuItems.length === 1 ? "pizza" : "pizzas"}
              <span className="ml-1">
                ({pagination.totalItems} total)
              </span>
            </p>

            {pagination.totalPages > 0 && (
              <p className="text-xs text-[#706F63]">
                Page {pagination.currentPage} of {pagination.totalPages}
              </p>
            )}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-2xl border border-[#DED8C9] bg-white"
              >
                <div className="aspect-[4/3] animate-pulse bg-[#E8E5D9]" />
                <div className="space-y-3 p-5">
                  <div className="h-5 w-2/3 animate-pulse rounded bg-[#E8E5D9]" />
                  <div className="h-4 w-full animate-pulse rounded bg-[#E8E5D9]" />
                  <div className="h-10 w-full animate-pulse rounded bg-[#E8E5D9]" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-12 text-center">
            <p className="font-semibold text-red-700">
              Unable to load pizzas
            </p>

            <p className="mt-2 text-sm text-red-600">{error}</p>

            <button
              onClick={handleRetry}
              className="mt-5 rounded-full bg-[#29483A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#172B25]"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Pizza Cards */}
        {!loading && !error && menuItems.length > 0 && (
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {menuItems.map((item) => (
              <article
                key={item._id}
                className="group overflow-hidden rounded-2xl border border-[#DED8C9] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Pizza Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-[#E8E5D9]">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Pizza size={55} className="text-[#71866B]" />
                    </div>
                  )}

                  <span className="absolute left-4 top-4 rounded-full bg-[#FBF8F1] px-3 py-1.5 text-xs font-bold text-[#29483A] shadow">
                    {item.category}
                  </span>

                  <span className="absolute right-4 top-4 rounded-full bg-[#29483A] px-3 py-1.5 text-sm font-bold text-white shadow">
                    ${Number(item.price).toFixed(2)}
                  </span>
                </div>

                {/* Pizza Information */}
                <div className="p-5">
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <h2 className="font-serif text-xl font-bold text-[#172B25]">
                      {item.name}
                    </h2>
                  </div>

                  <p className="mb-4 line-clamp-2 min-h-12 text-sm leading-6 text-[#706F63]">
                    {item.description}
                  </p>

                  {item.vendor?.restaurantName && (
                    <div className="mb-5 flex items-center gap-2 text-xs text-[#71866B]">
                      <MapPin size={14} />
                      <span className="truncate">
                        {item.vendor.restaurantName}
                      </span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Link
                      href={`/menu/${item._id}`}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#29483A] px-3 py-3 text-sm font-semibold text-[#29483A] transition hover:bg-[#F2EBDD]"
                    >
                      <Eye size={17} />
                      Details
                    </Link>

                    {!isPending && (!user || role === "customer") && (
                      <button
                        onClick={() => handleOrder(item._id)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#29483A] px-3 py-3 text-sm font-semibold text-white transition hover:bg-[#172B25]"
                      >
                        <ShoppingBag size={17} />
                        Order Now
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && !error && menuItems.length === 0 && (
          <div className="rounded-2xl border border-[#DED8C9] bg-white px-6 py-16 text-center">
            <Pizza size={45} className="mx-auto text-[#71866B]" />

            <h3 className="mt-5 font-serif text-2xl font-bold text-[#172B25]">
              No Pizzas Found
            </h3>

            <p className="mt-2 text-sm text-[#706F63]">
              Try another search term or adjust your filters.
            </p>

            <button
              onClick={clearFilters}
              className="mt-6 rounded-full bg-[#29483A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#172B25]"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && pagination.totalPages > 1 && (
          <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() =>
                setCurrentPage((page) => Math.max(1, page - 1))
              }
              disabled={!pagination.hasPreviousPage}
              className="inline-flex items-center gap-2 rounded-xl border border-[#DED8C9] bg-white px-4 py-3 text-sm font-semibold text-[#29483A] transition hover:bg-[#F2EBDD] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={17} />
              Previous
            </button>

            <span className="rounded-xl bg-[#29483A] px-5 py-3 text-sm font-bold text-white">
              {pagination.currentPage} / {pagination.totalPages}
            </span>

            <button
              onClick={() =>
                setCurrentPage((page) =>
                  Math.min(pagination.totalPages, page + 1),
                )
              }
              disabled={!pagination.hasNextPage}
              className="inline-flex items-center gap-2 rounded-xl border border-[#DED8C9] bg-white px-4 py-3 text-sm font-semibold text-[#29483A] transition hover:bg-[#F2EBDD] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
              <ChevronRight size={17} />
            </button>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
