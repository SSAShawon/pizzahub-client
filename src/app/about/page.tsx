
import Link from "next/link";
import {
  ArrowRight,
  Heart,
  Leaf,
  Award,
  Users,
  ChefHat,
  Flame,
  Utensils,
} from "lucide-react";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

const values = [
  {
    icon: Leaf,
    title: "Fresh Ingredients",
    description:
      "We believe great pizza begins with great ingredients. Every ingredient is carefully selected for freshness and flavor.",
  },
  {
    icon: ChefHat,
    title: "Artisan Craft",
    description:
      "Every pizza is prepared with attention, passion, and respect for the art of authentic pizza making.",
  },
  {
    icon: Heart,
    title: "Made with Passion",
    description:
      "From the first preparation to the final slice, we put care and dedication into everything we serve.",
  },
  {
    icon: Users,
    title: "People First",
    description:
      "Our customers are at the heart of everything we do. Your happiness is the most meaningful reward.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#FBF8F1] text-[#24352C]">
      <Navbar />

      {/* Hero */}
      <section className="relative flex min-h-[420px] items-center overflow-hidden bg-[#172B25]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-35"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=2000&q=85')",
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#172B25] via-[#172B25]/85 to-[#172B25]/30" />

        <div className="relative mx-auto w-full max-w-7xl px-5 py-24 sm:px-8 lg:px-10">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.3em] text-[#C69B62]">
            A Little About Us
          </p>

          <h1 className="max-w-3xl font-serif text-4xl font-bold leading-tight text-[#F2EBDD] sm:text-5xl lg:text-6xl">
            More Than Pizza.
            <br />
            <span className="text-[#C69B62]">A Love for Every Slice.</span>
          </h1>

          <p className="mt-6 max-w-xl text-sm leading-7 text-[#F2EBDD]/80 sm:text-base">
            We bring people together through the simple joy of thoughtfully
            crafted pizza, quality ingredients, and unforgettable flavors.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:px-10 lg:py-20">
        <div className="relative">
          <div
            className="aspect-[5/4] overflow-hidden rounded-2xl bg-cover bg-center shadow-xl"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=1200&q=85')",
            }}
          />
          <div className="absolute -bottom-5 -right-3 rounded-xl bg-[#29483A] px-6 py-5 text-[#F2EBDD] shadow-lg sm:-right-5">
            <p className="font-serif text-2xl font-bold text-[#C69B62]">
              Made with
            </p>
            <p className="text-sm font-medium tracking-wide">Love & Passion</p>
          </div>
        </div>

        <div className="pt-4 lg:pt-0">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-[#A77C46]">
            Our Story
          </p>

          <h2 className="font-serif text-3xl font-bold leading-tight text-[#172B25] sm:text-4xl">
            Every Great Pizza
            <br />
            Begins with a Story.
          </h2>

          <div className="mt-6 space-y-4 text-sm leading-7 text-[#706F63] sm:text-base">
            <p>
              PizzaHub was built around a simple idea: good food has the power
              to bring people closer. A shared pizza, a familiar flavor, and a
              memorable moment can turn an ordinary day into something special.
            </p>

            <p>
              Our passion lies in celebrating the art of pizza through
              carefully chosen ingredients, thoughtful preparation, and a
              commitment to quality in every order.
            </p>

            <p>
              Whether it is a family dinner, a gathering with friends, or a
              quiet evening at home, we want every PizzaHub experience to feel
              special.
            </p>
          </div>

          <Link
            href="/menu"
            className="mt-7 inline-flex items-center gap-2 rounded-lg bg-[#29483A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#42634D]"
          >
            Explore Our Menu
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      {/* Philosophy */}
      <section className="bg-[#F2EBDD] px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-[#A77C46]">
              What We Believe
            </p>

            <h2 className="font-serif text-3xl font-bold leading-tight text-[#172B25] sm:text-4xl">
              Simple Ingredients.
              <br />
              Extraordinary Moments.
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-7 text-[#706F63] sm:text-base">
              We believe that the best food does not need unnecessary
              complexity. It needs quality ingredients, skilled preparation,
              and a genuine passion for making people happy.
            </p>

            <div className="mt-8 flex items-start gap-4">
              <div className="rounded-full bg-[#29483A] p-3 text-[#C69B62]">
                <Flame size={22} />
              </div>
              <div>
                <h3 className="font-semibold text-[#172B25]">
                  Crafted with Care
                </h3>
                <p className="mt-1 text-sm leading-6 text-[#706F63]">
                  Every detail matters, from preparation to presentation.
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-start gap-4">
              <div className="rounded-full bg-[#29483A] p-3 text-[#C69B62]">
                <Utensils size={22} />
              </div>
              <div>
                <h3 className="font-semibold text-[#172B25]">
                  Quality in Every Bite
                </h3>
                <p className="mt-1 text-sm leading-6 text-[#706F63]">
                  We strive to make every order worth looking forward to.
                </p>
              </div>
            </div>
          </div>

          <div
            className="aspect-[5/4] rounded-2xl bg-cover bg-center shadow-lg"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=1200&q=85')",
            }}
          />
        </div>
      </section>

      {/* Our Values */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-[#A77C46]">
            What Makes Us Different
          </p>

          <h2 className="font-serif text-3xl font-bold text-[#172B25] sm:text-4xl">
            The Values Behind Every Slice
          </h2>

          <p className="mt-4 text-sm leading-7 text-[#706F63] sm:text-base">
            Our values guide the way we prepare, serve, and deliver every
            PizzaHub experience.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value) => {
            const Icon = value.icon;

            return (
              <article
                key={value.title}
                className="rounded-2xl border border-[#DED8C9] bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-[#C69B62] hover:shadow-lg"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#29483A] text-[#C69B62]">
                  <Icon size={23} />
                </div>

                <h3 className="font-serif text-xl font-bold text-[#172B25]">
                  {value.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-[#706F63]">
                  {value.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      {/* Brand Promise */}
      <section className="relative overflow-hidden bg-[#172B25] px-5 py-16 text-center sm:px-8 lg:py-20">
        <div className="relative mx-auto max-w-3xl">
          <Award className="mx-auto mb-5 text-[#C69B62]" size={38} />

          <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-[#C69B62]">
            The PizzaHub Promise
          </p>

          <h2 className="font-serif text-3xl font-bold leading-tight text-[#F2EBDD] sm:text-4xl lg:text-5xl">
            Crafted with Passion.
            <br />
            <span className="text-[#C69B62]">Delivered with Love.</span>
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-[#F2EBDD]/75 sm:text-base">
            Every slice tells a story of care, flavor, and togetherness.
            Thank you for making PizzaHub part of your moments.
          </p>

          <Link
            href="/menu"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#C69B62] px-7 py-3.5 text-sm font-bold text-[#172B25] transition hover:bg-[#D8B47F]"
          >
            Find Your Favorite Pizza
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
