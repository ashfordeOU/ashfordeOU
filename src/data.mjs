// Real figures. Every number here came from a live GitHub API query on 2026-08-25.
import fs from 'node:fs';

// Everything measurable comes from data.json, written by tools/collect.mjs in CI.
// Nothing below is typed by hand except the editorial copy.
const L = JSON.parse(fs.readFileSync('data.json', 'utf8'));
const days = L.days;

export const D = {
  org:        'ASHFORDE',
  tm:         '™',                 // EUIPO-pending -> TM, never (R)
  legal:      'Ashforde OÜ',
  registry:   '17321180',          // Estonian Commercial Register
  seat:       'Tallinn, Estonia',
  ops:        'Frankfurt, Germany',
  founder:    'Chakshu Baweja',
  mail:       'contact@ashforde.org',
  site:       'ashforde.org',

  // Verbatim from ashforde.org / llms.txt — the canonical public voice.
  tagline:    'For the missions that cannot fail.',
  premise:    'The most consequential decisions are moving to machines. Most machines cannot be trusted with them.',
  standfirst: 'Sovereign, high-assurance systems for the decisions that cannot be wrong \u2014 in space, in law, in finance, and across the regulated enterprise.',
  motto:      { dev: '\u092f\u0924\u094b \u0927\u0930\u094d\u092e\u0938\u094d\u0924\u0924\u094b \u091c\u092f\u0903',
                lat: 'Yato dharmas tato jaya\u1e25',
                en:  'Where there is dharma, there is victory' },

  domains: [
    ['Space & Mission Operations', 'Decision support for the people who fly spacecraft, and the MBSE that gets them there \u2014 always under human command.'],
    ['Orbital Awareness',          'Orbit determination, conjunction assessment, and the situational picture that keeps assets safe in a crowded sky.'],
    ['Legal Intelligence',         'Agentic reasoning over the law, held to a standard of evidence, citation and traceability practice can defend.'],
    ['Financial Intelligence',     'Reasoning over capital, risk and compliance, where every output must be explainable and defensible to a regulator.'],
    ['Governance & Regulated Enterprise', 'Assurance for decisions institutions must stand behind \u2014 auditable, traceable, accountable by design.'],
  ],

  commitments: [
    ['Sovereign by design',      'Deployable entirely within your borders and control, up to and including fully air-gapped.'],
    ['Assurance you can examine','Every consequential output evaluated, recorded, and open to audit.'],
    ['Agentic, yet accountable', 'Autonomy bounded by design; command unambiguously human.'],
    ['Built to a standard',      'The rigour of the space sector, applied everywhere else.'],
  ],

  contributions: L.contributions,
  private: L.private,
  public: L.public,
  commits: L.commits,
  prs: L.prs,
  activeDays: L.activeDays,
  spanDays: L.spanDays,
  peakDay: L.peakDay,
  streak: L.streak,
  repos: L.repos,
  publicRepos: L.publicRepos,
  sourceMB: L.sourceMB,
  languages: L.languages,

  days,
  // The activity view starts here. The 130 days before it carry ONE contribution
  // between them — the account predates the work — so the window loses nothing and
  // stops five empty months reading as missing data.
  windowFrom: '2026-01-01',
  windowDays: L.days.filter(d => d.date >= '2026-01-01'),
  createdAt: L.createdAt,
  firstDay:  L.days.find(d => d.contributionCount > 0)?.date ?? null,
  langs: L.langs,
  papers: L.papers,
  liveProducts: L.products,
  generatedAt: L.generatedAt,

  // Editorial copy; live figures (stars, version) are merged from data.json at render.
  products: [
    { key:'yana', name:'YANA·Ops', repo:null, site:'yanaops.com', href:'https://yanaops.com',
      status:'PRE-RELEASE', statusNote:'Not on npm, PyPI or crates',
      one:'Open, vendor-neutral standard for spacecraft mission operations',
      long:'Deterministic and air-gap-ready, with a conformance suite, an MCP server, a CLI and language SDKs. Published to be implemented by anyone, incumbents included.',
      facets:['Conformance suite','CCSDS / PUS','ECSS-aligned','MCP server','No hidden egress'],
      figures:[['Marketed operations','7'],['Cross-validated','17'],['Next milestone','50']],
      license:'Open standard' },

    { key:'kshana', name:'Kshana', repo:'kshana', site:'kshana.dev', href:'https://kshana.dev',
      status:'RELEASED', statusNote:null,
      one:'Reproducible positioning, navigation and timing simulator',
      long:'Orbit determination, clock modelling, INS, GNSS integrity and cislunar navigation. Every headline figure regenerates from a committed scenario and seed.',
      facets:['Rust lib + CLI','Python','WASM','MCP server','JetBrains plugin'],
      figures:[['Preprints citing it','5'],['License','AGPL-3.0']],
      license:'AGPL-3.0' },

    { key:'grasp', name:'Grasp', repo:'grasp', site:'ashfordeou.github.io/grasp',
      href:'https://ashfordeou.github.io/grasp',
      status:'RELEASED', statusNote:null,
      one:'Code-architecture intelligence across 35 languages',
      long:'Dependency graphs, security scanning, a multimodal knowledge graph and git change-impact analysis. No data leaves the machine.',
      facets:['150 MCP tools','VS Code','JetBrains','GitHub Action','Browser extension'],
      figures:[['MCP tools','150'],['Languages','35']],
      license:'Source-available' },
  ],

  yana: { status:'Public preview', marketed:7, crossval:17, next:50, then:150,
          note:'Not yet published to any package registry.' },

  now: [
    ['Publishing the operations standard', 'Taking YANA·Ops from public preview to a first tagged release, conformance suite included.'],
    ['Extending validated coverage',        'Cross-validation from 17 operations toward 50, each differenced against an independent implementation.'],
    ['Writing the methods down',            'Preprints first, so results can be reproduced and contested before they are relied on.'],
    ['Talking to operators',                'Conversations with the people who fly spacecraft and the institutions that must answer for the decisions.'],
  ],
};

// ---- shared helpers -------------------------------------------------------
export const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const nfmt = (n) => n.toLocaleString('en-US');

/** Bucket the 367-day calendar into `n` columns of summed contributions. */
export function buckets(n) {
  const out = new Array(n).fill(0);
  const per = days.length / n;
  days.forEach((d, i) => { out[Math.min(n - 1, Math.floor(i / per))] += d.contributionCount; });
  return out;
}

/** Weeks as 7-day columns, oldest first — for a classic density grid. */
export function weekGrid() {
  const w = [];
  for (let i = 0; i < days.length; i += 7) w.push(days.slice(i, i + 7));
  return w;
}
