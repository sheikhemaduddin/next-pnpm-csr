'use client';

import { login, signup } from './actions';

export default function LoginForm({ error, message }) {
  return (
    <form className="auth-form">
      <label htmlFor="email">Email</label>
      <input id="email" name="email" type="email" required autoComplete="email" />

      <label htmlFor="password">Password</label>
      <input id="password" name="password" type="password" required autoComplete="current-password" minLength={6} />

      {error && <p role="alert" className="auth-error">{error}</p>}
      {message && <p className="auth-message">{message}</p>}

      <div className="auth-actions">
        <button formAction={login}>Log in</button>
        <button formAction={signup}>Sign up</button>
      </div>
    </form>
  );
}
