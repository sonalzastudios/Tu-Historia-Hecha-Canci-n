const crypto = require('crypto');

const TERMS_VERSION = '2026-09-06-v4';
const PRIVACY_VERSION = '2026-09-06-v4';
const memoryBuckets = global.__sonalzaRateBuckets || (global.__sonalzaRateBuckets = new Map());

function getClientIp(req) {
  const forwarded = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  return forwarded || String(req.headers['x-real-ip'] || req.socket?.remoteAddress || 'unknown');
}

function getUserAgent(req) {
  return String(req.headers['user-agent'] || '').slice(0, 500);
}

function checkBodySize(req, maxBytes) {
  const raw = Number(req.headers['content-length'] || 0);
  return !raw || raw <= maxBytes;
}

async function durableRateLimit(key, limit, windowSeconds) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  try {
    const bucket = `sonalza:rl:${key}`;
    const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
    const incr = await fetch(url.replace(/\/$/, ''), { method:'POST', headers, body:JSON.stringify(['INCR', bucket]) });
    if (!incr.ok) return null;
    const data = await incr.json();
    const count = Number(data.result || 0);
    if (count === 1) {
      await fetch(url.replace(/\/$/, ''), { method:'POST', headers, body:JSON.stringify(['EXPIRE', bucket, windowSeconds]) }).catch(()=>{});
    }
    return { allowed: count <= limit, count, remaining: Math.max(0, limit - count) };
  } catch (_) {
    return null;
  }
}

function memoryRateLimit(key, limit, windowSeconds) {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const current = memoryBuckets.get(key);
  if (!current || current.resetAt <= now) {
    const next = { count:1, resetAt:now + windowMs };
    memoryBuckets.set(key, next);
    return { allowed:true, count:1, remaining:limit - 1 };
  }
  current.count += 1;
  memoryBuckets.set(key, current);
  return { allowed:current.count <= limit, count:current.count, remaining:Math.max(0, limit-current.count) };
}

async function enforceRateLimit(req, res, scope, limit=10, windowSeconds=600) {
  const ip = getClientIp(req);
  const key = `${scope}:${ip}`;
  const durable = await durableRateLimit(key, limit, windowSeconds);
  const result = durable || memoryRateLimit(key, limit, windowSeconds);
  res.setHeader('X-RateLimit-Limit', String(limit));
  res.setHeader('X-RateLimit-Remaining', String(result.remaining));
  if (!result.allowed) {
    res.setHeader('Retry-After', String(windowSeconds));
    res.status(429).json({ ok:false, error:'Demasiados intentos. Espera unos minutos e intenta de nuevo.' });
    return false;
  }
  return true;
}

async function verifyTurnstile(req, token, expectedAction='') {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  const required = String(process.env.REQUIRE_TURNSTILE || '').toLowerCase() === 'true';
  if (!secret) return { ok:!required, skipped:!required, error:required ? 'Turnstile no está configurado.' : null };
  if (!token) return { ok:false, error:'Completa la verificación de seguridad.' };
  try {
    const form = new URLSearchParams();
    form.set('secret', secret);
    form.set('response', String(token));
    const ip = getClientIp(req);
    if (ip && ip !== 'unknown') form.set('remoteip', ip);
    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method:'POST', body:form });
    const data = await r.json();
    if (!data.success) return { ok:false, error:'No pudimos validar la verificación de seguridad.' };
    if (expectedAction && data.action && data.action !== expectedAction) return { ok:false, error:'La verificación de seguridad no corresponde a esta acción.' };
    return { ok:true, hostname:data.hostname || null, action:data.action || null };
  } catch (_) {
    return { ok:false, error:'No pudimos validar la verificación de seguridad.' };
  }
}

function evidence(req, extra={}) {
  const ip = getClientIp(req);
  const salt = process.env.EVIDENCE_HASH_SALT || '';
  const ipHash = salt && ip && ip !== 'unknown' ? crypto.createHash('sha256').update(`${salt}|${ip}`).digest('hex') : null;
  return {
    captured_at: new Date().toISOString(),
    user_agent: getUserAgent(req),
    accept_language: String(req.headers['accept-language'] || '').slice(0, 180),
    ip_hash: ipHash,
    ...extra
  };
}

function sniffImage(buffer) {
  if (!Buffer.isBuffer(buffer) || buffer.length < 12) return null;
  if (buffer[0]===0xff && buffer[1]===0xd8 && buffer[2]===0xff) return { mime:'image/jpeg', ext:'jpg' };
  if (buffer.slice(0,8).equals(Buffer.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a]))) return { mime:'image/png', ext:'png' };
  if (buffer.slice(0,4).toString('ascii')==='RIFF' && buffer.slice(8,12).toString('ascii')==='WEBP') return { mime:'image/webp', ext:'webp' };
  return null;
}

module.exports = {
  TERMS_VERSION,
  PRIVACY_VERSION,
  getClientIp,
  checkBodySize,
  enforceRateLimit,
  verifyTurnstile,
  evidence,
  sniffImage
};
