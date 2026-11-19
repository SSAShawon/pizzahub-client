
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, type FormEvent } from "react";
import VendorSidebar from "@/components/dashboard/VendorSidebar";
import {
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

type MenuStatus = "approved" | "pending" | "rejected";

type MenuItem = {
  _id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  status: MenuStatus;
  isAvailable: boolean;
};

const filters = ["All", "Approved", "Pending", "Rejected"];

const getStatusLabel = (status: MenuStatus) =>
  status.charAt(0).toUpperCase() + status.slice(1);

const isValidImageUrl = (imageUrl: string) => {
  try {
    const url = new URL(imageUrl);
    const allowedHosts = ["i.ibb.co", "i.ibb.co.com", "images.unsplash.com"];
    return url.protocol === "https:" && allowedHosts.includes(url.hostname);
  } catch {
    return false;
  }
};

export default function VendorMenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    category: "Classic Pizza",
    description: "",
    price: "",
    image: "",
  });

  const inputClass =
    "w-full rounded-xl border border-[#DED8C9] bg-[#FBF8F1] px-4 py-3 text-sm text-[#24352C] outline-none transition placeholder:text-[#A5A192] focus:border-[#71866B] focus:ring-2 focus:ring-[#71866B]/15";

  const loadMenuItems = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/menu", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to load menu items.");
      }

      setMenuItems(data.menuItems || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading menu items."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenuItems();
  }, []);

  const activeItems = menuItems.filter(
    (item) => item.status === "approved" && item.isAvailable
  ).length;

  const pendingItems = menuItems.filter(
    (item) => item.status === "pending"
  ).length;

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      activeFilter === "All" || getStatusLabel(item.status) === activeFilter;

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
    setError("");
    setShowForm(true);
  };

  const openEditForm = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      description: item.description,
      price: String(item.price),
      image: item.image || "",
    });
    setError("");
    setShowForm(true);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
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

    try {
      setSaving(true);
      setError("");

      const isEditing = Boolean(editingItem);

      const url = isEditing
        ? `/api/menu/${editingItem?._id}`
        : "/api/menu";

      const response = await fetch(url, {
        method: isEditing ? "PATCH" : "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          category: formData.category,
          description: formData.description.trim(),
          price: Number(formData.price),
          image: formData.image.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to save menu item.");
      }

      setShowForm(false);
      setEditingItem(null);

      await loadMenuItems();

      alert(
        isEditing
          ? "Menu item updated successfully!"
          : "Menu item submitted for approval!"
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteItemId) return;

    try {
      setDeleting(true);

      const response = await fetch(`/api/menu/${deleteItemId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to delete menu item.");
      }

      setDeleteItemId(null);
      await loadMenuItems();

      alert("Menu item deleted successfully!");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F7F5EF] text-[#24352C]">
      <div className="flex min-h-screen flex-col lg:flex-row">
        {/* Shared Vendor Sidebar */}
        <VendorSidebar />

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
            {error && (
              <div className="rounded-xl border border-[#E9D1CD] bg-[#F5E2DF] p-4 text-sm text-[#A34D43]">
                {error}
                <button
                  onClick={loadMenuItems}
                  className="ml-3 font-bold underline"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: "Total Items", value: menuItems.length },
                { label: "Approved Items", value: activeItems },
                { label: "Pending Approval", value: pendingItems },
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
                  Only approved and available items count toward your free plan limit.
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
                {filters.map((filter) => (
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

            {/* Menu Items */}
            {loading ? (
              <div className="rounded-2xl border border-[#DED8C9] bg-[#FBF8F1] px-5 py-16 text-center">
                <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-[#DED8C9] border-t-[#42634D]" />
                <p className="mt-4 text-sm text-[#777568]">
                  Loading your menu items...
                </p>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#C9C2B2] bg-[#FBF8F1] px-5 py-16 text-center">
                <Package size={36} className="mx-auto text-[#A5A192]" />
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
                    key={item._id}
                    className="overflow-hidden rounded-2xl border border-[#DED8C9] bg-[#FBF8F1] transition hover:-translate-y-1 hover:shadow-lg hover:shadow-[#172B25]/5"
                  >
                    <div className="relative h-48 overflow-hidden bg-[#EAE7DE]">
                      {item.image && isValidImageUrl(item.image) ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          loading="eager"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full flex-col items-center justify-center gap-2 text-[#929082]">
                          <Package size={42} />
                          <span className="text-xs">
                            No valid image available
                          </span>
                        </div>
                      )}

                      <span
                        className={`absolute right-3 top-3 rounded-full px-3 py-1.5 text-[10px] font-bold ${
                          item.status === "approved"
                            ? "bg-[#E4EDE3] text-[#42634D]"
                            : item.status === "pending"
                              ? "bg-[#F8EBD2] text-[#9A6A20]"
                              : "bg-[#F5E2DF] text-[#A34D43]"
                        }`}
                      >
                        {getStatusLabel(item.status)}
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
                          ${Number(item.price).toFixed(2)}
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
                          onClick={() => setDeleteItemId(item._id)}
                          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#E9D1CD] py-2.5 text-xs font-semibold text-[#A34D43] transition hover:bg-[#F5E2DF]"
                        >
                          <Trash2 size={14} /> Delete
                        </button>

                        <button
                          onClick={() =>
                            alert(
                              `${item.name}\n\n${item.description}\n\nPrice: $${Number(item.price).toFixed(2)}\nStatus: ${getStatusLabel(item.status)}`
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
                  maxLength={120}
                  placeholder="e.g. Italian Margherita Pizza"
                  value={formData.name}
                  onChange={(event) =>
                    setFormData({ ...formData, name: event.target.value })
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
                    setFormData({ ...formData, category: event.target.value })
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
                  maxLength={1000}
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
                    setFormData({ ...formData, price: event.target.value })
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
                    setFormData({ ...formData, image: event.target.value })
                  }
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-[#DED8C9] pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  disabled={saving}
                  className="rounded-xl border border-[#DED8C9] px-5 py-3 text-sm font-semibold text-[#706F63] hover:bg-[#F0EDE4]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-[#172B25] px-6 py-3 text-sm font-semibold text-white hover:bg-[#29483A] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingItem
                      ? "Save Changes"
                      : "Submit for Approval"}
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
              Are you sure you want to delete this item? This action cannot be undone.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeleteItemId(null)}
                disabled={deleting}
                className="flex-1 rounded-xl border border-[#DED8C9] py-3 text-sm font-semibold text-[#706F63] hover:bg-[#F0EDE4]"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 rounded-xl bg-[#A34D43] py-3 text-sm font-semibold text-white hover:bg-[#8D3F36] disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
