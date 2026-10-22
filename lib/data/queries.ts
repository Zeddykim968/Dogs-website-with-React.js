/**
 * Server-side data access for the public site.
 *
 * Reads from Supabase when configured; otherwise falls back to the bundled
 * seed data so the site keeps working before credentials are added (and
 * never crashes because a query failed).
 *
 * Import this only from server components / route handlers.
 */

import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createSupabasePublic } from "@/lib/supabase/public";

import { breeds as seedBreeds, type Breed } from "./breeds";
import { puppies as seedPuppies, type Puppy } from "./puppies";

type PuppyRow = {
  id: string;
  name: string;
  breed: string;
  breed_slug: string;
  gender: string;
  age: string;
  age_in_months: number;
  price: number;
  status: string;
  featured: boolean;
  location: string;
  image: string;
  images: string[] | null;
  description: string;
  temperament: string[] | null;
  vaccinated: boolean;
  dewormed: boolean;
};

type BreedRow = {
  id: string;
  name: string;
  description: string;
  image: string;
};

function rowToPuppy(row: PuppyRow): Puppy {
  return {
    id: row.id,
    name: row.name,
    breed: row.breed,
    breedSlug: row.breed_slug,
    gender: row.gender as Puppy["gender"],
    age: row.age,
    ageInMonths: row.age_in_months,
    price: row.price,
    status: row.status as Puppy["status"],
    featured: row.featured,
    location: row.location,
    image: row.image,
    images: row.images ?? [],
    description: row.description,
    temperament: row.temperament ?? [],
    vaccinated: row.vaccinated,
    dewormed: row.dewormed,
  };
}

function rowToBreed(row: BreedRow): Breed {
  return {
    id: row.id,
    name: row.name,
    slug: row.id,
    description: row.description,
    image: row.image,
  };
}

/** All puppies, newest first (admin additions appear at the top). */
export async function getPuppies(): Promise<Puppy[]> {
  if (!isSupabaseConfigured()) {
    return seedPuppies;
  }

  try {
    const supabase = createSupabasePublic();
    if (!supabase) {
      return seedPuppies;
    }

    const { data, error } = await supabase
      .from("puppies")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[queries] puppies fetch failed:", error.message);
      return seedPuppies;
    }

    return (data as PuppyRow[]).map(rowToPuppy);
  } catch (cause) {
    console.error("[queries] puppies fetch threw:", cause);
    return seedPuppies;
  }
}

export async function getPuppyById(id: string): Promise<Puppy | null> {
  const all = await getPuppies();
  return all.find((puppy) => puppy.id === id) ?? null;
}

/** All breeds, newest first. */
export async function getBreeds(): Promise<Breed[]> {
  if (!isSupabaseConfigured()) {
    return seedBreeds;
  }

  try {
    const supabase = createSupabasePublic();
    if (!supabase) {
      return seedBreeds;
    }

    const { data, error } = await supabase
      .from("breeds")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[queries] breeds fetch failed:", error.message);
      return seedBreeds;
    }

    return (data as BreedRow[]).map(rowToBreed);
  } catch (cause) {
    console.error("[queries] breeds fetch threw:", cause);
    return seedBreeds;
  }
}

export async function getBreedBySlug(slug: string): Promise<Breed | null> {
  const all = await getBreeds();
  return all.find((breed) => breed.slug === slug) ?? null;
}

/** Puppies belonging to a breed slug. */
export async function getBreedPuppies(slug: string): Promise<Puppy[]> {
  const all = await getPuppies();
  return all.filter((puppy) => puppy.breedSlug === slug);
}

export async function getBreedAvailableCount(slug: string): Promise<number> {
  const breedPuppies = await getBreedPuppies(slug);
  return breedPuppies.filter((puppy) => puppy.status === "Available").length;
}

/** Homepage showcase: available puppies flagged as featured. */
export async function getFeaturedPuppies(): Promise<Puppy[]> {
  const all = await getPuppies();
  return all.filter(
    (puppy) => puppy.featured && puppy.status === "Available",
  );
}
