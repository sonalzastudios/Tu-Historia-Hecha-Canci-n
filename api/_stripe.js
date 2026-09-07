const crypto = require('crypto');

function enabled() {
  return String(process.env.ENABLE_STRIPE_CHECKOUT || '').toLowerCase() === 'true' && Boolean(process.env.STRIPE_SECRET_KEY);
}

function apiBase() {
  return 'https://api.stripe.com/v1';
}

async function request(path, { method = 'GET', params = null, idempotencyKey = '' } = {}) {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error('Stripe is not configured.');
  const headers = {
    Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`
  };
  if (idempotencyKey) headers['Idempotency-Key'] = idempotencyKey;
  const options = { method, headers };
  if (params) {
    headers['Content-Type'] = 'application/x-www-form-urlencoded';
    options.body = params instanceof URLSearchParams ? params.toString() : new URLSearchParams(params).toString();
  }
  const r = await fetch(`${apiBase()}${path}`, options);
  const data = await r.json().catch(() => ({}));
  if (!r.ok) {
    const message = data?.error?.message || `Stripe request failed (${r.status}).`;
    const err = new Error(message);
    err.status = r.status;
    throw err;
  }
  return data;
}

function verifyWebhook(rawBody, signatureHeader, secret, toleranceSeconds = 300) {
  if (!rawBody || !signatureHeader || !secret) return { ok: false, error: 'Missing webhook signature inputs.' };
  const pieces = String(signatureHeader).split(',').map(v => v.trim());
  let timestamp = null;
  const signatures = [];
  for (const piece of pieces) {
    const idx = piece.indexOf('=');
    if (idx < 0) continue;
    const key = piece.slice(0, idx);
    const value = piece.slice(idx + 1);
    if (key === 't') timestamp = Number(value);
    if (key === 'v1') signatures.push(value);
  }
  if (!timestamp || !signatures.length) return { ok: false, error: 'Malformed Stripe-Signature header.' };
  const age = Math.abs(Math.floor(Date.now() / 1000) - timestamp);
  if (age > toleranceSeconds) return { ok: false, error: 'Webhook timestamp outside tolerance.' };
  const payload = `${timestamp}.${rawBody}`;
  const expected = crypto.createHmac('sha256', secret).update(payload, 'utf8').digest('hex');
  const valid = signatures.some(sig => {
    try {
      const a = Buffer.from(sig, 'hex');
      const b = Buffer.from(expected, 'hex');
      return a.length === b.length && crypto.timingSafeEqual(a, b);
    } catch (_) { return false; }
  });
  return valid ? { ok: true } : { ok: false, error: 'Invalid Stripe signature.' };
}

module.exports = { enabled, request, verifyWebhook };
