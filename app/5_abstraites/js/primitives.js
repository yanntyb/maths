'use strict';

/**
 * Primitives graphiques — couche d'abstraction entre rendus et p5.js
 * Les rendus n'appellent jamais p.stroke(), p.fill(), etc. directement.
 * Tout passe par cette interface, ce qui permet de swapper p5.js pour Canvas/SVG.
 */

export const Primitives = {
  // ===== STYLES =====

  setStroke(ctx, color, weight = 1) {
    const p = ctx.p;
    p.stroke(color);
    p.strokeWeight(weight);
  },

  setFill(ctx, color) {
    ctx.p.fill(color);
  },

  noStroke(ctx) {
    ctx.p.noStroke();
  },

  noFill(ctx) {
    ctx.p.noFill();
  },

  // ===== GÉOMÉTRIE — Formes élémentaires =====

  box(ctx, x, y, w, h, style = {}) {
    const p = ctx.p;
    if (style.stroke) this.setStroke(ctx, style.stroke, style.weight || 1);
    if (style.fill) this.setFill(ctx, style.fill);
    else this.noFill(ctx);
    p.rect(x, y, w, h);
  },

  circle(ctx, x, y, r, style = {}) {
    const p = ctx.p;
    if (style.stroke) this.setStroke(ctx, style.stroke, style.weight || 1);
    if (style.fill) this.setFill(ctx, style.fill);
    else this.noFill(ctx);
    p.circle(x, y, r);
  },

  line(ctx, x1, y1, x2, y2, style = {}) {
    const p = ctx.p;
    if (style.stroke) this.setStroke(ctx, style.stroke, style.weight || 1);
    p.line(x1, y1, x2, y2);
  },

  polygon(ctx, points, style = {}) {
    const p = ctx.p;
    if (style.stroke) this.setStroke(ctx, style.stroke, style.weight || 1);
    if (style.fill) this.setFill(ctx, style.fill);
    else this.noFill(ctx);
    p.beginShape();
    points.forEach(([x, y]) => p.vertex(x, y));
    p.endShape(p.CLOSE);
  },

  arc(ctx, x, y, w, h, a0, a1, style = {}) {
    const p = ctx.p;
    if (style.stroke) this.setStroke(ctx, style.stroke, style.weight || 1);
    if (style.fill) this.setFill(ctx, style.fill);
    else this.noFill(ctx);
    p.arc(x, y, w, h, a0, a1);
  },

  // ===== TEXTE =====

  text(ctx, str, x, y, style = {}) {
    const p = ctx.p;
    const size = style.size || 13;
    const color = style.color || '#000';
    const align = style.align || [p.LEFT, p.TOP];

    p.noStroke();
    p.fill(color);
    p.textSize(size);
    p.textAlign(...align);
    p.text(str, x, y);
  },

  // ===== ÉTAT GRAPHIQUE =====

  setDashedLine(ctx, pattern = [3, 4]) {
    ctx.p.drawingContext.setLineDash(pattern);
  },

  clearDashedLine(ctx) {
    ctx.p.drawingContext.setLineDash([]);
  },

  push(ctx) {
    ctx.p.push();
  },

  pop(ctx) {
    ctx.p.pop();
  },

  translate(ctx, x, y) {
    ctx.p.translate(x, y);
  },

  rotate(ctx, angle) {
    ctx.p.rotate(angle);
  },

  // ===== HELPERS (purs calculs, sans p5) =====

  tint(color, alpha) {
    // "3B82F6" + "40" → "3B82F640"
    if (alpha.startsWith('#')) alpha = alpha.slice(1);
    return color + alpha;
  },

  center(w, itemW) {
    return (w - itemW) / 2;
  },
};
