import { createRequire } from 'module';
import { getAccessTokenFromRequest } from './accessToken';

const require = createRequire(import.meta.url);
const { verifyToken } = require('./appAuth');

/**
 * Resolve the signed-in app user for a Route Handler.
 * JWT must arrive as X-Access-Token (Cloudways Basic Auth owns Authorization).
 */
export function getRequestAuth(request) {
  const token = getAccessTokenFromRequest(request);
  const user = verifyToken(token);
  if (!user) {
    return { user: null, via: null };
  }
  return { user, via: 'x-access-token' };
}
