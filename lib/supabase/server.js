import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { getSupabaseAnonKey, getSupabaseUrl, hasSupabaseConfig } from './env';

// Uses the anon key + the caller's session cookies, so Postgres RLS is
// enforced as the logged-in user — never bypass RLS with the service role
// key here.
export async function createClient() {
  if (!hasSupabaseConfig()) {
    return null;
  }

  const cookieStore = await cookies();

  return createServerClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Called from a Server Component that can't set cookies — safe to
          // ignore as long as middleware.js is refreshing the session.
        }
      },
    },
  });
}
