module.exports = function handler(req,res){
  const raw = String(req.headers['x-vercel-ip-country'] || req.headers['x-country'] || '').toUpperCase();
  const country = raw === 'MX' ? 'MX' : raw === 'US' ? 'US' : null;
  res.setHeader('Cache-Control','no-store, max-age=0');
  return res.status(200).json({country});
};
