import { redirect } from 'next/navigation';
import { createClient } from '../../lib/supabase/server';
import LoginForm from './LoginForm';

export default async function LoginPage({ searchParams }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect('/items');
  }

  const params = await searchParams;

  return (
    <main className="auth-page">
      <h1>Log in</h1>
      <LoginForm error={params?.error} message={params?.message} />
    </main>
  );
}
