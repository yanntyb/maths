'use strict';

import { VisualizationContract } from '../visualization-contract.js';
import { styleCanvas } from '../statut-style.js';

/**
 * TreeVisualization — arbre des axiomes : une ligne d'axiomes reliée à la conclusion
 * par des courbes de Bézier, épaisses (essentiel), pointillées (superflu) ou grises.
 */

class TreeVisualization extends VisualizationContract {
  constructor() {
    super({ id: 'tree', title: 'Arbre des axiomes' });
  }

  layoutAxioms(rect, entrees) {
    const n = entrees.length;
    const marge = 32;
    const pas = n > 1 ? (rect.w - 2 * marge) / (n - 1) : 0;
    const r = n > 1 ? Math.max(12, Math.min(22, pas / 2.6)) : 22;
    return entrees.map((e, i) => ({
      ...e,
      x: n > 1 ? rect.x + marge + i * pas : rect.x + rect.w / 2,
      y: rect.y + rect.h * 0.3,
      r,
    }));
  }

  layoutOutput(rect) {
    return { x: rect.x + rect.w / 2, y: rect.y + rect.h - 30, r: 28 };
  }

  drawEdges(ctx, axioms, output, cablage) {
    const p = ctx.p;
    for (const ax of axioms) {
      const st = styleCanvas(ax.cle, cablage.color);
      p.drawingContext.setLineDash(st.pointille);
      p.stroke(st.trait); p.strokeWeight(st.epaisseur); p.noFill();
      const midY = (ax.y + output.y) / 2;
      p.bezier(ax.x, ax.y + ax.r, ax.x, midY, output.x, midY, output.x, output.y - output.r);
    }
    p.drawingContext.setLineDash([]);
  }
}

export default new TreeVisualization();
