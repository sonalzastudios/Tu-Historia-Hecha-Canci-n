const { checkBodySize, enforceRateLimit, sniffImage } = require('./_security');
const db = require('./_supabase');
const orderToken = require('./_order-token');

function cleanName(value = 'image.jpg') {
  return String(value).toLowerCase().replace(/[^a-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '').slice(-100) || 'image.jpg';
}

function eq(value) {
  return encodeURIComponent(String(value));
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Metodo no permitido.' });
  if (!checkBodySize(req, 4 * 1024 * 1024)) return res.status(413).json({ ok: false, error: 'La imagen es demasiado grande.' });
  if (!(await enforceRateLimit(req, res, 'upload-cover', 8, 600))) return;
  if (!db.configured()) return res.status(503).json({ ok: false, storageNotConfigured: true, error: 'El almacenamiento todavia no esta habilitado.' });

  try {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const bucket = process.env.SUPABASE_COVER_BUCKET || 'sonalza-covers';
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const orderId = String(body.orderId || '').trim();
    const verified = orderToken.verify(body.orderToken, orderId);
    if (!verified.ok) return res.status(401).json({ ok: false, error: verified.error || 'No pudimos validar este pedido.' });

    const order = await db.selectOne('orders', `order_id=eq.${eq(orderId)}&select=order_id,status,payment_status,addons,cover_path&limit=1`);
    if (!order) return res.status(404).json({ ok: false, error: 'No encontramos este pedido.' });
    if (!Array.isArray(order.addons) || !order.addons.includes('premium')) return res.status(400).json({ ok: false, error: 'Este pedido no incluye Portada personalizada.' });
    if (order.payment_status === 'paid') return res.status(409).json({ ok: false, error: 'La foto de portada ya no puede modificarse desde este enlace.' });

    const declaredMimeType = String(body.mimeType || '');
    const dataBase64 = String(body.dataBase64 || '');
    if (!dataBase64) return res.status(400).json({ ok: false, error: 'No recibimos la imagen.' });

    let buffer;
    try { buffer = Buffer.from(dataBase64, 'base64'); } catch (_) { buffer = null; }
    if (!buffer || !buffer.length || buffer.length > 2.5 * 1024 * 1024) {
      return res.status(413).json({ ok: false, error: 'La imagen procesada es demasiado grande. Usa una foto de menor tamano.' });
    }

    const detected = sniffImage(buffer);
    if (!detected) return res.status(400).json({ ok: false, error: 'El archivo no parece ser una imagen JPEG, PNG o WebP valida.' });
    const acceptedDeclared = [detected.mime, detected.mime === 'image/jpeg' ? 'image/jpg' : detected.mime];
    if (declaredMimeType && !acceptedDeclared.includes(declaredMimeType.toLowerCase())) {
      return res.status(400).json({ ok: false, error: 'El tipo real del archivo no coincide con el formato declarado.' });
    }

    const safe = cleanName(body.fileName || `cover.${detected.ext}`);
    const base = safe.replace(/\.[^.]+$/, '').slice(0, 48) || 'cover';
    const objectId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
    const path = `orders/${orderId}/cover/${objectId}-${base}.${detected.ext}`;
    const endpoint = `${String(url).replace(/\/$/, '')}/storage/v1/object/${encodeURIComponent(bucket)}/${path.split('/').map(encodeURIComponent).join('/')}`;

    const r = await fetch(endpoint, {
      method: 'POST',
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': detected.mime,
        'Cache-Control': '3600',
        'x-upsert': 'false'
      },
      body: buffer
    });
    if (!r.ok) {
      const detail = await r.text().catch(() => '');
      console.error('Cover upload failed', r.status, detail);
      return res.status(502).json({ ok: false, error: 'No pudimos guardar la foto de portada. Intenta de nuevo.' });
    }

    const now = new Date().toISOString();
    await db.update('orders', `order_id=eq.${eq(orderId)}`, {
      cover_bucket: bucket,
      cover_path: path,
      cover_uploaded_at: now
    });
    await db.insert('order_files', {
      order_id: orderId,
      kind: 'cover_reference',
      bucket,
      path,
      mime_type: detected.mime,
      byte_size: buffer.length,
      original_name: safe,
      metadata: { source: 'customer_upload' }
    });
    await db.insertEvent(orderId, 'cover_uploaded', {
      bucket,
      path,
      mime_type: detected.mime,
      byte_size: buffer.length
    });

    return res.status(200).json({ ok: true, orderId, path, bucket });
  } catch (err) {
    console.error('upload-cover', err);
    return res.status(500).json({ ok: false, error: 'No pudimos guardar la foto de portada. Intenta de nuevo.' });
  }
};
