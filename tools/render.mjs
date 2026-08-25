#!/usr/bin/env node
// data.json -> every SVG (light + dark) + README.md. Pure render, no network.
//
// On interactivity: a GitHub README runs no JavaScript, and an SVG loaded through
// <img> has its internal <a> elements disabled. So the interactive surface a README
// can actually offer is: per-element links, native title tooltips, <details>
// disclosure, and CSS animation inside the SVG. Anything beyond that — hover
// readouts on data points, filtering, zoom — lives on the companion page in docs/.
import fs from 'node:fs';
import { readmes } from '../src/readmes.mjs';
import * as E from '../src/dirE.mjs';
import { languageBadges } from '../src/badges.mjs';

const mod = { E }[process.env.PROFILE_DIRECTION || 'E'];
fs.mkdirSync('assets', { recursive: true });

let n = 0;
const write = (name, svg) => { fs.writeFileSync(`assets/${name}.svg`, svg); n++; };

// The cards share one continuous engraved ground, so each needs to know where
// it sits in the column. Measure the stack first, then render it for real.
const ORDER = ['hero', 'domains', 'project-yana', 'project-kshana', 'project-grasp',
               'stack', 'activity', 'standing', 'research', 'commitments'];
const GAP = 16;                                     // GitHub's margin between images
// read the ROOT <svg> height — the first height= in the file may be a cell rect
const rootH = (svg) => Math.round(+svg.match(/<svg\b[^>]*?\sheight="([\d.]+)"/)[1]);
const heights = Object.fromEntries(ORDER.map((k) => [k, rootH(mod.cards[k]('light'))]));
const total = ORDER.reduce((s, k) => s + heights[k] + GAP, 0);
let y = 0;
const slices = {};
for (const k of ORDER) { slices[k] = { offset: y, total }; y += heights[k] + GAP; }

for (const mode of ['light', 'dark'])
  for (const [name, fn] of Object.entries(mod.cards)) write(`${name}-${mode}`, fn(mode, slices[name]));

const badges = languageBadges(write);

/** A themed card. `href` makes the whole card a link; `title` gives it a tooltip. */
const card = (name, href, title) => {
  const img = `<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/${name}-dark.svg">
  <img alt="${title || name}"${title ? ` title="${title}"` : ''} src="assets/${name}-light.svg" width="880">
</picture>`;
  return href ? `<a href="${href}">\n${img}\n</a>` : img;
};

// Where each card points, and what its tooltip says.
const LINKS = {
  hero:        ['https://ashforde.org', 'Ashforde OÜ — for the missions that cannot fail'],
  domains:     ['https://ashforde.org/#domains', 'Five domains of work'],
  stack:       ['#working-languages', 'Source mass by language across all repositories'],
  activity:    ['https://github.com/ashfordeOU', 'Every contributing day, counted'],
  standing:    [null, 'Contributions, source under management, and published research'],
  research:    ['https://arxiv.org/a/baweja_c_1', 'Preprints on arXiv'],
  commitments: ['https://ashforde.org/#approach', 'Four commitments that hold across everything'],
  'project-yana':   ['https://yanaops.com', 'YANA·Ops — pre-release, not on any package registry'],
  'project-kshana': ['https://kshana.dev', 'Kshana — reproducible PNT simulator'],
  'project-grasp':  ['https://ashfordeou.github.io/grasp', 'Grasp — code-architecture intelligence'],
};

const readme = readmes.E
  .replace(/^%%([A-Z-]+)%%$/gm, (_, k) => {
    const key = k.toLowerCase();
    const [href, title] = LINKS[key] ?? [null, null];
    return card(key, href, title);
  })
  .replace('%%LANGUAGE_BADGES%%', badges);

fs.writeFileSync('README.md', readme.replace(/<!--[\s\S]*?-->\n/, '') + '\n');
console.log(`${n} SVGs + README.md rendered`);
