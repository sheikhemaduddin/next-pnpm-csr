import { createRequire } from 'module';
import path from 'path';
import { NextResponse } from 'next/server';

const require = createRequire(path.join(process.cwd(), 'package.json'));
const { authenticate } = require('./lib/auth/appAuth');

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/** App login (not Supabase). Returns JWT for X-Access-Token. */
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const email = String(body?.email || '').trim();
  const password = String(body?.password || '');
  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
  }

  const result = authenticate(email, password);
  if (!result) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 403 });
  }

  return NextResponse.json(result);
}
