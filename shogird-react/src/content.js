import { defaultContent } from './defaultContent.js';

const CACHE_KEY = 'shogirdlik:content:v1';
const TOKEN_KEY = 'shogirdlik:token';

// Bazadan kelgan kontentni standart kontent bilan birlashtiradi (yetishmayotgan maydonlar standartdan olinadi).
export function mergeDefaults(def, val) {
  if (Array.isArray(def)) return Array.isArray(val) ? val : def;
  if (def && typeof def === 'object') {
    const src = val && typeof val === 'object' && !Array.isArray(val) ? val : {};
    const out = {};
    for (const k of Object.keys(def)) out[k] = mergeDefaults(def[k], src[k]);
    return out;
  }
  return typeof val === typeof def ? val : def;
}

export function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? mergeDefaults(defaultContent, JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

export function writeCache(content) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(content));
  } catch {
    /* ignore */
  }
}

export async function fetchContent() {
  const res = await fetch('/api/content', { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error('content_unavailable');
  const data = await res.json();
  const merged = mergeDefaults(defaultContent, data.content);
  return { content: merged, stored: Boolean(data.content), storeReady: data.store !== false };
}

export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY) || '';
  } catch {
    return '';
  }
};
export const setToken = (t) => {
  try {
    if (t) localStorage.setItem(TOKEN_KEY, t);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
};

export async function login(password) {
  const res = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Kirib bo'lmadi");
  setToken(data.token);
  return data.token;
}

export async function saveContent(content) {
  const res = await fetch('/api/content', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify({ content }),
  });
  const data = await res.json().catch(() => ({}));
  if (res.status === 401) {
    setToken('');
    const e = new Error('Sessiya tugadi, qaytadan kiring');
    e.code = 401;
    throw e;
  }
  if (!res.ok) throw new Error(data.error || "Saqlab bo'lmadi");
  writeCache(content);
  return true;
}
