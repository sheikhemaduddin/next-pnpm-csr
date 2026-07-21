import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

// Uses the anon key + the caller's session cookies, so Postgres RLS is
// enforced as the logged-in user — never bypass RLS with the service role
// key here.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
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
    }
  );
}
