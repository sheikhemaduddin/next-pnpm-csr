import { createRequire } from 'module';
import { NextResponse } from 'next/server';

const require = createRequire(import.meta.url);
const liveBus = require('../../../../lib/liveBus');

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * HTTP long-poll for Live Feed (primary path on Cloudways).
 * GET /api/live/poll?since=<ISO>
 *
 * Prefer server.js handling of this path (same liveBus instance). This route
 * is a fallback when the request reaches Next instead.
 */
export async function GET(request) {
  try {
    const since = request.nextUrl.searchParams.get('since') || '';
    liveBus.ensureTicker();

    let events = liveBus.recent(since);

    if (events.length === 0) {
      events = await new Promise((resolve) => {
        let off = () => {};
        const timer = setTimeout(() => {
          off();
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
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        mode: 'http-poll',
        events: [],
        error: err?.message || 'live poll failed',
        serverTime: new Date().toISOString(),
      },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
