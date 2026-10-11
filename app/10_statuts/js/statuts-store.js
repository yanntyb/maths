'use strict';

/**
 * statuts-store.js — charge data/statuts.json, produit par `lake exe statuts`.
 * Aucun statut n'est écrit à la main côté appli.
 */

const CLES = ['theoreme', 'cablages'];

export async function chargerStatuts(url = 'data/statuts.json') {
  const reponse = await fetch(url);
  if (!reponse.ok) throw new Error(`statuts.json introuvable (HTTP ${reponse.status})`);
  const donnees = await reponse.json();
  for (const cle of CLES) {
    if (!(cle in donnees)) throw new Error(`statuts.json invalide : clé « ${cle} » absente`);
  }
  return {
    lean: donnees.lean,
    mathlib: donnees.mathlib,
    theoreme: donnees.theoreme,
    cablages: donnees.cablages,
    cablage: (id) => donnees.cablages.find((c) => c.id === id),
  };
}
