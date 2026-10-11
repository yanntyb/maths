'use strict';

import { drawScene } from './scene.js';
import { TabManager } from './tab-contract.js';
import { chargerStatuts } from './statuts-store.js';
import { fusionner } from './cablage-registry.js';
import { rendreEntete, majApplication } from './entete.js';
import { rendreMatrice } from './matrice.js';
import { creerPanneau } from './panneau.js';

// -- Etat local -------------------------------------------------------

const S = {
  a: 3, b: 4,
  aTarget: 3, bTarget: 4,
  playing: false,
  morphPhase: 0,
  rightView: 'tree',
  enonceParCablage: {},   // id du câblage → id de l'énoncé affiché dans le canvas
};

let tabManager;

const $ = (id) => document.getElementById(id);

const AIDE = 'Servir app/ en HTTP : cd app && python3 -m http.server 8765, puis ouvrir '
  + 'http://localhost:8765/10_statuts/pythagore.html.\n'
  + 'Régénérer les statuts : cd lean && lake build && lake exe statuts ../app/10_statuts/data/statuts.json';

function afficherErreur(message) {
  const bandeau = $('bandeau');
  bandeau.textContent = `${message}\n${AIDE}`;
  bandeau.hidden = false;
}

/** Hauteur de la barre d'outils, pour que le panneau commence dessous au format bureau. */
function majHautUi() {
  document.documentElement.style.setProperty('--haut-ui', `${$('ui').offsetHeight}px`);
}

function enonceCourant(cablage) {
  const enonces = cablage.fiche.enonces;
  return enonces.find((e) => e.id === S.enonceParCablage[cablage.id]) ?? enonces[0];
}

// -- UI bindings (inchangés depuis V9) ----------------------------------

['a', 'b'].forEach((id) => {
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

document.querySelectorAll('.tab[data-view]').forEach((btn) => {
  btn.addEventListener('click', () => {
    S.rightView = btn.dataset.view;
    document.querySelectorAll('.tab[data-view]').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// -- Setup : statuts, onglets, matrice, panneau --------------------------

async function setup() {
  majHautUi();
  window.addEventListener('resize', majHautUi);
  const statuts = await chargerStatuts();
  const registre = fusionner(statuts);
  $('nb-cablages').textContent = `${registre.count()} câblages`;
  rendreEntete($('entete'), statuts.theoreme, registre.count());
  const panneau = creerPanneau($('panneau'));
  const conteneurOnglets = document.querySelector('.tabs-cablages');
  tabManager = new TabManager(registre.all(), conteneurOnglets);

  const rafraichir = () => {
    const cablage = tabManager.current();
    rendreMatrice($('matrice'), cablage, statuts.theoreme, enonceCourant(cablage).id, {
      onChoisirEnonce: (id) => { S.enonceParCablage[cablage.id] = id; rafraichir(); },
      onOuvrirPreuve: (preuve, enonce, bouton) => panneau.ouvrir(preuve, enonce, bouton),
    });
  };
  tabManager.onSelect = () => { panneau.fermer(); rafraichir(); };
  tabManager.renderTabs(conteneurOnglets);
  rafraichir();
}

// -- Canvas p5 (après setup) ----------------------------------------------

function demarrerCanvas() {
  const vue = $('vue');
  new p5((p) => {
    p.setup = () => {
      p.createCanvas(vue.clientWidth, vue.clientHeight);
      p.textFont('Courier New');
      p.frameRate(60);
      new ResizeObserver(() => p.resizeCanvas(vue.clientWidth, vue.clientHeight)).observe(vue);
    };
    p.draw = () => {
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

      const tri = { a: S.a, b: S.b, c: Math.sqrt(S.a * S.a + S.b * S.b) };
      const cablage = tabManager.current();
      majApplication(cablage, tri);
      drawScene({ p, w: p.width, h: p.height }, cablage, enonceCourant(cablage), S.rightView);
    };
  }, vue);
}

setup()
  .then(demarrerCanvas)
  .catch((e) => afficherErreur(`Statuts indisponibles : ${e.message}`));
