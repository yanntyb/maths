'use strict';

import { RenderContract } from '../../render-contract.js';
import { Primitives as P } from '../../primitives.js';
import { drawArrow } from '../../structure.js';

class AlgebreRenderer extends RenderContract {
  getPadding() {
    return 32;
  }

  getVerticalPadding() {
    return 120; // Espace pour titre + annotations
  }

  calculateScale(availW, availH) {
    return Math.min(availW, availH) / 280;
  }

  getFormula() {
    return '(a+b)² = a² + 2ab + b²  ⟹  a² + b² = c²';
  }

  drawGeometry(layout) {
    const { x, y, w, h } = this.rect;
    const { a, b, c } = this.tri;
    const p = this.ctx.p;

    // En-têtes
    P.text(
      this.ctx,
      'Algèbre — manipulation d\'identités',
      x + 32,
      y + 12,
      { size: 13, color: this.color, align: [p.LEFT, p.TOP] }
    );
    P.text(
      this.ctx,
      'développer (a+b)²  ·  regrouper  ·  annuler 2ab',
      x + 32,
      y + 30,
      { size: 10, color: '#6B7280', align: [p.LEFT, p.TOP] }
    );

    // Positions verticales pour les étapes
    const y1 = y + 60;
    const y2 = y + 110;
    const y3 = y + 160;
    const y4 = y + h - 70;

    const cx = x + w / 2;

    // Étape 1 : (a+b)²
    P.text(this.ctx, '(a+b)²', cx - 80, y1, {
      size: 14,
      color: this.color,
      align: [p.CENTER, p.CENTER],
    });
    P.text(this.ctx, '= a² + 2ab + b²', cx + 40, y1, {
      size: 13,
      color: '#6B7280',
      align: [p.LEFT, p.CENTER],
    });

    // Flèche
    drawArrow(this.ctx, cx, y1 + 20, cx, y2 - 10, this.color, 1.5);

    // Étape 2 : regrouper
    P.text(this.ctx, 'a² + 2ab + b²', cx - 100, y2, {
      size: 14,
      color: this.color,
      align: [p.CENTER, p.CENTER],
    });
    P.text(this.ctx, '= (a²+b²) + 2ab', cx + 50, y2, {
      size: 13,
      color: '#6B7280',
      align: [p.LEFT, p.CENTER],
    });

    // Flèche
    drawArrow(this.ctx, cx, y2 + 20, cx, y3 - 10, this.color, 1.5);

    // Étape 3 : vérifier identité
    P.text(this.ctx, '(a²+b²) + 2ab', cx - 100, y3, {
      size: 14,
      color: this.color,
      align: [p.CENTER, p.CENTER],
    });
    P.text(this.ctx, '= c² + 2ab', cx + 40, y3, {
      size: 13,
      color: '#6B7280',
      align: [p.LEFT, p.CENTER],
    });

    // Annotation : axiome N1
    P.text(this.ctx, '(par axiome N1)', cx - 100, y3 + 18, {
      size: 9,
      color: '#999',
      align: [p.CENTER, p.CENTER],
    });

    // Flèche
    drawArrow(this.ctx, cx, y3 + 30, cx, y4 - 20, this.color, 1.5);

    // Résultat final
    P.text(this.ctx, 'a² + b² = c²', cx, y4 - 10, {
      size: 16,
      color: this.color,
      align: [p.CENTER, p.CENTER],
      weight: 'bold',
    });
    P.text(this.ctx, '(annuler 2ab via A4)', cx, y4 + 15, {
      size: 10,
      color: '#6B7280',
      align: [p.CENTER, p.TOP],
    });

    // Valeurs numériques en coin
    const a2 = (a * a).toFixed(2);
    const b2 = (b * b).toFixed(2);
    const ab2 = (2 * a * b).toFixed(2);
    const c2 = (c * c).toFixed(2);
    const sum = (a * a + b * b).toFixed(2);

    P.text(
      this.ctx,
      'Valeurs: a²=' + a2 + '  b²=' + b2 + '  2ab=' + ab2 + '  c²=' + c2,
      x + 32,
      y + h - 12,
      { size: 9, color: '#999', align: [p.LEFT, p.TOP] }
    );
  }
}

export function draw(ctx, rect, tri, color) {
  const renderer = new AlgebreRenderer(ctx, rect, tri, color);
  renderer.draw();
}
