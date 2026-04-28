'use strict';

import { RenderContract } from '../../render-contract.js';
import { Primitives as P } from '../../primitives.js';
import { drawArrow } from '../../structure.js';

class ParsovalRenderer extends RenderContract {
  getPadding() {
    return 32;
  }

  getVerticalPadding() {
    return 120; // Espace pour titre + annotations
  }

  calculateScale(availW, availH) {
    // Pour le diagramme commutatif
    return Math.min(availW, availH) / 200; // facteur empirique
  }

  getFormula() {
    return 'le diagramme commute  ⟹  a² + b² = c²';
  }

  drawGeometry(layout) {
    const { x, y, w, h } = this.rect;
    const { a, b, c } = this.tri;
    const { sc } = layout;
    const p = this.ctx.p;

    const cx = x + w / 2;
    const cy = y + h / 2;

    // En-têtes
    P.text(
      this.ctx,
      'Parseval — diagramme commutatif',
      x + 32,
      y + 12,
      { size: 13, color: this.color, align: [p.LEFT, p.TOP] }
    );
    P.text(
      this.ctx,
      'frame orthonormal {e₁, e₂}  ·  Gram = I',
      x + 32,
      y + 30,
      { size: 10, color: '#6B7280', align: [p.LEFT, p.TOP] }
    );

    // Nœuds du diagramme — positions dynamiques basées sur a, b, c
    const nodeR = Math.min(w, h) * 0.07;
    const scale = Math.min((w - 128) / (a + b), (h - 150) / (a + b)) * 0.4;
    const minSpacing = 50; // Distance minimale pour éviter superposition
    const dx = Math.max(b * scale, minSpacing);
    const dy = Math.max(a * scale, minSpacing);

    const TL = {
      x: cx - dx,
      y: cy - dy,
      label: '(a, b)',
      sub: 'ℓ²',
      val: '(' + a.toFixed(2) + ', ' + b.toFixed(2) + ')',
    };
    const TR = {
      x: cx + dx,
      y: cy - dy,
      label: 'v',
      sub: 'E',
      val: 'a·e₁ + b·e₂',
    };
    const BL = {
      x: cx - dx,
      y: cy + dy,
      label: 'a²+b²',
      sub: 'ℝ',
      val: (a * a + b * b).toFixed(3),
    };
    const BR = {
      x: cx + dx,
      y: cy + dy,
      label: 'c²',
      sub: 'ℝ',
      val: (c * c).toFixed(3),
    };

    // Flèches
    drawArrow(
      this.ctx,
      TL.x + nodeR,
      TL.y,
      TR.x - nodeR,
      TR.y,
      this.color,
      2.5,
      'Synthétiser',
      'top'
    );
    drawArrow(
      this.ctx,
      TR.x,
      TR.y + nodeR,
      BR.x,
      BR.y - nodeR,
      this.color,
      2.5,
      'Normer + ²',
      'right'
    );
    drawArrow(
      this.ctx,
      TL.x,
      TL.y + nodeR,
      BL.x,
      BL.y - nodeR,
      this.color,
      2.5,
      'Analyser + Σ²',
      'left'
    );

    // Ligne de commutativité
    P.setStroke(this.ctx, this.color, 3);
    P.line(this.ctx, BL.x + nodeR + 2, BL.y - 3, BR.x - nodeR - 2, BR.y - 3);
    P.line(this.ctx, BL.x + nodeR + 2, BL.y + 3, BR.x - nodeR - 2, BR.y + 3);
    P.text(this.ctx, 'PARSEVAL', (BL.x + BR.x) / 2, BL.y - 8, {
      size: 11,
      color: this.color,
      align: [p.CENTER, p.BOTTOM],
    });

    // Nœuds
    [TL, TR, BL, BR].forEach((n) => {
      P.circle(this.ctx, n.x, n.y, nodeR * 2.4, {
        fill: P.tint(this.color, '20'),
      });
      P.circle(this.ctx, n.x, n.y, nodeR * 2, {
        stroke: this.color,
        fill: '#fff',
        weight: 2,
      });
      P.text(this.ctx, n.label, n.x, n.y - 6, {
        size: 13,
        color: this.color,
        align: [p.CENTER, p.CENTER],
      });
      P.text(this.ctx, n.sub, n.x, n.y + 8, {
        size: 9,
        color: P.tint(this.color, '99'),
        align: [p.CENTER, p.CENTER],
      });
      P.text(this.ctx, n.val, n.x, n.y + nodeR + 6, {
        size: 10,
        color: '#4B5563',
        align: [p.CENTER, p.TOP],
      });
    });
  }
}

export function draw(ctx, rect, tri, color) {
  const renderer = new ParsovalRenderer(ctx, rect, tri, color);
  renderer.draw();
}
