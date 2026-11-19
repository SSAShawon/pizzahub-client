
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  UtensilsCrossed,
  ClipboardList,
  Store,
  CreditCard,
  Home,
  Crown,
  Menu,
  X,
} from "lucide-react";

const navigation = [
  {
    label: "Overview",
    href: "/dashboard/vendor",
    icon: LayoutDashboard,
  },
  {
    label: "My Menu",
    href: "/dashboard/vendor/menu",
    icon: UtensilsCrossed,
  },
  {
    label: "Orders",
    href: "/dashboard/vendor/orders",
    icon: ClipboardList,
  },
  {
    label: "Restaurant Profile",
    href: "/dashboard/vendor/profile",
    icon: Store,
  },
  {
    label: "Subscription",
    href: "/dashboard/vendor/subscription",
    icon: CreditCard,
  },
];

export default function VendorSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const closeSidebar = () => setIsOpen(false);

  const sidebarContent = (
    <>
      {/* Logo */}
      <Link
        href="/"
        onClick={closeSidebar}
        className="mb-9 flex items-center gap-3 px-2"
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#29483A] text-xl text-white">
          🍕
        </div>

        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#172B25]">
            PizzaHub
          </h2>
          <p className="text-[10px] font-semibold tracking-[1.5px] text-[#71866B]">
            RESTAURANT PANEL
          </p>
        </div>
      </Link>

      {/* Navigation */}
      <p className="mb-4 px-3 text-[11px] font-bold uppercase tracking-[2px] text-[#999487]">
        Workspace
      </p>

      <nav className="space-y-1.5">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeSidebar}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                active
                  ? "bg-[#172B25] text-white shadow-sm"
                  : "text-[#706F63] hover:bg-[#F0EDE4] hover:text-[#172B25]"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Back to Home */}
      <Link
        href="/"
        onClick={closeSidebar}
        className="mt-5 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#706F63] transition hover:bg-[#F0EDE4] hover:text-[#172B25]"
      >
        <Home size={18} />
        Back to Home
      </Link>

      {/* Upgrade Card */}
      <div className="mt-auto pt-8">
        <Link
          href="/dashboard/vendor/subscription"
          onClick={closeSidebar}
          className="block rounded-2xl bg-[#172B25] p-5 text-white transition hover:bg-[#29483A]"
        >
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
            <Crown size={18} className="text-[#C69B62]" />
          </div>

          <p className="text-sm font-semibold">
            Grow Your Restaurant
          </p>

          <p className="mt-2 text-xs leading-5 text-white/65">
            Upgrade your restaurant experience and grow with PizzaHub.
          </p>
        </Link>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-[#DED8C9] bg-[#FBF8F1] p-5 lg:flex">
        {sidebarContent}
      </aside>

      {/* Mobile Menu Bar */}
      <div className="mb-5 flex items-center justify-between border-b border-[#DED8C9] bg-[#FBF8F1] px-5 py-4 lg:hidden">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#29483A] text-white">
            🍕
          </span>
          <span className="font-bold text-[#172B25]">
            PizzaHub
          </span>
        </Link>

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open navigation menu"
          aria-expanded={isOpen}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#DED8C9] bg-[#F2EBDD] text-[#172B25] transition hover:bg-[#EAE5D9]"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/45 lg:hidden"
          onClick={closeSidebar}
        >
          {/* Drawer */}
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Vendor navigation"
            onClick={(event) => event.stopPropagation()}
            className="flex h-full w-[min(82vw,320px)] flex-col overflow-y-auto border-r border-[#DED8C9] bg-[#FBF8F1] p-5 shadow-2xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-[2px] text-[#999487]">
                Navigation
              </p>

              <button
                type="button"
                onClick={closeSidebar}
                aria-label="Close navigation menu"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-[#706F63] transition hover:bg-[#F0EDE4] hover:text-[#172B25]"
              >
                <X size={21} />
              </button>
            </div>

            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
