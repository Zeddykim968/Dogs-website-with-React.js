import { jsonError, jsonOk } from "@/lib/admin/api";
import { getCurrentUser } from "@/lib/admin/auth";
import { slugify, validatePuppyInput } from "@/lib/admin/catalog";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { isServiceConfigured } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

/** Creates a puppy listing. */
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return jsonError("Not authenticated.", 401);
  }
  if (!isServiceConfigured()) {
    return jsonError(
      "Supabase is not configured yet. Copy .env.local.example to .env.local and add your credentials.",
      503,
    );
  }

  const admin = createSupabaseAdmin();
  if (!admin) {
    return jsonError("Supabase service-role key is missing.", 503);
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body.", 400);
  }

  const validation = validatePuppyInput(body, { partial: false });
  if (!validation.ok) {
    return jsonError(validation.error, 400);
  }

  const fields = validation.fields;
  const breedSlug = fields.breed_slug ?? "";

  const { data: breed } = await admin
    .from("breeds")
    .select("id, name")
    .eq("id", breedSlug)
    .maybeSingle();

  if (!breed) {
    return jsonError(
      "That breed does not exist yet — add the breed first, then the puppy.",
      400,
    );
  }

  // Preferred id: name-slug (e.g. bruno-german-shepherd); fall back to
  // -2, -3 … when taken.
  const customSlug =
    typeof body.id === "string" && body.id.trim().length > 0
      ? slugify(body.id)
      : "";
  const baseId =
    customSlug || `${slugify(fields.name ?? "")}-${breedSlug}`;

  let candidate = baseId;
  for (let attempt = 2; attempt <= 50; attempt += 1) {
    const { data: existing } = await admin
      .from("puppies")
      .select("id")
      .eq("id", candidate)
      .maybeSingle();

    if (!existing) {
      break;
    }
    candidate = `${baseId}-${attempt}`;
  }

  const now = new Date().toISOString();

  const { error } = await admin.from("puppies").insert({
    id: candidate,
    name: fields.name,
    breed: breed.name,
    breed_slug: breedSlug,
    gender: fields.gender,
    age: fields.age,
    age_in_months: fields.age_in_months ?? 0,
    price: fields.price,
    status: fields.status ?? "Available",
    featured: fields.featured ?? false,
    location: fields.location,
    image: fields.image,
    images: fields.images ?? [],
    description: fields.description,
    temperament: fields.temperament ?? [],
    vaccinated: fields.vaccinated ?? false,
    dewormed: fields.dewormed ?? false,
    created_at: now,
    updated_at: now,
  });

  if (error) {
    return jsonError(`Could not save the puppy: ${error.message}`, 500);
  }

  return jsonOk({ id: candidate });
}
