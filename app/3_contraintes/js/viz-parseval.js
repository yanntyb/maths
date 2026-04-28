'use strict';

import { drawArrow } from './structure.js';

export function drawParseval(ctx, rect, tri, color) {
  const p = ctx.p;
  const { x, y, w, h } = rect;
  const { a, b, c } = tri;

  const PAD = 32;
  const cx = x + w / 2;
  const cy = y + h / 2;

  p.noStroke(); p.fill(color);
  p.textSize(13); p.textAlign(p.LEFT, p.TOP);
  p.text('Parseval \u2014 diagramme commutatif', x + PAD, y + 12);
  p.fill('#6B7280'); p.textSize(10);
  p.text('frame orthonormal {e\u2081, e\u2082}  \u00b7  Gram = I', x + PAD, y + 30);

  const nodeR = Math.min(w, h) * 0.07;
  const dx = (w - PAD * 2) * 0.32;
  const dy = (h - 90) * 0.30;

  const TL = { x: cx - dx, y: cy - dy, label: '(a, b)', sub: '\u2113\u00b2',
               val: '(' + a.toFixed(2) + ', ' + b.toFixed(2) + ')' };
  const TR = { x: cx + dx, y: cy - dy, label: 'v',       sub: 'E',
               val: 'a\u00b7e\u2081 + b\u00b7e\u2082' };
  const BL = { x: cx - dx, y: cy + dy, label: 'a\u00b2+b\u00b2',   sub: '\u211d',
               val: (a * a + b * b).toFixed(3) };
  const BR = { x: cx + dx, y: cy + dy, label: 'c\u00b2',      sub: '\u211d',
               val: (c * c).toFixed(3) };

  drawArrow(ctx, TL.x + nodeR, TL.y, TR.x - nodeR, TR.y,
            color, 2.5, 'Synth\u00e9tiser', 'top');
  drawArrow(ctx, TR.x, TR.y + nodeR, BR.x, BR.y - nodeR,
            color, 2.5, 'Normer + \u00b2', 'right');
  drawArrow(ctx, TL.x, TL.y + nodeR, BL.x, BL.y - nodeR,
            color, 2.5, 'Analyser + \u03a3\u00b2', 'left');

  p.stroke(color); p.strokeWeight(3);
  p.line(BL.x + nodeR + 2, BL.y - 3, BR.x - nodeR - 2, BR.y - 3);
  p.line(BL.x + nodeR + 2, BL.y + 3, BR.x - nodeR - 2, BR.y + 3);
  p.noStroke(); p.fill(color);
  p.textSize(11); p.textAlign(p.CENTER, p.BOTTOM);
  p.text('PARSEVAL', (BL.x + BR.x) / 2, BL.y - 8);

  [TL, TR, BL, BR].forEach(n => {
    p.noStroke(); p.fill(color + '20');
    p.circle(n.x, n.y, nodeR * 2.4);
    p.stroke(color); p.strokeWeight(2); p.fill('#fff');
    p.circle(n.x, n.y, nodeR * 2);
    p.noStroke(); p.fill(color);
    p.textSize(13); p.textAlign(p.CENTER, p.CENTER);
    p.text(n.label, n.x, n.y - 6);
    p.fill(color + '99'); p.textSize(9);
    p.text(n.sub, n.x, n.y + 8);
    p.fill('#4B5563'); p.textSize(10);
    p.textAlign(p.CENTER, p.TOP);
    p.text(n.val, n.x, n.y + nodeR + 6);
  });

  p.noStroke(); p.fill(color);
  p.textSize(13); p.textAlign(p.CENTER, p.BOTTOM);
  p.text('le diagramme commute  \u27f9  a\u00b2 + b\u00b2 = c\u00b2', cx, y + h - 16);
  p.fill('#6B7280'); p.textSize(10);
  p.text('Pythagore = Analyser est une isom\u00e9trie  (car frame orthonormal)',
         cx, y + h - 36);
}
