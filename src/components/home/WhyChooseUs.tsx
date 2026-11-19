
import {
  Leaf,
  Wheat,
  Clock,
  Heart,
  ArrowUpRight,
} from "lucide-react";

const features = [
  {
    number: "01",
    title: "Fresh Ingredients",
    description:
      "Quality ingredients bring natural flavour and freshness to every slice.",
    icon: Leaf,
    detail: "QUALITY IN EVERY BITE",
  },
  {
    number: "02",
    title: "Handcrafted Dough",
    description:
      "Our artisan dough creates a perfectly balanced crust with every bake.",
    icon: Wheat,
    detail: "MADE WITH CARE",
  },
  {
    number: "03",
    title: "Reliable Delivery",
    description:
      "Freshly prepared pizza delivered to your doorstep with care.",
    icon: Clock,
    detail: "FRESH TO YOUR DOOR",
  },
  {
    number: "04",
    title: "Made with Passion",
    description:
      "Every pizza is prepared with genuine care and attention to detail.",
    icon: Heart,
    detail: "PASSION IN EVERY SLICE",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-[#F2EBDD] px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mb-7 grid gap-3 md:grid-cols-2 md:items-end">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <span className="h-px w-8 bg-[#C69B62]" />
              <span className="text-[10px] font-bold uppercase tracking-[3px] text-[#71866B]">
                The PizzaHub Difference
              </span>
            </div>

            <h2 className="font-serif text-3xl leading-tight text-[#172B25] sm:text-4xl lg:text-5xl">
              More Than Pizza.
              <br />
              <span className="italic text-[#71866B]">
                It&apos;s an Experience.
              </span>
            </h2>
          </div>

          <p className="max-w-md text-sm leading-6 text-[#706F63] md:ml-auto">
            Great pizza starts with great choices. From fresh ingredients
            to careful preparation, every detail matters.
          </p>
        </div>

        {/* Four Features in One Row */}
        <div className="grid grid-cols-2 border-l border-t border-[#D8D0BF] md:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.number}
                className="group flex min-h-[210px] flex-col border-b border-r border-[#D8D0BF] p-3 transition-colors hover:bg-[#FBF8F1] sm:p-5 lg:min-h-[220px] lg:p-4 xl:p-5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif text-2xl text-[#C69B62]">
                    {feature.number}
                  </span>

                  <ArrowUpRight
                    size={16}
                    className="text-[#A39B89] transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#C69B62]"
                  />
                </div>

                <div className="my-3 flex h-10 w-10 items-center justify-center border border-[#C69B62]/40 bg-[#FBF8F1] text-[#42634D] transition-colors group-hover:bg-[#29483A] group-hover:text-[#F2EBDD]">
                  <Icon size={19} strokeWidth={1.6} />
                </div>

                <div className="mt-auto">
                  <p className="mb-1 text-[8px] font-bold tracking-[1px] text-[#8A896F]">
                    {feature.detail}
                  </p>

                  <h3 className="font-serif text-lg leading-tight text-[#172B25]">
                    {feature.title}
                  </h3>

                  <p className="mt-2 line-clamp-3 text-xs leading-5 text-[#706F63]">
                    {feature.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>

        {/* Bottom Message */}
        <div className="mt-5 flex flex-col justify-between gap-2 border-b border-[#D8D0BF] pb-4 sm:flex-row sm:items-center">
          <p className="font-serif text-base italic text-[#42634D] sm:text-lg">
            Quality is never just an ingredient. It&apos;s our promise.
          </p>

          <span className="text-[9px] font-bold uppercase tracking-[2px] text-[#8A896F]">
            PIZZA • QUALITY • PASSION
          </span>
        </div>
      </div>
    </section>
  );
}
