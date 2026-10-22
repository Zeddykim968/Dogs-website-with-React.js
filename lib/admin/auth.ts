import { createHash, randomBytes } from "crypto";

import type { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";

/** The signed-in user for this request, or null. */
export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return null;
  }

  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}

/**
 * Guard for protected admin server components: redirects to the login
 * page when nobody is signed in. Never returns null — `redirect`
 * throws.
 */
export async function requireAdmin(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/admin/login");
  }
  return user;
}

export type PublicUser = {
  id: string;
  email: string;
  fullName: string;
  phone: string;
};

export function toPublicUser(user: User): PublicUser {
  const metadata = (user.user_metadata ?? {}) as Record<string, string>;
  return {
    id: user.id,
    email: user.email ?? "",
    fullName: metadata.full_name ?? "",
    phone: metadata.phone ?? "",
  };
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Returns an error message, or null when the password is acceptable. */
export function validatePassword(password: string): string | null {
  if (password.length < 8) {
    return "Password must be at least 8 characters.";
  }
  if (password.length > 128) {
    return "Password must be at most 128 characters.";
  }
  return null;
}

export function hashSecret(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

/** Human-friendly invite code, e.g. "Kx7mQ2pL9a". */
export function generateInviteCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I
  const bytes = randomBytes(10);
  let code = "";
  for (let i = 0; i < 10; i += 1) {
    code += alphabet[bytes[i] % alphabet.length];
    if (i === 4) {
      code += "-";
    }
  }
  return code;
}
