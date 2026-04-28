'use strict';

export function drawArrow(ctx, x1, y1, x2, y2, color, lw, label = null, side = null) {
  const p = ctx.p;
  p.stroke(color); p.strokeWeight(lw);
  p.line(x1, y1, x2, y2);
  const ang = Math.atan2(y2 - y1, x2 - x1);
  p.fill(color); p.noStroke();
  p.push();
  p.translate(x2, y2); p.rotate(ang);
  p.triangle(0, 0, -10, -4, -10, 4);
  p.pop();
  if (label) {
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    p.noStroke(); p.fill(color);
    p.textSize(10);
    if (side === 'top')       { p.textAlign(p.CENTER, p.BOTTOM); p.text(label, mx, my - 4); }
    else if (side === 'left') { p.textAlign(p.RIGHT, p.CENTER);  p.text(label, mx - 6, my); }
    else if (side === 'right'){ p.textAlign(p.LEFT, p.CENTER);   p.text(label, mx + 6, my); }
    else                      { p.textAlign(p.CENTER, p.TOP);    p.text(label, mx, my + 4); }
  }
}

export function wrapToLines(ctx, str, maxW) {
  const p = ctx.p;
  const words = str.split(' ');
  const lines = [];
  let line = '';
  for (const w of words) {
    const test = line ? line + ' ' + w : w;
    if (p.textWidth(test) > maxW && line) {
      lines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export function drawAxiomRow(ctx, entry, lineY, tx, textW, color, maxR, maxNum) {
  const p = ctx.p;
  const weight = Math.abs(entry.weight);
  const active = weight > 0.001;

  let r;
  if (entry.isStructural) {
    r = active ? 7 : 5;
  } else {
    const ratio = maxNum > 0 ? weight / maxNum : 0;
    r = active ? 4 + ratio * 6 : 3;
  }
  const cxC = tx + maxR + 2;
  const cyC = lineY + 11;

  if (active) {
    p.noStroke();
    p.fill(color + '25');
    p.circle(cxC, cyC, r * 2.6);
  }
  p.noStroke();
  p.fill(active ? color : 'rgb(200,205,215)');
  p.circle(cxC, cyC, r * 2);

  const textX = tx + maxR * 2 + 10;

  p.fill(active ? 'rgb(70,80,100)' : 'rgb(180,185,200)');
  p.textSize(11);
  p.textAlign(p.LEFT, p.TOP);
  p.text(entry.ax.code + ' \u00b7 ' + entry.ax.label, textX, lineY);

  p.fill(active ? color : 'rgb(200,205,215)');
  p.textSize(10.5);
  p.text(entry.ax.formal, textX + 4, lineY + 13);

  if (entry.ax.role) {
    p.fill(active ? 'rgb(120,130,150)' : 'rgb(200,205,215)');
    p.textSize(9.5);
    p.text('\u21b3 ' + entry.ax.role, textX + 4, lineY + 26);
  }
}

export function drawAxiomTree(ctx, rect, proof, classified, tri) {
  const p = ctx.p;
  const { x, y, w, h } = rect;
  const { a, b, c } = tri;

  p.noStroke(); p.fill(proof.color);
  p.textSize(11); p.textAlign(p.LEFT, p.TOP);
  p.text('arbre des axiomes', x + 8, y + 4);
  p.fill(140, 145, 160); p.textSize(9);
  p.text('chemin a, b \u2192 axiomes utilis\u00e9s \u2192 c\u00b2', x + 8, y + 18);

  const yIn   = y + 38;
  const yAx   = y + h * 0.55;
  const yOut  = y + h - 26;

  const inA = { x: x + w * 0.30, y: yIn, label: 'a', val: a };
  const inB = { x: x + w * 0.70, y: yIn, label: 'b', val: b };

  const nodeR = 18;
  [inA, inB].forEach(node => {
    p.noStroke(); p.fill(proof.color + '20');
    p.circle(node.x, node.y, nodeR * 2 + 6);
    p.stroke(proof.color); p.strokeWeight(2); p.fill('#fff');
    p.circle(node.x, node.y, nodeR * 2);
    p.noStroke(); p.fill(proof.color);
    p.textSize(14); p.textAlign(p.CENTER, p.CENTER);
    p.text(node.label, node.x, node.y);
    p.fill(proof.color);
    p.textSize(12); p.textAlign(p.LEFT, p.CENTER);
    p.text('= ' + node.val.toFixed(2), node.x + nodeR + 4, node.y);
  });

  const active = classified.filter(e => Math.abs(e.weight) > 0.001);
  const maxW = Math.max(...active.map(e => Math.abs(e.weight)), 0.001);

  const nAx = active.length;
  const xStart = x + 28;
  const xEnd = x + w - 28;
  const xStep = nAx > 1 ? (xEnd - xStart) / (nAx - 1) : 0;

  const axNodes = active.map((entry, i) => {
    const weight = Math.abs(entry.weight);
    const ratio = weight / maxW;
    const r = entry.isStructural ? 12 : (10 + ratio * 14);
    return {
      x: nAx > 1 ? xStart + i * xStep : x + w / 2,
      y: yAx,
      r, code: entry.code, weight, isStructural: entry.isStructural,
    };
  });

  axNodes.forEach(ax => {
    if (ax.isStructural) return;
    [inA, inB].forEach(inN => {
      const lwIn = 1.2 + (ax.weight / maxW) * 3;
      p.stroke(proof.color + '90');
      p.strokeWeight(lwIn);
      p.noFill();
      p.beginShape();
      p.vertex(inN.x, inN.y + 18);
      const midY = (inN.y + ax.y) / 2;
      p.bezierVertex(inN.x, midY, ax.x, midY, ax.x, ax.y - ax.r);
      p.endShape();
    });
  });

  const outN = { x: x + w / 2, y: yOut };
  axNodes.forEach(ax => {
    const lw = ax.isStructural ? 1.2 : (1.5 + (ax.weight / maxW) * 5);
    p.stroke(proof.color + (ax.isStructural ? '60' : 'C0'));
    p.strokeWeight(lw);
    p.noFill();
    p.beginShape();
    p.vertex(ax.x, ax.y + ax.r);
    const midY = (ax.y + outN.y) / 2;
    p.bezierVertex(ax.x, midY, outN.x, midY, outN.x, outN.y - 22);
    p.endShape();
  });

  axNodes.forEach(ax => {
    p.noStroke(); p.fill(proof.color + '25');
    p.circle(ax.x, ax.y, ax.r * 2.6);
    p.stroke(proof.color); p.strokeWeight(2);
    p.fill('#fff');
    p.circle(ax.x, ax.y, ax.r * 2);
    p.noStroke(); p.fill(proof.color);
    p.textSize(Math.min(12, ax.r * 0.85));
    p.textAlign(p.CENTER, p.CENTER);
    p.text(ax.code, ax.x, ax.y);
  });

  const outR = 22;
  p.noStroke(); p.fill(proof.color + '30');
  p.circle(outN.x, outN.y, outR * 2 + 6);
  p.stroke(proof.color); p.strokeWeight(2.5);
  p.fill('#fff');
  p.circle(outN.x, outN.y, outR * 2);
  p.noStroke(); p.fill(proof.color);
  p.textSize(15); p.textAlign(p.CENTER, p.CENTER);
  p.text('c\u00b2', outN.x, outN.y);
  p.fill(proof.color);
  p.textSize(13); p.textAlign(p.LEFT, p.CENTER);
  p.text('= ' + (c * c).toFixed(2), outN.x + outR + 4, outN.y);
}

export function drawAxiomSphere(ctx, rect, proof, classified, tri) {
  const p = ctx.p;
  const { x, y, w, h } = rect;

  const cx = x + w / 2;
  const cy = y + h / 2;
  const R  = Math.min(w, h) * 0.35;

  p.noStroke(); p.fill(proof.color);
  p.textSize(13); p.textAlign(p.LEFT, p.TOP);
  p.text('cercle des axiomes', x + 12, y + 8);
  p.fill('#6B7280'); p.textSize(10);
  p.text('chaque axiome actif occupe un arc proportionnel \u00e0 son poids \u00b7 trous = axiomes inactifs',
         x + 12, y + 26);

  const legY = y + 44;
  p.fill('#3B82F6'); p.noStroke(); p.circle(x + 18, legY, 10);
  p.fill('#4B5563'); p.textSize(10); p.textAlign(p.LEFT, p.CENTER);
  p.text('structurels', x + 28, legY);
  p.fill('#F59E0B'); p.circle(x + 130, legY, 10);
  p.fill('#4B5563');
  p.text('num\u00e9riques', x + 140, legY);

  p.noStroke();
  p.fill(proof.color + '08');
  p.circle(cx, cy, R * 2.4);
  p.fill(proof.color + '15');
  p.circle(cx, cy, R * 2);
  p.stroke('#9CA3AF'); p.strokeWeight(1); p.noFill();
  p.circle(cx, cy, R * 2);

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
      p.noFill();
      p.stroke(it.color + '40');
      p.strokeWeight(20);
      p.arc(cx, cy, R * 2, R * 2, a0, a1);
      p.stroke(it.color);
      p.strokeWeight(10);
      p.arc(cx, cy, R * 2, R * 2, a0, a1);

      const lx = cx + Math.cos(aMid) * (R + 24);
      const ly = cy + Math.sin(aMid) * (R + 24);
      p.noStroke(); p.fill(it.color);
      p.textSize(11); p.textAlign(p.CENTER, p.CENTER);
      p.text(it.entry.code, lx, ly);
    } else {
      p.noFill();
      p.stroke('#D1D5DB');
      p.strokeWeight(2);
      p.drawingContext.setLineDash([2, 4]);
      p.arc(cx, cy, R * 2, R * 2, a0, a1);
      p.drawingContext.setLineDash([]);

      const lx = cx + Math.cos(aMid) * (R + 24);
      const ly = cy + Math.sin(aMid) * (R + 24);
      p.noStroke(); p.fill('#9CA3AF');
      p.textSize(10); p.textAlign(p.CENTER, p.CENTER);
      p.text(it.entry.code, lx, ly);
    }

    curAngle = a1;
  });

  const coverage = (NACTIVE / total) * 100;

  p.noStroke();
  p.fill(proof.color);
  p.textSize(Math.min(36, R * 0.5));
  p.textAlign(p.CENTER, p.CENTER);
  p.text(coverage.toFixed(0) + '%', cx, cy - 8);
  p.fill('#6B7280'); p.textSize(10);
  p.text('couverture', cx, cy + 16);

  p.noStroke(); p.fill('#4B5563');
  p.textSize(11); p.textAlign(p.LEFT, p.TOP);
  p.text(NACTIVE + ' / ' + total + ' axiomes actifs   \u00b7   ' +
         inactif + ' inactif' + (inactif > 1 ? 's' : ''),
         x + 12, y + h - 38);
  p.fill('#6B7280'); p.textSize(10);
  if (inactif === 0) {
    p.text('couverture maximale \u2014 tous les axiomes contribuent', x + 12, y + h - 20);
  } else {
    const inactifCodes = items.filter(it => !it.active).map(it => it.entry.code).join(', ');
    p.text('inactifs : ' + inactifCodes, x + 12, y + h - 20);
  }
}
