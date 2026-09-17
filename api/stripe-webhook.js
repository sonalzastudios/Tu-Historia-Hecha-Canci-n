const db = require('./_supabase');
const stripe = require('./_stripe');
const email = require('./_email');
const autoProduction = require('./_auto-production');

function eq(value) { return encodeURIComponent(String(value)); }
function esc(value = '') { return String(value ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c])); }
function money(amount, currency) { return currency === 'MXN' ? `MX$${Number(amount).toLocaleString('es-MX')}` : `US$${Number(amount).toLocaleString('en-US')}`; }
function expectedCountry(region) { return region === 'MX' ? 'MX' : 'US'; }
function minorUnits(amount) { return Math.round(Number(amount) * 100); }

async function rawBody(req) {
  if (Buffer.isBuffer(req.body)) return req.body.toString('utf8');
  if (typeof req.body === 'string') return req.body;
  const chunks = [];
  for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  if (chunks.length) return Buffer.concat(chunks).toString('utf8');
  return '';
}

async function getOrder(orderId) {
  if (!orderId) return null;
  return db.selectOne('orders', `order_id=eq.${eq(orderId)}&select=*&limit=1`);
}

async function eventRow(eventId) {
  return db.selectOne('stripe_events', `stripe_event_id=eq.${eq(eventId)}&select=*&limit=1`);
}

async function recordEventStart(event) {
  const existing = await eventRow(event.id);
  if (existing) return existing;
  try {
    await db.insert('stripe_events', {
      stripe_event_id: event.id,
      event_type: event.type,
      stripe_created_at: event.created ? new Date(Number(event.created) * 1000).toISOString() : null,
      livemode: Boolean(event.livemode),
      object_id: event.data?.object?.id || null,
      order_id: event.data?.object?.metadata?.order_id || event.data?.object?.client_reference_id || null,
      processed: false
    });
  } catch (_) {
    return eventRow(event.id);
  }
  return eventRow(event.id);
}

async function markEvent(eventId, patch) {
  await db.update('stripe_events', `stripe_event_id=eq.${eq(eventId)}`, patch);
}

async function sendPaidOrderToSheets(order, session, paidAt) {
  const endpoint = process.env.SONALZA_SHEETS_ENDPOINT_URL;
  const secret = process.env.SONALZA_WEBHOOK_SECRET;

  if (!endpoint || !secret) {
    throw new Error('SONALZA Sheets integration not configured');
  }

  const brief = order.brief || {};

  const paymentId =
    typeof session.payment_intent === 'string'
      ? session.payment_intent
      : session.payment_intent?.id || session.id || '';

  const payload = {
    secret,
    order: {
      ORDER_ID: order.order_id || '',
      CREATED_AT: order.created_at || '',
      PAID_AT: paidAt || '',

      PRODUCT_TYPE: order.product || '',
      REGION: order.region || '',
      SITE_LANGUAGE: order.language || '',
      SONG_LANGUAGE: brief.idioma || '',
      CURRENCY: order.currency || '',

      CUSTOMER_EMAIL: order.customer_email || '',
      CUSTOMER_PHONE: order.customer_phone || '',

      RECIPIENT_RELATION: brief.paraQuien || '',
      RECIPIENT_NAME: brief.nombre || '',
      OCCASION: brief.ocasion || '',
      GENRE: brief.genero || '',
      ARTIST_CHOICE: brief.voz || '',
      TARGET_DURATION: brief.duracion || '',

      QUALITIES: brief.cualidades || '',
      MEMORY: brief.recuerdo || '',
      KEY_PHRASE: brief.frase || '',
      MAIN_MESSAGE: brief.emocion || '',

      ROOTS: brief.raices || '',
      JOURNEY: brief.trayectoria || '',
      KEY_PEOPLE: brief.personasClave || '',
      CHALLENGES: brief.retos || '',
      ACHIEVEMENTS: brief.logros || '',
      LEGACY: brief.legado || '',

      ADDONS: order.addons || [],
      AMOUNT_PAID: order.total ?? '',
      PAYMENT_PROVIDER: 'stripe',
      PAYMENT_ID: paymentId,
      PAYMENT_STATUS: 'PAID',
      PRODUCTION_STATUS: 'NEW'
    }
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload),
    redirect: 'follow'
  });

  const text = await response.text();

  let result;

  try {
    result = JSON.parse(text);
  } catch (_) {
    throw new Error(
      `SONALZA Sheets returned invalid response (${response.status})`
    );
  }

  if (!response.ok || !result?.ok) {
    throw new Error(
      `SONALZA Sheets sync failed: ${result?.error || response.status}`
    );
  }

  return result;
}

async function sendPaidEmails(order, reviewRequired) {
  if (!email.configured()) return { customerSent:false, adminSent:false };
  let customerSent = false;
  let adminSent = false;
  const isEs = order.language === 'es';
  if (!order.customer_paid_email_at) {
    const subject = isEs ? `Pago recibido · ${order.order_id}` : `Payment received · ${order.order_id}`;
    const customerHtml = `<div style="font-family:Arial,sans-serif;color:#071a33;max-width:640px">
      <h1>${isEs ? 'Recibimos tu pago.' : 'We received your payment.'}</h1>
      <p>${isEs ? 'Tu pedido SONALZA quedo registrado con la referencia' : 'Your SONALZA order is registered under reference'} <b>${esc(order.order_id)}</b>.</p>
      <p><b>${esc(money(order.total, order.currency))}</b> · ${esc(order.product === 'corrido' ? (isEs ? 'Corrido de una Vida' : 'A Life Corrido') : (isEs ? 'Cancion Personalizada' : 'Custom Song'))}</p>
      <p>${reviewRequired
        ? (isEs ? 'Estamos verificando un dato de region/facturacion antes de iniciar produccion. No necesitas volver a pagar.' : 'We are verifying a region/billing detail before production begins. You do not need to pay again.')
        : (isEs ? 'El equipo de SONALZA revisara la historia y la direccion creativa antes de iniciar produccion.' : 'The SONALZA team will review your story and creative direction before production begins.')}</p>
    </div>`;
    try {
      await email.send({ to: order.customer_email, subject, html: customerHtml });
      customerSent = true;
    } catch (err) { console.error('customer paid email', err); }
  }

  if (!order.admin_notified_at || order.status === 'pending_payment') {
    const admin = process.env.SONALZA_ORDERS_EMAIL || 'sonalzastudios@gmail.com';
    const b = order.brief || {};
    const adminHtml = `<div style="font-family:Arial,sans-serif;color:#071a33;max-width:700px">
      <h1>${reviewRequired ? 'PAGO RECIBIDO · REVISION REGIONAL' : 'PAGO RECIBIDO · LISTO PARA PRODUCCION'}</h1>
      <p><b>${esc(order.order_id)}</b> · ${esc(money(order.total, order.currency))}</p>
      <p><b>Producto:</b> ${esc(order.product === 'corrido' ? 'Corrido de una Vida' : 'Cancion Personalizada')}<br>
      <b>Para:</b> ${esc(b.nombre || '-')}<br>
      <b>Email:</b> ${esc(order.customer_email)}<br>
      <b>Voz:</b> ${esc(b.voz || '-')}<br>
      <b>Estilo:</b> ${esc(b.genero || '-')}<br>
      <b>Portada:</b> ${esc(order.cover_path || '-')}</p>
    </div>`;
    try {
      await email.send({ to: admin, replyTo: order.customer_email, subject: `${reviewRequired ? 'REVISAR' : 'PAGADO'} · SONALZA · ${order.order_id}`, html: adminHtml });
      adminSent = true;
    } catch (err) { console.error('admin paid email', err); }
  }
  return { customerSent, adminSent };
}

async function triggerAutoProduction(orderId) {
  try {
    return await autoProduction.processOrder(orderId);
  } catch (err) {
    console.error('auto-production', err);
    await db.insertEvent(orderId, 'production_auto_failed', {
      error: String(err.message || err).slice(0, 700)
    }, 'sonalza-production-director').catch(() => {});
    return { ok: false, error: String(err.message || err) };
  }
}

async function handleCheckoutPaid(session, eventType) {
  const orderId = session.metadata?.order_id || session.client_reference_id;
  const order = await getOrder(orderId);
  if (!order) throw new Error(`Order not found for Stripe session ${session.id}`);

  const billingCountry = String(session.customer_details?.address?.country || '').toUpperCase() || null;
  const currencyMatches = String(session.currency || '').toUpperCase() === String(order.currency || '').toUpperCase();
  const amountMatches = Number(session.amount_total) === minorUnits(order.total);
  const countryMatches = billingCountry === expectedCountry(order.region);
  const reviewRequired = !currencyMatches || !amountMatches || !countryMatches;
  const targetStatus = reviewRequired ? 'payment_review' : 'paid';
  const targetPaymentStatus = reviewRequired ? 'paid_review' : 'paid';
  const targetFulfillmentStatus = reviewRequired ? 'on_hold' : 'not_started';
  const now = new Date().toISOString();

  const paymentAlreadyRecorded =
    order.stripe_session_id === session.id &&
    order.payment_status === targetPaymentStatus &&
    Boolean(order.paid_at);

  const paidAt = paymentAlreadyRecorded ? order.paid_at : now;

  if (!paymentAlreadyRecorded) {
    await db.update('orders', `order_id=eq.${eq(orderId)}`, {
      status: targetStatus,
      payment_status: targetPaymentStatus,
      fulfillment_status: targetFulfillmentStatus,
      paid_at: paidAt,
      payment_provider: 'stripe',
      stripe_session_id: session.id,
      stripe_payment_intent_id: typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id || null,
      stripe_customer_id: typeof session.customer === 'string' ? session.customer : session.customer?.id || null
    });
    await db.insertEvent(orderId, reviewRequired ? 'payment_received_review_required' : 'payment_received', {
      stripe_session_id: session.id,
      event_type: eventType,
      billing_country: billingCountry,
      expected_country: expectedCountry(order.region),
      currency_matches: currencyMatches,
      amount_matches: amountMatches,
      country_matches: countryMatches,
      amount_total: session.amount_total,
      currency: session.currency
    });
  }

  const updated = {
    ...order,
    status: targetStatus,
    payment_status: targetPaymentStatus,
    fulfillment_status: targetFulfillmentStatus,
    paid_at: paidAt,
    payment_provider: 'stripe',
    stripe_session_id: session.id,
    stripe_payment_intent_id: typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id || null,
    stripe_customer_id: typeof session.customer === 'string' ? session.customer : session.customer?.id || null
  };

  const mail = await sendPaidEmails(updated, reviewRequired);
  const notifyPatch = {};
  if (mail.customerSent) notifyPatch.customer_paid_email_at = new Date().toISOString();
  if (mail.adminSent) notifyPatch.admin_notified_at = new Date().toISOString();
  if (Object.keys(notifyPatch).length) await db.update('orders', `order_id=eq.${eq(orderId)}`, notifyPatch);

  if (!reviewRequired) {
    await sendPaidOrderToSheets(updated, session, paidAt);
    await triggerAutoProduction(orderId);
  }
}

async function handleEvent(event) {
  const obj = event.data?.object || {};
  if (event.type === 'checkout.session.completed') {
    if (obj.payment_status === 'paid') return handleCheckoutPaid(obj, event.type);
    const orderId = obj.metadata?.order_id || obj.client_reference_id;
    if (orderId) {
      await db.update('orders', `order_id=eq.${eq(orderId)}`, { status:'payment_processing', payment_status:'processing', payment_provider:'stripe', stripe_session_id:obj.id });
      await db.insertEvent(orderId, 'payment_processing', { stripe_session_id:obj.id, payment_status:obj.payment_status || null });
    }
    return;
  }
  if (event.type === 'checkout.session.async_payment_succeeded') return handleCheckoutPaid(obj, event.type);
  if (event.type === 'checkout.session.async_payment_failed') {
    const orderId = obj.metadata?.order_id || obj.client_reference_id;
    if (orderId) {
      await db.update('orders', `order_id=eq.${eq(orderId)}`, { status:'payment_failed', payment_status:'failed' });
      await db.insertEvent(orderId, 'payment_failed', { stripe_session_id:obj.id });
    }
    return;
  }
  if (event.type === 'checkout.session.expired') {
    const orderId = obj.metadata?.order_id || obj.client_reference_id;
    if (orderId) {
      const order = await getOrder(orderId);
      if (order && order.payment_status !== 'paid' && order.payment_status !== 'paid_review') {
        await db.update('orders', `order_id=eq.${eq(orderId)}`, { status:'payment_expired', payment_status:'unpaid' });
        await db.insertEvent(orderId, 'stripe_checkout_expired', { stripe_session_id:obj.id });
      }
    }
  }
}

async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
  if (!db.configured()) return res.status(503).send('Database not configured');
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return res.status(503).send('Webhook secret not configured');

  let raw;
  try { raw = await rawBody(req); } catch (_) { return res.status(400).send('Unable to read raw body'); }
  if (!raw) return res.status(400).send('Raw body unavailable');

  const signature = req.headers['stripe-signature'];
  const verified = stripe.verifyWebhook(raw, signature, secret);
  if (!verified.ok) return res.status(400).send('Invalid signature');

  let event;
  try { event = JSON.parse(raw); } catch (_) { return res.status(400).send('Invalid JSON'); }
  if (!event?.id || !event?.type) return res.status(400).send('Invalid Stripe event');

  try {
    const recorded = await recordEventStart(event);
    if (recorded?.processed) return res.status(200).json({ received:true, duplicate:true });
    await handleEvent(event);
    await markEvent(event.id, { processed:true, processing_error:null, order_id:event.data?.object?.metadata?.order_id || event.data?.object?.client_reference_id || recorded?.order_id || null });
    return res.status(200).json({ received:true });
  } catch (err) {
    console.error('stripe-webhook', err);
    await markEvent(event.id, { processed:false, processing_error:String(err.message || err).slice(0, 700) }).catch(() => {});
    return res.status(500).send('Webhook processing failed');
  }
}

module.exports = handler;
module.exports.config = { api: { bodyParser: false } };
