'use strict';

function isStructural(weightFn) {
  const w1 = weightFn(3, 4, 5);
  const w2 = weightFn(5, 12, 13);
  return Math.abs(w1 - w2) < 0.001;
}

export function classify(proof, tri) {
  return proof.axioms.map(ax => ({
    ax,
    code: ax.code,
    isStructural: isStructural(ax.weight),
    weight: ax.weight(tri.a, tri.b, tri.c),
  }));
}

export function applyNumerically(proof, tri) {
  return proof.format(tri);
}
