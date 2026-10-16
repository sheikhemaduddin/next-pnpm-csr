const crypto = require('crypto');

const SECRET = process.env.JWT_SECRET || process.env.APP_JWT_SECRET || 'pitchpulse-dev-secret-change-me';
const TTL_MS = 8 * 60 * 60 * 1000;

/** Demo users — app login is independent of Supabase. */
const USERS = [
  {
    id: 'demo-1',
    email: 'demo@pitchpulse.app',
    password: 'pitchpulse',
    name: 'Demo Fan',
    role: 'fan',
  },
  {
    id: 'admin-1',
    email: 'admin@pitchpulse.app',
    password: 'admin123',
    name: 'PitchPulse Admin',
    role: 'admin',
  },
];

function b64url(input) {
  return Buffer.from(input)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function signToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    exp: Date.now() + TTL_MS,
  };
  const body = b64url(JSON.stringify(payload));
  const sig = crypto.createHmac('sha256', SECRET).update(body).digest('base64url');
  return `${body}.${sig}`;
}

function verifyToken(token) {
  if (!token || typeof token !== 'string' || !token.includes('.')) return null;
  const [body, sig] = token.split('.');
  const expected = crypto.createHmac('sha256', SECRET).update(body).digest('base64url');
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const json = Buffer.from(body.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8');
    const payload = JSON.parse(json);
    if (!payload?.exp || Date.now() > payload.exp) return null;
    return {
      id: payload.id,
      email: payload.email,
      name: payload.name,
      role: payload.role,
    };
  } catch {
    return null;
  }
}

function findUser(email) {
  return USERS.find((u) => u.email.toLowerCase() === String(email || '').toLowerCase()) || null;
}

function publicUser(user) {
  return { id: user.id, email: user.email, name: user.name, role: user.role };
}

function authenticate(email, password) {
  const user = findUser(email);
  if (!user || user.password !== password) return null;
  const token = signToken(user);
  return { token, user: publicUser(user) };
}

module.exports = {
  USERS,
  signToken,
  verifyToken,
  authenticate,
  publicUser,
  findUser,
};
