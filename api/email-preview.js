const emailTemplates = require('./_email-templates');

module.exports = function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).send('Method Not Allowed');

  const lang = String(req.query?.lang || 'es').toLowerCase() === 'en' ? 'en' : 'es';
  const reviewRequired = String(req.query?.review || '') === '1';

  const mockOrder = {
    order_id: 'SON-7K4P9M',
    language: lang,
    product: 'song',
    total: 49,
    currency: 'USD'
  };

  const preview = emailTemplates.paymentConfirmation(mockOrder, reviewRequired);
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).send(preview.html);
};
