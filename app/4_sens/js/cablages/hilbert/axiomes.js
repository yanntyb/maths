'use strict';

export const axioms = [
  {
    code: 'E1',
    label: 'E est un \u211d-espace vectoriel',
    formal: '(E, +, \u00b7) \u211d-EV',
    weight: (a, b, c) => 1,
    role: 'structure pour additionner v et w \u00b7 poids constant',
  },
  {
    code: 'E2',
    label: 'le produit scalaire est d\u00e9fini',
    formal: '\u27e8\u00b7,\u00b7\u27e9 : E \u00d7 E \u2192 \u211d',
    weight: (a, b, c) => 1,
    role: 'op\u00e9ration de base de toute la preuve \u00b7 poids constant',
  },
  {
    code: 'E3',
    label: 'bilin\u00e9arit\u00e9',
    formal: '\u2200v w w\u2032 \u03bb \u03bc  \u27e8v, \u03bbw+\u03bcw\u2032\u27e9 = \u03bb\u27e8v,w\u27e9 + \u03bc\u27e8v,w\u2032\u27e9',
    weight: (a, b, c) => a * a + b * b,
    role: 'd\u00e9veloppe \u27e8v+w,v+w\u27e9 = \u27e8v,v\u27e9 + 2\u27e8v,w\u27e9 + \u27e8w,w\u27e9 \u00b7 poids = a\u00b2 + b\u00b2',
  },
  {
    code: 'E4',
    label: 'sym\u00e9trie',
    formal: '\u2200v w  \u27e8v,w\u27e9 = \u27e8w,v\u27e9',
    weight: (a, b, c) => 1,
    role: 'autorise \u27e8v,w\u27e9 = \u27e8w,v\u27e9 dans le d\u00e9veloppement \u00b7 poids constant',
  },
  {
    code: 'E5',
    label: 'positivit\u00e9',
    formal: '\u2200v  \u27e8v,v\u27e9 \u2a7e 0',
    weight: (a, b, c) => a * a + b * b,
    role: 'permet de d\u00e9finir la norme \u00b7 poids = a\u00b2 + b\u00b2',
  },
  {
    code: 'E6',
    label: 'd\u00e9finie',
    formal: '\u2200v  \u27e8v,v\u27e9 = 0  \u21d4  v = 0',
    weight: (a, b, c) => 0.5,
    role: 'caract\u00e9rise l\'unicit\u00e9 de la norme \u00b7 poids constant',
  },
  {
    code: 'D1',
    label: 'norme induite',
    formal: '||v|| := \u221a\u27e8v,v\u27e9',
    weight: (a, b, c) => Math.sqrt(a * a + b * b),
    role: 'passage du produit scalaire aux longueurs \u00b7 poids = c',
  },
  {
    code: 'D2',
    label: 'orthogonalit\u00e9',
    formal: 'v \u22a5 w  :\u21d4  \u27e8v,w\u27e9 = 0',
    weight: (a, b, c) => 2 * a * b,
    role: 'annule le terme crois\u00e9 2\u27e8v,w\u27e9 = 2ab \u00b7 poids = 2ab',
  },
];

export const formula = '||v+w||\u00b2 = ||v||\u00b2 + ||w||\u00b2  si  v \u22a5 w';

export const proof = '||v+w||\u00b2 = \u27e8v+w,v+w\u27e9 = \u27e8v,v\u27e9 + 2\u27e8v,w\u27e9 + \u27e8w,w\u27e9.  Si \u27e8v,w\u27e9=0 : ||v+w||\u00b2 = ||v||\u00b2 + ||w||\u00b2';

export function format({ a, b, c }) {
  const a2 = (a * a).toFixed(2);
  const b2 = (b * b).toFixed(2);
  const c2 = (c * c).toFixed(2);
  return '||v||\u00b2=' + b2 + ',  ||w||\u00b2=' + a2 + '  \u2192  ||v+w||\u00b2 = ' + (parseFloat(a2) + parseFloat(b2)).toFixed(2) + ' = ' + c2;
}
