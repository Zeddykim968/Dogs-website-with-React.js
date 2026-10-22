import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, MessageCircle } from "lucide-react";

import BreedGrid from "@/components/breeds/BreedGrid";
import PuppyGrid from "@/components/puppies/PuppyGrid";
import FinalCTA from "@/home/FinalCTA";
import { SITE_CONFIG } from "@/lib/constants";
import {
  getBreedBySlug,
  getBreedPuppies,
  getBreeds,
} from "@/lib/data/queries";

export const dynamic = "force-dynamic";

interface BreedDetailsPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: BreedDetailsPageProps): Promise<Metadata> {
  const { slug } = await params;

  const breed = await getBreedBySlug(slug);

  if (!breed) {
    return {
      title: "Breed not found",
    };
  }

  return {
    title: breed.name,
    description: `${breed.description} Browse available ${breed.name} puppies at ${SITE_CONFIG.name}.`,
  };
}

export default async function BreedDetailsPage({
  params,
}: BreedDetailsPageProps) {
  const { slug } = await params;

  const breed = await getBreedBySlug(slug);

  if (!breed) {
    notFound();
  }

  const breedPuppies = await getBreedPuppies(breed.slug);
  const availableCount = breedPuppies.filter(
    (puppy) => puppy.status === "Available",
  ).length;
  const listedCount = breedPuppies.length;
  const otherBreeds = (await getBreeds()).filter(
    (item) => item.slug !== breed.slug,
  );

  const availabilityLabel =
    availableCount > 0
      ? `${availableCount} ${availableCount === 1 ? "puppy" : "puppies"} available`
      : listedCount > 0
        ? "All reserved — ask about the waiting list"
        : "New litters coming soon";

  const message = encodeURIComponent(
    `Hello, I'm interested in ${breed.name} puppies. Could you let me know which ones are available?`,
  );

  const whatsappUrl = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${message}`;

  return (
    <main className="min-h-screen bg-[#faf9f6]">
      {/* Hero */}
      <section className="bg-[#4d3827] px-6 pb-12 pt-24 text-white lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/breeds"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#d9c2a6] transition hover:gap-3"
          >
            <ArrowLeft size={17} />
            Back to breeds
          </Link>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#d9c2a6]">
                Breed Profile
              </p>

              <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
                {breed.name}
              </h1>

              <p className="mt-4 max-w-xl text-base leading-7 text-white/70">
                {breed.description}
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <span className="rounded-full bg-white/10 px-4 py-2 text-sm text-white/85">
                  {availabilityLabel}
                </span>

                <span className="rounded-full bg-white/10 px-4 py-2 text-sm text-white/85">
                  Vaccinated &amp; dewormed
                </span>

                <span className="rounded-full bg-white/10 px-4 py-2 text-sm text-white/85">
                  {listedCount} {listedCount === 1 ? "puppy" : "puppies"} listed
                </span>
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="#puppies"
                  className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#4d3827] transition-all hover:bg-[#f3efe8] hover:shadow-xl"
                >
                  View {breed.name} puppies
                </a>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-3 text-sm font-semibold text-white transition-all hover:border-white hover:bg-white/10"
                >
                  <MessageCircle size={18} />
                  Ask About This Breed
                </a>
              </div>
            </div>

            <div className="overflow-hidden rounded-[2rem] bg-white/5 shadow-2xl">
              <img
                src={breed.image}
                alt={breed.name}
                className="h-[360px] w-full object-cover lg:h-[440px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Puppies of this breed */}
      <section
        id="puppies"
        className="mx-auto max-w-7xl scroll-mt-24 px-6 py-14 lg:px-8"
      >
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8b6f47]">
              Currently In Our Care
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#1f2937] md:text-4xl">
              {breed.name} puppies
            </h2>

            <p className="mt-4 text-base leading-7 text-[#6b7280]">
              {listedCount > 0
                ? `Meet the ${breed.name} puppies currently looking for a home. Each one comes with health records and ongoing support.`
                : `We do not have any ${breed.name} puppies listed right now, but new litters arrive regularly.`}
            </p>
          </div>

          <Link
            href={`/puppies?breed=${breed.slug}`}
            className="inline-flex w-fit items-center gap-2 font-semibold text-[#6b4f35] transition-all hover:gap-3"
          >
            Search in marketplace
            <ArrowRight size={18} />
          </Link>
        </div>

        <div className="mt-10">
          {listedCount > 0 ? (
            <PuppyGrid puppies={breedPuppies} />
          ) : (
            <div className="rounded-3xl border border-dashed border-[#d9d0c5] bg-white px-6 py-16 text-center">
              <h3 className="text-2xl font-bold text-[#1f2937]">
                No {breed.name} puppies listed right now
              </h3>

              <p className="mx-auto mt-3 max-w-xl leading-7 text-[#6b7280]">
                This breed can be reserved quickly. Message us to join the
                waiting list for the next litter, or browse the puppies we
                have available today.
              </p>

              <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#6b4f35] px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-[#4d3827] hover:shadow-lg"
                >
                  <MessageCircle size={18} />
                  Join The Waiting List
                </a>

                <Link
                  href="/puppies"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[#d9c2a6] px-5 py-3 text-sm font-semibold text-[#4d3827] transition-all hover:bg-[#f3efe8]"
                >
                  Browse All Puppies
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Other breeds */}
      {otherBreeds.length > 0 && (
        <section className="bg-white py-14">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8b6f47]">
                  Keep Exploring
                </p>

                <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#1f2937] md:text-4xl">
                  Other breeds
                </h2>
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
              <BreedGrid breeds={otherBreeds} />
            </div>
          </div>
        </section>
      )}

      <FinalCTA />
    </main>
  );
}
