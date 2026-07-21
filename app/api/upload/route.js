import { NextResponse } from 'next/server';
import { createClient } from '../../../lib/supabase/server';

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'uploads';

export async function POST(request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
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
