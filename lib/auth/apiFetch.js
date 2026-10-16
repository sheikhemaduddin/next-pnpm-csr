'use client';

import { createClient } from '../supabase/client';
import { ACCESS_TOKEN_HEADER } from './accessToken';

/**
 * Same-origin fetch that never sets Authorization.
 * Puts the Supabase access token on X-Access-Token so Cloudways Basic Auth
 * can keep using Authorization.
 */
export async function apiFetch(path, options = {}) {
  const headers = new Headers(options.headers || {});
  headers.delete('Authorization');
  headers.delete('authorization');

  try {
    const supabase = createClient();
    if (supabase) {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.access_token) {
        headers.set(ACCESS_TOKEN_HEADER, session.access_token);
      }
    }
  } catch {
    /* anonymous / misconfigured — continue without token */
  }

  return fetch(path, {
    ...options,
    credentials: 'same-origin',
    headers,
  });
}
