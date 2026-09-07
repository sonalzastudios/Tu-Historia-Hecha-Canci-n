const { validateCoupon, normalizeCode } = require('./_coupons');
const { TERMS_VERSION, PRIVACY_VERSION, checkBodySize, enforceRateLimit, verifyTurnstile, evidence } = require('./_security');
const db = require('./_supabase');
const orderToken = require('./_order-token');

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

function getGeoCountry(req) {
  const raw = String(req.headers['x-vercel-ip-country'] || req.headers['x-country'] || '').toUpperCase();
  return raw === 'US' || raw === 'MX' ? raw : null;
}

function makeOrderId() {
  return `SZ-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

function validClientRequestId(value) {
  return /^[A-Za-z0-9_-]{16,100}$/.test(String(value || ''));
}

function eq(value) {
  return encodeURIComponent(String(value));
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Metodo no permitido.' });
  if (!checkBodySize(req, 300 * 1024)) return res.status(413).json({ ok: false, error: 'La solicitud es demasiado grande.' });
  if (!(await enforceRateLimit(req, res, 'submit-order', 6, 600))) return;
  if (!db.configured()) return res.status(503).json({ ok: false, setupRequired: true, error: 'El sistema de pedidos todavia no esta conectado a la base de datos.' });

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});

    if (body.termsAccepted !== true || body.privacyAccepted !== true || body.materialsAccepted !== true) {
      return res.status(400).json({ ok: false, error: 'Debes aceptar los Terminos, la Privacidad y confirmar tus derechos sobre los materiales.' });
    }

    const draft = body.draft || {};
    const selectedRegion = body.region === 'MX' ? 'MX' : 'US';
    const detectedCountry = getGeoCountry(req);
    const regionMismatch = Boolean(detectedCountry && detectedCountry !== selectedRegion);
    const region = selectedRegion;
    const language = body.language === 'es' ? 'es' : 'en';
    const currency = region === 'MX' ? 'MXN' : 'USD';
    const product = draft.product === 'corrido' ? 'corrido' : 'song';
    const allowedAddons = ['premium', 'rush', 'video', 'second'];
    const addons = Array.isArray(body.addons) ? [...new Set(body.addons.filter(x => allowedAddons.includes(x)))] : [];
    const email = clean(draft.email, 180).toLowerCase();
    const clientRequestId = validClientRequestId(body.clientRequestId) ? String(body.clientRequestId) : null;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ ok: false, error: 'Correo electronico invalido.' });
    if (!clean(draft.nombre, 80) || !clean(draft.paraQuien, 80)) return res.status(400).json({ ok: false, error: 'Faltan datos esenciales del formulario.' });

    if (product === 'corrido') {
      const requiredLife = [draft.ocasion, draft.raices, draft.trayectoria, draft.personasClave, draft.cualidades, draft.legado, draft.emocion, draft.genero, draft.voz, draft.idioma];
      if (requiredLife.some(v => clean(v, 2000).length < 2)) return res.status(400).json({ ok: false, error: 'Faltan datos de la historia de vida. Revisa el formulario antes de continuar.' });
      if (clean(draft.raices).length < 20 || clean(draft.trayectoria).length < 20 || clean(draft.legado).length < 10) return res.status(400).json({ ok: false, error: 'Necesitamos un poco mas de detalle para preparar el Corrido de una Vida.' });
      if (!['3 min', '4 min', '5 min', '6 min'].includes(clean(draft.duracion, 20))) return res.status(400).json({ ok: false, error: 'Selecciona una duracion aproximada entre 3 y 6 minutos.' });
    } else {
      const requiredSong = [draft.ocasion, draft.genero, draft.voz, draft.idioma, draft.cualidades, draft.recuerdo, draft.emocion];
      if (requiredSong.some(v => clean(v, 1500).length < 2)) return res.status(400).json({ ok: false, error: 'Faltan datos de la cancion. Revisa el formulario antes de continuar.' });
    }

    const baseAmount = PRICING[product][currency];
    let total = baseAmount;
    addons.forEach(key => { total += PRICING[key][currency]; });

    const requestedCouponCode = normalizeCode(body.couponCode || '');
    let coupon = null;
    if (requestedCouponCode) {
      const validated = validateCoupon({ code: requestedCouponCode, product, region, currency, baseAmount });
      if (!validated.ok) return res.status(400).json({ ok: false, error: validated.error || 'El cupon ya no es valido.' });
      coupon = validated;
      total = Math.max(0, total - validated.discount);
    }

    if (clientRequestId) {
      const existing = await db.selectOne('orders', `client_request_id=eq.${eq(clientRequestId)}&select=order_id,product,region,currency,total,customer_email,status,payment_status,stripe_session_id&limit=1`);
      if (existing) {
        if (existing.customer_email !== email || existing.product !== product || existing.region !== region || Number(existing.total) !== Number(total)) {
          return res.status(409).json({ ok: false, error: 'Este intento de pedido ya existe con datos diferentes. Recarga la pagina e intenta de nuevo.' });
        }
        const token = orderToken.sign(existing.order_id);
        return res.status(200).json({
          ok: true,
          reused: true,
          orderId: existing.order_id,
          orderToken: token,
          total: Number(existing.total),
          currency: existing.currency,
          region: existing.region,
          detectedCountry,
          verificationRequired: regionMismatch,
          paymentStatus: existing.payment_status || 'unpaid',
          stripeSessionId: existing.stripe_session_id || null,
          coupon: coupon ? { code: coupon.code, discount: coupon.discount } : null,
          stored: true
        });
      }
    }

    const turnstile = await verifyTurnstile(req, body.turnstileToken, 'order');
    if (!turnstile.ok) return res.status(400).json({ ok: false, error: turnstile.error || 'No pudimos validar la verificacion de seguridad.' });

    const orderId = makeOrderId();
    const acceptedAt = new Date().toISOString();
    const record = {
      order_id: orderId,
      status: 'pending_payment',
      payment_status: 'unpaid',
      fulfillment_status: 'not_started',
      product,
      region,
      detected_country: detectedCountry,
      region_override: Boolean(body.regionOverride || regionMismatch),
      region_verification_required: regionMismatch,
      language,
      currency,
      total,
      addons,
      client_request_id: clientRequestId,
      coupon_code: coupon?.code || null,
      coupon_discount: coupon?.discount || 0,
      customer_name: null,
      customer_email: email,
      customer_phone: clean(draft.telefono, 60),
      terms_accepted: true,
      privacy_accepted: true,
      materials_accepted: true,
      terms_version: TERMS_VERSION,
      privacy_version: PRIVACY_VERSION,
      accepted_at: acceptedAt,
      acceptance_evidence: evidence(req, {
        turnstile: turnstile.skipped ? 'not_required' : 'verified',
        turnstile_hostname: turnstile.hostname || null,
        selected_region: region,
        detected_country: detectedCountry
      }),
      brief: {
        paraQuien: clean(draft.paraQuien, 100),
        nombre: clean(draft.nombre, 100),
        ocasion: clean(draft.ocasion, 120),
        genero: clean(draft.genero, 120),
        voz: clean(draft.voz, 80),
        idioma: clean(draft.idioma, 80),
        cualidades: clean(draft.cualidades),
        recuerdo: clean(draft.recuerdo),
        frase: clean(draft.frase),
        emocion: clean(draft.emocion),
        raices: clean(draft.raices),
        trayectoria: clean(draft.trayectoria),
        personasClave: clean(draft.personasClave),
        retos: clean(draft.retos),
        logros: clean(draft.logros),
        legado: clean(draft.legado),
        duracion: product === 'corrido' ? clean(draft.duracion, 20) : '2-3 min',
        customCoverPrompt: clean(draft.coverPrompt, 1500),
        customCoverMustShow: clean(draft.coverCropMustShow, 800),
        customCoverImageName: clean(draft.coverImageName, 180)
      },
      source: {
        page: clean(body.page, 300),
        referrer: clean(body.referrer, 500),
        utm: body.utm && typeof body.utm === 'object' ? body.utm : {}
      }
    };

    await db.insert('orders', record);
    await db.insertEvent(orderId, 'order_created', {
      product,
      region,
      currency,
      total,
      coupon_code: coupon?.code || null,
      region_verification_required: regionMismatch
    });

    const token = orderToken.sign(orderId);
    return res.status(200).json({
      ok: true,
      orderId,
      orderToken: token,
      total,
      currency,
      region,
      detectedCountry,
      verificationRequired: regionMismatch,
      paymentStatus: 'unpaid',
      coupon: coupon ? { code: coupon.code, discount: coupon.discount } : null,
      stored: true
    });
  } catch (err) {
    console.error('submit-order', err);
    return res.status(500).json({ ok: false, error: 'No pudimos registrar el pedido. Intenta de nuevo.' });
  }
};
