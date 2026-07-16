import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser Supabase client, for use inside Client Components (auth forms, etc).
 *
 * Detective Data works without Supabase configured — the game itself runs on
 * local, per-browser storage (see lib/store.ts). Supabase is wired in here so
 * teams that want real Admin authentication and a shared Postgres database of
 * cases/submissions can turn it on by setting the two env vars below and
 * running supabase/schema.sql against their project.
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return createBrowserClient(url, anonKey);
}

export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}
