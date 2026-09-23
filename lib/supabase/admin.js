import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { getSupabaseUrl } from './env';

// Service-role client: bypasses RLS entirely. Server-only — never import this
// from a Client Component or anything bundled for the browser. Reserve it for
// trusted, privileged operations (admin tooling, webhooks), not per-user reads.
export function createAdminClient() {
  return createSupabaseClient(getSupabaseUrl(), process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
