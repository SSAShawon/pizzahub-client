import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ArrowRight, Flame, Leaf } from "lucide-react";

// Temporary preview data — MongoDB API integration will come later.
const pizzas = [
  {
    id: 1,
    name: "Margherita Classic",
    subtitle: "The timeless original",
    category: "SIGNATURE SELECTION",
    description:
      "Fresh mozzarella, slow-cooked tomato sauce, fragrant basil, and our handcrafted artisan crust.",
    price: 590,
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=1100&auto=format&fit=crop&q=85",
  },
  {
    id: 2,
    name: "Smoky Pepperoni",
    subtitle: "Bold. Rich. Unforgettable.",
    category: "THE CLASSICS",
    description:
      "Premium pepperoni, creamy mozzarella, and a rich tomato base with a beautifully baked crust.",
    price: 690,
    image:
      "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=900&auto=format&fit=crop&q=85",
  },
  {
    id: 3,
    name: "Garden Harvest",
    subtitle: "Fresh from the garden",
    category: "FRESH PICKS",
    description:
      "A colourful blend of garden vegetables, melted mozzarella, and aromatic herbs.",
    price: 620,
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=900&auto=format&fit=crop&q=85",
  },
];

export default function FeaturedPizzas() {
  return (
    <section className="bg-[#FBF8F1] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
      <div className="mx-auto max-w-7xl">
        {/* Section Heading */}
        <div className="mb-14 flex flex-col gap-7 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-10 bg-[#C69B62]" />
              <span className="text-[10px] font-bold uppercase tracking-[3px] text-[#71866B]">
                A Taste Worth Remembering
              </span>
            </div>

            <h2 className="font-serif text-4xl leading-[1.12] text-[#172B25] sm:text-5xl lg:text-6xl">
              A Few of Our
              <br />
              <span className="italic text-[#71866B]">
                Favourite Creations.
              </span>
            </h2>
          </div>

          <div className="max-w-md">
            <p className="text-sm leading-8 text-[#706F63]">
              From timeless favourites to bold new combinations, every creation
              is made with carefully selected ingredients and a little extra
              love.
            </p>

            <Link
              href="/menu"
              className="mt-5 inline-flex items-center gap-3 border-b border-[#29483A] pb-2 text-xs font-bold uppercase tracking-[1.5px] text-[#29483A] transition hover:text-[#C69B62]"
            >
              Explore The Menu
              <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>

        {/* Pizza Grid */}
        <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
          {pizzas.map((pizza, index) => (
            <article key={pizza.id} className="group flex h-full flex-col">
              {/* Image */}
              <div className="relative aspect-[4/4.5] overflow-hidden bg-[#E8E1D3]">
                <Image
                  src={pizza.image}
                  alt={pizza.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Image Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#172B25]/45 via-transparent to-transparent" />

                {/* Category */}
                <div className="absolute left-5 top-5">
                  <span className="bg-[#FBF8F1] px-4 py-2 text-[9px] font-bold tracking-[1.8px] text-[#29483A]">
                    {pizza.category}
                  </span>
                </div>

                {/* Index */}
                <div className="absolute bottom-5 right-5 flex h-11 w-11 items-center justify-center rounded-full border border-white/60 bg-[#172B25]/35 font-serif text-sm text-white backdrop-blur-sm">
                  0{index + 1}
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col border-b border-[#DED8C9] bg-[#FBF8F1] px-1 pb-6 pt-7">
                <div className="mb-3 flex items-center gap-2">
                  {index === 0 ? (
                    <Flame size={14} className="text-[#C69B62]" />
                  ) : (
                    <Leaf size={14} className="text-[#71866B]" />
                  )}

                  <span className="text-[9px] font-bold uppercase tracking-[2px] text-[#71866B]">
                    {pizza.subtitle}
                  </span>
                </div>

                <h3 className="font-serif text-2xl text-[#172B25] sm:text-3xl">
                  {pizza.name}
                </h3>

                <p className="mt-3 min-h-[72px] text-sm leading-7 text-[#706F63]">
                  {pizza.description}
                </p>

                <div className="mt-6 flex items-center justify-between border-t border-[#DED8C9] pt-5">
                  <div>
                    <span className="text-[9px] font-semibold uppercase tracking-[1.5px] text-[#8B887B]">
                      Starting from
                    </span>
                    <p className="mt-1 font-serif text-2xl text-[#29483A]">
                      ৳{pizza.price}
                    </p>
                  </div>

                  <Link
                    href="/menu"
                    aria-label={`Explore ${pizza.name}`}
                    className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[1px] text-[#29483A] transition hover:text-[#C69B62]"
                  >
                    Discover
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom Brand Message */}
        <div className="mt-16 border-t border-[#DED8C9] pt-8 text-center">
          <p className="font-serif text-xl italic text-[#71866B] sm:text-2xl">
            Crafted with Passion. Delivered with Love.
          </p>
        </div>
      </div>
    </section>
  );
}
