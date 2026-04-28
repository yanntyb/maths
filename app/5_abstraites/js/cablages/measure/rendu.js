'use strict';

import { Primitives as P } from '../../primitives.js';

export function draw(ctx, rect, tri, color) {
  const p = ctx.p;
  const { x, y, w, h } = rect;
  const { a, b, c } = tri;

  const padH = 32;
  const opSpace = 36;
  const availW = w - padH * 2 - opSpace * 2;
  const availH = h - 80;

  const sc = Math.min(availW / (a + b + c), availH / c);

  const aPx = a * sc, bPx = b * sc, cPx = c * sc;
  const totalW = aPx + bPx + cPx + opSpace * 2;
  const baseY = y + h - 50;
  let xc = x + (w - totalW) / 2;

  P.box(ctx, xc, baseY - aPx, aPx, aPx, { stroke: color, fill: P.tint(color, '40'), weight: 1.5 });
  P.text(ctx, 'a²', xc + aPx / 2, baseY - aPx / 2 - 7, { size: Math.min(13, aPx * 0.18), color, align: [p.CENTER, p.CENTER] });
  P.text(ctx, (a * a).toFixed(2), xc + aPx / 2, baseY - aPx / 2 + 7, { size: Math.min(13, aPx * 0.18), color, align: [p.CENTER, p.CENTER] });

  xc += aPx;
  P.text(ctx, '+', xc + opSpace / 2, baseY - aPx / 2, { size: 20, color: '#475569', align: [p.CENTER, p.CENTER] });

  xc += opSpace;
  P.box(ctx, xc, baseY - bPx, bPx, bPx, { stroke: color, fill: P.tint(color, '40'), weight: 1.5 });
  P.text(ctx, 'b²', xc + bPx / 2, baseY - bPx / 2 - 7, { size: Math.min(13, bPx * 0.18), color, align: [p.CENTER, p.CENTER] });
  P.text(ctx, (b * b).toFixed(2), xc + bPx / 2, baseY - bPx / 2 + 7, { size: Math.min(13, bPx * 0.18), color, align: [p.CENTER, p.CENTER] });

  xc += bPx;
  P.text(ctx, '=', xc + opSpace / 2, baseY - aPx / 2, { size: 20, color: '#475569', align: [p.CENTER, p.CENTER] });

  xc += opSpace;
  P.box(ctx, xc, baseY - cPx, cPx, cPx, { stroke: color, fill: P.tint(color, '60'), weight: 1.5 });
  P.text(ctx, 'c²', xc + cPx / 2, baseY - cPx / 2 - 8, { size: Math.min(13, cPx * 0.15), color: '#fff', align: [p.CENTER, p.CENTER] });
  P.text(ctx, (c * c).toFixed(2), xc + cPx / 2, baseY - cPx / 2 + 8, { size: Math.min(13, cPx * 0.15), color: '#fff', align: [p.CENTER, p.CENTER] });

  P.text(ctx, 'μ(a²) + μ(b²) = μ(c²)  par σ-additivité', x + w / 2, y + h - 12, { size: 12, color, align: [p.CENTER, p.BOTTOM] });
}
