import { jsonError, jsonOk } from "@/lib/admin/api";
import { getCurrentUser } from "@/lib/admin/auth";
import { validateBreedInput } from "@/lib/admin/catalog";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { isServiceConfigured } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

/** Creates a breed. */
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

  const validation = validateBreedInput(body);
  if (!validation.ok) {
    return jsonError(validation.error, 400);
  }

  const { name, description, image, slug } = validation.fields;

  if (!slug) {
    return jsonError("Could not derive a slug from that name.", 400);
  }

  const { data: existing } = await admin
    .from("breeds")
    .select("id")
    .eq("id", slug)
    .maybeSingle();

  if (existing) {
    return jsonError(
      "A breed with this name already exists — pick a different name.",
      400,
    );
  }

  const now = new Date().toISOString();

  const { error } = await admin.from("breeds").insert({
    id: slug,
    name,
    description,
    image,
    created_at: now,
    updated_at: now,
  });

  if (error) {
    return jsonError(`Could not save the breed: ${error.message}`, 500);
  }

  return jsonOk({ id: slug });
}
