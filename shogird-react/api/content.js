import { bearer, hasStore, loadContent, saveContent, verifyToken } from './_lib.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    if (!hasStore()) {
      res.setHeader('Cache-Control', 'no-store');
      return res.status(200).json({ content: null, store: false });
    }
    try {
      const content = await loadContent();
      res.setHeader('Cache-Control', 'public, s-maxage=5, stale-while-revalidate=30');
      return res.status(200).json({ content, store: true });
    } catch {
      res.setHeader('Cache-Control', 'no-store');
      return res.status(200).json({ content: null, store: true });
    }
  }

  if (req.method === 'PUT') {
    if (!verifyToken(bearer(req))) return res.status(401).json({ error: 'Ruxsat yo\'q' });
    if (!hasStore()) {
      return res.status(503).json({
        error:
          "Ma'lumotlar bazasi ulanmagan. Vercel → Storage bo'limidan Upstash Redis ulang (README'ga qarang).",
      });
    }
    const content = req.body?.content;
    if (!content || typeof content !== 'object' || Array.isArray(content)) {
      return res.status(400).json({ error: "Noto'g'ri ma'lumot" });
    }
    if (JSON.stringify(content).length > 200_000) {
      return res.status(413).json({ error: 'Kontent juda katta' });
    }
    try {
      await saveContent(content);
      return res.status(200).json({ ok: true });
    } catch {
      return res.status(502).json({ error: "Bazaga yozib bo'lmadi, qayta urinib ko'ring" });
    }
  }

  res.setHeader('Allow', 'GET, PUT');
  return res.status(405).json({ error: 'Method not allowed' });
}
