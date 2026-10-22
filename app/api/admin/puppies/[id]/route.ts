import { jsonError, jsonOk } from "@/lib/admin/api";
import { getCurrentUser } from "@/lib/admin/auth";
import { validatePuppyInput } from "@/lib/admin/catalog";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { isServiceConfigured } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{ id: string }>;
}

function guards() {
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

  return admin;
}

/** Updates fields of an existing puppy. */
export async function PATCH(request: Request, context: RouteContext) {
  const user = await getCurrentUser();
  if (!user) {
    return jsonError("Not authenticated.", 401);
  }

  const adminOrError = guards();
  if (adminOrError instanceof Response) {
    return adminOrError;
  }
  const admin = adminOrError;

  const { id } = await context.params;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body.", 400);
  }

  const validation = validatePuppyInput(body, { partial: true });
  if (!validation.ok) {
    return jsonError(validation.error, 400);
  }

  const fields = validation.fields;

  const { data: existing, error: fetchError } = await admin
    .from("puppies")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (fetchError) {
    return jsonError(`Could not load the puppy: ${fetchError.message}`, 500);
  }
  if (!existing) {
    return jsonError("Puppy not found.", 404);
  }

  let breedName = existing.breed as string;

  if (fields.breed_slug && fields.breed_slug !== existing.breed_slug) {
    const { data: breed } = await admin
      .from("breeds")
      .select("id, name")
      .eq("id", fields.breed_slug)
      .maybeSingle();

    if (!breed) {
      return jsonError(
        "That breed does not exist yet — add the breed first.",
        400,
      );
    }
    breedName = breed.name;
  }

  const nextImages = fields.images ?? existing.images ?? [];
  const nextCover =
    fields.image ??
    (Array.isArray(nextImages) && nextImages.length > 0
      ? nextImages[0]
      : undefined) ??
    existing.image;

  if (!nextCover) {
    return jsonError("A puppy needs at least one photo.", 400);
  }

  const { error } = await admin
    .from("puppies")
    .update({
      ...fields,
      breed: breedName,
      image: nextCover,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    return jsonError(`Could not update the puppy: ${error.message}`, 500);
  }

  return jsonOk({ id });
}

/** Deletes a puppy listing. */
export async function DELETE(_request: Request, context: RouteContext) {
  const user = await getCurrentUser();
  if (!user) {
    return jsonError("Not authenticated.", 401);
  }

  const adminOrError = guards();
  if (adminOrError instanceof Response) {
    return adminOrError;
  }
  const admin = adminOrError;

  const { id } = await context.params;

  const { data, error } = await admin
    .from("puppies")
    .delete()
    .eq("id", id)
    .select("id");

  if (error) {
    return jsonError(`Could not delete the puppy: ${error.message}`, 500);
  }
  if (!data || data.length === 0) {
    return jsonError("Puppy not found.", 404);
  }

  return jsonOk();
}
