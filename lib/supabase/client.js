import { createBrowserClient } from '@supabase/ssr';
import { getSupabaseAnonKey, getSupabaseUrl } from './env';

/**
 * Browser Supabase client.
 * Requests to *.supabase.co still use Authorization: Bearer (required by Supabase).
 * Same-origin calls never get Authorization — Cloudways Basic Auth needs that header.
 */
export function createClient() {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  if (!url || !key) return null;

  return createBrowserClient(url, key, {
    global: {
      fetch: (input, init = {}) => {
        const target = typeof input === 'string' ? input : input?.url || '';
        const sameOrigin =
          typeof window !== 'undefined' &&
          (target.startsWith('/') || target.startsWith(window.location.origin));

        if (!sameOrigin) {
          return fetch(input, init);
        }

        const headers = new Headers(init.headers || {});
        headers.delete('Authorization');
        headers.delete('authorization');
        return fetch(input, { ...init, headers });
      },
    },
  });
}
