/* Widget « ombre » : des points sur plusieurs écrans, des pas de longueur 1 partout, un seul écran publié. */
Guide.enregistrerControle('ombre', function () {
  [8, 7].forEach(function (m) {
    Ombre.pasMagiques(m).forEach(function (u, j) {
      u.forEach(function (z, e) { if (Math.abs(Cyclo.abs(z) - 1) > 1e-9) throw new Error('pas ' + j + ', écran ' + (e + 1) + ' : longueur ' + Cyclo.abs(z)); });
    });
  });
  var pas8 = Ombre.pasMagiques(8);
  var sans = [1, 2, 3, 4].map(function (K) { return Ombre.points(pas8, K, 2, false).points.length; });
  for (var i = 1; i < sans.length; i++) if (!(sans[i] > sans[i - 1])) return { ok: false, message: 'sans fenêtre cachée, les points devraient s\'entasser : ' + sans.join(', ') };
  var a = Ombre.points(pas8, 5, 1.5, true).points.length, b = Ombre.points(pas8, 6, 1.5, true).points.length;
  if (a !== b) return { ok: false, message: 'avec fenêtre cachée, le nombre de points devrait se stabiliser : ' + a + ' puis ' + b };
  var res = Ombre.points(pas8, 3, 2, true);
  for (i = 0; i < res.aretes.length; i++) {
    var p = res.points[res.aretes[i][0]].x[0], q = res.points[res.aretes[i][1]].x[0];
    if (Math.abs(Math.hypot(p.re - q.re, p.im - q.im) - 1) > 1e-9) return { ok: false, message: 'une allumette de l\'écran 1 ne mesure pas 1' };
  }
  var t0 = performance.now();
  Ombre.points(Ombre.pasMagiques(7), 6, 2.5, false);
  if (performance.now() - t0 > 300) return { ok: false, message: 'calcul trop lent pour un téléphone' };
  return { ok: true, message: '' };
});

var Ombre = (function () {
  'use strict';
  /** Coefficients des α_j dans la base 1, ζ, ζ², … ; pas u_j = α_j / c(α_j). */
  var PAS = {
    8: [[1, 1, 0, 0], [2, 0, 1, 0], [1, 0, 0, 1]],
    7: [[1, 1, 0, 0, 0, 0], [2, 0, 1, 0, 0, 0], [1, 0, 0, 1, 0, 0]]
  };
  function pasMagiques(m) { var k = Cyclo.corps(m); return PAS[m].map(function (a) { return k.pasMagique(a); }); }
  function cle(x) { return x.map(function (z) { return Math.round(z.re * 1e6) + ',' + Math.round(z.im * 1e6); }).join(';'); }

  /** Points x = Σ n_j u_j (|n_j| ≤ K) gardés si |x₁| ≤ R et, si fenetreCachee, |x_k| ≤ R sur chaque écran. */
  function points(pas, K, R, fenetreCachee) {
    var nb = pas.length, f = pas[0].length, base = 2 * K + 1, total = Math.pow(base, nb);
    var index = {}, liste = [];
    for (var idx = 0; idx < total; idx++) {
      var reste = idx, coeffs = [];
      for (var j = 0; j < nb; j++) { coeffs.push((reste % base) - K); reste = Math.floor(reste / base); }
      var x = [];
      for (var e = 0; e < f; e++) {
        var s = { re: 0, im: 0 };
        for (j = 0; j < nb; j++) { s.re += coeffs[j] * pas[j][e].re; s.im += coeffs[j] * pas[j][e].im; }
        x.push(s);
      }
      if (Cyclo.abs(x[0]) > R) continue;
      if (fenetreCachee && x.some(function (z) { return Cyclo.abs(z) > R; })) continue;
      var k = cle(x);
      if (index[k] !== undefined) continue;
      index[k] = liste.length;
      liste.push({ x: x, coeffs: coeffs });
    }
    var aretes = [];
    liste.forEach(function (p, i) {
      for (var j2 = 0; j2 < nb; j2++) {
        var y = p.x.map(function (z, e2) { return { re: z.re + pas[j2][e2].re, im: z.im + pas[j2][e2].im }; });
        var cible = index[cle(y)];
        if (cible !== undefined) aretes.push([i, cible, j2]);
      }
    });
    return { points: liste, aretes: aretes };
  }
  return { PAS: PAS, pasMagiques: pasMagiques, points: points };
})();

Guide.enregistrerWidget('ombre', function (zone, options) {
  var m = options.ecrans === '3' ? 7 : 8, pas = Ombre.pasMagiques(m), f = pas[0].length;
  var etat = { K: 3, R: 2, fenetreCachee: options.mode !== 'fenetre', choisi: 0, graine: 3, res: null };
  var toile = Guide.toile(zone, { rapport: 1.55, alt: 'Grand écran 1 (le plan publié) et petits écrans cachés ; les mêmes points vus sur chaque écran.' });
  var barre = Guide.barre(zone);
  var compteurs = Guide.compteurs(zone);

  function calculer() {
    etat.res = Ombre.points(pas, etat.K, etat.R, etat.fenetreCachee);
    var voisins = etat.res.aretes.map(function (a) { return a[0]; });
    if (voisins.indexOf(etat.choisi) < 0) etat.choisi = voisins.length ? voisins[0] : 0;
  }

  function cadre(k) {
    var L = toile.largeur;
    if (k === 0) return { x: 0, y: 0, cote: L };
    var petit = L / 2, n = f - 1, debut = (L - n * petit) / 2;
    return { x: debut + (k - 1) * petit, y: L + 8, cote: petit };
  }

  function dessiner() {
    var c = Guide.couleurs(), ctx = toile.ctx, res = etat.res;
    ctx.clearRect(0, 0, toile.largeur, toile.hauteur);
    for (var k = 0; k < f; k++) {
      var b = cadre(k), cx = b.x + b.cote / 2, cy = b.y + b.cote / 2;
      var portee = etat.R;
      if (k > 0 && !etat.fenetreCachee) res.points.forEach(function (p) { portee = Math.max(portee, Cyclo.abs(p.x[k])); });
      var e = (b.cote / 2 - 8) / (portee * 1.05);
      ctx.strokeStyle = c.trait; ctx.lineWidth = 1; ctx.strokeRect(b.x + 2, b.y + 2, b.cote - 4, b.cote - 4);
      ctx.setLineDash(k > 0 && !etat.fenetreCachee ? [4, 4] : []);
      ctx.strokeStyle = k > 0 && !etat.fenetreCachee ? c.discret : c.sarcelle;
      ctx.beginPath(); ctx.arc(cx, cy, etat.R * e, 0, 2 * Math.PI); ctx.stroke(); ctx.setLineDash([]);
      if (k === 0) {
        ctx.strokeStyle = c.ambre; ctx.globalAlpha = 0.5; ctx.lineWidth = 1;
        res.aretes.forEach(function (a) {
          var p = res.points[a[0]].x[0], q = res.points[a[1]].x[0];
          ctx.beginPath(); ctx.moveTo(cx + p.re * e, cy - p.im * e); ctx.lineTo(cx + q.re * e, cy - q.im * e); ctx.stroke();
        });
        ctx.globalAlpha = 1;
      }
      ctx.fillStyle = c.bleu;
      res.points.forEach(function (p) { ctx.beginPath(); ctx.arc(cx + p.x[k].re * e, cy - p.x[k].im * e, k === 0 ? 2.6 : 2, 0, 2 * Math.PI); ctx.fill(); });
      var centre = res.points[etat.choisi];
      if (centre) {
        res.aretes.forEach(function (a) {
          if (a[0] !== etat.choisi) return;
          var p = centre.x[k], q = res.points[a[1]].x[k];
          ctx.strokeStyle = c.rouge; ctx.lineWidth = 2.5;
          ctx.beginPath(); ctx.moveTo(cx + p.re * e, cy - p.im * e); ctx.lineTo(cx + q.re * e, cy - q.im * e); ctx.stroke();
        });
        ctx.fillStyle = c.rouge; ctx.beginPath(); ctx.arc(cx + centre.x[k].re * e, cy - centre.x[k].im * e, 4.5, 0, 2 * Math.PI); ctx.fill();
      }
      ctx.fillStyle = c.discret; ctx.font = '12px system-ui, sans-serif';
      ctx.fillText(k === 0 ? 'écran 1 : le plan publié' : 'écran caché ' + (k + 1), b.x + 8, b.y + 18);
    }
    var n = res.points.length, ecart = Infinity;
    for (var i = 0; i < n; i++) for (var j = i + 1; j < n; j++) {
      var p1 = res.points[i].x[0], p2 = res.points[j].x[0];
      ecart = Math.min(ecart, Math.hypot(p1.re - p2.re, p1.im - p2.im));
    }
    compteurs.fixer('points', 'Clous sur l\'écran 1', Guide.nombre(n));
    compteurs.fixer('allumettes', 'Allumettes', Guide.nombre(res.aretes.length));
    compteurs.fixer('ecart', 'Plus petit écart entre deux clous', n > 1 ? Guide.nombre(ecart, 4) : '—');
  }

  function maj() { calculer(); dessiner(); }

  Guide.curseur(barre, { nom: 'Taille des sommes de pas', min: 1, max: 6, valeur: etat.K, change: function (v) { etat.K = v; maj(); } });
  Guide.curseur(barre, { nom: 'Rayon de la fenêtre', min: 1, max: 2.5, pas: 0.1, valeur: etat.R, format: function (v) { return Guide.nombre(v, 1); }, change: function (v) { etat.R = v; maj(); } });
  Guide.bouton(barre, 'Fenêtre sur les écrans cachés', function (actif) { etat.fenetreCachee = actif; maj(); }, { bascule: true, actif: etat.fenetreCachee });
  Guide.bouton(barre, 'Un autre point', function () {
    var avecVoisins = etat.res.aretes.map(function (a) { return a[0]; });
    if (avecVoisins.length) etat.choisi = avecVoisins[Math.floor(Guide.hasard(++etat.graine)() * avecVoisins.length)];
    dessiner();
  });
  toile.quandRedimensionne(dessiner);
  maj();
  return { etat: etat };
});
