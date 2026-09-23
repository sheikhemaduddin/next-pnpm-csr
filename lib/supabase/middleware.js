import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import { getSupabaseAnonKey, getSupabaseUrl, hasSupabaseConfig } from './env';

export async function updateSession(request) {
  if (!hasSupabaseConfig()) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(name, value, options);
        });
      },
    },
  });

  // Refreshes the auth token if needed — do not remove this call, and do not
  // add logic between client creation and this call.
  await supabase.auth.getUser();

  return supabaseResponse;
}
