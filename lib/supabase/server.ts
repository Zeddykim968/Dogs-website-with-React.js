import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./env";

/**
 * Server-side Supabase client bound to the request's auth cookies.
 * Use it in server components and route handlers whenever the caller's
 * session matters (login, profile, password reset).
 *
 * Returns null when Supabase env vars are not configured yet, so callers
 * can degrade gracefully instead of crashing.
 */
export async function createSupabaseServerClient() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return null;
  }

  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Called from a Server Component where cookies are immutable;
          // middleware refreshes sessions instead.
        }
      },
    },
  });
}
