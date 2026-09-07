function configured() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

function baseUrl() {
  return String(process.env.SUPABASE_URL || '').replace(/\/$/, '');
}

function headers(extra = {}) {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json',
    ...extra
  };
}

async function request(path, options = {}) {
  if (!configured()) throw new Error('Supabase is not configured.');
  const r = await fetch(`${baseUrl()}${path}`, {
    ...options,
    headers: headers(options.headers || {})
  });
  const text = await r.text();
  let data = null;
  if (text) {
    try { data = JSON.parse(text); } catch (_) { data = text; }
  }
  if (!r.ok) {
    const detail = typeof data === 'string' ? data : JSON.stringify(data || {});
    const err = new Error(`Supabase request failed (${r.status}): ${detail.slice(0, 700)}`);
    err.status = r.status;
    throw err;
  }
  return data;
}

function tablePath(table, query = '') {
  return `/rest/v1/${encodeURIComponent(table)}${query ? `?${query}` : ''}`;
}

async function insert(table, record, { returning = 'minimal' } = {}) {
  return request(tablePath(table), {
    method: 'POST',
    headers: { Prefer: returning === 'representation' ? 'return=representation' : 'return=minimal' },
    body: JSON.stringify(record)
  });
}

async function update(table, query, patch, { returning = 'minimal' } = {}) {
  return request(tablePath(table, query), {
    method: 'PATCH',
    headers: { Prefer: returning === 'representation' ? 'return=representation' : 'return=minimal' },
    body: JSON.stringify(patch)
  });
}

async function select(table, query) {
  return request(tablePath(table, query), {
    method: 'GET',
    headers: { Accept: 'application/json' }
  });
}

async function selectOne(table, query) {
  const rows = await select(table, query);
  return Array.isArray(rows) && rows.length ? rows[0] : null;
}

async function insertEvent(orderId, eventType, metadata = {}, actor = 'system') {
  if (!configured()) return false;
  await insert('order_events', {
    order_id: orderId,
    event_type: eventType,
    actor,
    metadata
  });
  return true;
}

module.exports = {
  configured,
  request,
  insert,
  update,
  select,
  selectOne,
  insertEvent
};
