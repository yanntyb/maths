'use strict';

export function draw(ctx, rect, tri, color) {
  const p = ctx.p;
  const { x, y, w, h } = rect;
  const { a, b, c } = tri;

  const padH = 24;
  const padTop = 16;
  const padBot = 36;
  const availW = w - padH * 2;
  const availH = h - padTop - padBot;
  const sc = Math.min(availW, availH) / (a + b);
  const side = (a + b) * sc;
  const cx = x + (w - side) / 2;
  const cy = y + padTop + (availH - side) / 2;

  p.stroke(color); p.strokeWeight(1.5);
  p.fill(color + '10');
  p.rect(cx, cy, side, side);

  const aPx = a * sc, bPx = b * sc;

  p.noStroke();
  p.fill(color + '50');
  p.beginShape();
  p.vertex(cx, cy);
  p.vertex(cx + bPx, cy);
  p.vertex(cx, cy + aPx);
  p.endShape(p.CLOSE);
  p.beginShape();
  p.vertex(cx + side, cy);
  p.vertex(cx + side, cy + bPx);
  p.vertex(cx + side - aPx, cy);
  p.endShape(p.CLOSE);
  p.beginShape();
  p.vertex(cx + side, cy + side);
  p.vertex(cx, cy + side);
  p.vertex(cx + side, cy + side - aPx);
  p.endShape(p.CLOSE);
  p.beginShape();
  p.vertex(cx, cy + side);
  p.vertex(cx, cy + side - bPx);
  p.vertex(cx + aPx, cy + side);
  p.endShape(p.CLOSE);

  p.stroke(color); p.strokeWeight(2);
  p.fill(color + '30');
  p.beginShape();
  p.vertex(cx + bPx, cy);
  p.vertex(cx + side, cy + bPx);
  p.vertex(cx + side - bPx, cy + side);
  p.vertex(cx, cy + side - bPx);
  p.endShape(p.CLOSE);

  p.noStroke();
  p.fill('#fff'); p.textSize(13); p.textAlign(p.CENTER, p.CENTER);
  p.text('c\u00b2 = ' + (c * c).toFixed(1), cx + side / 2, cy + side / 2);

  p.fill(color); p.textSize(12);
  p.textAlign(p.CENTER, p.BOTTOM);
  p.text('b', cx + bPx / 2, cy - 2);
  p.textAlign(p.RIGHT, p.CENTER);
  p.text('a', cx - 2, cy + aPx / 2);

  p.fill(color); p.textSize(13); p.textAlign(p.CENTER, p.TOP);
  p.text('(a+b)\u00b2 = 4\u00b7\u00bdab + c\u00b2  \u2192  a\u00b2 + b\u00b2 = c\u00b2', x + w / 2, y + h - 18);
}
