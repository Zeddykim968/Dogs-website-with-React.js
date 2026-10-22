import { jsonError, jsonOk } from "@/lib/admin/api";
import { generateInviteCode, getCurrentUser, hashSecret } from "@/lib/admin/auth";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { isServiceConfigured } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

/**
 * Rotates the registration invite code. The new code is returned once;
 * only its hash is stored, so it cannot be recovered later.
 */
export async function POST() {
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

  const code = generateInviteCode();

  const { error } = await admin.from("site_settings").upsert({
    key: "invite_code_hash",
    value: hashSecret(code),
    updated_at: new Date().toISOString(),
  });

  if (error) {
    return jsonError(`Could not save the invite code: ${error.message}`, 500);
  }

  return jsonOk({ code });
}
