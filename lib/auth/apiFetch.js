'use client';

/**
 * Same-origin fetch that never sets Authorization.
 * App JWT goes on X-Access-Token (Cloudways Basic Auth keeps Authorization).
 */
export { apiFetch, loginWithPassword, fetchCurrentUser, logout, getStoredUser, getStoredToken } from './session';
