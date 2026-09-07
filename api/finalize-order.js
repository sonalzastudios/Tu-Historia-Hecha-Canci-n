const { checkBodySize, enforceRateLimit } = require('./_security');
const db = require('./_supabase');
const orderToken = require('./_order-token');
const email = require('./_email');
const stripe = require('./_stripe');

function eq(value) { return encodeURIComponent(String(value)); }
function esc(value = '') { return String(value ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c])); }
function money(amount, currency) { return currency === 'MXN' ? `MX$${Number(amount).toLocaleString('es-MX')}` : `US$${Number(amount).toLocaleString('en-US')}`; }

function orderEmailHtml(order) {
  const b = order.brief || {};
  const rows = [
    ['Pedido', order.order_id],
    ['Estado', order.status],
    ['Region', order.region],
    ['Pais detectado', order.detected_country || 'No disponible'],
    ['Verificacion regional', order.region_verification_required ? 'REQUERIDA' : 'Sin discrepancia'],
    ['Producto', order.product === 'corrido' ? 'Corrido de una Vida' : 'Cancion Personalizada'],
    ['Duracion', b.duracion || '2-3 min aprox.'],
    ['Total', money(order.total, order.currency)],
    ['Cupon', order.coupon_code || '-'],
    ['Para', b.nombre || '-'],
    ['Relacion', b.paraQuien || '-'],
    ['Ocasion', b.ocasion || '-'],
    ['Genero', b.genero || '-'],
    ['Voz', b.voz || '-'],
    ['Idioma', b.idioma || '-'],
    ['Email', order.customer_email],
    ['Telefono', order.customer_phone || '-'],
    ['Portada privada', order.cover_path || '-'],
    ['Terminos', `${order.terms_version || '-'} · aceptados`],
    ['Privacidad', `${order.privacy_version || '-'} · aceptada`]
  ];
  const life = order.product === 'corrido' ? `
    <h2>Historia de vida</h2>
    <p><b>Raices:</b><br>${esc(b.raices || '-')}</p>
    <p><b>Trayectoria:</b><br>${esc(b.trayectoria || '-')}</p>
    <p><b>Personas clave:</b><br>${esc(b.personasClave || '-')}</p>
    <p><b>Retos:</b><br>${esc(b.retos || '-')}</p>
    <p><b>Logros:</b><br>${esc(b.logros || '-')}</p>
    <p><b>Legado:</b><br>${esc(b.legado || '-')}</p>` : '';
  return `<div style="font-family:Arial,sans-serif;color:#071a33;max-width:760px">
    <h1>Pedido SONALZA pendiente de pago</h1>
    <p><b>${esc(order.order_id)}</b> · ${esc(money(order.total, order.currency))}</p>
    <table style="border-collapse:collapse;width:100%">${rows.map(([a,v]) => `<tr><td style="padding:8px;border-bottom:1px solid #eee;color:#667">${esc(a)}</td><td style="padding:8px;border-bottom:1px solid #eee"><b>${esc(v)}</b></td></tr>`).join('')}</table>
    <h2>Historia</h2>
    <p><b>Cualidades:</b><br>${esc(b.cualidades || '-')}</p>
    <p><b>Recuerdo:</b><br>${esc(b.recuerdo || '-')}</p>
    <p><b>Frase:</b><br>${esc(b.frase || '-')}</p>
    <p><b>Mensaje:</b><br>${esc(b.emocion || '-')}</p>
    ${life}
  </div>`;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok:false, error:'Metodo no permitido.' });
  if (!checkBodySize(req, 32 * 1024)) return res.status(413).json({ ok:false, error:'La solicitud es demasiado grande.' });
  if (!(await enforceRateLimit(req, res, 'finalize-order', 12, 600))) return;
  if (!db.configured()) return res.status(503).json({ ok:false, setupRequired:true, error:'La base de datos no esta configurada.' });

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const orderId = String(body.orderId || '').trim();
    const verified = orderToken.verify(body.orderToken, orderId);
    if (!verified.ok) return res.status(401).json({ ok:false, error:verified.error || 'No pudimos validar este pedido.' });

    let order = await db.selectOne('orders', `order_id=eq.${eq(orderId)}&select=*&limit=1`);
    if (!order) return res.status(404).json({ ok:false, error:'No encontramos este pedido.' });

    if (!order.submitted_at) {
      const submittedAt = new Date().toISOString();
      await db.update('orders', `order_id=eq.${eq(orderId)}`, { submitted_at: submittedAt });
      await db.insertEvent(orderId, 'order_submitted', { cover_path: order.cover_path || null });
      order = { ...order, submitted_at: submittedAt };
    }

    let emailed = false;
    const emailUnpaid = String(process.env.EMAIL_UNPAID_ORDERS || '').toLowerCase() === 'true' || !stripe.enabled();
    if (emailUnpaid && email.configured() && !order.admin_notified_at) {
      try {
        const to = process.env.SONALZA_ORDERS_EMAIL || 'sonalzastudios@gmail.com';
        await email.send({
          to,
          replyTo: order.customer_email,
          subject: `Pedido SONALZA pendiente · ${order.order_id}`,
          html: orderEmailHtml(order)
        });
        emailed = true;
        await db.update('orders', `order_id=eq.${eq(orderId)}`, { admin_notified_at: new Date().toISOString() });
        await db.insertEvent(orderId, 'unpaid_admin_email_sent', {});
      } catch (mailErr) {
        console.error('finalize-order email', mailErr);
        await db.insertEvent(orderId, 'unpaid_admin_email_failed', { message: String(mailErr.message || '').slice(0, 300) }).catch(() => {});
      }
    }

    return res.status(200).json({
      ok: true,
      orderId,
      status: order.status,
      paymentStatus: order.payment_status,
      stripeCheckoutEnabled: stripe.enabled(),
      emailed
    });
  } catch (err) {
    console.error('finalize-order', err);
    return res.status(500).json({ ok:false, error:'No pudimos finalizar el registro del pedido. Intenta de nuevo.' });
  }
};
