# Online Shogirdlik — sayt + admin panel

React (Vite) landing sahifa, `/admin` orqali boshqariladigan kontent va Vercel'ga tayyor serverless API.

- **Sayt:** `https://sizning-sayt.vercel.app/`
- **Admin panel:** `https://sizning-sayt.vercel.app/admin`

## Vercel'ga qo'yish (5 qadam)

1. **Kodni GitHub'ga yuklang** (yangi repository yarating, shu papkadagi fayllarni push qiling).
2. **vercel.com → Add New → Project** → repository'ni tanlang → **Deploy**.
   (Framework avtomatik "Vite" deb aniqlanadi, hech narsa o'zgartirish shart emas.)
3. **Parol o'rnating:** Project → **Settings → Environment Variables** →
   `ADMIN_PASSWORD` = o'zingiz o'ylab topgan parol (Production'ni belgilang).
4. **Baza ulang** (o'zgarishlar saqlanishi uchun): Project → **Storage → Create / Connect Database → Upstash Redis (Marketplace)** → loyihaga ulang.
   Vercel `KV_REST_API_URL` va `KV_REST_API_TOKEN` o'zgaruvchilarini avtomatik qo'shadi. Bepul tarif yetarli.
5. **Qayta deploy qiling:** Deployments → oxirgi deploy yonidagi **⋯ → Redeploy**
   (env o'zgaruvchilari faqat yangi deploy'dan keyin ishlaydi).

Tayyor: `/admin` ga kirib parolni yozing.

## Admin panelda nima qilish mumkin

- Barcha matnlar, narxlar, tugma havolasi (to'lov boti linki), FAQ, ro'yxatlar — hammasini tahrirlash
- Ro'yxatlarda qator/kartalarni qo'shish, o'chirish, yuqoriga-pastga surish
- Trener rasmini qo'shish (rasm havolasini kiritish)
- **Ctrl+S** (Mac: ⌘+S) — saqlash
- Zaxira nusxa: **JSON yuklab olish** / qayta yuklash
- **Dastlabki holatga** qaytarish
- Matn ichida `**shunday**` yozsangiz — qalin ko'rinadi

Saqlagandan keyin sayt bir necha soniyada yangilanadi.

## Lokal ishga tushirish

```bash
npm install
npm run dev          # faqat sayt (admin saqlash ishlamaydi, chunki API yo'q)
```

API bilan to'liq sinash uchun:

```bash
npm i -g vercel
vercel dev           # sayt + /api + /admin
```

Lokal sinovda (production emas) admin paroli standart: `admin123`.
**Production'da albatta `ADMIN_PASSWORD` o'rnating** — o'rnatilmasa kirish ishlamaydi.

## Loyiha tuzilmasi

```
api/login.js        — parol tekshirish, token berish
api/content.js      — kontentni o'qish (GET) / saqlash (PUT, faqat admin)
api/_lib.js         — Upstash Redis va token yordamchilari
src/defaultContent.js — standart matnlar (baza bo'sh bo'lsa shu ko'rinadi)
src/Landing.jsx     — sayt
src/Admin.jsx       — admin panel
src/styles.css      — sayt dizayni (ranglar :root ichida)
```

Rangni o'zgartirish: `src/styles.css` boshidagi `--gold` va `--gold-grad` qiymatlari.
