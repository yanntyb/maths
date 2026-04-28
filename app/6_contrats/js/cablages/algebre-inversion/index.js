'use strict';

import { axioms, formula, proof, format } from './axiomes.js';
import { draw } from './rendu.js';

export default {
  id: 'algebre-inversion',
  title: 'Preuve 0b — Algèbre-Inversion (calcul par currying)',
  color: '#F97316',
  axioms,
  formula,
  proof,
  format,
  draw,
};
