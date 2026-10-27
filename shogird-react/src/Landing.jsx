import { useEffect, useRef, useState } from 'react';

/* ------------------------------------------------------------------ */
/* yordamchilar                                                        */
/* ------------------------------------------------------------------ */

// **qalin** -> <b>, \n -> <br>
export function rich(text) {
  const lines = String(text ?? '').split('\n');
  return lines.map((line, li) => (
    <span key={li}>
      {line.split('**').map((part, i) => (i % 2 ? <b key={i}>{part}</b> : part))}
      {li < lines.length - 1 && <br />}
    </span>
  ));
}

const reduced = () =>
  typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
const num = (s) => Number(String(s ?? '').replace(/[^\d]/g, '')) || 0;
const fmt = (n) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
const unitOf = (s) => String(s ?? '').replace(/[\d\s~]/g, '').trim();
// "299 000 so'm" -> ["299 000", "so'm"]
const splitPrice = (s) => {
  const m = String(s ?? '').match(/^\s*([\d\s]+?)\s*([^\d\s].*)?$/);
  return m ? [m[1], m[2] || ''] : [String(s ?? ''), ''];
};

function useInView(threshold = 0.25) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, seen];
}

function CountUp({ to, run, format = (n) => String(Math.round(n)), ms = 850 }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run) return;
    if (reduced()) {
      setN(to);
      return;
    }
    const start = performance.now();
    let raf;
    const tick = (t) => {
      const p = Math.min(1, (t - start) / ms);
      setN(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, to, ms]);
  return <>{format(n)}</>;
}

// sichqoncha ostidagi yorug'lik va 3D egilish (state yo'q — faqat CSS o'zgaruvchilar)
const canHover = () => typeof window !== 'undefined' && !!window.matchMedia?.('(hover: hover) and (pointer: fine)').matches;
function spot(e) {
  if (!canHover()) return;
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty('--mx', `${e.clientX - r.left}px`);
  el.style.setProperty('--my', `${e.clientY - r.top}px`);
}
function tilt(e) {
  if (!canHover()) return;
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width;
  const y = (e.clientY - r.top) / r.height;
  el.style.setProperty('--ry', `${((x - 0.5) * 10).toFixed(2)}deg`);
  el.style.setProperty('--rx', `${((0.5 - y) * 8).toFixed(2)}deg`);
  el.style.setProperty('--gx', `${(x * 100).toFixed(1)}%`);
  el.style.setProperty('--gy', `${(y * 100).toFixed(1)}%`);
}
function untilt(e) {
  const el = e.currentTarget;
  ['--ry', '--rx'].forEach((k) => el.style.setProperty(k, '0deg'));
}

function Btn({ href, children, big = false }) {
  return (
    <a className={`btn${big ? ' btn-big' : ''}`} href={href} target="_blank" rel="noopener noreferrer">
      <span>{children}</span>
      <svg viewBox="0 0 20 20" aria-hidden="true">
        <path d="M4 10h11M11 5l5 5-5 5" />
      </svg>
    </a>
  );
}

// matn oxiridagi "→" ni olib tashlaydi (tugmada o'z strelkasi bor)
const noArrow = (s) => String(s ?? '').replace(/\s*[→>»]+\s*$/u, '');

/* ------------------------------------------------------------------ */
/* HERO                                                                */
/* ------------------------------------------------------------------ */

function Plate() {
  return (
    <svg className="plate" viewBox="0 0 400 400" aria-hidden="true">
      <g fill="none" stroke="currentColor">
        <circle cx="200" cy="200" r="192" strokeWidth="2.5" />
        <circle cx="200" cy="200" r="176" strokeWidth="1" />
        <circle cx="200" cy="200" r="120" strokeWidth="1" strokeDasharray="3 9" />
        <circle cx="200" cy="200" r="64" strokeWidth="2.5" />
        <circle cx="200" cy="200" r="22" strokeWidth="2.5" />
        {Array.from({ length: 48 }).map((_, i) => {
          const a = (i / 48) * Math.PI * 2;
          const r1 = i % 4 === 0 ? 150 : 160;
          return <line key={i} x1={200 + Math.cos(a) * r1} y1={200 + Math.sin(a) * r1} x2={200 + Math.cos(a) * 172} y2={200 + Math.sin(a) * 172} strokeWidth={i % 4 === 0 ? 2.5 : 1} />;
        })}
      </g>
    </svg>
  );
}

function PriceCard({ c }) {
  const [big, unit] = splitPrice(c.price.now);
  const hasDiscount = Boolean(c.price.discount || c.price.old);
  return (
    <aside className="pcard" aria-label="Narx" onPointerMove={tilt} onPointerLeave={untilt}>
      <span className="pcard-shine" aria-hidden="true" />
      {c.trainerPhoto ? <img className="pcard-photo" src={c.trainerPhoto} alt={c.trainer} /> : null}
      <div className="pcard-price">
        {hasDiscount && (
          <div className="pcard-disc">
            {c.price.discount && <span className="chip">{c.price.discount}</span>}
            {c.price.old && <s>{c.price.old}</s>}
          </div>
        )}
        <div className="pcard-now">
          <b>{big}</b>
          {unit && <span>{unit}</span>}
        </div>
        {c.price.period && <div className="pcard-period">{c.price.period}</div>}
      </div>

      <Btn href={c.ctaLink} big>
        {noArrow(c.hero.cta)}
      </Btn>
      <p className="pcard-note">{c.hero.payNote}</p>
    </aside>
  );
}

function Ticker({ c, dark = false }) {
  const items = [c.badge, c.hero.payNote, c.pricing?.foot && String(c.pricing.foot).replace(/\*\*/g, '')].filter(Boolean);
  if (!items.length) return null;
  const group = items.map((t, i) => (
    <span className="tk-item" key={i}>
      {t}
      <i aria-hidden="true" />
    </span>
  ));
  return (
    <div className={`ticker${dark ? ' ticker-dark' : ''}`} aria-hidden="true">
      <div className="ticker-track">
        {[0, 1, 2, 3].map((k) => (
          <div className="tk-group" key={k}>
            {group}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* PAIN — belgilanadigan ro'yxat                                       */
/* ------------------------------------------------------------------ */

function Pain({ p, cta, link }) {
  const items = p.items || [];
  const [sel, setSel] = useState([]);
  const toggle = (i) => setSel((s) => (s.includes(i) ? s.filter((x) => x !== i) : [...s, i]));
  const n = sel.length;
  return (
    <section className="sec t-bone sec-paper" id="tanish" data-n="01">
      <div className="container">
        <h2>{p.title}</h2>
        <ul className="checks" role="group" aria-label={p.title}>
          {items.map((t, i) => {
            const on = sel.includes(i);
            return (
              <li key={i}>
                <button type="button" className={`ck${on ? ' on' : ''}`} role="checkbox" aria-checked={on} onClick={() => toggle(i)}>
                  <span className="ck-box" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path d="M5 12.5l4.6 4.6L19 7" />
                    </svg>
                  </span>
                  <span className="ck-text">{t}</span>
                </button>
              </li>
            );
          })}
        </ul>
        <div className={`ck-foot${n ? ' show' : ''}`} aria-live="polite">
          <div className="ck-count">
            <b>{n}</b>
            <span>/ {items.length}</span>
          </div>
          <div className="ck-bar" aria-hidden="true">
            <i style={{ transform: `scaleX(${items.length ? n / items.length : 0})` }} />
          </div>
          <div className="ck-cta">{n > 0 && <Btn href={link}>{noArrow(cta)}</Btn>}</div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* SURVEY                                                              */
/* ------------------------------------------------------------------ */

const Person = () => (
  <svg viewBox="0 0 24 44" aria-hidden="true">
    <circle cx="12" cy="9" r="6.5" />
    <path d="M2.5 42v-14a9.5 9.5 0 0 1 19 0v14z" />
  </svg>
);

function Stat({ it, seen, big, max }) {
  const pct = Number(it.percent) || 0;
  const C = 2 * Math.PI * 92;
  return (
    <div className={`stat${big ? ' stat-big' : ''}`}>
      {big ? (
        <div className="ring">
          <svg viewBox="0 0 200 200" aria-hidden="true">
            <circle className="ring-bg" cx="100" cy="100" r="92" />
            <circle className="ring-fg" cx="100" cy="100" r="92" strokeDasharray={C} strokeDashoffset={seen ? C * (1 - Math.min(100, pct) / 100) : C} />
          </svg>
          <div className="stat-num">
            <CountUp to={pct} run={seen} />
            <span>%</span>
          </div>
        </div>
      ) : (
        <div className="stat-num">
          <CountUp to={pct} run={seen} />
          <span>%</span>
        </div>
      )}
      <p className="stat-label">{it.label}</p>
      {!big && (
        <div className="stat-bar" aria-hidden="true">
          <i style={{ transform: `scaleX(${seen ? Math.min(1, pct / max) : 0})` }} />
        </div>
      )}
    </div>
  );
}

function Survey({ s }) {
  const [ref, seen] = useInView(0.2);
  const items = s.items || [];
  const max = Math.max(1, ...items.map((i) => Number(i.percent) || 0));
  const know = Math.max(0, Math.min(10, Math.round(((Number(items[0]?.percent) || 0) + (Number(items[1]?.percent) || 0)) / 10)));
  return (
    <section className="sec t-night sec-mesh slant" id="sorov" data-n="02">
      <div className="container" ref={ref}>
        <h2>{s.title}</h2>
        <p className="lead">{rich(s.intro)}</p>

        <div className="stat-grid">
          {items[0] && <Stat it={items[0]} seen={seen} max={max} big />}
          <div className="stat-side">
            {items.slice(1).map((it, i) => (
              <Stat key={i} it={it} seen={seen} max={max} />
            ))}
          </div>
        </div>

        <div className="crowd" aria-hidden="true">
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i} className={`man${seen && i < know ? ' on' : ''}`} style={{ transitionDelay: `${i * 45}ms` }}>
              <Person />
            </span>
          ))}
        </div>

        <p className="outro">{rich(s.outro)}</p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* FEATURES                                                            */
/* ------------------------------------------------------------------ */

function Features({ f }) {
  return (
    <section className="sec t-bone sec-paper" data-n="03">
      <div className="container">
        <h2>{f.title}</h2>
        <div className="fgrid">
          {(f.items || []).map((it, i) => (
            <article className="fcard" key={i} onPointerMove={spot}>
              <span className="fcard-n" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="fcard-icon" aria-hidden="true">
                {it.icon}
              </span>
              <h3>{it.title}</h3>
              <p>{rich(it.text)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* AUDIENCE                                                            */
/* ------------------------------------------------------------------ */

function Audience({ a }) {
  const items = a.items || [];
  const [i, setI] = useState(0);
  return (
    <section className="sec t-night sec-mesh" id="kim" data-n="04">
      <div className="container">
        <h2>{a.title}</h2>
        <div className="aud">
          {items.map((it, k) => {
            const on = k === i;
            return (
              <button
                key={k}
                type="button"
                className={`ap${on ? ' on' : ''}`}
                aria-expanded={on}
                onClick={() => setI(k)}
                onMouseEnter={() => window.matchMedia?.('(hover: hover)').matches && setI(k)}
                onFocus={() => setI(k)}
              >
                <span className="ap-icon" aria-hidden="true">
                  {it.icon}
                </span>
                <span className="ap-vt" aria-hidden={on}>
                  {it.title}
                </span>
                <span className="ap-body">
                  <b className="ap-title">{it.title}</b>
                  <span className="ap-text">{rich(it.text)}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* PRICING                                                             */
/* ------------------------------------------------------------------ */

function Pricing({ p, link }) {
  const [ref, seen] = useInView(0.25);
  const total = num(p.totalValue);
  const unit = unitOf(p.totalValue);
  return (
    <section className="sec t-yellow sec-sun slant" id="narx" data-n="05">
      <div className="container narrow">
        <h2>{p.title}</h2>
        <div className={`ptable${seen ? ' go' : ''}`} ref={ref}>
          <ul className="pt-lines">
            {(p.lines || []).map((l, i) => (
              <li key={i} style={{ transitionDelay: `${i * 50}ms` }}>
                <span>{l.label}</span>
                <span className="pt-val">{l.value}</span>
              </li>
            ))}
          </ul>
          <div className="pt-total">
            <span>{p.totalLabel}</span>
            <span className="pt-sum">
              <CountUp to={total} run={seen} format={fmt} ms={900} />
              {unit ? ` ${unit}` : ''}
            </span>
          </div>
          <div className="pt-final">
            <span className="pt-first">{p.firstLabel}</span>
            <strong className="pt-price">{p.firstValue}</strong>
          </div>
          <p className="pt-foot">{rich(p.foot)}</p>
        </div>
        <div className="pt-cta">
          <Btn href={link} big>
            {noArrow(p.cta)}
          </Btn>
          <p className="note">{rich(p.note)}</p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* COST                                                                */
/* ------------------------------------------------------------------ */

function Cost({ cost, link }) {
  const [ref, seen] = useInView(0.2);
  return (
    <section className="sec t-night sec-cost" id="hisob" data-n="06">
      <div className="container narrow" ref={ref}>
        <h2>{cost.title}</h2>
        <p className="cost-lead">{cost.lead}</p>
        <ol className={`burn${seen ? ' go' : ''}`}>
          {(cost.items || []).map((t, i) => (
            <li key={i} style={{ transitionDelay: `${i * 70}ms` }}>
              <span className="burn-dot" aria-hidden="true" />
              <span>{rich(t)}</span>
            </li>
          ))}
        </ol>
        <p className="cost-quote">{rich(cost.quote)}</p>
        <Btn href={link}>{noArrow(cost.cta)}</Btn>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* FAQ                                                                 */
/* ------------------------------------------------------------------ */

function Faq({ f }) {
  const [open, setOpen] = useState(0);
  return (
    <section className="sec t-bone sec-paper slant" id="faq" data-n="07">
      <div className="container faq-grid">
        <h2 className="faq-title">{f.title}</h2>
        <div className="faq">
          {(f.items || []).map((it, i) => {
            const isOpen = open === i;
            return (
              <div className={`faq-item${isOpen ? ' open' : ''}`} key={i}>
                <button className="faq-q" aria-expanded={isOpen} aria-controls={`faq-a-${i}`} onClick={() => setOpen(isOpen ? -1 : i)}>
                  <span>{it.q}</span>
                  <span className="faq-plus" aria-hidden="true" />
                </button>
                <div className="faq-a" id={`faq-a-${i}`} role="region">
                  <div className="faq-a-wrap">
                    <p>{rich(it.a)}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* FINAL                                                               */
/* ------------------------------------------------------------------ */

function Final({ c, link, innerRef }) {
  const [big, unit] = splitPrice(c.price.now);
  return (
    <section className="sec t-yellow sec-sun final" ref={innerRef}>
      <div className="container">
        <h2>{c.final.title}</h2>
        <div className="paths">
          <div className="path path-a">
            <span className="path-mark" aria-hidden="true">
              ✕
            </span>
            <p>{c.final.pathA}</p>
          </div>
          <div className="path path-b">
            <span className="path-mark" aria-hidden="true">
              ✓
            </span>
            <p>{c.final.pathB}</p>
            <div className="path-price">
              {c.price.discount && <span className="chip">{c.price.discount}</span>}
              {c.price.old && <s>{c.price.old}</s>}
              <b>{big}</b>
              {unit && <em>{unit}</em>}
            </div>
            <Btn href={link} big>
              {noArrow(c.final.cta)}
            </Btn>
            <p className="note">{c.final.note}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* SAHIFA                                                              */
/* ------------------------------------------------------------------ */

export default function Landing({ c }) {
  const [showSticky, setShowSticky] = useState(false);
  const heroRef = useRef(null);
  const finalRef = useRef(null);
  const barRef = useRef(null);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      if (barRef.current) barRef.current.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
      const hero = heroRef.current;
      const fin = finalRef.current;
      if (!hero) return;
      const pastHero = hero.getBoundingClientRect().bottom < 0;
      const atFinal = fin ? fin.getBoundingClientRect().top < window.innerHeight * 0.5 : false;
      setShowSticky(pastHero && !atFinal);
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const link = c.ctaLink;
  const hasDiscount = Boolean(c.price.discount || c.price.old);

  return (
    <div className="site">
      <div className="progress" aria-hidden="true">
        <i ref={barRef} />
      </div>

      <header className="hero t-night" ref={heroRef}>
        <div className="hero-glow" aria-hidden="true" />
        <div className="hero-grid-bg" aria-hidden="true" />
        <div className="hero-ghost" aria-hidden="true">
          {splitPrice(c.price.now)[0]}
        </div>
        <div className="hero-plate" aria-hidden="true">
          <Plate />
        </div>
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">
              <i aria-hidden="true" />
              {c.trainer}
            </p>
            <h1>
              <span className="h1-a">
                {String(c.hero.line1 ?? '').split(' ').map((w, i) => (
                  <span className="w" key={i} style={{ animationDelay: `${0.08 + i * 0.07}s` }}>
                    {w}{' '}
                  </span>
                ))}
              </span>
              <span className="h1-b">{c.hero.line2}</span>
            </h1>
            <p className="hero-sub">{rich(c.hero.sub)}</p>
            {c.badge ? <span className="pill">{c.badge}</span> : null}
          </div>
          <PriceCard c={c} />
        </div>
      </header>

      <Ticker c={c} />
      <Pain p={c.pain} cta={c.hero.cta} link={link} />
      <Survey s={c.survey} />
      <Features f={c.features} />
      <Audience a={c.audience} />
      <Ticker c={c} dark />
      <Pricing p={c.pricing} link={link} />
      <Cost cost={c.cost} link={link} />
      <Faq f={c.faq} />
      <Final c={c} link={link} innerRef={finalRef} />

      <footer className="footer t-night">
        <div className="container narrow center">
          <p className="footer-brand">{c.footer.brand}</p>
          <p className="footer-text">{c.footer.disclaimer}</p>
        </div>
      </footer>

      <div className={`sticky${showSticky ? ' show' : ''}`} aria-hidden={!showSticky}>
        <div className="sticky-in">
          <div className="sticky-price">
            <strong>{c.price.now}</strong>
            <span>
              {hasDiscount && c.price.old ? (
                <>
                  <s>{c.price.old}</s> ·{' '}
                </>
              ) : null}
              {c.price.period}
            </span>
          </div>
          <a className="btn sticky-btn" href={link} target="_blank" rel="noopener noreferrer" tabIndex={showSticky ? 0 : -1}>
            <span>{c.stickyCta}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
