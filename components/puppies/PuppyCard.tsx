import Link from "next/link";
import { MapPin, ArrowUpRight } from "lucide-react";
import type { Puppy } from "@/lib/data/puppies";

interface PuppyCardProps {
  puppy: Puppy;
}

export default function PuppyCard({ puppy }: PuppyCardProps) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-[#e5e1da] bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
      {/* Image */}
      <div className="relative overflow-hidden">
        <img
          src={puppy.image}
          alt={`${puppy.name} - ${puppy.breed}`}
          className="h-72 w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Availability */}
        <div className="absolute left-4 top-4">
          <span
            className={`rounded-full px-3 py-1.5 text-xs font-semibold backdrop-blur-md ${
              puppy.status === "Available"
                ? "bg-white/90 text-green-700"
                : puppy.status === "Reserved"
                  ? "bg-white/90 text-orange-700"
                  : "bg-white/90 text-red-700"
            }`}
          >
            {puppy.status}
          </span>
        </div>

        {/* View button */}
        <Link
          href={`/puppies/${puppy.id}`}
          className="absolute bottom-4 right-4 flex h-11 w-11 translate-y-3 items-center justify-center rounded-full bg-white text-[#4d3827] opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
          aria-label={`View ${puppy.name}`}
        >
          <ArrowUpRight size={20} />
        </Link>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-[#1f2937]">
              {puppy.name}
            </h3>

            <p className="mt-1 text-sm font-medium text-[#8b6f47]">
              {puppy.breed}
            </p>
          </div>

          <p className="text-lg font-bold text-[#4d3827]">
            KSh {puppy.price.toLocaleString()}
          </p>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#6b7280]">
          <span>{puppy.gender}</span>

          <span className="h-1 w-1 rounded-full bg-[#d9c2a6]" />

          <span>{puppy.age}</span>

          <span className="h-1 w-1 rounded-full bg-[#d9c2a6]" />

          <span className="flex items-center gap-1">
            <MapPin size={14} />
            {puppy.location}
          </span>
        </div>

        <Link
          href={`/puppies/${puppy.id}`}
          className="mt-5 flex w-full items-center justify-center rounded-full border border-[#d9c2a6] px-5 py-3 text-sm font-semibold text-[#4d3827] transition-all hover:border-[#6b4f35] hover:bg-[#6b4f35] hover:text-white"
        >
          View Puppy
        </Link>
      </div>
    </article>
  );
}