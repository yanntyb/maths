'use strict';

import { P } from './state.js';

export function drawAxiomSphere(proof, x, y, w, h, classified, a, b, c) {
  const cx = x + w / 2;
  const cy = y + h / 2;
  const R  = Math.min(w, h) * 0.35;

  P.noStroke(); P.fill(proof.color);
  P.textSize(13); P.textAlign(P.LEFT, P.TOP);
  P.text('cercle des axiomes', x + 12, y + 8);
  P.fill('#6B7280'); P.textSize(10);
  P.text('chaque axiome actif occupe un arc proportionnel \u00e0 son poids \u00b7 trous = axiomes inactifs',
         x + 12, y + 26);

  const legY = y + 44;
  P.fill('#3B82F6'); P.noStroke(); P.circle(x + 18, legY, 10);
  P.fill('#4B5563'); P.textSize(10); P.textAlign(P.LEFT, P.CENTER);
  P.text('structurels', x + 28, legY);
  P.fill('#F59E0B'); P.circle(x + 130, legY, 10);
  P.fill('#4B5563');
  P.text('num\u00e9riques', x + 140, legY);

  P.noStroke();
  P.fill(proof.color + '08');
  P.circle(cx, cy, R * 2.4);
  P.fill(proof.color + '15');
  P.circle(cx, cy, R * 2);
  P.stroke('#9CA3AF'); P.strokeWeight(1); P.noFill();
  P.circle(cx, cy, R * 2);

  const inactif = classified.filter(e => Math.abs(e.weight) < 0.001).length;
  const total = classified.length;

  const items = classified.map(e => {
    const active = Math.abs(e.weight) > 0.001;
    let w_;
    if (!active) w_ = 0;
    else if (e.isStructural) w_ = 1;
    else                     w_ = Math.abs(e.weight);
    return { entry: e, active, w: w_, color: e.isStructural ? '#3B82F6' : '#F59E0B' };
  });

  const sumActive = items.reduce((s, it) => s + it.w, 0);

  const NACTIVE = items.filter(it => it.active).length;
  const partActiveTotal = (NACTIVE / total) * 2 * Math.PI;
  const partInactif = (1 / total) * 2 * Math.PI;

  const ordered = [
    ...items.filter(it => it.entry.isStructural),
    ...items.filter(it => !it.entry.isStructural),
  ];

  let curAngle = -Math.PI / 2;

  ordered.forEach(it => {
    let arc;
    if (it.active) {
      arc = sumActive > 0 ? partActiveTotal * (it.w / sumActive) : 0;
    } else {
      arc = partInactif;
    }
    const a0 = curAngle;
    const a1 = curAngle + arc;
    const aMid = (a0 + a1) / 2;

    if (it.active) {
      P.noFill();
      P.stroke(it.color + '40');
      P.strokeWeight(20);
      P.arc(cx, cy, R * 2, R * 2, a0, a1);
      P.stroke(it.color);
      P.strokeWeight(10);
      P.arc(cx, cy, R * 2, R * 2, a0, a1);

      const lx = cx + Math.cos(aMid) * (R + 24);
      const ly = cy + Math.sin(aMid) * (R + 24);
      P.noStroke(); P.fill(it.color);
      P.textSize(11); P.textAlign(P.CENTER, P.CENTER);
      P.text(it.entry.code, lx, ly);
    } else {
      P.noFill();
      P.stroke('#D1D5DB');
      P.strokeWeight(2);
      P.drawingContext.setLineDash([2, 4]);
      P.arc(cx, cy, R * 2, R * 2, a0, a1);
      P.drawingContext.setLineDash([]);

      const lx = cx + Math.cos(aMid) * (R + 24);
      const ly = cy + Math.sin(aMid) * (R + 24);
      P.noStroke(); P.fill('#9CA3AF');
      P.textSize(10); P.textAlign(P.CENTER, P.CENTER);
      P.text(it.entry.code, lx, ly);
    }

    curAngle = a1;
  });

  const coverage = (NACTIVE / total) * 100;

  P.noStroke();
  P.fill(proof.color);
  P.textSize(Math.min(36, R * 0.5));
  P.textAlign(P.CENTER, P.CENTER);
  P.text(coverage.toFixed(0) + '%', cx, cy - 8);
  P.fill('#6B7280'); P.textSize(10);
  P.text('couverture', cx, cy + 16);

  P.noStroke(); P.fill('#4B5563');
  P.textSize(11); P.textAlign(P.LEFT, P.TOP);
  P.text(NACTIVE + ' / ' + total + ' axiomes actifs   \u00b7   ' +
         inactif + ' inactif' + (inactif > 1 ? 's' : ''),
         x + 12, y + h - 38);
  P.fill('#6B7280'); P.textSize(10);
  if (inactif === 0) {
    P.text('couverture maximale \u2014 tous les axiomes contribuent', x + 12, y + h - 20);
  } else {
    const inactifCodes = items.filter(it => !it.active).map(it => it.entry.code).join(', ');
    P.text('inactifs : ' + inactifCodes, x + 12, y + h - 20);
  }
}
