const crypto = require('crypto');

const COOKIE_NAME = 'sonalza_admin_session';
const SESSION_TTL_SECONDS = 12 * 60 * 60;

function getSecret() {
  return String(process.env.SONALZA_ADMIN_KEY || '');
}

function configured() {
  return getSecret().length >= 16;
}

function b64url(input) {
  return Buffer.from(input).toString('base64url');
}

function sign(value) {
  return crypto.createHmac('sha256', getSecret()).update(value).digest('base64url');
}

function timingSafeEqualText(a, b) {
  const aBuf = Buffer.from(String(a || ''));
  const bBuf = Buffer.from(String(b || ''));
  if (aBuf.length !== bBuf.length) return false;
  return crypto.timingSafeEqual(aBuf, bBuf);
}

function validAdminKey(candidate) {
  if (!configured()) return false;
  return timingSafeEqualText(candidate, getSecret());
}

function createSessionToken() {
  const payload = {
    role: 'sonalza_admin',
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
    nonce: crypto.randomBytes(12).toString('hex')
  };
  const encoded = b64url(JSON.stringify(payload));
  return `${encoded}.${sign(encoded)}`;
}

function verifySessionToken(token) {
  if (!configured() || !token || !token.includes('.')) return false;
  const [encoded, signature] = token.split('.', 2);
  if (!encoded || !signature) return false;
  const expected = sign(encoded);
  if (!timingSafeEqualText(signature, expected)) return false;

  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
    return payload?.role === 'sonalza_admin' && Number(payload.exp || 0) > Math.floor(Date.now() / 1000);
  } catch (_) {
    return false;
  }
}

function parseCookies(req) {
  const header = String(req?.headers?.cookie || '');
  const out = {};
  header.split(';').forEach(part => {
    const i = part.indexOf('=');
    if (i < 0) return;
    const key = part.slice(0, i).trim();
    const value = part.slice(i + 1).trim();
    if (key) out[key] = decodeURIComponent(value);
  });
  return out;
}

function isAuthenticated(req) {
  const token = parseCookies(req)[COOKIE_NAME];
  return verifySessionToken(token);
}

function sessionCookie(token) {
  return `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_TTL_SECONDS}`;
}

function clearSessionCookie() {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;
}

module.exports = {
  configured,
  validAdminKey,
  createSessionToken,
  isAuthenticated,
  sessionCookie,
  clearSessionCookie
};
