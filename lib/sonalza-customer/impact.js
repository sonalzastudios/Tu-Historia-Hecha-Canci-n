const db=require('../../api/_supabase');
module.exports=async(req,res)=>{
res.setHeader('Cache-Control','public, max-age=60, s-maxage=3600');
res.setHeader('X-Content-Type-Options','nosniff');
if(req.method!=='GET')return res.status(405).json({ok:false});
if(!db.configured())return res.status(200).json({ok:true,deliveredSongs:null,verified:false});
try{
const base=String(process.env.SUPABASE_URL||'').replace(/\/$/,'');
const key=String(process.env.SUPABASE_SERVICE_ROLE_KEY||'');
const url=base+'/rest/v1/orders?select=order_id&payment_status=eq.paid&status=in.(delivered,completed)';
const response=await fetch(url,{method:'HEAD',headers:{apikey:key,Authorization:'Bearer '+key,Prefer:'count=exact'}});
if(!response.ok)throw Error('count unavailable '+response.status);
const range=String(response.headers.get('content-range')||'');
const match=range.match(/\/(\d+)$/);
const total=match?Number(match[1]):null;
if(!Number.isSafeInteger(total)||total<0)throw Error('no reliable count');
return res.status(200).json({ok:true,deliveredSongs:total,verified:true,metric:'paid_delivered_orders'});
}catch(e){console.error('verified social proof count',e.message);return res.status(200).json({ok:true,deliveredSongs:null,verified:false});}
};