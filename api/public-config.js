module.exports = async function handler(req,res) {
  if (req.method !== 'GET') return res.status(405).json({ok:false});
  res.setHeader('Cache-Control','public, max-age=300');
  return res.status(200).json({
    ok:true,
    turnstileSiteKey: process.env.TURNSTILE_SITE_KEY || '',
    turnstileRequired: String(process.env.REQUIRE_TURNSTILE || '').toLowerCase() === 'true',
    stripeCheckoutEnabled: String(process.env.ENABLE_STRIPE_CHECKOUT || '').toLowerCase() === 'true' && Boolean(process.env.STRIPE_SECRET_KEY)
  });
};
