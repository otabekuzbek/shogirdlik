import { useEffect, useMemo, useState } from 'react';
import { defaultContent } from './defaultContent.js';
import { fetchContent, getToken, login, saveContent, setToken, writeCache } from './content.js';

/* ------------------------------------------------------------------
   Admin panel sxemasi: har bir bo'lim — maydonlar ro'yxati.
   type: text | textarea | list (matnlar ro'yxati) | objects (obyektlar ro'yxati)
------------------------------------------------------------------- */
const SECTIONS = [
  {
    id: 'main',
    label: 'Asosiy',
    hint: "Sahifaning tepa qismi, narx va tugma havolasi",
    fields: [
      { path: 'ctaLink', label: "Tugma havolasi (to'lov boti linki)", type: 'text', hint: 'Barcha "Qo\'shilish" tugmalari shu manzilga olib boradi' },
      { path: 'badge', label: 'Yuqoridagi belgi', type: 'text' },
      { path: 'hero.line1', label: 'Bosh sarlavha — 1-qator', type: 'textarea' },
      { path: 'hero.line2', label: 'Bosh sarlavha — 2-qator (ajratib ko\'rsatiladi)', type: 'text' },
      { path: 'hero.sub', label: 'Kichik matn', type: 'textarea', hint: '**qalin** — ikkita yulduzcha orasidagi matn qalin bo\'ladi' },
      { path: 'hero.cta', label: 'Asosiy tugma matni', type: 'text' },
      { path: 'hero.payNote', label: "To'lov turlari izohi", type: 'text' },
      { path: 'trainer', label: 'Trener nomi', type: 'text' },
      { path: 'trainerPhoto', label: 'Trener rasmi (havola, ixtiyoriy)', type: 'text', hint: "Rasm linkini qo'ying (https://...). Bo'sh qoldirsangiz bosh harflar chiqadi" },
      { path: 'stickyCta', label: "Yopishqoq panel tugmasi matni", type: 'text' },
    ],
  },
  {
    id: 'price',
    label: 'Narx',
    hint: "Tepadagi narx kartasi",
    fields: [
      { path: 'price.discount', label: 'Chegirma belgisi', type: 'text' },
      { path: 'price.old', label: 'Eski narx', type: 'text' },
      { path: 'price.now', label: 'Yangi narx', type: 'text' },
      { path: 'price.period', label: 'Davr izohi', type: 'text' },
    ],
  },
  {
    id: 'pain',
    label: 'Muammolar',
    fields: [
      { path: 'pain.title', label: 'Sarlavha', type: 'text' },
      { path: 'pain.items', label: "Ro'yxat", type: 'list' },
    ],
  },
  {
    id: 'survey',
    label: "So'rovnoma",
    fields: [
      { path: 'survey.title', label: 'Sarlavha', type: 'text' },
      { path: 'survey.intro', label: 'Kirish matni', type: 'textarea' },
      {
        path: 'survey.items',
        label: 'Natijalar (birinchisi eng kattasi bo\'lib ko\'rinadi)',
        type: 'objects',
        itemLabel: 'label',
        sub: [
          { key: 'percent', label: 'Foiz (faqat raqam)', type: 'number' },
          { key: 'label', label: 'Javob matni', type: 'text' },
        ],
      },
      { path: 'survey.outro', label: 'Xulosa matni', type: 'textarea', hint: "Yangi qator uchun Enter bosing" },
    ],
  },
  {
    id: 'features',
    label: 'Kanal ichida',
    fields: [
      { path: 'features.title', label: 'Sarlavha', type: 'text' },
      {
        path: 'features.items',
        label: 'Kartalar',
        type: 'objects',
        itemLabel: 'title',
        sub: [
          { key: 'icon', label: 'Emoji', type: 'text' },
          { key: 'title', label: 'Sarlavha', type: 'text' },
          { key: 'text', label: 'Matn', type: 'textarea' },
        ],
      },
    ],
  },
  {
    id: 'audience',
    label: 'Kimlar uchun',
    fields: [
      { path: 'audience.title', label: 'Sarlavha', type: 'text' },
      {
        path: 'audience.items',
        label: 'Guruhlar',
        type: 'objects',
        itemLabel: 'title',
        sub: [
          { key: 'icon', label: 'Emoji', type: 'text' },
          { key: 'title', label: 'Sarlavha', type: 'text' },
          { key: 'text', label: 'Matn', type: 'textarea' },
        ],
      },
    ],
  },
  {
    id: 'pricing',
    label: 'Tarif',
    hint: 'Nima olasiz va qancha turadi',
    fields: [
      { path: 'pricing.title', label: 'Sarlavha', type: 'text' },
      {
        path: 'pricing.lines',
        label: 'Narx qatorlari',
        type: 'objects',
        itemLabel: 'label',
        sub: [
          { key: 'label', label: 'Nomi', type: 'text' },
          { key: 'value', label: 'Narxi', type: 'text' },
        ],
      },
      { path: 'pricing.totalLabel', label: 'Jami yozuvi', type: 'text' },
      { path: 'pricing.totalValue', label: 'Jami narx (chizilgan)', type: 'text' },
      { path: 'pricing.firstLabel', label: 'Birinchi oy yozuvi', type: 'text' },
      { path: 'pricing.firstValue', label: 'Birinchi oy narxi', type: 'text' },
      { path: 'pricing.foot', label: 'Izoh', type: 'textarea' },
      { path: 'pricing.cta', label: 'Tugma matni', type: 'text' },
      { path: 'pricing.note', label: 'Tugma ostidagi matn', type: 'textarea' },
    ],
  },
  {
    id: 'cost',
    label: 'Oddiy hisob',
    fields: [
      { path: 'cost.title', label: 'Sarlavha', type: 'text' },
      { path: 'cost.lead', label: 'Kirish', type: 'text' },
      { path: 'cost.items', label: "Ro'yxat", type: 'list' },
      { path: 'cost.quote', label: 'Asosiy gap', type: 'textarea' },
      { path: 'cost.cta', label: 'Tugma matni', type: 'text' },
    ],
  },
  {
    id: 'faq',
    label: 'Savol-javob',
    fields: [
      { path: 'faq.title', label: 'Sarlavha', type: 'text' },
      {
        path: 'faq.items',
        label: 'Savollar',
        type: 'objects',
        itemLabel: 'q',
        sub: [
          { key: 'q', label: 'Savol', type: 'text' },
          { key: 'a', label: 'Javob', type: 'textarea' },
        ],
      },
    ],
  },
  {
    id: 'final',
    label: 'Oxirgi qism',
    fields: [
      { path: 'final.title', label: 'Sarlavha', type: 'text' },
      { path: 'final.pathA', label: "1-yo'l (rad etiladigan)", type: 'text' },
      { path: 'final.pathB', label: "2-yo'l (tanlanadigan)", type: 'text' },
      { path: 'final.cta', label: 'Tugma matni', type: 'text' },
      { path: 'final.note', label: 'Tugma ostidagi matn', type: 'text' },
      { path: 'footer.brand', label: 'Pastki qism — nom', type: 'text' },
      { path: 'footer.disclaimer', label: 'Pastki qism — ogohlantirish', type: 'textarea' },
      { path: 'brand', label: 'Brauzer sarlavhasi (tab nomi)', type: 'text' },
    ],
  },
];

/* ---------- yordamchilar ---------- */
const getIn = (obj, path) => path.split('.').reduce((o, k) => (o == null ? o : o[k]), obj);
const setIn = (obj, path, value) => {
  const keys = path.split('.');
  const rec = (o, i) => {
    const k = keys[i];
    const base = Array.isArray(o) ? [...o] : { ...(o || {}) };
    base[k] = i === keys.length - 1 ? value : rec(o?.[k], i + 1);
    return base;
  };
  return rec(obj, 0);
};
const move = (arr, from, to) => {
  if (to < 0 || to >= arr.length) return arr;
  const a = [...arr];
  const [x] = a.splice(from, 1);
  a.splice(to, 0, x);
  return a;
};

/* ---------- maydon komponentlari ---------- */
function TextInput({ value, onChange, type = 'text', multiline, placeholder }) {
  if (multiline) {
    return (
      <textarea
        className="a-input a-area"
        rows={Math.min(8, Math.max(3, String(value ?? '').split('\n').length + Math.floor(String(value ?? '').length / 70)))}
        value={value ?? ''}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }
  return (
    <input
      className="a-input"
      type={type === 'number' ? 'number' : 'text'}
      value={value ?? ''}
      placeholder={placeholder}
      onChange={(e) => onChange(type === 'number' ? (e.target.value === '' ? '' : Number(e.target.value)) : e.target.value)}
    />
  );
}

function RowTools({ i, len, onMove, onRemove }) {
  return (
    <div className="a-row-tools">
      <button type="button" className="a-ico" title="Yuqoriga" disabled={i === 0} onClick={() => onMove(i, i - 1)}>↑</button>
      <button type="button" className="a-ico" title="Pastga" disabled={i === len - 1} onClick={() => onMove(i, i + 1)}>↓</button>
      <button
        type="button"
        className="a-ico danger"
        title="O'chirish"
        onClick={() => {
          if (window.confirm("Bu qatorni o'chirasizmi?")) onRemove(i);
        }}
      >
        ✕
      </button>
    </div>
  );
}

function ListField({ value, onChange }) {
  const list = Array.isArray(value) ? value : [];
  return (
    <div className="a-list">
      {list.map((v, i) => (
        <div className="a-list-row" key={i}>
          <span className="a-idx">{i + 1}</span>
          <TextInput multiline value={v} onChange={(nv) => onChange(list.map((x, j) => (j === i ? nv : x)))} />
          <RowTools i={i} len={list.length} onMove={(f, t) => onChange(move(list, f, t))} onRemove={(k) => onChange(list.filter((_, j) => j !== k))} />
        </div>
      ))}
      <button type="button" className="a-btn ghost" onClick={() => onChange([...list, ''])}>+ Qator qo'shish</button>
    </div>
  );
}

function ObjectsField({ field, value, onChange }) {
  const list = Array.isArray(value) ? value : [];
  const blank = () => Object.fromEntries(field.sub.map((s) => [s.key, s.type === 'number' ? 0 : '']));
  return (
    <div className="a-objs">
      {list.map((item, i) => (
        <div className="a-obj" key={i}>
          <div className="a-obj-head">
            <span className="a-obj-title">
              <span className="a-idx">{i + 1}</span>
              {String(item?.[field.itemLabel] || 'Yangi element').slice(0, 60)}
            </span>
            <RowTools i={i} len={list.length} onMove={(f, t) => onChange(move(list, f, t))} onRemove={(k) => onChange(list.filter((_, j) => j !== k))} />
          </div>
          <div className="a-obj-body">
            {field.sub.map((s) => (
              <label className={`a-field${s.key === 'icon' || s.type === 'number' ? ' narrow' : ''}`} key={s.key}>
                <span className="a-label">{s.label}</span>
                <TextInput
                  multiline={s.type === 'textarea'}
                  type={s.type}
                  value={item?.[s.key]}
                  onChange={(nv) => onChange(list.map((x, j) => (j === i ? { ...x, [s.key]: nv } : x)))}
                />
              </label>
            ))}
          </div>
        </div>
      ))}
      <button type="button" className="a-btn ghost" onClick={() => onChange([...list, blank()])}>+ Element qo'shish</button>
    </div>
  );
}

function Field({ field, content, onChange }) {
  const value = getIn(content, field.path);
  const set = (v) => onChange(setIn(content, field.path, v));
  if (field.type === 'list') {
    return (
      <div className="a-field">
        <span className="a-label">{field.label}</span>
        <ListField value={value} onChange={set} />
      </div>
    );
  }
  if (field.type === 'objects') {
    return (
      <div className="a-field">
        <span className="a-label">{field.label}</span>
        <ObjectsField field={field} value={value} onChange={set} />
      </div>
    );
  }
  return (
    <label className="a-field">
      <span className="a-label">{field.label}</span>
      <TextInput multiline={field.type === 'textarea'} type={field.type} value={value} onChange={set} />
      {field.hint ? <span className="a-hint">{field.hint}</span> : null}
    </label>
  );
}

/* ---------- login ---------- */
function Login({ onDone }) {
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErr('');
    try {
      await login(pw);
      onDone();
    } catch (ex) {
      setErr(ex.message || "Kirib bo'lmadi");
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="a-login-wrap">
      <form className="a-login" onSubmit={submit}>
        <div className="a-logo">⚡</div>
        <h1>Admin panel</h1>
        <p>Sayt kontentini boshqarish uchun parolni kiriting</p>
        <input
          className="a-input"
          type="password"
          autoFocus
          autoComplete="current-password"
          placeholder="Parol"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
        />
        {err ? <div className="a-alert error">{err}</div> : null}
        <button className="a-btn primary" disabled={busy || !pw}>{busy ? 'Tekshirilmoqda…' : 'Kirish'}</button>
        <a className="a-back" href="/">← Saytga qaytish</a>
      </form>
    </div>
  );
}

/* ---------- asosiy panel ---------- */
export default function Admin() {
  const [authed, setAuthed] = useState(Boolean(getToken()));
  if (!authed) return <Login onDone={() => setAuthed(true)} />;
  return <Editor onLogout={() => { setToken(''); setAuthed(false); }} />;
}

function Editor({ onLogout }) {
  const [content, setContent] = useState(null);
  const [saved, setSaved] = useState(null);
  const [tab, setTab] = useState(SECTIONS[0].id);
  const [status, setStatus] = useState({ type: '', text: '' });
  const [saving, setSaving] = useState(false);
  const [storeReady, setStoreReady] = useState(true);

  useEffect(() => {
    fetchContent()
      .then(({ content: c, storeReady: s }) => {
        setContent(c);
        setSaved(JSON.stringify(c));
        setStoreReady(s);
      })
      .catch(() => {
        setContent(defaultContent);
        setSaved(JSON.stringify(defaultContent));
        setStatus({ type: 'error', text: "Serverga ulanib bo'lmadi. Standart kontent ko'rsatilmoqda." });
      });
  }, []);

  const dirty = useMemo(() => content && JSON.stringify(content) !== saved, [content, saved]);

  useEffect(() => {
    const h = (e) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', h);
    return () => window.removeEventListener('beforeunload', h);
  }, [dirty]);

  useEffect(() => {
    const h = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        document.getElementById('a-save-btn')?.click();
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  const save = async () => {
    setSaving(true);
    setStatus({ type: '', text: '' });
    try {
      await saveContent(content);
      setSaved(JSON.stringify(content));
      writeCache(content);
      setStatus({ type: 'ok', text: "Saqlandi! Sayt bir necha soniyada yangilanadi." });
    } catch (e) {
      if (e.code === 401) return onLogout();
      setStatus({ type: 'error', text: e.message });
    } finally {
      setSaving(false);
    }
  };

  const reset = () => {
    if (window.confirm("Barcha matnlarni dastlabki holatga qaytarasizmi? (Saqlamaguningizcha o'zgarmaydi)")) {
      setContent(defaultContent);
    }
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'sayt-kontenti.json';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const importJson = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        const data = JSON.parse(String(r.result));
        setContent({ ...defaultContent, ...data });
        setStatus({ type: 'ok', text: 'Fayl yuklandi. Saqlash tugmasini bosing.' });
      } catch {
        setStatus({ type: 'error', text: "Fayl noto'g'ri formatda" });
      }
    };
    r.readAsText(file);
    e.target.value = '';
  };

  if (!content) return <div className="a-loading">Yuklanmoqda…</div>;
  const section = SECTIONS.find((s) => s.id === tab);

  return (
    <div className="a-app">
      <header className="a-top">
        <div className="a-top-l">
          <strong>⚡ Admin panel</strong>
          {dirty ? <span className="a-dirty">● Saqlanmagan o'zgarishlar</span> : <span className="a-clean">Hammasi saqlangan</span>}
        </div>
        <div className="a-top-r">
          <a className="a-btn ghost" href="/" target="_blank" rel="noopener noreferrer">Saytni ko'rish ↗</a>
          <button id="a-save-btn" className="a-btn primary" onClick={save} disabled={saving || !dirty}>
            {saving ? 'Saqlanmoqda…' : 'Saqlash'}
          </button>
          <button className="a-btn ghost" onClick={onLogout}>Chiqish</button>
        </div>
      </header>

      {!storeReady && (
        <div className="a-alert warn a-wide">
          Ma'lumotlar bazasi hali ulanmagan — o'zgarishlarni saqlab bo'lmaydi. Vercel → Storage → Upstash Redis ulang (README.md'ga qarang).
        </div>
      )}
      {status.text && <div className={`a-alert ${status.type === 'ok' ? 'ok' : 'error'} a-wide`}>{status.text}</div>}

      <div className="a-body">
        <nav className="a-nav">
          {SECTIONS.map((s) => (
            <button key={s.id} className={`a-nav-btn${tab === s.id ? ' on' : ''}`} onClick={() => setTab(s.id)}>
              {s.label}
            </button>
          ))}
          <div className="a-nav-tools">
            <button className="a-nav-btn small" onClick={exportJson}>⬇ Zaxira nusxa (JSON)</button>
            <label className="a-nav-btn small">
              ⬆ JSON yuklash
              <input type="file" accept="application/json" hidden onChange={importJson} />
            </label>
            <button className="a-nav-btn small danger" onClick={reset}>↺ Dastlabki holatga</button>
          </div>
        </nav>

        <main className="a-main">
          <h2>{section.label}</h2>
          {section.hint ? <p className="a-sec-hint">{section.hint}</p> : null}
          {section.fields.map((f) => (
            <Field key={f.path} field={f} content={content} onChange={setContent} />
          ))}
          <p className="a-tip">Maslahat: <b>Ctrl+S</b> (Mac: <b>⌘+S</b>) bosib ham saqlash mumkin. Matn ichida <b>**shunday**</b> yozsangiz qalin bo'ladi.</p>
        </main>
      </div>
    </div>
  );
}
