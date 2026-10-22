import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PuppyGrid from "@/components/puppies/PuppyGrid";
import { getFeaturedPuppies } from "@/lib/data/queries";

export default async function FeaturedPuppies() {
  const featuredPuppies = (await getFeaturedPuppies()).slice(0, 3);

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section heading */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8b6f47]">
              Meet Your Match
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#1f2937] md:text-4xl">
              Featured puppies
            </h2>

            <p className="mt-4 text-base leading-7 text-[#6b7280]">
              Take a look at some of our adorable puppies who are ready to
              find their new families.
            </p>
          </div>

          <Link
            href="/puppies"
            className="inline-flex w-fit items-center gap-2 font-semibold text-[#6b4f35] transition-all hover:gap-3"
          >
            View all puppies
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* Puppy cards */}
        <div className="mt-10">
          <PuppyGrid puppies={featuredPuppies} />
        </div>
      </div>
    </section>
  );
}