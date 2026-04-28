'use strict';

import { P } from './state.js';

export function drawArrow(x1, y1, x2, y2, color, lw, label = null, side = null) {
  P.stroke(color); P.strokeWeight(lw);
  P.line(x1, y1, x2, y2);
  const ang = Math.atan2(y2 - y1, x2 - x1);
  P.fill(color); P.noStroke();
  P.push();
  P.translate(x2, y2); P.rotate(ang);
  P.triangle(0, 0, -10, -4, -10, 4);
  P.pop();
  if (label) {
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    P.noStroke(); P.fill(color);
    P.textSize(10);
    if (side === 'top')       { P.textAlign(P.CENTER, P.BOTTOM); P.text(label, mx, my - 4); }
    else if (side === 'left') { P.textAlign(P.RIGHT, P.CENTER);  P.text(label, mx - 6, my); }
    else if (side === 'right'){ P.textAlign(P.LEFT, P.CENTER);   P.text(label, mx + 6, my); }
    else                      { P.textAlign(P.CENTER, P.TOP);    P.text(label, mx, my + 4); }
  }
}

export function wrapToLines(str, maxW) {
  const words = str.split(' ');
  const lines = [];
  let line = '';
  for (const w of words) {
    const test = line ? line + ' ' + w : w;
    if (P.textWidth(test) > maxW && line) {
      lines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export function drawAxiomRow(entry, lineY, tx, textW, color, maxR, maxNum) {
  const weight = Math.abs(entry.weight);
  const active = weight > 0.001;

  let r;
  if (entry.isStructural) {
    r = active ? 7 : 5;
  } else {
    const ratio = maxNum > 0 ? weight / maxNum : 0;
    r = active ? 4 + ratio * 6 : 3;
  }
  const cxC = tx + maxR + 2;
  const cyC = lineY + 11;

  if (active) {
    P.noStroke();
    P.fill(color + '25');
    P.circle(cxC, cyC, r * 2.6);
  }
  P.noStroke();
  P.fill(active ? color : 'rgb(200,205,215)');
  P.circle(cxC, cyC, r * 2);

  const textX = tx + maxR * 2 + 10;

  P.fill(active ? 'rgb(70,80,100)' : 'rgb(180,185,200)');
  P.textSize(11);
  P.textAlign(P.LEFT, P.TOP);
  P.text(entry.ax[0], textX, lineY);

  P.fill(active ? color : 'rgb(200,205,215)');
  P.textSize(10.5);
  P.text(entry.ax[1], textX + 4, lineY + 13);

  if (entry.ax[3]) {
    P.fill(active ? 'rgb(120,130,150)' : 'rgb(200,205,215)');
    P.textSize(9.5);
    P.text('\u21b3 ' + entry.ax[3], textX + 4, lineY + 26);
  }
}
