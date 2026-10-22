/**
 * Central access to Supabase + Brevo environment variables.
 * Never import anything from here into client components — service-role
 * values must only ever be read on the server.
 */

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY;

export const BREVO_API_KEY = process.env.BREVO_API_KEY;
export const BREVO_FROM_NAME =
  process.env.BREVO_FROM_NAME ?? "Puppy Paradise";
export const BREVO_FROM_EMAIL =
  process.env.BREVO_FROM_EMAIL ?? "zedrick136@gmail.com";

/** Public site data can be read from Supabase. */
export function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

/** Server routes can perform privileged operations (CRUD, uploads, invites). */
export function isServiceConfigured(): boolean {
  return Boolean(isSupabaseConfigured() && SUPABASE_SERVICE_ROLE_KEY);
}

export type SetupStatus = {
  supabase: boolean;
  service: boolean;
  brevo: boolean;
};

export function getSetupStatus(): SetupStatus {
  return {
    supabase: isSupabaseConfigured(),
    service: isServiceConfigured(),
    brevo: Boolean(BREVO_API_KEY),
  };
}
