import { adminPassword, makeToken, samePassword } from './_lib.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!adminPassword()) {
    return res
      .status(500)
      .json({ error: "ADMIN_PASSWORD o'rnatilmagan. Vercel → Settings → Environment Variables bo'limida qo'shing." });
  }
  const password = req.body?.password ?? '';
  if (!samePassword(password)) {
    await new Promise((r) => setTimeout(r, 600)); // brute-force sekinlashtirish
    return res.status(401).json({ error: "Parol noto'g'ri" });
  }
  return res.status(200).json({ token: makeToken() });
}
