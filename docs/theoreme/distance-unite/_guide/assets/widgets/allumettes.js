/* Widget « allumettes » : poser des clous, voir les paires à distance exactement 1. */
Guide.enregistrerControle('allumettes', function () {
  var hex = Allumettes.modeles.hexagone();
  var nHex = Allumettes.compter(hex).length;
  if (hex.length !== 7 || nHex !== 12) return { ok: false, message: 'hexagone + centre : ' + hex.length + ' clous, ' + nHex + ' allumettes (attendu 7 et 12)' };
  var nTri = Allumettes.compter(Allumettes.modeles.triangulaire()).length;
  if (nTri !== 18) return { ok: false, message: 'grille triangulaire : ' + nTri + ' allumettes (attendu 18)' };
  var nErd = Allumettes.compter(Allumettes.modeles.erdos()).length;
  if (nErd !== 36) return { ok: false, message: "grille d'Erdős : " + nErd + ' allumettes (attendu 36)' };
  var inter = Allumettes.intersections({ x: 0, y: 0 }, { x: 1, y: 0 });
  if (inter.length !== 2 || Math.abs(Math.hypot(inter[0].x, inter[0].y) - 1) > 1e-12) return { ok: false, message: 'intersections de cercles fausses' };
  var inst = (Guide.instances.allumettes || [])[0];
  if (inst) {
    inst.vider();
    var r = inst.toile.canvas.getBoundingClientRect();
    ['pointerdown', 'pointerup'].forEach(function (type) {
      inst.toile.canvas.dispatchEvent(new PointerEvent(type, { clientX: r.left + r.width / 2, clientY: r.top + r.height / 2, pointerId: 1, pointerType: 'touch', bubbles: true }));
    });
    var n = inst.etat.points.length;
    if (n !== 1) { inst.charger('hexagone'); return { ok: false, message: 'un toucher devrait poser 1 clou, il en pose ' + n }; }
    inst.charger('triangle');
    var p = inst.versEcran(inst.etat.points[0]);
    var gestes = [['pointerdown', 0], ['pointermove', 1], ['pointerup', 1]];
    gestes.forEach(function (g) {
      inst.toile.canvas.dispatchEvent(new PointerEvent(g[0], { clientX: r.left + p.x + g[1], clientY: r.top + p.y, pointerId: 2, pointerType: 'touch', bubbles: true }));
    });
    var reste = inst.etat.points.length;
    inst.charger('hexagone');
    if (reste !== 2) return { ok: false, message: 'un toucher qui tremble d\'1 px devrait enlever le clou : ' + reste + ' clous au lieu de 2' };
  }
  return { ok: true, message: '' };
});

var Allumettes = (function () {
  'use strict';
  var TOLERANCE = 1e-6;
  var R3 = Math.sqrt(3);

  function compter(points) {
    var aretes = [];
    for (var i = 0; i < points.length; i++) {
      for (var j = i + 1; j < points.length; j++) {
        var d = Math.hypot(points[i].x - points[j].x, points[i].y - points[j].y);
        if (Math.abs(d - 1) < TOLERANCE) aretes.push([i, j]);
      }
    }
    return aretes;
  }

  var modeles = {
    triangle: function () { return [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0.5, y: R3 / 2 }]; },
    hexagone: function () {
      var pts = [{ x: 0, y: 0 }];
      for (var k = 0; k < 6; k++) pts.push({ x: Math.cos(k * Math.PI / 3), y: Math.sin(k * Math.PI / 3) });
      return pts;
    },
    triangulaire: function () {
      var pts = [];
      for (var j = 0; j <= 3; j++) for (var i = 0; i <= 3 - j; i++) pts.push({ x: i + j / 2, y: j * R3 / 2 });
      return pts;
    },
    erdos: function () {
      var pts = [];
      for (var a = 0; a <= 5; a++) for (var b = 0; b <= 5; b++) pts.push({ x: a / 5, y: b / 5 });
      return pts;
    }
  };

  function intersections(a, b) {
    var dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy);
    if (d === 0 || d > 2) return [];
    var h = Math.sqrt(Math.max(0, 1 - d * d / 4)), mx = a.x + dx / 2, my = a.y + dy / 2;
    return [{ x: mx - dy / d * h, y: my + dx / d * h }, { x: mx + dy / d * h, y: my - dx / d * h }];
  }

  function aimanter(pos, points, ignorer) {
    var proches = [];
    points.forEach(function (p, i) {
      if (i === ignorer) return;
      var d = Math.hypot(pos.x - p.x, pos.y - p.y);
      if (d > 0 && Math.abs(d - 1) < 0.12) proches.push({ p: p, ecart: Math.abs(d - 1) });
    });
    proches.sort(function (a, b) { return a.ecart - b.ecart; });
    if (proches.length >= 2) {
      var meilleur = null, dmin = 0.15;
      intersections(proches[0].p, proches[1].p).forEach(function (q) {
        var d = Math.hypot(q.x - pos.x, q.y - pos.y);
        if (d < dmin) { dmin = d; meilleur = q; }
      });
      if (meilleur) return meilleur;
    }
    if (proches.length >= 1) {
      var c = proches[0].p, dx = pos.x - c.x, dy = pos.y - c.y, n = Math.hypot(dx, dy);
      return { x: c.x + dx / n, y: c.y + dy / n };
    }
    return pos;
  }

  return { compter: compter, modeles: modeles, aimanter: aimanter, intersections: intersections };
})();

Guide.enregistrerWidget('allumettes', function (zone) {
  var etat = { points: Allumettes.modeles.hexagone(), aimant: true, echelle: 60, origine: { x: 0, y: 0 } };
  var toile = Guide.toile(zone, { rapport: 0.8, alt: 'Plan où l\'on pose des clous ; chaque paire à distance 1 est reliée par une allumette.' });
  var barre = Guide.barre(zone);
  var compteurs = Guide.compteurs(zone);
  var prise = null;

  function cadrer() {
    var l = toile.largeur, h = toile.hauteur;
    if (!etat.points.length) { etat.echelle = l / 6; etat.origine = { x: l / 2, y: h / 2 }; return; }
    var xs = etat.points.map(function (p) { return p.x; }), ys = etat.points.map(function (p) { return p.y; });
    var minx = Math.min.apply(null, xs), maxx = Math.max.apply(null, xs), miny = Math.min.apply(null, ys), maxy = Math.max.apply(null, ys);
    etat.echelle = Math.min((l - 60) / Math.max(maxx - minx, 1), (h - 60) / Math.max(maxy - miny, 1), l / 3);
    etat.origine = { x: l / 2 - (minx + maxx) / 2 * etat.echelle, y: h / 2 + (miny + maxy) / 2 * etat.echelle };
  }
  function versEcran(p) { return { x: etat.origine.x + p.x * etat.echelle, y: etat.origine.y - p.y * etat.echelle }; }
  function versPlan(e) { return { x: (e.x - etat.origine.x) / etat.echelle, y: (etat.origine.y - e.y) / etat.echelle }; }

  function dessiner() {
    var c = Guide.couleurs(), ctx = toile.ctx;
    ctx.clearRect(0, 0, toile.largeur, toile.hauteur);
    var aretes = Allumettes.compter(etat.points);
    ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.strokeStyle = c.ambre;
    aretes.forEach(function (a) {
      var p = versEcran(etat.points[a[0]]), q = versEcran(etat.points[a[1]]);
      ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
    });
    etat.points.forEach(function (pt) {
      var p = versEcran(pt);
      ctx.beginPath(); ctx.arc(p.x, p.y, 7, 0, 2 * Math.PI); ctx.fillStyle = c.bleu; ctx.fill();
    });
    var n = etat.points.length;
    compteurs.fixer('clous', 'Clous', String(n));
    compteurs.fixer('allumettes', 'Allumettes', String(aretes.length));
    compteurs.fixer('ratio', 'Allumettes par clou', n ? Guide.nombre(aretes.length / n, 2) : '0');
  }

  function charger(nom) { etat.points = Allumettes.modeles[nom](); cadrer(); dessiner(); }
  function vider() { etat.points = []; cadrer(); dessiner(); }

  Guide.pointeur(toile.canvas, {
    appui: function (e) {
      var proche = -1;
      etat.points.forEach(function (pt, i) { var p = versEcran(pt); if (Math.hypot(p.x - e.x, p.y - e.y) < 22) proche = i; });
      if (proche >= 0) { prise = { indice: proche, bouge: false, nouveau: false, depart: e }; return; }
      var pos = versPlan(e);
      if (etat.aimant) pos = Allumettes.aimanter(pos, etat.points, -1);
      etat.points.push(pos);
      prise = { indice: etat.points.length - 1, bouge: false, nouveau: true, depart: e };
      dessiner();
    },
    deplacement: function (e) {
      if (!prise) return;
      if (!prise.bouge && Math.hypot(e.x - prise.depart.x, e.y - prise.depart.y) < 6) return;   // tremblement du doigt
      var pos = versPlan(e);
      if (etat.aimant) pos = Allumettes.aimanter(pos, etat.points, prise.indice);
      etat.points[prise.indice] = pos;
      prise.bouge = true;
      dessiner();
    },
    relache: function () {
      if (prise && !prise.bouge && !prise.nouveau) etat.points.splice(prise.indice, 1);
      prise = null;
      dessiner();
    }
  });

  Guide.bouton(barre, 'Triangle', function () { charger('triangle'); });
  Guide.bouton(barre, 'Hexagone + centre', function () { charger('hexagone'); });
  Guide.bouton(barre, 'Grille triangulaire', function () { charger('triangulaire'); });
  Guide.bouton(barre, "Grille d'Erdős", function () { charger('erdos'); });
  Guide.bouton(barre, 'Tout effacer', vider);
  Guide.bouton(barre, 'Aimant', function (actif) { etat.aimant = actif; }, { bascule: true, actif: true });

  toile.quandRedimensionne(function () { cadrer(); dessiner(); });
  cadrer();
  dessiner();
  return { etat: etat, toile: toile, vider: vider, charger: charger, versEcran: versEcran };
});
