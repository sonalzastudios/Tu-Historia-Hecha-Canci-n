const db = require('./_supabase');
const orderToken = require('./_order-token');

function eq(value) {
  return encodeURIComponent(String(value));
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ ok:false, error:'Method Not Allowed' });
  }

  if (!db.configured()) {
    return res.status(503).json({ ok:false, error:'Delivery service is not configured.' });
  }

  const token = String(req.query?.token || '');
  const verified = orderToken.verify(token);

  if (!verified.ok) {
    return res.status(401).json({ ok:false, error:'Invalid or expired delivery link.' });
  }

  const orderId = verified.payload.orderId;

  try {
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
    if (!meta.audio_url) {
      return res.status(404).json({ ok:false, error:'Delivery not available.' });
    }

    res.setHeader('Cache-Control', 'private, no-store, max-age=0');
    res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive');

    return res.status(200).json({
      ok:true,
      language: order.language === 'en' ? 'en' : 'es',
      song_title: meta.song_title || '',
      audio_url: meta.audio_url,
      download_url: meta.download_url || meta.audio_url,
      cover_url: meta.cover_url || '',
      revision_url: meta.revision_url || '',
      delivered_at: event.created_at || null
    });
  } catch (err) {
    console.error('delivery endpoint', err);
    return res.status(500).json({ ok:false, error:'Unable to load delivery.' });
  }
};
