
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
      "We carefully select quality ingredients to bring natural flavour, freshness, and satisfaction to every slice.",
    icon: Leaf,
    detail: "QUALITY IN EVERY BITE",
  },
  {
    number: "02",
    title: "Handcrafted Dough",
    description:
      "Our artisan dough is prepared with care, creating a beautifully balanced crust with every bake.",
    icon: Wheat,
    detail: "MADE WITH CARE",
  },
  {
    number: "03",
    title: "Reliable Delivery",
    description:
      "We value your time and work to bring your freshly prepared pizza to your doorstep.",
    icon: Clock,
    detail: "AT YOUR CONVENIENCE",
  },
  {
    number: "04",
    title: "Made with Passion",
    description:
      "From preparation to the final slice, we put genuine care into making your pizza experience special.",
    icon: Heart,
    detail: "PASSION IN EVERY SLICE",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-[#F2EBDD] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
      <div className="mx-auto max-w-7xl">

        {/* Heading */}
        <div className="mb-16 grid gap-8 lg:grid-cols-[1fr_0.7fr] lg:items-end">

          <div>
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-10 bg-[#C69B62]" />
              <span className="text-[10px] font-bold uppercase tracking-[3px] text-[#71866B]">
                The PizzaHub Difference
              </span>
            </div>

            <h2 className="font-serif text-4xl leading-tight text-[#172B25] sm:text-5xl lg:text-6xl">
              More Than Pizza.
              <br />
              <span className="italic text-[#71866B]">
                It&apos;s an Experience.
              </span>
            </h2>
          </div>

          <p className="max-w-md text-sm leading-8 text-[#706F63] lg:ml-auto">
            We believe great pizza starts with great choices.
            That&apos;s why every detail matters, from the ingredients
            we select to the care we put into every order.
          </p>

        </div>

        {/* Features */}
        <div className="grid border-l border-t border-[#D8D0BF] sm:grid-cols-2 lg:grid-cols-4">

          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.number}
                className="group flex min-h-[330px] flex-col border-b border-r border-[#D8D0BF] p-7 transition-colors hover:bg-[#FBF8F1] sm:p-8 lg:p-7 xl:p-9"
              >

                {/* Top */}
                <div className="flex items-center justify-between">
                  <span className="font-serif text-3xl text-[#C69B62]">
                    {feature.number}
                  </span>

                  <ArrowUpRight
                    size={18}
                    className="text-[#A39B89] transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#C69B62]"
                  />
                </div>

                {/* Icon */}
                <div className="my-8 flex h-14 w-14 items-center justify-center border border-[#C69B62]/40 bg-[#FBF8F1] text-[#42634D] transition-colors group-hover:bg-[#29483A] group-hover:text-[#F2EBDD]">
                  <Icon size={25} strokeWidth={1.5} />
                </div>

                {/* Content */}
                <div className="mt-auto">
                  <p className="mb-3 text-[9px] font-bold tracking-[1.7px] text-[#8A896F]">
                    {feature.detail}
                  </p>

                  <h3 className="font-serif text-2xl text-[#172B25]">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-xs leading-7 text-[#706F63]">
                    {feature.description}
                  </p>
                </div>

              </article>
            );
          })}

        </div>

        {/* Bottom Message */}
        <div className="mt-12 flex flex-col justify-between gap-5 border-b border-[#D8D0BF] pb-7 sm:flex-row sm:items-center">

          <p className="font-serif text-xl italic text-[#42634D] sm:text-2xl">
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
