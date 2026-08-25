// The Ashforde seal, used verbatim from the brand vectors shipped with
// ashforde.org. It is a commissioned mark — inline it, never redraw or
// approximate it. seal-light is for light grounds, seal-dark for dark.
import fs from 'node:fs';

const load = (name) => {
  const raw = fs.readFileSync(`brand/${name}.svg`, 'utf8');
  const inner = raw.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
  const vb = raw.match(/viewBox="0 0 (\d+(?:\.\d+)?) /);
  return { inner, unit: vb ? +vb[1] : 512 };
};

const SEAL = { light: load('seal-light'), dark: load('seal-dark') };

/** Place the seal at (x,y) with edge length `size`, in the variant for `mode`. */
export function mark(x, y, size, mode = 'light', spin = null) {
  const s = SEAL[mode] ?? SEAL.light;
  let inner = s.inner;
  if (spin) {                       // class the first two <g> — spokes, then rosette
    let seen = 0;
    inner = inner.replace(/<g\b/g, (m) => (seen < spin.length ? `${m} class="${spin[seen++]}"` : m));
  }
  return `<g transform="translate(${x},${y}) scale(${(size / s.unit).toFixed(6)})">${inner}</g>`;
}

export const MARK = { navy:'#1b2742', goldLight:'#9c7c3c', goldDark:'#c7aa66', cream:'#ece6d8' };
