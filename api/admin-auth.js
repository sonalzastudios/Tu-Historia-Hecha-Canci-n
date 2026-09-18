const crypto = require('crypto');
const adminAuth = require('./_admin-auth');
const db = require('./_supabase');
const orderToken = require('./_order-token');
const email = require('./_email');
const { deliveryEmail } = require('./_delivery-email-template');
const { paymentConfirmation } = require('./_email-templates');
const surveyFollowup = require('./_survey-followup');

function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body); } catch (_) { return {}; }
  }
  return {};
}

function supabaseConfigured() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

function supabaseBase() {
  return String(process.env.SUPABASE_URL || '').replace(/\/$/, '');
}

function storageHeaders(extra = {}) {
  const key = String(process.env.SUPABASE_SERVICE_ROLE_KEY || '');
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json',
    ...extra
  };
}

function bucketName() {
  return String(process.env.SONALZA_DELIVERY_BUCKET || 'sonalza-deliveries');
}

function cleanOrderId(value) {
  const id = String(value || '').trim().toUpperCase();
  return /^[A-Z0-9-]{6,64}$/.test(id) ? id : '';
}

function validEmail(value) {
  const v = String(value || '').trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? v : '';
}

function fileSpec(kind, contentType, size) {
  const type = String(contentType || '').toLowerCase();
  const bytes = Number(size || 0);

  if (kind === 'audio') {
    if (!['audio/mpeg','audio/mp3','audio/x-mpeg'].includes(type)) return null;
    if (!bytes || bytes > 50 * 1024 * 1024) return null;
    return { ext:'mp3', normalizedType:'audio/mpeg' };
  }

  if (kind === 'cover') {
    const map = {
      'image/jpeg':'jpg',
      'image/png':'png',
      'image/webp':'webp'
    };
    if (!map[type]) return null;
    if (!bytes || bytes > 10 * 1024 * 1024) return null;
    return { ext:map[type], normalizedType:type };
  }

  return null;
}

async function ensureDeliveryBucket() {
  const base = supabaseBase();
  const bucket = bucketName();

  const check = await fetch(`${base}/storage/v1/bucket/${encodeURIComponent(bucket)}`, {
    method:'GET',
    headers:storageHeaders()
  });

  if (check.ok) return bucket;
  if (check.status !== 404 && check.status !== 400) {
    const detail = await check.text().catch(() => '');
    throw new Error(`Bucket check failed (${check.status}): ${detail.slice(0,300)}`);
  }

  const create = await fetch(`${base}/storage/v1/bucket`, {
    method:'POST',
    headers:storageHeaders(),
    body:JSON.stringify({
      id:bucket,
      name:bucket,
      public:false,
      file_size_limit:50 * 1024 * 1024,
      allowed_mime_types:['audio/mpeg','image/jpeg','image/png','image/webp']
    })
  });

  if (!create.ok && create.status !== 409) {
    const detail = await create.text().catch(() => '');
    throw new Error(`Bucket creation failed (${create.status}): ${detail.slice(0,300)}`);
  }

  return bucket;
}

async function createSignedUpload({ orderId, kind, contentType, size }) {
  if (!supabaseConfigured()) throw new Error('Supabase is not configured.');

  const cleanId = cleanOrderId(orderId);
  const spec = fileSpec(kind, contentType, size);
  if (!cleanId || !spec) throw new Error('Invalid upload request.');

  const bucket = await ensureDeliveryBucket();
  const nonce = crypto.randomBytes(8).toString('hex');
  const filename = `${kind}-${Date.now()}-${nonce}.${spec.ext}`;
  const path = `${cleanId}/${filename}`;
  const encodedPath = path.split('/').map(encodeURIComponent).join('/');
  const url = `${supabaseBase()}/storage/v1/object/upload/sign/${encodeURIComponent(bucket)}/${encodedPath}`;

  const r = await fetch(url, {
    method:'POST',
    headers:storageHeaders(),
    body:JSON.stringify({})
  });

  const text = await r.text();
  let data = {};
  try { data = text ? JSON.parse(text) : {}; } catch (_) {}

  if (!r.ok || !data.url) {
    throw new Error(`Signed upload failed (${r.status}): ${text.slice(0,300)}`);
  }

  const signedUrl = `${supabaseBase()}/storage/v1${data.url}`;
  return {
    bucket,
    path,
    signedUrl,
    contentType:spec.normalizedType
  };
}

function eq(value) {
  return encodeURIComponent(String(value));
}

function validStoredPath(orderId, kind, bucket, path) {
  if (bucket !== bucketName()) return false;
  const cleanId = cleanOrderId(orderId);
  const p = String(path || '');
  return Boolean(cleanId && p.startsWith(`${cleanId}/${kind}-`) && !p.includes('..'));
}

async function getDeliveryAdminStatus(orderId) {
  const cleanId = cleanOrderId(orderId);
  if (!cleanId) throw new Error('Invalid order ID.');

  const order = await db.selectOne(
    'orders',
    `order_id=eq.${eq(cleanId)}&select=order_id,customer_email,language,payment_status,fulfillment_status,brief&limit=1`
  );
  if (!order) throw new Error('Order not found.');

  const revisionEvent = await db.selectOne(
    'order_events',
    `order_id=eq.${eq(cleanId)}&event_type=eq.revision_requested&select=metadata,created_at&order=created_at.desc&limit=1`
  );

  const isRevision = String(order.fulfillment_status || '') === 'revision_requested';
  return {
    orderId:cleanId,
    isRevision,
    fulfillmentStatus:String(order.fulfillment_status || ''),
    customerEmail:order.customer_email || '',
    recipientName:order.brief?.nombre || '',
    revisionNotes:isRevision ? String(revisionEvent?.metadata?.notes || '') : ''
  };
}

async function finalizeDelivery(body) {
  const orderId = cleanOrderId(body.order_id);
  const songTitle = String(body.song_title || '').trim().slice(0,180);
  const adminNote = String(body.admin_note || '').trim().slice(0,2000);
  const audio = body.audio || {};
  const cover = body.cover || null;

  if (!orderId || !songTitle) throw new Error('Order ID and song title are required.');
  if (!validStoredPath(orderId, 'audio', audio.bucket, audio.path)) throw new Error('Invalid audio reference.');
  if (cover && !validStoredPath(orderId, 'cover', cover.bucket, cover.path)) throw new Error('Invalid cover reference.');

  const order = await db.selectOne(
    'orders',
    `order_id=eq.${eq(orderId)}&select=*&limit=1`
  );

  if (!order) throw new Error('Order not found.');
  if (!['paid','paid_review'].includes(String(order.payment_status || ''))) {
    throw new Error('Order is not paid.');
  }
  if (!order.customer_email) throw new Error('Customer email is missing.');

  const isRevision = String(order.fulfillment_status || '') === 'revision_requested';
  const deliveryToken = orderToken.sign(orderId, 365 * 24 * 60 * 60);
  const baseUrl = String(process.env.SONALZA_BASE_URL || 'https://sonalza.com').replace(/\/$/, '');
  const deliveryUrl = `${baseUrl}/delivery.html?token=${encodeURIComponent(deliveryToken)}`;
  const now = new Date().toISOString();

  await db.insertEvent(orderId, 'delivery_ready', {
    song_title: songTitle,
    audio_bucket: audio.bucket,
    audio_path: audio.path,
    cover_bucket: cover?.bucket || '',
    cover_path: cover?.path || '',
    revision_url: '',
    delivery_type:isRevision ? 'revision' : 'initial',
    admin_note:adminNote,
    delivered_at: now
  }, 'sonalza-admin');

  if (isRevision) {
    await db.insertEvent(orderId, 'revision_delivered', {
      song_title:songTitle,
      admin_note:adminNote,
      delivered_at:now
    }, 'sonalza-admin');
  }

  const message = deliveryEmail({
    order,
    songTitle,
    deliveryUrl,
    downloadUrl:'',
    coverUrl:'',
    isRevision,
    adminNote
  });

  await email.send({
    to: order.customer_email,
    subject: message.subject,
    html: message.html,
    replyTo: process.env.SONALZA_REPLY_TO || undefined
  });

  await db.update('orders', `order_id=eq.${eq(orderId)}`, {
    status:'completed',
    fulfillment_status:isRevision ? 'revision_delivered' : 'delivered'
  }).catch(() => {});

  await surveyFollowup.schedule({
    order,
    deliveryUrl,
    reason:isRevision ? 'revision_delivery' : 'initial_delivery'
  }).catch(err => console.error('survey followup schedule', err));

  return { orderId, deliveryUrl, customerEmail:order.customer_email, isRevision };
}

async function sendDeliverabilityTest(body) {
  const to = validEmail(body.to);
  if (!to) throw new Error('Valid destination email required.');

  const timestamp = new Date().toISOString();
  const testOrder = {
    language:'es',
    order_id:`TEST-${Date.now()}`,
    total:49,
    currency:'USD',
    product:'song'
  };
  const message = paymentConfirmation(testOrder, false);

  await email.send({
    to,
    subject:message.subject,
    html:message.html,
    replyTo:process.env.SONALZA_REPLY_TO || undefined
  });

  return { to, timestamp, template:'payment_confirmation' };
}

module.exports = async function handler(req, res) {
  if (!adminAuth.configured()) {
    return res.status(503).json({ ok:false, error:'Admin access is not configured.' });
  }

  if (req.method === 'GET') {
    return res.status(200).json({ ok:true, authenticated:adminAuth.isAuthenticated(req) });
  }

  if (req.method === 'POST') {
    const body = readBody(req);
    const action = String(body.action || 'login').toLowerCase();

    if (action === 'logout') {
      res.setHeader('Set-Cookie', adminAuth.clearSessionCookie());
      return res.status(200).json({ ok:true, authenticated:false });
    }

    if (action === 'get-order-delivery-status') {
      if (!adminAuth.isAuthenticated(req)) {
        return res.status(401).json({ ok:false, error:'Admin authentication required.' });
      }

      try {
        const result = await getDeliveryAdminStatus(body.order_id);
        res.setHeader('Cache-Control','no-store');
        return res.status(200).json({ ok:true, ...result });
      } catch (err) {
        console.error('get-order-delivery-status', err);
        return res.status(400).json({ ok:false, error:String(err.message || 'Unable to load order.').slice(0,300) });
      }
    }

    if (action === 'sign-delivery-upload') {
      if (!adminAuth.isAuthenticated(req)) {
        return res.status(401).json({ ok:false, error:'Admin authentication required.' });
      }

      try {
        const upload = await createSignedUpload({
          orderId:body.order_id,
          kind:String(body.kind || ''),
          contentType:body.content_type,
          size:body.size
        });
        res.setHeader('Cache-Control','no-store');
        return res.status(200).json({ ok:true, upload });
      } catch (err) {
        console.error('sign-delivery-upload', err);
        return res.status(400).json({ ok:false, error:'Unable to prepare secure upload.' });
      }
    }

    if (action === 'finalize-delivery') {
      if (!adminAuth.isAuthenticated(req)) {
        return res.status(401).json({ ok:false, error:'Admin authentication required.' });
      }

      try {
        const result = await finalizeDelivery(body);
        res.setHeader('Cache-Control','no-store');
        return res.status(200).json({ ok:true, ...result });
      } catch (err) {
        console.error('finalize-delivery', err);
        return res.status(400).json({ ok:false, error:String(err.message || 'Unable to finalize delivery.').slice(0,300) });
      }
    }

    if (action === 'send-email-auth-test') {
      if (!adminAuth.isAuthenticated(req)) {
        return res.status(401).json({ ok:false, error:'Admin authentication required.' });
      }

      try {
        const result = await sendDeliverabilityTest(body);
        res.setHeader('Cache-Control','no-store');
        return res.status(200).json({ ok:true, ...result });
      } catch (err) {
        console.error('send-email-auth-test', err);
        return res.status(400).json({ ok:false, error:String(err.message || 'Unable to send test email.').slice(0,300) });
      }
    }

    const key = String(body.key || '');
    if (!adminAuth.validAdminKey(key)) {
      return res.status(401).json({ ok:false, error:'Invalid admin key.' });
    }

    const token = adminAuth.createSessionToken();
    res.setHeader('Set-Cookie', adminAuth.sessionCookie(token));
    return res.status(200).json({ ok:true, authenticated:true });
  }

  return res.status(405).json({ ok:false, error:'Method Not Allowed' });
};
