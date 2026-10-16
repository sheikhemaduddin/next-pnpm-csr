import { updateSession } from './lib/supabase/middleware';

export async function middleware(request) {
  return updateSession(request);
}

export const config = {
  matcher: [
    // Skip Socket.IO polling/upgrade requests — handled by server.js, not Next.
    '/((?!_next/static|_next/image|favicon.ico|socket\\.io(?:/.*)?$|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
