function cleanName(value='image.jpg') {
  return String(value).toLowerCase().replace(/[^a-z0-9._-]+/g,'-').replace(/^-+|-+$/g,'').slice(-100) || 'image.jpg';
}

module.exports = async function handler(req,res) {
  if (req.method !== 'POST') return res.status(405).json({ok:false,error:'Método no permitido.'});
  try {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const bucket = process.env.SUPABASE_COVER_BUCKET;
    if (!url || !key || !bucket) {
      return res.status(503).json({ok:false,storageNotConfigured:true,error:'La carga de imágenes todavía no está habilitada.'});
    }
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const mimeType = String(body.mimeType || 'image/jpeg');
    if (!/^image\/(jpeg|jpg|png|webp)$/i.test(mimeType)) return res.status(400).json({ok:false,error:'Formato de imagen no compatible.'});
    const dataBase64 = String(body.dataBase64 || '');
    if (!dataBase64) return res.status(400).json({ok:false,error:'No recibimos la imagen.'});
    const buffer = Buffer.from(dataBase64,'base64');
    if (!buffer.length || buffer.length > 3.5 * 1024 * 1024) return res.status(413).json({ok:false,error:'La imagen es demasiado grande. Usa una foto de menor tamaño.'});
    const safe = cleanName(body.fileName || 'cover.jpg');
    const ext = mimeType.includes('png') ? 'png' : mimeType.includes('webp') ? 'webp' : 'jpg';
    const date = new Date();
    const folder = `${date.getUTCFullYear()}-${String(date.getUTCMonth()+1).padStart(2,'0')}`;
    const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2,9)}`;
    const base = safe.replace(/\.[^.]+$/,'').slice(0,48) || 'cover';
    const path = `covers/${folder}/${id}-${base}.${ext}`;
    const endpoint = `${url.replace(/\/$/,'')}/storage/v1/object/${encodeURIComponent(bucket)}/${path.split('/').map(encodeURIComponent).join('/')}`;
    const r = await fetch(endpoint, {
      method:'POST',
      headers:{
        apikey:key,
        Authorization:`Bearer ${key}`,
        'Content-Type':mimeType,
        'Cache-Control':'3600',
        'x-upsert':'false'
      },
      body:buffer
    });
    if (!r.ok) {
      const detail = await r.text().catch(()=> '');
      console.error('Cover upload failed', r.status, detail);
      return res.status(502).json({ok:false,error:'No pudimos guardar la foto de portada. Intenta de nuevo.'});
    }
    return res.status(200).json({ok:true,path,bucket});
  } catch (err) {
    console.error(err);
    return res.status(500).json({ok:false,error:'No pudimos guardar la foto de portada. Intenta de nuevo.'});
  }
};
