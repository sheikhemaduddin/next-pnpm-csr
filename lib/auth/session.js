'use client';

import { ACCESS_TOKEN_HEADER } from './accessToken';

const TOKEN_KEY = 'pitchpulse_token';
const USER_KEY = 'pitchpulse_user';

export function getStoredToken() {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function getStoredUser() {
  if (typeof window === 'undefined') return null;
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || 'null');
  } catch {
    return null;
  }
}

export function setSession(token, user) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch {
    /* ignore */
  }
}

/**
 * Same-origin fetch — JWT on X-Access-Token only (never Authorization).
 * Keeps Cloudways HTTP Basic Auth working.
 */
export async function apiFetch(path, options = {}) {
  const headers = new Headers(options.headers || {});
  headers.delete('Authorization');
  headers.delete('authorization');

  const token = getStoredToken();
  if (token) headers.set(ACCESS_TOKEN_HEADER, token);

  return fetch(path, {
    ...options,
    credentials: 'same-origin',
    headers,
  });
}

export async function loginWithPassword(email, password) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Login failed');
  setSession(data.token, data.user);
  return data.user;
}

export async function fetchCurrentUser() {
  const token = getStoredToken();
  if (!token) return null;
  const res = await apiFetch('/api/auth/me');
  if (!res.ok) {
    clearSession();
    return null;
  }
  const data = await res.json();
  if (data.user) {
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    return data.user;
  }
  return null;
}

export function logout() {
  clearSession();
}
