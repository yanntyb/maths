'use strict';

import { RenderContract } from './render-contract.js';

/**
 * CablageContract — contrat abstrait qui capture la structure commune aux 6 cablages
 *
 * Chaque cablage = axiomes + metadata + rendu (drawGeometry)
 *
 * CablageContract hérite de RenderContract pour le pipeline 4-phases
 * et ajoute l'orchestration de la metadata + axiomes.
 */

export class CablageContract extends RenderContract {
  constructor(config) {
    super(null, null, null, null);

    // Metadata du cablage
    this.id = config.id;
    this.title = config.title;
    this.color = config.color;

    // Données mathématiques
    this.axioms = config.axioms;
    this.formula = config.formula;
    this.proof = config.proof;
    this.format = config.format;
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
   * Override : utiliser formula du cablage (au lieu de paramètre)
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
