'use strict';

import { axioms, formula, proof, format } from './axiomes.js';
import { draw } from './rendu.js';

export default {
  id: 'hilbert',
  title: 'Preuve 3 \u2014 Espace pr\u00e9hilbertien',
  color: '#8B5CF6',
  axioms,
  formula,
  proof,
  format,
  draw,
};
