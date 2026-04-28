'use strict';

export const axioms = [
  {
    code: 'M1',
    label: '\u03bc est positive',
    formal: '\u03bc : \u03a3 \u2192 [0,+\u221e]',
    weight: (a, b, c) => 1,
    role: 'les aires ne sont jamais n\u00e9gatives \u00b7 poids constant',
  },
  {
    code: 'M2',
    label: 'l\'ensemble vide a mesure nulle',
    formal: '\u03bc(\u2205) = 0',
    weight: (a, b, c) => 0,
    role: 'non mobilis\u00e9 (les carr\u00e9s a\u00b2, b\u00b2, c\u00b2 ne sont pas vides)',
  },
  {
    code: 'M3',
    label: '\u03c3-additivit\u00e9',
    formal: '\u2200(A\u2099) disjoints  \u03bc(\u2294\u2099 A\u2099) = \u03a3\u2099 \u03bc(A\u2099)',
    weight: (a, b, c) => a * a + b * b,
    role: 'permet d\'\u00e9crire \u03bc(c\u00b2) = \u03bc(a\u00b2) + \u03bc(b\u00b2) \u00b7 poids = a\u00b2 + b\u00b2',
  },
  {
    code: 'M4',
    label: 'invariance par translation',
    formal: '\u2200x \u2208 \u211d\u207f  \u2200A \u2208 \u03a3  \u03bc(x + A) = \u03bc(A)',
    weight: (a, b, c) => c * c,
    role: 'recomposer les carr\u00e9s par translation sans changer leur aire \u00b7 poids = c\u00b2',
  },
  {
    code: 'M5',
    label: 'normalisation',
    formal: '\u03bc([0,1]\u207f) = 1',
    weight: (a, b, c) => 1,
    role: 'fixe l\'unit\u00e9 d\'aire \u00b7 poids constant',
  },
  {
    code: 'M6',
    label: 'existence et unicit\u00e9 de Lebesgue',
    formal: '\u2203!\u03bc v\u00e9rifiant M1\u2013M5  sur \u212c(\u211d\u207f)',
    weight: (a, b, c) => 1,
    role: 'garantit qu\'une telle mesure existe \u00b7 poids constant',
  },
];

export const formula = '\u03bc(\u25a1_a) + \u03bc(\u25a1_b) = \u03bc(\u25a1_c)';

export const proof = 'a\u00b2 et b\u00b2 se recomposent en c\u00b2 par isom\u00e9tries  \u27f9  \u03bc(a\u00b2) + \u03bc(b\u00b2) = \u03bc(c\u00b2)';

export function format({ a, b, c }) {
  const a2 = (a * a).toFixed(2);
  const b2 = (b * b).toFixed(2);
  const c2 = (c * c).toFixed(2);
  return '\u03bc(' + a2 + ') + \u03bc(' + b2 + ') = \u03bc(' + c2 + ')   \u2192   ' + a2 + ' + ' + b2 + ' = ' + c2;
}
