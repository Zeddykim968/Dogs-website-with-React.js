import Hero from "@/home/Hero";
import FeaturedPuppies from "@/home/FeaturedPuppies";
import PopularBreeds from "@/home/PopularBreeds";
import WhyChooseUs from "@/home/WhyChooseUs";
import HowItWorks from "@/home/HowItWorks";
import Testimonials from "@/home/Testimonials";
import InstagramSection from "@/home/InstagramSection";
import FinalCTA from "@/home/FinalCTA";

export default function HomePage() {
  return (
    <>
      <Hero />

      <FeaturedPuppies />

      <PopularBreeds />

      <WhyChooseUs />

      <HowItWorks />

      <Testimonials />

      <FinalCTA />

      <InstagramSection />
    </>
  );
}