
import Link from "next/link";
import {
  Search,
  ShoppingBag,
  Bike,
  ArrowUpRight,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Explore Your Taste",
    description:
      "Browse our curated pizza collection and discover your favourite flavours.",
    icon: Search,
    label: "FIND YOUR FAVOURITE",
  },
  {
    number: "02",
    title: "Place Your Order",
    description:
      "Choose your favourite pizza and place your order in just a few clicks.",
    icon: ShoppingBag,
    label: "A FEW SIMPLE CLICKS",
  },
  {
    number: "03",
    title: "Enjoy Every Slice",
    description:
      "We prepare your pizza fresh and deliver it straight to your doorstep.",
    icon: Bike,
    label: "FRESH TO YOUR DOOR",
  },
];

export default function HowItWorks() {
  return (
    <section className="relative overflow-hidden bg-[#172B25] px-5 py-16 text-[#F2EBDD] sm:px-8 lg:px-12 lg:py-20">
      {/* Background Decoration */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border border-white/[0.06]" />
      <div className="pointer-events-none absolute -right-12 -top-12 h-52 w-52 rounded-full border border-white/[0.06]" />

      <div className="relative mx-auto max-w-7xl">
        {/* Section Heading */}
        <div className="mb-10 grid gap-4 md:grid-cols-2 md:items-end">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-8 bg-[#C69B62]" />
              <span className="text-[10px] font-bold uppercase tracking-[3px] text-[#D0AD78]">
                Simple By Design
              </span>
            </div>

            <h2 className="font-serif text-3xl leading-tight text-[#F2EBDD] sm:text-4xl lg:text-5xl">
              Great Pizza,
              <br />
              <span className="italic text-[#D0AD78]">
                Three Simple Steps.
              </span>
            </h2>
          </div>

          <p className="max-w-md text-sm leading-7 text-white/65 md:ml-auto">
            From discovering your favourite flavour to enjoying a freshly
            prepared pizza, we make every step simple and enjoyable.
          </p>
        </div>

        {/* Steps */}
        <div className="grid gap-5 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="relative rounded-xl border border-white/10 bg-white/[0.035] p-5 transition-colors hover:border-[#C69B62]/40 hover:bg-white/[0.06] sm:p-6"
              >
                {/* Number and Icon */}
                <div className="mb-5 flex items-center justify-between">
                  <span className="font-serif text-3xl text-[#D0AD78]">
                    {step.number}
                  </span>

                  <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#C69B62]/30 bg-[#29483A] text-[#D0AD78]">
                    <Icon size={21} strokeWidth={1.6} />
                  </div>
                </div>

                {/* Content */}
                <p className="mb-2 text-[9px] font-bold tracking-[2px] text-[#D0AD78]">
                  {step.label}
                </p>

                <h3 className="font-serif text-xl text-[#F2EBDD]">
                  {step.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-white/60">
                  {step.description}
                </p>

                {/* Connector */}
                {index !== 2 && (
                  <div className="absolute -right-4 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full border border-[#C69B62]/30 bg-[#172B25] p-1.5 text-[#D0AD78] md:flex">
                    <ArrowRight size={14} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-9 flex flex-col items-start justify-between gap-4 border-t border-white/15 pt-6 sm:flex-row sm:items-center">
          <p className="font-serif text-lg italic text-white/75 sm:text-xl">
            Your next favourite pizza is just a few clicks away.
          </p>

          <Link
            href="/menu"
            className="group inline-flex items-center gap-4 bg-[#C69B62] px-6 py-3.5 text-xs font-bold uppercase tracking-[1px] text-[#172B25] transition hover:bg-[#E0BB8C]"
          >
            Explore Our Menu
            <ArrowUpRight
              size={17}
              className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
