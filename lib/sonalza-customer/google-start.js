const crypto=require('crypto');const auth=require('../../api/_customer-access');
module.exports=async(req,res)=>{auth.noStore(res);if(req.method!=='GET')return res.status(405).end();
const client=String(process.env.SONALZA_GOOGLE_CLIENT_ID||'');const secret=String(process.env.SONALZA_GOOGLE_CLIENT_SECRET||'');const redirect=String(process.env.SONALZA_GOOGLE_REDIRECT_URI||'');
if(!client||!secret||!redirect||!/^https:\/\/sonalza\.com\/api\/customer\\?action=google-callback$/.test(redirect))return res.redirect(302,'/mi-sonalza.html?auth=setup');
try{const state=crypto.randomBytes(24).toString('hex');const token=auth.sign({purpose:'oauth',state},600);
res.setHeader('Set-Cookie','sonalza_oauth='+encodeURIComponent(token)+'; Path=/api/customer; Secure; HttpOnly; SameSite=Lax; Max-Age=600');
const q=new URLSearchParams({client_id:client,redirect_uri:redirect,response_type:'code',scope:'openid email profile',state,prompt:'select_account',access_type:'online'});return res.redirect(302,'https://accounts.google.com/o/oauth2/v2/auth?'+q.toString());}catch(e){console.error('google start',e.message);return res.redirect(302,'/mi-sonalza.html?auth=setup');}};