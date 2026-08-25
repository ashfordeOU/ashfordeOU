// Brand faces, subset to the glyphs these cards use and inlined as data URIs.
// SVGs loaded via <img> cannot fetch external fonts — embedding is the only way
// to keep EB Garamond, and it matches ashforde.org's own no-third-party-requests rule.
import fs from 'node:fs';

const b64 = (f) => fs.readFileSync(`fonts/${f}`).toString('base64');
const face = (fam, weight, style, file) =>
  `@font-face{font-family:'${fam}';font-weight:${weight};font-style:${style};` +
  `src:url(data:font/woff2;base64,${b64(file)}) format('woff2');}`;

export const EBG_400 = () => face('EBG', 400, 'normal', 'eb-garamond-400-normal-latin.sub.woff2');
export const EBG_600 = () => face('EBG', 600, 'normal', 'eb-garamond-600-normal-latin.sub.woff2');
export const EBG_ITA = () => face('EBG', 400, 'italic', 'eb-garamond-400-italic-latin.sub.woff2');
export const TIRO    = () => face('Tiro', 400, 'normal', 'tiro.sub.woff2');

/** Always ship a real fallback stack — the embed can still fail to decode. */
export const SERIF = `EBG,'EB Garamond',Georgia,'Iowan Old Style',Palatino,serif`;
export const DEVA  = `Tiro,'Tiro Devanagari Sanskrit','Noto Serif Devanagari',serif`;
export const MONO  = `ui-monospace,SFMono-Regular,Menlo,Consolas,monospace`;
