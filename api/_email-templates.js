function esc(value = '') {
  return String(value ?? '').replace(/[&<>"']/g, c => ({
    '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
  }[c]));
}

function money(amount, currency) {
  return currency === 'MXN'
    ? `MX$${Number(amount).toLocaleString('es-MX')}`
    : `US$${Number(amount).toLocaleString('en-US')}`;
}

function productName(order, isEs) {
  return order.product === 'corrido'
    ? (isEs ? 'Corrido de una Vida' : 'A Life Corrido')
    : (isEs ? 'Canción Personalizada' : 'Custom Song');
}

function paymentConfirmation(order, reviewRequired = false) {
  const isEs = order.language === 'es';
  const orderId = esc(order.order_id || '');
  const total = esc(money(order.total, order.currency));
  const product = esc(productName(order, isEs));

  const subject = isEs
    ? `Tu canción SONALZA ya está en proceso · ${order.order_id}`
    : `Your SONALZA song is now in progress · ${order.order_id}`;

  const statusTitle = reviewRequired
    ? (isEs ? 'Pago confirmado · verificación en curso' : 'Payment confirmed · verification in progress')
    : (isEs ? 'Tu canción ya está en proceso' : 'Your song is now in progress');

  const intro = reviewRequired
    ? (isEs
      ? 'Recibimos correctamente tu pago. Antes de comenzar producción estamos verificando un detalle de región o facturación. No necesitas realizar otro pago.'
      : 'We received your payment successfully. Before production begins, we are verifying a region or billing detail. You do not need to pay again.')
    : (isEs
      ? 'Gracias por confiar tu historia a SONALZA. Tu pedido fue confirmado y ahora entra a nuestro proceso creativo.'
      : 'Thank you for trusting SONALZA with your story. Your order is confirmed and is now entering our creative process.');

  const step1 = reviewRequired
    ? (isEs ? 'Verificamos el detalle pendiente de la orden.' : 'We verify the pending order detail.')
    : (isEs ? 'Revisamos tu historia y la dirección musical.' : 'We review your story and musical direction.');

  const step2 = isEs
    ? 'Preparamos tu canción con la información que compartiste.'
    : 'We prepare your song using the details you shared.';

  const step3 = isEs
    ? 'Cuando esté lista, recibirás la entrega digital en este correo.'
    : 'When it is ready, your digital delivery will arrive at this email address.';

  const revision = isEs
    ? 'Tu pedido incluye 1 ronda consolidada de revisión. Cuando recibas la primera versión, podrás enviarnos todos tus ajustes juntos y con el mayor detalle posible.'
    : 'Your order includes 1 consolidated revision round. After receiving the first version, you can send all requested adjustments together and with as much detail as possible.';

  const html = `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f5f7fa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#0b1f3a;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f5f7fa;margin:0;padding:0;">
      <tr>
        <td align="center" style="padding:40px 16px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:640px;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 18px 50px rgba(11,31,58,.08);">
            <tr>
              <td style="padding:34px 42px 18px 42px;text-align:center;">
                <div style="font-size:24px;line-height:1;font-weight:800;letter-spacing:.12em;color:#0b1f3a;">SONALZA</div>
                <div style="margin-top:6px;font-size:10px;letter-spacing:.28em;color:#7b8797;">STUDIOS</div>
              </td>
            </tr>
            <tr>
              <td style="padding:22px 42px 10px 42px;text-align:center;">
                <div style="display:inline-block;padding:8px 12px;border-radius:999px;background:#fff6ed;color:#a85311;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;">${isEs ? 'ORDEN CONFIRMADA' : 'ORDER CONFIRMED'}</div>
                <h1 style="margin:22px 0 12px 0;font-size:32px;line-height:1.15;letter-spacing:-.03em;color:#0b1f3a;">${esc(statusTitle)}</h1>
                <p style="margin:0 auto;max-width:500px;font-size:16px;line-height:1.65;color:#536274;">${esc(intro)}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 42px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f7f9fc;border:1px solid #e8edf3;border-radius:18px;">
                  <tr>
                    <td style="padding:22px 24px;">
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                        <tr>
                          <td style="font-size:12px;color:#7a8796;padding-bottom:8px;">${isEs ? 'Número de orden' : 'Order number'}</td>
                          <td align="right" style="font-size:12px;color:#7a8796;padding-bottom:8px;">${isEs ? 'Total' : 'Total'}</td>
                        </tr>
                        <tr>
                          <td style="font-size:16px;font-weight:700;color:#0b1f3a;">${orderId}</td>
                          <td align="right" style="font-size:16px;font-weight:700;color:#0b1f3a;">${total}</td>
                        </tr>
                        <tr>
                          <td colspan="2" style="padding-top:18px;border-top:1px solid #e5eaf0;margin-top:18px;"></td>
                        </tr>
                        <tr>
                          <td style="font-size:12px;color:#7a8796;">${isEs ? 'Producto' : 'Product'}</td>
                          <td align="right" style="font-size:14px;font-weight:600;color:#0b1f3a;">${product}</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:10px 42px 8px 42px;">
                <h2 style="margin:0 0 18px 0;font-size:20px;letter-spacing:-.02em;color:#0b1f3a;">${isEs ? 'Qué sigue' : 'What happens next'}</h2>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td valign="top" width="34" style="padding:0 0 18px 0;"><div style="width:26px;height:26px;border-radius:50%;background:#0b1f3a;color:#fff;text-align:center;line-height:26px;font-size:12px;font-weight:700;">1</div></td>
                    <td style="padding:2px 0 18px 10px;font-size:15px;line-height:1.55;color:#425268;">${esc(step1)}</td>
                  </tr>
                  <tr>
                    <td valign="top" width="34" style="padding:0 0 18px 0;"><div style="width:26px;height:26px;border-radius:50%;background:#0b1f3a;color:#fff;text-align:center;line-height:26px;font-size:12px;font-weight:700;">2</div></td>
                    <td style="padding:2px 0 18px 10px;font-size:15px;line-height:1.55;color:#425268;">${esc(step2)}</td>
                  </tr>
                  <tr>
                    <td valign="top" width="34"><div style="width:26px;height:26px;border-radius:50%;background:#0b1f3a;color:#fff;text-align:center;line-height:26px;font-size:12px;font-weight:700;">3</div></td>
                    <td style="padding:2px 0 0 10px;font-size:15px;line-height:1.55;color:#425268;">${esc(step3)}</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 42px 10px 42px;">
                <div style="border-top:1px solid #edf0f4;padding-top:24px;">
                  <div style="font-size:13px;font-weight:700;color:#0b1f3a;margin-bottom:8px;">${isEs ? 'Tu revisión incluida' : 'Your included revision'}</div>
                  <p style="margin:0;font-size:13px;line-height:1.65;color:#657184;">${esc(revision)}</p>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:32px 42px 36px 42px;text-align:center;">
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

module.exports = { paymentConfirmation };
