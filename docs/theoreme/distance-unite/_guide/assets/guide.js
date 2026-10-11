/* Guide « distance unité » : socle partagé par toutes les pages.
   Scripts classiques, aucune dépendance. Expose window.Guide. */
(function () {
  'use strict';

  var CHAPITRES = [
    { num: '01', fichier: '01-le-defi.html', titre: 'Le défi' },
    { num: '02', fichier: '02-petit-grand-tres-grand.html', titre: 'Petit, grand, très grand' },
    { num: '03', fichier: '03-la-recette-d-erdos.html', titre: "La recette d'Erdős" },
    { num: '04', fichier: '04-pourquoi-elle-s-essouffle.html', titre: "Pourquoi elle s'essouffle" },
    { num: '05', fichier: '05-changer-de-point-de-vue.html', titre: 'Changer de point de vue' },
    { num: '06', fichier: '06-les-pas-magiques.html', titre: 'Les pas magiques' },
    { num: '07', fichier: '07-les-tiroirs.html', titre: 'Les tiroirs' },
    { num: '08', fichier: '08-la-fenetre-et-le-coup-de-des.html', titre: 'La fenêtre et le coup de dés' },
    { num: '09', fichier: '09-pas-trop-de-points.html', titre: 'Pas trop de points' },
    { num: '10', fichier: '10-le-bilan.html', titre: 'Le bilan' },
    { num: '11', fichier: '11-le-cahier-des-charges.html', titre: 'Le cahier des charges' },
    { num: '12', fichier: '12-construire-la-tour.html', titre: 'Construire la tour' },
    { num: '13', fichier: '13-les-tiroirs-restent-peu-nombreux.html', titre: 'Les tiroirs restent peu nombreux' },
    { num: '14', fichier: '14-toute-la-preuve-en-une-page.html', titre: 'Toute la preuve en une page' }
  ];

  var fabriques = {};
  var controles = {};
  var instances = {};
  var toiles = [];

  function enregistrerWidget(nom, fabrique) { fabriques[nom] = fabrique; }
  function enregistrerControle(nom, fn) { controles[nom] = fn; }

  function lancerControles() {
    return Object.keys(controles).map(function (nom) {
      try {
        var r = controles[nom]();
        return { nom: nom, ok: Boolean(r && r.ok), message: (r && r.message) || '' };
      } catch (e) {
        return { nom: nom, ok: false, message: String((e && e.message) || e) };
      }
    });
  }

  function variable(nom) { return getComputedStyle(document.documentElement).getPropertyValue(nom).trim(); }

  function couleurs() {
    return {
      bleu: variable('--bleu'), vert: variable('--vert'), rouge: variable('--rouge'), ambre: variable('--ambre'),
      indigo: variable('--indigo'), sarcelle: variable('--sarcelle'), texte: variable('--texte'),
      discret: variable('--discret'), fond: variable('--fond'), surface: variable('--surface'), trait: variable('--trait')
    };
  }

  /** Canvas à la largeur du conteneur, net sur écran haute densité. rapport = hauteur / largeur. */
  function toile(zone, options) {
    var rapport = (options && options.rapport) || 0.75;
    var el = document.createElement('canvas');
    el.className = 'widget-canvas';
    el.setAttribute('role', 'img');
    el.setAttribute('aria-label', (options && options.alt) || '');
    zone.appendChild(el);
    var t = { canvas: el, ctx: el.getContext('2d'), largeur: 0, hauteur: 0, dpr: 0, rappels: [], limiterHauteur: false };
    el.toileGuide = t;
    t.ajuster = function () {
      var largeur = Math.max(200, Math.floor(zone.clientWidth || 320));
      if (t.limiterHauteur) {
        // Canvas tactile : il doit laisser de la place pour faire défiler la page au doigt, même en paysage.
        // On se base sur l'écran (stable quand la barre d'outils mobile se replie), pas sur innerHeight.
        var paysage = window.innerWidth > window.innerHeight;
        var ecran = paysage ? Math.min(screen.width, screen.height) : Math.max(screen.width, screen.height);
        var hauteurMax = Math.floor(0.6 * Math.min(ecran || window.innerHeight, window.innerHeight * 1.2));
        if (largeur * rapport > hauteurMax) largeur = Math.max(160, Math.floor(hauteurMax / rapport));
      }
      var hauteur = Math.floor(largeur * rapport);
      var dpr = window.devicePixelRatio || 1;
      if (largeur === t.largeur && hauteur === t.hauteur && dpr === t.dpr) return;
      t.dpr = dpr;
      el.width = Math.floor(largeur * dpr);
      el.height = Math.floor(hauteur * dpr);
      el.style.width = largeur + 'px';
      el.style.height = hauteur + 'px';
      t.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      t.largeur = largeur;
      t.hauteur = hauteur;
      t.rappels.forEach(function (fn) { fn(); });
    };
    t.quandRedimensionne = function (fn) { t.rappels.push(fn); };
    t.redessiner = function () { t.rappels.forEach(function (fn) { fn(); }); };
    t.ajuster();
    toiles.push(t);
    return t;
  }

  /** Pointeur unifié (souris, toucher, stylet). Bloque le défilement sur ce canvas : à réserver aux widgets à glisser. */
  function pointeur(el, rappels) {
    function position(e) { var r = el.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
    el.style.touchAction = 'none';
    if (el.toileGuide) { el.toileGuide.limiterHauteur = true; el.style.marginLeft = 'auto'; el.style.marginRight = 'auto'; el.toileGuide.ajuster(); }
    el.addEventListener('pointerdown', function (e) {
      try { el.setPointerCapture(e.pointerId); } catch (ignore) { /* évènement synthétique */ }
      if (rappels.appui) rappels.appui(position(e), e);
    });
    el.addEventListener('pointermove', function (e) { if (rappels.deplacement) rappels.deplacement(position(e), e); });
    ['pointerup', 'pointercancel'].forEach(function (type) {
      el.addEventListener(type, function (e) { if (rappels.relache) rappels.relache(position(e), e); });
    });
  }

  function barre(zone) { var d = document.createElement('div'); d.className = 'widget-barre'; zone.appendChild(d); return d; }

  function curseur(parent, o) {
    var etiquette = document.createElement('label');
    etiquette.className = 'curseur';
    var nom = document.createElement('span');
    nom.textContent = o.nom;
    var sortie = document.createElement('output');
    sortie.className = 'curseur-valeur';
    var entree = document.createElement('input');
    entree.type = 'range';
    entree.min = o.min; entree.max = o.max; entree.step = o.pas || 1; entree.value = o.valeur;
    function afficher() { var v = Number(entree.value); sortie.textContent = o.format ? o.format(v) : String(v); }
    entree.addEventListener('input', function () { afficher(); if (o.change) o.change(Number(entree.value)); });
    afficher();
    etiquette.appendChild(nom); etiquette.appendChild(sortie); etiquette.appendChild(entree);
    parent.appendChild(etiquette);
    return {
      entree: entree,
      valeur: function () { return Number(entree.value); },
      fixer: function (v) { entree.value = v; afficher(); if (o.change) o.change(Number(entree.value)); },
      /** Met à jour la valeur affichée sans déclencher le rappel « change ». */
      montrer: function (v) { entree.value = v; afficher(); }
    };
  }

  function bouton(parent, texte, action, options) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'bouton';
    b.textContent = texte;
    if (options && options.bascule) b.setAttribute('aria-pressed', options.actif ? 'true' : 'false');
    b.addEventListener('click', function () {
      if (options && options.bascule) b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
      action(b.getAttribute('aria-pressed') === 'true');
    });
    parent.appendChild(b);
    return b;
  }

  function compteurs(parent) {
    var dl = document.createElement('dl');
    dl.className = 'compteurs';
    parent.appendChild(dl);
    var lignes = {};
    return {
      fixer: function (cle, nom, texte) {
        if (!lignes[cle]) {
          var dt = document.createElement('dt'); dt.textContent = nom;
          var dd = document.createElement('dd');
          dl.appendChild(dt); dl.appendChild(dd);
          lignes[cle] = dd;
        }
        lignes[cle].textContent = texte;
      }
    };
  }

  /** Générateur pseudo-aléatoire reproductible (mulberry32). */
  function hasard(graine) {
    var a = graine >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function nombre(x, decimales) {
    return Number(x).toLocaleString('fr-FR', { minimumFractionDigits: decimales || 0, maximumFractionDigits: decimales || 0 });
  }

  function chiffres(log10) {
    var n = Math.floor(log10) + 1;
    return 'un nombre de ' + nombre(n) + ' chiffre' + (n > 1 ? 's' : '');
  }

  function monterWidgets() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-widget]'), function (zone) {
      var nom = zone.getAttribute('data-widget');
      if (!fabriques[nom]) {
        zone.textContent = 'Widget introuvable : ' + nom;
        zone.classList.add('widget-erreur');
        return;
      }
      (instances[nom] = instances[nom] || []).push(fabriques[nom](zone, zone.dataset));
    });
  }

  function lien(chapitre, texte) {
    var a = document.createElement('a');
    a.href = chapitre.fichier;
    a.textContent = texte;
    return a;
  }

  function inactif(texte) { var s = document.createElement('span'); s.className = 'inactif'; s.textContent = texte; return s; }

  function construireNavigation() {
    var num = document.body.getAttribute('data-chapitre');
    var i = -1;
    CHAPITRES.forEach(function (c, k) { if (c.num === num) i = k; });
    var nav = document.createElement('nav');
    nav.className = 'barre-nav';
    nav.setAttribute('aria-label', 'Navigation entre les chapitres');
    var gauche, droite, milieu = document.createElement('a');
    milieu.href = 'index.html';
    milieu.textContent = 'Sommaire';
    if (num === 'lexique') {
      gauche = lien(CHAPITRES[CHAPITRES.length - 1], '← 14');
      droite = inactif('—');
    } else if (i < 0) {
      gauche = inactif('—');
      droite = lien(CHAPITRES[0], 'Commencer →');
    } else {
      gauche = i > 0 ? lien(CHAPITRES[i - 1], '← ' + CHAPITRES[i - 1].num) : lien({ fichier: 'index.html' }, '← Accueil');
      droite = i < CHAPITRES.length - 1 ? lien(CHAPITRES[i + 1], CHAPITRES[i + 1].num + ' →') : lien({ fichier: 'lexique.html' }, 'Lexique →');
      var progression = document.createElement('span');
      progression.className = 'progression';
      progression.textContent = CHAPITRES[i].num + ' / ' + CHAPITRES.length;
      nav.appendChild(gauche); nav.appendChild(milieu); nav.appendChild(progression); nav.appendChild(droite);
      document.body.appendChild(nav);
      return;
    }
    nav.appendChild(gauche); nav.appendChild(milieu); nav.appendChild(droite);
    document.body.appendChild(nav);
  }

  function ajusterTout() { toiles.forEach(function (t) { t.ajuster(); }); }
  function redessinerTout() { toiles.forEach(function (t) { t.redessiner(); }); }

  window.addEventListener('resize', ajusterTout);
  if (window.matchMedia) {
    var requete = window.matchMedia('(prefers-color-scheme: dark)');
    if (requete.addEventListener) requete.addEventListener('change', redessinerTout);
  }
  document.addEventListener('DOMContentLoaded', function () { construireNavigation(); monterWidgets(); });

  window.Guide = {
    CHAPITRES: CHAPITRES, instances: instances,
    enregistrerWidget: enregistrerWidget, enregistrerControle: enregistrerControle, lancerControles: lancerControles,
    couleurs: couleurs, toile: toile, pointeur: pointeur, barre: barre, curseur: curseur, bouton: bouton,
    compteurs: compteurs, hasard: hasard, nombre: nombre, chiffres: chiffres
  };
})();
