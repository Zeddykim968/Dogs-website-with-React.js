import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";

import BreedGrid from "@/components/breeds/BreedGrid";
import { breeds } from "@/lib/data/breeds";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Breeds",
  description:
    "Explore the dog breeds available at Puppy Paradise and find a companion whose personality fits your lifestyle.",
};

export default function BreedsPage() {
  return (
    <main className="min-h-screen bg-[#faf9f6]">
      {/* Header */}
      <section className="bg-[#4d3827] px-6 pb-16 pt-32 text-white lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#d9c2a6]">
            Find Your Breed
          </p>

          <h1 className="mt-4 text-5xl font-bold tracking-tight md:text-6xl">
            Our breeds
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/70">
            Explore the breeds our families love most and learn which
            companion fits your home, lifestyle and energy.
          </p>
        </div>
      </section>

      {/* Breed grid */}
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="mb-6">
          <p className="text-sm text-[#6b7280]">
            Showing{" "}
            <span className="font-semibold text-[#1f2937]">
              {breeds.length}
            </span>{" "}
            {breeds.length === 1 ? "breed" : "breeds"}
          </p>
        </div>

        <BreedGrid breeds={breeds} />
      </section>

      {/* Help choosing */}
      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">
        <div className="rounded-[2rem] bg-[#4d3827] px-8 py-14 text-center text-white md:px-16">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#d9c2a6]">
            Need Help Choosing?
          </p>

          <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-bold tracking-tight md:text-4xl">
            Tell us about your home and we will help you find the right breed
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/70">
            Every family is different. Share your living space, activity level
            and experience and we will point you towards a companion that
            matches your lifestyle.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href={`https://wa.me/${SITE_CONFIG.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 font-semibold text-[#4d3827] transition-all hover:bg-[#f3efe8] hover:shadow-xl"
            >
              <MessageCircle size={18} />
              Chat With Us
            </a>

            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-7 py-3.5 font-semibold text-white transition-all hover:border-white hover:bg-white/10"
            >
              Contact Us
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
