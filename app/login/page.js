import { redirect } from 'next/navigation';

/** App login lives on the home SPA gate — not Supabase. */
export default function LoginPage() {
  redirect('/');
}
