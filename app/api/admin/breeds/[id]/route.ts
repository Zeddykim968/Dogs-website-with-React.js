import { jsonError, jsonOk } from "@/lib/admin/api";
import { getCurrentUser } from "@/lib/admin/auth";
import { validateBreedPatch } from "@/lib/admin/catalog";
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

/**
 * Updates a breed. The slug (id) is intentionally immutable — it is
 * referenced by puppy listings and public URLs.
 */
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

  const validation = validateBreedPatch(body);
  if (!validation.ok) {
    return jsonError(validation.error, 400);
  }

  const { data, error } = await admin
    .from("breeds")
    .update({
      ...validation.fields,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("id");

  if (error) {
    return jsonError(`Could not update the breed: ${error.message}`, 500);
  }
  if (!data || data.length === 0) {
    return jsonError("Breed not found.", 404);
  }

  return jsonOk({ id });
}

/** Deletes a breed — blocked while puppies still reference it. */
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

  const { count, error: countError } = await admin
    .from("puppies")
    .select("id", { count: "exact", head: true })
    .eq("breed_slug", id);

  if (countError) {
    return jsonError(`Could not check puppy listings: ${countError.message}`, 500);
  }

  if (count && count > 0) {
    return jsonError(
      `This breed still has ${count} puppy ${count === 1 ? "listing" : "listings"}. Reassign or delete ${count === 1 ? "it" : "them"} first.`,
      400,
    );
  }

  const { data, error } = await admin
    .from("breeds")
    .delete()
    .eq("id", id)
    .select("id");

  if (error) {
    return jsonError(`Could not delete the breed: ${error.message}`, 500);
  }
  if (!data || data.length === 0) {
    return jsonError("Breed not found.", 404);
  }

  return jsonOk();
}
