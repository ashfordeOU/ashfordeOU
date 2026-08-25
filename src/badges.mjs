// Individually linked language badges. One SVG per language so each can be
// wrapped in its own <a> — that is how a README gets real clickable elements;
// a single chart image can only ever carry one link.
import { D, esc } from './data.mjs';
import { EBG_600, MONO } from './fonts.mjs';

const T = {
  light: { bg:'#EFEBE3', line:'rgba(33,33,33,.24)', ink:'#212121', dim:'#645C53', gold:'#9C7C3C' },
  dark:  { bg:'#161E29', line:'rgba(236,230,216,.26)', ink:'#ECE6D8', dim:'#9D937E', gold:'#C7AA66' },
};

// Where a language badge should take you. Official homes — predictable and
// honest; linking to a repo filter would show a visitor almost nothing, since
// 48 of the 50 repositories are private.
export const HOME = {
  Python:'https://www.python.org', TypeScript:'https://www.typescriptlang.org',
  JavaScript:'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
  HTML:'https://developer.mozilla.org/en-US/docs/Web/HTML',
  Rust:'https://www.rust-lang.org', Swift:'https://www.swift.org',
  Kotlin:'https://kotlinlang.org', HCL:'https://developer.hashicorp.com/terraform/language',
  TeX:'https://www.latex-project.org', CSS:'https://developer.mozilla.org/en-US/docs/Web/CSS',
  Shell:'https://www.gnu.org/software/bash/', Java:'https://openjdk.org',
  C:'https://en.cppreference.com/w/c', Go:'https://go.dev', Ruby:'https://www.ruby-lang.org',
};

const CW = 6.62;                       // mono advance at 11px — badge widths must be exact
const badge = (l, mode) => {
  const t = T[mode];
  const name = l.name.toUpperCase(), pct = `${l.pct.toFixed(1)}%`;
  const w = Math.round(14 + 11 + 9 + name.length * CW + 11 + pct.length * CW + 14);
  const H = 34;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${H}" viewBox="0 0 ${w} ${H}" role="img" aria-label="${esc(l.name)} ${pct}">
<defs><style>${EBG_600()}</style></defs>
<rect x=".5" y=".5" width="${w-1}" height="${H-1}" rx="4" fill="${t.bg}" stroke="${t.line}"/>
<rect x="14" y="${H/2-5.5}" width="11" height="11" rx="2" fill="${t.gold}" opacity="${(0.35 + 0.65 * Math.min(1, l.pct / 34)).toFixed(2)}"/>
<text x="34" y="${H/2+4}" font-family="${MONO}" font-size="11" letter-spacing=".6" fill="${t.ink}">${esc(name)}</text>
<text x="${w-14}" y="${H/2+4}" text-anchor="end" font-family="${MONO}" font-size="11" fill="${t.dim}">${pct}</text>
</svg>`;
};

/** Emit one badge per language and return the markdown that links them up. */
export function languageBadges(write, take = 9) {
  return D.langs.slice(0, take).map((l) => {
    const slug = l.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    for (const mode of ['light', 'dark']) write(`lang-${slug}-${mode}`, badge(l, mode));
    const href = HOME[l.name] ?? `https://github.com/search?q=language%3A${encodeURIComponent(l.name)}`;
    return `<a href="${href}" title="${esc(l.name)} — ${l.pct.toFixed(1)}% of ${D.sourceMB} MB across ${D.repos} repositories"><picture><source media="(prefers-color-scheme: dark)" srcset="assets/lang-${slug}-dark.svg"><img alt="${esc(l.name)} ${l.pct.toFixed(1)}%" src="assets/lang-${slug}-light.svg"></picture></a>`;
  }).join('\n');
}
