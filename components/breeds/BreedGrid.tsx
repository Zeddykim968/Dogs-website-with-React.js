import BreedCard from "./BreedCard";
import { getPuppies } from "@/lib/data/queries";
import type { Breed } from "@/lib/data/breeds";

interface BreedGridProps {
  breeds: Breed[];
}

export default async function BreedGrid({ breeds }: BreedGridProps) {
  const puppies = await getPuppies();

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {breeds.map((breed) => (
        <BreedCard
          key={breed.id}
          breed={breed}
          availableCount={
            puppies.filter(
              (puppy) =>
                puppy.breedSlug === breed.slug &&
                puppy.status === "Available",
            ).length
          }
        />
      ))}
    </div>
  );
}