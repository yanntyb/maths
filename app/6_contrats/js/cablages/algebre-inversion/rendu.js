'use strict';

import { RenderContract } from '../../render-contract.js';
import { Primitives as P } from '../../primitives.js';
import { drawArrow } from '../../structure.js';

class AlgebreInversionRenderer extends RenderContract {
  getPadding() {
    return 48;
  }

  getVerticalPadding() {
    return 120;
  }

  calculateScale(availW, availH) {
    return 1;
  }

  getFormula() {
    return 'c = √(a² + b²)';
  }

  drawGeometry(layout) {
    const { x, y, w, h } = this.rect;
    const { a, b, c } = this.tri;
    const p = this.ctx.p;

    // En-têtes
    P.text(
      this.ctx,
      'Algèbre-Inversion — transformation par currying',
      x + 32,
      y + 12,
      { size: 13, color: this.color, align: [p.LEFT, p.TOP] }
    );
    P.text(
      this.ctx,
      'Contrat: (a, b) ∈ ℝ₊²  →  c ∈ ℝ₊  (fixer a, b pour calculer c)',
      x + 32,
      y + 30,
      { size: 10, color: '#6B7280', align: [p.LEFT, p.TOP] }
    );

    // Layout vertical — un bloc par ligne pour la clarté
    const blockY1 = y + 75;
    const blockY2 = y + 150;
    const blockY3 = y + 225;
    const blockY4 = y + h - 80;

    const cx = x + w / 2;
    const nodeR = 24;

    // --- Étape 1: Entrées (a, b) ---
    const inputY = blockY1;
    const inputSpacing = 100;
    const ax = cx - inputSpacing / 2;
    const bx = cx + inputSpacing / 2;

    // Nœud a
    P.circle(this.ctx, ax, inputY, nodeR * 2.6, {
      fill: P.tint(this.color, '20'),
    });
    P.circle(this.ctx, ax, inputY, nodeR * 2, {
      stroke: this.color,
      fill: '#fff',
      weight: 3,
    });
    P.text(this.ctx, 'a', ax, inputY - 12, {
      size: 18,
      color: this.color,
      align: [p.CENTER, p.CENTER],
    });
    P.text(this.ctx, a.toFixed(1), ax, inputY + 14, {
      size: 12,
      color: '#666',
      align: [p.CENTER, p.TOP],
    });

    // Nœud b
    P.circle(this.ctx, bx, inputY, nodeR * 2.6, {
      fill: P.tint(this.color, '20'),
    });
    P.circle(this.ctx, bx, inputY, nodeR * 2, {
      stroke: this.color,
      fill: '#fff',
      weight: 3,
    });
    P.text(this.ctx, 'b', bx, inputY - 12, {
      size: 18,
      color: this.color,
      align: [p.CENTER, p.CENTER],
    });
    P.text(this.ctx, b.toFixed(1), bx, inputY + 14, {
      size: 12,
      color: '#666',
      align: [p.CENTER, p.TOP],
    });

    // --- Étape 2: Pondérer ---
    const pond_y = blockY2;
    const boxW = 90;
    const boxH = 55;

    P.box(this.ctx, cx - boxW / 2, pond_y, boxW, boxH, {
      stroke: this.color,
      fill: P.tint(this.color, '12'),
      weight: 2.5,
    });
    P.text(this.ctx, 'Pondérer', cx, pond_y + 10, {
      size: 12,
      color: this.color,
      align: [p.CENTER, p.CENTER],
    });
    P.text(this.ctx, '(carré)', cx, pond_y + 25, {
      size: 11,
      color: '#999',
      align: [p.CENTER, p.CENTER],
    });

    // Valeurs après Pondérer
    const a2 = (a * a).toFixed(1);
    const b2 = (b * b).toFixed(1);
    P.text(this.ctx, 'a² = ' + a2, cx - 35, pond_y + 42, {
      size: 10,
      color: this.color,
      align: [p.LEFT, p.CENTER],
    });
    P.text(this.ctx, 'b² = ' + b2, cx + 35, pond_y + 42, {
      size: 10,
      color: this.color,
      align: [p.RIGHT, p.CENTER],
    });

    // Flèches a,b → Pondérer
    drawArrow(this.ctx, ax, inputY + nodeR * 2 + 5, cx - 25, pond_y - 2, this.color, 2);
    drawArrow(this.ctx, bx, inputY + nodeR * 2 + 5, cx + 25, pond_y - 2, this.color, 2);

    // --- Étape 3: Additionner ---
    const add_y = blockY3;

    P.box(this.ctx, cx - boxW / 2, add_y, boxW, boxH, {
      stroke: this.color,
      fill: P.tint(this.color, '12'),
      weight: 2.5,
    });
    P.text(this.ctx, 'Additionner', cx, add_y + 10, {
      size: 12,
      color: this.color,
      align: [p.CENTER, p.CENTER],
    });
    P.text(this.ctx, 'a² + b²', cx, add_y + 25, {
      size: 11,
      color: '#999',
      align: [p.CENTER, p.CENTER],
    });

    // Valeur après Additionner
    const sum = (a * a + b * b).toFixed(1);
    P.text(this.ctx, '= ' + sum, cx, add_y + 42, {
      size: 11,
      color: this.color,
      align: [p.CENTER, p.CENTER],
    });

    // Flèche Pondérer → Additionner
    drawArrow(this.ctx, cx, pond_y + boxH + 2, cx, add_y - 2, this.color, 2);

    // --- Étape 4: Inverser (racine) + Résultat ---
    const inv_y = blockY4 - 40;

    P.box(this.ctx, cx - boxW / 2, inv_y, boxW, boxH, {
      stroke: this.color,
      fill: P.tint(this.color, '12'),
      weight: 2.5,
    });
    P.text(this.ctx, 'Inverser', cx, inv_y + 10, {
      size: 12,
      color: this.color,
      align: [p.CENTER, p.CENTER],
    });
    P.text(this.ctx, '(racine)', cx, inv_y + 25, {
      size: 11,
      color: '#999',
      align: [p.CENTER, p.CENTER],
    });

    // Valeur après Inverser
    const computed = Math.sqrt(a * a + b * b).toFixed(1);
    P.text(this.ctx, 'c = ' + computed, cx, inv_y + 42, {
      size: 11,
      color: this.color,
      align: [p.CENTER, p.CENTER],
    });

    // Flèche Additionner → Inverser
    drawArrow(this.ctx, cx, add_y + boxH + 2, cx, inv_y - 2, this.color, 2);

    // --- Résultat final ---
    const resultY = blockY4 + 5;
    P.text(this.ctx, 'Résultat  :  c = √(' + a.toFixed(1) + '² + ' + b.toFixed(1) + '²) = ' + c.toFixed(1), cx, resultY, {
      size: 12,
      color: this.color,
      align: [p.CENTER, p.CENTER],
    });
  }
}

export function draw(ctx, rect, tri, color) {
  const renderer = new AlgebreInversionRenderer(ctx, rect, tri, color);
  renderer.draw();
}
