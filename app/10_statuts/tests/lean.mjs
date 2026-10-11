// Option --lean : relance l'export et compare octet par octet avec data/statuts.json
// (fraîcheur et déterminisme). Demande Lean (~/.elan) et le cache mathlib.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir, homedir } from 'node:os';
import { execFileSync } from 'node:child_process';
import { LEAN, STATUTS_JSON, echec, ok } from './commun.mjs';

export function verifierFraicheur() {
  console.log('fraîcheur (--lean)');
  const sortie = join(tmpdir(), `statuts-${process.pid}.json`);
  const env = { ...process.env, PATH: `${join(homedir(), '.elan/bin')}:${process.env.PATH}` };
  execFileSync('lake', ['build'], { cwd: LEAN, env, stdio: 'inherit' });
  execFileSync('lake', ['exe', 'statuts', sortie], { cwd: LEAN, env, stdio: 'inherit' });
  readFileSync(sortie).equals(readFileSync(STATUTS_JSON))
    ? ok('data/statuts.json identique à un export frais')
    : echec("data/statuts.json diffère d'un export frais : relancer lake exe statuts");
}
