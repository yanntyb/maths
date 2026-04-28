'use strict';

import { Primitives as P } from '../../primitives.js';

export function draw(ctx, rect, tri, color) {
  const { x, y, w, h } = rect;
  const { a, b, c } = tri;

  const padH = 24;
  const padTop = 16;
  const padBot = 36;
  const availW = w - padH * 2;
  const availH = h - padTop - padBot;
  const sc = Math.min(availW, availH) / (a + b);
  const side = (a + b) * sc;
  const cx = x + (w - side) / 2;
  const cy = y + padTop + (availH - side) / 2;

  P.box(ctx, cx, cy, side, side, { stroke: color, fill: P.tint(color, '10'), weight: 1.5 });

  const aPx = a * sc, bPx = b * sc;

  P.noStroke(ctx);
  P.setFill(ctx, P.tint(color, '50'));
  P.polygon(ctx, [[cx, cy], [cx + bPx, cy], [cx, cy + aPx]]);
  P.polygon(ctx, [[cx + side, cy], [cx + side, cy + bPx], [cx + side - aPx, cy]]);
  P.polygon(ctx, [[cx + side, cy + side], [cx, cy + side], [cx + side, cy + side - aPx]]);
  P.polygon(ctx, [[cx, cy + side], [cx, cy + side - bPx], [cx + aPx, cy + side]]);

  P.box(ctx, cx + bPx, cy, side - bPx, side - bPx, { stroke: color, fill: P.tint(color, '30'), weight: 2 });

  P.text(ctx, 'c² = ' + (c * c).toFixed(1), cx + side / 2, cy + side / 2, { size: 13, color: '#fff', align: [ctx.p.CENTER, ctx.p.CENTER] });

  P.text(ctx, 'b', cx + bPx / 2, cy - 2, { size: 12, color, align: [ctx.p.CENTER, ctx.p.BOTTOM] });
  P.text(ctx, 'a', cx - 2, cy + aPx / 2, { size: 12, color, align: [ctx.p.RIGHT, ctx.p.CENTER] });

  P.text(ctx, '(a+b)² = 4·½ab + c²  →  a² + b² = c²', x + w / 2, y + h - 18, { size: 13, color, align: [ctx.p.CENTER, ctx.p.TOP] });
}
