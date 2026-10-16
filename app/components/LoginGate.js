'use client';

import { useState } from 'react';
import { loginWithPassword } from '../../lib/auth/session';

export default function LoginGate({ onLoggedIn }) {
  const [error, setError] = useState(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setPending(true);
    const form = new FormData(event.currentTarget);
    try {
      const user = await loginWithPassword(
        String(form.get('email') || ''),
        String(form.get('password') || '')
      );
      onLoggedIn?.(user);
    } catch (err) {
      setError(err?.message || 'Login failed');
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="app">
      <main className="auth-page view-enter">
        <p className="auth-brand">PitchPulse</p>
        <h1>Log in</h1>
        <p className="auth-sub">Sign in to open live scores, leaders, and the live feed.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            defaultValue="demo@pitchpulse.app"
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            defaultValue="pitchpulse"
          />

          {error && (
            <p role="alert" className="auth-error">
              {error}
            </p>
          )}

          <div className="auth-actions">
            <button type="submit" disabled={pending}>
              {pending ? 'Signing in…' : 'Log in'}
            </button>
          </div>
        </form>

        <p className="auth-sub" style={{ marginTop: '1.25rem' }}>
          Demo: <code>demo@pitchpulse.app</code> / <code>pitchpulse</code>
        </p>
      </main>
    </div>
  );
}
