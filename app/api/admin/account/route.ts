import { jsonError, jsonOk } from "@/lib/admin/api";
import { getCurrentUser } from "@/lib/admin/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/** The signed-in admin's account info. */
export async function GET() {
  const supabase = await createSupabaseServerClient();
  const user = await getCurrentUser();

  if (!supabase || !user) {
    return jsonError("Not authenticated.", 401);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone")
    .eq("id", user.id)
    .maybeSingle();

  return jsonOk({
    user: {
      id: user.id,
      email: user.email ?? "",
      createdAt: user.created_at,
    },
    profile: {
      fullName:
        profile?.full_name ??
        ((user.user_metadata ?? {}) as { full_name?: string }).full_name ??
        "",
      phone: profile?.phone ?? "",
    },
  });
}

/** Updates the admin's profile (name and phone). */
export async function PATCH(request: Request) {
  const supabase = await createSupabaseServerClient();
  const user = await getCurrentUser();

  if (!supabase || !user) {
    return jsonError("Not authenticated.", 401);
  }

  let body: { fullName?: string; phone?: string };
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body.", 400);
  }

  const fullName = (body.fullName ?? "").trim();
  const phone = (body.phone ?? "").trim();

  if (fullName.length < 2) {
    return jsonError("Please enter your full name.", 400);
  }

  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
    full_name: fullName,
    phone: phone || null,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    return jsonError(`Could not save your profile: ${error.message}`, 500);
  }

  // Keep auth metadata in sync so login responses show fresh values.
  await supabase.auth.updateUser({
    data: { full_name: fullName, phone },
  });

  return jsonOk({ profile: { fullName, phone } });
}
