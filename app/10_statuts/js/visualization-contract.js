'use strict';

import { STATUTS, statutDe, styleCanvas } from './statut-style.js';

/**
 * VisualizationContract — contrat abstrait des vues canvas d'un énoncé.
 *
 * Phases invariantes (template method, draw()) :
 * 1. Layout : un nœud par axiome, un nœud de conclusion
 * 2. Arêtes : axiomes → conclusion
 * 3. Nœuds : cercles et étiquettes
 * 4. Légende des statuts
 *
 * Le style de chaque nœud et de chaque arête dépend du statut de l'axiome retiré seul.
 */

export class VisualizationContract {
  constructor(config) {
    this.id = config.id;
    this.title = config.title;
  }

  /** À surcharger : position des axiomes (entrées : axiomes du JSON + `cle` de statut). */
  layoutAxioms(rect, entrees) {
    throw new Error('layoutAxioms() doit être implémenté par la classe enfant');
  }

  /** À surcharger : position du nœud de conclusion. */
  layoutOutput(rect) {
    throw new Error('layoutOutput() doit être implémenté par la classe enfant');
  }

  /** À surcharger : arêtes axiomes → conclusion. */
  drawEdges(ctx, axioms, output, cablage) {
    throw new Error('drawEdges() doit être implémenté par la classe enfant');
  }

  /** Nœuds par défaut : un cercle par axiome, stylé par statut ; code dedans, nom dessous. */
  drawNodes(ctx, axioms, output, cablage, enonce) {
    const p = ctx.p;
    for (const ax of axioms) {
      const st = styleCanvas(ax.cle, cablage.color);
      p.drawingContext.setLineDash(st.pointille);
      p.stroke(st.trait); p.strokeWeight(st.epaisseur); p.fill(st.fond);
      p.circle(ax.x, ax.y, ax.r * 2);
      p.drawingContext.setLineDash([]);
      p.noStroke(); p.fill(st.texte); p.textSize(10); p.textAlign(p.CENTER, p.CENTER);
      p.text(ax.code, ax.x, ax.y);
      p.fill('#374151'); p.textSize(11);
      p.text(ax.nom, ax.x, ax.y + ax.r + 12);
    }
    this.drawOutput(ctx, output, cablage, enonce);
  }

  drawOutput(ctx, output, cablage, enonce) {
    const p = ctx.p;
    p.stroke(cablage.color); p.strokeWeight(2.5); p.fill('#fff');
    p.circle(output.x, output.y, output.r * 2);
    p.noStroke(); p.fill(cablage.color); p.textSize(12); p.textAlign(p.CENTER, p.CENTER);
    p.text(enonce.id, output.x, output.y);
  }

  drawLegend(ctx, rect, cablage) {
    const p = ctx.p;
    const y = rect.y + rect.h - 14;
    let x = rect.x + 12;
    for (const cle of ['essentiel', 'superflu', 'nonTeste']) {
      const st = styleCanvas(cle, cablage.color);
      p.drawingContext.setLineDash(st.pointille);
      p.stroke(st.trait); p.strokeWeight(st.epaisseur); p.fill(st.fond);
      p.circle(x + 6, y, 12);
      p.drawingContext.setLineDash([]);
      p.noStroke(); p.fill('#374151'); p.textSize(11); p.textAlign(p.LEFT, p.CENTER);
      p.text(STATUTS[cle].mot, x + 16, y);
      x += 32 + p.textWidth(STATUTS[cle].mot);
    }
  }

  draw(ctx, rect, cablage, enonce) {
    const p = ctx.p;
    p.noStroke(); p.fill(cablage.color); p.textSize(12); p.textAlign(p.LEFT, p.TOP);
    p.text(`${this.title} · énoncé « ${enonce.id} »`, rect.x + 8, rect.y + 6);
    p.fill(140, 145, 160); p.textSize(10);
    p.text('chaque axiome retiré seul : essentiel, superflu ou non testé', rect.x + 8, rect.y + 22);
    const entrees = enonce.axiomes.map((a) => ({ ...a, cle: statutDe(enonce, [a.nom]).cle }));
    const zone = { x: rect.x, y: rect.y + 40, w: rect.w, h: rect.h - 70 };
    const axioms = this.layoutAxioms(zone, entrees);
    const output = this.layoutOutput(zone);
    this.drawEdges(ctx, axioms, output, cablage);
    this.drawNodes(ctx, axioms, output, cablage, enonce);
    this.drawLegend(ctx, rect, cablage);
  }
}
