const { validateCoupon } = require('./_coupons');

const PRICING = {
  song: { USD:49, MXN:599 },
  corrido: { USD:249, MXN:1999 }
};

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ok:false,error:'Método no permitido.'});
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const product = body.product === 'corrido' ? 'corrido' : 'song';
    const region = body.region === 'MX' ? 'MX' : 'US';
    const currency = region === 'MX' ? 'MXN' : 'USD';
    const language = body.language === 'en' ? 'en' : 'es';
    const result = validateCoupon({code:body.code, product, region, currency, baseAmount:PRICING[product][currency]});
    if (!result.ok) {
      const en = {
        'Código de cupón vacío.':'Enter a coupon code.',
        'Este cupón no es válido o no está activo.':'This coupon is not valid or active.',
        'Este cupón todavía no está activo.':'This coupon is not active yet.',
        'Este cupón ya venció.':'This coupon has expired.',
        'Este cupón no aplica a este producto.':'This coupon does not apply to this product.',
        'Este cupón no aplica en esta región.':'This coupon does not apply in this region.',
        'Este cupón no está configurado correctamente.':'This coupon is not configured correctly.',
        'Este cupón no genera un descuento válido.':'This coupon does not generate a valid discount.'
      };
      return res.status(400).json({...result,error:language==='en' ? (en[result.error] || 'This coupon is not valid.') : result.error});
    }
    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ok:false,error:'No pudimos validar el cupón.'});
  }
};
