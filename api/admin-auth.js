const adminAuth = require('./_admin-auth');

function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body); } catch (_) { return {}; }
  }
  return {};
}

module.exports = function handler(req, res) {
  if (!adminAuth.configured()) {
    return res.status(503).json({ ok:false, error:'Admin access is not configured.' });
  }

  if (req.method === 'GET') {
    return res.status(200).json({ ok:true, authenticated:adminAuth.isAuthenticated(req) });
  }

  if (req.method === 'POST') {
    const body = readBody(req);
    const action = String(body.action || 'login').toLowerCase();

    if (action === 'logout') {
      res.setHeader('Set-Cookie', adminAuth.clearSessionCookie());
      return res.status(200).json({ ok:true, authenticated:false });
    }

    const key = String(body.key || '');
    if (!adminAuth.validAdminKey(key)) {
      return res.status(401).json({ ok:false, error:'Invalid admin key.' });
    }

    const token = adminAuth.createSessionToken();
    res.setHeader('Set-Cookie', adminAuth.sessionCookie(token));
    return res.status(200).json({ ok:true, authenticated:true });
  }

  return res.status(405).json({ ok:false, error:'Method Not Allowed' });
};
