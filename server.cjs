const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { URL } = require('node:url');

const ROOT = __dirname;
const PORT = Number(process.env.PORT || 3000);
const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.gif': 'image/gif', '.ico': 'image/x-icon',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.mp4': 'video/mp4'
};
function json(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
  res.end(JSON.stringify(data));
}
async function payment(req, res) {
  const started = Date.now();
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }
  if (req.method !== 'POST') return json(res, 405, { result: false, message: 'Method not allowed' });

  const mode = String(process.env.BXB_MODE || 'production').toLowerCase();
  const test = ['test', 'dev', 'development'].includes(mode);
  const token = test ? process.env.BXB_TEST_TOKEN : process.env.BXB_PROD_TOKEN;
  if (!token) {
    console.error(`[payment] missing ${test ? 'BXB_TEST_TOKEN' : 'BXB_PROD_TOKEN'}`);
    return json(res, 500, { result: false, message: 'Payment token is not configured on the server' });
  }
  try {
    let raw = '';
    for await (const chunk of req) {
      raw += chunk.toString('utf8');
      if (raw.length > 20000) return json(res, 413, { result: false, message: 'Request too large' });
    }
    const body = raw ? JSON.parse(raw) : {};
    const amount = Number(body.amount);
    const invoiceNumber = String(body.invoiceNumber || '').trim().slice(0, 32);
    const currency = String(body.currency || 'USD').trim().toUpperCase();
    if (!invoiceNumber || !Number.isFinite(amount) || amount <= 0 || amount > 1000000 || !/^[A-Z]{3}$/.test(currency)) {
      return json(res, 400, { result: false, message: 'Invalid invoice number, amount, or currency' });
    }
    const apiBase = test ? 'https://pgate-dev.bxb.delivery' : 'https://pgate.bxb.delivery';
    const payload = {
      invoiceNumber, amount: amount.toFixed(2), currency, type_form: 1,
      description: 'Wiggle House order',
      email: String(body.email || 'customer@example.com').slice(0, 254),
      customer_id: String(body.email || `customer_${Date.now()}`).slice(0, 128)
    };
    const upstream = await fetch(`${apiBase}/api/v1/payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(payload), signal: AbortSignal.timeout(20000)
    });
    const text = await upstream.text();
    let data;
    try { data = JSON.parse(text); }
    catch { data = { result: false, message: `Payment provider returned non-JSON (HTTP ${upstream.status})` }; }
    console.log(`[payment] mode=${test ? 'test' : 'production'} provider_status=${upstream.status} elapsed_ms=${Date.now()-started}`);
    return json(res, upstream.status, data);
  } catch (err) {
    const timeout = err && (err.name === 'TimeoutError' || err.name === 'AbortError');
    console.error(`[payment] failed elapsed_ms=${Date.now()-started}: ${err && err.message ? err.message : 'unknown error'}`);
    return json(res, timeout ? 504 : 502, { result: false, message: timeout ? 'Payment provider timed out; please try again.' : 'Could not create payment. Please try again.' });
  }
}
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  if (url.pathname === '/api/payment') return payment(req, res);
  if (!['GET', 'HEAD'].includes(req.method)) return json(res, 405, { error: 'Method not allowed' });
  let pathname;
  try { pathname = decodeURIComponent(url.pathname); } catch { res.writeHead(400); return res.end('Bad request'); }
  if (pathname.includes('\0')) { res.writeHead(400); return res.end('Bad request'); }
  let target = path.resolve(ROOT, '.' + pathname);
  if (target !== ROOT && !target.startsWith(ROOT + path.sep)) { res.writeHead(403); return res.end('Forbidden'); }
  try {
    let stat = await fs.promises.stat(target);
    if (stat.isDirectory()) target = path.join(target, 'index.html');
    const content = await fs.promises.readFile(target);
    res.writeHead(200, {
      'Content-Type': MIME[path.extname(target).toLowerCase()] || 'application/octet-stream',
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': ['index.html', 'app.js'].includes(path.basename(target)) ? 'no-cache' : 'public, max-age=3600'
    });
    return res.end(req.method === 'HEAD' ? undefined : content);
  } catch {
    if (!path.extname(pathname) || pathname.endsWith('/')) {
      try {
        const content = await fs.promises.readFile(path.join(ROOT, 'index.html'));
        res.writeHead(200, { 'Content-Type': MIME['.html'], 'Cache-Control': 'no-cache' });
        return res.end(req.method === 'HEAD' ? undefined : content);
      } catch {}
    }
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('Not found');
  }
});
server.listen(PORT, '0.0.0.0', () => console.log(`Wiggle House listening on port ${PORT}`));
