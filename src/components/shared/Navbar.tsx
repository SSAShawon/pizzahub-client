
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Menu,
  X,
  Moon,
  Sun,
  UserCircle,
  ChevronDown,
  LayoutDashboard,
  ClipboardList,
  Heart,
  LogOut,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;
  const isLoggedIn = !!user;

  const role = user?.role || "customer";

  const dashboardLink =
    role === "admin"
      ? "/dashboard/admin"
      : role === "vendor"
        ? "/dashboard/vendor"
        : "/dashboard/customer";

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Our Menu", href: "/menu" },
    { name: "About Us", href: "/about" },
  ];

  const handleDashboard = () => {
    setIsOpen(false);
    router.push(isLoggedIn ? dashboardLink : "/login");
  };

  const handleLogout = async () => {
    try {
      await authClient.signOut();

      setProfileOpen(false);
      setIsOpen(false);

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const closeMobileMenu = () => {
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#DED8C9] bg-[#FBF8F1]/95 backdrop-blur-md">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2"
          onClick={closeMobileMenu}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#29483A] text-[#F2EBDD]">
            <ShoppingBag size={20} />
          </div>

          <div>
            <h1 className="font-serif text-2xl font-bold tracking-tight text-[#172B25]">
              PizzaHub<span className="text-[#C69B62]">.</span>
            </h1>

            <p className="text-[9px] font-semibold uppercase tracking-[2px] text-[#706F63]">
              Artisan Pizza House
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-9 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-[#24352C] transition-colors hover:text-[#C69B62]"
            >
              {link.name}
            </Link>
          ))}

          <button
            onClick={handleDashboard}
            className="text-sm font-semibold text-[#24352C] transition-colors hover:text-[#C69B62]"
          >
            Dashboard
          </button>
        </div>

        {/* Desktop Right Actions */}
        <div className="hidden items-center gap-4 md:flex">

          {/* Theme Toggle */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="rounded-full p-2 text-[#29483A] transition hover:bg-[#E8E5D9]"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={19} /> : <Moon size={19} />}
          </button>

          {/* Authentication Loading */}
          {isPending ? (
            <div className="h-10 w-28 animate-pulse rounded-full bg-[#E8E5D9]" />
          ) : isLoggedIn ? (

            /* Logged In User */
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 rounded-full border border-[#DED8C9] bg-white px-3 py-2 transition hover:border-[#C69B62]"
                aria-expanded={profileOpen}
              >
                <UserCircle size={21} className="text-[#29483A]" />

                <span className="max-w-28 truncate text-sm font-semibold text-[#24352C]">
                  {user.name}
                </span>

                <ChevronDown
                  size={15}
                  className={`text-[#706F63] transition-transform ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Profile Dropdown */}
              {profileOpen && (
                <div className="absolute right-0 top-14 z-50 w-60 overflow-hidden rounded-xl border border-[#DED8C9] bg-[#FBF8F1] shadow-xl">

                  <div className="border-b border-[#DED8C9] px-4 py-4">
                    <p className="truncate text-sm font-bold text-[#172B25]">
                      {user.name}
                    </p>

                    <p className="truncate text-xs text-[#706F63]">
                      {user.email}
                    </p>

                    <span className="mt-2 inline-block rounded-full bg-[#E8E5D9] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#29483A]">
                      {role}
                    </span>
                  </div>

                  <div className="p-2">
                    {role === "customer" && (
                      <>
                        <Link
                          href="/dashboard/customer/orders"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#24352C] transition hover:bg-[#E8E5D9]"
                        >
                          <ClipboardList size={17} />
                          My Orders
                        </Link>

                        <Link
                          href="/dashboard/customer/favorites"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#24352C] transition hover:bg-[#E8E5D9]"
                        >
                          <Heart size={17} />
                          My Favorites
                        </Link>
                      </>
                    )}
                  </div>

                  <div className="border-t border-[#DED8C9] p-2">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      <LogOut size={17} />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

          ) : (

            /* Logged Out User */
            <>
              <Link
                href="/login"
                className="text-sm font-semibold text-[#24352C] transition hover:text-[#C69B62]"
              >
                Sign In
              </Link>

              <Link
                href="/register"
                className="rounded-full bg-[#29483A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#172B25]"
              >
                Create Account
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-lg p-2 text-[#172B25] md:hidden"
          aria-label="Toggle navigation"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="border-t border-[#DED8C9] bg-[#FBF8F1] px-6 py-5 md:hidden">
          <div className="flex flex-col gap-5">

            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={closeMobileMenu}
                className="text-sm font-medium text-[#24352C]"
              >
                {link.name}
              </Link>
            ))}

            <button
              onClick={handleDashboard}
              className="flex items-center gap-3 text-left text-sm font-semibold text-[#24352C]"
            >
              <LayoutDashboard size={18} />
              Dashboard
            </button>

            <div className="border-t border-[#DED8C9] pt-5">

              {isPending ? (
                <div className="h-10 animate-pulse rounded-lg bg-[#E8E5D9]" />
              ) : isLoggedIn ? (
                <div className="flex flex-col gap-4">

                  <div className="flex items-center gap-3">
                    <UserCircle size={30} className="text-[#29483A]" />

                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-[#172B25]">
                        {user.name}
                      </p>

                      <p className="truncate text-xs text-[#706F63]">
                        {user.email}
                      </p>

                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#42634D]">
                        {role}
                      </span>
                    </div>
                  </div>

                  {role === "customer" && (
                    <>
                      <Link
                        href="/dashboard/customer/orders"
                        onClick={closeMobileMenu}
                        className="flex items-center gap-3 text-sm font-medium text-[#24352C]"
                      >
                        <ClipboardList size={18} />
                        My Orders
                      </Link>

                      <Link
                        href="/dashboard/customer/favorites"
                        onClick={closeMobileMenu}
                        className="flex items-center gap-3 text-sm font-medium text-[#24352C]"
                      >
                        <Heart size={18} />
                        My Favorites
                      </Link>
                    </>
                  )}

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 text-left text-sm font-semibold text-red-600"
                  >
                    <LogOut size={18} />
                    Sign Out
                  </button>

                </div>
              ) : (
                <div className="flex flex-col gap-4">

                  <Link
                    href="/login"
                    onClick={closeMobileMenu}
                    className="text-sm font-semibold text-[#24352C]"
                  >
                    Sign In
                  </Link>

                  <Link
                    href="/register"
                    onClick={closeMobileMenu}
                    className="rounded-full bg-[#29483A] px-5 py-3 text-center text-sm font-semibold text-white"
                  >
                    Create Account
                  </Link>

                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </header>
  );
}
