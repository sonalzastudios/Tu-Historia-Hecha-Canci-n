function clean(value,max=5000){return String(value??'').trim().slice(0,max)}
function esc(value=''){return clean(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
module.exports = async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({ok:false,error:'Método no permitido.'});
  try{
    const b=typeof req.body==='string'?JSON.parse(req.body||'{}'):(req.body||{});
    const email=clean(b.email,180);
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ok:false,error:'Correo inválido.'});
    const leadId=`SZB-${Date.now().toString(36).toUpperCase()}`;
    const region=b.region==='MX'?'MX':'US'; const language=b.language==='es'?'es':'en'; const currency=region==='MX'?'MXN':'USD';
    const record={lead_id:leadId,created_at:new Date().toISOString(),status:'new',name:clean(b.name,120),business:clean(b.business,180),email,phone:clean(b.phone,80),project_type:clean(b.projectType,120),budget:clean(b.budget,120),message:clean(b.message),currency,region,language};
    let stored=false,emailed=false;
    if(process.env.SUPABASE_URL&&process.env.SUPABASE_SERVICE_ROLE_KEY){
      const r=await fetch(`${process.env.SUPABASE_URL.replace(/\/$/,'')}/rest/v1/business_leads`,{method:'POST',headers:{apikey:process.env.SUPABASE_SERVICE_ROLE_KEY,Authorization:`Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify(record)});
      if(!r.ok) throw new Error(`No se pudo guardar el lead (${r.status}).`); stored=true;
    }
    if(process.env.RESEND_API_KEY){
      const to=process.env.SONALZA_ORDERS_EMAIL||'sonalzastudios@gmail.com';
      const from=process.env.SONALZA_FROM_EMAIL||'SONALZA Orders <orders@sonalza.com>';
      const html=`<div style="font-family:Arial,sans-serif;color:#071a33"><h1>Nueva solicitud comercial SONALZA</h1><p><b>${esc(record.name)}</b> · ${esc(record.business)}</p><p><b>Email:</b> ${esc(email)}<br><b>Teléfono:</b> ${esc(record.phone||'—')}<br><b>Región:</b> ${esc(record.region)} · ${esc(record.currency)}<br><b>Idioma:</b> ${esc(record.language.toUpperCase())}<br><b>Proyecto:</b> ${esc(record.project_type)}<br><b>Presupuesto:</b> ${esc(record.budget||'—')}</p><h2>Mensaje</h2><p>${esc(record.message)}</p></div>`;
      const r=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${process.env.RESEND_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({from,to:[to],reply_to:email,subject:`Solicitud comercial SONALZA · ${leadId}`,html})});
      if(!r.ok) throw new Error(`No se pudo enviar la notificación (${r.status}).`); emailed=true;
    }
    if(!stored&&!emailed) return res.status(503).json({ok:false,setupRequired:true,error:'La recepción de solicitudes aún no está configurada en Vercel.'});
    return res.status(200).json({ok:true,leadId,stored,emailed});
  }catch(e){console.error(e);return res.status(500).json({ok:false,error:'No pudimos enviar la solicitud. Intenta de nuevo.'})}
}
