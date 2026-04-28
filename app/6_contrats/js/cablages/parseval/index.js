'use strict';

import { axioms, formula, proof, format } from './axiomes.js';
import { draw } from './rendu.js';

export default {
  id: 'parseval',
  title: 'Preuve 4 \u2014 Parseval (frame orthonormal)',
  color: '#0EA5E9',
  axioms,
  formula,
  proof,
  format,
  draw,
};
