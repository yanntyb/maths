'use strict';

export const axioms = [
  {
    code: 'A1',
    label: 'identité du binôme',
    formal: '(a+b)² = a² + 2ab + b²',
    weight: (a, b, c) => 1,
    role: 'reconnaître la forme · poids constant',
  },
  {
    code: 'A4',
    label: 'propriété : x + y = z + y  ⟹  x = z',
    formal: '∀x y z  (x + y = z + y) ⟹ x = z',
    weight: (a, b, c) => 1,
    role: 'isoler c² en annulant 2ab · poids constant',
  },
  {
    code: 'N3',
    label: 'calcul numérique des carrés',
    formal: '∀x ∈ ℝ  x² ∈ ℝ (calculable)',
    weight: (a, b, c) => a * a + b * b,
    role: 'calculer a² et b² · poids = a² + b²',
  },
  {
    code: 'N4',
    label: 'calcul numérique de la racine',
    formal: '∀x ≥ 0 ∈ ℝ  √x ∈ ℝ (calculable)',
    weight: (a, b, c) => c,
    role: 'extraire c = √(a² + b²) · poids = c',
  },
];

export const formula = 'c = √(a² + b²)';

export const proof = 'Currying de l\'algèbre : fixer a, b ⟹ c = √(a² + b²)';

export function format({ a, b, c }) {
  const a2 = (a * a).toFixed(2);
  const b2 = (b * b).toFixed(2);
  const sum = (a * a + b * b).toFixed(2);
  const computed = Math.sqrt(a * a + b * b).toFixed(2);
  return 'c = √(' + a.toFixed(1) + '² + ' + b.toFixed(1) + '²)  =  √(' + a2 + ' + ' + b2 + ')  =  √' + sum + '  =  ' + computed;
}
