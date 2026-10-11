// Oracle : data/statuts.json doit donner exactement les statuts de attendu.json
// (recopiés à la main depuis le tableau de lean/README.md).
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ICI, echec, ok, cleRetrait } from './commun.mjs';

export function verifierOracle(statuts) {
  console.log('oracle');
  const attendu = JSON.parse(readFileSync(join(ICI, 'attendu.json'), 'utf8'));
  const obtenu = {};
  for (const c of statuts.cablages) {
    for (const e of c.enonces) {
      const m = (obtenu[`${c.id}.${e.id}`] = {});
      for (const s of e.statuts) m[cleRetrait(s.retires)] = s.statut;
      for (const n of e.nonTestes) m[n] = 'non testé';
    }
  }
  let ecarts = 0;
  for (const k of [...new Set([...Object.keys(attendu), ...Object.keys(obtenu)])].sort()) {
    const a = attendu[k] ?? {};
    const o = obtenu[k] ?? {};
    for (const r of new Set([...Object.keys(a), ...Object.keys(o)])) {
      if (a[r] !== o[r]) { ecarts++; echec(`${k} sans ${r} : attendu ${a[r] ?? 'rien'}, obtenu ${o[r] ?? 'rien'}`); }
    }
  }
  if (!ecarts) ok(`${Object.keys(obtenu).length} énoncés conformes à attendu.json`);
}
