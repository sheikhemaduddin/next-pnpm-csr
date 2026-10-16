'use server';

import { redirect } from 'next/navigation';

/** Legacy Supabase server actions — unused by the SPA login gate. */
export async function login() {
  redirect('/');
}

export async function signup() {
  redirect('/');
}

export async function signout() {
  redirect('/');
}
