import { redirect } from 'next/navigation';
import { createClient } from '../../lib/supabase/server';
import LoginForm from './LoginForm';

export default async function LoginPage({ searchParams }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect('/');
  }

  const params = await searchParams;

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
