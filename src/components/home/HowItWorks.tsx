
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
      "Browse our carefully curated pizza collection and discover the flavours that make your day special.",
    icon: Search,
    label: "FIND YOUR FAVOURITE",
  },
  {
    number: "02",
    title: "Place Your Order",
    description:
      "Choose your favourite pizza, customize your selection, and place your order in just a few simple steps.",
    icon: ShoppingBag,
    label: "A FEW SIMPLE CLICKS",
  },
  {
    number: "03",
    title: "Enjoy Every Slice",
    description:
      "Our team prepares your order fresh and delivers it to your doorstep, ready to be enjoyed.",
    icon: Bike,
    label: "FRESH TO YOUR DOOR",
  },
];

export default function HowItWorks() {
  return (
    <section className="relative overflow-hidden bg-[#172B25] px-5 py-24 text-[#F2EBDD] sm:px-8 lg:px-12 lg:py-32">

      {/* Background Decoration */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full border border-white/[0.06]" />
      <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full border border-white/[0.06]" />

      <div className="relative mx-auto max-w-7xl">

        {/* Section Heading */}
        <div className="mb-16 grid gap-8 md:grid-cols-2 md:items-end">

          <div>
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-10 bg-[#C69B62]" />
              <span className="text-[10px] font-bold uppercase tracking-[3px] text-[#D0AD78]">
                Simple By Design
              </span>
            </div>

            <h2 className="font-serif text-4xl leading-tight text-[#F2EBDD] sm:text-5xl lg:text-6xl">
              Great Pizza,
              <br />
              <span className="italic text-[#D0AD78]">
                Three Simple Steps.
              </span>
            </h2>
          </div>

          <div className="md:ml-auto md:max-w-md">
            <p className="text-sm leading-8 text-white/65">
              From discovering your favourite flavour to enjoying
              a freshly prepared pizza, we make every step simple
              and enjoyable.
            </p>
          </div>
        </div>

        {/* Steps */}
        <div className="grid gap-12 md:grid-cols-3 md:gap-8">

          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div key={step.number} className="relative">

                {/* Step Top */}
                <div className="mb-8 flex items-center justify-between border-b border-white/15 pb-5">

                  <span className="font-serif text-4xl text-[#D0AD78]/80">
                    {step.number}
                  </span>

                  <span className="text-[9px] font-bold tracking-[2px] text-white/45">
                    STEP {step.number}
                  </span>

                </div>

                {/* Icon */}
                <div className="mb-7 flex h-16 w-16 items-center justify-center border border-[#C69B62]/40 bg-[#29483A] text-[#D0AD78]">
                  <Icon size={27} strokeWidth={1.5} />
                </div>

                {/* Content */}
                <p className="mb-3 text-[9px] font-bold tracking-[2px] text-[#D0AD78]">
                  {step.label}
                </p>

                <h3 className="font-serif text-2xl text-[#F2EBDD] sm:text-3xl">
                  {step.title}
                </h3>

                <p className="mt-4 max-w-sm text-sm leading-7 text-white/60">
                  {step.description}
                </p>

                {/* Connector */}
                {index !== steps.length - 1 && (
                  <div className="mt-9 hidden items-center gap-3 text-[#C69B62]/70 md:flex">
                    <span className="h-px w-12 bg-[#C69B62]/40" />
                    <ArrowRight size={15} />
                  </div>
                )}

              </div>
            );
          })}

        </div>

        {/* Bottom CTA */}
        <div className="mt-20 flex flex-col items-start justify-between gap-6 border-t border-white/15 pt-8 sm:flex-row sm:items-center">

          <p className="font-serif text-xl italic text-white/75 sm:text-2xl">
            Your next favourite pizza is just a few clicks away.
          </p>

          <Link
            href="/menu"
            className="group inline-flex items-center gap-5 bg-[#C69B62] px-7 py-4 text-xs font-bold uppercase tracking-[1px] text-[#172B25] transition hover:bg-[#E0BB8C]"
          >
            Explore Our Menu
            <ArrowUpRight
              size={18}
              className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </Link>

        </div>

      </div>
    </section>
  );
}
