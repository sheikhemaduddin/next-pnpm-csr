'use server';

import { redirect } from 'next/navigation';
import { createClient } from '../../lib/supabase/server';

export async function login(formData) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect('/items');
}

export async function signup(formData) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect('/login?message=Check your email to confirm your account');
}

export async function signout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}
