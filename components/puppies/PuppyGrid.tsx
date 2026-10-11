import PuppyCard from "./PuppyCard";
import type { Puppy } from "@/lib/data/puppies";

interface PuppyGridProps {
  puppies: Puppy[];
}

export default function PuppyGrid({ puppies }: PuppyGridProps) {
  if (puppies.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-[#d9d0c5] bg-[#faf9f6] px-6 py-20 text-center">
        <h3 className="text-xl font-bold text-[#1f2937]">
          No puppies found
        </h3>

        <p className="mt-2 text-[#6b7280]">
          Try changing your search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {puppies.map((puppy) => (
        <PuppyCard key={puppy.id} puppy={puppy} />
      ))}
    </div>
  );
}