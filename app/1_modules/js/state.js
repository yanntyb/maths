'use strict';

export const S = {
  a: 3, b: 4,
  aTarget: 3, bTarget: 4,
  playing: false,
  morphPhase: 0,
  activeProof: 0,
  rightView: 'anim',
  s: 1.5,
};

export const $ = id => document.getElementById(id);

export let P = null;
export let W = 0;
export let H = 0;

export function setP(p) { P = p; }
export function setWH(w, h) { W = w; H = h; }

export const vpSize = () => {
  const vv = window.visualViewport;
  return { w: vv ? vv.width : innerWidth, h: vv ? vv.height : innerHeight };
};
