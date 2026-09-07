const crypto = require('crypto');

function secret() {
  return process.env.ORDER_TOKEN_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || '';
}

function b64url(input) {
  return Buffer.from(input).toString('base64url');
}

function sign(orderId, ttlSeconds = 30 * 60) {
  const key = secret();
  if (!key) throw new Error('Order token secret is not configured.');
  const payload = {
    v: 1,
    orderId: String(orderId),
    exp: Math.floor(Date.now() / 1000) + ttlSeconds
  };
  const body = b64url(JSON.stringify(payload));
  const mac = crypto.createHmac('sha256', key).update(body).digest('base64url');
  return `${body}.${mac}`;
}

function verify(token, expectedOrderId = '') {
  try {
    const key = secret();
    if (!key || !token) return { ok: false, error: 'Token no disponible.' };
    const [body, sig] = String(token).split('.');
    if (!body || !sig) return { ok: false, error: 'Token invalido.' };
    const expected = crypto.createHmac('sha256', key).update(body).digest('base64url');
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return { ok: false, error: 'Token invalido.' };
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (!payload || payload.v !== 1 || !payload.orderId || !payload.exp) return { ok: false, error: 'Token invalido.' };
    if (payload.exp < Math.floor(Date.now() / 1000)) return { ok: false, error: 'La sesion del pedido expiro.' };
    if (expectedOrderId && payload.orderId !== expectedOrderId) return { ok: false, error: 'El token no corresponde a este pedido.' };
    return { ok: true, payload };
  } catch (_) {
    return { ok: false, error: 'Token invalido.' };
  }
}

module.exports = { sign, verify };
