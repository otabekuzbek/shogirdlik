import crypto from 'node:crypto';

const KEY = 'shogirdlik-content';
const URL_ = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN_ = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

export const hasStore = () => Boolean(URL_ && TOKEN_);

export async function loadContent() {
  const r = await fetch(`${URL_}/get/${KEY}`, { headers: { Authorization: `Bearer ${TOKEN_}` } });
  if (!r.ok) throw new Error('store_read_failed');
  const j = await r.json();
  return j.result ? JSON.parse(j.result) : null;
}

export async function saveContent(obj) {
  const r = await fetch(`${URL_}/set/${KEY}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN_}` },
    body: JSON.stringify(obj),
  });
  if (!r.ok) throw new Error('store_write_failed');
}

// ---------- auth ----------
// Production'da ADMIN_PASSWORD majburiy. Lokal sinov uchun (production emas) standart parol: admin123
export const adminPassword = () =>
  process.env.ADMIN_PASSWORD || (process.env.VERCEL_ENV === 'production' ? '' : 'admin123');

const secret = () => process.env.ADMIN_SECRET || `s:${adminPassword()}`;
const sign = (payload) => crypto.createHmac('sha256', secret()).update(payload).digest('hex');

export function makeToken() {
  const exp = String(Date.now() + 1000 * 60 * 60 * 24 * 14); // 14 kun
  return `${exp}.${sign(exp)}`;
}

export function verifyToken(token) {
  if (!token || !adminPassword()) return false;
  const [exp, sig] = String(token).split('.');
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  const good = sign(exp);
  const a = Buffer.from(sig);
  const b = Buffer.from(good);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export function samePassword(input) {
  const real = adminPassword();
  if (!real) return false;
  const h = (s) => crypto.createHash('sha256').update(String(s)).digest();
  return crypto.timingSafeEqual(h(input), h(real));
}

export const bearer = (req) => {
  const h = req.headers?.authorization || '';
  return h.startsWith('Bearer ') ? h.slice(7) : '';
};
