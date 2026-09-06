module.exports = function handler(req,res){
  const raw = String(req.headers['x-vercel-ip-country'] || req.headers['x-country'] || '').toUpperCase();
  const country = raw === 'MX' ? 'MX' : raw === 'US' ? 'US' : null;
  const currency = country === 'MX' ? 'MXN' : country === 'US' ? 'USD' : null;
  res.setHeader('Cache-Control','private, no-store, max-age=0');
  return res.status(200).json({country,currency,supported:Boolean(country)});
};
