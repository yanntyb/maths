'use strict';

import { VisualizationContract } from '../visualization-contract.js';
import { styleCanvas } from '../statut-style.js';

/**
 * SphereVisualization — cercle des axiomes : un arc de même longueur par axiome autour de
 * la conclusion, plein (essentiel), fin et pointillé (superflu) ou gris (non testé).
 */

class SphereVisualization extends VisualizationContract {
  constructor() {
    super({ id: 'sphere', title: 'Cercle des axiomes' });
  }

  layoutAxioms(rect, entrees) {
    const cx = rect.x + rect.w / 2;
    const cy = rect.y + rect.h / 2;
    const R = Math.max(40, Math.min(rect.w, rect.h) * 0.34);
    const arc = (2 * Math.PI) / Math.max(entrees.length, 1);
    return entrees.map((e, i) => {
      const a0 = -Math.PI / 2 + i * arc;
      const aMid = a0 + arc / 2;
      return {
        ...e, a0, a1: a0 + arc, cx, cy, R,
        lx: cx + Math.cos(aMid) * (R + 30),
        ly: cy + Math.sin(aMid) * (R + 30),
      };
    });
  }

  layoutOutput(rect) {
    return { x: rect.x + rect.w / 2, y: rect.y + rect.h / 2, r: 30 };
  }

  drawEdges(ctx, axioms, output, cablage) {
    const p = ctx.p;
    const ecart = 0.06;
    for (const ax of axioms) {
      const st = styleCanvas(ax.cle, cablage.color);
      p.drawingContext.setLineDash(st.pointille);
      p.noFill(); p.stroke(st.trait);
      p.strokeWeight(ax.cle === 'essentiel' ? 18 : ax.cle === 'superflu' ? 8 : 4);
      p.arc(ax.cx, ax.cy, ax.R * 2, ax.R * 2, ax.a0 + ecart, ax.a1 - ecart);
    }
    p.drawingContext.setLineDash([]);
  }

  /** Pas de cercle par axiome : nom et code à l'extérieur de l'arc, conclusion au centre. */
  drawNodes(ctx, axioms, output, cablage, enonce) {
    const p = ctx.p;
    for (const ax of axioms) {
      p.noStroke(); p.fill('#374151'); p.textSize(11); p.textAlign(p.CENTER, p.CENTER);
      p.text(`${ax.nom} (${ax.code})`, ax.lx, ax.ly);
    }
    this.drawOutput(ctx, output, cablage, enonce);
  }
}

export default new SphereVisualization();
