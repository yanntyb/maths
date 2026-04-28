'use strict';

export const axioms = [
  {
    code: 'A1',
    label: 'identité du binôme',
    formal: '(a+b)² = a² + 2ab + b²',
    weight: (a, b, c) => 1,
    role: 'développer le carré du binôme · poids constant',
  },
  {
    code: 'A2',
    label: 'commutativité de l\'addition',
    formal: '∀x y  x + y = y + x',
    weight: (a, b, c) => 1,
    role: 'regrouper les termes · poids constant',
  },
  {
    code: 'A3',
    label: 'associativité de l\'addition',
    formal: '∀x y z  (x + y) + z = x + (y + z)',
    weight: (a, b, c) => 1,
    role: 'restructurer les sommes · poids constant',
  },
  {
    code: 'A4',
    label: 'propriété : x + y = z + y  ⟹  x = z',
    formal: '∀x y z  (x + y = z + y) ⟹ x = z',
    weight: (a, b, c) => 2 * a * b,
    role: 'annuler 2ab des deux côtés · poids = 2ab',
  },
  {
    code: 'N1',
    label: 'identité géométrique : (a+b)² = c² + 2ab',
    formal: '∀a b c  (a² + b² = c²) ⟹ (a+b)² = c² + 2ab',
    weight: (a, b, c) => a * a + b * b + c * c,
    role: 'vérifier l\'identité de rearrangement · poids = a² + b² + c²',
  },
  {
    code: 'N2',
    label: 'égalité des deux formes du développement',
    formal: 'a² + 2ab + b² = (a²+b²) + 2ab',
    weight: (a, b, c) => 1,
    role: 'reconnaître les deux expressions · poids constant',
  },
];

export const formula = 'a² + b² = c²';

export const proof = '(a+b)² = a² + 2ab + b² = (a²+b²) + 2ab = c² + 2ab  ⟹  a² + b² = c²';

export function format({ a, b, c }) {
  const ab2 = ((a + b) * (a + b)).toFixed(2);
  const a2 = (a * a).toFixed(2);
  const b2 = (b * b).toFixed(2);
  const sum = (a * a + b * b).toFixed(2);
  const c2 = (c * c).toFixed(2);
  return '(' + a.toFixed(1) + '+' + b.toFixed(1) + ')² = ' + ab2 + '  |  a² + 2ab + b² = ' + a2 + ' + ' + (2*a*b).toFixed(2) + ' + ' + b2 + ' = ' + sum + ' + ' + (2*a*b).toFixed(2);
}
