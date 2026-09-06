const PRICING = {
  song: { USD: 49, MXN: 599 },
  corrido: { USD: 249, MXN: 1999 },
  premium: { USD: 29, MXN: 299 },
  rush: { USD: 19, MXN: 199 },
  video: { USD: 29, MXN: 299 },
  second: { USD: 25, MXN: 249 }
};

function clean(value, max = 5000) {
  return String(value ?? '').trim().slice(0, max);
}
function esc(value='') {
  return clean(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function money(amount, currency) {
  return currency === 'MXN' ? `MX$${Number(amount).toLocaleString('es-MX')}` : `US$${Number(amount).toLocaleString('en-US')}`;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok:false, error:'Método no permitido.' });
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const draft = body.draft || {};
    const region = body.region === 'MX' ? 'MX' : 'US';
    const language = body.language === 'es' ? 'es' : 'en';
    const currency = region === 'MX' ? 'MXN' : 'USD';
    const product = draft.product === 'corrido' ? 'corrido' : 'song';
    const allowedAddons = ['premium','rush','video','second'];
    const addons = Array.isArray(body.addons) ? body.addons.filter(x => allowedAddons.includes(x)) : [];
    const email = clean(draft.email, 180);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ ok:false, error:'Correo electrónico inválido.' });
    if (!clean(draft.nombre, 80) || !clean(draft.paraQuien, 80)) return res.status(400).json({ ok:false, error:'Faltan datos esenciales del brief.' });

    let total = PRICING[product][currency];
    addons.forEach(key => total += PRICING[key][currency]);
    const orderId = `SZ-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2,6).toUpperCase()}`;
    const createdAt = new Date().toISOString();
    const record = {
      order_id: orderId,
      created_at: createdAt,
      status: 'pending_payment',
      product,
      region,
      language,
      currency,
      total,
      addons,
      customer_email: email,
      customer_phone: clean(draft.telefono, 60),
      brief: {
        paraQuien: clean(draft.paraQuien, 100), nombre: clean(draft.nombre, 100), ocasion: clean(draft.ocasion, 120),
        genero: clean(draft.genero, 120), voz: clean(draft.voz, 80), idioma: clean(draft.idioma, 80),
        cualidades: clean(draft.cualidades), recuerdo: clean(draft.recuerdo), frase: clean(draft.frase), emocion: clean(draft.emocion)
      },
      source: {
        page: clean(body.page, 300), referrer: clean(body.referrer, 500), utm: body.utm || {}
      }
    };

    let stored = false;
    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const r = await fetch(`${process.env.SUPABASE_URL.replace(/\/$/,'')}/rest/v1/orders`, {
        method:'POST',
        headers:{
          apikey:process.env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization:`Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type':'application/json',
          Prefer:'return=minimal'
        },
        body:JSON.stringify(record)
      });
      if (!r.ok) throw new Error(`No se pudo guardar la orden (${r.status}).`);
      stored = true;
    }

    let emailed = false;
    if (process.env.RESEND_API_KEY) {
      const adminEmail = process.env.SONALZA_ORDERS_EMAIL || 'sonalzastudios@gmail.com';
      const from = process.env.SONALZA_FROM_EMAIL || 'SONALZA Orders <orders@sonalza.com>';
      const rows = [
        ['Pedido', orderId], ['Región', region], ['Idioma del sitio', language.toUpperCase()], ['Producto', product === 'corrido' ? 'Corrido de Tu Vida' : 'Canción Personalizada'], ['Total', money(total,currency)],
        ['Cliente', draft.nombre], ['Para quién', draft.paraQuien], ['Ocasión', draft.ocasion], ['Género', draft.genero], ['Voz', draft.voz], ['Idioma', draft.idioma],
        ['Email', email], ['Teléfono', draft.telefono || '—'], ['Extras', addons.join(', ') || 'Ninguno']
      ];
      const html = `<div style="font-family:Arial,sans-serif;color:#071a33;max-width:700px"><h1>Nuevo pedido SONALZA</h1><p><b>${esc(orderId)}</b> · ${esc(money(total,currency))}</p><table style="border-collapse:collapse;width:100%">${rows.map(([a,b])=>`<tr><td style="padding:8px;border-bottom:1px solid #eee;color:#667">${esc(a)}</td><td style="padding:8px;border-bottom:1px solid #eee"><b>${esc(b)}</b></td></tr>`).join('')}</table><h2>Historia</h2><p><b>Cualidades:</b><br>${esc(draft.cualidades)}</p><p><b>Recuerdo:</b><br>${esc(draft.recuerdo)}</p><p><b>Frase:</b><br>${esc(draft.frase || '—')}</p><p><b>Mensaje:</b><br>${esc(draft.emocion)}</p></div>`;
      const r = await fetch('https://api.resend.com/emails', {
        method:'POST',
        headers:{Authorization:`Bearer ${process.env.RESEND_API_KEY}`,'Content-Type':'application/json'},
        body:JSON.stringify({from,to:[adminEmail],reply_to:email,subject:`Nuevo pedido SONALZA · ${orderId}`,html})
      });
      if (!r.ok) throw new Error(`No se pudo enviar la notificación (${r.status}).`);
      emailed = true;
    }

    if (!stored && !emailed) {
      return res.status(503).json({
        ok:false,
        setupRequired:true,
        error:'La recepción de pedidos aún no está configurada. Agrega Supabase y/o Resend en las variables de entorno de Vercel.'
      });
    }

    return res.status(200).json({ ok:true, orderId, total, currency, stored, emailed });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok:false, error:'No pudimos registrar el pedido. Intenta de nuevo.' });
  }
};
