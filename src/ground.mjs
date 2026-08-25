// ── The ground ────────────────────────────────────────────────────────────
// A README is a stack of separate images with GitHub's own background showing
// between them. To make that stack read as ONE page, every card draws a slice
// of the SAME engraved chart: one enormous astrolabe laid out over the whole
// column, each card rendering only the part that falls within its own band.
// Because the geometry is continuous across the seams, the eye joins them up.
const TAU = Math.PI * 2;

/**
 * @param w      card width
 * @param h      card height
 * @param offset this card's top edge, in virtual-page coordinates
 * @param total  height of the whole card stack
 */
export function ground(w, h, offset, total, t) {
  const cx = w * 0.5;
  const cy = total * 0.34 - offset;       // one centre for the entire column
  const R = Math.max(w, total) * 0.46;
  const near = (r) => Math.abs(cy) < h + r * 1.15;   // skip rings this card cannot see

  const ring = (f, op, extra = '') =>
    near(R * f) ? `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${(R * f).toFixed(1)}" stroke-opacity="${op}"${extra}/>` : '';

  const spokes = Array.from({ length: 24 }, (_, i) => {
    const a = (i / 24) * TAU;
    const r1 = R * 0.83, r2 = R;
    const y1 = cy + r1 * Math.sin(a), y2 = cy + r2 * Math.sin(a);
    if (Math.min(y1, y2) > h + 40 || Math.max(y1, y2) < -40) return '';
    return `<line x1="${(cx + r1 * Math.cos(a)).toFixed(1)}" y1="${y1.toFixed(1)}" x2="${(cx + r2 * Math.cos(a)).toFixed(1)}" y2="${y2.toFixed(1)}" stroke-opacity="${i % 6 ? .42 : .8}"/>`;
  }).join('');

  const chords = Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * TAU, b = ((i + 5) / 12) * TAU, r = R * 0.53;
    const y1 = cy + r * Math.sin(a), y2 = cy + r * Math.sin(b);
    if (Math.min(y1, y2) > h + 40 || Math.max(y1, y2) < -40) return '';
    return `<line x1="${(cx + r * Math.cos(a)).toFixed(1)}" y1="${y1.toFixed(1)}" x2="${(cx + r * Math.cos(b)).toFixed(1)}" y2="${y2.toFixed(1)}" stroke-opacity=".5"/>`;
  }).join('');

  const body = ring(1, '.55') + ring(.935, '.34') +
    ring(.967, '.5', ` stroke-width="${(R * .043).toFixed(1)}" stroke-dasharray="${(R * .011).toFixed(1)} ${(R * .114).toFixed(1)}"`) +
    ring(.80, '.5') + ring(.66, '.45') + ring(.53, '.62') +
    ring(.38, '.5', ' stroke-dasharray="2 10"') + ring(.24, '.45') +
    spokes + chords;

  if (!body.trim()) return '';
  return `<g class="ground" stroke="${t.ink}" fill="none" stroke-width="1" opacity="${t.groundOp}">${body}</g>`;
}
