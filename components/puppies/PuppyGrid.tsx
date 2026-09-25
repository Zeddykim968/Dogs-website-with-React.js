import PuppyCard from "./PuppyCard";
import type { Puppy } from "@/lib/data/puppies";

interface PuppyGridProps {
  puppies: Puppy[];
}

export default function PuppyGrid({ puppies }: PuppyGridProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {puppies.map((puppy) => (
        <PuppyCard key={puppy.id} puppy={puppy} />
      ))}
    </div>
  );
}