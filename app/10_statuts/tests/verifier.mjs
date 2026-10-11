// Vérifie V10 : statuts.json contre l'oracle, couverture des docs, page dans Chrome sans
// fenêtre (bandeaux d'erreur, matrice, panneau, vues).
// Usage : node verifier.mjs [--lean]
import { lireStatuts, demarrerServeur, lancerNavigateur, nbEchecs } from './commun.mjs';
import { verifierOracle } from './oracle.mjs';
import { verifierCouverture } from './couverture.mjs';
import { verifierErreurs } from './erreurs.mjs';
import { verifierNavigateur } from './navigateur.mjs';
import { verifierVues } from './vues.mjs';
import { verifierFraicheur } from './lean.mjs';

const statuts = lireStatuts();
verifierOracle(statuts);
verifierCouverture(statuts);

const serveur = await demarrerServeur();
const navigateur = await lancerNavigateur();
try {
  await verifierErreurs(navigateur, serveur.url);
  await verifierNavigateur(navigateur, serveur.url, statuts);
  await verifierVues(navigateur, serveur.url);
} finally {
  await navigateur.close();
  serveur.fermer();
}
if (process.argv.includes('--lean')) verifierFraicheur();

console.log(nbEchecs() ? `${nbEchecs()} échec(s)` : 'tout est vert');
process.exit(nbEchecs() ? 1 : 0);
