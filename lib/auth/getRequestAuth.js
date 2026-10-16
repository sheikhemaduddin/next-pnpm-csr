import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { createClient as createCookieClient } from '../supabase/server';
import { getSupabaseAnonKey, getSupabaseUrl, hasSupabaseConfig } from '../supabase/env';
import { getAccessTokenFromRequest } from './accessToken';

/**
 * Resolve the signed-in user for a Route Handler.
 * Prefer cookie session; else accept JWT from X-Access-Token (Cloudways-safe).
 */
export async function getRequestAuth(request) {
  if (!hasSupabaseConfig()) {
    return { supabase: null, user: null, via: null };
  }

  const cookieClient = await createCookieClient();
  if (cookieClient) {
    const {
      data: { user: cookieUser },
    } = await cookieClient.auth.getUser();

    if (cookieUser) {
      return { supabase: cookieClient, user: cookieUser, via: 'cookie' };
    }
  }

  const token = getAccessTokenFromRequest(request);
  if (!token) {
    return { supabase: cookieClient, user: null, via: null };
  }

  const supabase = createSupabaseClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      // Server → Supabase only; never sent to the Cloudways edge.
      headers: { Authorization: `Bearer ${token}` },
    },
  });

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    return { supabase: cookieClient, user: null, via: null };
  }

  return { supabase, user, via: 'x-access-token' };
}
