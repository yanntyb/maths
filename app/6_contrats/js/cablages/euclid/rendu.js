'use strict';

import { RenderContract } from '../../render-contract.js';
import { Primitives as P } from '../../primitives.js';

class EuclidRenderer extends RenderContract {
  getPadding() {
    return 24;
  }

  getVerticalPadding() {
    return 16 + 36; // padTop + padBot
  }

  calculateScale(availW, availH) {
    const { a, b } = this.tri;
    return Math.min(availW, availH) / (a + b);
  }

  calculateCenterX(layout) {
    const { x, w } = this.rect;
    const { sc } = layout;
    const { a, b } = this.tri;
    const side = (a + b) * sc;
    return x + (w - side) / 2;
  }

  calculateCenterY(layout) {
    const { y } = this.rect;
    const { padV, availH, sc } = layout;
    const { a, b } = this.tri;
    const side = (a + b) * sc;
    return y + padV + (availH - side) / 2;
  }

  getFormula() {
    return '(a+b)² = 4·½ab + c²  →  a² + b² = c²';
  }

  drawGeometry(layout) {
    const { x, y, w, h } = this.rect;
    const { a, b, c } = this.tri;
    const { sc, cx, cy } = layout;

    const aPx = a * sc;
    const bPx = b * sc;
    const side = (a + b) * sc;

    // Grand carré (a+b)²
    P.box(this.ctx, cx, cy, side, side, {
      stroke: this.color,
      fill: P.tint(this.color, '10'),
      weight: 1.5,
    });

    // Triangles (4 × ½ab)
    P.noStroke(this.ctx);
    P.setFill(this.ctx, P.tint(this.color, '50'));
    P.polygon(this.ctx, [[cx, cy], [cx + bPx, cy], [cx, cy + aPx]]);
    P.polygon(this.ctx, [[cx + side, cy], [cx + side, cy + bPx], [cx + side - aPx, cy]]);
    P.polygon(this.ctx, [[cx + side, cy + side], [cx, cy + side], [cx + side, cy + side - aPx]]);
    P.polygon(this.ctx, [[cx, cy + side], [cx, cy + side - bPx], [cx + aPx, cy + side]]);

    // Carré central c²
    P.box(this.ctx, cx + bPx, cy, side - bPx, side - bPx, {
      stroke: this.color,
      fill: P.tint(this.color, '30'),
      weight: 2,
    });

    // Annotations géométriques
    P.text(this.ctx, 'c² = ' + (c * c).toFixed(1), cx + side / 2, cy + side / 2, {
      size: 13,
      color: '#fff',
      align: [this.ctx.p.CENTER, this.ctx.p.CENTER],
    });

    P.text(this.ctx, 'b', cx + bPx / 2, cy - 2, {
      size: 12,
      color: this.color,
      align: [this.ctx.p.CENTER, this.ctx.p.BOTTOM],
    });

    P.text(this.ctx, 'a', cx - 2, cy + aPx / 2, {
      size: 12,
      color: this.color,
      align: [this.ctx.p.RIGHT, this.ctx.p.CENTER],
    });
  }
}

export function draw(ctx, rect, tri, color) {
  const renderer = new EuclidRenderer(ctx, rect, tri, color);
  renderer.draw();
}
