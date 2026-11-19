
import { Star, Quote, MessageCircle } from "lucide-react";

// Temporary preview testimonials — replace with genuine customer reviews later.
const reviews = [
  {
    id: 1,
    name: "Alex Morgan",
    role: "Pizza Enthusiast",
    initials: "AM",
    rating: 5,
    review:
      "The crust was beautifully baked, the ingredients tasted fresh, and every bite was full of flavour.",
  },
  {
    id: 2,
    name: "Sophia Williams",
    role: "Regular Customer",
    initials: "SW",
    rating: 5,
    review:
      "I love the attention to detail. From presentation to the balance of flavours, everything feels thoughtfully prepared.",
  },
  {
    id: 3,
    name: "Daniel Carter",
    role: "Food Lover",
    initials: "DC",
    rating: 5,
    review:
      "A wonderful combination of quality ingredients and great preparation. Every bite makes me want more.",
  },
];

export default function CustomerReviews() {
  return (
    <section className="bg-[#FBF8F1] px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
      <div className="mx-auto max-w-7xl">
        {/* Section Heading */}
        <div className="mb-9 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-8 bg-[#C69B62]" />
              <span className="text-[10px] font-bold uppercase tracking-[3px] text-[#71866B]">
                Words From Our Community
              </span>
            </div>

            <h2 className="font-serif text-3xl leading-tight text-[#172B25] sm:text-4xl lg:text-5xl">
              Every Slice Has
              <br />
              <span className="italic text-[#71866B]">
                a Story to Tell.
              </span>
            </h2>
          </div>

          <p className="max-w-sm text-sm leading-7 text-[#706F63]">
            Great food brings people together. Every memorable pizza
            experience deserves to be shared.
          </p>
        </div>

        {/* Review Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, index) => (
            <article
              key={review.id}
              className={`flex h-full min-h-[265px] flex-col rounded-xl border border-[#DED8C9] p-5 sm:p-6 ${
                index === 1
                  ? "bg-[#172B25] text-[#F2EBDD]"
                  : "bg-[#F2EBDD] text-[#172B25]"
              }`}
            >
              {/* Top */}
              <div className="mb-5 flex items-center justify-between">
                <Quote
                  size={27}
                  strokeWidth={1.4}
                  className="text-[#C69B62]"
                />

                <span
                  className={`text-[9px] font-bold tracking-[1.5px] ${
                    index === 1 ? "text-white/40" : "text-[#8A896F]"
                  }`}
                >
                  PREVIEW 0{review.id}
                </span>
              </div>

              {/* Stars */}
              <div className="mb-4 flex items-center gap-1">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star
                    key={i}
                    size={13}
                    fill="currentColor"
                    className="text-[#C69B62]"
                  />
                ))}
              </div>

              {/* Review */}
              <p
                className={`flex-1 font-serif text-lg leading-7 ${
                  index === 1 ? "text-[#F2EBDD]" : "text-[#29483A]"
                }`}
              >
                &ldquo;{review.review}&rdquo;
              </p>

              {/* Customer */}
              <div
                className={`mt-6 flex items-center gap-3 border-t pt-4 ${
                  index === 1 ? "border-white/20" : "border-[#DED8C9]"
                }`}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#29483A] font-serif text-xs text-[#F2EBDD]">
                  {review.initials}
                </div>

                <div>
                  <h3 className="text-sm font-semibold">
                    {review.name}
                  </h3>
                  <p
                    className={`mt-0.5 text-[10px] ${
                      index === 1 ? "text-white/55" : "text-[#8A896F]"
                    }`}
                  >
                    {review.role}
                  </p>
                </div>

                <MessageCircle
                  size={16}
                  className="ml-auto text-[#C69B62]"
                />
              </div>
            </article>
          ))}
        </div>

        {/* Bottom Note */}
        <div className="mt-7 flex flex-col items-center justify-between gap-3 border-t border-[#DED8C8] pt-5 sm:flex-row">
          <p className="font-serif text-lg italic text-[#71866B]">
            Good food. Great company. Beautiful memories.
          </p>

          <span className="text-[9px] font-bold uppercase tracking-[2px] text-[#8A896F]">
            PIZZA • QUALITY • PASSION
          </span>
        </div>
      </div>
    </section>
  );
}
