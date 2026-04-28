'use strict';

export const axioms = [
  {
    code: 'P1',
    label: 'par 2 points distincts passe une unique droite',
    formal: '\u2200p\u2081 p\u2082  p\u2081\u2260p\u2082  \u27f9  \u2203!\u2113  (p\u2081\u2208\u2113 \u2227 p\u2082\u2208\u2113)',
    weight: (a, b, c) => 4,
    role: 'tracer les c\u00f4t\u00e9s du grand carr\u00e9 \u00b7 poids constant',
  },
  {
    code: 'P2',
    label: 'tout segment se prolonge en droite',
    formal: '\u2200[p,q]  \u2203\u2113  ([p,q] \u2282 \u2113)',
    weight: (a, b, c) => 4,
    role: 'prolonger pour fermer le grand carr\u00e9 \u00b7 poids constant',
  },
  {
    code: 'P3',
    label: 'cercle de centre et rayon donn\u00e9s existe',
    formal: '\u2200c \u2200r>0  \u2203C  C = {x : d(x,c) = r}',
    weight: (a, b, c) => 0,
    role: 'non mobilis\u00e9 dans cette preuve par d\u00e9composition',
  },
  {
    code: 'P4',
    label: 'tous les angles droits sont \u00e9gaux',
    formal: '\u2200\u03b1 \u2200\u03b2  (D(\u03b1) \u2227 D(\u03b2))  \u27f9  \u03b1 \u2261 \u03b2',
    weight: (a, b, c) => 2 * a * b,
    role: 'produit les 4 triangles d\'aire \u00bdab \u00b7 poids = 2ab',
  },
  {
    code: 'P5',
    label: 'postulat des parall\u00e8les (unicit\u00e9)',
    formal: '\u2200\u2113 \u2200p\u2209\u2113  \u2203!\u2113\u2032  (p\u2208\u2113\u2032 \u2227 \u2113\u2032 \u2225 \u2113)',
    weight: (a, b, c) => c * c,
    role: 'ferme le carr\u00e9 central d\'aire c\u00b2 \u00b7 poids = c\u00b2',
  },
  {
    code: 'CN1',
    label: 'les choses \u00e9gales \u00e0 une m\u00eame chose sont \u00e9gales entre elles',
    formal: '\u2200a b c  (a=c \u2227 b=c)  \u27f9  a=b',
    weight: (a, b, c) => 1,
    role: 'transitivit\u00e9 pour comparer les aires \u00b7 poids constant',
  },
  {
    code: 'CN2',
    label: 'si \u00e0 des \u00e9gaux on ajoute des \u00e9gaux, les sommes sont \u00e9gales',
    formal: '\u2200a b c d  (a=b \u2227 c=d)  \u27f9  a+c = b+d',
    weight: (a, b, c) => 4 * 0.5 * a * b + c * c,
    role: 'assemble triangles + c\u00b2 = (a+b)\u00b2 \u00b7 poids = 2ab + c\u00b2',
  },
  {
    code: 'CN4',
    label: 'les choses qui co\u00efncident sont \u00e9gales',
    formal: '\u2200F\u2081 F\u2082  (\u2203g\u2208Iso  g(F\u2081)=F\u2082)  \u27f9  F\u2081 \u2261 F\u2082',
    weight: (a, b, c) => 2 * a * b,
    role: '4 triangles congruents d\'aire \u00bdab chacun \u00b7 poids = 2ab',
  },
  {
    code: 'CN5',
    label: 'le tout est plus grand que la partie',
    formal: '\u2200F G  G \u2282 F  \u27f9  A(G) < A(F)',
    weight: (a, b, c) => 1,
    role: 'structure de d\u00e9coupage du grand carr\u00e9 \u00b7 poids constant',
  },
];

export const formula = 'a\u00b2 + b\u00b2 = c\u00b2';

export const proof = '(a+b)\u00b2 = 4\u00b7(\u00bdab) + c\u00b2  \u27f9  a\u00b2 + b\u00b2 = c\u00b2';

export function format({ a, b, c }) {
  const ab2 = ((a + b) * (a + b)).toFixed(2);
  const tri = (4 * 0.5 * a * b).toFixed(2);
  const c2 = (c * c).toFixed(2);
  return '(' + a.toFixed(1) + '+' + b.toFixed(1) + ')\u00b2 = 4\u00b7\u00bd\u00b7' + a.toFixed(1) + '\u00b7' + b.toFixed(1) + ' + c\u00b2  \u2192  ' + ab2 + ' = ' + tri + ' + ' + c2;
}
