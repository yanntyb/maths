/* Widget « fenêtre » : un disque lancé au hasard sur un pavage ; une position au moins bat la moyenne. */
Guide.enregistrerControle('fenetre', function () {
  if (Fenetre.aireChevauchement(0.5) !== 0) return { ok: false, message: 'chevauchement non nul à R = 0,5' };
  if (!(Fenetre.rho(1000) > 0.999)) return { ok: false, message: 'ρ devrait tendre vers 1' };
  var R = 1.5, r = Guide.hasard(7), sN = 0, sE = 0, meilleur = -Infinity, cible = Fenetre.PAS.length * Fenetre.rho(R);
  for (var i = 0; i < 2000; i++) {
    var l = Fenetre.lancer(R, r(), r());
    sN += l.N; sE += l.E;
    meilleur = Math.max(meilleur, l.E - cible * l.N);
  }
  var moy = Fenetre.moyennes(R);
  if (Math.abs(sN / 2000 - moy.N) / moy.N > 0.03) return { ok: false, message: 'moyenne des clous ' + sN / 2000 + ' au lieu de ' + moy.N };
  if (Math.abs(sE / 2000 - moy.E) / moy.E > 0.05) return { ok: false, message: 'moyenne des paires ' + sE / 2000 + ' au lieu de ' + moy.E };
  if (meilleur < 0) return { ok: false, message: 'aucun lancer n\'atteint la moyenne' };
  return { ok: true, message: '' };
});

var Fenetre = (function () {
  'use strict';
  var S = 5;   // pavage (1/5)·Z² ; les 12 pas viennent de 25 = 0² + 5² = 3² + 4²
  var PAS = [[5, 0], [-5, 0], [0, 5], [0, -5], [3, 4], [3, -4], [-3, 4], [-3, -4], [4, 3], [4, -3], [-4, 3], [-4, -3]];
  /** Aire commune à deux disques de rayon R dont les centres sont à distance 1. */
  function aireChevauchement(R) { if (R <= 0.5) return 0; return 2 * R * R * Math.acos(1 / (2 * R)) - 0.5 * Math.sqrt(4 * R * R - 1); }
  function rho(R) { return aireChevauchement(R) / (Math.PI * R * R); }
  /** Pavage décalé de (ax, ay)/S, coupé par le disque de rayon R ; paires orientées (x, x + pas). */
  function lancer(R, ax, ay) {
    var r = Math.ceil(R * S) + 1, dedans = {}, points = [];
    for (var i = -r; i <= r; i++) for (var j = -r; j <= r; j++) {
      var x = (i + ax) / S, y = (j + ay) / S;
      if (x * x + y * y <= R * R) { dedans[i + ',' + j] = true; points.push([i, j]); }
    }
    var paires = [];
    points.forEach(function (p) { PAS.forEach(function (u) { if (dedans[(p[0] + u[0]) + ',' + (p[1] + u[1])]) paires.push([p, u]); }); });
    return { points: points, paires: paires, N: points.length, E: paires.length };
  }
  function moyennes(R) { return { N: Math.PI * R * R * S * S, E: PAS.length * aireChevauchement(R) * S * S }; }
  return { S: S, PAS: PAS, aireChevauchement: aireChevauchement, rho: rho, lancer: lancer, moyennes: moyennes };
})();

Guide.enregistrerWidget('fenetre', function (zone) {
  var etat = { R: 1.5, a: [0.3, 0.6], graine: 5, rapports: [] };
  var toile = Guide.toile(zone, { rapport: 1, alt: 'Pavage de points ; un disque fenêtre ; les allumettes entre clous de la fenêtre.' });
  var histo = Guide.toile(zone, { rapport: 0.45, alt: 'Histogramme des allumettes par clou sur tous les lancers, avec la moyenne attendue.' });
  var lentille = Guide.toile(zone, { rapport: 0.35, alt: 'Deux disques décalés de 1 : leur partie commune.' });
  var barre = Guide.barre(zone);
  var compteurs = Guide.compteurs(zone);
  var hasard = Guide.hasard(etat.graine);

  function attendu() { return Fenetre.PAS.length * Fenetre.rho(etat.R) / 2; }
  function dessinerPavage() {
    var c = Guide.couleurs(), ctx = toile.ctx, L = toile.largeur, H = toile.hauteur;
    var l = Fenetre.lancer(etat.R, etat.a[0], etat.a[1]), e = (L / 2 - 10) / (etat.R + 0.3), S = Fenetre.S;
    function X(i) { return L / 2 + ((i + etat.a[0]) / S) * e; }
    function Y(j) { return H / 2 - ((j + etat.a[1]) / S) * e; }
    ctx.clearRect(0, 0, L, H);
    var r = Math.ceil((etat.R + 0.3) * S);
    ctx.fillStyle = c.trait;
    for (var i = -r; i <= r; i++) for (var j = -r; j <= r; j++) { ctx.beginPath(); ctx.arc(X(i), Y(j), 1.5, 0, 2 * Math.PI); ctx.fill(); }
    ctx.strokeStyle = c.ambre; ctx.globalAlpha = 0.6; ctx.lineWidth = 1;
    l.paires.forEach(function (p) {
      var u = p[1];
      if (u[0] < 0 || (u[0] === 0 && u[1] < 0)) return;
      ctx.beginPath(); ctx.moveTo(X(p[0][0]), Y(p[0][1])); ctx.lineTo(X(p[0][0] + u[0]), Y(p[0][1] + u[1])); ctx.stroke();
    });
    ctx.globalAlpha = 1;
    ctx.fillStyle = c.bleu;
    l.points.forEach(function (p) { ctx.beginPath(); ctx.arc(X(p[0]), Y(p[1]), 2.6, 0, 2 * Math.PI); ctx.fill(); });
    ctx.strokeStyle = c.sarcelle; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(L / 2, H / 2, etat.R * e, 0, 2 * Math.PI); ctx.stroke();
    compteurs.fixer('clous', 'Clous dans la fenêtre', Guide.nombre(l.N));
    compteurs.fixer('allumettes', 'Allumettes', Guide.nombre(l.E / 2));
    compteurs.fixer('parclou', 'Allumettes par clou (ce lancer)', l.N ? Guide.nombre(l.E / 2 / l.N, 2) : '0');
    compteurs.fixer('attendu', 'Moyenne attendue par clou', Guide.nombre(attendu(), 2));
    return l;
  }
  function dessinerHisto() {
    var c = Guide.couleurs(), ctx = histo.ctx, L = histo.largeur, H = histo.hauteur, m = 20;
    ctx.clearRect(0, 0, L, H);
    var a = attendu(), bas = a * 0.8, haut = a * 1.2, cases = 24, compte = [];
    for (var k = 0; k < cases; k++) compte.push(0);
    etat.rapports.forEach(function (v) { var k2 = Math.floor((v - bas) / (haut - bas) * cases); if (k2 >= 0 && k2 < cases) compte[k2]++; });
    var max = Math.max(1, Math.max.apply(null, compte)), w = (L - 2 * m) / cases;
    ctx.fillStyle = c.bleu;
    compte.forEach(function (n, k3) { var h = (n / max) * (H - 2 * m); ctx.fillRect(m + k3 * w + 1, H - m - h, w - 2, h); });
    var xa = m + ((a - bas) / (haut - bas)) * (L - 2 * m);
    ctx.strokeStyle = c.rouge; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(xa, 4); ctx.lineTo(xa, H - m); ctx.stroke(); ctx.setLineDash([]);
    var dessus = etat.rapports.filter(function (v) { return v >= a; }).length;
    compteurs.fixer('lancers', 'Lancers au-dessus de la moyenne', etat.rapports.length ? dessus + ' sur ' + etat.rapports.length : 'aucun lancer');
  }
  function dessinerLentille() {
    var c = Guide.couleurs(), ctx = lentille.ctx, L = lentille.largeur, H = lentille.hauteur;
    var e = (H / 2 - 6) / etat.R, cx = L / 2;
    ctx.clearRect(0, 0, L, H);
    ctx.globalAlpha = 0.25; ctx.fillStyle = c.sarcelle;
    ctx.beginPath(); ctx.arc(cx - e / 2, H / 2, etat.R * e, 0, 2 * Math.PI); ctx.fill();
    ctx.beginPath(); ctx.arc(cx + e / 2, H / 2, etat.R * e, 0, 2 * Math.PI); ctx.fill();
    ctx.globalAlpha = 1;
    compteurs.fixer('rho', 'Part commune de deux fenêtres décalées de 1', Guide.nombre(Fenetre.rho(etat.R) * 100, 1) + ' %');
  }
  function lancerUneFois() {
    etat.a = [hasard(), hasard()];
    var l = Fenetre.lancer(etat.R, etat.a[0], etat.a[1]);
    if (l.N) etat.rapports.push(l.E / 2 / l.N);
  }
  function toutDessiner() { dessinerPavage(); dessinerHisto(); dessinerLentille(); }

  Guide.curseur(barre, { nom: 'Rayon de la fenêtre', min: 0.8, max: 2.5, pas: 0.1, valeur: etat.R, format: function (v) { return Guide.nombre(v, 1); }, change: function (v) { etat.R = v; etat.rapports = []; toutDessiner(); } });
  Guide.bouton(barre, 'Lancer la fenêtre', function () { lancerUneFois(); toutDessiner(); });
  Guide.bouton(barre, 'Lancer 200 fois', function () { for (var i = 0; i < 200; i++) lancerUneFois(); toutDessiner(); });
  Guide.bouton(barre, 'Effacer l\'histogramme', function () { etat.rapports = []; toutDessiner(); });
  toile.quandRedimensionne(dessinerPavage);
  histo.quandRedimensionne(dessinerHisto);
  lentille.quandRedimensionne(dessinerLentille);
  for (var i = 0; i < 50; i++) lancerUneFois();
  toutDessiner();
  return { etat: etat };
});
