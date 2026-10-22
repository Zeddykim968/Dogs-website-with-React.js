/**
 * Validation/normalization for admin catalogue writes (puppies, breeds)
 * and photo uploads. Pure functions — no I/O — so routes stay thin.
 */

import type { Puppy } from "@/lib/data/puppies";

/** Database row shape (snake_case) for the puppies table. */
export type PuppyDbRow = {
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
  images: string[];
  description: string;
  temperament: string[];
  vaccinated: boolean;
  dewormed: boolean;
};

/** Database row shape for the breeds table. */
export type BreedDbRow = {
  id: string;
  name: string;
  description: string;
  image: string;
};

const GENDERS = ["Male", "Female"] as const;
const STATUSES = ["Available", "Reserved", "Sold"] as const;

const MAX_PHOTOS = 10;
const MAX_TEMPERAMENT = 12;

export type ValidationResult<T> =
  | { ok: true; fields: T }
  | { ok: false; error: string };

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64)
    .replace(/-+$/g, "");
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidImageRef(value: string): boolean {
  return value.startsWith("/") || value.startsWith("https://");
}

function validateImageList(
  value: unknown,
): { ok: true; list: string[] } | { ok: false; error: string } {
  if (!Array.isArray(value)) {
    return { ok: false, error: "Photos must be a list." };
  }
  if (value.length > MAX_PHOTOS) {
    return { ok: false, error: `At most ${MAX_PHOTOS} photos per puppy.` };
  }
  for (const item of value) {
    if (typeof item !== "string" || !isValidImageRef(item)) {
      return {
        ok: false,
        error: "Each photo must be an uploaded file or an https:// URL.",
      };
    }
  }
  return { ok: true, list: value.map((item) => item.trim()) };
}

function validateTemperament(
  value: unknown,
): { ok: true; list: string[] } | { ok: false; error: string } {
  if (!Array.isArray(value)) {
    return { ok: false, error: "Temperament must be a list." };
  }

  const list = value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
    .slice(0, MAX_TEMPERAMENT);

  for (const item of list) {
    if (item.length > 30) {
      return {
        ok: false,
        error: "Each personality trait must be 30 characters or fewer.",
      };
    }
  }

  return { ok: true, list };
}

/**
 * Validates a puppy payload (full on create, partial on update).
 * Only fields present in `body` are validated and returned.
 */
export function validatePuppyInput(
  body: Record<string, unknown>,
  options: { partial: boolean },
): ValidationResult<Partial<PuppyDbRow>> {
  const fields: Partial<PuppyDbRow> = {};

  const required = (present: boolean, label: string): string | null => {
    if (options.partial) {
      return null;
    }
    return present ? null : `${label} is required.`;
  };

  if ("name" in body || !options.partial) {
    if (!isNonEmptyString(body.name)) {
      return { ok: false, error: required(false, "Name") ?? "Name is required." };
    }
    if (body.name.trim().length > 60) {
      return { ok: false, error: "Name must be 60 characters or fewer." };
    }
    fields.name = body.name.trim();
  }

  if ("breedSlug" in body || !options.partial) {
    if (!isNonEmptyString(body.breedSlug) || !slugify(body.breedSlug)) {
      return { ok: false, error: "Choose a breed." };
    }
    fields.breed_slug = body.breedSlug.trim().toLowerCase();
  }

  if ("gender" in body || !options.partial) {
    if (
      typeof body.gender !== "string" ||
      !(GENDERS as readonly string[]).includes(body.gender)
    ) {
      return { ok: false, error: "Gender must be Male or Female." };
    }
    fields.gender = body.gender;
  }

  if ("age" in body || !options.partial) {
    if (!isNonEmptyString(body.age) || body.age.trim().length > 40) {
      return { ok: false, error: "Age is required (e.g. \"4 months\")." };
    }
    fields.age = body.age.trim();
  }

  if ("ageInMonths" in body) {
    const months = Number(body.ageInMonths);
    if (!Number.isInteger(months) || months < 0 || months > 60) {
      return { ok: false, error: "Age in months must be 0–60." };
    }
    fields.age_in_months = months;
  }

  if ("price" in body || !options.partial) {
    const price = Number(body.price);
    if (!Number.isInteger(price) || price < 0 || price > 10_000_000) {
      return { ok: false, error: "Price must be a whole number of shillings." };
    }
    fields.price = price;
  }

  if ("status" in body) {
    if (
      typeof body.status !== "string" ||
      !(STATUSES as readonly string[]).includes(body.status)
    ) {
      return { ok: false, error: "Status must be Available, Reserved or Sold." };
    }
    fields.status = body.status;
  }

  if ("featured" in body) {
    if (typeof body.featured !== "boolean") {
      return { ok: false, error: "Featured must be true or false." };
    }
    fields.featured = body.featured;
  }

  if ("location" in body || !options.partial) {
    if (!isNonEmptyString(body.location) || body.location.trim().length > 80) {
      return { ok: false, error: "Location is required (max 80 characters)." };
    }
    fields.location = body.location.trim();
  }

  if ("description" in body || !options.partial) {
    if (!isNonEmptyString(body.description) || body.description.trim().length > 2000) {
      return {
        ok: false,
        error: "Description is required (max 2000 characters).",
      };
    }
    fields.description = body.description.trim();
  }

  if ("images" in body) {
    const result = validateImageList(body.images);
    if (!result.ok) {
      return { ok: false, error: result.error };
    }
    fields.images = result.list;
  }

  if ("image" in body) {
    if (!isNonEmptyString(body.image) || !isValidImageRef(body.image.trim())) {
      return { ok: false, error: "The cover photo must be a valid image." };
    }
    fields.image = body.image.trim();
  }

  if ("temperament" in body) {
    const result = validateTemperament(body.temperament);
    if (!result.ok) {
      return { ok: false, error: result.error };
    }
    fields.temperament = result.list;
  }

  if ("vaccinated" in body) {
    if (typeof body.vaccinated !== "boolean") {
      return { ok: false, error: "Vaccinated must be true or false." };
    }
    fields.vaccinated = body.vaccinated;
  }

  if ("dewormed" in body) {
    if (typeof body.dewormed !== "boolean") {
      return { ok: false, error: "Dewormed must be true or false." };
    }
    fields.dewormed = body.dewormed;
  }

  if (!options.partial) {
    const images = fields.images ?? [];
    const cover = fields.image ?? images[0];
    if (!cover) {
      return {
        ok: false,
        error: "Add at least one photo for the puppy.",
      };
    }
    fields.image = cover;
    fields.images = images;
    fields.status = fields.status ?? "Available";
    fields.featured = fields.featured ?? false;
    fields.vaccinated = fields.vaccinated ?? false;
    fields.dewormed = fields.dewormed ?? false;
    fields.age_in_months = fields.age_in_months ?? 0;
  }

  // An explicit cover change must stay consistent with the gallery.
  if (fields.images && fields.images.length > 0 && !("image" in fields)) {
    fields.image = fields.images[0];
  }

  return { ok: true, fields };
}

export type BreedInput = {
  name: string;
  description: string;
  image: string;
  /** Derived from the name (or provided) on create; never patched. */
  slug: string;
};

/** Validates a breed create payload. */
export function validateBreedInput(
  body: Record<string, unknown>,
): ValidationResult<BreedInput> {
  if (!isNonEmptyString(body.name) || body.name.trim().length > 60) {
    return { ok: false, error: "Breed name is required (max 60 characters)." };
  }
  if (
    !isNonEmptyString(body.description) ||
    body.description.trim().length < 10 ||
    body.description.trim().length > 600
  ) {
    return {
      ok: false,
      error: "Description is required (10–600 characters).",
    };
  }
  if (
    !isNonEmptyString(body.image) ||
    !isValidImageRef(body.image.trim())
  ) {
    return { ok: false, error: "A cover photo is required for the breed." };
  }

  const customSlug =
    typeof body.slug === "string" && body.slug.trim().length > 0
      ? slugify(body.slug)
      : "";

  return {
    ok: true,
    fields: {
      name: body.name.trim(),
      description: body.description.trim(),
      image: body.image.trim(),
      slug: customSlug || slugify(body.name),
    },
  };
}

/** Validates a breed update payload (name/description/image only). */
export function validateBreedPatch(
  body: Record<string, unknown>,
): ValidationResult<Partial<BreedInput>> {
  const fields: Partial<BreedInput> = {};

  if ("name" in body) {
    if (!isNonEmptyString(body.name) || body.name.trim().length > 60) {
      return { ok: false, error: "Breed name is required (max 60 characters)." };
    }
    fields.name = body.name.trim();
  }

  if ("description" in body) {
    if (
      !isNonEmptyString(body.description) ||
      body.description.trim().length < 10 ||
      body.description.trim().length > 600
    ) {
      return { ok: false, error: "Description must be 10–600 characters." };
    }
    fields.description = body.description.trim();
  }

  if ("image" in body) {
    if (!isNonEmptyString(body.image) || !isValidImageRef(body.image.trim())) {
      return { ok: false, error: "The cover photo must be a valid image." };
    }
    fields.image = body.image.trim();
  }

  return { ok: true, fields };
}

/** Accepted image types for upload, mapped to file extensions. */
export const UPLOAD_EXT_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
export const MAX_UPLOAD_FILES = 8;

export const PHOTO_BUCKET = "puppy-photos";

/** Extracts the storage path from a public bucket URL. */
export function storagePathFromUrl(url: string): string | null {
  const marker = `/${PHOTO_BUCKET}/`;
  const index = url.indexOf(marker);
  if (index === -1) {
    return null;
  }
  const path = decodeURIComponent(url.slice(index + marker.length));
  if (path.length === 0 || path.includes("..") || path.includes("/")) {
    return null;
  }
  return path;
}

export type { Puppy };
