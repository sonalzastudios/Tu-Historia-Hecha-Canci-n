function loadCoupons() {
  const raw = process.env.SONALZA_COUPONS_JSON || '{}';
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (_) {
    return {};
  }
}

function normalizeCode(value='') {
  return String(value || '').trim().toUpperCase().replace(/\s+/g,'');
}

function validateCoupon({ code, product, region, currency, baseAmount }) {
  const normalized = normalizeCode(code);
  if (!normalized) return { ok:false, error:'Código de cupón vacío.' };
  const coupons = loadCoupons();
  const rule = coupons[normalized];
  if (!rule || rule.active === false) return { ok:false, error:'Este cupón no es válido o no está activo.' };

  const now = Date.now();
  if (rule.startsAt && now < Date.parse(rule.startsAt)) return { ok:false, error:'Este cupón todavía no está activo.' };
  if (rule.expiresAt && now > Date.parse(rule.expiresAt)) return { ok:false, error:'Este cupón ya venció.' };
  if (Array.isArray(rule.products) && !rule.products.includes(product)) return { ok:false, error:'Este cupón no aplica a este producto.' };
  if (Array.isArray(rule.regions) && !rule.regions.includes(region)) return { ok:false, error:'Este cupón no aplica en esta región.' };

  const base = Math.max(0, Number(baseAmount || 0));
  let discount = 0;
  if (rule.type === 'percent') {
    const pct = Math.max(0, Math.min(100, Number(rule.value || 0)));
    discount = Math.round(base * pct / 100);
  } else if (rule.type === 'fixed') {
    const rawValue = typeof rule.value === 'object' && rule.value !== null ? rule.value[currency] : rule.value;
    discount = Math.max(0, Number(rawValue || 0));
  } else {
    return { ok:false, error:'Este cupón no está configurado correctamente.' };
  }
  discount = Math.min(base, Math.round(discount));
  if (discount <= 0) return { ok:false, error:'Este cupón no genera un descuento válido.' };

  return {
    ok:true,
    code:normalized,
    discount,
    label:String(rule.label || normalized).slice(0,80)
  };
}

module.exports = { validateCoupon, normalizeCode };
