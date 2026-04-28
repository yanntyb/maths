'use strict';

import { P } from './state.js';

export function drawEuclid(x, y, w, h, a, b, c, color) {
  const padH = 24;
  const padTop = 16;
  const padBot = 36;
  const availW = w - padH * 2;
  const availH = h - padTop - padBot;
  const sc = Math.min(availW, availH) / (a + b);
  const side = (a + b) * sc;
  const cx = x + (w - side) / 2;
  const cy = y + padTop + (availH - side) / 2;

  P.stroke(color); P.strokeWeight(1.5);
  P.fill(color + '10');
  P.rect(cx, cy, side, side);

  const aPx = a * sc, bPx = b * sc;

  P.noStroke();
  P.fill(color + '50');
  P.beginShape();
  P.vertex(cx, cy);
  P.vertex(cx + bPx, cy);
  P.vertex(cx, cy + aPx);
  P.endShape(P.CLOSE);
  P.beginShape();
  P.vertex(cx + side, cy);
  P.vertex(cx + side, cy + bPx);
  P.vertex(cx + side - aPx, cy);
  P.endShape(P.CLOSE);
  P.beginShape();
  P.vertex(cx + side, cy + side);
  P.vertex(cx, cy + side);
  P.vertex(cx + side, cy + side - aPx);
  P.endShape(P.CLOSE);
  P.beginShape();
  P.vertex(cx, cy + side);
  P.vertex(cx, cy + side - bPx);
  P.vertex(cx + aPx, cy + side);
  P.endShape(P.CLOSE);

  P.stroke(color); P.strokeWeight(2);
  P.fill(color + '30');
  P.beginShape();
  P.vertex(cx + bPx, cy);
  P.vertex(cx + side, cy + bPx);
  P.vertex(cx + side - bPx, cy + side);
  P.vertex(cx, cy + side - bPx);
  P.endShape(P.CLOSE);

  P.noStroke();
  P.fill('#fff'); P.textSize(13); P.textAlign(P.CENTER, P.CENTER);
  P.text('c\u00b2 = ' + (c*c).toFixed(1), cx + side/2, cy + side/2);

  P.fill(color); P.textSize(12);
  P.textAlign(P.CENTER, P.BOTTOM);
  P.text('b', cx + bPx/2, cy - 2);
  P.textAlign(P.RIGHT, P.CENTER);
  P.text('a', cx - 2, cy + aPx/2);

  P.fill(color); P.textSize(13); P.textAlign(P.CENTER, P.TOP);
  P.text('(a+b)\u00b2 = 4\u00b7\u00bdab + c\u00b2  \u2192  a\u00b2 + b\u00b2 = c\u00b2', x + w/2, y + h - 18);
}
