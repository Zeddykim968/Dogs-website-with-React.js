import Link from "next/link";
import { ArrowRight } from "lucide-react";
import BreedGrid from "@/components/breeds/BreedGrid";
import { getBreeds } from "@/lib/data/queries";

export default async function PopularBreeds() {
  const breeds = await getBreeds();
  return (
    <section className="bg-[#faf9f6] py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8b6f47]">
              Find Your Breed
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#1f2937] md:text-4xl">
              Popular breeds
            </h2>

            <p className="mt-4 text-base leading-7 text-[#6b7280]">
              Explore some of the breeds our families love most and find the
              personality that fits your lifestyle.
            </p>
          </div>

          <Link
            href="/breeds"
            className="inline-flex w-fit items-center gap-2 font-semibold text-[#6b4f35] transition-all hover:gap-3"
          >
            Explore all breeds
            <ArrowRight size={18} />
          </Link>
        </div>

        <div className="mt-10">
          <BreedGrid breeds={breeds.slice(0, 6)} />
        </div>
      </div>
    </section>
  );
}