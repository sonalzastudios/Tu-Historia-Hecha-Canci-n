const db = require('./_supabase');
const orderToken = require('./_order-token');

function cleanChoice(value) {
  const v = String(value || '').toLowerCase();
  return ['yes','no'].includes(v) ? v : '';
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok:false, error:'Method Not Allowed' });
  }

  if (!db.configured()) {
    return res.status(503).json({ ok:false, error:'Response service is not configured.' });
  }

  const body = req.body && typeof req.body === 'object' ? req.body : {};
  const token = String(body.token || '');
  const verified = orderToken.verify(token);

  if (!verified.ok) {
    return res.status(401).json({ ok:false, error:'Invalid or expired delivery link.' });
  }

  const orderId = verified.payload.orderId;
  const action = String(body.action || '');

  if (action !== 'song_publish_consent') {
    return res.status(400).json({ ok:false, error:'Unsupported response action.' });
  }

  const choice = cleanChoice(body.choice);
  if (!choice) {
    return res.status(400).json({ ok:false, error:'Invalid consent choice.' });
  }

  try {
    await db.insertEvent(
      orderId,
      'song_publish_consent',
      {
        choice,
        consent_version: '2026-09-16-v1',
        source: 'delivery_page',
        submitted_at: new Date().toISOString()
      },
      'customer'
    );

    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ ok:true, choice });
  } catch (err) {
    console.error('delivery-response', err);
    return res.status(500).json({ ok:false, error:'Unable to save response.' });
  }
};
