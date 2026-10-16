import liveBus from '@/lib/liveBus';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * HTTP long-poll for Live Feed (primary path on Cloudways).
 * GET /api/live/poll?since=<ISO>
 */
export async function GET(request) {
  const since = request.nextUrl.searchParams.get('since') || '';
  liveBus.ensureTicker();

  let events = liveBus.recent(since);

  if (events.length === 0) {
    events = await new Promise((resolve) => {
      let off = () => {};
      const timer = setTimeout(() => {
        off();
        // Always return something on first paint if the bus was empty.
        if (!since && liveBus.recent('').length === 0) {
          liveBus.pushRandom();
        }
        resolve(liveBus.recent(since));
      }, 2500);

      off = liveBus.onEvent(() => {
        clearTimeout(timer);
        off();
        resolve(liveBus.recent(since));
      });
    });
  }

  return NextResponse.json(
    {
      ok: true,
      mode: 'http-poll',
      events,
      serverTime: new Date().toISOString(),
    },
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    }
  );
}
