'use strict';

import { P } from './state.js';
import { drawArrow } from './draw-utils.js';

export function drawHilbert(x, y, w, h, a, b, c, color) {
  const padTop = 16, padBot = 30;
  const availH = h - padTop - padBot;
  const sc = Math.min((w - 60) * 0.7, availH * 0.7) / Math.max(a, b);
  const cx = x + w/2 - b*sc/3;
  const cy = y + padTop + availH/2 + a*sc/3;

  P.stroke(235); P.strokeWeight(.5);
  for (let g = -4; g <= 4; g++) {
    P.line(cx + g*sc, y, cx + g*sc, y+h);
    P.line(x, cy + g*sc, x+w, cy + g*sc);
  }

  P.stroke(180); P.strokeWeight(1);
  P.line(x, cy, x+w, cy);
  P.line(cx, y, cx, y+h);

  P.stroke(color); P.strokeWeight(1);
  P.drawingContext.setLineDash([3,4]);
  P.line(cx + b*sc, cy, cx + b*sc, cy - a*sc);
  P.line(cx, cy - a*sc, cx + b*sc, cy - a*sc);
  P.drawingContext.setLineDash([]);

  drawArrow(cx, cy, cx + b*sc, cy, color, 2.5);
  drawArrow(cx, cy, cx, cy - a*sc, color, 2.5);
  drawArrow(cx, cy, cx + b*sc, cy - a*sc, '#0F766E', 2);

  P.noFill(); P.stroke(color); P.strokeWeight(1);
  P.rect(cx, cy - 10, 10, 10);

  P.noStroke();
  P.fill(color); P.textSize(13);
  P.textAlign(P.CENTER, P.TOP);
  P.text('v  ||v||=' + b.toFixed(1), cx + b*sc/2, cy + 6);
  P.textAlign(P.RIGHT, P.CENTER);
  P.text('w  ||w||=' + a.toFixed(1), cx - 4, cy - a*sc/2);
  P.fill('#0F766E'); P.textAlign(P.LEFT, P.BOTTOM);
  P.text('v+w  ||v+w||=' + c.toFixed(2), cx + b*sc*0.6, cy - a*sc*0.6 - 4);

  P.fill(color); P.textSize(13); P.textAlign(P.CENTER, P.TOP);
  P.text('\u27e8v+w,v+w\u27e9 = \u27e8v,v\u27e9 + 2\u27e8v,w\u27e9 + \u27e8w,w\u27e9  \u2192  \u27e8v,w\u27e9=0', x + w/2, y + h - 18);
}
