"use client";

import { use, useMemo, useState } from "react";
import PuppyGrid from "@/components/puppies/PuppyGrid";
import PuppyFilters from "@/components/puppies/PuppyFilters";
import { puppies } from "@/lib/data/puppies";
import { breeds } from "@/lib/data/breeds";

interface PuppiesPageProps {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
}

export default function PuppiesPage({ searchParams }: PuppiesPageProps) {
  const params = use(searchParams);

  const requestedBreed =
    typeof params.breed === "string" ? params.breed : "all";

  const initialBreed = breeds.some((item) => item.slug === requestedBreed)
    ? requestedBreed
    : "all";

  const [search, setSearch] = useState("");
  const [breed, setBreed] = useState(initialBreed);
  const [gender, setGender] = useState("all");
  const [availability, setAvailability] = useState("all");

  const filteredPuppies = useMemo(() => {
    return puppies.filter((puppy) => {
      const matchesSearch =
        puppy.name.toLowerCase().includes(search.toLowerCase()) ||
        puppy.breed.toLowerCase().includes(search.toLowerCase());

      const matchesBreed =
        breed === "all" || puppy.breedSlug === breed;

      const matchesGender =
        gender === "all" || puppy.gender === gender;

      const matchesAvailability =
        availability === "all" ||
        puppy.status === availability;

      return (
        matchesSearch &&
        matchesBreed &&
        matchesGender &&
        matchesAvailability
      );
    });
  }, [search, breed, gender, availability]);

  return (
    <main className="min-h-screen bg-[#faf9f6]">
      {/* Header */}
      <section className="bg-[#4d3827] px-6 pb-16 pt-32 text-white lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#d9c2a6]">
            Find Your Companion
          </p>

          <h1 className="mt-4 text-5xl font-bold tracking-tight md:text-6xl">
            Available puppies
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/70">
            Explore our puppies and find a companion whose personality,
            breed and energy match your lifestyle.
          </p>
        </div>
      </section>

      {/* Marketplace */}
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <PuppyFilters
          search={search}
          breed={breed}
          gender={gender}
          availability={availability}
          onSearchChange={setSearch}
          onBreedChange={setBreed}
          onGenderChange={setGender}
          onAvailabilityChange={setAvailability}
        />

        <div className="mb-6 mt-10">
          <p className="text-sm text-[#6b7280]">
            Showing{" "}
            <span className="font-semibold text-[#1f2937]">
              {filteredPuppies.length}
            </span>{" "}
            {filteredPuppies.length === 1 ? "puppy" : "puppies"}
          </p>
        </div>

        <PuppyGrid puppies={filteredPuppies} />
      </section>
    </main>
  );
}