import { clientIp, jsonError, jsonOk, rateLimit, requestOrigin } from "@/lib/admin/api";
import { sendPasswordResetEmail } from "@/lib/admin/email";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { isServiceConfigured } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

/**
 * Requests a password reset. Always answers { ok: true } for unknown
 * emails so the endpoint cannot be used to probe which addresses have
 * admin accounts.
 *
 * Delivery order:
 *  1. Brevo email (when BREVO_API_KEY is set)
 *  2. In development: the link is returned so it can be shown on screen
 *  3. In production without Brevo: the link is logged server-side
 */
export async function POST(request: Request) {
  const ip = clientIp(request);

  let body: { email?: string };
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body.", 400);
  }

  const email = (body.email ?? "").trim().toLowerCase();
  if (!email) {
    return jsonError("Enter your email address.", 400);
  }

  if (!rateLimit(`forgot:${email}:${ip}`, 3, 5 * 60_000)) {
    return jsonError("Too many reset requests. Try again shortly.", 429);
  }
  if (!rateLimit(`forgot-ip:${ip}`, 10, 10 * 60_000)) {
    return jsonError("Too many reset requests. Try again shortly.", 429);
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

  const origin = requestOrigin(request);
  const redirectTo = `${origin}/admin/reset-password`;

  const { data: linkData, error: linkError } =
    await admin.auth.admin.generateLink({
      type: "recovery",
      email,
      options: { redirectTo },
    });

  if (linkError || !linkData?.properties?.action_link) {
    // Unknown address or Supabase error — never reveal which.
    console.warn(`[forgot-password] no link for ${email}:`, linkError?.message);
    return jsonOk({});
  }

  const resetLink = linkData.properties.action_link;

  const sent = await sendPasswordResetEmail(email, resetLink);
  if (sent) {
    return jsonOk({ sent: true });
  }

  if (process.env.NODE_ENV !== "production") {
    // Development without Brevo: show the link so the flow is testable.
    return jsonOk({ devResetLink: resetLink });
  }

  console.error(
    `[forgot-password] BREVO_API_KEY missing or send failed — reset link for ${email}: ${resetLink}`,
  );
  return jsonOk({});
}
