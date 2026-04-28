'use strict';

import { P, S } from './state.js';

function jacobiCount(N) {
  if (N <= 0) return { d1: 0, d3: 0, r2: 0 };
  let d1 = 0, d3 = 0;
  for (let d = 1; d <= N; d++) {
    if (N % d !== 0) continue;
    if (d % 2 === 0) continue;
    if (d % 4 === 1) d1++;
    else if (d % 4 === 3) d3++;
  }
  return { d1, d3, r2: 4 * (d1 - d3) };
}

function factorize(n) {
  const factors = {};
  let x = n;
  for (let p = 2; p * p <= x; p++) {
    while (x % p === 0) {
      factors[p] = (factors[p] || 0) + 1;
      x = Math.floor(x / p);
    }
  }
  if (x > 1) factors[x] = (factors[x] || 0) + 1;
  return factors;
}

function chi4(p) {
  if (p === 2) return 0;
  return (p % 4 === 1) ? 1 : -1;
}

function classifyPrimes(factors) {
  const split = [], inert = [], ramif = [];
  Object.entries(factors).forEach(([p, e]) => {
    const pn = parseInt(p);
    const c = chi4(pn);
    if (c === 1)       split.push([pn, e]);
    else if (c === -1) inert.push([pn, e]);
    else               ramif.push([pn, e]);
  });
  return { split, inert, ramif };
}

function factorString(factors) {
  return Object.entries(factors)
    .map(([p, e]) => e === 1 ? p : p + '^' + e)
    .join(' \u00d7 ');
}

export function drawFrontiere(x, y, w, h, a, b, c, color) {
  const sParam = (typeof S.s === 'number') ? S.s : 1.5;
  const N = Math.max(6, Math.ceil(c) + 1);
  const cx = x + w / 2;
  const cy = y + h * 0.45;

  const availW = w * 0.85;
  const availH = h * 0.45;
  const cellPx = Math.min(availW / (N * 1.732), availH / N);
  const isoX = (m, n) => cx + (m - n) * cellPx * 0.866;
  const isoY = (m, n) => cy + (m + n) * cellPx * 0.5;

  P.stroke(220); P.strokeWeight(.5);
  for (let m = -N; m <= N; m++) {
    P.line(isoX(m, -N), isoY(m, -N), isoX(m, N), isoY(m, N));
    P.line(isoX(-N, m), isoY(-N, m), isoX(N, m), isoY(N, m));
  }

  P.stroke('#6B7280'); P.strokeWeight(1.2);
  P.line(isoX(0, 0), isoY(0, 0), isoX(N, 0), isoY(N, 0));
  P.line(isoX(0, 0), isoY(0, 0), isoX(0, N), isoY(0, N));
  P.noStroke(); P.fill('#6B7280');
  P.textSize(11); P.textAlign(P.LEFT, P.TOP);
  P.text('m', isoX(N, 0) + 4, isoY(N, 0));
  P.text('n', isoX(0, N) + 4, isoY(0, N));

  P.stroke(color); P.strokeWeight(2);
  P.noFill();
  P.beginShape();
  for (let th = 0; th <= Math.PI * 2 + 0.1; th += 0.05) {
    const m_ = c * Math.cos(th);
    const n_ = c * Math.sin(th);
    P.vertex(isoX(m_, n_), isoY(m_, n_));
  }
  P.endShape();

  P.noStroke(); P.fill(color);
  P.textSize(11); P.textAlign(P.CENTER, P.BOTTOM);
  P.text('a\u00b2 + b\u00b2 = c\u00b2 (= ' + (c*c).toFixed(2) + ')',
         isoX(c*0.7, c*0.7), isoY(c*0.7, c*0.7) - 6);

  const chi4Local = k => (k % 4 === 1) ? 1 : (k % 4 === 3 ? -1 : 0);

  const points = [];
  for (let m = -N; m <= N; m++) {
    for (let n = -N; n <= N; n++) {
      if (m === 0 && n === 0) continue;
      const Q = m*m + n*n;
      const height = Math.pow(Q, -sParam);
      points.push({ m, n, Q, height });
    }
  }
  points.sort((a, b) => (a.m + a.n) - (b.m + b.n));

  const heightMax = points.reduce((mx, p) => Math.max(mx, p.height), 0);
  const zScale = (h * 0.32) / Math.max(heightMax, 0.01);

  const eps = 0.4;
  points.forEach(pt => {
    pt.onCircle = Math.abs(pt.Q - c*c) < eps;
  });

  points.forEach(pt => {
    const x0 = isoX(pt.m, pt.n);
    const y0 = isoY(pt.m, pt.n);
    const barH = pt.height * zScale;
    const x1 = x0;
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

    P.stroke(col); P.strokeWeight(lw);
    P.line(x0, y0, x1, y1);

    if (pt.onCircle) {
      P.noStroke(); P.fill(color);
      P.circle(x0, y0, 7);
      P.fill(color); P.textSize(10);
      P.textAlign(P.CENTER, P.BOTTOM);
      P.text('(' + pt.m + ',' + pt.n + ')', x1, y1 - 4);
    }
  });

  P.noStroke(); P.fill(color);
  P.textSize(13); P.textAlign(P.LEFT, P.TOP);
  P.text('Paysage de \u03b6_Q sur \u2124[i]', x + 16, y + 12);
  P.fill('#6B7280'); P.textSize(10);
  P.text('Q(m,n) = m\u00b2+n\u00b2  \u00b7  hauteur = 1/Q^s  \u00b7  s = ' + sParam.toFixed(2), x + 16, y + 30);

  const ly = y + h - 110;
  let lx = x + 20;
  const items = [
    [color, '\u25cf a\u00b2+b\u00b2=c\u00b2'],
    ['#10B981', '\u03c7\u2084=+1 scinde'],
    ['#EF4444', '\u03c7\u2084=\u22121 inerte'],
    ['#F59E0B', '\u03c7\u2084=0 ramifi\u00e9'],
  ];
  P.textSize(10); P.textAlign(P.LEFT, P.CENTER);
  items.forEach(([itemCol, itemTxt]) => {
    P.noStroke(); P.fill(itemCol);
    P.circle(lx + 4, ly + 4, 8);
    P.fill('#6B7280');
    P.text(itemTxt, lx + 14, ly + 4);
    lx += P.textWidth(itemTxt) + 32;
  });

  const cInt = Math.round(c);
  const cIsInt = Math.abs(c - cInt) < 0.05;
  const cSq = cInt * cInt;

  const panelW = w - 32;
  const panelH = 120;
  const panelX = x + 16;
  const panelY = y + h - panelH - 8;

  P.noStroke();
  P.fill(color + '10');
  P.rect(panelX, panelY, panelW, panelH, 6);
  P.stroke(color + '50'); P.strokeWeight(1); P.noFill();
  P.rect(panelX, panelY, panelW, panelH, 6);

  if (cInt > 0) {
    const factors = factorize(cSq);
    const factorStr = factorString(factors);
    const { d1, d3, r2 } = jacobiCount(cSq);
    const { split, inert, ramif } = classifyPrimes(factors);

    const decs = [];
    for (let m = 0; m * m <= cSq; m++) {
      const n2 = cSq - m * m;
      const n = Math.round(Math.sqrt(n2));
      if (n * n === n2 && n >= m) {
        decs.push([m, n]);
      }
    }

    P.noStroke();
    P.fill(color);
    P.textSize(36); P.textAlign(P.LEFT, P.TOP);
    P.text(decs.length, panelX + 16, panelY + 6);
    P.fill(color + 'CC'); P.textSize(10);
    P.text('SOLUTION' + (decs.length > 1 ? 'S' : ''), panelX + 16, panelY + 48);
    P.text('m\u00b2 + n\u00b2 = c\u00b2', panelX + 16, panelY + 62);
    if (!cIsInt) {
      P.fill('#9CA3AF'); P.textSize(9);
      P.text('arrondi \u00e0 c=' + cInt, panelX + 16, panelY + 78);
    }

    const sep1 = panelX + 100;
    P.stroke(color + '40'); P.strokeWeight(1);
    P.line(sep1, panelY + 10, sep1, panelY + panelH - 10);

    const dx = sep1 + 14;
    const col2W = (panelW - 100) * 0.55;

    P.noStroke(); P.fill(color); P.textSize(11);
    P.textAlign(P.LEFT, P.TOP);
    P.text('Jacobi  \u00b7  c\u00b2 = ' + cSq + ' = ' + factorStr, dx, panelY + 8);

    P.fill('#4B5563'); P.textSize(10);
    P.text('d\u2081 = ' + d1 + '  \u00b7  d\u2083 = ' + d3, dx, panelY + 26);

    P.fill(color); P.textSize(11);
    P.text('r\u2082 = 4\u00b7(d\u2081 \u2212 d\u2083) = ' + r2 + '  paires sign\u00e9es', dx, panelY + 42);

    P.fill('#4B5563'); P.textSize(10);
    let txt2 = decs.map(([m, n]) => m + '\u00b2+' + n + '\u00b2').join(' \u00b7 ');
    while (P.textWidth(txt2) > col2W - 8 && txt2.length > 20) {
      txt2 = txt2.slice(0, -1);
    }
    P.text(txt2, dx, panelY + 60);

    if (decs.length === 1) {
      P.fill('#9CA3AF'); P.textSize(9);
      P.text('seule (0,c) \u2014 essayer c = 5, 13, 17, 25, 65', dx, panelY + 80);
    }

    const sep2 = sep1 + col2W + 14;
    P.stroke(color + '40'); P.strokeWeight(1);
    P.line(sep2, panelY + 10, sep2, panelY + panelH - 10);

    const ex = sep2 + 14;
    P.noStroke(); P.fill(color); P.textSize(11);
    P.textAlign(P.LEFT, P.TOP);
    P.text('\u03c7\u2084 \u2014 factorisation dans \u2124[i]', ex, panelY + 8);

    let yy = panelY + 26;
    if (split.length > 0) {
      P.fill('#10B981'); P.textSize(10);
      const s = split.map(([p, e]) => p + (e > 1 ? '^' + e : '')).join(', ');
      P.text('\u25cf scind\u00e9s (\u22611) : ' + s, ex, yy);
      yy += 14;
    }
    if (inert.length > 0) {
      P.fill('#EF4444'); P.textSize(10);
      const s = inert.map(([p, e]) => p + (e > 1 ? '^' + e : '')).join(', ');
      P.text('\u25cf inertes (\u22613) : ' + s, ex, yy);
      yy += 14;
    }
    if (ramif.length > 0) {
      P.fill('#F59E0B'); P.textSize(10);
      const s = ramif.map(([p, e]) => p + (e > 1 ? '^' + e : '')).join(', ');
      P.text('\u25cf ramifi\u00e9 (=2) : ' + s, ex, yy);
      yy += 14;
    }

    const inertOdd = inert.filter(([p, e]) => e % 2 === 1).length;
    const fermatOK = inertOdd === 0;
    P.fill(fermatOK ? '#10B981' : '#EF4444');
    P.textSize(10);
    P.text(fermatOK ? '\u2713 Fermat : c\u00b2 s\'\u00e9crit a\u00b2+b\u00b2' : '\u2717 Fermat : d\u00e9composition impossible',
           ex, yy + 4);
  }
}
