import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./env";

/**
 * Session-less Supabase client for public, read-only data (puppies, breeds).
 * Safe to use anywhere on the server; it never carries user credentials.
 *
 * Returns null when Supabase env vars are not configured yet.
 */
export function createSupabasePublic(): SupabaseClient | null {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return null;
  }

  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
