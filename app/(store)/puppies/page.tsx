import PuppiesExplorer from "@/components/puppies/PuppiesExplorer";
import { getBreeds, getPuppies } from "@/lib/data/queries";

export const dynamic = "force-dynamic";

interface PuppiesPageProps {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
}

export default async function PuppiesPage({ searchParams }: PuppiesPageProps) {
  const params = await searchParams;

  const requestedBreed =
    typeof params.breed === "string" ? params.breed : "all";

  const [puppies, breeds] = await Promise.all([getPuppies(), getBreeds()]);

  const initialBreed = breeds.some((item) => item.slug === requestedBreed)
    ? requestedBreed
    : "all";

  return (
    <PuppiesExplorer
      puppies={puppies}
      breeds={breeds}
      initialBreed={initialBreed}
    />
  );
}