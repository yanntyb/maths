'use strict';

import { P } from './state.js';

export function drawAxiomTree(proof, x, y, w, h, classified, a, b, c) {
  P.noStroke(); P.fill(proof.color);
  P.textSize(11); P.textAlign(P.LEFT, P.TOP);
  P.text('arbre des axiomes', x + 8, y + 4);
  P.fill(140, 145, 160); P.textSize(9);
  P.text('chemin a, b \u2192 axiomes utilis\u00e9s \u2192 c\u00b2', x + 8, y + 18);

  const yIn   = y + 38;
  const yAx   = y + h * 0.55;
  const yOut  = y + h - 26;

  const inA = { x: x + w * 0.30, y: yIn, label: 'a', val: a };
  const inB = { x: x + w * 0.70, y: yIn, label: 'b', val: b };

  const nodeR = 18;
  [inA, inB].forEach(node => {
    P.noStroke(); P.fill(proof.color + '20');
    P.circle(node.x, node.y, nodeR * 2 + 6);
    P.stroke(proof.color); P.strokeWeight(2); P.fill('#fff');
    P.circle(node.x, node.y, nodeR * 2);
    P.noStroke(); P.fill(proof.color);
    P.textSize(14); P.textAlign(P.CENTER, P.CENTER);
    P.text(node.label, node.x, node.y);
    P.fill(proof.color);
    P.textSize(12); P.textAlign(P.LEFT, P.CENTER);
    P.text('= ' + node.val.toFixed(2), node.x + nodeR + 4, node.y);
  });

  const active = classified.filter(c => Math.abs(c.weight) > 0.001);
  const maxW = Math.max(...active.map(c => Math.abs(c.weight)), 0.001);

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
      P.stroke(proof.color + '90');
      P.strokeWeight(lwIn);
      P.noFill();
      P.beginShape();
      P.vertex(inN.x, inN.y + 18);
      const midY = (inN.y + ax.y) / 2;
      P.bezierVertex(inN.x, midY, ax.x, midY, ax.x, ax.y - ax.r);
      P.endShape();
    });
  });

  const outN = { x: x + w / 2, y: yOut };
  axNodes.forEach(ax => {
    const lw = ax.isStructural ? 1.2 : (1.5 + (ax.weight / maxW) * 5);
    P.stroke(proof.color + (ax.isStructural ? '60' : 'C0'));
    P.strokeWeight(lw);
    P.noFill();
    P.beginShape();
    P.vertex(ax.x, ax.y + ax.r);
    const midY = (ax.y + outN.y) / 2;
    P.bezierVertex(ax.x, midY, outN.x, midY, outN.x, outN.y - 22);
    P.endShape();
  });

  axNodes.forEach(ax => {
    P.noStroke(); P.fill(proof.color + '25');
    P.circle(ax.x, ax.y, ax.r * 2.6);
    P.stroke(proof.color); P.strokeWeight(2);
    P.fill('#fff');
    P.circle(ax.x, ax.y, ax.r * 2);
    P.noStroke(); P.fill(proof.color);
    P.textSize(Math.min(12, ax.r * 0.85));
    P.textAlign(P.CENTER, P.CENTER);
    P.text(ax.code, ax.x, ax.y);
  });

  const outR = 22;
  P.noStroke(); P.fill(proof.color + '30');
  P.circle(outN.x, outN.y, outR * 2 + 6);
  P.stroke(proof.color); P.strokeWeight(2.5);
  P.fill('#fff');
  P.circle(outN.x, outN.y, outR * 2);
  P.noStroke(); P.fill(proof.color);
  P.textSize(15); P.textAlign(P.CENTER, P.CENTER);
  P.text('c\u00b2', outN.x, outN.y);
  P.fill(proof.color);
  P.textSize(13); P.textAlign(P.LEFT, P.CENTER);
  P.text('= ' + (c*c).toFixed(2), outN.x + outR + 4, outN.y);
}
