// Chemins d'erreur : JSON absent (404) et page ouverte en file://. Le bandeau doit
// apparaître avec la commande à lancer.
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { V10, FORMATS, echec, ok, ouvrirPage } from './commun.mjs';

const texteBandeau = (page) => page.$eval('#bandeau', (b) => (b.hidden ? '' : b.textContent));

export async function verifierErreurs(navigateur, url) {
  console.log("chemins d'erreur");
  const absent = (req) => (req.url().endsWith('/data/statuts.json')
    ? req.respond({ status: 404, body: '' }) : req.continue());
  const a = await ouvrirPage(navigateur, FORMATS[0], url, absent);
  (await texteBandeau(a.page)).includes('lake exe statuts')
    ? ok('JSON absent : bandeau avec la commande lake exe statuts')
    : echec('JSON absent : pas de bandeau');
  await a.page.close();

  const f = await ouvrirPage(navigateur, FORMATS[0], pathToFileURL(join(V10, 'pythagore.html')).href);
  (await texteBandeau(f.page)).includes('http.server')
    ? ok('file:// : bandeau avec la commande http.server')
    : echec('file:// : pas de bandeau');
  await f.page.close();
}
