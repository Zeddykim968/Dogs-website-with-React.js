"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { breeds } from "@/lib/data/breeds";

interface PuppyFiltersProps {
  search: string;
  breed: string;
  gender: string;
  availability: string;
  onSearchChange: (value: string) => void;
  onBreedChange: (value: string) => void;
  onGenderChange: (value: string) => void;
  onAvailabilityChange: (value: string) => void;
}

export default function PuppyFilters({
  search,
  breed,
  gender,
  availability,
  onSearchChange,
  onBreedChange,
  onGenderChange,
  onAvailabilityChange,
}: PuppyFiltersProps) {
  return (
    <div className="rounded-3xl border border-[#e8e2da] bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center gap-2">
        <SlidersHorizontal size={18} className="text-[#6b4f35]" />

        <h2 className="font-semibold text-[#1f2937]">
          Find your puppy
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Search */}
        <div className="relative lg:col-span-1">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9ca3af]"
          />

          <input
            type="text"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search puppies..."
            className="w-full rounded-2xl border border-[#e5dfd7] bg-[#faf9f6] py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#8b6f47]"
          />
        </div>

        {/* Breed */}
        <select
          value={breed}
          onChange={(event) => onBreedChange(event.target.value)}
          className="rounded-2xl border border-[#e5dfd7] bg-[#faf9f6] px-4 py-3 text-sm text-[#4b5563] outline-none focus:border-[#8b6f47]"
        >
          <option value="all">All breeds</option>
          {breeds.map((breed) => (
            <option key={breed.slug} value={breed.slug}>
              {breed.name}
            </option>
          ))}
        </select>

        {/* Gender */}
        <select
          value={gender}
          onChange={(event) => onGenderChange(event.target.value)}
          className="rounded-2xl border border-[#e5dfd7] bg-[#faf9f6] px-4 py-3 text-sm text-[#4b5563] outline-none focus:border-[#8b6f47]"
        >
          <option value="all">All genders</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        {/* Availability */}
        <select
          value={availability}
          onChange={(event) => onAvailabilityChange(event.target.value)}
          className="rounded-2xl border border-[#e5dfd7] bg-[#faf9f6] px-4 py-3 text-sm text-[#4b5563] outline-none focus:border-[#8b6f47]"
        >
          <option value="all">All puppies</option>
          <option value="Available">Available</option>
          <option value="Reserved">Reserved</option>
          <option value="Sold">Sold</option>
        </select>
      </div>
    </div>
  );
}