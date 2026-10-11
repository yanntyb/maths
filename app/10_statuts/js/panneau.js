'use strict';

import { STATUTS } from './statut-style.js';

/**
 * panneau.js — panneau latéral d'une case : la preuve Lean (superflu) ou le contre-modèle
 * (essentiel), sa source, et les définitions et lemmes locaux qu'il utilise.
 * Fermeture par × ou Échap ; le focus revient à la case qui l'a ouvert.
 */

const EXPLICATIONS = {
  superflu: 'Preuve Lean qui se passe de cet axiome.',
  essentiel: 'Contre-modèle : tous les autres axiomes tiennent, la conclusion est fausse.',
};

function el(balise, classe, texte) {
  const n = document.createElement(balise);
  if (classe) n.className = classe;
  if (texte !== undefined) n.textContent = texte;
  return n;
}

export function creerPanneau(racine) {
  let declencheur = null;

  function fermer() {
    if (racine.hidden) return;
    racine.hidden = true;
    racine.innerHTML = '';
    if (declencheur && document.contains(declencheur)) declencheur.focus();
    declencheur = null;
  }

  function ouvrir(preuve, enonce, bouton) {
    declencheur = bouton ?? null;
    racine.innerHTML = '';
    const fermerBtn = el('button', 'fermer', '×');
    fermerBtn.type = 'button';
    fermerBtn.setAttribute('aria-label', 'Fermer');
    fermerBtn.addEventListener('click', fermer);
    const st = STATUTS[preuve.statut] ?? STATUTS.inconnu;
    const lieu = preuve.fichier
      ? `lean/${preuve.fichier}, lignes ${preuve.lignes[0]}–${preuve.lignes[1]}`
      : 'déclaration locale';
    racine.append(
      fermerBtn,
      el('span', `case ${st.classe}`, st.mot),
      el('h2', null, `${enonce.id} sans ${preuve.retires.join(' + ')}`),
      el('p', 'theoreme', preuve.theoreme),
      el('p', 'explication', EXPLICATIONS[preuve.statut] ?? ''),
      el('p', 'lieu', lieu),
      el('pre', 'source', preuve.source),
    );
    for (const d of preuve.definitions) {
      const details = el('details');
      details.open = true;
      details.append(el('summary', null, d.nom), el('pre', null, d.source));
      racine.append(details);
    }
    racine.hidden = false;
    fermerBtn.focus();
  }

  document.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') fermer(); });
  return { ouvrir, fermer, estOuvert: () => !racine.hidden };
}
