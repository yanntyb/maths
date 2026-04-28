'use strict';

import { Primitives as P } from '../../primitives.js';
import { drawArrow } from '../../structure.js';

export function draw(ctx, rect, tri, color) {
  const p = ctx.p;
  const { x, y, w, h } = rect;
  const { a, b, c } = tri;

  const PAD = 32;
  const cx = x + w / 2;
  const cy = y + h / 2;

  P.text(ctx, 'Parseval — diagramme commutatif', x + PAD, y + 12, { size: 13, color, align: [p.LEFT, p.TOP] });
  P.text(ctx, 'frame orthonormal {e₁, e₂}  ·  Gram = I', x + PAD, y + 30, { size: 10, color: '#6B7280', align: [p.LEFT, p.TOP] });

  const nodeR = Math.min(w, h) * 0.07;
  const dx = (w - PAD * 2) * 0.32;
  const dy = (h - 90) * 0.30;

  const TL = { x: cx - dx, y: cy - dy, label: '(a, b)', sub: 'ℓ²', val: '(' + a.toFixed(2) + ', ' + b.toFixed(2) + ')' };
  const TR = { x: cx + dx, y: cy - dy, label: 'v', sub: 'E', val: 'a·e₁ + b·e₂' };
  const BL = { x: cx - dx, y: cy + dy, label: 'a²+b²', sub: 'ℝ', val: (a * a + b * b).toFixed(3) };
  const BR = { x: cx + dx, y: cy + dy, label: 'c²', sub: 'ℝ', val: (c * c).toFixed(3) };

  drawArrow(ctx, TL.x + nodeR, TL.y, TR.x - nodeR, TR.y, color, 2.5, 'Synthétiser', 'top');
  drawArrow(ctx, TR.x, TR.y + nodeR, BR.x, BR.y - nodeR, color, 2.5, 'Normer + ²', 'right');
  drawArrow(ctx, TL.x, TL.y + nodeR, BL.x, BL.y - nodeR, color, 2.5, 'Analyser + Σ²', 'left');

  P.setStroke(ctx, color, 3);
  P.line(ctx, BL.x + nodeR + 2, BL.y - 3, BR.x - nodeR - 2, BR.y - 3);
  P.line(ctx, BL.x + nodeR + 2, BL.y + 3, BR.x - nodeR - 2, BR.y + 3);
  P.text(ctx, 'PARSEVAL', (BL.x + BR.x) / 2, BL.y - 8, { size: 11, color, align: [p.CENTER, p.BOTTOM] });

  [TL, TR, BL, BR].forEach(n => {
    P.circle(ctx, n.x, n.y, nodeR * 2.4, { fill: P.tint(color, '20') });
    P.circle(ctx, n.x, n.y, nodeR * 2, { stroke: color, fill: '#fff', weight: 2 });
    P.text(ctx, n.label, n.x, n.y - 6, { size: 13, color, align: [p.CENTER, p.CENTER] });
    P.text(ctx, n.sub, n.x, n.y + 8, { size: 9, color: P.tint(color, '99'), align: [p.CENTER, p.CENTER] });
    P.text(ctx, n.val, n.x, n.y + nodeR + 6, { size: 10, color: '#4B5563', align: [p.CENTER, p.TOP] });
  });

  P.text(ctx, 'le diagramme commute  ⟹  a² + b² = c²', cx, y + h - 16, { size: 13, color, align: [p.CENTER, p.BOTTOM] });
  P.text(ctx, 'Pythagore = Analyser est une isométrie  (car frame orthonormal)', cx, y + h - 36, { size: 10, color: '#6B7280', align: [p.CENTER, p.BOTTOM] });
}
