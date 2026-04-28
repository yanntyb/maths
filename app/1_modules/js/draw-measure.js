'use strict';

import { P } from './state.js';

export function drawMeasure(x, y, w, h, a, b, c, color) {
  const padH = 32;
  const opSpace = 36;
  const availW = w - padH * 2 - opSpace * 2;
  const availH = h - 80;

  const sc = Math.min(availW / (a + b + c), availH / c);

  const aPx = a * sc, bPx = b * sc, cPx = c * sc;
  const totalW = aPx + bPx + cPx + opSpace * 2;
  const baseY = y + h - 50;
  let xc = x + (w - totalW) / 2;

  P.stroke(color); P.strokeWeight(1.5); P.fill(color + '40');
  P.rect(xc, baseY - aPx, aPx, aPx);
  P.noStroke(); P.fill(color); P.textSize(Math.min(13, aPx*0.18));
  P.textAlign(P.CENTER, P.CENTER);
  P.text('a\u00b2', xc + aPx/2, baseY - aPx/2 - 7);
  P.text((a*a).toFixed(2), xc + aPx/2, baseY - aPx/2 + 7);

  xc += aPx;
  P.fill('#475569'); P.textSize(20);
  P.text('+', xc + opSpace/2, baseY - aPx/2);

  xc += opSpace;
  P.stroke(color); P.strokeWeight(1.5); P.fill(color + '40');
  P.rect(xc, baseY - bPx, bPx, bPx);
  P.noStroke(); P.fill(color); P.textSize(Math.min(13, bPx*0.18));
  P.textAlign(P.CENTER, P.CENTER);
  P.text('b\u00b2', xc + bPx/2, baseY - bPx/2 - 7);
  P.text((b*b).toFixed(2), xc + bPx/2, baseY - bPx/2 + 7);

  xc += bPx;
  P.fill('#475569'); P.textSize(20);
  P.text('=', xc + opSpace/2, baseY - aPx/2);

  xc += opSpace;
  P.stroke(color); P.strokeWeight(1.5); P.fill(color + '60');
  P.rect(xc, baseY - cPx, cPx, cPx);
  P.noStroke(); P.fill('#fff'); P.textSize(Math.min(13, cPx*0.15));
  P.textAlign(P.CENTER, P.CENTER);
  P.text('c\u00b2', xc + cPx/2, baseY - cPx/2 - 8);
  P.text((c*c).toFixed(2), xc + cPx/2, baseY - cPx/2 + 8);

  P.fill(color); P.textSize(12); P.textAlign(P.CENTER, P.BOTTOM);
  P.text('\u03bc(a\u00b2) + \u03bc(b\u00b2) = \u03bc(c\u00b2)  par \u03c3-additivit\u00e9', x + w/2, y + h - 12);
}
