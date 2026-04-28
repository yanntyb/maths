'use strict';

import { drawScene } from './scene.js';

// -- Etat local -------------------------------------------------------

const S = {
  a: 3, b: 4,
  aTarget: 3, bTarget: 4,
  playing: false,
  morphPhase: 0,
  activeProof: 0,
  rightView: 'anim',
};

const $ = id => document.getElementById(id);

const vpSize = () => {
  const vv = window.visualViewport;
  return { w: vv ? vv.width : innerWidth, h: vv ? vv.height : innerHeight };
};

// -- UI bindings ------------------------------------------------------

['a', 'b'].forEach(id => {
  const inp = $(id), lbl = $(id + '-v');
  inp.addEventListener('input', () => {
    S[id + 'Target'] = +inp.value;
    lbl.textContent = inp.value;
  });
});

$('play').addEventListener('click', () => {
  S.playing = !S.playing;
  $('play').textContent = S.playing ? '⏸ pause' : '▶ animer';
  $('play').classList.toggle('playing', S.playing);
});
$('reset').addEventListener('click', () => {
  S.aTarget = 3; S.bTarget = 4;
  $('a').value = 3; $('a-v').textContent = '3';
  $('b').value = 4; $('b-v').textContent = '4';
});

document.querySelectorAll('.tab[data-proof]').forEach(btn => {
  btn.addEventListener('click', () => {
    S.activeProof = +btn.dataset.proof;
    document.querySelectorAll('.tab[data-proof]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

document.querySelectorAll('.tab[data-view]').forEach(btn => {
  btn.addEventListener('click', () => {
    S.rightView = btn.dataset.view;
    document.querySelectorAll('.tab[data-view]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// -- p5 instance ------------------------------------------------------

let P;

new p5(p => {
  P = p;
  p.setup = () => {
    const navH = $('ui').offsetHeight || 60;
    const { w, h } = vpSize();
    const c = p.createCanvas(w, Math.max(300, h - navH));
    c.elt.style.position = 'absolute';
    c.elt.style.top = navH + 'px';
    c.elt.style.left = '0';
    document.body.appendChild(c.elt);
    p.textFont('Courier New');
    p.frameRate(60);
  };
  p.draw = () => {
    p.background('#FAFAFC');

    S.a += (S.aTarget - S.a) * 0.08;
    S.b += (S.bTarget - S.b) * 0.08;

    if (S.playing) {
      S.morphPhase += 0.005;
      const t = (Math.sin(S.morphPhase * Math.PI * 2) + 1) / 2;
      S.aTarget = Math.round(3 + t * 18);
      S.bTarget = Math.round(20 - t * 16);
      $('a').value = S.aTarget;
      $('b').value = S.bTarget;
      $('a-v').textContent = Math.round(S.aTarget);
      $('b-v').textContent = Math.round(S.bTarget);
    }

    const ctx = { p, w: p.width, h: p.height };
    const tri = { a: S.a, b: S.b, c: Math.sqrt(S.a * S.a + S.b * S.b) };

    drawScene(ctx, S.activeProof, S.rightView, tri);
  };
  p.windowResized = () => {
    const navH = $('ui').offsetHeight || 60;
    const { w, h } = vpSize();
    p.resizeCanvas(w, Math.max(300, h - navH));
    p.canvas.style.top = navH + 'px';
  };
});

if (window.visualViewport) window.visualViewport.addEventListener('resize', () => P && P.windowResized());
window.addEventListener('orientationchange', () => setTimeout(() => P && P.windowResized(), 200));
