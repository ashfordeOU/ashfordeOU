// ── The Armillary, baked to static SVG for the README ─────────────────────
// Same instrument as docs/armillary.js, evaluated once at build time: a
// graduated meridian and equator in brass, five lighter orbit rings inside
// them, every arc shaded by its own depth so the near limb is bright and the
// far limb falls into shadow. A README runs no JavaScript, so the assembly
// cannot turn — but the bodies still orbit for real, walked around their own
// projected ellipses by <animateMotion> and dimmed through the far half.
import { D } from './data.mjs';

const TAU = Math.PI * 2;
const rotX = ([x, y, z], a) => [x, y * Math.cos(a) - z * Math.sin(a), y * Math.sin(a) + z * Math.cos(a)];
const rotZ = ([x, y, z], a) => [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a), z];
const onRing = (r, t, inc, node) => rotZ(rotX([r * Math.cos(t), r * Math.sin(t), 0], inc), node);

export function armillary(cx, cy, size, t) {
  const C = size / 2, CAM = size * 3.0, TILT = -0.40, SPIN = 0.55;
  const ARCS = 30, SEG = 128;
  const P = (r, a, inc, node) => {
    const p = rotX(rotZ(rotX([r * Math.cos(a), r * Math.sin(a), 0], inc), node), TILT);
    const k = CAM / (CAM - p[2]);
    return [cx + p[0] * k, cy + p[1] * k, p[2]];
  };
  const spun = (r, a, inc, node) => P(r, a + SPIN * 0, inc, node + SPIN);

  const rings = [
    { r: .80, inc: Math.PI / 2, node: 0, kind: 'frame', band: .034, grad: true },
    { r: .80, inc: 0,           node: 0, kind: 'frame', band: .026, grad: true },
    ...D.domains.map((_, i) => ({ r: .66 - i * .028, inc: 0.34 + i * 0.44,
                                  node: i * (Math.PI / D.domains.length) + 0.3, kind: 'domain' })),
  ];
  const products = D.products.map((_, i) => ({ r: .40 + i * .062, inc: 0.18 + i * 0.34, node: 0.8 + i * 2.1 }));

  const fmt = (p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`;
  const near = [], far = [];

  for (const s of rings) {
    for (let a = 0; a < ARCS; a++) {
      const t0 = (a / ARCS) * TAU, t1 = ((a + 1) / ARCS) * TAU;
      const line = (rr) => Array.from({ length: 5 }, (_, i) =>
        fmt(spun(rr, t0 + (t1 - t0) * (i / 4), s.inc, s.node)));
      const zs = Array.from({ length: 5 }, (_, i) =>
        spun(s.r * C, t0 + (t1 - t0) * (i / 4), s.inc, s.node)[2]);
      const z = zs.reduce((q, v) => q + v, 0) / 5;
      const lit = 0.5 + 0.5 * (z / (s.r * C));
      let el;
      if (s.band) {
        const w = s.band * C;
        const o = line(s.r * C + w / 2), inn = line(s.r * C - w / 2).reverse();
        el = `<path class="arc frame" d="M${o.join(' L')} L${inn.join(' L')} Z"` +
             ` fill-opacity="${(0.10 + 0.62 * lit ** 1.6).toFixed(3)}"` +
             ` stroke-opacity="${(0.10 + 0.55 * lit ** 1.6).toFixed(3)}"/>`;
      } else {
        el = `<path class="arc" d="M${line(s.r * C).join(' L')}"` +
             ` stroke-opacity="${(0.055 + 0.80 * lit ** 2.1).toFixed(3)}"` +
             ` stroke-width="${(0.5 + 1.25 * lit ** 2).toFixed(2)}"/>`;
      }
      (z < 0 ? far : near).push(el);
    }
    if (!s.grad) continue;
    for (let i = 0; i < 72; i++) {
      const a = (i / 72) * TAU, big = i % 6 === 0, w = s.band * C;
      const a1 = spun(s.r * C + w / 2, a, s.inc, s.node);
      const a2 = spun(s.r * C + w / 2 - (big ? w : w * 0.5), a, s.inc, s.node);
      const lit = 0.5 + 0.5 * (a1[2] / (s.r * C));
      const el = `<line class="grad" x1="${a1[0].toFixed(1)}" y1="${a1[1].toFixed(1)}"` +
                 ` x2="${a2[0].toFixed(1)}" y2="${a2[1].toFixed(1)}"` +
                 ` stroke-opacity="${(0.05 + 0.55 * lit ** 2.2).toFixed(3)}"/>`;
      (a1[2] < 0 ? far : near).push(el);
    }
  }

  // whole rings, hidden, used only as motion paths
  const whole = (s) => 'M' + Array.from({ length: SEG + 1 }, (_, i) =>
    fmt(spun(s.r * C, (i / SEG) * TAU, s.inc, s.node))).join(' L') + ' Z';
  const backSpan = (s) => {
    let first = -1, last = -1;
    for (let i = 0; i <= SEG; i++)
      if (spun(s.r * C, (i / SEG) * TAU, s.inc, s.node)[2] < 0) { if (first < 0) first = i; last = i; }
    return first < 0 ? null : [first / SEG, last / SEG];
  };

  const orbits = [...rings.slice(2), ...products];
  const paths = orbits.map((s, i) => `<path id="ao${i}" d="${whole(s)}" fill="none" stroke="none"/>`).join('');

  const bodies = orbits.map((s, i) => {
    const product = i >= rings.length - 2;
    const span = backSpan(s);
    const rad = (product ? .019 : .0125) * C;
    const dur = product ? 22 + (i - 5) * 4 : 34 + i * 5.5;
    const dim = span ? `<animate attributeName="opacity" dur="${dur}s" repeatCount="indefinite"
        values="1;1;.3;.3;1;1" keyTimes="0;${Math.max(.001, span[0] - .02).toFixed(3)};${span[0].toFixed(3)};${span[1].toFixed(3)};${Math.min(.999, span[1] + .02).toFixed(3)};1"/>` : '';
    return `<g class="arm-body">${dim}
      <circle r="${(rad * 2.3).toFixed(2)}" fill="none" stroke="${t.coreHi}" stroke-opacity=".45"/>
      <circle r="${rad.toFixed(2)}" fill="${product ? t.gold : t.coreHi}"/>
      <animateMotion dur="${dur}s" repeatCount="indefinite" rotate="0"${product ? ' keyPoints="1;0" keyTimes="0;1" calcMode="linear"' : ''}>
        <mpath href="#ao${i}"/></animateMotion></g>`;
  }).join('');

  const bezel = [0.965, 0.905].map((f, i) =>
    `<circle cx="${cx}" cy="${cy}" r="${(C * f).toFixed(1)}" stroke-opacity="${i ? .26 : .45}"/>`).join('') +
    Array.from({ length: 120 }, (_, i) => {
      const a = (i / 120) * TAU, big = i % 10 === 0;
      const r1 = C * .965, r2 = C * (big ? .925 : .945);
      return `<line x1="${(cx + r1 * Math.cos(a)).toFixed(1)}" y1="${(cy + r1 * Math.sin(a)).toFixed(1)}"` +
             ` x2="${(cx + r2 * Math.cos(a)).toFixed(1)}" y2="${(cy + r2 * Math.sin(a)).toFixed(1)}"` +
             ` stroke-opacity="${big ? .5 : .22}" stroke-width="${big ? 1.3 : .8}"/>`;
    }).join('');

  return `
  <g class="arm">
    <circle cx="${cx}" cy="${cy}" r="${(C * .80).toFixed(1)}" fill="url(#armGlow)" stroke="none"/>
    <g class="arm-bezel" stroke="${t.ink3}" fill="none" stroke-width="1">${bezel}</g>
    <g fill="none">${paths}</g>
    <g class="arm-far">${far.join('')}</g>
    <circle cx="${cx}" cy="${cy}" r="${(size * .062).toFixed(1)}" fill="url(#armCore)" stroke="none"/>
    <circle cx="${cx}" cy="${cy}" r="${(size * .062).toFixed(1)}" class="core-rim" fill="none" stroke="${t.coreHi}" stroke-opacity=".55"/>
    <g class="arm-near">${near.join('')}</g>
    ${bodies}
  </g>`;
}

export const armillaryDefs = (t) => `
  <radialGradient id="armGlow" cx="50%" cy="50%" r="50%">
    <stop offset="0" stop-color="${t.goldG}" stop-opacity=".17"/>
    <stop offset=".6" stop-color="${t.goldG}" stop-opacity=".04"/>
    <stop offset="1" stop-color="${t.goldG}" stop-opacity="0"/></radialGradient>
  <radialGradient id="armCore" cx="34%" cy="30%" r="78%">
    <stop offset="0" stop-color="${t.coreHi}"/>
    <stop offset=".62" stop-color="${t.goldG}"/>
    <stop offset="1" stop-color="${t.coreLo}"/></radialGradient>`;

export const armillaryMotion = `
  .arm .arc{fill:none;stroke:var(--gg);stroke-linecap:round}
  .arm .arc.frame{fill:var(--gg);stroke:var(--ch);stroke-width:.6}
  .arm .grad{stroke:var(--ch);stroke-width:.9}
  @media (prefers-reduced-motion:reduce){ .arm-body animateMotion{display:none} }`;
