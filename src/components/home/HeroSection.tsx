
import Link from "next/link";
import {
  ArrowUpRight,
  ArrowRight,
  Leaf,
  Flame,
  Wheat,
} from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative isolate min-h-[720px] overflow-hidden bg-[#172B25] text-white">

      {/* Full Background Pizza Photography */}
      <div
        className="absolute inset-0 -z-20 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1513104890138-7c749659a591?w=2200&auto=format&fit=crop&q=90')",
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#101D18]/95 via-[#172B25]/75 to-[#172B25]/25" />

      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#101D18]/70 via-transparent to-transparent" />

      {/* Main Content */}
      <div className="relative mx-auto grid min-h-[720px] max-w-[1600px] items-center gap-16 px-6 py-20 sm:px-10 lg:grid-cols-[1.15fr_0.85fr] lg:px-16">

        {/* LEFT CONTENT */}
        <div className="max-w-2xl">

          <div className="mb-8 flex items-center gap-3">
            <span className="h-px w-10 bg-[#D0AD78]" />
            <span className="text-[11px] font-semibold uppercase tracking-[3px] text-[#E2BC86]">
              The Art of Authentic Pizza
            </span>
          </div>

          <h1 className="font-serif text-6xl font-semibold leading-[1.05] tracking-tight sm:text-7xl lg:text-[88px]">
            A Perfect
            <br />
            <span className="font-normal italic text-[#D0AD78]">
              Slice of
            </span>
            <br />
            Happiness.
          </h1>

          <p className="mt-8 max-w-lg text-base leading-8 text-white/75 sm:text-lg">
            Freshly prepared dough, rich flavors, and the finest
            ingredients come together to create something worth
            coming back for.
          </p>

          {/* Buttons */}
          <div className="mt-10 flex flex-wrap items-center gap-5">
            <Link
              href="/menu"
              className="group flex items-center gap-5 bg-[#C69B62] px-7 py-4 text-sm font-bold text-[#172B25] transition hover:bg-[#E0BB8C]"
            >
              Order Your Pizza
              <ArrowUpRight
                size={19}
                className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </Link>

            <Link
              href="/about"
              className="flex items-center gap-2 text-sm font-semibold text-white transition hover:text-[#D0AD78]"
            >
              Discover Our Story
              <ArrowRight size={17} />
            </Link>
          </div>

          {/* Bottom Details */}
          <div className="mt-16 flex flex-wrap items-center gap-x-9 gap-y-5 border-t border-white/20 pt-7">

            <div className="flex items-center gap-3">
              <Leaf size={20} className="text-[#D0AD78]" />
              <span className="text-xs font-medium text-white/85">
                Fresh Ingredients
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Flame size={20} className="text-[#D0AD78]" />
              <span className="text-xs font-medium text-white/85">
                Freshly Baked
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Wheat size={20} className="text-[#D0AD78]" />
              <span className="text-xs font-medium text-white/85">
                Handmade Dough
              </span>
            </div>

          </div>
        </div>

        {/* RIGHT SIDE - SIGNATURE PIZZA PANEL */}
        <div className="relative mx-auto w-full max-w-[390px] lg:ml-auto">

          {/* Vertical Label */}
          <div className="absolute -right-7 top-5 hidden -translate-y-full rotate-90 origin-bottom text-[9px] font-semibold uppercase tracking-[4px] text-white/70 sm:block">
            PizzaHub Signature Collection
          </div>

          {/* Glass Panel */}
          <div className="border border-white/25 bg-[#172B25]/65 p-7 shadow-2xl backdrop-blur-xl sm:p-9">

            <div className="flex items-center justify-between border-b border-white/20 pb-5">
              <span className="text-[10px] font-bold uppercase tracking-[3px] text-[#D0AD78]">
                Our Signature
              </span>
              <span className="font-serif text-sm italic text-white/60">
                No. 01
              </span>
            </div>

            <div className="py-8">
              <p className="text-xs uppercase tracking-[2px] text-white/60">
                A little masterpiece
              </p>

              <h2 className="mt-3 font-serif text-4xl italic text-white sm:text-5xl">
                The Classic
              </h2>

              <p className="mt-4 text-sm leading-7 text-white/70">
                A timeless combination of rich tomato,
                creamy mozzarella, fresh basil, and
                beautifully baked artisan crust.
              </p>
            </div>

            {/* Ingredient Details */}
            <div className="space-y-4 border-t border-white/20 py-6">

              <div className="flex items-center justify-between">
                <span className="text-xs text-white/70">
                  Fresh mozzarella
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-[#D0AD78]" />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-white/70">
                  Garden-fresh basil
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-[#D0AD78]" />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-white/70">
                  Signature tomato sauce
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-[#D0AD78]" />
              </div>

            </div>

            <Link
              href="/menu"
              className="group flex items-center justify-between border-t border-white/20 pt-6 text-sm font-semibold text-[#E2BC86] transition hover:text-white"
            >
              Explore All Pizzas
              <ArrowUpRight
                size={19}
                className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </Link>

          </div>

          {/* Small Brand Caption */}
          <p className="mt-5 text-center text-[9px] font-semibold uppercase tracking-[3px] text-white/55">
            Crafted with Passion. Delivered with Love.
          </p>

        </div>
      </div>
    </section>
  );
}
