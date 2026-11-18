
"use client";

import Link from "next/link";
import { useState } from "react";
import {
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingBag,
  Store,
  CreditCard,
  Settings,
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  Package,
  ArrowLeft,
  Filter,
  X,
} from "lucide-react";

type MenuItem = {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  status: "Approved" | "Pending" | "Rejected";
};

const initialMenuItems: MenuItem[] = [
  {
    id: 1,
    name: "Margherita Pizza",
    category: "Classic Pizza",
    description: "Fresh mozzarella, tomato sauce, basil and olive oil.",
    price: 18,
    image:
      "https://images.unsplash.com/photo-1579751626657-72bc17010498?w=700",
    status: "Approved",
  },
  {
    id: 2,
    name: "Pepperoni Pizza",
    category: "Classic Pizza",
    description: "Classic pepperoni with mozzarella and tomato sauce.",
    price: 22,
    image:
      "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=700",
    status: "Approved",
  },
  {
    id: 3,
    name: "Four Cheese Pizza",
    category: "Special Pizza",
    description: "A rich blend of four delicious Italian cheeses.",
    price: 25,
    image:
      "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=700",
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

export default function VendorMenuPage() {
  const [menuItems, setMenuItems] = useState(initialMenuItems);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "Classic Pizza",
    description: "",
    price: "",
    image: "",
  });

  const activeItems = menuItems.filter(
    (item) => item.status === "Approved",
  ).length;

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter =
      activeFilter === "All" || item.status === activeFilter;

    return matchesSearch && matchesFilter;
  });

  const openAddForm = () => {
    setEditingItem(null);
    setFormData({
      name: "",
      category: "Classic Pizza",
      description: "",
      price: "",
      image: "",
    });
    setShowForm(true);
  };

  const openEditForm = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      description: item.description,
      price: String(item.price),
      image: item.image,
    });
    setShowForm(true);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.description.trim() ||
      !formData.price ||
      Number(formData.price) <= 0
    ) {
      alert("Please complete all required fields.");
      return;
    }

    if (!editingItem && activeItems >= 3) {
      alert(
        "Your Free Plan allows a maximum of 3 approved menu items. Upgrade your plan to add more.",
      );
      return;
    }

    if (editingItem) {
      setMenuItems((previous) =>
        previous.map((item) =>
          item.id === editingItem.id
            ? {
                ...item,
                ...formData,
                price: Number(formData.price),
              }
            : item,
        ),
      );
    } else {
      setMenuItems((previous) => [
        ...previous,
        {
          id: Date.now(),
          name: formData.name.trim(),
          category: formData.category,
          description: formData.description.trim(),
          price: Number(formData.price),
          image: formData.image,
          status: "Pending",
        },
      ]);
    }

    setShowForm(false);
  };

  const handleDelete = () => {
    if (deleteItemId === null) return;

    setMenuItems((previous) =>
      previous.filter((item) => item.id !== deleteItemId),
    );

    setDeleteItemId(null);
  };

  const inputClass =
    "w-full rounded-xl border border-[#DED8C9] bg-[#FBF8F1] px-4 py-3 text-sm text-[#24352C] outline-none transition placeholder:text-[#A5A192] focus:border-[#71866B] focus:ring-2 focus:ring-[#71866B]/15";

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
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = item.label === "My Menu";

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                      isActive
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
                className="mt-4 flex items-center justify-center rounded-lg bg-[#C69B62] px-3 py-2.5 text-xs font-bold text-[#172B25]"
              >
                Explore Premium
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <section className="min-w-0 flex-1">
          <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#DED8C9] bg-[#FBF8F1] px-5 py-5 sm:px-8">
            <div>
              <Link
                href="/dashboard/vendor"
                className="mb-2 inline-flex items-center gap-2 text-xs font-medium text-[#71866B] hover:text-[#172B25]"
              >
                <ArrowLeft size={14} /> Back to Dashboard
              </Link>
              <h1 className="text-xl font-bold text-[#172B25] sm:text-2xl">
                Menu Management
              </h1>
              <p className="mt-1 text-xs text-[#8A887B]">
                Create and manage your restaurant menu.
              </p>
            </div>

            <button
              onClick={openAddForm}
              className="inline-flex items-center gap-2 rounded-xl bg-[#172B25] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#29483A]"
            >
              <Plus size={17} /> Add New Item
            </button>
          </header>

          <div className="mx-auto max-w-7xl space-y-7 p-5 sm:p-8">
            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                {
                  label: "Total Items",
                  value: menuItems.length,
                },
                {
                  label: "Approved Items",
                  value: activeItems,
                },
                {
                  label: "Pending Approval",
                  value: menuItems.filter(
                    (item) => item.status === "Pending",
                  ).length,
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-[#DED8C9] bg-[#FBF8F1] p-5"
                >
                  <p className="text-sm text-[#777568]">{stat.label}</p>
                  <h2 className="mt-3 text-3xl font-bold text-[#172B25]">
                    {stat.value}
                  </h2>
                </div>
              ))}
            </div>

            {/* Free Plan Notice */}
            <div className="flex flex-col justify-between gap-4 rounded-2xl border border-[#D9C7A7] bg-[#F4EBDD] p-5 sm:flex-row sm:items-center">
              <div>
                <p className="font-bold text-[#6F542F]">
                  Free Plan: {activeItems}/3 Active Menu Items
                </p>
                <p className="mt-1 text-xs leading-5 text-[#8B7555]">
                  Only approved items count toward your free plan limit.
                </p>
              </div>

              <Link
                href="/dashboard/vendor/subscription"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#172B25] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#29483A]"
              >
                Upgrade Plan
              </Link>
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div className="relative w-full sm:max-w-sm">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#929082]"
                />
                <input
                  type="text"
                  placeholder="Search menu items..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className={`${inputClass} pl-11`}
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Filter size={16} className="mr-1 text-[#929082]" />
                {["All", "Approved", "Pending", "Rejected"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                      activeFilter === filter
                        ? "bg-[#172B25] text-white"
                        : "border border-[#DED8C9] bg-[#FBF8F1] text-[#706F63] hover:border-[#71866B]"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Menu Cards */}
            {filteredItems.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#C9C2B2] bg-[#FBF8F1] px-5 py-16 text-center">
                <Package
                  size={36}
                  className="mx-auto text-[#A5A192]"
                />
                <h3 className="mt-4 font-bold text-[#29483A]">
                  No menu items found
                </h3>
                <p className="mt-2 text-sm text-[#8A887B]">
                  Try another search or add a new menu item.
                </p>
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="overflow-hidden rounded-2xl border border-[#DED8C9] bg-[#FBF8F1] transition hover:-translate-y-1 hover:shadow-lg hover:shadow-[#172B25]/5"
                  >
                    <div className="relative h-48 overflow-hidden bg-[#EAE7DE]">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[#929082]">
                          <Package size={42} />
                        </div>
                      )}

                      <span
                        className={`absolute right-3 top-3 rounded-full px-3 py-1.5 text-[10px] font-bold ${
                          item.status === "Approved"
                            ? "bg-[#E4EDE3] text-[#42634D]"
                            : item.status === "Pending"
                              ? "bg-[#F8EBD2] text-[#9A6A20]"
                              : "bg-[#F5E2DF] text-[#A34D43]"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <div className="p-5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#8A887B]">
                        {item.category}
                      </p>

                      <div className="mt-2 flex items-start justify-between gap-3">
                        <h3 className="font-bold text-[#172B25]">
                          {item.name}
                        </h3>
                        <p className="shrink-0 font-bold text-[#42634D]">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>

                      <p className="mt-3 min-h-10 text-xs leading-5 text-[#777568]">
                        {item.description}
                      </p>

                      <div className="mt-5 flex items-center gap-2 border-t border-[#EAE5D9] pt-4">
                        <button
                          onClick={() => openEditForm(item)}
                          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#DED8C9] py-2.5 text-xs font-semibold text-[#42634D] transition hover:bg-[#EAEDE5]"
                        >
                          <Pencil size={14} /> Edit
                        </button>

                        <button
                          onClick={() => setDeleteItemId(item.id)}
                          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#E9D1CD] py-2.5 text-xs font-semibold text-[#A34D43] transition hover:bg-[#F5E2DF]"
                        >
                          <Trash2 size={14} /> Delete
                        </button>

                        <button
                          onClick={() =>
                            alert(
                              `${item.name}\n\n${item.description}\n\nPrice: $${item.price.toFixed(2)}\nStatus: ${item.status}`,
                            )
                          }
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#DED8C9] text-[#777568] hover:bg-[#F0EDE4]"
                          aria-label={`View ${item.name}`}
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Add / Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#172B25]/60 p-4 backdrop-blur-sm">
          <div className="my-auto w-full max-w-xl rounded-2xl bg-[#FBF8F1] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#DED8C9] p-5 sm:p-6">
              <div>
                <h2 className="text-lg font-bold text-[#172B25]">
                  {editingItem ? "Edit Menu Item" : "Add New Menu Item"}
                </h2>
                <p className="mt-1 text-xs text-[#8A887B]">
                  Enter your pizza details below.
                </p>
              </div>

              <button
                onClick={() => setShowForm(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F0EDE4] text-[#777568] hover:bg-[#E5E0D4]"
                aria-label="Close form"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 p-5 sm:p-6">
              <div>
                <label className="mb-2 block text-xs font-semibold text-[#526153]">
                  Item Name *
                </label>
                <input
                  type="text"
                  required
                  maxLength={100}
                  placeholder="e.g. Italian Margherita Pizza"
                  value={formData.name}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      name: event.target.value,
                    })
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold text-[#526153]">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      category: event.target.value,
                    })
                  }
                  className={inputClass}
                >
                  <option>Classic Pizza</option>
                  <option>Special Pizza</option>
                  <option>Vegetarian Pizza</option>
                  <option>Meat Lovers</option>
                  <option>Side Dishes</option>
                  <option>Beverages</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold text-[#526153]">
                  Description *
                </label>
                <textarea
                  required
                  maxLength={500}
                  rows={3}
                  placeholder="Describe your delicious menu item..."
                  value={formData.description}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      description: event.target.value,
                    })
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold text-[#526153]">
                  Price (USD) *
                </label>
                <input
                  type="number"
                  required
                  min="0.01"
                  step="0.01"
                  placeholder="18.00"
                  value={formData.price}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      price: event.target.value,
                    })
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold text-[#526153]">
                  Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/pizza.jpg"
                  value={formData.image}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      image: event.target.value,
                    })
                  }
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-[#DED8C9] pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-xl border border-[#DED8C9] px-5 py-3 text-sm font-semibold text-[#706F63] hover:bg-[#F0EDE4]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-[#172B25] px-6 py-3 text-sm font-semibold text-white hover:bg-[#29483A]"
                >
                  {editingItem ? "Save Changes" : "Submit for Approval"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteItemId !== null && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#172B25]/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-[#FBF8F1] p-6 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F5E2DF] text-[#A34D43]">
              <Trash2 size={22} />
            </div>

            <h3 className="mt-4 text-lg font-bold text-[#172B25]">
              Delete Menu Item?
            </h3>

            <p className="mt-2 text-sm leading-6 text-[#777568]">
              Are you sure you want to delete this item? This action cannot be
              undone.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeleteItemId(null)}
                className="flex-1 rounded-xl border border-[#DED8C9] py-3 text-sm font-semibold text-[#706F63] hover:bg-[#F0EDE4]"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="flex-1 rounded-xl bg-[#A34D43] py-3 text-sm font-semibold text-white hover:bg-[#8D3F36]"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
