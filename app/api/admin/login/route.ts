import { clientIp, jsonError, jsonOk, rateLimit } from "@/lib/admin/api";
import { isValidEmail } from "@/lib/admin/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const ip = clientIp(request);
  if (!rateLimit(`login:${ip}`, 10, 60_000)) {
    return jsonError(
      "Too many login attempts. Wait a minute and try again.",
      429,
    );
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return jsonError(
      "Supabase is not configured yet. Copy .env.local.example to .env.local and add your credentials.",
      503,
    );
  }

  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body.", 400);
  }

  const email = (body.email ?? "").trim().toLowerCase();
  const password = body.password ?? "";

  if (!isValidEmail(email) || !password) {
    return jsonError("Enter your email and password.", 400);
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return jsonError("Invalid email or password.", 401);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone")
    .eq("id", data.user.id)
    .maybeSingle();

  return jsonOk({
    user: {
      id: data.user.id,
      email: data.user.email ?? email,
      fullName: profile?.full_name ?? "",
      phone: profile?.phone ?? "",
    },
  });
}
