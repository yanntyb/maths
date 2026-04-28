'use strict';

export function draw(ctx, rect, tri, color) {
  const p = ctx.p;
  const { x, y, w, h } = rect;
  const { a, b, c } = tri;

  const padH = 32;
  const opSpace = 36;
  const availW = w - padH * 2 - opSpace * 2;
  const availH = h - 80;

  const sc = Math.min(availW / (a + b + c), availH / c);

  const aPx = a * sc, bPx = b * sc, cPx = c * sc;
  const totalW = aPx + bPx + cPx + opSpace * 2;
  const baseY = y + h - 50;
  let xc = x + (w - totalW) / 2;

  p.stroke(color); p.strokeWeight(1.5); p.fill(color + '40');
  p.rect(xc, baseY - aPx, aPx, aPx);
  p.noStroke(); p.fill(color); p.textSize(Math.min(13, aPx * 0.18));
  p.textAlign(p.CENTER, p.CENTER);
  p.text('a\u00b2', xc + aPx / 2, baseY - aPx / 2 - 7);
  p.text((a * a).toFixed(2), xc + aPx / 2, baseY - aPx / 2 + 7);

  xc += aPx;
  p.fill('#475569'); p.textSize(20);
  p.text('+', xc + opSpace / 2, baseY - aPx / 2);

  xc += opSpace;
  p.stroke(color); p.strokeWeight(1.5); p.fill(color + '40');
  p.rect(xc, baseY - bPx, bPx, bPx);
  p.noStroke(); p.fill(color); p.textSize(Math.min(13, bPx * 0.18));
  p.textAlign(p.CENTER, p.CENTER);
  p.text('b\u00b2', xc + bPx / 2, baseY - bPx / 2 - 7);
  p.text((b * b).toFixed(2), xc + bPx / 2, baseY - bPx / 2 + 7);

  xc += bPx;
  p.fill('#475569'); p.textSize(20);
  p.text('=', xc + opSpace / 2, baseY - aPx / 2);

  xc += opSpace;
  p.stroke(color); p.strokeWeight(1.5); p.fill(color + '60');
  p.rect(xc, baseY - cPx, cPx, cPx);
  p.noStroke(); p.fill('#fff'); p.textSize(Math.min(13, cPx * 0.15));
  p.textAlign(p.CENTER, p.CENTER);
  p.text('c\u00b2', xc + cPx / 2, baseY - cPx / 2 - 8);
  p.text((c * c).toFixed(2), xc + cPx / 2, baseY - cPx / 2 + 8);

  p.fill(color); p.textSize(12); p.textAlign(p.CENTER, p.BOTTOM);
  p.text('\u03bc(a\u00b2) + \u03bc(b\u00b2) = \u03bc(c\u00b2)  par \u03c3-additivit\u00e9', x + w / 2, y + h - 12);
}
