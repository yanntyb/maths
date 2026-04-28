'use strict';

import { axioms, formula, proof, format } from './axiomes.js';
import { draw } from './rendu.js';

export default {
  id: 'algebre',
  title: 'Preuve 0 — Algèbre (vérification)',
  color: '#EC4899',
  axioms,
  formula,
  proof,
  format,
  draw,
};
