import liveBus from '@/lib/liveBus';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * HTTP long-poll fallback when /socket.io XHR is blocked (e.g. Cloudways proxy).
 * Prefer server.js handling of the same path — this route is a secondary path.
 * GET /api/live/poll?since=<ISO>
 */
export async function GET(request) {
  const since = request.nextUrl.searchParams.get('since') || '';
  let events = liveBus.recent(since);

  if (events.length === 0) {
    events = await new Promise((resolve) => {
      let off = () => {};
      const timer = setTimeout(() => {
        off();
        resolve(liveBus.recent(since));
      }, 4000);

      off = liveBus.onEvent(() => {
        clearTimeout(timer);
        off();
        resolve(liveBus.recent(since));
      });
    });
  }

  return NextResponse.json({
    ok: true,
    mode: 'http-poll',
    events,
    serverTime: new Date().toISOString(),
  });
}
