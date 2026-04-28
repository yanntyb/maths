'use strict';

import { P, S, W, H } from './state.js';
import { PROOFS } from './proofs-data.js';
import { weightOfAxiom, applyNumerically } from './weights.js';
import { drawAxiomRow } from './draw-utils.js';
import { drawAxiomTree } from './draw-tree.js';
import { drawAxiomSphere } from './draw-sphere.js';
import { drawEuclid } from './draw-euclid.js';
import { drawMeasure } from './draw-measure.js';
import { drawHilbert } from './draw-hilbert.js';
import { drawParseval } from './draw-parseval.js';
import { drawFrontiere } from './draw-frontiere.js';

function drawVizOf(type, x, y, w, h, a, b, c, color) {
  if (type === 'euclid')    drawEuclid(x, y, w, h, a, b, c, color);
  if (type === 'measure')   drawMeasure(x, y, w, h, a, b, c, color);
  if (type === 'hilbert')   drawHilbert(x, y, w, h, a, b, c, color);
  if (type === 'parseval')  drawParseval(x, y, w, h, a, b, c, color);
  if (type === 'frontiere') drawFrontiere(x, y, w, h, a, b, c, color);
}

export function drawScene() {
  const a = S.a, b = S.b;
  const c = Math.sqrt(a*a + b*b);

  const banH = 92;
  P.noStroke();
  P.fill('#0F766E10');
  P.rect(0, 0, W, banH);
  P.stroke('#0F766E40'); P.strokeWeight(1);
  P.line(0, banH, W, banH);

  P.noStroke(); P.fill('#0F766E');
  P.textSize(13); P.textAlign(P.LEFT, P.TOP);
  P.text('TH\u00c9OR\u00c8ME INVARIANT', 18, 10);

  P.fill('#0F766E'); P.textSize(15); P.textAlign(P.LEFT, P.TOP);
  P.text('\u00ab la longueur de l\'hypot\u00e9nuse d\'un triangle rectangle se d\u00e9duit des deux autres c\u00f4t\u00e9s \u00bb', 18, 28);

  P.fill(80, 90, 110); P.textSize(12);
  P.text('signature commune  :  (a, b) \u2208 \u211d\u208a\u00b2  \u27f6  c \u2208 \u211d\u208a', 18, 52);
  P.fill('#0F766E'); P.textSize(13);
  P.text('a=' + a.toFixed(2) + ',  b=' + b.toFixed(2) + '  \u27f6  c=' + c.toFixed(2), 18, 70);

  P.fill('#0F766E'); P.textSize(12); P.textAlign(P.RIGHT, P.TOP);
  P.text('r\u00e9sultat invariant', W - 18, 8);
  P.textSize(13);
  P.text('a\u00b2 + b\u00b2 = c\u00b2  \u2192  ' + (a*a).toFixed(2) + ' + ' + (b*b).toFixed(2) + ' = ' + (c*c).toFixed(2), W - 18, 24);
  P.fill(120, 130, 150); P.textSize(12);
  P.text('m\u00eame invariant scalaire  \u00b7  trois axiomatiques distinctes', W - 18, 44);
  P.fill('#0F766E'); P.textSize(12);
  P.text('l\'invariant pr\u00e9c\u00e8de ses formalisations', W - 18, 60);

  const startY = banH + 8;
  const proof = PROOFS[S.activeProof];
  drawProofFull(0, startY, W, H - startY, proof, a, b, c);
}

function drawProofFull(x, y, w, h, proof, a, b, c) {
  drawProof(x, y, w, h - 90, proof, a, b, c);
  drawLegend(x, y + h - 86, w, 80, proof);
}

function drawLegend(x, y, w, h, proof) {
  const PAD = 16;
  P.noStroke();
  P.fill(245, 246, 250);
  P.rect(x + PAD, y, w - PAD*2, h, 8);
  P.stroke(220); P.strokeWeight(1); P.noFill();
  P.rect(x + PAD, y, w - PAD*2, h, 8);

  P.noStroke(); P.fill('#0F766E');
  P.textSize(10); P.textAlign(P.LEFT, P.TOP);
  P.text('L\u00c9GENDE \u2014 taille des cercles', x + PAD + 14, y + 10);

  P.fill(70, 80, 100); P.textSize(11);
  P.text('ce que chaque axiome apporte au r\u00e9sultat final',
         x + PAD + 14, y + 28);
  P.fill(120, 130, 150); P.textSize(10);
  P.text('pour les valeurs courantes (a, b) \u2014 taille du cercle \u221d contribution',
         x + PAD + 14, y + 46);

  const rx = x + w - 280;
  P.fill(proof.color); P.noStroke();
  P.circle(rx, y + 22, 10);
  P.fill(70, 80, 100); P.textSize(10); P.textAlign(P.LEFT, P.CENTER);
  P.text('actif', rx + 10, y + 22);

  P.fill('rgb(200,205,215)'); P.noStroke();
  P.circle(rx + 60, y + 22, 10);
  P.fill(160, 170, 185);
  P.text('inactif', rx + 70, y + 22);

  P.fill(proof.color); P.circle(rx, y + 50, 6);
  P.fill(proof.color); P.circle(rx + 22, y + 50, 12);
  P.fill(proof.color); P.circle(rx + 50, y + 50, 18);
  P.fill(70, 80, 100); P.textSize(10); P.textAlign(P.LEFT, P.CENTER);
  P.text('faible  \u27f6  fort', rx + 70, y + 50);
}

function drawProof(x, y, w, h, proof, a, b, c) {
  const PAD = 16;

  P.noStroke(); P.fill(proof.color);
  P.rect(x, y, 4, h);

  P.stroke(225); P.strokeWeight(.5);
  P.line(x + 8, y + h - 1, x + w - 8, y + h - 1);

  const textW = w * 0.5 - 24;
  const tx = x + PAD + 8;

  P.noStroke();
  P.fill(proof.color); P.textSize(15); P.textAlign(P.LEFT, P.TOP);
  P.text(proof.title, tx, y + 8);

  const NUMERIC_CODES = {
    'euclid':    ['P4', 'P5', 'CN2', 'CN4'],
    'measure':   ['M3', 'M4'],
    'hilbert':   ['E3', 'E5', 'D1', 'D2'],
    'parseval':  ['F4', 'F5', 'F6', 'F7'],
    'frontiere': ['Z4', 'Z5'],
  };
  const numCodes = NUMERIC_CODES[proof.vizType] || [];

  const classified = proof.axiomsList.map(ax => {
    const code = ax[0].split(' \u00b7 ')[0];
    const isStructural = !numCodes.includes(code);
    return { ax, code, isStructural, weight: weightOfAxiom(proof, code, a, b, c) };
  });

  const structAxs = classified.filter(x => x.isStructural);
  const numAxs    = classified.filter(x => !x.isStructural);

  const maxNum = Math.max(...numAxs.map(x => Math.abs(x.weight)), 0.001);

  const maxR = 9;
  const slotH = 42;
  let cursorY = y + 36;

  P.noStroke();
  P.fill(140, 145, 165);
  P.textSize(10); P.textAlign(P.LEFT, P.TOP);
  P.text('STRUCTURELS \u00b7 ' + structAxs.length + ' axiomes constants', tx, cursorY);
  P.stroke(proof.color + '40'); P.strokeWeight(0.8);
  P.line(tx, cursorY + 14, tx + textW - 20, cursorY + 14);
  cursorY += 22;

  structAxs.forEach((entry) => {
    if (cursorY > y + h - 90) return;
    drawAxiomRow(entry, cursorY, tx, textW, proof.color, maxR, maxNum);
    cursorY += slotH;
  });

  cursorY += 8;

  P.noStroke();
  P.fill(140, 145, 165);
  P.textSize(10); P.textAlign(P.LEFT, P.TOP);
  P.text('NUM\u00c9RIQUES \u00b7 ' + numAxs.length + ' axiomes contributifs', tx, cursorY);
  P.stroke(proof.color + '40'); P.strokeWeight(0.8);
  P.line(tx, cursorY + 14, tx + textW - 20, cursorY + 14);
  cursorY += 22;

  numAxs.forEach((entry) => {
    if (cursorY > y + h - 90) return;
    drawAxiomRow(entry, cursorY, tx, textW, proof.color, maxR, maxNum);
    cursorY += slotH;
  });

  P.fill(proof.color); P.textSize(14); P.textAlign(P.LEFT, P.BOTTOM);
  P.text(proof.formula, tx, y + h - 50);
  P.fill(160); P.textSize(10); P.textAlign(P.LEFT, P.BOTTOM);
  P.text('forme g\u00e9n\u00e9rale', tx, y + h - 64);

  const numStr = applyNumerically(proof.vizType, a, b, c);

  P.textSize(13);
  const numW = P.textWidth(numStr);
  const availW = textW + 8;
  const boxW = Math.min(availW, numW + 24);
  const boxH = 36;
  const boxX = tx - 4;
  const boxY = y + h - 38;

  P.noStroke();
  P.fill(proof.color); P.textSize(10); P.textAlign(P.LEFT, P.BOTTOM);
  P.text('APPLICATION  a=' + a.toFixed(2) + ', b=' + b.toFixed(2), tx, boxY - 4);

  P.fill(proof.color + '15');
  P.stroke(proof.color); P.strokeWeight(1);
  P.rect(boxX, boxY, boxW, boxH, 4);

  let fontSize = 13;
  P.textSize(fontSize);
  while (P.textWidth(numStr) > boxW - 24 && fontSize > 9) {
    fontSize -= 0.5;
    P.textSize(fontSize);
  }
  P.noStroke();
  P.fill(proof.color); P.textAlign(P.LEFT, P.CENTER);
  P.text(numStr, boxX + 12, boxY + boxH / 2);

  const vizX = x + textW + 16;
  const vizW = w - textW - PAD - 16;
  const vizY = y + 8;
  const vizH = h - 16;
  if (S.rightView === 'tree') {
    drawAxiomTree(proof, vizX, vizY, vizW, vizH, classified, a, b, c);
  } else if (S.rightView === 'sphere') {
    drawAxiomSphere(proof, vizX, vizY, vizW, vizH, classified, a, b, c);
  } else {
    drawVizOf(proof.vizType, vizX, vizY, vizW, vizH, a, b, c, proof.color);
  }
}
