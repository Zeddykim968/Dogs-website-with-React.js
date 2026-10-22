"use client";

import { useMemo, useState } from "react";

import PuppyGrid from "./PuppyGrid";
import PuppyFilters from "./PuppyFilters";
import type { Breed } from "@/lib/data/breeds";
import type { Puppy } from "@/lib/data/puppies";

interface PuppiesExplorerProps {
  puppies: Puppy[];
  breeds: Breed[];
  initialBreed: string;
}

export default function PuppiesExplorer({
  puppies,
  breeds,
  initialBreed,
}: PuppiesExplorerProps) {
  const [search, setSearch] = useState("");
  const [breed, setBreed] = useState(initialBreed);
  const [gender, setGender] = useState("all");
  const [availability, setAvailability] = useState("all");

  const filteredPuppies = useMemo(() => {
    return puppies.filter((puppy) => {
      const matchesSearch =
        puppy.name.toLowerCase().includes(search.toLowerCase()) ||
        puppy.breed.toLowerCase().includes(search.toLowerCase());

      const matchesBreed = breed === "all" || puppy.breedSlug === breed;

      const matchesGender = gender === "all" || puppy.gender === gender;

      const matchesAvailability =
        availability === "all" || puppy.status === availability;

      return (
        matchesSearch && matchesBreed && matchesGender && matchesAvailability
      );
    });
  }, [puppies, search, breed, gender, availability]);

  return (
    <main className="min-h-screen bg-[#faf9f6]">
      {/* Header */}
      <section className="bg-[#4d3827] px-6 pb-12 pt-24 text-white lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#d9c2a6]">
            Find Your Companion
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
            Available puppies
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-white/70">
            Explore our puppies and find a companion whose personality, breed
            and energy match your lifestyle.
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
          breeds={breeds}
          onSearchChange={setSearch}
          onBreedChange={setBreed}
          onGenderChange={setGender}
          onAvailabilityChange={setAvailability}
        />

        <div className="mb-5 mt-8">
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
