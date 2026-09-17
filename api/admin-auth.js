const crypto = require('crypto');
const adminAuth = require('./_admin-auth');

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
