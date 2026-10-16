import { createRequire } from 'module';
import path from 'path';
import { NextResponse } from 'next/server';
import { getAccessTokenFromRequest } from '@/lib/auth/accessToken';

const require = createRequire(path.join(process.cwd(), 'package.json'));
const { verifyToken } = require('./lib/auth/appAuth');

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/** Current app user from X-Access-Token (Cloudways-safe). */
export async function GET(request) {
  const token = getAccessTokenFromRequest(request);
  const user = verifyToken(token);
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 403 });
  }
  return NextResponse.json({ user });
}
