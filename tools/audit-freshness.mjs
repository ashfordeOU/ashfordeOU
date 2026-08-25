#!/usr/bin/env node
// Which figures refresh on their own, and which are editorial? Run this rather
// than trusting anyone's memory. LIVE means it is read from data.json, which the
// nightly workflow rebuilds from the GitHub and arXiv APIs. EDITORIAL means a
// human maintains it, because no API knows it.
import fs from 'node:fs';
import { D } from '../src/data.mjs';

const live = [
  ['Contributions, 12 months', D.contributions.toLocaleString('en-US'), 'GitHub GraphQL'],
  ['— of which private',       D.private.toLocaleString('en-US'),       'GitHub GraphQL'],
  ['Every daily count',        `${D.days.length} days`,                 'GitHub GraphQL'],
  ['Active days / streak / peak', `${D.activeDays} / ${D.streak} / ${D.peakDay}`, 'derived'],
  ['Repositories',             D.repos,                                 'GitHub REST'],
  ['Source under management',  `${D.sourceMB} MB`,                      'GitHub REST'],
  ['Languages + shares',       `${D.langs.length}`,                     'GitHub REST'],
  ['Language badges',          `${Math.min(9, D.langs.length)} rendered`, 'GitHub REST'],
  ['Product versions',         D.liveProducts.map(p => `${p.name} ${p.version ?? '—'}`).join(', '), 'GitHub REST releases'],
  ['Product stars',            D.liveProducts.map(p => `${p.name} ★${p.stars}`).join(', '), 'GitHub REST'],
  ['Preprints',                `${D.papers.length}`,                    'arXiv, by author query'],
  ['Preprint titles/dates',    D.papers[0]?.id ?? '—',                  'arXiv, by author query'],
];

const editorial = [
  ['YANA·Ops marketed ops', String(D.yana.marketed), 'no API knows this — its own conformance ledger does'],
  ['YANA·Ops cross-validated', String(D.yana.crossval), 'same; invariant says 17, not 18'],
  ['YANA·Ops milestones', `${D.yana.next} then ${D.yana.then}`, 'roadmap, not a measurement'],
  ['Grasp: 150 MCP tools / 35 languages', '150 / 35', 'product facts, not repo metadata'],
  ['Domains of work', `${D.domains.length}`, 'positioning, from ashforde.org'],
  ['Commitments', `${D.commitments.length}`, 'positioning, from ashforde.org'],
  ['Product descriptions + facets', `${D.products.length} products`, 'copy'],
  ['Company facts', 'registry, address, founder', 'legal record'],
];

const pad = (s, n) => String(s).padEnd(n);
console.log(`\nFigures on the profile — measured ${D.generatedAt.slice(0, 19).replace('T', ' ')} UTC\n`);
console.log(`  LIVE — rebuilt nightly, no human involved`);
for (const [k, v, src] of live) console.log(`    ${pad(k, 30)} ${pad(v, 34)} ${src}`);
console.log(`\n  EDITORIAL — changes only when someone edits src/data.mjs`);
for (const [k, v, why] of editorial) console.log(`    ${pad(k, 30)} ${pad(v, 34)} ${why}`);

// a typed number that contradicts a measured one is the failure mode worth catching
const md = fs.readFileSync('README.md', 'utf8');
const prose = md.replace(/<picture>[\s\S]*?<\/picture>/g, '');
const bold = [...prose.matchAll(/\*\*(\d[\d,]*)\*\*/g)].map((m) => m[1].replace(/,/g, ''));
const known = new Set([D.yana.marketed, D.yana.crossval, D.yana.next, D.yana.then].map(String));
const unexplained = bold.filter((n) => !known.has(n) && n !== String(D.repos));
console.log(`\n  Numbers typed into the README prose: ${bold.join(', ') || 'none'}`);
console.log(`  ${unexplained.length ? '⚠ UNEXPLAINED: ' + unexplained.join(', ') : '✓ all accounted for'}\n`);
process.exit(unexplained.length ? 1 : 0);
