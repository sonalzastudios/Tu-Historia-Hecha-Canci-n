function esc(value = '') {
  return String(value ?? '').replace(/[&<>"']/g, c => ({
    '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
  }[c]));
}

function deliveryEmail({ order, songTitle, deliveryUrl, downloadUrl = '', coverUrl = '' }) {
  const isEs = order?.language === 'es';
  const orderId = esc(order?.order_id || '');
  const title = esc(songTitle || (isEs ? 'Tu canción SONALZA' : 'Your SONALZA song'));
  const safeDeliveryUrl = esc(deliveryUrl || 'https://sonalza.com');
  const safeDownloadUrl = esc(downloadUrl || '');
  const safeCoverUrl = esc(coverUrl || '');

  const subject = isEs
    ? `Tu canción está lista · ${songTitle || order?.order_id || 'SONALZA'}`
    : `Your song is ready · ${songTitle || order?.order_id || 'SONALZA'}`;

  const intro = isEs
    ? 'Terminamos tu canción. Ya puedes escucharla de forma privada y descargar tu archivo desde tu página de entrega SONALZA.'
    : 'Your song is complete. You can now listen privately and download your file from your SONALZA delivery page.';

  const revisionCopy = isEs
    ? 'Tu pedido incluye 1 ronda consolidada de revisión. Si deseas solicitar cambios, escucha primero la canción completa y envía todos tus ajustes juntos desde tu página de entrega.'
    : 'Your order includes 1 consolidated revision round. If you would like changes, listen to the full song first and submit all requested adjustments together from your delivery page.';

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
                <div style="display:inline-block;padding:8px 12px;border-radius:999px;background:#fff6ed;color:#a85311;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;">${isEs ? 'ENTREGA LISTA' : 'DELIVERY READY'}</div>
                <h1 style="margin:22px 0 10px 0;font-size:34px;line-height:1.12;letter-spacing:-.035em;color:#0b1f3a;">${isEs ? 'Tu canción está lista.' : 'Your song is ready.'}</h1>
                <p style="margin:0 auto 8px auto;font-size:20px;line-height:1.35;font-weight:700;color:#0b1f3a;">${title}</p>
                <p style="margin:0 auto;max-width:510px;font-size:16px;line-height:1.65;color:#536274;">${esc(intro)}</p>
              </td>
            </tr>

            <tr>
              <td style="padding:24px 42px 8px 42px;text-align:center;">
                <a href="${safeDeliveryUrl}" style="display:inline-block;background:#0b1f3a;color:#ffffff;text-decoration:none;padding:16px 30px;border-radius:999px;font-size:15px;font-weight:700;letter-spacing:-.01em;">${isEs ? 'Escuchar mi canción' : 'Listen to my song'}</a>
              </td>
            </tr>

            ${safeDownloadUrl ? `<tr><td style="padding:10px 42px 6px 42px;text-align:center;"><a href="${safeDownloadUrl}" style="font-size:13px;color:#0b1f3a;text-decoration:none;font-weight:600;">${isEs ? 'Descargar MP3 ↓' : 'Download MP3 ↓'}</a></td></tr>` : ''}

            <tr>
              <td style="padding:28px 42px 8px 42px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f7f9fc;border:1px solid #e8edf3;border-radius:18px;">
                  <tr>
                    <td style="padding:22px 24px;">
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                        <tr>
                          <td style="font-size:12px;color:#7a8796;padding-bottom:8px;">${isEs ? 'Número de orden' : 'Order number'}</td>
                          <td align="right" style="font-size:12px;color:#7a8796;padding-bottom:8px;">${isEs ? 'Estado' : 'Status'}</td>
                        </tr>
                        <tr>
                          <td style="font-size:15px;font-weight:700;color:#0b1f3a;">${orderId}</td>
                          <td align="right" style="font-size:15px;font-weight:700;color:#0b1f3a;">${isEs ? 'Entregada' : 'Delivered'}</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:30px 42px 10px 42px;">
                <div style="border-top:1px solid #edf0f4;padding-top:24px;">
                  <div style="font-size:14px;font-weight:700;color:#0b1f3a;margin-bottom:8px;">${isEs ? 'Tu revisión incluida' : 'Your included revision'}</div>
                  <p style="margin:0;font-size:13px;line-height:1.65;color:#657184;">${esc(revisionCopy)}</p>
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:22px 42px 6px 42px;text-align:center;">
                <p style="margin:0;font-size:13px;line-height:1.65;color:#657184;">${esc(supportCopy)}</p>
              </td>
            </tr>

            <tr>
              <td style="padding:30px 42px 36px 42px;text-align:center;">
                <p style="margin:0 0 16px 0;font-size:12px;color:#8a95a5;">${isEs ? 'Sigue a SONALZA' : 'Follow SONALZA'}</p>
                <p style="margin:0 0 14px 0;font-size:13px;line-height:1.8;">
                  <a href="https://instagram.com/sonalzastudios" style="color:#0b1f3a;text-decoration:none;">Instagram</a>
                  <span style="color:#c4cad2;padding:0 8px;">·</span>
                  <a href="https://tiktok.com/@sonalzastudios" style="color:#0b1f3a;text-decoration:none;">TikTok</a>
                  <span style="color:#c4cad2;padding:0 8px;">·</span>
                  <a href="https://youtube.com/@sonalzastudios" style="color:#0b1f3a;text-decoration:none;">YouTube</a>
                </p>
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
