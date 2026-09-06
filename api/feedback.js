module.exports = async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({ok:false});
  try{
    const b=typeof req.body==='string'?JSON.parse(req.body||'{}'):(req.body||{});
    if(process.env.SUPABASE_URL&&process.env.SUPABASE_SERVICE_ROLE_KEY){
      await fetch(`${process.env.SUPABASE_URL.replace(/\/$/,'')}/rest/v1/exit_feedback`,{method:'POST',headers:{apikey:process.env.SUPABASE_SERVICE_ROLE_KEY,Authorization:`Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify({created_at:new Date().toISOString(),reason:String(b.reason||'').slice(0,80),page:String(b.page||'').slice(0,300),currency:String(b.currency||'').slice(0,10),region:String(b.region||'').slice(0,5),language:String(b.language||'').slice(0,5)})});
    }
    return res.status(200).json({ok:true});
  }catch(e){return res.status(200).json({ok:true})}
}
