import {
  CheckCircle2,
  MapPin,
  CalendarDays,
  VenusAndMars,
} from "lucide-react";
import type { Puppy } from "@/lib/data/puppies";

interface PuppyInfoProps {
  puppy: Puppy;
}

export default function PuppyInfo({ puppy }: PuppyInfoProps) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <span
          className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
            puppy.status === "Available"
              ? "bg-[#e8f1e7] text-[#42613d]"
              : "bg-[#eee9e2] text-[#6b4f35]"
          }`}
        >
          {puppy.status}
        </span>

        <span className="text-sm text-[#8b6f47]">
          {puppy.breed}
        </span>
      </div>

      <h1 className="mt-5 text-4xl font-bold tracking-tight text-[#1f2937] md:text-5xl">
        Meet {puppy.name}
      </h1>

      <p className="mt-4 text-base leading-7 text-[#6b7280]">
        {puppy.description}
      </p>

      <div className="mt-7 text-2xl font-bold text-[#4d3827]">
        KSh {puppy.price.toLocaleString()}
      </div>

      <div className="mt-7 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-[#faf9f6] p-4">
          <CalendarDays size={19} className="text-[#8b6f47]" />

          <p className="mt-3 text-xs text-[#9ca3af]">
            Age
          </p>

          <p className="mt-1 font-semibold text-[#1f2937]">
            {puppy.age}
          </p>
        </div>

        <div className="rounded-2xl bg-[#faf9f6] p-4">
          <VenusAndMars size={19} className="text-[#8b6f47]" />

          <p className="mt-3 text-xs text-[#9ca3af]">
            Gender
          </p>

          <p className="mt-1 font-semibold text-[#1f2937]">
            {puppy.gender}
          </p>
        </div>

        <div className="rounded-2xl bg-[#faf9f6] p-4">
          <MapPin size={19} className="text-[#8b6f47]" />

          <p className="mt-3 text-xs text-[#9ca3af]">
            Location
          </p>

          <p className="mt-1 font-semibold text-[#1f2937]">
            {puppy.location}
          </p>
        </div>

        <div className="rounded-2xl bg-[#faf9f6] p-4">
          <CheckCircle2 size={19} className="text-[#8b6f47]" />

          <p className="mt-3 text-xs text-[#9ca3af]">
            Health
          </p>

          <p className="mt-1 font-semibold text-[#1f2937]">
            {puppy.vaccinated ? "Vaccinated" : "Check details"}
          </p>
        </div>
      </div>

      {/* Temperament */}
      <div className="mt-7">
        <h2 className="font-bold text-[#1f2937]">
          Personality
        </h2>

        <div className="mt-3 flex flex-wrap gap-2">
          {puppy.temperament.map((trait) => (
            <span
              key={trait}
              className="rounded-full bg-[#f3efe8] px-4 py-2 text-sm text-[#6b4f35]"
            >
              {trait}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}