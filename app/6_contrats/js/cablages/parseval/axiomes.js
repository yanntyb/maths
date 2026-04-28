'use strict';

export const axioms = [
  {
    code: 'F1',
    label: '\u211d-espace vectoriel',
    formal: '(E, +, \u00b7) \u211d-EV',
    weight: (a, b, c) => 1,
    role: 'structure pour combinaisons lin\u00e9aires \u00b7 poids constant',
  },
  {
    code: 'F2',
    label: 'produit scalaire d\u00e9fini',
    formal: '\u27e8\u00b7,\u00b7\u27e9 : E \u00d7 E \u2192 \u211d',
    weight: (a, b, c) => 1,
    role: 'n\u00e9cessaire pour d\u00e9finir Aligner et Normer \u00b7 poids constant',
  },
  {
    code: 'F3',
    label: 'frame orthonormal {e\u2081, e\u2082}',
    formal: '\u27e8e\u1d62|e\u2c7c\u27e9 = \u03b4\u1d62\u2c7c  (Gram = I)',
    weight: (a, b, c) => 1,
    role: 'la Gram est l\'identit\u00e9, ce qui rend Analyser une isom\u00e9trie \u00b7 poids constant',
  },
  {
    code: 'F4',
    label: 'Synth\u00e9tiser',
    formal: '\u03a6 : \u2113\u00b2(I) \u2192 E,  (a,b) \u21a6 a\u00b7e\u2081 + b\u00b7e\u2082',
    weight: (a, b, c) => Math.sqrt(a * a + b * b),
    role: 'reconstruit v depuis ses coefficients \u00b7 poids = ||v||',
  },
  {
    code: 'F5',
    label: 'Analyser',
    formal: '\u03a6* : E \u2192 \u2113\u00b2(I),  v \u21a6 (\u27e8e\u2081|v\u27e9, \u27e8e\u2082|v\u27e9)',
    weight: (a, b, c) => a * a + b * b,
    role: 'extrait les coefficients de v \u00b7 poids = a\u00b2+b\u00b2',
  },
  {
    code: 'F6',
    label: 'Normer',
    formal: '||v||\u00b2 := \u27e8v,v\u27e9',
    weight: (a, b, c) => c * c,
    role: 'mesure la longueur via auto-Aligner \u00b7 poids = c\u00b2',
  },
  {
    code: 'F7',
    label: 'Parseval \u2014 isom\u00e9trie',
    formal: '||v||\u00b2 = \u03a3\u2096 |\u27e8e\u2096|v\u27e9|\u00b2   (si Gram = I)',
    weight: (a, b, c) => a * a + b * b,
    role: 'conservation de la norme par d\u00e9composition \u00b7 poids = a\u00b2+b\u00b2',
  },
];

export const formula = '||v||\u00b2 = |\u27e8e\u2081|v\u27e9|\u00b2 + |\u27e8e\u2082|v\u27e9|\u00b2 = a\u00b2 + b\u00b2';

export const proof = 'v = a\u00b7e\u2081 + b\u00b7e\u2082.  Synth\u00e9tiser puis Analyser = id (Gram=I).  Donc ||v||\u00b2 = a\u00b2+b\u00b2 = c\u00b2';

export function format({ a, b, c }) {
  const a2 = (a * a).toFixed(2);
  const b2 = (b * b).toFixed(2);
  const c2 = (c * c).toFixed(2);
  return '|\u27e8e\u2081|v\u27e9|\u00b2 + |\u27e8e\u2082|v\u27e9|\u00b2 = ' + a2 + ' + ' + b2 + ' = ' + (parseFloat(a2) + parseFloat(b2)).toFixed(2) + ' = ||v||\u00b2 = ' + c2;
}
