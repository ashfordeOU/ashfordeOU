// ── The Armillary ─────────────────────────────────────────────────────────
// A brass instrument, not a wire diagram. Three things carry that:
//   1. HIERARCHY — a heavy graduated meridian and equator hold lighter orbits.
//   2. LIGHT     — every ring is drawn as short arcs, each shaded by its own
//                  depth, so the near side is bright brass and the far side
//                  falls into shadow. This is what actually sells the volume.
//   3. MARKINGS  — degree graduations on the meridian. Instruments are marked.
// Real 3-space throughout; occlusion comes from depth-sorted draw order.
const NS = 'http://www.w3.org/2000/svg';
const TAU = Math.PI * 2;

const rotX = ([x, y, z], a) => [x, y * Math.cos(a) - z * Math.sin(a), y * Math.sin(a) + z * Math.cos(a)];
const rotY = ([x, y, z], a) => [x * Math.cos(a) + z * Math.sin(a), y, -x * Math.sin(a) + z * Math.cos(a)];
const rotZ = ([x, y, z], a) => [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a), z];
const onRing = (r, t, inc, node) => rotZ(rotX([r * Math.cos(t), r * Math.sin(t), 0], inc), node);

export function armillary(host, { rings, bodies, size = 400 }) {
  const C = size / 2, CAM = size * 3.0, TILT = -0.40;
  const ARCS = 30;                        // arcs per ring — the shading resolution
  const el = (n, a = {}) => {
    const e = document.createElementNS(NS, n);
    for (const [k, v] of Object.entries(a)) e.setAttribute(k, v);
    return e;
  };
  const project = (p) => {
    const k = CAM / (CAM - p[2]);
    return [C + p[0] * k, C + p[1] * k, p[2], k];
  };
  const P = (spec, t, spin) => project(rotX(rotY(onRing(spec.r * C, t, spec.inc, spec.node), spin), TILT));

  const svg = el('svg', { viewBox: `0 0 ${size} ${size}`, class: 'arm',
                          role: 'img', 'aria-label': 'Domains of work and open products, in orbit' });
  svg.appendChild(Object.assign(el('defs'), { innerHTML: `
    <radialGradient id="armGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="var(--goldG)" stop-opacity=".17"/>
      <stop offset=".6" stop-color="var(--goldG)" stop-opacity=".04"/>
      <stop offset="1" stop-color="var(--goldG)" stop-opacity="0"/></radialGradient>
    <radialGradient id="armCore" cx="34%" cy="30%" r="78%">
      <stop offset="0" stop-color="var(--coreHi)"/>
      <stop offset=".62" stop-color="var(--goldG)"/>
      <stop offset="1" stop-color="var(--coreLo)"/></radialGradient>` }));

  svg.appendChild(el('circle', { cx: C, cy: C, r: size * 0.40, fill: 'url(#armGlow)', stroke: 'none' }));

  // engraved bezel — the flat instrument frame that holds the sphere
  const bez = el('g', { class: 'arm-bezel' });
  [0.965, 0.905].forEach((f, i) =>
    bez.appendChild(el('circle', { cx: C, cy: C, r: C * f, 'stroke-opacity': i ? .26 : .45 })));
  for (let i = 0; i < 120; i++) {
    const a = (i / 120) * TAU, big = i % 10 === 0;
    const r1 = C * 0.965, r2 = C * (big ? 0.925 : 0.945);
    bez.appendChild(el('line', {
      x1: C + r1 * Math.cos(a), y1: C + r1 * Math.sin(a),
      x2: C + r2 * Math.cos(a), y2: C + r2 * Math.sin(a),
      'stroke-opacity': big ? .5 : .22, 'stroke-width': big ? 1.3 : .8 }));
  }
  svg.appendChild(bez);

  const back = el('g'), mid = el('g'), front = el('g');
  svg.appendChild(back); svg.appendChild(mid); svg.appendChild(front);

  // one <path> per arc per ring; they are re-shaded and re-parented each frame
  const ringEls = rings.map((spec) => ({
    spec,
    arcs: Array.from({ length: ARCS }, () => ({
      near: el('path', { class: 'arc ' + spec.kind }),
      far:  spec.band ? el('path', { class: 'arc band ' + spec.kind }) : null,
    })),
    ticks: spec.graduated
      ? Array.from({ length: 72 }, () => el('line', { class: 'grad ' + spec.kind }))
      : [],
  }));

  const core = el('g');
  core.appendChild(el('circle', { cx: C, cy: C, r: size * 0.062, fill: 'url(#armCore)', stroke: 'none' }));
  core.appendChild(el('circle', { cx: C, cy: C, r: size * 0.062, class: 'core-rim' }));
  mid.appendChild(core);

  const bodyEls = bodies.map((b) => {
    const g = el('g', { class: 'arm-body ' + b.kind, tabindex: '0' });
    g.appendChild(el('circle', { class: 'halo' }));
    g.appendChild(el('circle', { class: 'dot' }));
    const t = el('title'); t.textContent = b.label; g.appendChild(t);
    g.dataset.label = b.label;
    return { spec: b, g, dot: g.children[1], halo: g.children[0] };
  });

  host.appendChild(svg);

  // ── frame ───────────────────────────────────────────────────────────────
  function draw(spin) {
    for (const { spec, arcs, ticks } of ringEls) {
      for (let a = 0; a < ARCS; a++) {
        const t0 = (a / ARCS) * TAU, t1 = ((a + 1) / ARCS) * TAU;
        const pts = [], mids = [];
        for (let i = 0; i <= 4; i++) {
          const t = t0 + (t1 - t0) * (i / 4);
          const p = P(spec, t, spin);
          pts.push(p); mids.push(p[2]);
        }
        const z = mids.reduce((s, v) => s + v, 0) / mids.length;
        const lit = 0.5 + 0.5 * (z / (spec.r * C));      // -1 far … +1 near
        const seg = arcs[a];

        const line = (rr) => pts.map((_, i) => {
          const t = t0 + (t1 - t0) * (i / 4);
          const p = project(rotX(rotY(onRing(rr, t, spec.inc, spec.node), spin), TILT));
          return `${p[0].toFixed(1)},${p[1].toFixed(1)}`;
        });

        if (spec.band) {
          const w = spec.band * C;
          const outer = line(spec.r * C + w / 2), inner = line(spec.r * C - w / 2).reverse();
          seg.near.setAttribute('d', `M${outer.join(' L')} L${inner.join(' L')} Z`);
          seg.near.setAttribute('fill-opacity', (0.10 + 0.62 * lit ** 1.6).toFixed(3));
          seg.near.setAttribute('stroke-opacity', (0.10 + 0.55 * lit ** 1.6).toFixed(3));
        } else {
          seg.near.setAttribute('d', 'M' + line(spec.r * C).join(' L'));
          seg.near.setAttribute('stroke-opacity', (0.055 + 0.80 * lit ** 2.1).toFixed(3));
          seg.near.setAttribute('stroke-width', (0.5 + 1.25 * lit ** 2).toFixed(2));
        }
        (z < 0 ? back : front).appendChild(seg.near);
      }

      // graduations ride the ring they belong to
      ticks.forEach((ln, i) => {
        const t = (i / ticks.length) * TAU, big = i % 6 === 0;
        const w = spec.band * C;
        const a1 = project(rotX(rotY(onRing(spec.r * C + w / 2, t, spec.inc, spec.node), spin), TILT));
        const a2 = project(rotX(rotY(onRing(spec.r * C + w / 2 - (big ? w : w * 0.5), t, spec.inc, spec.node), spin), TILT));
        ln.setAttribute('x1', a1[0].toFixed(1)); ln.setAttribute('y1', a1[1].toFixed(1));
        ln.setAttribute('x2', a2[0].toFixed(1)); ln.setAttribute('y2', a2[1].toFixed(1));
        const lit = 0.5 + 0.5 * (a1[2] / (spec.r * C));
        ln.setAttribute('stroke-opacity', (0.05 + 0.55 * lit ** 2.2).toFixed(3));
        (a1[2] < 0 ? back : front).appendChild(ln);
      });
    }

    for (const { spec, g, dot, halo } of bodyEls) {
      const t = spec.phase + spin * spec.rate;
      const [x, y, z, k] = P(spec, t, spin);
      const behind = z < 0;
      for (const e of [dot, halo]) { e.setAttribute('cx', x.toFixed(1)); e.setAttribute('cy', y.toFixed(1)); }
      dot.setAttribute('r',  (spec.size * C * k).toFixed(2));
      halo.setAttribute('r', (spec.size * C * k * 2.3).toFixed(2));
      g.style.opacity = behind ? 0.30 : 1;
      (behind ? back : front).appendChild(g);
    }
    front.appendChild(core);          // the sphere sits above whatever is behind it
    mid.appendChild(core);
  }

  // ── motion ──────────────────────────────────────────────────────────────
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let spin = 0.55, raf = null, last = 0;
  const tick = (ts) => {
    const dt = last ? Math.min(0.05, (ts - last) / 1000) : 0; last = ts;
    spin += dt * 0.068;
    draw(spin);
    raf = requestAnimationFrame(tick);
  };
  const start = () => { if (!raf && !reduced.matches) { last = 0; raf = requestAnimationFrame(tick); } };
  const stop  = () => { if (raf) { cancelAnimationFrame(raf); raf = null; } };
  draw(spin);
  if (!reduced.matches) start();
  reduced.addEventListener?.('change', () => (reduced.matches ? stop() : start()));
  new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { threshold: 0 }).observe(svg);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));

  return { svg };
}
