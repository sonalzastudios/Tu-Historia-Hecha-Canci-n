function esc(value = '') {
  return String(value ?? '').replace(/[&<>"']/g, c => ({
    '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
  }[c]));
}

function deliveryEmail({ order, songTitle, deliveryUrl, downloadUrl = '', coverUrl = '', isRevision = false, adminNote = '' }) {
  const isEs = order?.language === 'es';
  const orderId = esc(order?.order_id || '');
  const title = esc(songTitle || (isEs ? 'Tu canción SONALZA' : 'Your SONALZA song'));
  const safeDeliveryUrl = esc(deliveryUrl || 'https://sonalza.com');
  const safeDownloadUrl = esc(downloadUrl || '');
  const safeCoverUrl = esc(coverUrl || '');
  const note = String(adminNote || '').trim();

  const subject = isRevision
    ? (isEs
      ? `Tu canción corregida está lista · ${songTitle || order?.order_id || 'SONALZA'}`
      : `Your corrected song is ready · ${songTitle || order?.order_id || 'SONALZA'}`)
    : (isEs
      ? `Tu canción está lista · ${songTitle || order?.order_id || 'SONALZA'}`
      : `Your song is ready · ${songTitle || order?.order_id || 'SONALZA'}`);

  const intro = isRevision
    ? (isEs
      ? 'Hemos aplicado los ajustes solicitados a tu canción. Ya puedes escuchar y descargar la versión corregida desde tu página privada de SONALZA.'
      : 'We have applied the requested changes to your song. You can now listen to and download the corrected version from your private SONALZA delivery page.')
    : (isEs
      ? 'Terminamos tu canción. Ya puedes escucharla de forma privada y descargar tu archivo desde tu página de entrega SONALZA.'
      : 'Your song is complete. You can now listen privately and download your file from your SONALZA delivery page.');

  const revisionCopy = isRevision
    ? (isEs
      ? 'Esta entrega corresponde a la revisión incluida en tu pedido. La ronda de revisión incluida ya fue utilizada. Si necesitas cambios adicionales, contáctanos para conocer las opciones disponibles y el costo de una revisión adicional.'
      : 'This delivery corresponds to the revision included with your order. Your included revision round has now been used. If you need additional changes, contact us to learn about available options and the cost of an additional revision.')
    : (isEs
      ? 'Tu pedido incluye 1 ronda consolidada de revisión. Si deseas solicitar cambios, escucha primero la canción completa y envía todos tus ajustes juntos desde tu página de entrega.'
      : 'Your order includes 1 consolidated revision round. If you would like changes, listen to the full song first and submit all requested adjustments together from your delivery page.');

  const supportCopy = isEs
    ? '¿Necesitas ayuda con esta orden? Puedes responder directamente a este correo.'
    : 'Need help with this order? You can reply directly to this email.';

  const html = `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f5f7fa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#0b1f3a;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f5f7fa;margin:0;padding:0;">
      <tr>
        <td align="center" style="padding:40px 16px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:640px;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 18px 50px rgba(11,31,58,.08);">
            <tr>
              <td style="padding:34px 42px 16px 42px;text-align:center;">
                <div style="font-size:24px;line-height:1;font-weight:800;letter-spacing:.12em;color:#0b1f3a;">SONALZA</div>
                <div style="margin-top:6px;font-size:10px;letter-spacing:.28em;color:#7b8797;">STUDIOS</div>
              </td>
            </tr>

            ${safeCoverUrl ? `<tr><td style="padding:12px 42px 8px 42px;text-align:center;"><img src="${safeCoverUrl}" alt="${title}" width="320" style="display:block;width:100%;max-width:320px;height:auto;margin:0 auto;border-radius:22px;"></td></tr>` : ''}

            <tr>
              <td style="padding:22px 42px 14px 42px;text-align:center;">
                <div style="display:inline-block;padding:8px 12px;border-radius:999px;background:#fff6ed;color:#a85311;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;">${isRevision ? (isEs ? 'CORRECCIÓN LISTA' : 'REVISION READY') : (isEs ? 'ENTREGA LISTA' : 'DELIVERY READY')}</div>
                <h1 style="margin:22px 0 10px 0;font-size:34px;line-height:1.12;letter-spacing:-.035em;color:#0b1f3a;">${isRevision ? (isEs ? 'Tu versión corregida está lista.' : 'Your corrected version is ready.') : (isEs ? 'Tu canción está lista.' : 'Your song is ready.')}</h1>
                <p style="margin:0 auto 8px auto;font-size:20px;line-height:1.35;font-weight:700;color:#0b1f3a;">${title}</p>
                <p style="margin:0 auto;max-width:510px;font-size:16px;line-height:1.65;color:#536274;">${esc(intro)}</p>
              </td>
            </tr>

            ${note ? `<tr><td style="padding:10px 42px 6px 42px;"><div style="padding:18px 20px;border-radius:16px;background:#fff8ef;border:1px solid #f1dcc1;"><div style="font-size:12px;font-weight:700;color:#a85311;margin-bottom:7px;">${isEs ? 'NOTA DE SONALZA' : 'NOTE FROM SONALZA'}</div><div style="font-size:14px;line-height:1.65;color:#536274;white-space:pre-wrap;">${esc(note)}</div></div></td></tr>` : ''}

            <tr>
              <td style="padding:24px 42px 8px 42px;text-align:center;">
                <a href="${safeDeliveryUrl}" style="display:inline-block;background:#0b1f3a;color:#ffffff;text-decoration:none;padding:16px 30px;border-radius:999px;font-size:15px;font-weight:700;letter-spacing:-.01em;">${isRevision ? (isEs ? 'Escuchar versión corregida' : 'Listen to corrected version') : (isEs ? 'Escuchar mi canción' : 'Listen to my song')}</a>
              </td>
            </tr>

            ${safeDownloadUrl ? `<tr><td style="padding:10px 42px 6px 42px;text-align:center;"><a href="${safeDownloadUrl}" style="font-size:13px;color:#0b1f3a;text-decoration:none;font-weight:600;">${isEs ? 'Descargar MP3 ↓' : 'Download MP3 ↓'}</a></td></tr>` : ''}

            <tr>
              <td style="padding:28px 42px 8px 42px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f7f9fc;border:1px solid #e8edf3;border-radius:18px;">
                  <tr><td style="padding:22px 24px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="font-size:12px;color:#7a8796;padding-bottom:8px;">${isEs ? 'Número de orden' : 'Order number'}</td>
                        <td align="right" style="font-size:12px;color:#7a8796;padding-bottom:8px;">${isEs ? 'Estado' : 'Status'}</td>
                      </tr>
                      <tr>
                        <td style="font-size:15px;font-weight:700;color:#0b1f3a;">${orderId}</td>
                        <td align="right" style="font-size:15px;font-weight:700;color:#0b1f3a;">${isRevision ? (isEs ? 'Corrección entregada' : 'Revision delivered') : (isEs ? 'Entregada' : 'Delivered')}</td>
                      </tr>
                    </table>
                  </td></tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:30px 42px 10px 42px;">
                <div style="border-top:1px solid #edf0f4;padding-top:24px;">
                  <div style="font-size:14px;font-weight:700;color:#0b1f3a;margin-bottom:8px;">${isRevision ? (isEs ? 'Revisión incluida utilizada' : 'Included revision used') : (isEs ? 'Tu revisión incluida' : 'Your included revision')}</div>
                  <p style="margin:0;font-size:13px;line-height:1.65;color:#657184;">${esc(revisionCopy)}</p>
                </div>
              </td>
            </tr>

            <tr><td style="padding:22px 42px 6px 42px;text-align:center;"><p style="margin:0;font-size:13px;line-height:1.65;color:#657184;">${esc(supportCopy)}</p></td></tr>
            <tr>
              <td style="padding:30px 42px 36px 42px;text-align:center;">
                <a href="https://sonalza.com" style="font-size:12px;color:#7b8797;text-decoration:none;">sonalza.com</a>
                <p style="margin:18px 0 0 0;font-size:11px;line-height:1.6;color:#a0a8b4;">© SONALZA STUDIOS</p>
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

module.exports = { deliveryEmail };
