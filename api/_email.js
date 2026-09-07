function configured() {
  return Boolean(process.env.RESEND_API_KEY);
}

async function send({ to, subject, html, replyTo }) {
  if (!configured()) return { sent: false, skipped: true };
  const from = process.env.SONALZA_FROM_EMAIL || 'SONALZA Orders <orders@sonalza.com>';
  const recipients = Array.isArray(to) ? to : [to];
  const payload = { from, to: recipients, subject, html };
  if (replyTo) payload.reply_to = replyTo;
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  if (!r.ok) {
    const detail = await r.text().catch(() => '');
    throw new Error(`Resend failed (${r.status}): ${detail.slice(0, 500)}`);
  }
  return { sent: true };
}

module.exports = { configured, send };
