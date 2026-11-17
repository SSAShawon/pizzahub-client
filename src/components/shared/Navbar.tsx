
"use client";

import Link from "next/link";
import { ShoppingBag, Menu, X, Moon, Sun } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Our Menu", href: "/menu" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[#DED8C9] bg-[#FBF8F1]/95 backdrop-blur-md">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
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
        </div>

        {/* Right Actions */}
        <div className="hidden items-center gap-4 md:flex">
          <button
            onClick={() => setIsDark(!isDark)}
            className="rounded-full p-2 text-[#29483A] transition hover:bg-[#E8E5D9]"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={19} /> : <Moon size={19} />}
          </button>

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
            Order Now
          </Link>
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
                onClick={() => setIsOpen(false)}
                className="text-sm font-medium text-[#24352C]"
              >
                {link.name}
              </Link>
            ))}

            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="text-sm font-semibold text-[#24352C]"
            >
              Sign In
            </Link>

            <Link
              href="/register"
              onClick={() => setIsOpen(false)}
              className="rounded-full bg-[#29483A] px-5 py-3 text-center text-sm font-semibold text-white"
            >
              Order Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
