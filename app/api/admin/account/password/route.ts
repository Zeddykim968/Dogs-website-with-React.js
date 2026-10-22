import { jsonError, jsonOk, rateLimit } from "@/lib/admin/api";
import { getCurrentUser, validatePassword } from "@/lib/admin/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * Changes the password of the signed-in admin. Requires the current
 * password (re-authenticates before updating), so a hijacked session
 * alone cannot lock the real owner out.
 */
export async function POST(request: Request) {
  let body: { currentPassword?: string; newPassword?: string };
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body.", 400);
  }

  const currentPassword = body.currentPassword ?? "";
  const newPassword = body.newPassword ?? "";

  const passwordError = validatePassword(newPassword);
  if (passwordError) {
    return jsonError(passwordError, 400);
  }
  if (!currentPassword) {
    return jsonError("Enter your current password.", 400);
  }

  const supabase = await createSupabaseServerClient();
  const user = await getCurrentUser();

  if (!supabase || !user) {
    return jsonError("Not authenticated.", 401);
  }

  if (!rateLimit(`password-change:${user.id}`, 5, 5 * 60_000)) {
    return jsonError("Too many attempts. Try again shortly.", 429);
  }

  // Re-authenticate with the current password.
  const { error: reauthError } = await supabase.auth.signInWithPassword({
    email: user.email ?? "",
    password: currentPassword,
  });

  if (reauthError) {
    return jsonError("Your current password is incorrect.", 403);
  }

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    return jsonError(error.message, 400);
  }

  return jsonOk();
}
