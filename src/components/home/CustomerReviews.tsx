
import {
  Star,
  Quote,
  ArrowLeft,
  ArrowRight,
  MessageCircle,
} from "lucide-react";

// Temporary preview testimonials — replace with genuine customer reviews later.
const reviews = [
  {
    id: 1,
    name: "Alex Morgan",
    role: "Pizza Enthusiast",
    initials: "AM",
    rating: 5,
    review:
      "The crust was beautifully baked, the ingredients tasted fresh, and every bite was full of flavour. Definitely a pizza experience worth remembering.",
  },
  {
    id: 2,
    name: "Sophia Williams",
    role: "Regular Customer",
    initials: "SW",
    rating: 5,
    review:
      "I love the attention to detail. From the presentation to the balance of flavours, everything feels thoughtfully prepared.",
  },
  {
    id: 3,
    name: "Daniel Carter",
    role: "Food Lover",
    initials: "DC",
    rating: 5,
    review:
      "A wonderful combination of quality ingredients and great preparation. The whole experience makes me want to explore more of the menu.",
  },
];

export default function CustomerReviews() {
  return (
    <section className="bg-[#FBF8F1] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
      <div className="mx-auto max-w-7xl">

        {/* Section Heading */}
        <div className="mb-16 flex flex-col justify-between gap-8 md:flex-row md:items-end">

          <div>
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-10 bg-[#C69B62]" />
              <span className="text-[10px] font-bold uppercase tracking-[3px] text-[#71866B]">
                Words From Our Community
              </span>
            </div>

            <h2 className="font-serif text-4xl leading-tight text-[#172B25] sm:text-5xl lg:text-6xl">
              Every Slice Has
              <br />
              <span className="italic text-[#71866B]">
                a Story to Tell.
              </span>
            </h2>
          </div>

          <div className="max-w-sm">
            <p className="text-sm leading-8 text-[#706F63]">
              Great food brings people together. We believe every
              memorable pizza experience deserves to be shared.
            </p>
          </div>

        </div>

        {/* Review Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          {reviews.map((review, index) => (
            <article
              key={review.id}
              className={`relative flex h-full flex-col border border-[#DED8C9] p-7 sm:p-9 ${
                index === 1
                  ? "bg-[#172B25] text-[#F2EBDD]"
                  : "bg-[#F2EBDD] text-[#172B25]"
              }`}
            >

              {/* Quote Icon */}
              <div className="mb-8 flex items-center justify-between">
                <Quote
                  size={34}
                  strokeWidth={1.3}
                  className={
                    index === 1
                      ? "text-[#D0AD78]"
                      : "text-[#C69B62]"
                  }
                />

                <span
                  className={`text-[9px] font-bold tracking-[2px] ${
                    index === 1
                      ? "text-white/40"
                      : "text-[#8A896F]"
                  }`}
                >
                  CUSTOMER STORY 0{review.id}
                </span>
              </div>

              {/* Stars */}
              <div className="mb-6 flex items-center gap-1">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    fill="currentColor"
                    className="text-[#C69B62]"
                  />
                ))}
              </div>

              {/* Review */}
              <p
                className={`flex-1 font-serif text-xl leading-9 ${
                  index === 1
                    ? "text-[#F2EBDD]"
                    : "text-[#29483A]"
                }`}
              >
                &ldquo;{review.review}&rdquo;
              </p>

              {/* Customer */}
              <div
                className={`mt-9 flex items-center gap-4 border-t pt-6 ${
                  index === 1
                    ? "border-white/20"
                    : "border-[#DED8C9]"
                }`}
              >

                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-serif text-sm ${
                    index === 1
                      ? "bg-[#42634D] text-[#F2EBDD]"
                      : "bg-[#29483A] text-[#F2EBDD]"
                  }`}
                >
                  {review.initials}
                </div>

                <div>
                  <h3 className="font-semibold text-sm">
                    {review.name}
                  </h3>

                  <p
                    className={`mt-1 text-[10px] ${
                      index === 1
                        ? "text-white/55"
                        : "text-[#8A896F]"
                    }`}
                  >
                    {review.role}
                  </p>
                </div>

                <div className="ml-auto">
                  <MessageCircle
                    size={17}
                    className={
                      index === 1
                        ? "text-[#D0AD78]"
                        : "text-[#71866B]"
                    }
                  />
                </div>

              </div>
            </article>
          ))}

        </div>

        {/* Bottom Note */}
        <div className="mt-12 flex flex-col items-center justify-between gap-5 border-t border-[#DED8C9] pt-8 sm:flex-row">

          <p className="font-serif text-lg italic text-[#71866B] sm:text-xl">
            Good food. Great company. Beautiful memories.
          </p>

          <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[1.5px] text-[#29483A]">
            <span className="h-px w-8 bg-[#C69B62]" />
            Made for Sharing
            <span className="h-px w-8 bg-[#C69B62]" />
          </div>

        </div>

      </div>
    </section>
  );
}
