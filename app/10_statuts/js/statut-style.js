'use strict';

/**
 * statut-style.js — vocabulaire des statuts de dérivabilité : mots, classes CSS, styles
 * canvas. Le même pour la matrice (DOM) et pour les vues (canvas).
 */

export const STATUTS = {
  essentiel: { mot: 'essentiel', classe: 'st-essentiel' },
  superflu: { mot: 'superflu', classe: 'st-superflu' },
  nonTeste: { mot: 'non testé', classe: 'st-non-teste' },
  absent: { mot: '—', classe: 'st-absent' },
  inconnu: { mot: '?', classe: 'st-inconnu' },
};

/** Clé canonique d'un retrait : noms triés, joints par « + ». */
export const cleRetrait = (retires) => [...retires].sort().join('+');

/**
 * Statut d'un retrait dans un énoncé du JSON.
 * Retourne { cle, preuve } : `cle` est une clé de STATUTS, `preuve` l'objet statut du
 * JSON (théorème, source…) ou null.
 */
export function statutDe(enonce, retires) {
  const cle = cleRetrait(retires);
  const preuve = enonce.statuts.find((s) => cleRetrait(s.retires) === cle);
  if (preuve) {
    if (preuve.statut === 'essentiel' || preuve.statut === 'superflu') return { cle: preuve.statut, preuve };
    console.error(`statut inconnu « ${preuve.statut} » pour ${preuve.theoreme}`);
    return { cle: 'inconnu', preuve: null };
  }
  // Tous les axiomes retirés figurent dans l'énoncé, aucun théorème : non testé (retraits
  // groupés compris) ; sinon le retrait n'a pas de sens pour cet énoncé.
  if (retires.every((n) => enonce.axiomes.some((a) => a.nom === n))) return { cle: 'nonTeste', preuve: null };
  return { cle: 'absent', preuve: null };
}

/** Style canvas d'un nœud ou d'une arête selon le statut. */
export function styleCanvas(cle, couleur) {
  switch (cle) {
    case 'essentiel': return { trait: couleur, epaisseur: 3, pointille: [], fond: couleur, texte: '#fff' };
    case 'superflu': return { trait: couleur + '99', epaisseur: 1.5, pointille: [4, 4], fond: '#fff', texte: couleur };
    default: return { trait: '#9CA3AF', epaisseur: 1, pointille: [2, 4], fond: '#F3F4F6', texte: '#6B7280' };
  }
}
