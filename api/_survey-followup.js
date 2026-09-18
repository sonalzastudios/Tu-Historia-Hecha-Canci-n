const db = require('./_supabase');
const email = require('./_email');

function eq(value) {
  return encodeURIComponent(String(value));
}

function esc(value = '') {
  return String(value ?? '').replace(/[&<>"']/g, c => ({
    '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
  }[c]));
}

function surveyEmail({ order, surveyUrl }) {
  const isEs = order?.language === 'es';
  const subject = isEs
    ? '¿Nos regalas menos de 60 segundos? · SONALZA'
    : 'Can you give us less than 60 seconds? · SONALZA';

  const html = `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f5f7fa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#0b1f3a;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f5f7fa;">
      <tr>
        <td align="center" style="padding:40px 16px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:620px;background:#fff;border-radius:24px;overflow:hidden;box-shadow:0 18px 50px rgba(11,31,58,.08);">
            <tr>
              <td style="padding:36px 40px;text-align:center;">
                <div style="font-size:24px;font-weight:800;letter-spacing:.12em;color:#0b1f3a;">SONALZA</div>
                <div style="margin-top:6px;font-size:10px;letter-spacing:.28em;color:#7b8797;">STUDIOS</div>
                <div style="margin:26px auto 12px;display:inline-block;padding:8px 12px;border-radius:999px;background:#fff6ed;color:#a85311;font-size:11px;font-weight:700;letter-spacing:.08em;">${isEs ? 'TU OPINIÓN IMPORTA' : 'YOUR FEEDBACK MATTERS'}</div>
                <h1 style="margin:10px 0 12px;font-size:32px;line-height:1.12;letter-spacing:-.035em;color:#0b1f3a;">${isEs ? '¿Cómo fue tu experiencia?' : 'How was your experience?'}</h1>
                <p style="margin:0 auto;max-width:500px;font-size:16px;line-height:1.65;color:#59687b;">
                  ${isEs
                    ? 'Gracias por elegir SONALZA. Si ya disfrutaste tu canción, nos ayudaría muchísimo conocer tu opinión. Son solo 4 preguntas y toma menos de 60 segundos.'
                    : 'Thank you for choosing SONALZA. If you have already enjoyed your song, we would really value your feedback. It is only 4 questions and takes less than 60 seconds.'}
                </p>
                <a href="${esc(surveyUrl)}" style="display:inline-block;margin-top:26px;background:#0b1f3a;color:#fff;text-decoration:none;padding:16px 28px;border-radius:999px;font-size:15px;font-weight:700;">
                  ${isEs ? 'Responder encuesta' : 'Answer survey'}
                </a>
                <p style="margin:22px auto 0;max-width:500px;font-size:13px;line-height:1.6;color:#7b8797;">
                  ${isEs
                    ? 'Si ya nos compartiste tu opinión, muchas gracias; no necesitas hacer nada más.'
                    : 'If you already shared your feedback with us, thank you; there is nothing else you need to do.'}
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return { subject, html };
}

async function latestEvent(orderId, eventType) {
  return db.selectOne(
    'order_events',
    `order_id=eq.${eq(orderId)}&event_type=eq.${encodeURIComponent(eventType)}&select=metadata,created_at&order=created_at.desc&limit=1`
  );
}

async function surveyCompleted(orderId) {
  return Boolean(await latestEvent(orderId, 'customer_survey_completed'));
}

async function cancelPending(orderId, reason = 'not_needed') {
  if (!email.configured()) return { canceled:false, skipped:true, reason:'email_not_configured' };

  const scheduled = await latestEvent(orderId, 'survey_followup_scheduled');
  if (!scheduled?.metadata?.email_id) return { canceled:false, skipped:true, reason:'no_scheduled_email' };

  const emailId = String(scheduled.metadata.email_id);
  const canceled = await latestEvent(orderId, 'survey_followup_canceled');
  if (String(canceled?.metadata?.email_id || '') === emailId) {
    return { canceled:false, skipped:true, reason:'already_canceled' };
  }

  const scheduledAt = scheduled.metadata.scheduled_at ? new Date(scheduled.metadata.scheduled_at).getTime() : 0;
  if (scheduledAt && scheduledAt <= Date.now()) {
    return { canceled:false, skipped:true, reason:'already_due_or_sent' };
  }

  try {
    await email.cancelScheduled(emailId);
    await db.insertEvent(orderId, 'survey_followup_canceled', {
      email_id:emailId,
      reason,
      canceled_at:new Date().toISOString()
    }, 'sonalza-system');
    return { canceled:true, emailId };
  } catch (err) {
    console.error('survey followup cancel', err);
    return { canceled:false, error:String(err.message || err) };
  }
}

async function schedule({ order, deliveryUrl, reason = 'delivery' }) {
  if (!email.configured()) return { scheduled:false, skipped:true, reason:'email_not_configured' };
  if (!order?.order_id || !order?.customer_email || !deliveryUrl) {
    return { scheduled:false, skipped:true, reason:'missing_order_data' };
  }

  if (await surveyCompleted(order.order_id)) {
    return { scheduled:false, skipped:true, reason:'survey_already_completed' };
  }

  await cancelPending(order.order_id, 'replaced_by_new_delivery');

  const scheduledAt = new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString();
  const joiner = String(deliveryUrl).includes('?') ? '&' : '?';
  const surveyUrl = `${deliveryUrl}${joiner}survey=1`;
  const message = surveyEmail({ order, surveyUrl });

  const result = await email.send({
    to:order.customer_email,
    subject:message.subject,
    html:message.html,
    replyTo:process.env.SONALZA_REPLY_TO || undefined,
    scheduledAt,
    tags:[
      { name:'type', value:'survey_followup' },
      { name:'order_id', value:String(order.order_id).replace(/[^A-Za-z0-9_-]/g,'_').slice(0,256) }
    ],
    idempotencyKey:`survey-followup/${order.order_id}/${reason}/${scheduledAt}`
  });

  await db.insertEvent(order.order_id, 'survey_followup_scheduled', {
    email_id:result.id || '',
    scheduled_at:scheduledAt,
    survey_url:surveyUrl,
    reason
  }, 'sonalza-system');

  return { scheduled:true, emailId:result.id || null, scheduledAt };
}

module.exports = { schedule, cancelPending, surveyEmail };
