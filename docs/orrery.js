// ── The Orrery ────────────────────────────────────────────────────────────
// Built in the site's own engraved-astrolabe language: concentric rings,
// radial ticks, very slow rotation. Given a job to do here — the bodies are
// the real domains and products, and the travelling dashes between them are
// the work moving between the two. Hover a body to name it.
export function orrery(host, { products, domains }) {
  const NS = 'http://www.w3.org/2000/svg';
  const C = 200, R_DOM = 163, R_PRD = 104;
  const el = (n, a = {}) => {
    const e = document.createElementNS(NS, n);
    for (const [k, v] of Object.entries(a)) e.setAttribute(k, v);
    return e;
  };
  const at = (r, deg) => [C + r * Math.cos((deg - 90) * Math.PI / 180),
                          C + r * Math.sin((deg - 90) * Math.PI / 180)];

  const svg = el('svg', { viewBox: '0 0 400 400', class: 'orrery',
                          role: 'img', 'aria-label': 'Domains of work and open products, in orbit' });

  // engraved ground: rings + a ticked bezel, the site's own vocabulary
  const ground = el('g', { class: 'eng' });
  [190, 176, R_DOM, 131, R_PRD, 62].forEach((r, i) =>
    ground.appendChild(el('circle', { cx: C, cy: C, r, 'stroke-opacity': [0.5, 0.3, 0.42, 0.24, 0.42, 0.3][i] })));
  ground.appendChild(el('circle', { cx: C, cy: C, r: 183, 'stroke-width': 11,
    'stroke-dasharray': '2.2 22.4', 'stroke-opacity': .45 }));
  for (let d = 0; d < 360; d += 15) {
    const [x1, y1] = at(66, d), [x2, y2] = at(176, d);
    ground.appendChild(el('line', { x1, y1, x2, y2, 'stroke-opacity': d % 45 ? .12 : .3 }));
  }
  svg.appendChild(ground);

  // the sweep — one slow pass, the only fast-moving thing on the page
  const defs = el('defs');
  defs.innerHTML = `<linearGradient id="sweepG" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="var(--goldG)" stop-opacity="0"/>
      <stop offset="1" stop-color="var(--goldG)" stop-opacity=".30"/></linearGradient>`;
  svg.appendChild(defs);
  const sweep = el('g', { class: 'sweep' });
  sweep.appendChild(el('path', { d: `M${C} ${C} L${C + 190} ${C} A190 190 0 0 0 ${at(190, -34)[0]} ${at(190, -34)[1]} Z`,
                                 fill: 'url(#sweepG)', stroke: 'none' }));
  svg.appendChild(sweep);

  // connections: centre out to every body, dashes travelling along them
  const link = el('g', { class: 'links' });
  const bodies = [];
  domains.forEach((d, i) => bodies.push({ r: R_DOM, deg: i * (360 / domains.length), label: d[0], kind: 'domain' }));
  products.forEach((p, i) => bodies.push({ r: R_PRD, deg: 40 + i * (360 / products.length), label: p.name, kind: 'product' }));
  bodies.forEach((b, i) => {
    const [x, y] = at(b.r, b.deg);
    link.appendChild(el('line', { x1: C, y1: C, x2: x, y2: y, class: 'wire', style: `--d:${(i * 0.55).toFixed(2)}s` }));
  });
  svg.appendChild(link);

  // the bodies themselves, on two counter-turning rings
  const ringD = el('g', { class: 'ring-d' }), ringP = el('g', { class: 'ring-p' });
  bodies.forEach((b) => {
    const [x, y] = at(b.r, b.deg);
    const g = el('g', { class: 'body ' + b.kind, tabindex: '0', role: 'listitem' });
    g.appendChild(el('circle', { cx: x, cy: y, r: b.kind === 'product' ? 6.5 : 4.6, class: 'dot' }));
    g.appendChild(el('circle', { cx: x, cy: y, r: b.kind === 'product' ? 13 : 10, class: 'halo' }));
    const t = el('title'); t.textContent = b.label; g.appendChild(t);
    g.dataset.label = b.label;
    (b.kind === 'product' ? ringP : ringD).appendChild(g);
  });
  svg.appendChild(ringD); svg.appendChild(ringP);

  // centre
  svg.appendChild(el('circle', { cx: C, cy: C, r: 21, class: 'core-ring' }));
  svg.appendChild(el('circle', { cx: C, cy: C, r: 9.5, class: 'core' }));

  host.appendChild(svg);

  // naming: hovering a body writes its name under the figure
  const cap = document.createElement('div');
  cap.className = 'orrery-cap';
  cap.textContent = '';
  host.appendChild(cap);
  const name = (e) => {
    const b = e.target.closest('.body');
    cap.textContent = b ? b.dataset.label : '';
    cap.classList.toggle('on', !!b);
    svg.classList.toggle('naming', !!b);
  };
  svg.addEventListener('mouseover', name);
  svg.addEventListener('mouseout', (e) => { if (!e.relatedTarget?.closest?.('.body')) name({ target: svg }); });
  svg.addEventListener('focusin', name);
}
