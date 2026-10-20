import { puppies } from "./puppies";

export type Breed = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
};

export function getBreedPuppies(slug: string) {
  return puppies.filter((puppy) => puppy.breedSlug === slug);
}

export function getBreedAvailableCount(slug: string) {
  return getBreedPuppies(slug).filter(
    (puppy) => puppy.status === "Available",
  ).length;
}

export const breeds: Breed[] = [
  {
    id: "german-shepherd",
    name: "German Shepherd",
    slug: "german-shepherd",
    description:
      "Loyal, intelligent and protective companions for active families.",
    image:
      "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "golden-retriever",
    name: "Golden Retriever",
    slug: "golden-retriever",
    description:
      "Friendly, affectionate and playful dogs known for their gentle nature.",
    image:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "french-bulldog",
    name: "French Bulldog",
    slug: "french-bulldog",
    description:
      "Charming, adaptable and affectionate companions with a playful personality.",
    image:
      "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "rottweiler",
    name: "Rottweiler",
    slug: "rottweiler",
    description:
      "Confident, loyal and powerful companions with strong family bonds.",
    image:
      "https://images.unsplash.com/photo-1567752881298-894bb81f9379?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "labrador",
    name: "Labrador Retriever",
    slug: "labrador-retriever",
    description:
      "Energetic, intelligent and affectionate dogs that love being around people.",
    image:
      "https://images.unsplash.com/photo-1591769225440-811ad7d6eab2?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "beagle",
    name: "Beagle",
    slug: "beagle",
    description:
      "Curious, cheerful and energetic companions with a friendly temperament.",
    image:
      "https://images.unsplash.com/photo-1505628346881-b72b27e84530?q=80&w=1200&auto=format&fit=crop",
  },
];