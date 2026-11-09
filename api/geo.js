module.exports = async function handler(req,res){
  const action=typeof req.query?.action==='string'?req.query.action:'';
  if(action){
    const handlers={"access":()=>require('../lib/sonalza-customer/access'),"orders":()=>require('../lib/sonalza-customer/orders'),"google-start":()=>require('../lib/sonalza-customer/google-start'),"google-callback":()=>require('../lib/sonalza-customer/google-callback'),"signout":()=>require('../lib/sonalza-customer/signout'),"config":()=>require('../lib/sonalza-customer/config'),"review":()=>require('../lib/sonalza-customer/review'),"reviews-public":()=>require('../lib/sonalza-customer/reviews-public'),"admin-review":()=>require('../lib/sonalza-customer/admin-review'),"admin-reviews":()=>require('../lib/sonalza-customer/admin-reviews'),"gift":()=>require('../lib/sonalza-customer/gift'),"admin-gift":()=>require('../lib/sonalza-customer/admin-gift')};
    if(!Object.prototype.hasOwnProperty.call(handlers,action))return res.status(404).json({ok:false,error:'Unknown customer action'});
    res.setHeader('X-Content-Type-Options','nosniff');
    return handlers[action]()(req,res);
  }
  const raw = String(req.headers['x-vercel-ip-country'] || req.headers['x-country'] || '').toUpperCase();
  const country = raw === 'MX' ? 'MX' : raw === 'US' ? 'US' : null;
  const currency = country === 'MX' ? 'MXN' : country === 'US' ? 'USD' : null;
  res.setHeader('Cache-Control','private, no-store, max-age=0');
  return res.status(200).json({country,currency,supported:Boolean(country)});
};
