const { checkBodySize, enforceRateLimit } = require('./_security');
const db = require('./_supabase');
const orderToken = require('./_order-token');
const stripe = require('./_stripe');

function eq(value) { return encodeURIComponent(String(value)); }
function cents(amount) { return Math.round(Number(amount) * 100); }
function baseUrl(req) {
  const configured = String(process.env.SONALZA_BASE_URL || '').replace(/\/$/, '');
  if (configured) return configured;
  const host = String(req.headers['x-forwarded-host'] || req.headers.host || '').split(',')[0].trim();
  const proto = String(req.headers['x-forwarded-proto'] || 'https').split(',')[0].trim();
  return host ? `${proto}://${host}` : '';
}

async function retrieveOpenSession(sessionId) {
  if (!sessionId) return null;
  try {
    const s = await stripe.request(`/checkout/sessions/${encodeURIComponent(sessionId)}`);
    return s && s.status === 'open' && s.url ? s : null;
  } catch (_) { return null; }
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok:false, error:'Metodo no permitido.' });
  if (!checkBodySize(req, 32 * 1024)) return res.status(413).json({ ok:false, error:'La solicitud es demasiado grande.' });
  if (!(await enforceRateLimit(req, res, 'stripe-checkout', 10, 600))) return;
  if (!db.configured()) return res.status(503).json({ ok:false, setupRequired:true, error:'La base de datos no esta configurada.' });
  if (!stripe.enabled()) return res.status(503).json({ ok:false, setupRequired:true, error:'Stripe Checkout todavia no esta habilitado.' });

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const orderId = String(body.orderId || '').trim();
    const verified = orderToken.verify(body.orderToken, orderId);
    if (!verified.ok) return res.status(401).json({ ok:false, error:verified.error || 'No pudimos validar este pedido.' });

    const order = await db.selectOne('orders', `order_id=eq.${eq(orderId)}&select=*&limit=1`);
    if (!order) return res.status(404).json({ ok:false, error:'No encontramos este pedido.' });
    if (order.payment_status === 'paid') return res.status(409).json({ ok:false, alreadyPaid:true, error:'Este pedido ya aparece como pagado.' });
    if (!order.submitted_at) return res.status(409).json({ ok:false, error:'El pedido debe finalizarse antes de continuar al pago.' });

    const allowMismatch = String(process.env.ALLOW_REGION_OVERRIDE_CHECKOUT || '').toLowerCase() === 'true';
    if (order.region_verification_required && !allowMismatch) {
      return res.status(409).json({
        ok:false,
        regionVerificationRequired:true,
        error: order.language === 'es'
          ? 'La region seleccionada no coincide con la ubicacion detectada. Cambia la region del sitio antes de pagar o contacta a SONALZA si esto es un error.'
          : 'The selected region does not match the detected location. Change the site region before paying or contact SONALZA if this is an error.'
      });
    }

    const existing = await retrieveOpenSession(order.stripe_session_id);
    if (existing) return res.status(200).json({ ok:true, reused:true, orderId, sessionId:existing.id, checkoutUrl:existing.url });

    const site = baseUrl(req);
    if (!site) throw new Error('SONALZA_BASE_URL is missing.');
    const productName = order.product === 'corrido' ? 'SONALZA · Corrido de una Vida' : 'SONALZA · Cancion Personalizada';
    const addonLabel = Array.isArray(order.addons) && order.addons.length ? `Extras: ${order.addons.join(', ')}` : 'Sin extras';
    const p = new URLSearchParams();
    p.set('mode', 'payment');
    p.set('client_reference_id', order.order_id);
    p.set('customer_email', order.customer_email);
    p.set('billing_address_collection', 'required');
    p.set('locale', order.language === 'es' ? 'es' : 'en');
    p.set('success_url', `${site}/thanks.html?order=${encodeURIComponent(order.order_id)}&session_id={CHECKOUT_SESSION_ID}`);
    p.set('cancel_url', `${site}/order.html?payment=cancelled`);
    p.set('line_items[0][quantity]', '1');
    p.set('line_items[0][price_data][currency]', String(order.currency).toLowerCase());
    p.set('line_items[0][price_data][unit_amount]', String(cents(order.total)));
    p.set('line_items[0][price_data][product_data][name]', productName);
    p.set('line_items[0][price_data][product_data][description]', `${order.order_id} · ${addonLabel}`);
    p.set('metadata[order_id]', order.order_id);
    p.set('metadata[region]', order.region);
    p.set('metadata[product]', order.product);
    p.set('payment_intent_data[metadata][order_id]', order.order_id);
    p.set('payment_intent_data[metadata][region]', order.region);

    const session = await stripe.request('/checkout/sessions', {
      method: 'POST',
      params: p,
      idempotencyKey: `sonalza-checkout-${order.order_id}`
    });
    if (!session?.id || !session?.url) throw new Error('Stripe did not return a checkout URL.');

    await db.update('orders', `order_id=eq.${eq(orderId)}`, {
      payment_provider: 'stripe',
      stripe_session_id: session.id
    });
    await db.insertEvent(orderId, 'stripe_checkout_created', {
      stripe_session_id: session.id,
      amount_total: cents(order.total),
      currency: String(order.currency).toLowerCase()
    });

    return res.status(200).json({ ok:true, orderId, sessionId:session.id, checkoutUrl:session.url });
  } catch (err) {
    console.error('create-checkout-session', err);
    return res.status(500).json({ ok:false, error:'No pudimos iniciar el pago. Intenta de nuevo.' });
  }
};
