'use strict';

import complexe from './cablages/complexe/rendu.js';
import cosinus from './cablages/cosinus/rendu.js';
import groupes from './cablages/groupes/rendu.js';
import scalaire from './cablages/scalaire/rendu.js';
import trigonometrique from './cablages/trigonometrique/rendu.js';

/**
 * cablage-registry.js — fusionne les rendus JS (couleur, formule, application numérique)
 * et les fiches du JSON (titre, axiomes, statuts, notes), par id. Le titre vient du JSON :
 * Lean reste la seule source du contenu.
 *
 * Usage :
 *   const registre = fusionner(await chargerStatuts());
 *   registre.all()          // les cinq câblages, chacun avec .fiche
 *   registre.byId('scalaire')
 *   registre.count()
 */

const RENDUS = [complexe, cosinus, groupes, scalaire, trigonometrique];

export function fusionner(statuts) {
  const sansStatuts = RENDUS.filter((r) => !statuts.cablage(r.id)).map((r) => r.id);
  const sansRendu = statuts.cablages.filter((c) => !RENDUS.some((r) => r.id === c.id)).map((c) => c.id);
  if (sansStatuts.length || sansRendu.length) {
    throw new Error(`câblages incohérents — sans statuts : ${sansStatuts.join(', ') || 'aucun'} ; `
      + `sans rendu : ${sansRendu.join(', ') || 'aucun'}`);
  }
  for (const r of RENDUS) {
    r.fiche = statuts.cablage(r.id);
    r.title = r.fiche.titre;
  }
  return {
    all: () => RENDUS,
    byId: (id) => RENDUS.find((r) => r.id === id),
    count: () => RENDUS.length,
  };
}
