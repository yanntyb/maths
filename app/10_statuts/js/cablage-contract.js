'use strict';

import { RenderContract } from './render-contract.js';

/**
 * CablageContract — contrat abstrait qui capture la structure commune aux cinq câblages
 *
 * Chaque câblage = metadata (id, couleur, formule, application numérique) + fiche du JSON.
 * La fiche (titre, espace, notes, énoncés, axiomes, statuts) est posée par
 * cablage-registry.js : Lean reste la seule source des axiomes et des statuts.
 *
 * CablageContract hérite de RenderContract pour le pipeline 4-phases.
 */

export class CablageContract extends RenderContract {
  constructor(config) {
    super(null, null, null, null);

    // Metadata du câblage
    this.id = config.id;
    this.title = config.id;   // remplacé par fiche.titre à la fusion
    this.color = config.color;

    // Application numérique
    this.formula = config.formula;
    this.format = config.format;

    // Fiche du JSON (posée par cablage-registry.js)
    this.fiche = null;
  }

  /**
   * Override draw() pour accepter ctx, rect, tri, color en arguments
   * Permet que CablageContract soit un singleton réutilisable
   */
  draw(ctx, rect, tri, color) {
    this.ctx = ctx;
    this.rect = rect;
    this.tri = tri;
    this.color = color;
    super.draw();
  }

  /**
   * Override : utiliser formula du câblage (au lieu de paramètre)
   */
  getFormula() {
    return this.formula;
  }

  /**
   * À surcharger : drawGeometry(layout) pour la géométrie spécifique
   */
  drawGeometry(layout) {
    throw new Error('drawGeometry() doit être implémenté par la classe enfant');
  }
}
