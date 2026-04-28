'use strict';

import { P } from './state.js';
import { drawArrow } from './draw-utils.js';

export function drawParseval(x, y, w, h, a, b, c, color) {
  const PAD = 32;
  const cx = x + w / 2;
  const cy = y + h / 2;

  P.noStroke(); P.fill(color);
  P.textSize(13); P.textAlign(P.LEFT, P.TOP);
  P.text('Parseval \u2014 diagramme commutatif', x + PAD, y + 12);
  P.fill('#6B7280'); P.textSize(10);
  P.text('frame orthonormal {e\u2081, e\u2082}  \u00b7  Gram = I', x + PAD, y + 30);

  const nodeR = Math.min(w, h) * 0.07;
  const dx = (w - PAD * 2) * 0.32;
  const dy = (h - 90) * 0.30;

  const TL = { x: cx - dx, y: cy - dy, label: '(a, b)', sub: '\u2113\u00b2',
               val: '(' + a.toFixed(2) + ', ' + b.toFixed(2) + ')' };
  const TR = { x: cx + dx, y: cy - dy, label: 'v',       sub: 'E',
               val: 'a\u00b7e\u2081 + b\u00b7e\u2082' };
  const BL = { x: cx - dx, y: cy + dy, label: 'a\u00b2+b\u00b2',   sub: '\u211d',
               val: (a*a + b*b).toFixed(3) };
  const BR = { x: cx + dx, y: cy + dy, label: 'c\u00b2',      sub: '\u211d',
               val: (c*c).toFixed(3) };

  drawArrow(TL.x + nodeR, TL.y, TR.x - nodeR, TR.y,
            color, 2.5, 'Synth\u00e9tiser', 'top');
  drawArrow(TR.x, TR.y + nodeR, BR.x, BR.y - nodeR,
            color, 2.5, 'Normer + \u00b2', 'right');
  drawArrow(TL.x, TL.y + nodeR, BL.x, BL.y - nodeR,
            color, 2.5, 'Analyser + \u03a3\u00b2', 'left');

  P.stroke(color); P.strokeWeight(3);
  P.line(BL.x + nodeR + 2, BL.y - 3, BR.x - nodeR - 2, BR.y - 3);
  P.line(BL.x + nodeR + 2, BL.y + 3, BR.x - nodeR - 2, BR.y + 3);
  P.noStroke(); P.fill(color);
  P.textSize(11); P.textAlign(P.CENTER, P.BOTTOM);
  P.text('PARSEVAL', (BL.x + BR.x) / 2, BL.y - 8);

  [TL, TR, BL, BR].forEach(n => {
    P.noStroke(); P.fill(color + '20');
    P.circle(n.x, n.y, nodeR * 2.4);
    P.stroke(color); P.strokeWeight(2); P.fill('#fff');
    P.circle(n.x, n.y, nodeR * 2);
    P.noStroke(); P.fill(color);
    P.textSize(13); P.textAlign(P.CENTER, P.CENTER);
    P.text(n.label, n.x, n.y - 6);
    P.fill(color + '99'); P.textSize(9);
    P.text(n.sub, n.x, n.y + 8);
    P.fill('#4B5563'); P.textSize(10);
    P.textAlign(P.CENTER, P.TOP);
    P.text(n.val, n.x, n.y + nodeR + 6);
  });

  P.noStroke(); P.fill(color);
  P.textSize(13); P.textAlign(P.CENTER, P.BOTTOM);
  P.text('le diagramme commute  \u27f9  a\u00b2 + b\u00b2 = c\u00b2', cx, y + h - 16);
  P.fill('#6B7280'); P.textSize(10);
  P.text('Pythagore = Analyser est une isom\u00e9trie  (car frame orthonormal)',
         cx, y + h - 36);
}
