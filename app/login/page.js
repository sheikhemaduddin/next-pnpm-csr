import { redirect } from 'next/navigation';
import { createClient } from '../../lib/supabase/server';
import { hasSupabaseConfig } from '../../lib/supabase/env';
import LoginForm from './LoginForm';

export const dynamic = 'force-dynamic';

export default async function LoginPage({ searchParams }) {
  if (!hasSupabaseConfig()) {
    return (
      <main className="auth-page">
        <p className="auth-brand">PitchPulse</p>
        <h1>Log in</h1>
        <p className="auth-sub" role="alert">
          Supabase is not configured. Set <code>SUPABASE_URL</code> and{' '}
          <code>SUPABASE_ANON_KEY</code> on the server (and rebuild so{' '}
          <code>NEXT_PUBLIC_*</code> values are available).
        </p>
        <p className="auth-back">
          <a href="/">← Back to home</a>
        </p>
      </main>
    );
  }

  const supabase = await createClient();
  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      redirect('/');
    }
  }

  const params = typeof searchParams?.then === 'function' ? await searchParams : searchParams;

  return (
    <main className="auth-page">
      <p className="auth-brand">PitchPulse</p>
      <h1>Log in</h1>
      <p className="auth-sub">Sign in with your Supabase account</p>
      <LoginForm error={params?.error} message={params?.message} />
      <p className="auth-back">
        <a href="/">← Back to home</a>
      </p>
    </main>
  );
}
