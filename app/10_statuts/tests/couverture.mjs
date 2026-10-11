// Couverture : chaque code des tableaux « Axiomes mobilises » des docs apparaît dans le
// JSON (axiome ou note), et inversement, avec la même nature.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { DOCS, echec, ok } from './commun.mjs';

const LIGNE = /^\| ([A-Z]\d) \| .* \| (structurel|numerique) \|\s*$/gm;

export function verifierCouverture(statuts) {
  console.log('couverture des docs');
  let ecarts = 0;
  const signaler = (msg) => { ecarts++; echec(msg); };
  for (const c of statuts.cablages) {
    const md = readFileSync(join(DOCS, `${c.id}.md`), 'utf8');
    const section = md.split(/^## /m).find((s) => s.startsWith('Axiomes mobilises')) ?? '';
    const docs = new Map([...section.matchAll(LIGNE)].map((m) => [m[1], m[2]]));
    const json = new Map();
    for (const e of c.enonces) for (const a of e.axiomes) json.set(a.code, a.nature);
    for (const n of c.notes) json.set(n.code, n.nature);
    for (const [code, nature] of docs) {
      if (!json.has(code)) signaler(`${c.id} : code ${code} des docs absent du JSON`);
      else if (json.get(code) !== nature) signaler(`${c.id} : ${code} ${json.get(code)} dans le JSON, ${nature} dans les docs`);
    }
    for (const code of json.keys()) if (!docs.has(code)) signaler(`${c.id} : code ${code} du JSON absent des docs`);
  }
  if (!ecarts) ok('chaque code README est couvert, natures concordantes');
}
