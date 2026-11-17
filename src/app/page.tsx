
import Navbar from "@/components/shared/Navbar";
import HeroSection from "@/components/home/HeroSection";
import FeaturedPizzas from "@/components/home/FeaturedPizzas";
import HowItWorks from "@/components/home/HowItWorks";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import CustomerReviews from "@/components/home/CustomerReviews";
import Footer from "@/components/shared/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FBF8F1]">
      <Navbar />

      <HeroSection />
      <FeaturedPizzas />
      <HowItWorks />
      <WhyChooseUs />
      <CustomerReviews />

      <Footer />
    </main>
  );
}
