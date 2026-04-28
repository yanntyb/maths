'use strict';

import { jacobiCount, factorize, factorString, classifyPrimes, decompositions } from './arithmetique.js';

export function drawFrontiere(ctx, rect, tri, color) {
  const p = ctx.p;
  const { x, y, w, h } = rect;
  const { a, b, c } = tri;

  const sParam = (typeof ctx.s === 'number') ? ctx.s : 1.5;
  const N = Math.max(6, Math.ceil(c) + 1);
  const cx = x + w / 2;
  const cy = y + h * 0.45;

  const availW = w * 0.85;
  const availH = h * 0.45;
  const cellPx = Math.min(availW / (N * 1.732), availH / N);
  const isoX = (m, n) => cx + (m - n) * cellPx * 0.866;
  const isoY = (m, n) => cy + (m + n) * cellPx * 0.5;

  p.stroke(220); p.strokeWeight(.5);
  for (let m = -N; m <= N; m++) {
    p.line(isoX(m, -N), isoY(m, -N), isoX(m, N), isoY(m, N));
    p.line(isoX(-N, m), isoY(-N, m), isoX(N, m), isoY(N, m));
  }

  p.stroke('#6B7280'); p.strokeWeight(1.2);
  p.line(isoX(0, 0), isoY(0, 0), isoX(N, 0), isoY(N, 0));
  p.line(isoX(0, 0), isoY(0, 0), isoX(0, N), isoY(0, N));
  p.noStroke(); p.fill('#6B7280');
  p.textSize(11); p.textAlign(p.LEFT, p.TOP);
  p.text('m', isoX(N, 0) + 4, isoY(N, 0));
  p.text('n', isoX(0, N) + 4, isoY(0, N));

  p.stroke(color); p.strokeWeight(2);
  p.noFill();
  p.beginShape();
  for (let th = 0; th <= Math.PI * 2 + 0.1; th += 0.05) {
    const m_ = c * Math.cos(th);
    const n_ = c * Math.sin(th);
    p.vertex(isoX(m_, n_), isoY(m_, n_));
  }
  p.endShape();

  p.noStroke(); p.fill(color);
  p.textSize(11); p.textAlign(p.CENTER, p.BOTTOM);
  p.text('a\u00b2 + b\u00b2 = c\u00b2 (= ' + (c * c).toFixed(2) + ')',
         isoX(c * 0.7, c * 0.7), isoY(c * 0.7, c * 0.7) - 6);

  const chi4Local = k => (k % 4 === 1) ? 1 : (k % 4 === 3 ? -1 : 0);

  const points = [];
  for (let m = -N; m <= N; m++) {
    for (let n = -N; n <= N; n++) {
      if (m === 0 && n === 0) continue;
      const Q = m * m + n * n;
      const height = Math.pow(Q, -sParam);
      points.push({ m, n, Q, height });
    }
  }
  points.sort((pa, pb) => (pa.m + pa.n) - (pb.m + pb.n));

  const heightMax = points.reduce((mx, pt) => Math.max(mx, pt.height), 0);
  const zScale = (h * 0.32) / Math.max(heightMax, 0.01);

  const eps = 0.4;
  points.forEach(pt => {
    pt.onCircle = Math.abs(pt.Q - c * c) < eps;
  });

  points.forEach(pt => {
    const x0 = isoX(pt.m, pt.n);
    const y0 = isoY(pt.m, pt.n);
    const barH = pt.height * zScale;
    const y1 = y0 - barH;

    let col, lw;
    if (pt.onCircle) {
      col = color; lw = 3;
    } else {
      const k = pt.Q;
      const c4 = chi4Local(k);
      if (c4 === 1)       col = '#10B981';
      else if (c4 === -1) col = '#EF4444';
      else                col = '#F59E0B';
      lw = 1.2;
    }

    p.stroke(col); p.strokeWeight(lw);
    p.line(x0, y0, x0, y1);

    if (pt.onCircle) {
      p.noStroke(); p.fill(color);
      p.circle(x0, y0, 7);
      p.fill(color); p.textSize(10);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text('(' + pt.m + ',' + pt.n + ')', x0, y1 - 4);
    }
  });

  p.noStroke(); p.fill(color);
  p.textSize(13); p.textAlign(p.LEFT, p.TOP);
  p.text('Paysage de \u03b6_Q sur \u2124[i]', x + 16, y + 12);
  p.fill('#6B7280'); p.textSize(10);
  p.text('Q(m,n) = m\u00b2+n\u00b2  \u00b7  hauteur = 1/Q^s  \u00b7  s = ' + sParam.toFixed(2), x + 16, y + 30);

  const ly = y + h - 110;
  let lx = x + 20;
  const legendItems = [
    [color, '\u25cf a\u00b2+b\u00b2=c\u00b2'],
    ['#10B981', '\u03c7\u2084=+1 scinde'],
    ['#EF4444', '\u03c7\u2084=\u22121 inerte'],
    ['#F59E0B', '\u03c7\u2084=0 ramifi\u00e9'],
  ];
  p.textSize(10); p.textAlign(p.LEFT, p.CENTER);
  legendItems.forEach(([itemCol, itemTxt]) => {
    p.noStroke(); p.fill(itemCol);
    p.circle(lx + 4, ly + 4, 8);
    p.fill('#6B7280');
    p.text(itemTxt, lx + 14, ly + 4);
    lx += p.textWidth(itemTxt) + 32;
  });

  const cInt = Math.round(c);
  const cIsInt = Math.abs(c - cInt) < 0.05;
  const cSq = cInt * cInt;

  const panelW = w - 32;
  const panelH = 120;
  const panelX = x + 16;
  const panelY = y + h - panelH - 8;

  p.noStroke();
  p.fill(color + '10');
  p.rect(panelX, panelY, panelW, panelH, 6);
  p.stroke(color + '50'); p.strokeWeight(1); p.noFill();
  p.rect(panelX, panelY, panelW, panelH, 6);

  if (cInt > 0) {
    const factors = factorize(cSq);
    const factorStr = factorString(factors);
    const { d1, d3, r2 } = jacobiCount(cSq);
    const { split, inert, ramif } = classifyPrimes(factors);
    const decs = decompositions(cSq);

    p.noStroke();
    p.fill(color);
    p.textSize(36); p.textAlign(p.LEFT, p.TOP);
    p.text(decs.length, panelX + 16, panelY + 6);
    p.fill(color + 'CC'); p.textSize(10);
    p.text('SOLUTION' + (decs.length > 1 ? 'S' : ''), panelX + 16, panelY + 48);
    p.text('m\u00b2 + n\u00b2 = c\u00b2', panelX + 16, panelY + 62);
    if (!cIsInt) {
      p.fill('#9CA3AF'); p.textSize(9);
      p.text('arrondi \u00e0 c=' + cInt, panelX + 16, panelY + 78);
    }

    const sep1 = panelX + 100;
    p.stroke(color + '40'); p.strokeWeight(1);
    p.line(sep1, panelY + 10, sep1, panelY + panelH - 10);

    const colDx = sep1 + 14;
    const col2W = (panelW - 100) * 0.55;

    p.noStroke(); p.fill(color); p.textSize(11);
    p.textAlign(p.LEFT, p.TOP);
    p.text('Jacobi  \u00b7  c\u00b2 = ' + cSq + ' = ' + factorStr, colDx, panelY + 8);

    p.fill('#4B5563'); p.textSize(10);
    p.text('d\u2081 = ' + d1 + '  \u00b7  d\u2083 = ' + d3, colDx, panelY + 26);

    p.fill(color); p.textSize(11);
    p.text('r\u2082 = 4\u00b7(d\u2081 \u2212 d\u2083) = ' + r2 + '  paires sign\u00e9es', colDx, panelY + 42);

    p.fill('#4B5563'); p.textSize(10);
    let txt2 = decs.map(([m, n]) => m + '\u00b2+' + n + '\u00b2').join(' \u00b7 ');
    while (p.textWidth(txt2) > col2W - 8 && txt2.length > 20) {
      txt2 = txt2.slice(0, -1);
    }
    p.text(txt2, colDx, panelY + 60);

    if (decs.length === 1) {
      p.fill('#9CA3AF'); p.textSize(9);
      p.text('seule (0,c) \u2014 essayer c = 5, 13, 17, 25, 65', colDx, panelY + 80);
    }

    const sep2 = sep1 + col2W + 14;
    p.stroke(color + '40'); p.strokeWeight(1);
    p.line(sep2, panelY + 10, sep2, panelY + panelH - 10);

    const ex = sep2 + 14;
    p.noStroke(); p.fill(color); p.textSize(11);
    p.textAlign(p.LEFT, p.TOP);
    p.text('\u03c7\u2084 \u2014 factorisation dans \u2124[i]', ex, panelY + 8);

    let yy = panelY + 26;
    if (split.length > 0) {
      p.fill('#10B981'); p.textSize(10);
      const s = split.map(([pr, e]) => pr + (e > 1 ? '^' + e : '')).join(', ');
      p.text('\u25cf scind\u00e9s (\u22611) : ' + s, ex, yy);
      yy += 14;
    }
    if (inert.length > 0) {
      p.fill('#EF4444'); p.textSize(10);
      const s = inert.map(([pr, e]) => pr + (e > 1 ? '^' + e : '')).join(', ');
      p.text('\u25cf inertes (\u22613) : ' + s, ex, yy);
      yy += 14;
    }
    if (ramif.length > 0) {
      p.fill('#F59E0B'); p.textSize(10);
      const s = ramif.map(([pr, e]) => pr + (e > 1 ? '^' + e : '')).join(', ');
      p.text('\u25cf ramifi\u00e9 (=2) : ' + s, ex, yy);
      yy += 14;
    }

    const inertOdd = inert.filter(([pr, e]) => e % 2 === 1).length;
    const fermatOK = inertOdd === 0;
    p.fill(fermatOK ? '#10B981' : '#EF4444');
    p.textSize(10);
    p.text(fermatOK ? '\u2713 Fermat : c\u00b2 s\'\u00e9crit a\u00b2+b\u00b2' : '\u2717 Fermat : d\u00e9composition impossible',
           ex, yy + 4);
  }
}
