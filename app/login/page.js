'use client';

import { useRouter } from 'next/navigation';
import LoginGate from '../components/LoginGate';

/** Standalone login — app JWT auth, not Supabase. */
export default function LoginPage() {
  const router = useRouter();

  return (
    <LoginGate
      onLoggedIn={() => {
        router.replace('/');
      }}
    />
  );
}
