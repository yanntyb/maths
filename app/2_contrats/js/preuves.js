'use strict';

export const PREUVES = [
  {
    id: 'euclid',
    title: 'Preuve 1 \u2014 G\u00e9om\u00e9trie euclidienne',
    color: '#3B82F6',
    axioms: [
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
    ],
    formula: 'a\u00b2 + b\u00b2 = c\u00b2',
    proof: '(a+b)\u00b2 = 4\u00b7(\u00bdab) + c\u00b2  \u27f9  a\u00b2 + b\u00b2 = c\u00b2',
    format: ({ a, b, c }) => {
      const ab2 = ((a + b) * (a + b)).toFixed(2);
      const tri = (4 * 0.5 * a * b).toFixed(2);
      const c2 = (c * c).toFixed(2);
      return '(' + a.toFixed(1) + '+' + b.toFixed(1) + ')\u00b2 = 4\u00b7\u00bd\u00b7' + a.toFixed(1) + '\u00b7' + b.toFixed(1) + ' + c\u00b2  \u2192  ' + ab2 + ' = ' + tri + ' + ' + c2;
    },
  },
  {
    id: 'measure',
    title: 'Preuve 2 \u2014 Th\u00e9orie de la mesure',
    color: '#10B981',
    axioms: [
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
    ],
    formula: '\u03bc(\u25a1_a) + \u03bc(\u25a1_b) = \u03bc(\u25a1_c)',
    proof: 'a\u00b2 et b\u00b2 se recomposent en c\u00b2 par isom\u00e9tries  \u27f9  \u03bc(a\u00b2) + \u03bc(b\u00b2) = \u03bc(c\u00b2)',
    format: ({ a, b, c }) => {
      const a2 = (a * a).toFixed(2);
      const b2 = (b * b).toFixed(2);
      const c2 = (c * c).toFixed(2);
      return '\u03bc(' + a2 + ') + \u03bc(' + b2 + ') = \u03bc(' + c2 + ')   \u2192   ' + a2 + ' + ' + b2 + ' = ' + c2;
    },
  },
  {
    id: 'hilbert',
    title: 'Preuve 3 \u2014 Espace pr\u00e9hilbertien',
    color: '#8B5CF6',
    axioms: [
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
        formal: 'v \u22a5 w  :\u27fa  \u27e8v,w\u27e9 = 0',
        weight: (a, b, c) => 2 * a * b,
        role: 'annule le terme crois\u00e9 2\u27e8v,w\u27e9 = 2ab \u00b7 poids = 2ab',
      },
    ],
    formula: '||v+w||\u00b2 = ||v||\u00b2 + ||w||\u00b2  si  v \u22a5 w',
    proof: '||v+w||\u00b2 = \u27e8v+w,v+w\u27e9 = \u27e8v,v\u27e9 + 2\u27e8v,w\u27e9 + \u27e8w,w\u27e9.  Si \u27e8v,w\u27e9=0 : ||v+w||\u00b2 = ||v||\u00b2 + ||w||\u00b2',
    format: ({ a, b, c }) => {
      const a2 = (a * a).toFixed(2);
      const b2 = (b * b).toFixed(2);
      const c2 = (c * c).toFixed(2);
      return '||v||\u00b2=' + b2 + ',  ||w||\u00b2=' + a2 + '  \u2192  ||v+w||\u00b2 = ' + (parseFloat(a2) + parseFloat(b2)).toFixed(2) + ' = ' + c2;
    },
  },
  {
    id: 'parseval',
    title: 'Preuve 4 \u2014 Parseval (frame orthonormal)',
    color: '#0EA5E9',
    axioms: [
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
    ],
    formula: '||v||\u00b2 = |\u27e8e\u2081|v\u27e9|\u00b2 + |\u27e8e\u2082|v\u27e9|\u00b2 = a\u00b2 + b\u00b2',
    proof: 'v = a\u00b7e\u2081 + b\u00b7e\u2082.  Synth\u00e9tiser puis Analyser = id (Gram=I).  Donc ||v||\u00b2 = a\u00b2+b\u00b2 = c\u00b2',
    format: ({ a, b, c }) => {
      const a2 = (a * a).toFixed(2);
      const b2 = (b * b).toFixed(2);
      const c2 = (c * c).toFixed(2);
      return '|\u27e8e\u2081|v\u27e9|\u00b2 + |\u27e8e\u2082|v\u27e9|\u00b2 = ' + a2 + ' + ' + b2 + ' = ' + (parseFloat(a2) + parseFloat(b2)).toFixed(2) + ' = ||v||\u00b2 = ' + c2;
    },
  },
  {
    id: 'frontiere',
    title: 'M\u00e9ta-preuve \u2014 Fronti\u00e8re de convergence',
    color: '#EC4899',
    isMeta: true,
    axioms: [
      {
        code: 'Z1',
        label: 'forme quadratique Q(m,n) = m\u00b2 + n\u00b2',
        formal: 'Q : \u2124\u00b2 \u2192 \u211d\u208a',
        weight: (a, b, c) => 1,
        role: 'structure de la forme \u00e0 analyser \u00b7 poids constant',
      },
      {
        code: 'Z2',
        label: 'z\u00eata d\'Epstein',
        formal: '\u03b6_Q(s) = \u03a3_{(m,n)\u2260(0,0)} 1/Q(m,n)^s',
        weight: (a, b, c) => 1,
        role: 's\u00e9rie de Dirichlet associ\u00e9e \u00e0 Q \u00b7 poids constant',
      },
      {
        code: 'Z3',
        label: 'encodage de G\u00f6del',
        formal: 'enc : Circuit(Q) \u2192 N',
        weight: (a, b, c) => 1,
        role: 'transformer le circuit Q en nombre de G\u00f6del \u00b7 poids constant',
      },
      {
        code: 'Z4',
        label: 'sonder (produit d\'Euler partiel)',
        formal: 'sonder(N, s) = \u220f_{p\u2264P} 1/(1 - p^{-s})',
        weight: (a, b, c) => 1 / Math.max(0.01, Math.abs(a * a + b * b - c * c) + 1),
        role: 'r\u00e9gime constructif s>1 \u00b7 poids = proche de 1 quand a\u00b2+b\u00b2 \u2248 c\u00b2',
      },
      {
        code: 'Z5',
        label: 'peser (champ de convergence)',
        formal: 'P : N \u00d7 \u211d \u2192 [0,1]',
        weight: (a, b, c) => Math.min(1, (a * a + b * b) / 30),
        role: 'probabilit\u00e9 de convergence \u00e0 chaque s \u00b7 poids = (a\u00b2+b\u00b2)/30',
      },
      {
        code: 'Z6',
        label: 'fronti\u00e8re \u03c3_c',
        formal: '\u03c3_c = inf { s : \u03b6_Q(s) converge }',
        weight: (a, b, c) => 1,
        role: 'seuil de transition \u00b7 \u03c3_c = 1 indique Q d\u00e9finit une norme',
      },
      {
        code: 'Z7',
        label: '\u03c3_c = d/2',
        formal: 'd = dim(Q) \u27f9 \u03c3_c = d/2',
        weight: (a, b, c) => 2,
        role: 'relie \u03c3_c \u00e0 la dimension \u00b7 pour d=2, \u03c3_c=1 \u27f9 a\u00b2+b\u00b2=c\u00b2',
      },
    ],
    formula: '\u03c3_c(\u03b6_Q) = d/2 = 1 \u27f9 Q d\u00e9finit une norme \u27f9 a\u00b2 + b\u00b2 = c\u00b2',
    proof: 'L\'abscisse de convergence \u03c3_c=1 de \u03b6_Q encode 3 choses : dim=2, d\u00e9fini positif, norme. Donc Q(a,b) = a\u00b2+b\u00b2 = c\u00b2.',
    format: ({ a, b, c }) => {
      const c2 = (c * c).toFixed(2);
      const ratio = (a * a + b * b) / Math.max(c * c, 0.01);
      return '\u03c3_c = 1  \u00b7  Q(' + a.toFixed(1) + ',' + b.toFixed(1) + ') = ' + (a * a + b * b).toFixed(2) + ' = c\u00b2 = ' + c2 + '  (ratio=' + ratio.toFixed(3) + ')';
    },
  },
];
