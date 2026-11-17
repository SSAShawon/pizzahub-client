
import Link from "next/link";
import {
  ShoppingBag,
  ArrowUpRight,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Heart,
  Users,
} from "lucide-react";

const footerLinks = {
  explore: [
    { name: "Home", href: "/" },
    { name: "Our Menu", href: "/menu" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ],
  account: [
    { name: "Sign In", href: "/login" },
    { name: "Create Account", href: "/register" },
    { name: "My Orders", href: "/dashboard/customer" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#172B25] text-[#F2EBDD]">
      <div className="mx-auto max-w-7xl px-5 pb-12 pt-20 sm:px-8 lg:px-12 lg:pt-24">

        <div className="grid gap-14 border-b border-white/15 pb-16 md:grid-cols-2 lg:grid-cols-[1.5fr_0.8fr_0.8fr_1.1fr] lg:gap-10">

          {/* Brand */}
          <div className="max-w-sm">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#C69B62] text-[#172B25]">
                <ShoppingBag size={23} />
              </div>

              <div>
                <h2 className="font-serif text-3xl font-bold tracking-tight">
                  PizzaHub<span className="text-[#C69B62]">.</span>
                </h2>
                <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-[2px] text-white/50">
                  Artisan Pizza House
                </p>
              </div>
            </Link>

            <p className="mt-7 text-sm leading-8 text-white/60">
              Bringing people together through handcrafted pizzas,
              carefully selected ingredients, and unforgettable
              food experiences.
            </p>

            <p className="mt-6 font-serif text-lg italic text-[#D0AD78]">
              Crafted with Passion. Delivered with Love.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="mb-8 font-serif text-xl text-white">
              Explore
            </h3>

            <ul className="space-y-5">
              {footerLinks.explore.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-[#D0AD78]"
                  >
                    {link.name}
                    <ArrowUpRight size={13} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="mb-8 font-serif text-xl text-white">
              My Account
            </h3>

            <ul className="space-y-5">
              {footerLinks.account.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-[#D0AD78]"
                  >
                    {link.name}
                    <ArrowUpRight size={13} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-8 font-serif text-xl text-white">
              Get in Touch
            </h3>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin size={18} className="mt-1 shrink-0 text-[#D0AD78]" />
                <p className="text-sm leading-7 text-white/60">
                  Visit our contact page for location and restaurant information.
                </p>
              </div>

              <Link
                href="/contact"
                className="flex items-center gap-4 text-sm text-white/60 transition hover:text-[#D0AD78]"
              >
                <Phone size={18} className="shrink-0 text-[#D0AD78]" />
                Contact Our Team
              </Link>

              <Link
                href="/contact"
                className="flex items-center gap-4 text-sm text-white/60 transition hover:text-[#D0AD78]"
              >
                <Mail size={18} className="shrink-0 text-[#D0AD78]" />
                Send Us a Message
              </Link>
            </div>
          </div>
        </div>

        {/* Join PizzaHub */}
        <div className="flex flex-col justify-between gap-7 border-b border-white/15 py-10 md:flex-row md:items-center">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[2px] text-[#D0AD78]">
              Stay Connected
            </p>

            <h3 className="mt-3 font-serif text-2xl text-white sm:text-3xl">
              Something delicious is always worth sharing.
            </h3>
          </div>

          <Link
            href="/register"
            className="group inline-flex shrink-0 items-center justify-center gap-4 bg-[#C69B62] px-7 py-4 text-xs font-bold uppercase tracking-[1px] text-[#172B25] transition hover:bg-[#E0BB8C]"
          >
            Join PizzaHub
            <ArrowRight
              size={17}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* Bottom Footer */}
        <div className="flex flex-col justify-between gap-5 pt-8 sm:flex-row sm:items-center">
          <p className="text-xs text-white/45">
            © {new Date().getFullYear()} PizzaHub. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-6">
            <Link
              href="/privacy"
              className="text-xs text-white/45 transition hover:text-[#D0AD78]"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms"
              className="text-xs text-white/45 transition hover:text-[#D0AD78]"
            >
              Terms of Service
            </Link>
          </div>

          <p className="flex items-center gap-1 text-xs text-white/45">
            Made with <Heart size={12} className="text-[#C69B62]" /> and care.
          </p>
        </div>

      </div>
    </footer>
  );
}
