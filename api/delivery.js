const crypto = require('crypto');
const db = require('./_supabase');
const orderToken = require('./_order-token');

function eq(value) {
  return encodeURIComponent(String(value));
}

function cleanChoice(value) {
  const v = String(value || '').toLowerCase();
  return ['yes','no'].includes(v) ? v : '';
}

function supabaseBase() {
  return String(process.env.SUPABASE_URL || '').replace(/\/$/, '');
}

function storageHeaders(extra = {}) {
  const key = String(process.env.SUPABASE_SERVICE_ROLE_KEY || '');
  return {
    apikey:key,
    Authorization:`Bearer ${key}`,
    'Content-Type':'application/json',
    ...extra
  };
}

function testimonialBucket() {
  return String(process.env.SONALZA_TESTIMONIAL_BUCKET || 'sonalza-testimonials');
}

async function ensureTestimonialBucket() {
  const bucket = testimonialBucket();
  const check = await fetch(`${supabaseBase()}/storage/v1/bucket/${encodeURIComponent(bucket)}`, {
    method:'GET',
    headers:storageHeaders()
  });

  if (check.ok) return bucket;
  if (check.status !== 404 && check.status !== 400) {
    const detail = await check.text().catch(() => '');
    throw new Error(`Testimonial bucket check failed (${check.status}): ${detail.slice(0,300)}`);
  }

  const create = await fetch(`${supabaseBase()}/storage/v1/bucket`, {
    method:'POST',
    headers:storageHeaders(),
    body:JSON.stringify({
      id:bucket,
      name:bucket,
      public:false,
      file_size_limit:250 * 1024 * 1024,
      allowed_mime_types:['video/mp4','video/quicktime','video/webm']
    })
  });

  if (!create.ok && create.status !== 409) {
    const detail = await create.text().catch(() => '');
    throw new Error(`Testimonial bucket creation failed (${create.status}): ${detail.slice(0,300)}`);
  }

  return bucket;
}

function videoSpec(contentType, size) {
  const type = String(contentType || '').toLowerCase();
  const bytes = Number(size || 0);
  const map = {
    'video/mp4':'mp4',
    'video/quicktime':'mov',
    'video/webm':'webm'
  };
  if (!map[type]) return null;
  if (!bytes || bytes > 250 * 1024 * 1024) return null;
  return { ext:map[type], contentType:type };
}

async function createTestimonialUpload(orderId, contentType, size) {
  const spec = videoSpec(contentType, size);
  if (!spec) throw new Error('Unsupported or oversized testimonial video.');

  const bucket = await ensureTestimonialBucket();
  const nonce = crypto.randomBytes(8).toString('hex');
  const filename = `reaction-${Date.now()}-${nonce}.${spec.ext}`;
  const path = `${String(orderId)}/${filename}`;
  const encodedPath = path.split('/').map(encodeURIComponent).join('/');

  const r = await fetch(
    `${supabaseBase()}/storage/v1/object/upload/sign/${encodeURIComponent(bucket)}/${encodedPath}`,
    {
      method:'POST',
      headers:storageHeaders(),
      body:JSON.stringify({})
    }
  );

  const text = await r.text();
  let data = {};
  try { data = text ? JSON.parse(text) : {}; } catch (_) {}

  if (!r.ok || !data.url) {
    throw new Error(`Unable to create testimonial upload (${r.status}).`);
  }

  return {
    bucket,
    path,
    content_type:spec.contentType,
    signed_url:`${supabaseBase()}/storage/v1${data.url}`
  };
}

async function signedAssetUrl(bucket, path, expiresIn = 60 * 60) {
  if (!bucket || !path) return '';
  const encodedPath = String(path).split('/').map(encodeURIComponent).join('/');
  const r = await fetch(
    `${supabaseBase()}/storage/v1/object/sign/${encodeURIComponent(bucket)}/${encodedPath}`,
    {
      method:'POST',
      headers:storageHeaders(),
      body:JSON.stringify({ expiresIn })
    }
  );

  const text = await r.text();
  let data = {};
  try { data = text ? JSON.parse(text) : {}; } catch (_) {}

  if (!r.ok || !data.signedURL) {
    throw new Error(`Unable to sign delivery asset (${r.status}).`);
  }

  return `${supabaseBase()}/storage/v1${data.signedURL}`;
}

async function handleGet(req, res) {
  const token = String(req.query?.token || '');
  const verified = orderToken.verify(token);

  if (!verified.ok) {
    return res.status(401).json({ ok:false, error:'Invalid or expired delivery link.' });
  }

  const orderId = verified.payload.orderId;

  const order = await db.selectOne(
    'orders',
    `order_id=eq.${eq(orderId)}&select=order_id,language,payment_status,status&limit=1`
  );

  if (!order || !['paid','paid_review'].includes(String(order.payment_status || ''))) {
    return res.status(404).json({ ok:false, error:'Delivery not available.' });
  }

  const event = await db.selectOne(
    'order_events',
    `order_id=eq.${eq(orderId)}&event_type=eq.delivery_ready&select=metadata,created_at&order=created_at.desc&limit=1`
  );

  const meta = event?.metadata || {};
  if (!meta.audio_bucket || !meta.audio_path) {
    return res.status(404).json({ ok:false, error:'Delivery not available.' });
  }

  const audioUrl = await signedAssetUrl(meta.audio_bucket, meta.audio_path);
  const coverUrl = meta.cover_bucket && meta.cover_path
    ? await signedAssetUrl(meta.cover_bucket, meta.cover_path)
    : '';

  res.setHeader('Cache-Control', 'private, no-store, max-age=0');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive');

  return res.status(200).json({
    ok:true,
    language: order.language === 'en' ? 'en' : 'es',
    song_title: meta.song_title || '',
    audio_url: audioUrl,
    download_url: audioUrl,
    cover_url: coverUrl,
    revision_url: meta.revision_url || '',
    delivered_at: event.created_at || null
  });
}

async function handlePost(req, res) {
  const body = req.body && typeof req.body === 'object' ? req.body : {};
  const token = String(body.token || '');
  const verified = orderToken.verify(token);

  if (!verified.ok) {
    return res.status(401).json({ ok:false, error:'Invalid or expired delivery link.' });
  }

  const orderId = verified.payload.orderId;
  const action = String(body.action || '');

  if (action === 'song_publish_consent') {
    const choice = cleanChoice(body.choice);
    if (!choice) {
      return res.status(400).json({ ok:false, error:'Invalid consent choice.' });
    }

    await db.insertEvent(
      orderId,
      'song_publish_consent',
      {
        choice,
        consent_version:'2026-09-16-v1',
        source:'delivery_page',
        submitted_at:new Date().toISOString()
      },
      'customer'
    );

    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ ok:true, choice });
  }

  if (action === 'prepare_reaction_upload') {
    const upload = await createTestimonialUpload(
      orderId,
      body.content_type,
      body.size
    );

    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ ok:true, upload });
  }

  if (action === 'reaction_video_uploaded') {
    const bucket = String(body.bucket || '');
    const path = String(body.path || '');
    const publishAuthorized = Boolean(body.publish_authorized);

    if (bucket !== testimonialBucket() || !path.startsWith(`${orderId}/reaction-`) || path.includes('..')) {
      return res.status(400).json({ ok:false, error:'Invalid testimonial reference.' });
    }

    await db.insertEvent(
      orderId,
      'reaction_video_received',
      {
        bucket,
        path,
        publish_authorized:publishAuthorized,
        consent_version:'2026-09-16-v1',
        source:'delivery_page',
        submitted_at:new Date().toISOString()
      },
      'customer'
    );

    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ ok:true, received:true });
  }

  return res.status(400).json({ ok:false, error:'Unsupported response action.' });
}

module.exports = async function handler(req, res) {
  if (!db.configured()) {
    return res.status(503).json({ ok:false, error:'Delivery service is not configured.' });
  }

  try {
    if (req.method === 'GET') return await handleGet(req, res);
    if (req.method === 'POST') return await handlePost(req, res);
    return res.status(405).json({ ok:false, error:'Method Not Allowed' });
  } catch (err) {
    console.error('delivery endpoint', err);
    return res.status(500).json({ ok:false, error:'Unable to process delivery request.' });
  }
};
