import { NextResponse } from 'next/server';
import { getRequestAuth } from '../../../lib/auth/getRequestAuth';

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'uploads';

export async function POST(request) {
  const { supabase, user } = await getRequestAuth(request);

  if (!user) {
    // 403 (not 401): behind Cloudways Basic Auth, a 401 can re-prompt the browser
    // for HTTP credentials even when the edge auth is already satisfied.
    return NextResponse.json({ error: 'Not authenticated' }, { status: 403 });
  }

  const formData = await request.formData();
  const file = formData.get('file');

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  const path = `${user.id}/${Date.now()}-${file.name}`;

  // Uses the caller's session, so storage bucket RLS policies apply as this user.
  const { error } = await supabase.storage.from(BUCKET).upload(path, file);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ path });
}
