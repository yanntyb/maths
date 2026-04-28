'use strict';

import { drawArrow } from './structure.js';

export function drawHilbert(ctx, rect, tri, color) {
  const p = ctx.p;
  const { x, y, w, h } = rect;
  const { a, b, c } = tri;

  const padTop = 16, padBot = 30;
  const availH = h - padTop - padBot;
  const sc = Math.min((w - 60) * 0.7, availH * 0.7) / Math.max(a, b);
  const cx = x + w / 2 - b * sc / 3;
  const cy = y + padTop + availH / 2 + a * sc / 3;

  p.stroke(235); p.strokeWeight(.5);
  for (let g = -4; g <= 4; g++) {
    p.line(cx + g * sc, y, cx + g * sc, y + h);
    p.line(x, cy + g * sc, x + w, cy + g * sc);
  }

  p.stroke(180); p.strokeWeight(1);
  p.line(x, cy, x + w, cy);
  p.line(cx, y, cx, y + h);

  p.stroke(color); p.strokeWeight(1);
  p.drawingContext.setLineDash([3, 4]);
  p.line(cx + b * sc, cy, cx + b * sc, cy - a * sc);
  p.line(cx, cy - a * sc, cx + b * sc, cy - a * sc);
  p.drawingContext.setLineDash([]);

  drawArrow(ctx, cx, cy, cx + b * sc, cy, color, 2.5);
  drawArrow(ctx, cx, cy, cx, cy - a * sc, color, 2.5);
  drawArrow(ctx, cx, cy, cx + b * sc, cy - a * sc, '#0F766E', 2);

  p.noFill(); p.stroke(color); p.strokeWeight(1);
  p.rect(cx, cy - 10, 10, 10);

  p.noStroke();
  p.fill(color); p.textSize(13);
  p.textAlign(p.CENTER, p.TOP);
  p.text('v  ||v||=' + b.toFixed(1), cx + b * sc / 2, cy + 6);
  p.textAlign(p.RIGHT, p.CENTER);
  p.text('w  ||w||=' + a.toFixed(1), cx - 4, cy - a * sc / 2);
  p.fill('#0F766E'); p.textAlign(p.LEFT, p.BOTTOM);
  p.text('v+w  ||v+w||=' + c.toFixed(2), cx + b * sc * 0.6, cy - a * sc * 0.6 - 4);

  p.fill(color); p.textSize(13); p.textAlign(p.CENTER, p.TOP);
  p.text('\u27e8v+w,v+w\u27e9 = \u27e8v,v\u27e9 + 2\u27e8v,w\u27e9 + \u27e8w,w\u27e9  \u2192  \u27e8v,w\u27e9=0', x + w / 2, y + h - 18);
}
