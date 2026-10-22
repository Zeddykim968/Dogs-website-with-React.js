import { jsonError, jsonOk, rateLimit } from "@/lib/admin/api";
import { validatePassword } from "@/lib/admin/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * Completes a password reset. The caller must carry the recovery
 * session created by clicking the emailed link; we then set the new
 * password and end the recovery session.
 */
export async function POST(request: Request) {
  let body: { password?: string };
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body.", 400);
  }

  const password = body.password ?? "";
  const passwordError = validatePassword(password);
  if (passwordError) {
    return jsonError(passwordError, 400);
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return jsonError(
      "Supabase is not configured yet. Copy .env.local.example to .env.local and add your credentials.",
      503,
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return jsonError(
      "Your reset link is invalid or has expired. Request a new one.",
      401,
    );
  }

  if (!rateLimit(`reset:${user.id}`, 5, 5 * 60_000)) {
    return jsonError("Too many attempts. Try again shortly.", 429);
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    const message = /different from|reused|recently changed/i.test(error.message)
      ? "Choose a password you have not used recently."
      : /session|jwt|expired/i.test(error.message)
        ? "Your reset link is invalid or has expired. Request a new one."
        : error.message;
    return jsonError(message, 400);
  }

  // End the recovery session — the admin signs in with the new password.
  await supabase.auth.signOut();

  return jsonOk();
}
