'use strict';

/**
 * RenderContract — contrat abstrait qui capture la structure commune aux 4 rendus
 *
 * 4 phases invariantes :
 * 1. Parse input (constructeur)
 * 2. Calculate layout (calculateLayout + hooks polymorphes)
 * 3. Draw geometry (abstract drawGeometry, spécifique à chaque câblage)
 * 4. Draw annotation (commune, héritée)
 *
 * Template method pattern : draw() orchestre les phases.
 */

import { Primitives as P } from './primitives.js';

export class RenderContract {
  constructor(ctx, rect, tri, color) {
    this.ctx = ctx;
    this.rect = rect;
    this.tri = tri;
    this.color = color;
  }

  // ===== Phase 1 : Parse (déjà fait par constructeur) =====

  // ===== Phase 2 : Calculate Layout (avec hooks polymorphes) =====

  /**
   * À surcharger : padding horizontal (espaces gauche/droite)
   */
  getPadding() {
    return 24;
  }

  /**
   * À surcharger : padding vertical (espaces haut/bas)
   */
  getVerticalPadding() {
    return 40;
  }

  /**
   * À surcharger : calcul du facteur d'échelle
   */
  calculateScale(availW, availH) {
    const { a, b } = this.tri;
    return Math.min(availW, availH) / Math.max(a, b);
  }

  /**
   * À surcharger : calcul du centre X
   * Par défaut : centre du rectangle
   */
  calculateCenterX(layout) {
    const { x, w } = this.rect;
    return x + w / 2;
  }

  /**
   * À surcharger : calcul du centre Y
   * Par défaut : centre de l'espace disponible
   */
  calculateCenterY(layout) {
    const { y } = this.rect;
    const { padV, availH } = layout;
    return y + padV + availH / 2;
  }

  /**
   * À surcharger : formule d'annotation finale
   */
  getFormula() {
    return 'a² + b² = c²';
  }

  /**
   * Orchestration de layout — appelée une fois par draw()
   */
  calculateLayout() {
    const { x, y, w, h } = this.rect;
    const { a, b, c } = this.tri;

    const padH = this.getPadding();
    const padV = this.getVerticalPadding();
    const availW = w - padH * 2;
    const availH = h - padV * 2;

    const sc = this.calculateScale(availW, availH);

    // Créer un layout temporaire pour les hooks
    const tempLayout = { padH, padV, availW, availH, sc };

    const cx = this.calculateCenterX(tempLayout);
    const cy = this.calculateCenterY(tempLayout);

    return { padH, padV, availW, availH, sc, cx, cy };
  }

  // ===== Phase 3 : Draw Geometry (polymorphe, abstract) =====

  /**
   * À implémenter par chaque classe enfant.
   * Reçoit le layout et les paramètres du rendu.
   */
  drawGeometry(layout) {
    throw new Error('drawGeometry() doit être implémenté par la classe enfant');
  }

  // ===== Phase 4 : Draw Annotation (commune) =====

  /**
   * Annotation finale (formule). Identique pour tous les rendus.
   */
  drawAnnotation(formula, layout) {
    const { x, y, w, h } = this.rect;
    const p = this.ctx.p;
    P.text(this.ctx, formula, x + w / 2, y + h - 16, {
      size: 13,
      color: this.color,
      align: [p.CENTER, p.BOTTOM],
    });
  }

  // ===== Orchestration (Template Method) =====

  /**
   * Exécute le pipeline complet : layout → geometry → annotation
   */
  draw() {
    const layout = this.calculateLayout();
    this.drawGeometry(layout);
    this.drawAnnotation(this.getFormula(), layout);
  }
}
