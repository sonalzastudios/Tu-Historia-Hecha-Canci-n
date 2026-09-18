function configured() {
  return Boolean(process.env.RESEND_API_KEY);
}

async function send({ to, subject, html, replyTo, scheduledAt, tags, idempotencyKey }) {
  if (!configured()) return { sent: false, skipped: true };
  const from = process.env.SONALZA_FROM_EMAIL || 'SONALZA Orders <orders@sonalza.com>';
  const recipients = Array.isArray(to) ? to : [to];
  const payload = { from, to: recipients, subject, html };
  if (replyTo) payload.reply_to = replyTo;
  if (scheduledAt) payload.scheduled_at = scheduledAt;
  if (Array.isArray(tags) && tags.length) payload.tags = tags;
  const headers = {
    Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    'Content-Type': 'application/json'
  };
  if (idempotencyKey) headers['Idempotency-Key'] = idempotencyKey;
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers,
    body: JSON.stringify(payload)
  });
  const text = await r.text().catch(() => '');
  if (!r.ok) {
    throw new Error(`Resend failed (${r.status}): ${text.slice(0, 500)}`);
  }
  let data = {};
  try { data = text ? JSON.parse(text) : {}; } catch (_) {}
  return { sent: true, id:data.id || null, scheduledAt:scheduledAt || null };
}

async function cancelScheduled(emailId) {
  if (!configured() || !emailId) return { canceled:false, skipped:true };
  const r = await fetch(`https://api.resend.com/emails/${encodeURIComponent(emailId)}/cancel`, {
    method:'POST',
    headers:{
      Authorization:`Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type':'application/json'
    }
  });
  const text = await r.text().catch(() => '');
  if (!r.ok) throw new Error(`Resend cancel failed (${r.status}): ${text.slice(0,500)}`);
  return { canceled:true };
}

module.exports = { configured, send, cancelScheduled };
