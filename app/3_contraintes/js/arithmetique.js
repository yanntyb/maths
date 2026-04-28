'use strict';

export function jacobiCount(N) {
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

export function factorize(n) {
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

export function chi4(p) {
  if (p === 2) return 0;
  return (p % 4 === 1) ? 1 : -1;
}

export function classifyPrimes(factors) {
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

export function factorString(factors) {
  return Object.entries(factors)
    .map(([p, e]) => e === 1 ? p : p + '^' + e)
    .join(' \u00d7 ');
}

export function decompositions(cSq) {
  const decs = [];
  for (let m = 0; m * m <= cSq; m++) {
    const n2 = cSq - m * m;
    const n = Math.round(Math.sqrt(n2));
    if (n * n === n2 && n >= m) {
      decs.push([m, n]);
    }
  }
  return decs;
}
