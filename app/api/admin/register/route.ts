import { clientIp, jsonError, jsonOk, rateLimit } from "@/lib/admin/api";
import {
  generateInviteCode,
  hashSecret,
  isValidEmail,
  validatePassword,
} from "@/lib/admin/auth";
import {
  createSupabaseAdmin,
} from "@/lib/supabase/admin";
import { getSetupStatus, isServiceConfigured } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

export type RegisterBody = {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  inviteCode?: string;
};

/** Setup status + whether registration currently requires an invite code. */
export async function GET() {
  const setup = getSetupStatus();
  let needsInvite = false;

  if (setup.service) {
    const admin = createSupabaseAdmin();
    if (admin) {
      const { data, error } = await admin.auth.admin.listUsers({
        page: 1,
        perPage: 1,
      });
      if (!error && data) {
        needsInvite = (data.users?.length ?? 0) > 0;
      }
    }
  }

  return jsonOk({ setup, needsInvite });
}

export async function POST(request: Request) {
  const ip = clientIp(request);
  if (!rateLimit(`register:${ip}`, 5, 60_000)) {
    return jsonError("Too many attempts. Try again in a minute.", 429);
  }

  if (!isServiceConfigured()) {
    return jsonError(
      "Supabase is not configured yet. Copy .env.local.example to .env.local and add your credentials.",
      503,
    );
  }

  let body: RegisterBody;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body.", 400);
  }

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim().toLowerCase();
  const phone = (body.phone ?? "").trim();
  const password = body.password ?? "";
  const inviteCode = (body.inviteCode ?? "").trim();

  if (name.length < 2) {
    return jsonError("Please enter your full name.", 400);
  }
  if (!isValidEmail(email)) {
    return jsonError("Please enter a valid email address.", 400);
  }
  const passwordError = validatePassword(password);
  if (passwordError) {
    return jsonError(passwordError, 400);
  }

  const admin = createSupabaseAdmin();
  if (!admin) {
    return jsonError("Supabase service-role key is missing.", 503);
  }

  const { data: usersPage, error: listError } =
    await admin.auth.admin.listUsers({ page: 1, perPage: 1 });
  if (listError) {
    return jsonError(`Could not verify accounts: ${listError.message}`, 500);
  }

  const accountExists = (usersPage.users?.length ?? 0) > 0;
  const isFirstAccount = !accountExists;

  if (accountExists) {
    if (!inviteCode) {
      return jsonError("An invite code is required to register.", 403);
    }

    const { data: setting } = await admin
      .from("site_settings")
      .select("value")
      .eq("key", "invite_code_hash")
      .maybeSingle();

    if (!setting || setting.value !== hashSecret(inviteCode)) {
      return jsonError("That invite code is not valid.", 403);
    }
  }

  const { data: created, error: createError } =
    await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: name, phone },
    });

  if (createError) {
    const message = /already/i.test(createError.message)
      ? "An account with this email already exists."
      : createError.message;
    return jsonError(message, 400);
  }

  if (!created.user) {
    return jsonError("Account creation failed.", 500);
  }

  await admin.from("profiles").upsert({
    id: created.user.id,
    full_name: name,
    phone: phone || null,
    updated_at: new Date().toISOString(),
  });

  // The first account bootstraps the site: generate an invite code they
  // can share with future admins (shown exactly once).
  let inviteCodeForSharing: string | undefined;
  if (isFirstAccount) {
    inviteCodeForSharing = generateInviteCode();
    await admin.from("site_settings").upsert({
      key: "invite_code_hash",
      value: hashSecret(inviteCodeForSharing),
      updated_at: new Date().toISOString(),
    });
  }

  return jsonOk({ email: created.user.email, inviteCode: inviteCodeForSharing });
}
