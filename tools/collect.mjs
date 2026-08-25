#!/usr/bin/env node
// Gathers every figure the profile shows, from live sources, into data.json.
// Runs in CI on a schedule — nothing here needs a human.
//   GitHub GraphQL : contribution calendar + public/private split
//   GitHub REST    : repositories, language bytes (private included), releases
//   arXiv API      : preprints, discovered BY AUTHOR so new ones appear on their own
import fs from 'node:fs';

const USER  = process.env.PROFILE_USER  || 'ashfordeOU';
const TOKEN = process.env.GITHUB_TOKEN;
if (!TOKEN) { console.error('GITHUB_TOKEN required'); process.exit(1); }

const gh = async (path) => {
  const r = await fetch(`https://api.github.com/${path}`, {
    headers: { Authorization: `Bearer ${TOKEN}`, Accept: 'application/vnd.github+json' },
  });
  if (!r.ok) throw new Error(`GET ${path} -> ${r.status}`);
  return r.json();
};

const graphql = async (query) => {
  const r = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });
  const j = await r.json();
  if (j.errors) throw new Error(JSON.stringify(j.errors));
  return j.data;
};

// ── contributions ─────────────────────────────────────────────────────────
const cg = await graphql(`{ user(login:"${USER}") { createdAt
  contributionsCollection {
    totalCommitContributions totalPullRequestContributions
    totalIssueContributions restrictedContributionsCount
    contributionCalendar { totalContributions weeks { contributionDays { date contributionCount } } }
  } } }`);
const cc   = cg.user.contributionsCollection;
const cal  = cc.contributionCalendar;
const days = cal.weeks.flatMap(w => w.contributionDays);

let streak = 0, best = 0, active = 0;
for (const d of days) {
  if (d.contributionCount > 0) { streak++; active++; best = Math.max(best, streak); }
  else streak = 0;
}

// ── repositories + language mass (private counted, never named) ────────────
const repos = [];
for (let page = 1; ; page++) {
  const batch = await gh(`user/repos?per_page=100&affiliation=owner&page=${page}`);
  repos.push(...batch);
  if (batch.length < 100) break;
}
const owned = repos.filter(r => !r.fork);

const langTotals = {};
for (const r of owned) {
  try {
    const l = await gh(`repos/${r.full_name}/languages`);
    for (const [k, v] of Object.entries(l)) langTotals[k] = (langTotals[k] || 0) + v;
  } catch { /* a repo that vanishes mid-run must not fail the build */ }
}
const totalBytes = Object.values(langTotals).reduce((a, b) => a + b, 0);
const langs = Object.entries(langTotals)
  .sort((a, b) => b[1] - a[1])
  .map(([name, bytes]) => ({ name, bytes, pct: (100 * bytes) / totalBytes }));

// ── public products, with their real latest tag ───────────────────────────
// the profile repo itself is public but is not a product
const publicRepos = owned.filter(r => !r.private && r.name !== USER);
const products = [];
for (const r of publicRepos) {
  let ver = null;
  try { ver = (await gh(`repos/${r.full_name}/releases/latest`)).tag_name; } catch { /* no release yet */ }
  products.push({ name: r.name, desc: r.description, stars: r.stargazers_count,
                  forks: r.forks_count, lang: r.language, license: r.license?.spdx_id ?? null,
                  homepage: r.homepage || null, version: ver });
}

// ── arXiv, discovered by author so a new preprint needs no edit here ──────
let papers = [];
try {
  const q = encodeURIComponent(`au:"${process.env.PROFILE_AUTHOR || 'Chakshu Baweja'}"`);
  const xml = await (await fetch(
    `https://export.arxiv.org/api/query?search_query=${q}&max_results=60&sortBy=submittedDate&sortOrder=descending`
  )).text();
  papers = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map(([, e]) => {
    const pick = (t) => (e.match(new RegExp(`<${t}>([\\s\\S]*?)</${t}>`)) || [, ''])[1]
      .replace(/\s+/g, ' ').trim();
    return {
      id:    pick('id').split('/abs/')[1] ?? '',
      title: pick('title'),
      date:  pick('published').slice(0, 10),
      cat:   (e.match(/primary_category[^>]*term="([^"]+)"/) || [, ''])[1],
    };
  }).filter(p => p.id);
} catch (e) { console.error('arXiv lookup failed, keeping previous list:', e.message); }

// arXiv can be flaky; never let a bad fetch silently erase the research section
if (!papers.length && fs.existsSync('data.json'))
  papers = JSON.parse(fs.readFileSync('data.json', 'utf8')).papers ?? [];

const out = {
  generatedAt: new Date().toISOString(),
  user: USER,
  createdAt: cg.user.createdAt,
  contributions: cal.totalContributions,
  private: cc.restrictedContributionsCount,
  public: cal.totalContributions - cc.restrictedContributionsCount,
  commits: cc.totalCommitContributions,
  prs: cc.totalPullRequestContributions,
  activeDays: active,
  spanDays: days.length,
  streak: best,
  peakDay: Math.max(...days.map(d => d.contributionCount)),
  repos: owned.length,
  publicRepos: publicRepos.length,
  sourceMB: +(totalBytes / 1e6).toFixed(1),
  languages: langs.length,
  langs,
  days,
  products,
  papers,
};
fs.writeFileSync('data.json', JSON.stringify(out, null, 2));
console.log(`data.json — ${out.contributions.toLocaleString()} contributions · ${out.repos} repos · ` +
            `${out.sourceMB} MB · ${out.papers.length} papers · ${out.products.length} public products`);
