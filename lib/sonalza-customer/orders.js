const db=require('../../api/_supabase');const auth=require('../../api/_customer-access');const {enforceRateLimit}=require('../../api/_security');
const eq=x=>encodeURIComponent(String(x));
const selectFields='order_id,product,status,payment_status,fulfillment_status,created_at,currency,total,customer_email';
function clean(row){return {orderId:row.order_id,product:row.product,status:row.status||'pending',payment:row.payment_status||'pending',production:row.fulfillment_status||'not_started',createdAt:row.created_at||null,currency:row.currency,total:row.total};}
module.exports=async(req,res)=>{auth.noStore(res);if(req.method!=='GET')return res.status(405).json({ok:false});if(!(await enforceRateLimit(req,res,'customer-orders',40,600)))return;
if(!db.configured())return res.status(503).json({ok:false,error:'El sistema de pedidos no esta disponible.'});
const access=auth.verify(String(req.query.access||''),'order');const logged=auth.session(req);if(!access&&!logged)return res.status(401).json({ok:false,error:'Verifica tu correo o inicia sesion.'});
try{let rows=[];if(access){rows=await db.select('orders','order_id=eq.'+eq(access.orderId)+'&select='+selectFields+'&limit=1');}else{rows=await db.select('orders','customer_email=ilike.'+eq(logged.email)+'&select='+selectFields+'&order=created_at.desc&limit=50');rows=(rows||[]).filter(row=>String(row.customer_email||'').trim().toLowerCase()===logged.email.toLowerCase());}
const gifts=new Map();const deliveryEvidence=new Set();const ids=(rows||[]).map(r=>String(r.order_id||'')).filter(x=>/^[A-Z0-9-]{6,50}$/.test(x)).slice(0,50);
if(ids.length){
try{
const sent=await db.select('order_events','order_id=in.('+ids.join(',')+')&event_type=eq.delivery_email_sent&select=order_id&limit=200');
for(const record of sent||[])deliveryEvidence.add(record.order_id);
}catch(error){console.error('customer delivery evidence',error.message);}
try{const ev=await db.select('order_events','order_id=in.('+ids.join(',')+')&event_type=eq.customer_gift_published&select=order_id,metadata,created_at&order=created_at.desc&limit=100');for(const e of ev||[]){const giftId=String(e.metadata?.giftId||'');if(!gifts.has(e.order_id)&&/^[a-f0-9]{32}$/.test(giftId)){const token=auth.sign({purpose:'gift',orderId:e.order_id,giftId},3600*24*365);gifts.set(e.order_id,'/regalo.html?access='+encodeURIComponent(token));}}}catch(e){console.error('customer gift links',e.message);}}
return res.status(200).json({ok:true,orders:(rows||[]).map(row=>({...clean(row),...(deliveryEvidence.has(row.order_id)&&row.payment_status==='paid'?{status:'completed',production:'delivered'}:{}),giftUrl:gifts.get(row.order_id)||null})),account:logged?{email:logged.email,name:logged.name||''}:null});}catch(e){console.error('customer-orders',e.message);return res.status(503).json({ok:false,error:'No pudimos consultar tus pedidos.'});}};