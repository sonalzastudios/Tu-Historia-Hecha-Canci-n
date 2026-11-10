const db=require('../../api/_supabase');
const eq=x=>encodeURIComponent(String(x));
function validate(b){
const rating=Number(b.rating),message=String(b.message||'').trim().slice(0,1000);
const name=String(b.name||'Cliente SONALZA').trim().slice(0,50)||'Cliente SONALZA';
if(!Number.isInteger(rating)||rating<1||rating>5||message.length<10||!b.consent){
const err=new Error('Revisa tu calificación, comentario y autorización.');
err.status=400;throw err;
}
return {rating,message,name,consent:true,moderated:false,review_scope:'song_and_customer_experience'};
}
async function status(orderId){
const id=eq(orderId);
const existing=await db.selectOne('order_events',
'order_id=eq.'+id+'&event_type=in.(customer_review_submitted,customer_review_approved)&select=event_type,created_at&order=created_at.desc&limit=1');
return {submitted:Boolean(existing),approved:existing?.event_type==='customer_review_approved'};
}
async function submit(orderId,body,source){
const existing=await status(orderId);
if(existing.submitted){
const err=new Error('Ya recibimos una reseña de este pedido. Gracias por compartir tu experiencia.');
err.status=409;throw err;
}
const payload=validate(body);
await db.insertEvent(orderId,'customer_review_submitted',{...payload,source},'customer');
try {await require('../../api/_survey-followup').cancelPending(orderId,'customer_review_received');}
catch(error){console.error('review follow-up cancellation',error);}
return {ok:true,message:'Gracias por compartir tu experiencia y tu canción. Revisaremos tu reseña antes de publicarla.'};
}
module.exports={submit,status,validate};