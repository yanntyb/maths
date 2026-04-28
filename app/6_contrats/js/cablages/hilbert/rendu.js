'use strict';

import { RenderContract } from '../../render-contract.js';
import { Primitives as P } from '../../primitives.js';
import { drawArrow } from '../../structure.js';

class HilbertRenderer extends RenderContract {
  getPadding() {
    return 30;
  }

  getVerticalPadding() {
    return 46; // padTop=16 + padBot=30
  }

  calculateScale(availW, availH) {
    const { a, b } = this.tri;
    return Math.min((availW - 60) * 0.7, availH * 0.7) / Math.max(a, b);
  }

  calculateCenterX(layout) {
    const { x, w } = this.rect;
    const { sc } = layout;
    const { b } = this.tri;
    return x + w / 2 - b * sc / 3;
  }

  calculateCenterY(layout) {
    const { y } = this.rect;
    const { padV, availH, sc } = layout;
    const { a } = this.tri;
    return y + padV + availH / 2 + a * sc / 3;
  }

  getFormula() {
    return '⟨v+w,v+w⟩ = ⟨v,v⟩ + 2⟨v,w⟩ + ⟨w,w⟩  →  ⟨v,w⟩=0';
  }

  drawGeometry(layout) {
    const { x, y, w, h } = this.rect;
    const { a, b, c } = this.tri;
    const { sc, cx, cy } = layout;

    const padTop = 16;

    // Grille de fond
    P.setStroke(this.ctx, 235, 0.5);
    for (let g = -4; g <= 4; g++) {
      P.line(this.ctx, cx + g * sc, y, cx + g * sc, y + h);
      P.line(this.ctx, x, cy + g * sc, x + w, cy + g * sc);
    }

    // Axes principaux
    P.setStroke(this.ctx, 180, 1);
    P.line(this.ctx, x, cy, x + w, cy);
    P.line(this.ctx, cx, y, cx, y + h);

    // Tirets pour le théorème
    P.setStroke(this.ctx, this.color, 1);
    P.setDashedLine(this.ctx, [3, 4]);
    P.line(this.ctx, cx + b * sc, cy, cx + b * sc, cy - a * sc);
    P.line(this.ctx, cx, cy - a * sc, cx + b * sc, cy - a * sc);
    P.clearDashedLine(this.ctx);

    // Vecteurs
    drawArrow(this.ctx, cx, cy, cx + b * sc, cy, this.color, 2.5);
    drawArrow(this.ctx, cx, cy, cx, cy - a * sc, this.color, 2.5);
    drawArrow(this.ctx, cx, cy, cx + b * sc, cy - a * sc, '#0F766E', 2);

    // Petit carré au coin droit
    P.noFill(this.ctx);
    P.box(this.ctx, cx, cy - 10, 10, 10, { stroke: this.color });

    // Annotations
    P.text(this.ctx, 'v  ||v||=' + b.toFixed(1), cx + b * sc / 2, cy + 6, {
      size: 13,
      color: this.color,
      align: [this.ctx.p.CENTER, this.ctx.p.TOP],
    });

    P.text(this.ctx, 'w  ||w||=' + a.toFixed(1), cx - 4, cy - a * sc / 2, {
      size: 13,
      color: this.color,
      align: [this.ctx.p.RIGHT, this.ctx.p.CENTER],
    });

    P.text(
      this.ctx,
      'v+w  ||v+w||=' + c.toFixed(2),
      cx + b * sc * 0.6,
      cy - a * sc * 0.6 - 4,
      {
        size: 13,
        color: '#0F766E',
        align: [this.ctx.p.LEFT, this.ctx.p.BOTTOM],
      }
    );
  }
}

export function draw(ctx, rect, tri, color) {
  const renderer = new HilbertRenderer(ctx, rect, tri, color);
  renderer.draw();
}
