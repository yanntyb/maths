'use strict';

import { axioms, formula, proof, format } from './axiomes.js';
import { draw } from './rendu.js';

export default {
  id: 'euclid',
  title: 'Preuve 1 \u2014 G\u00e9om\u00e9trie euclidienne',
  color: '#3B82F6',
  axioms,
  formula,
  proof,
  format,
  draw,
};
