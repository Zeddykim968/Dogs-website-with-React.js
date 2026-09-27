import Hero from "@/components/home/Hero";
import FeaturedPuppies from "@/components/home/FeaturedPuppies";
import PopularBreeds from "@/components/home/PopularBreeds";
import WhyChooseUs from "@/components/home/WhyChooseUs";

export default function HomePage() {
  return (
    <>
      <Hero />

      <FeaturedPuppies />

      <PopularBreeds />

      <WhyChooseUs />
    </>
  );
}