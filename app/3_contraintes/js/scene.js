'use strict';

import { PREUVES } from './preuves.js';
import { classify, applyNumerically } from './classifier.js';
import { drawEuclid } from './viz-euclid.js';
import { drawMeasure } from './viz-measure.js';
import { drawHilbert } from './viz-hilbert.js';
import { drawParseval } from './viz-parseval.js';
import { drawFrontiere } from './viz-frontiere.js';
import { drawAxiomRow, drawAxiomTree, drawAxiomSphere } from './structure.js';

function drawVizOf(ctx, type, rect, tri, color) {
  if (type === 'euclid')    drawEuclid(ctx, rect, tri, color);
  if (type === 'measure')   drawMeasure(ctx, rect, tri, color);
  if (type === 'hilbert')   drawHilbert(ctx, rect, tri, color);
  if (type === 'parseval')  drawParseval(ctx, rect, tri, color);
  if (type === 'frontiere') drawFrontiere(ctx, rect, tri, color);
}

function drawLegend(ctx, rect, proof) {
  const p = ctx.p;
  const { x, y, w, h } = rect;
  const PAD = 16;

  p.noStroke();
  p.fill(245, 246, 250);
  p.rect(x + PAD, y, w - PAD * 2, h, 8);
  p.stroke(220); p.strokeWeight(1); p.noFill();
  p.rect(x + PAD, y, w - PAD * 2, h, 8);

  p.noStroke(); p.fill('#0F766E');
  p.textSize(10); p.textAlign(p.LEFT, p.TOP);
  p.text('L\u00c9GENDE \u2014 taille des cercles', x + PAD + 14, y + 10);

  p.fill(70, 80, 100); p.textSize(11);
  p.text('ce que chaque axiome apporte au r\u00e9sultat final',
         x + PAD + 14, y + 28);
  p.fill(120, 130, 150); p.textSize(10);
  p.text('pour les valeurs courantes (a, b) \u2014 taille du cercle \u221d contribution',
         x + PAD + 14, y + 46);

  const rx = x + w - 280;
  p.fill(proof.color); p.noStroke();
  p.circle(rx, y + 22, 10);
  p.fill(70, 80, 100); p.textSize(10); p.textAlign(p.LEFT, p.CENTER);
  p.text('actif', rx + 10, y + 22);

  p.fill('rgb(200,205,215)'); p.noStroke();
  p.circle(rx + 60, y + 22, 10);
  p.fill(160, 170, 185);
  p.text('inactif', rx + 70, y + 22);

  p.fill(proof.color); p.circle(rx, y + 50, 6);
  p.fill(proof.color); p.circle(rx + 22, y + 50, 12);
  p.fill(proof.color); p.circle(rx + 50, y + 50, 18);
  p.fill(70, 80, 100); p.textSize(10); p.textAlign(p.LEFT, p.CENTER);
  p.text('faible  \u27f6  fort', rx + 70, y + 50);
}

function drawProof(ctx, rect, proof, tri, rightView) {
  const p = ctx.p;
  const { x, y, w, h } = rect;
  const { a, b, c } = tri;
  const PAD = 16;

  p.noStroke(); p.fill(proof.color);
  p.rect(x, y, 4, h);

  p.stroke(225); p.strokeWeight(.5);
  p.line(x + 8, y + h - 1, x + w - 8, y + h - 1);

  const textW = w * 0.5 - 24;
  const tx = x + PAD + 8;

  p.noStroke();
  p.fill(proof.color); p.textSize(15); p.textAlign(p.LEFT, p.TOP);
  p.text(proof.title, tx, y + 8);

  const classified = classify(proof, tri);

  const structAxs = classified.filter(e => e.isStructural);
  const numAxs    = classified.filter(e => !e.isStructural);

  const maxNum = Math.max(...numAxs.map(e => Math.abs(e.weight)), 0.001);

  const maxR = 9;
  const slotH = 42;
  let cursorY = y + 36;

  p.noStroke();
  p.fill(140, 145, 165);
  p.textSize(10); p.textAlign(p.LEFT, p.TOP);
  p.text('STRUCTURELS \u00b7 ' + structAxs.length + ' axiomes constants', tx, cursorY);
  p.stroke(proof.color + '40'); p.strokeWeight(0.8);
  p.line(tx, cursorY + 14, tx + textW - 20, cursorY + 14);
  cursorY += 22;

  structAxs.forEach((entry) => {
    if (cursorY > y + h - 90) return;
    drawAxiomRow(ctx, entry, cursorY, tx, textW, proof.color, maxR, maxNum);
    cursorY += slotH;
  });

  cursorY += 8;

  p.noStroke();
  p.fill(140, 145, 165);
  p.textSize(10); p.textAlign(p.LEFT, p.TOP);
  p.text('NUM\u00c9RIQUES \u00b7 ' + numAxs.length + ' axiomes contributifs', tx, cursorY);
  p.stroke(proof.color + '40'); p.strokeWeight(0.8);
  p.line(tx, cursorY + 14, tx + textW - 20, cursorY + 14);
  cursorY += 22;

  numAxs.forEach((entry) => {
    if (cursorY > y + h - 90) return;
    drawAxiomRow(ctx, entry, cursorY, tx, textW, proof.color, maxR, maxNum);
    cursorY += slotH;
  });

  p.fill(proof.color); p.textSize(14); p.textAlign(p.LEFT, p.BOTTOM);
  p.text(proof.formula, tx, y + h - 50);
  p.fill(160); p.textSize(10); p.textAlign(p.LEFT, p.BOTTOM);
  p.text('forme g\u00e9n\u00e9rale', tx, y + h - 64);

  const numStr = applyNumerically(proof, tri);

  p.textSize(13);
  const numW = p.textWidth(numStr);
  const availW = textW + 8;
  const boxW = Math.min(availW, numW + 24);
  const boxH = 36;
  const boxX = tx - 4;
  const boxY = y + h - 38;

  p.noStroke();
  p.fill(proof.color); p.textSize(10); p.textAlign(p.LEFT, p.BOTTOM);
  p.text('APPLICATION  a=' + a.toFixed(2) + ', b=' + b.toFixed(2), tx, boxY - 4);

  p.fill(proof.color + '15');
  p.stroke(proof.color); p.strokeWeight(1);
  p.rect(boxX, boxY, boxW, boxH, 4);

  let fontSize = 13;
  p.textSize(fontSize);
  while (p.textWidth(numStr) > boxW - 24 && fontSize > 9) {
    fontSize -= 0.5;
    p.textSize(fontSize);
  }
  p.noStroke();
  p.fill(proof.color); p.textAlign(p.LEFT, p.CENTER);
  p.text(numStr, boxX + 12, boxY + boxH / 2);

  const vizX = x + textW + 16;
  const vizW = w - textW - PAD - 16;
  const vizY = y + 8;
  const vizH = h - 16;
  const vizRect = { x: vizX, y: vizY, w: vizW, h: vizH };

  if (rightView === 'tree') {
    drawAxiomTree(ctx, vizRect, proof, classified, tri);
  } else if (rightView === 'sphere') {
    drawAxiomSphere(ctx, vizRect, proof, classified, tri);
  } else {
    drawVizOf(ctx, proof.id, vizRect, tri, proof.color);
  }
}

export function drawScene(ctx, activeProof, rightView, tri) {
  const p = ctx.p;
  const W = ctx.w;
  const H = ctx.h;
  const { a, b, c } = tri;

  const banH = 92;
  p.noStroke();
  p.fill('#0F766E10');
  p.rect(0, 0, W, banH);
  p.stroke('#0F766E40'); p.strokeWeight(1);
  p.line(0, banH, W, banH);

  p.noStroke(); p.fill('#0F766E');
  p.textSize(13); p.textAlign(p.LEFT, p.TOP);
  p.text('TH\u00c9OR\u00c8ME INVARIANT', 18, 10);

  p.fill('#0F766E'); p.textSize(15); p.textAlign(p.LEFT, p.TOP);
  p.text('\u00ab la longueur de l\'hypot\u00e9nuse d\'un triangle rectangle se d\u00e9duit des deux autres c\u00f4t\u00e9s \u00bb', 18, 28);

  p.fill(80, 90, 110); p.textSize(12);
  p.text('signature commune  :  (a, b) \u2208 \u211d\u208a\u00b2  \u27f6  c \u2208 \u211d\u208a', 18, 52);
  p.fill('#0F766E'); p.textSize(13);
  p.text('a=' + a.toFixed(2) + ',  b=' + b.toFixed(2) + '  \u27f6  c=' + c.toFixed(2), 18, 70);

  p.fill('#0F766E'); p.textSize(12); p.textAlign(p.RIGHT, p.TOP);
  p.text('r\u00e9sultat invariant', W - 18, 8);
  p.textSize(13);
  p.text('a\u00b2 + b\u00b2 = c\u00b2  \u2192  ' + (a * a).toFixed(2) + ' + ' + (b * b).toFixed(2) + ' = ' + (c * c).toFixed(2), W - 18, 24);
  p.fill(120, 130, 150); p.textSize(12);
  p.text('m\u00eame invariant scalaire  \u00b7  trois axiomatiques distinctes', W - 18, 44);
  p.fill('#0F766E'); p.textSize(12);
  p.text('l\'invariant pr\u00e9c\u00e8de ses formalisations', W - 18, 60);

  const startY = banH + 8;
  const proof = PREUVES[activeProof];

  const proofRect = { x: 0, y: startY, w: W, h: H - startY - 90 };
  drawProof(ctx, proofRect, proof, tri, rightView);

  const legendRect = { x: 0, y: H - 86, w: W, h: 80 };
  drawLegend(ctx, legendRect, proof);
}
