import BreedCard from "./BreedCard";
import type { Breed } from "@/lib/data/breeds";

interface BreedGridProps {
  breeds: Breed[];
}

export default function BreedGrid({ breeds }: BreedGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {breeds.map((breed) => (
        <BreedCard key={breed.id} breed={breed} />
      ))}
    </div>
  );
}