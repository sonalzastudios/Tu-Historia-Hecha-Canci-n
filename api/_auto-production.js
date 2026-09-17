const db = require('./_supabase');
const email = require('./_email');
const director = require('./_production-director');

function eq(value) { return encodeURIComponent(String(value)); }
function esc(value = '') { return String(value ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c])); }
function enabled() { return String(process.env.ENABLE_AUTO_PRODUCTION || '').toLowerCase() === 'true'; }

async function getOrder(orderId) {
  return db.selectOne('orders', `order_id=eq.${eq(orderId)}&select=*&limit=1`);
}

async function existingPackEvent(orderId) {
  return db.selectOne(
    'order_events',
    `order_id=eq.${eq(orderId)}&event_type=eq.production_pack_generated&select=*&order=created_at.desc&limit=1`
  );
}

async function existingNotificationEvent(orderId) {
  return db.selectOne(
    'order_events',
    `order_id=eq.${eq(orderId)}&event_type=eq.production_review_notified&select=*&order=created_at.desc&limit=1`
  );
}

function settingsText(settings = {}) {
  return [
    `Model: ${settings.model || ''}`,
    `Max Mode: ${settings.max_mode || ''}`,
    `Variety: ${settings.variety || ''}`,
    `Weirdness: ${settings.weirdness ?? ''}%`,
    `Style Influence: ${settings.style_influence ?? ''}%`,
    `Audio Influence: ${settings.audio_influence ?? ''}%`,
    `My Taste: ${settings.my_taste || ''}`,
    `Target Duration: ${settings.target_duration || ''}`
  ].join('\n');
}

async function sendReviewEmail(order, pack) {
  if (!email.configured()) return { sent: false, skipped: true };
  const admin = process.env.SONALZA_ORDERS_EMAIL || 'sonalzastudios@gmail.com';
  const html = `<div style="font-family:Arial,sans-serif;color:#071a33;max-width:760px;line-height:1.5">
    <h1 style="margin-bottom:8px">Cancion lista para revision</h1>
    <p style="margin-top:0"><b>Orden:</b> ${esc(order.order_id)}<br>
    <b>Titulo:</b> ${esc(pack.song_title)}<br>
    <b>Artista:</b> ${esc(pack.artist)} · ${esc(pack.voice_name)}<br>
    <b>Genero:</b> ${esc(pack.genre)}${pack.subgenre ? ` · ${esc(pack.subgenre)}` : ''}<br>
    <b>Duracion objetivo:</b> ${esc(pack.target_duration)}<br>
    <b>QA:</b> ${esc(pack.qa_status)} · <b>Aprobacion:</b> ${esc(pack.approval_status)}<br>
    <b>Lyrics:</b> ${esc(pack.lyrics_character_count)} / 5000 caracteres<br>
    <b>Style:</b> ${esc(pack.suno_style_character_count)} / 1000 caracteres</p>
    <hr>
    <h2>Lyrics</h2>
    <pre style="white-space:pre-wrap;font-family:Arial,sans-serif">${esc(pack.lyrics)}</pre>
    <h2>Suno Style</h2>
    <p>${esc(pack.suno_style)}</p>
    <h2>Exclude Styles</h2>
    <p>${esc(pack.exclude_styles)}</p>
    <h2>Suno Settings</h2>
    <pre style="white-space:pre-wrap;font-family:Arial,sans-serif">${esc(settingsText(pack.suno_settings))}</pre>
    <p><b>Estado:</b> PRODUCTION_PACK_READY · APPROVAL_STATUS=PENDING</p>
    <p>Revisa esta V1 antes de usarla en Suno. El sistema no enviara nada a Suno automaticamente.</p>
  </div>`;
  return email.send({
    to: admin,
    subject: `REVISAR · SONALZA · ${order.order_id} · ${pack.song_title}`,
    html
  });
}

async function ensureReviewNotification(order, pack) {
  const already = await existingNotificationEvent(order.order_id);
  if (already) return { duplicate: true };
  const result = await sendReviewEmail(order, pack);
  if (result?.sent) {
    await db.insertEvent(order.order_id, 'production_review_notified', {
      version: 'V1',
      song_title: pack.song_title,
      approval_status: pack.approval_status
    }, 'sonalza-production-director');
  }
  return result;
}

async function processOrder(orderId) {
  if (!enabled()) return { ok: false, skipped: true, reason: 'auto_production_disabled' };
  if (!db.configured()) throw new Error('Database not configured');
  if (!director.configured()) throw new Error('OpenAI production director not configured');

  const order = await getOrder(orderId);
  if (!order) throw new Error(`Order not found: ${orderId}`);

  if (order.payment_status !== 'paid' || order.status !== 'paid') {
    return { ok: false, skipped: true, reason: 'order_not_paid_and_clear', payment_status: order.payment_status, status: order.status };
  }

  const existing = await existingPackEvent(orderId);
  if (existing?.metadata?.pack) {
    const pack = existing.metadata.pack;
    await ensureReviewNotification(order, pack);
    return { ok: true, duplicate: true, pack };
  }

  const pack = await director.generate(order);

  await db.insertEvent(orderId, 'production_pack_generated', {
    version: 'V1',
    production_status: 'PRODUCTION_PACK_READY',
    approval_status: 'PENDING',
    qa_status: pack.qa_status,
    lyrics_character_count: pack.lyrics_character_count,
    suno_style_character_count: pack.suno_style_character_count,
    pack
  }, 'sonalza-production-director');

  await db.update('orders', `order_id=eq.${eq(orderId)}`, {
    fulfillment_status: 'production_pack_ready'
  });

  await ensureReviewNotification(order, pack);

  return { ok: true, duplicate: false, pack };
}

module.exports = {
  enabled,
  processOrder
};
