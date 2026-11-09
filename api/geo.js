module.exports = async function handler(req,res){
  const action=typeof req.query?.action==='string'?req.query.action:'';
  if(action){
    const handlers={access:'access',orders:'orders','google-start':'google-start','google-callback':'google-callback',signout:'signout',config:'config',review:'review','reviews-public':'reviews-public','admin-review':'admin-review','admin-reviews':'admin-reviews',gift:'gift','admin-gift':'admin-gift'};
    if(!Object.prototype.hasOwnProperty.call(handlers,action))return res.status(404).json({ok:false,error:'Unknown customer action'});
    res.setHeader('X-Content-Type-Options','nosniff');
    return require('../lib/sonalza-customer/'+handlers[action])(req,res);
  }
  const raw = String(req.headers['x-vercel-ip-country'] || req.headers['x-country'] || '').toUpperCase();
  const country = raw === 'MX' ? 'MX' : raw === 'US' ? 'US' : null;
  const currency = country === 'MX' ? 'MXN' : country === 'US' ? 'USD' : null;
  res.setHeader('Cache-Control','private, no-store, max-age=0');
  return res.status(200).json({country,currency,supported:Boolean(country)});
};
