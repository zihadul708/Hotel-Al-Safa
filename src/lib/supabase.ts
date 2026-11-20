import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Read Supabase environment variables
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  "";

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  "";

const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_KEY ||
  "";

/**
 * Checks whether Supabase environment variables are properly configured.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    supabaseUrl &&
    supabaseUrl.startsWith("http") &&
    (supabaseAnonKey || supabaseServiceRoleKey)
  );
}

// Global cached client instances for Next.js hot reload
const globalForSupabase = globalThis as unknown as {
  supabasePublic: SupabaseClient | undefined;
  supabaseAdmin: SupabaseClient | undefined;
};

/**
 * Public client for client-side operations (uses Anon Key).
 */
export const supabase: SupabaseClient =
  globalForSupabase.supabasePublic ??
  createClient(
    supabaseUrl || "https://placeholder-project.supabase.co",
    supabaseAnonKey || "placeholder-anon-key",
    {
      auth: {
        persistSession: false,
      },
    }
  );

/**
 * Admin client for server-side operations (uses Service Role Key if available, falls back to Anon Key).
 * Grants bypass of Row Level Security (RLS) for admin actions.
 */
export const supabaseAdmin: SupabaseClient =
  globalForSupabase.supabaseAdmin ??
  createClient(
    supabaseUrl || "https://placeholder-project.supabase.co",
    supabaseServiceRoleKey || supabaseAnonKey || "placeholder-key",
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );

if (process.env.NODE_ENV !== "production") {
  globalForSupabase.supabasePublic = supabase;
  globalForSupabase.supabaseAdmin = supabaseAdmin;
}
