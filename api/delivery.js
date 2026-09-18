const crypto = require('crypto');
const db = require('./_supabase');
const orderToken = require('./_order-token');
const email = require('./_email');

function eq(value) {
  return encodeURIComponent(String(value));
}

function esc(value = '') {
  return String(value ?? '').replace(/[&<>\"']/g, ch => ({
    '&':'&amp;', '<':'&lt;', '>':'&gt;', '\"':'&quot;', "'":'&#39;'
  }[ch]));
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

async function mirrorCustomerResponse(response) {
  const endpoint = String(process.env.SONALZA_SHEETS_ENDPOINT_URL || '').trim();
  const secret = String(process.env.SONALZA_WEBHOOK_SECRET || '').trim();

  if (!endpoint || !secret) return false;

  try {
    const r = await fetch(endpoint, {
      method:'POST',
      headers:{ 'Content-Type':'application/json' },
      body:JSON.stringify({
        secret,
        customer_response:response
      })
    });

    const text = await r.text().catch(() => '');
    let data = null;
    try { data = text ? JSON.parse(text) : null; } catch (_) {}

    if (!r.ok || data?.ok === false) {
      console.error('customer response sheets mirror failed', r.status, text.slice(0,500));
      return false;
    }

    return true;
  } catch (err) {
    console.error('customer response sheets mirror error', err);
    return false;
  }
}

async function getSongConsentHistory(orderId) {
  const rows = await db.select(
    'order_events',
    `order_id=eq.${eq(orderId)}&event_type=eq.song_publish_consent&select=metadata,created_at&order=created_at.asc`
  );
  return Array.isArray(rows) ? rows : [];
}

function songConsentState(history) {
  const count = history.length;
  const last = count ? history[count - 1] : null;
  const currentChoice = String(last?.metadata?.choice || '').toLowerCase();
  return {
    current_choice:['yes','no'].includes(currentChoice) ? currentChoice : '',
    response_count:count,
    changes_used:Math.max(0, count - 1),
    can_change:count > 0 && count < 2,
    locked:count >= 2
  };
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

  const [audioUrl, coverUrl, consentHistory] = await Promise.all([
    signedAssetUrl(meta.audio_bucket, meta.audio_path),
    meta.cover_bucket && meta.cover_path
      ? signedAssetUrl(meta.cover_bucket, meta.cover_path)
      : Promise.resolve(''),
    getSongConsentHistory(orderId)
  ]);

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
    delivered_at: event.created_at || null,
    song_consent:songConsentState(consentHistory)
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

    const history = await getSongConsentHistory(orderId);
    const stateBefore = songConsentState(history);

    if (stateBefore.current_choice === choice) {
      res.setHeader('Cache-Control', 'no-store');
      return res.status(200).json({
        ok:true,
        choice,
        duplicate:true,
        song_consent:stateBefore
      });
    }

    if (stateBefore.locked) {
      res.setHeader('Cache-Control', 'no-store');
      return res.status(409).json({
        ok:false,
        error:'CONSENT_CHANGE_LIMIT_REACHED',
        song_consent:stateBefore
      });
    }

    const submittedAt = new Date().toISOString();
    const consentVersion = '2026-09-16-v3';
    const scope = 'song_social_media_website_official_channels';

    await db.insertEvent(
      orderId,
      'song_publish_consent',
      {
        choice,
        consent_version:consentVersion,
        scope,
        source:'delivery_page',
        change_number:history.length,
        submitted_at:submittedAt
      },
      'customer'
    );

    await mirrorCustomerResponse({
      ORDER_ID:orderId,
      RESPONSE_TYPE:'SONG_PUBLISH_CONSENT',
      RESPONSE:choice.toUpperCase(),
      PUBLISH_AUTHORIZED:choice === 'yes' ? 'YES' : 'NO',
      VIDEO_PATH:'',
      REVISION_NOTES:'',
      SOURCE:'delivery_page',
      CONSENT_VERSION:consentVersion,
      SCOPE:scope,
      CREATED_AT:submittedAt
    });

    const stateAfter = songConsentState([
      ...history,
      { metadata:{ choice }, created_at:submittedAt }
    ]);

    if (email.configured()) {
      try {
        const order = await db.selectOne(
          'orders',
          `order_id=eq.${eq(orderId)}&select=order_id,customer_email,brief&limit=1`
        );
        const admin = process.env.SONALZA_ORDERS_EMAIL || 'sonalzastudios@gmail.com';
        const customerEmail = String(order?.customer_email || '');
        const recipientName = String(order?.brief?.nombre || '-');
        const choiceLabel = choice === 'yes' ? 'SÍ' : 'NO';
        const decisionText = choice === 'yes'
          ? 'El cliente autorizó a SONALZA a publicar esta canción en redes sociales, canales oficiales y sonalza.com.'
          : 'El cliente indicó que desea mantener esta canción privada.';
        const adminHtml = `<div style="font-family:Arial,sans-serif;color:#071a33;max-width:700px">
          <h1>AUTORIZACIÓN DE PUBLICACIÓN · ${choiceLabel}</h1>
          <p><b>Order ID:</b> ${esc(orderId)}<br>
          <b>Cliente / destinatario:</b> ${esc(recipientName)}<br>
          <b>Email:</b> ${esc(customerEmail || '-')}</p>
          <p>${esc(decisionText)}</p>
          <p><b>Consent version:</b> ${esc(consentVersion)}<br>
          <b>Scope:</b> ${esc(scope)}</p>
        </div>`;
        await email.send({
          to: admin,
          replyTo: customerEmail || undefined,
          subject: `AUTORIZACIÓN DE PUBLICACIÓN · ${choiceLabel} · SONALZA · ${orderId}`,
          html: adminHtml
        });
      } catch (err) {
        console.error('publish consent admin email', err);
      }
    }

    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({
      ok:true,
      choice,
      duplicate:false,
      song_consent:stateAfter
    });
  }

  if (action === 'revision_request') {
    const notes = String(body.notes || '').trim();
    if (notes.length < 5 || notes.length > 4000) {
      return res.status(400).json({ ok:false, error:'Revision notes must be between 5 and 4000 characters.' });
    }

    const submittedAt = new Date().toISOString();

    await db.insertEvent(
      orderId,
      'revision_requested',
      {
        notes,
        source:'delivery_page',
        submitted_at:submittedAt
      },
      'customer'
    );

    await mirrorCustomerResponse({
      ORDER_ID:orderId,
      RESPONSE_TYPE:'REVISION_REQUEST',
      RESPONSE:'REQUESTED',
      PUBLISH_AUTHORIZED:'',
      VIDEO_PATH:'',
      REVISION_NOTES:notes,
      SOURCE:'delivery_page',
      CONSENT_VERSION:'',
      SCOPE:'',
      CREATED_AT:submittedAt
    });

    await db.update('orders', `order_id=eq.${eq(orderId)}`, {
      fulfillment_status:'revision_requested'
    }).catch(() => {});

    if (email.configured()) {
      try {
        const order = await db.selectOne(
          'orders',
          `order_id=eq.${eq(orderId)}&select=order_id,customer_email,brief&limit=1`
        );
        const admin = process.env.SONALZA_ORDERS_EMAIL || 'sonalzastudios@gmail.com';
        const customerEmail = String(order?.customer_email || '');
        const recipientName = String(order?.brief?.nombre || '-');
        const adminHtml = `<div style="font-family:Arial,sans-serif;color:#071a33;max-width:700px">
          <h1>REVISIÓN SOLICITADA</h1>
          <p><b>Order ID:</b> ${esc(orderId)}<br>
          <b>Cliente / destinatario:</b> ${esc(recipientName)}<br>
          <b>Email:</b> ${esc(customerEmail || '-')}</p>
          <p><b>Correcciones solicitadas:</b></p>
          <div style="white-space:pre-wrap;padding:16px;border:1px solid #dfe6ee;border-radius:12px;background:#f7f9fc">${esc(notes)}</div>
        </div>`;
        await email.send({
          to: admin,
          replyTo: customerEmail || undefined,
          subject: `REVISIÓN SOLICITADA · SONALZA · ${orderId}`,
          html: adminHtml
        });
      } catch (err) {
        console.error('revision request admin email', err);
      }
    }

    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ ok:true, submitted:true });
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

    const submittedAt = new Date().toISOString();
    const consentVersion = '2026-09-16-v2';
    const scope = publishAuthorized
      ? 'video_social_media_website_official_channels'
      : 'private_share_only';

    await db.insertEvent(
      orderId,
      'reaction_video_received',
      {
        bucket,
        path,
        publish_authorized:publishAuthorized,
        consent_version:consentVersion,
        scope,
        source:'delivery_page',
        submitted_at:submittedAt
      },
      'customer'
    );

    await mirrorCustomerResponse({
      ORDER_ID:orderId,
      RESPONSE_TYPE:'REACTION_VIDEO',
      RESPONSE:'VIDEO_RECEIVED',
      PUBLISH_AUTHORIZED:publishAuthorized ? 'YES' : 'NO',
      VIDEO_PATH:path,
      REVISION_NOTES:'',
      SOURCE:'delivery_page',
      CONSENT_VERSION:consentVersion,
      SCOPE:scope,
      CREATED_AT:submittedAt
    });

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
