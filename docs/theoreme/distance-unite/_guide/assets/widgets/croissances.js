/* Widget « croissances » : le bonus lent d'Erdős contre une petite puissance fixe. */
Guide.enregistrerControle('croissances', function () {
  var chiffres = Croissances.chiffresCroisement(1, 0.1);
  if (Math.abs(chiffres - 9565.97) > 0.1) return { ok: false, message: 'croisement pour C = 1, δ = 0,1 : ' + chiffres + ' chiffres (attendu ≈ 9 565,97)' };
  var x = Croissances.log10log10Croisement(1.7, 0.03);
  var e = Croissances.exposantErdos(x, 1.7);
  if (Math.abs(e - 1.03) > 1e-9) return { ok: false, message: 'au croisement, l\'exposant d\'Erdős vaut ' + e + ' au lieu de 1,03' };
  if (!isFinite(Croissances.log10log10Croisement(3, 0.01))) return { ok: false, message: 'débordement pour C/δ = 300' };
  return { ok: true, message: '' };
});

var Croissances = (function () {
  'use strict';
  /** x = log10(log10 n) : le nombre de chiffres de n, en échelle logarithmique. */
  function lnn(x) { return Math.pow(10, x) * Math.LN10; }
  /** Exposant du bonus d'Erdős : n · n^{C / ln ln n} = n^{1 + C / ln ln n}. */
  function exposantErdos(x, C) { return 1 + C / Math.log(lnn(x)); }
  /** n* = e^{e^{C/δ}} ; renvoie log10(log10 n*) sans débordement. */
  function log10log10Croisement(C, delta) { return (C / delta) * Math.LOG10E - Math.log10(Math.LN10); }
  /** Nombre approximatif de chiffres de n*. */
  function chiffresCroisement(C, delta) { return Math.pow(10, log10log10Croisement(C, delta)); }
  return { lnn: lnn, exposantErdos: exposantErdos, log10log10Croisement: log10log10Croisement, chiffresCroisement: chiffresCroisement };
})();

Guide.enregistrerWidget('croissances', function (zone) {
  var p = { C: 1, delta: 0.1 };
  var toile = Guide.toile(zone, { rapport: 0.7, alt: 'Courbe de l\'exposant d\'Erdős qui baisse lentement, et droite horizontale de l\'exposant fixe 1 + δ.' });
  var barre = Guide.barre(zone);
  var compteurs = Guide.compteurs(zone);

  function texteChiffres(log10Chiffres) {
    if (log10Chiffres < 6) return Guide.nombre(Math.pow(10, log10Chiffres), 0) + ' chiffres';
    return 'environ 10^' + Guide.nombre(log10Chiffres, 1) + ' chiffres';
  }

  function dessiner() {
    var c = Guide.couleurs(), ctx = toile.ctx, L = toile.largeur, H = toile.hauteur, m = 36;
    var xc = Croissances.log10log10Croisement(p.C, p.delta);
    var xmax = Math.max(3, Math.min(xc + 1, 140));
    var ymax = 1 + Math.max(4 * p.delta, 0.6);
    function X(x) { return m + (x / xmax) * (L - 2 * m); }
    function Y(y) { return H - m - ((y - 1) / (ymax - 1)) * (H - 2 * m); }
    ctx.clearRect(0, 0, L, H);
    ctx.strokeStyle = c.trait; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(m, Y(1)); ctx.lineTo(L - m, Y(1)); ctx.moveTo(m, m / 2); ctx.lineTo(m, H - m); ctx.stroke();
    ctx.fillStyle = c.discret; ctx.font = '12px system-ui, sans-serif';
    ctx.fillText('exposant', 4, 14);
    ctx.fillText('taille de n →', L - m - 80, H - 10);
    ctx.strokeStyle = c.ambre; ctx.lineWidth = 3; ctx.beginPath();
    for (var k = 0; k <= 200; k++) {
      var x = (k / 200) * xmax, y = Math.min(Croissances.exposantErdos(Math.max(x, 0.05), p.C), ymax);
      if (k === 0) ctx.moveTo(X(x), Y(y)); else ctx.lineTo(X(x), Y(y));
    }
    ctx.stroke();
    ctx.strokeStyle = c.sarcelle; ctx.beginPath(); ctx.moveTo(X(0), Y(1 + p.delta)); ctx.lineTo(X(xmax), Y(1 + p.delta)); ctx.stroke();
    ctx.fillStyle = c.ambre; ctx.fillText('bonus d\'Erdős (lièvre)', X(0.1), Y(Math.min(Croissances.exposantErdos(0.3, p.C), ymax)) - 6);
    ctx.fillStyle = c.sarcelle; ctx.fillText('puissance fixe 1 + δ (tortue)', X(0) + 6, Y(1 + p.delta) + 16);
    if (xc <= xmax) {
      ctx.setLineDash([4, 4]); ctx.strokeStyle = c.rouge; ctx.beginPath(); ctx.moveTo(X(xc), m / 2); ctx.lineTo(X(xc), H - m); ctx.stroke(); ctx.setLineDash([]);
    }
    compteurs.fixer('croisement', 'La tortue passe devant quand n a', texteChiffres(xc));
    compteurs.fixer('univers', 'Bonus d\'Erdős pour un n de 80 chiffres', 'n^' + Guide.nombre(p.C / Math.log(80 * Math.LN10), 3));
    compteurs.fixer('fixe', 'Puissance fixe', 'n^' + Guide.nombre(p.delta, 2));
  }

  Guide.curseur(barre, { nom: 'Taille du bonus d\'Erdős (C)', min: 0.2, max: 3, pas: 0.1, valeur: 1, format: function (v) { return Guide.nombre(v, 1); }, change: function (v) { p.C = v; dessiner(); } });
  Guide.curseur(barre, { nom: 'Petite puissance (δ)', min: 0.01, max: 0.5, pas: 0.01, valeur: 0.1, format: function (v) { return Guide.nombre(v, 2); }, change: function (v) { p.delta = v; dessiner(); } });
  toile.quandRedimensionne(dessiner);
  dessiner();
  return { parametres: p };
});
