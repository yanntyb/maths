/* Widget « deux carrés » : les nombres qui sont somme de deux carrés de beaucoup de façons. */
Guide.enregistrerControle('deux-carres', function () {
  var P = DeuxCarres.BONS_PREMIERS;
  if (P.length !== 30) return { ok: false, message: '30 bons premiers attendus' };
  for (var p = 2; p <= P[P.length - 1]; p++) {
    var attendu = DeuxCarres.estPremier(p) && p % 4 === 1;
    if (attendu !== (P.indexOf(p) >= 0)) return { ok: false, message: 'liste des bons premiers incorrecte autour de ' + p };
  }
  var N = 1;
  for (var t = 0; t <= 5; t++) {
    if (t > 0) N *= P[t - 1];
    var n = DeuxCarres.pointsSurCercle(N).length;
    if (n !== 4 * Math.pow(2, t)) return { ok: false, message: 'N = ' + N + ' : ' + n + ' points sur le cercle (attendu ' + 4 * Math.pow(2, t) + ')' };
  }
  for (t = 2; t <= 30; t++) {
    if (!(DeuxCarres.cout(t).exposant < DeuxCarres.cout(t - 1).exposant)) return { ok: false, message: 'l\'exposant gagné devrait baisser à t = ' + t };
  }
  return { ok: true, message: '' };
});

var DeuxCarres = (function () {
  'use strict';
  var BONS_PREMIERS = [5, 13, 17, 29, 37, 41, 53, 61, 73, 89, 97, 101, 109, 113, 137, 149, 157, 173, 181, 193, 197, 229, 233, 241, 257, 269, 277, 281, 293, 313];
  function estPremier(p) { if (p < 2) return false; for (var d = 2; d * d <= p; d++) if (p % d === 0) return false; return true; }
  function pointsSurCercle(N) {
    var res = [], r = Math.floor(Math.sqrt(N));
    for (var a = -r; a <= r; a++) {
      var b2 = N - a * a, b = Math.round(Math.sqrt(b2));
      if (b * b === b2) { res.push([a, b]); if (b !== 0) res.push([a, -b]); }
    }
    return res;
  }
  /** Recette d'Erdős avec les t plus petits bons premiers ; logarithmes naturels. */
  function cout(t) {
    var logN = 0;
    for (var i = 0; i < t; i++) logN += Math.log(BONS_PREMIERS[i]);
    var logChemins = Math.log(4) + t * Math.LN2;   // 4 · 2^t façons
    var logn = Math.log(4) + logN;                   // au moins 4N clous (√N ≤ côté / 2)
    return { t: t, logN: logN, logChemins: logChemins, logn: logn, exposant: logChemins / logn };
  }
  return { BONS_PREMIERS: BONS_PREMIERS, estPremier: estPremier, pointsSurCercle: pointsSurCercle, cout: cout };
})();

Guide.enregistrerWidget('deux-carres', function (zone, options) {
  return options.mode === 'cout' ? monterCout(zone) : monterCercle(zone);

  function monterCercle(zone) {
    var choisis = [5];
    var toile = Guide.toile(zone, { rapport: 1, alt: 'Cercle de rayon racine de N et ses points à coordonnées entières.' });
    var barre = Guide.barre(zone);
    var compteurs = Guide.compteurs(zone);
    function dessiner() {
      var c = Guide.couleurs(), ctx = toile.ctx, L = toile.largeur, H = toile.hauteur;
      var N = choisis.reduce(function (a, b) { return a * b; }, 1), r = Math.sqrt(N), pts = DeuxCarres.pointsSurCercle(N);
      var echelle = (Math.min(L, H) / 2 - 16) / r, cx = L / 2, cy = H / 2;
      ctx.clearRect(0, 0, L, H);
      if (r <= 12) {
        ctx.fillStyle = c.trait;
        for (var a = -Math.floor(r); a <= Math.floor(r); a++) for (var b = -Math.floor(r); b <= Math.floor(r); b++) {
          ctx.beginPath(); ctx.arc(cx + a * echelle, cy - b * echelle, 1.6, 0, 2 * Math.PI); ctx.fill();
        }
      }
      ctx.strokeStyle = c.sarcelle; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(cx, cy, r * echelle, 0, 2 * Math.PI); ctx.stroke();
      ctx.strokeStyle = c.trait; ctx.lineWidth = 1;
      pts.forEach(function (p) { ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + p[0] * echelle, cy - p[1] * echelle); ctx.stroke(); });
      ctx.fillStyle = c.rouge;
      pts.forEach(function (p) { ctx.beginPath(); ctx.arc(cx + p[0] * echelle, cy - p[1] * echelle, 3.5, 0, 2 * Math.PI); ctx.fill(); });
      compteurs.fixer('N', 'N', choisis.length ? choisis.join(' × ') + ' = ' + Guide.nombre(N) : '1');
      compteurs.fixer('points', 'Façons d\'écrire N = a² + b²', Guide.nombre(pts.length));
      compteurs.fixer('formule', 'Règle', '4 × 2^' + choisis.length + ' = ' + Guide.nombre(4 * Math.pow(2, choisis.length)));
    }
    [5, 13, 17, 29, 37].forEach(function (p) {
      Guide.bouton(barre, String(p), function (actif) {
        if (actif) choisis.push(p); else choisis = choisis.filter(function (q) { return q !== p; });
        choisis.sort(function (a, b) { return a - b; });
        dessiner();
      }, { bascule: true, actif: p === 5 });
    });
    toile.quandRedimensionne(dessiner);
    dessiner();
    return { choisis: choisis };
  }

  function monterCout(zone) {
    var t = 3;
    var toile = Guide.toile(zone, { rapport: 0.7, alt: 'Exposant gagné par clou en fonction du nombre de bons premiers : il descend vers zéro.' });
    var barre = Guide.barre(zone);
    var compteurs = Guide.compteurs(zone);
    function dessiner() {
      var c = Guide.couleurs(), ctx = toile.ctx, L = toile.largeur, H = toile.hauteur, m = 32;
      ctx.clearRect(0, 0, L, H);
      function X(k) { return m + ((k - 1) / 29) * (L - 2 * m); }
      function Y(e) { return H - m - (e / 0.7) * (H - 2 * m); }
      ctx.strokeStyle = c.trait; ctx.beginPath(); ctx.moveTo(m, H - m); ctx.lineTo(L - m, H - m); ctx.moveTo(m, m / 2); ctx.lineTo(m, H - m); ctx.stroke();
      ctx.fillStyle = c.discret; ctx.font = '12px system-ui, sans-serif';
      ctx.fillText('exposant gagné par clou', 4, 14);
      ctx.fillText('bons premiers t →', L - m - 100, H - 8);
      for (var k = 1; k <= 30; k++) {
        var e = DeuxCarres.cout(k).exposant;
        ctx.fillStyle = k === t ? c.rouge : c.ambre;
        ctx.beginPath(); ctx.arc(X(k), Y(e), k === t ? 6 : 3.5, 0, 2 * Math.PI); ctx.fill();
      }
      var r = DeuxCarres.cout(t);
      var premiers = DeuxCarres.BONS_PREMIERS.slice(0, Math.min(t, 6)).join(', ') + (t > 6 ? ', …' : '');
      compteurs.fixer('premiers', 'Bons premiers utilisés', premiers);
      compteurs.fixer('chemins', 'Directions de longueur 1 par clou', r.logChemins / Math.LN10 < 6 ? Guide.nombre(Math.exp(r.logChemins)) : '10^' + Guide.nombre(r.logChemins / Math.LN10, 1));
      compteurs.fixer('clous', 'Clous nécessaires', Guide.chiffres(r.logn / Math.LN10));
      compteurs.fixer('exposant', 'Exposant gagné', Guide.nombre(r.exposant, 3));
    }
    Guide.curseur(barre, { nom: 'Nombre de bons premiers (t)', min: 1, max: 30, valeur: 3, change: function (v) { t = v; dessiner(); } });
    toile.quandRedimensionne(dessiner);
    dessiner();
    return {};
  }
});
