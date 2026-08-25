// ─── DIRECTION E · "ASHFORDE HOUSE" ───────────────────────────────────────
// Not a new aesthetic — ashforde.org's own, carried onto GitHub. EB Garamond
// embedded, the site's paper/ink/gold palette, the Devanagari motto, and the
// five domains of work as the organising spine.
import { D, esc, nfmt, buckets } from './data.mjs';
import { EBG_400, EBG_600, EBG_ITA, TIRO, SERIF, DEVA, MONO } from './fonts.mjs';
import { mark } from './mark.mjs';
import { armillary, armillaryDefs, armillaryMotion } from './armillary.mjs';

const W = 880;

const T = {
  // Text colours are matched across modes by measured WCAG ratio, not by eye:
  // ink 14.66/14.58 · ink2 5.98/5.97 · ink3 4.33/4.71 · gold 6.31/6.29.
  // `goldG` is the graphics gold — rules, bars, seal accents, where the 3.0
  // non-text floor applies and the brand's own seal variants set the value.
  light: { paper:'#F6F4F0', panel:'#EFEBE3', ink:'#212121', ink2:'#645C53', ink3:'#766E60',
           line:'rgba(33,33,33,.16)', lineS:'rgba(33,33,33,.30)',
           gold:'#6B572F', goldG:'#9C7C3C', coreHi:'#C9AE79', coreLo:'#6E5626', bar:'#212121', rev:'#F6F4F0',
           cellInk:'#212121', ramp:["#EFEBE3", "#EFE9DC", "#E0D3B8", "#CDB88E", "#B99C60"] },
  dark:  { paper:'#11161E', panel:'#161E29', ink:'#ECE6D8', ink2:'#9D937E', ink3:'#887F6E',
           line:'rgba(236,230,216,.16)', lineS:'rgba(236,230,216,.30)',
           gold:'#B39454', goldG:'#C7AA66', coreHi:'#EBD8A6', coreLo:'#6B5327', bar:'#ECE6D8', rev:'#11161E',
           cellInk:'#ECE6D8', ramp:["#161E29", "#40341C", "#554526", "#67542D", "#786235"] },
};

const M = 56;                                   // page margin, matches the site's air
/** Motion for a card. One-shot entrances that settle; only the seal loops.
 *  Everything is disabled under prefers-reduced-motion. */
const MOTION = `
  @keyframes aCell{from{opacity:0;transform:translateY(4px) scale(.84)}to{opacity:1;transform:none}}
  @keyframes aGrow{from{transform:scaleY(0)}to{transform:scaleY(1)}}
  @keyframes aFade{from{opacity:0}to{opacity:1}}
  @keyframes aWipe{from{stroke-dashoffset:var(--len)}to{stroke-dashoffset:0}}
  @keyframes aSpinA{to{transform:rotate(360deg)}}
  @keyframes aSpinB{to{transform:rotate(-360deg)}}
  .cell{animation:aCell .46s cubic-bezier(.22,.9,.3,1) backwards}
  .bar{transform-origin:center bottom;animation:aGrow .62s cubic-bezier(.2,.85,.3,1) backwards}
  .barn{animation:aFade .4s ease-out backwards}
  .rule{stroke-dasharray:var(--len);animation:aWipe .85s .1s cubic-bezier(.2,.8,.3,1) backwards}
  .seal-a{transform-origin:50% 50%;animation:aSpinA 150s linear infinite}
  .seal-b{transform-origin:50% 50%;animation:aSpinB 96s linear infinite}
  @media (prefers-reduced-motion:reduce){
    .cell,.bar,.barn,.rule,.seal-a,.seal-b{animation:none}
    .rule{stroke-dasharray:none}
  }` + armillaryMotion;

const open = (h, t, fonts) => `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${h}" viewBox="0 0 ${W} ${h}" role="img">
<defs><style>${fonts.join('')}${MOTION}</style></defs>
<rect width="${W}" height="${h}" fill="${t.paper}"/>`;

const caps = (s) => esc(s.toUpperCase());

// ── HERO ───────────────────────────────────────────────────────────────────
export function hero(mode) {
  const t = T[mode], H = 396;
  const OX = 686, OY = 214, OS = 236;        // orrery centre and size
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Ashforde — for the missions that cannot fail">
<defs><style>${[EBG_400(), EBG_600(), EBG_ITA(), TIRO()].join('')}${MOTION}</style>${armillaryDefs(t)}</defs>
<rect width="${W}" height="${H}" fill="${t.paper}"/>
  <g style="--gg:${t.goldG};--ch:${t.coreHi}">

  <text x="${M}" y="46" font-family="${MONO}" font-size="10" letter-spacing="3.2" fill="${t.ink3}">${caps('Ashforde OÜ · European engineering company')}</text>
  <text x="${W-M}" y="46" text-anchor="end" font-family="${MONO}" font-size="10" letter-spacing="2.4" fill="${t.ink3}">A C. BAWEJA COMPANY</text>
  <path d="M${M} 60H${W-M}" stroke="${t.lineS}" stroke-width="1"/>

  ${mark(M, 84, 62, mode, ['seal-a', 'seal-b'])}
  <text x="${M+82}" y="128" font-family="${SERIF}" font-size="42" font-weight="600" letter-spacing="9.5" fill="${t.ink}">ASHFORDE<tspan font-size="14" dy="-19" letter-spacing="0" fill="${t.gold}">${D.tm}</tspan></text>

  <text x="${M}" y="196" font-family="${SERIF}" font-size="30" font-style="italic" fill="${t.ink}">${esc(D.tagline)}</text>
  <path class="rule" style="--len:96" d="M${M} 216h96" stroke="${t.goldG}" stroke-width="2.5"/>

  <g font-family="${SERIF}" font-size="16" fill="${t.ink2}">
    <text x="${M}" y="250">Sovereign, high-assurance systems for the</text>
    <text x="${M}" y="272">decisions that cannot be wrong — in space,</text>
    <text x="${M}" y="294">in law, in finance, and across the regulated enterprise.</text>
  </g>

  <text x="${M}" y="334" font-family="${DEVA}" font-size="18" fill="${t.gold}">${esc(D.motto.dev)}</text>
  <text x="${M}" y="354" font-family="${SERIF}" font-size="12" font-style="italic" fill="${t.ink3}">${esc(D.motto.lat)} — ${esc(D.motto.en)}</text>

  ${armillary(OX, OY, OS, t)}

  <path d="M${M} ${H-34}H${W-M}" stroke="${t.line}" stroke-width="1"/>
  <g font-family="${MONO}" font-size="10" letter-spacing="1.6" fill="${t.ink3}">
    <text x="${M}" y="${H-14}">${caps(D.seat)} · REGISTERED OFFICE · ${caps(D.ops)} · OPERATIONS</text>
    <text x="${W-M}" y="${H-14}" text-anchor="end" fill="${t.gold}">${caps(D.site)}</text>
  </g>
  </g>
</svg>`;
}

// ── DOMAINS OF WORK — the organising spine, straight from the site ─────────
export function domains(mode) {
  const t = T[mode], rows = D.domains, H = 92 + rows.length * 62;
  return open(H, t, [EBG_400(), EBG_600(), EBG_ITA()]) + `
  <text x="${M}" y="40" font-family="${MONO}" font-size="10" letter-spacing="3.2" fill="${t.ink3}">${caps('Domains of work')}</text>
  <text x="${W-M}" y="40" text-anchor="end" font-family="${SERIF}" font-size="14" font-style="italic" fill="${t.ink3}">Where the cost of error is highest.</text>
  <path d="M${M} 56H${W-M}" stroke="${t.lineS}" stroke-width="1"/>
  ${rows.map(([name, desc], i) => {
    const y = 56 + i * 62;
    return `
    <text x="${M}" y="${y+30}" font-family="${SERIF}" font-size="12" font-weight="600" fill="${t.gold}">${String(i+1).padStart(2,'0')}</text>
    <text x="${M+34}" y="${y+30}" font-family="${SERIF}" font-size="19" font-weight="600" fill="${t.ink}">${esc(name)}</text>
    <text x="${M+34}" y="${y+50}" font-family="${SERIF}" font-size="14" fill="${t.ink2}">${esc(desc)}</text>
    <path d="M${M} ${y+62}H${W-M}" stroke="${t.line}" stroke-width="1"/>`;
  }).join('')}` + `</svg>`;
}

// ── STANDING — the numbers, framed as evidence rather than scoreboard ──────
export function standing(mode) {
  const t = T[mode], H = 336, PAD = 48;
  const days = D.windowDays;
  // weekly totals — the activity card is daily, so this stays complementary
  const wk = [];
  for (let i = 0; i < days.length; i += 7)
    wk.push({ from: days[i].date, n: days.slice(i, i + 7).reduce((a, d) => a + d.contributionCount, 0) });
  const max = Math.max(...wk.map(w => w.n));
  const pw = W - PAD * 2, bw = pw / wk.length, py = 176, ph = 84;

  const figs = [
    ['Contributions, 12 months', nfmt(D.contributions), `${nfmt(D.private)} in private repositories`],
    ['Source under management',  `${D.sourceMB} MB`,     `${D.repos} repositories · ${D.languages} languages`],
    ['Preprints on arXiv',       String(D.papers.length), 'Signal processing · planetary · security'],
  ];
  const MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  let lastMon = -1;

  return open(H, t, [EBG_400(), EBG_600(), EBG_ITA()]) + `
  <text x="${PAD}" y="40" font-family="${MONO}" font-size="10" letter-spacing="3.2" fill="${t.ink3}">${caps('Standing')}</text>
  <text x="${W-PAD}" y="40" text-anchor="end" font-family="${SERIF}" font-size="14" font-style="italic" fill="${t.ink3}">Credible where it counts.</text>
  <path d="M${PAD} 56H${W-PAD}" stroke="${t.lineS}" stroke-width="1"/>

  ${figs.map(([l, v, sub], i) => {
    const x = PAD + i * ((W - 2*PAD) / 3);
    return `
    <text x="${x}" y="${94}" font-family="${SERIF}" font-size="31" font-weight="600" fill="${t.ink}">${esc(v)}</text>
    <text x="${x}" y="${112}" font-family="${MONO}" font-size="10" letter-spacing="1.5" fill="${t.gold}">${caps(l)}</text>
    <text x="${x}" y="${130}" font-family="${SERIF}" font-size="13" fill="${t.ink3}">${esc(sub)}</text>`;
  }).join('')}

  <text x="${PAD}" y="${py-22}" font-family="${MONO}" font-size="10" letter-spacing="2.2" fill="${t.ink3}">${caps('Contributions per week · Jan–Aug 2026')}</text>
  ${wk.map((w, i) => {
    const h = Math.max(2, (w.n / max) * ph), x = PAD + i * bw;
    const peak = w.n === max;
    const dly = (i * 18).toFixed(0);
    return `<rect class="bar" style="animation-delay:${dly}ms" x="${(x + 1.4).toFixed(1)}" y="${(py + ph - h).toFixed(1)}" width="${(bw - 2.8).toFixed(1)}" height="${h.toFixed(1)}" fill="${peak ? t.goldG : t.ink}" opacity="${peak ? 1 : .3}"/>` +
      `<text class="barn" style="animation-delay:${(+dly + 240)}ms" x="${(x + bw/2).toFixed(1)}" y="${(py + ph - h - 5).toFixed(1)}" text-anchor="middle" font-family="${MONO}" font-size="9" fill="${peak ? t.gold : t.ink3}" font-weight="${peak ? 700 : 400}">${w.n}</text>`;
  }).join('')}
  <path d="M${PAD} ${py+ph}H${W-PAD}" stroke="${t.line}" stroke-width="1"/>
  ${wk.map((w, i) => {
    const m = +w.from.slice(5, 7) - 1;
    if (m === lastMon) return '';
    lastMon = m;
    return `<text x="${(PAD + i * bw).toFixed(1)}" y="${py+ph+16}" font-family="${MONO}" font-size="10" letter-spacing="1.3" fill="${t.ink3}">${MON[m].toUpperCase()}</text>`;
  }).join('')}

  <path d="M${PAD} ${H-40}H${W-PAD}" stroke="${t.line}" stroke-width="1"/>
  <text x="${PAD}" y="${H-16}" font-family="${SERIF}" font-size="13" font-style="italic" fill="${t.ink3}">Client names, programmes and product detail are disclosed privately, under appropriate terms.</text>
  <text x="${W-PAD}" y="${H-16}" text-anchor="end" font-family="${MONO}" font-size="10" letter-spacing="1.4" fill="${t.ink3}">PEAK WEEK ${nfmt(max)}</text>` + `</svg>`;
}

// ── COMMITMENTS ────────────────────────────────────────────────────────────
export function commitments(mode) {
  const t = T[mode], rows = D.commitments, H = 78 + rows.length * 54;
  return open(H, t, [EBG_400(), EBG_600(), EBG_ITA()]) + `
  <text x="${M}" y="40" font-family="${MONO}" font-size="10" letter-spacing="3.2" fill="${t.ink3}">${caps('The approach')}</text>
  <text x="${W-M}" y="40" text-anchor="end" font-family="${SERIF}" font-size="14" font-style="italic" fill="${t.ink3}">Engineered for assurance, not for show.</text>
  <path d="M${M} 56H${W-M}" stroke="${t.lineS}" stroke-width="1"/>
  ${rows.map(([name, desc], i) => {
    const y = 56 + i * 54;
    return `
    <rect x="${M}" y="${y+16}" width="3" height="26" fill="${t.goldG}"/>
    <text x="${M+18}" y="${y+30}" font-family="${SERIF}" font-size="17" font-weight="600" fill="${t.ink}">${esc(name)}</text>
    <text x="${M+18}" y="${y+48}" font-family="${SERIF}" font-size="13.5" fill="${t.ink2}">${esc(desc)}</text>`;
  }).join('')}` + `</svg>`;
}


// ── ACTIVITY · numbered contribution grid, two bands so the numerals stay legible
//    (one 53-week band caps the numerals at 7.5px on GitHub; two bands give 14.7px)
export function activity(mode) {
  const t = T[mode], PAD = 48;
  const CELL = 23, GAP = 3.6, P = CELL + GAP;
  const days = D.windowDays;
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));
  const bandH = 7 * P;
  const H = 62 + bandH + 52;

  const total = days.reduce((a, d) => a + d.contributionCount, 0);
  const max = Math.max(...days.map(d => d.contributionCount));
  const active = days.filter(d => d.contributionCount > 0).length;
  const step = (c) => c === 0 ? 0 : c < 25 ? 1 : c < 100 ? 2 : c < 250 ? 3 : 4;
  const fill = t.ramp;      // solid per tier; contrast verified against each

  const MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  let lastMon = -1;
  const monthLabels = weeks.map((w, x) => {
    const m = +w[0].date.slice(5, 7) - 1;
    if (m === lastMon || x > weeks.length - 2) return '';
    lastMon = m;
    return `<text x="${PAD + x * P}" y="62" font-family="${MONO}" font-size="10" letter-spacing="1.4" fill="${t.ink3}">${MON[m].toUpperCase()}</text>`;
  }).join('');

  return open(H, t, [EBG_400(), EBG_600(), EBG_ITA()]) + `
  <text x="${PAD}" y="34" font-family="${MONO}" font-size="10" letter-spacing="3.2" fill="${t.ink3}">${caps('Activity · every contributing day, counted')}</text>
  <text x="${W-PAD}" y="34" text-anchor="end" font-family="${SERIF}" font-size="17" font-weight="600" fill="${t.ink}">${nfmt(total)}</text>
  <path d="M${PAD} 46H${W-PAD}" stroke="${t.lineS}" stroke-width="1"/>
  ${monthLabels}
  ${weeks.map((w, x) => w.map((d, r) => {
    const n = step(d.contributionCount), cx = PAD + x * P, cy = 72 + r * P;
    const delay = ((x * 7 + r) * 4.5).toFixed(0);
    return `<g class="cell" style="animation-delay:${delay}ms">` +
      `<rect x="${cx.toFixed(1)}" y="${cy.toFixed(1)}" width="${CELL}" height="${CELL}" rx="3" fill="${fill[n]}"/>` +
      (d.contributionCount > 0
        ? `<text x="${(cx + CELL/2).toFixed(1)}" y="${(cy + CELL/2 + 3.2).toFixed(1)}" text-anchor="middle" font-family="${MONO}" font-size="10" font-weight="${n >= 3 ? 600 : 400}" fill="${t.cellInk}">${d.contributionCount}</text>`
        : '') + `</g>`;
  }).join('')).join('')}
  <path d="M${PAD} ${H-40}H${W-PAD}" stroke="${t.line}" stroke-width="1"/>
  <text x="${PAD}" y="${H-18}" font-family="${MONO}" font-size="10" letter-spacing="1.5" fill="${t.ink3}">JAN–AUG 2026 · ${active} ACTIVE DAYS · ${D.streak}-DAY LONGEST RUN · PEAK ${max} · ${nfmt(D.private)} IN PRIVATE REPOSITORIES</text>
  <text x="${W-PAD}" y="${H-18}" text-anchor="end" font-family="${SERIF}" font-size="12.5" font-style="italic" fill="${t.ink3}">Blank is blank. Nothing is smoothed.</text>` + `</svg>`;
}

// ── STACK · languages by mass. Brand-native, not a badge service ───────────
export function stack(mode) {
  const t = T[mode], PAD = 48, H = 206;
  const top = D.langs.slice(0, 9);
  const pw = W - PAD * 2;
  let x = PAD;
  const bar = top.map((l, i) => {
    const w = (l.pct / 100) * pw;
    const seg = `<rect x="${x.toFixed(1)}" y="76" width="${Math.max(0, w - 2).toFixed(1)}" height="22" fill="${t.goldG}" opacity="${(1 - i * 0.095).toFixed(2)}"/>`;
    x += w; return seg;
  }).join('');
  return open(H, t, [EBG_400(), EBG_600(), EBG_ITA()]) + `
  <text x="${PAD}" y="34" font-family="${MONO}" font-size="10" letter-spacing="3.2" fill="${t.ink3}">${caps('Working languages · by source mass')}</text>
  <text x="${W-PAD}" y="34" text-anchor="end" font-family="${SERIF}" font-size="14" font-style="italic" fill="${t.ink3}">${D.repos} repositories · ${D.sourceMB} MB</text>
  <path d="M${PAD} 46H${W-PAD}" stroke="${t.lineS}" stroke-width="1"/>
  <rect x="${PAD}" y="76" width="${pw}" height="22" fill="${t.panel}"/>
  ${bar}
  <g font-family="${SERIF}" font-size="15">
    ${top.slice(0, 5).map((l, i) => `
      <rect x="${PAD + i * 160}" y="${124}" width="9" height="9" fill="${t.goldG}" opacity="${(1 - i * 0.095).toFixed(2)}"/>
      <text x="${PAD + i * 160 + 17}" y="${133}" fill="${t.ink}">${esc(l.name)}</text>
      <text x="${PAD + i * 160 + 17}" y="${152}" font-family="${MONO}" font-size="10" fill="${t.ink3}">${l.pct.toFixed(1)}%</text>`).join('')}
    ${top.slice(5, 9).map((l, i) => `
      <rect x="${PAD + i * 160}" y="${172}" width="9" height="9" fill="${t.goldG}" opacity="${(1 - (i+5) * 0.095).toFixed(2)}"/>
      <text x="${PAD + i * 160 + 17}" y="${181}" font-size="13.5" fill="${t.ink2}">${esc(l.name)}</text>
      <text x="${PAD + i * 160 + 104}" y="${181}" font-family="${MONO}" font-size="10" fill="${t.ink3}">${l.pct.toFixed(1)}%</text>`).join('')}
  </g>` + `</svg>`;
}


// ── RESEARCH · preprints, discovered by author query so this never goes stale ──
export function research(mode) {
  const t = T[mode], PAD = 48;
  const ps = D.papers.slice(0, 6);
  const H = 74 + ps.length * 54 + 34;
  const CAT = { 'eess.SP':'Signal Processing', 'astro-ph.EP':'Earth & Planetary Astrophysics',
                'cs.CR':'Cryptography & Security', 'astro-ph.IM':'Instrumentation & Methods' };
  const clip = (str, n) => str.length > n ? str.slice(0, n - 1).replace(/[\s,;:]+$/, '') + '…' : str;
  return open(H, t, [EBG_400(), EBG_600(), EBG_ITA()]) + `
  <text x="${PAD}" y="34" font-family="${MONO}" font-size="10" letter-spacing="3.2" fill="${t.ink3}">${caps('Research · preprints on arXiv')}</text>
  <text x="${W-PAD}" y="34" text-anchor="end" font-family="${SERIF}" font-size="14" font-style="italic" fill="${t.ink3}">Methods published so results can be contested.</text>
  <path d="M${PAD} 46H${W-PAD}" stroke="${t.lineS}" stroke-width="1"/>
  ${ps.map((p, i) => {
    const y = 46 + i * 54;
    return `
    <text x="${PAD}" y="${y+30}" font-family="${MONO}" font-size="10.5" fill="${t.gold}">${esc(p.id.replace(/v\d+$/, ''))}</text>
    <text x="${PAD+96}" y="${y+30}" font-family="${SERIF}" font-size="15.5" fill="${t.ink}">${esc(clip(p.title, 84))}</text>
    <text x="${PAD+96}" y="${y+47}" font-family="${MONO}" font-size="10" letter-spacing="1.2" fill="${t.ink3}">${caps(p.date)} · ${caps(CAT[p.cat] || p.cat)}</text>
    <path d="M${PAD} ${y+54}H${W-PAD}" stroke="${t.line}" stroke-width="1"/>`;
  }).join('')}
  <text x="${PAD}" y="${H-12}" font-family="${SERIF}" font-size="13" font-style="italic" fill="${t.ink3}">Every headline figure regenerates from a committed scenario and seed.</text>
  <text x="${W-PAD}" y="${H-12}" text-anchor="end" font-family="${MONO}" font-size="10" letter-spacing="1.4" fill="${t.ink3}">${ps.length} PUBLISHED</text>` + `</svg>`;
}


// ── PROJECT · one card per product, so each carries its own link and its own
//    status. YANA's pre-release state travels with the card, not a footnote.
export function project(mode, key) {
  const t = T[mode], PAD = 48;
  const p = D.products.find(x => x.key === key);
  const live = D.liveProducts.find(x => x.name === p.repo);
  const pre = p.status === 'PRE-RELEASE';
  const H = 104;
  const MID = PAD + 268;                 // description column
  const chipW = p.status.length * 6.1 + 18;

  return open(H, t, [EBG_400(), EBG_600(), EBG_ITA()]) + `
  <text x="${PAD}" y="42" font-family="${SERIF}" font-size="26" font-weight="600" letter-spacing=".4" fill="${t.ink}">${esc(p.name)}</text>
  <text x="${PAD}" y="64" font-family="${MONO}" font-size="10" letter-spacing="1.3" fill="${t.gold}">${esc(p.site.toUpperCase())}</text>

  <text x="${MID}" y="40" font-family="${SERIF}" font-size="17" fill="${t.ink}">${esc(p.one)}</text>
  <text x="${MID}" y="62" font-family="${MONO}" font-size="10" letter-spacing=".9" fill="${t.ink3}">${esc(p.facets.join('  ·  '))}</text>

  <g text-anchor="end">
    ${live?.version
      ? `<text x="${W-PAD}" y="40" font-family="${MONO}" font-size="13" fill="${t.ink}">${esc(live.version)}</text>`
      : `<g transform="translate(${W-PAD-chipW},26)">
           <rect width="${chipW}" height="19" rx="2.5" fill="none" stroke="${t.ink3}" stroke-width="1" stroke-dasharray="3 2"/>
           <text x="${chipW/2}" y="13.5" text-anchor="middle" font-family="${MONO}" font-size="10" letter-spacing="1.4" fill="${t.ink3}">${esc(p.status)}</text>
         </g>`}
    <text x="${W-PAD}" y="62" font-family="${MONO}" font-size="10" letter-spacing="1.1" fill="${t.ink3}">${esc(p.license)}</text>
    ${live ? `<text x="${W-PAD}" y="80" font-family="${MONO}" font-size="10" letter-spacing="1.1" fill="${t.ink3}">★ ${live.stars}</text>` : ''}
  </g>

  ${pre ? `<text x="${MID}" y="84" font-family="${SERIF}" font-size="12.5" font-style="italic" fill="${t.ink3}">${esc(p.statusNote)} · 7 operations marketed, 17 cross-validated, next milestone 50.</text>` : ''}
  <path d="M${PAD} ${H-1}H${W-PAD}" stroke="${t.line}" stroke-width="1"/>` + `</svg>`;
}

const projectCards = Object.fromEntries(
  D.products.map(p => [`project-${p.key}`, (mode) => project(mode, p.key)]));

export const cards = { hero, domains, stack, activity, standing, research, commitments, ...projectCards };
export const meta = { id:'E', name:'ASHFORDE HOUSE',
  blurb:"Not a new aesthetic \u2014 ashforde.org's own, carried onto GitHub. EB Garamond embedded, the site's paper / ink / gold palette, the Devanagari motto, and the five domains of work as the organising spine." };
