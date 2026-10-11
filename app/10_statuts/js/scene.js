'use strict';

import treeViz from './visualizations/tree.js';
import sphereViz from './visualizations/sphere.js';

/**
 * scene.js — dessine la vue choisie (arbre ou cercle) de l'énoncé courant dans le canvas.
 * L'en-tête, la matrice et la légende des statuts sont en HTML.
 */

const VUES = { tree: treeViz, sphere: sphereViz };

export function drawScene(ctx, cablage, enonce, rightView) {
  ctx.p.background('#FAFAFC');
  const rect = { x: 0, y: 0, w: ctx.w, h: ctx.h };
  (VUES[rightView] ?? treeViz).draw(ctx, rect, cablage, enonce);
}
