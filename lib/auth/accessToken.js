/** Cloudways-safe app auth header.
 *
 * Edge HTTP Basic Auth owns the `Authorization` header. App JWTs must use
 * `X-Access-Token` so login/API calls do not overwrite Basic Auth and re-prompt.
 */

export const ACCESS_TOKEN_HEADER = 'x-access-token';

/** Read JWT from a Request (Next.js route / middleware). Prefers X-Access-Token. */
export function getAccessTokenFromRequest(request) {
  const custom = request.headers.get(ACCESS_TOKEN_HEADER);
  if (custom) return custom.trim();

  // Backward-compatible fallback — avoid sending Bearer from the browser on Cloudways.
  const auth = request.headers.get('authorization') || '';
  if (auth.toLowerCase().startsWith('bearer ')) {
    return auth.slice(7).trim();
  }
  return null;
}
