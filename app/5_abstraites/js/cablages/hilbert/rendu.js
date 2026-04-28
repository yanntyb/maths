'use strict';

import { Primitives as P } from '../../primitives.js';
import { drawArrow } from '../../structure.js';

export function draw(ctx, rect, tri, color) {
  const p = ctx.p;
  const { x, y, w, h } = rect;
  const { a, b, c } = tri;

  const padTop = 16, padBot = 30;
  const availH = h - padTop - padBot;
  const sc = Math.min((w - 60) * 0.7, availH * 0.7) / Math.max(a, b);
  const cx = x + w / 2 - b * sc / 3;
  const cy = y + padTop + availH / 2 + a * sc / 3;

  P.setStroke(ctx, 235, 0.5);
  for (let g = -4; g <= 4; g++) {
    P.line(ctx, cx + g * sc, y, cx + g * sc, y + h);
    P.line(ctx, x, cy + g * sc, x + w, cy + g * sc);
  }

  P.setStroke(ctx, 180, 1);
  P.line(ctx, x, cy, x + w, cy);
  P.line(ctx, cx, y, cx, y + h);

  P.setStroke(ctx, color, 1);
  P.setDashedLine(ctx, [3, 4]);
  P.line(ctx, cx + b * sc, cy, cx + b * sc, cy - a * sc);
  P.line(ctx, cx, cy - a * sc, cx + b * sc, cy - a * sc);
  P.clearDashedLine(ctx);

  drawArrow(ctx, cx, cy, cx + b * sc, cy, color, 2.5);
  drawArrow(ctx, cx, cy, cx, cy - a * sc, color, 2.5);
  drawArrow(ctx, cx, cy, cx + b * sc, cy - a * sc, '#0F766E', 2);

  P.noFill(ctx);
  P.box(ctx, cx, cy - 10, 10, 10, { stroke: color });

  P.text(ctx, 'v  ||v||=' + b.toFixed(1), cx + b * sc / 2, cy + 6, { size: 13, color, align: [p.CENTER, p.TOP] });
  P.text(ctx, 'w  ||w||=' + a.toFixed(1), cx - 4, cy - a * sc / 2, { size: 13, color, align: [p.RIGHT, p.CENTER] });
  P.text(ctx, 'v+w  ||v+w||=' + c.toFixed(2), cx + b * sc * 0.6, cy - a * sc * 0.6 - 4, { size: 13, color: '#0F766E', align: [p.LEFT, p.BOTTOM] });

  P.text(ctx, '⟨v+w,v+w⟩ = ⟨v,v⟩ + 2⟨v,w⟩ + ⟨w,w⟩  →  ⟨v,w⟩=0', x + w / 2, y + h - 18, { size: 13, color, align: [p.CENTER, p.TOP] });
}
