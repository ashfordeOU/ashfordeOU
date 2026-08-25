#!/usr/bin/env node
// Copy docs/ into the ashforde.org repo as /githubprofile, re-applying the two
// things that make it a subpage rather than a transplant: a canonical URL and a
// link back to the site. Use this instead of rsync — a plain copy silently drops
// both, which is how the live page lost them once already.
import fs from 'node:fs';
import path from 'node:path';

const SRC = 'docs';
const DEST = process.env.SITE_REPO
  ?? '/Users/chak/Documents/Code/Claudecode/ashforde-site/githubprofile';

fs.rmSync(DEST, { recursive: true, force: true });
fs.cpSync(SRC, DEST, { recursive: true });

const p = path.join(DEST, 'index.html');
let s = fs.readFileSync(p, 'utf8');

if (!s.includes('rel="canonical"'))
  s = s.replace('<title>Ashforde — the figures behind the profile</title>',
    '<title>Ashforde — the figures behind the profile</title>\n' +
    '<link rel="canonical" href="https://ashforde.org/githubprofile/">');

if (!s.includes('class="backlink"')) {
  s = s.replace('  <div class="brandrow">',
    '  <a class="backlink" href="/">← ashforde.org</a>\n  <div class="brandrow">');
  s = s.replace('header{padding:56px 0 40px}',
    'header{padding:34px 0 40px}\n' +
    '.backlink{display:inline-block;font-family:var(--mono);font-size:10.5px;letter-spacing:1.8px;\n' +
    '  text-transform:uppercase;color:var(--ink3);text-decoration:none;margin-bottom:22px;\n' +
    '  border-bottom:1px solid transparent;transition:.16s}\n' +
    '.backlink:hover{color:var(--gold);border-bottom-color:var(--gold)}');
}
s = s.replace('<a href="https://ashforde.org">ashforde.org</a>', '<a href="/">ashforde.org</a>');
fs.writeFileSync(p, s);

const missing = ['canonical', 'backlink'].filter((k) => !s.includes(k));
if (missing.length) { console.error('customisations missing:', missing); process.exit(1); }
console.log(`published -> ${DEST}  (canonical + backlink verified)`);
