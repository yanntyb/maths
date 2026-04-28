'use strict';

import { RenderContract } from '../../render-contract.js';
import { Primitives as P } from '../../primitives.js';

class MeasureRenderer extends RenderContract {
  getPadding() {
    return 32;
  }

  getVerticalPadding() {
    return 80;
  }

  calculateScale(availW, availH) {
    const { a, b, c } = this.tri;
    const opSpace = 36;
    return Math.min(availW / (a + b + c + opSpace * 2), availH / c);
  }

  calculateCenterX(layout) {
    const { x, w } = this.rect;
    const { sc } = layout;
    const { a, b, c } = this.tri;
    const opSpace = 36;
    const aPx = a * sc;
    const bPx = b * sc;
    const cPx = c * sc;
    const totalW = aPx + bPx + cPx + opSpace * 2;
    return x + (w - totalW) / 2;
  }

  getFormula() {
    return 'μ(a²) + μ(b²) = μ(c²)  par σ-additivité';
  }

  drawGeometry(layout) {
    const { x, y, w, h } = this.rect;
    const { a, b, c } = this.tri;

    const opSpace = 36;
    const padH = this.getPadding();
    const availW = w - padH * 2 - opSpace * 2;
    const sc = Math.min(availW / (a + b + c), (h - 80) / c);

    const aPx = a * sc;
    const bPx = b * sc;
    const cPx = c * sc;
    const totalW = aPx + bPx + cPx + opSpace * 2;
    const baseY = y + h - 50;
    const p = this.ctx.p;

    let xc = x + (w - totalW) / 2;

    // Carré a²
    P.box(this.ctx, xc, baseY - aPx, aPx, aPx, {
      stroke: this.color,
      fill: P.tint(this.color, '40'),
      weight: 1.5,
    });
    P.text(this.ctx, 'a²', xc + aPx / 2, baseY - aPx / 2 - 7, {
      size: Math.min(13, aPx * 0.18),
      color: this.color,
      align: [p.CENTER, p.CENTER],
    });
    P.text(this.ctx, (a * a).toFixed(2), xc + aPx / 2, baseY - aPx / 2 + 7, {
      size: Math.min(13, aPx * 0.18),
      color: this.color,
      align: [p.CENTER, p.CENTER],
    });

    // Opérateur +
    xc += aPx;
    P.text(this.ctx, '+', xc + opSpace / 2, baseY - aPx / 2, {
      size: 20,
      color: '#475569',
      align: [p.CENTER, p.CENTER],
    });

    // Carré b²
    xc += opSpace;
    P.box(this.ctx, xc, baseY - bPx, bPx, bPx, {
      stroke: this.color,
      fill: P.tint(this.color, '40'),
      weight: 1.5,
    });
    P.text(this.ctx, 'b²', xc + bPx / 2, baseY - bPx / 2 - 7, {
      size: Math.min(13, bPx * 0.18),
      color: this.color,
      align: [p.CENTER, p.CENTER],
    });
    P.text(this.ctx, (b * b).toFixed(2), xc + bPx / 2, baseY - bPx / 2 + 7, {
      size: Math.min(13, bPx * 0.18),
      color: this.color,
      align: [p.CENTER, p.CENTER],
    });

    // Opérateur =
    xc += bPx;
    P.text(this.ctx, '=', xc + opSpace / 2, baseY - aPx / 2, {
      size: 20,
      color: '#475569',
      align: [p.CENTER, p.CENTER],
    });

    // Carré c²
    xc += opSpace;
    P.box(this.ctx, xc, baseY - cPx, cPx, cPx, {
      stroke: this.color,
      fill: P.tint(this.color, '60'),
      weight: 1.5,
    });
    P.text(this.ctx, 'c²', xc + cPx / 2, baseY - cPx / 2 - 8, {
      size: Math.min(13, cPx * 0.15),
      color: '#fff',
      align: [p.CENTER, p.CENTER],
    });
    P.text(this.ctx, (c * c).toFixed(2), xc + cPx / 2, baseY - cPx / 2 + 8, {
      size: Math.min(13, cPx * 0.15),
      color: '#fff',
      align: [p.CENTER, p.CENTER],
    });
  }
}

export function draw(ctx, rect, tri, color) {
  const renderer = new MeasureRenderer(ctx, rect, tri, color);
  renderer.draw();
}
