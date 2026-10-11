/* Widget « bilan » : trois croissances exponentielles et la course clés / tiroirs. */
Guide.enregistrerControle('bilan', function () {
  var e = Bilan.etat(0.5, 8, 50);
  if (Math.abs(e.delta - 0.015625) > 1e-12) return { ok: false, message: 'δ = ' + e.delta + ' au lieu de 0,015625' };
  if (Math.abs(Bilan.etat(0.5, 8, 2000).exposant - 1.03125) > 1e-3) return { ok: false, message: 'l\'exposant devrait tendre vers 1 + γ/2B' };
  for (var t = 2; t <= 30; t++) if (!(Bilan.grille(t).exposant < Bilan.grille(t - 1).exposant)) return { ok: false, message: 'l\'exposant de la grille devrait baisser à t = ' + t };
  if (!(Bilan.course(100, 2).gamma < 0) || !(Bilan.course(5000, 2).gamma > 0)) return { ok: false, message: 'la course clés / tiroirs devrait changer de signe entre ℓ = 100 et ℓ = 5000' };
  return { ok: true, message: '' };
});

var Bilan = (function () {
  'use strict';
  /** En log10 : pas e^{γf}, clous au plus e^{Bf} (pire cas retenu), allumettes au moins ½ · n · e^{γf/2}. */
  function etat(gamma, B, f) {
    var L = Math.LOG10E;
    var logPas = gamma * f * L, logn = B * f * L;
    var logAllumettes = logn + (gamma * f / 2) * L - Math.log10(2);
    return { logPas: logPas, logn: logn, logAllumettes: logAllumettes, exposant: logAllumettes / logn, delta: gamma / (4 * B), exposantLimite: 1 + gamma / (2 * B) };
  }
  /** Recette d'Erdős avec t bons premiers (t ≤ 30) : taille log10 n et exposant 1 + log chemins / log n. */
  function grille(t) { var c = DeuxCarres.cout(Math.min(t, 30)); return { logn: c.logn * Math.LOG10E, exposant: 1 + c.exposant }; }
  /** Course : clés t·log 2 contre tiroirs c·ℓ·log ℓ (c illustratif : la vraie constante n'est pas connue). */
  function course(l, c) {
    var t = Math.floor((l - 1) * (l - 1) / 100);
    var cles = t * Math.LN2, tiroirs = c * l * Math.log(l);
    return { t: t, cles: cles, tiroirs: tiroirs, gamma: cles - tiroirs };
  }
  return { etat: etat, grille: grille, course: course, C_ILLUSTRATIF: 2 };
})();

Guide.enregistrerWidget('bilan', function (zone, options) {
  return options.mode === 'course' ? monterCourse(zone) : monterBilan(zone);

  function monterBilan(zone) {
    var p = { gamma: 0.5, B: 8, f: 40, grille: false };
    var toile = Guide.toile(zone, { rapport: 0.55, alt: 'Trois barres : pas magiques, clous, allumettes, en nombre de chiffres.' });
    var courbe = Guide.toile(zone, { rapport: 0.6, alt: 'Exposant obtenu en fonction de la taille : constant pour la preuve, qui s\'écrase vers 1 pour la grille d\'Erdős.' });
    var barre = Guide.barre(zone);
    var compteurs = Guide.compteurs(zone);
    function dessiner() {
      var c = Guide.couleurs(), ctx = toile.ctx, L = toile.largeur, H = toile.hauteur, e = Bilan.etat(p.gamma, p.B, p.f);
      ctx.clearRect(0, 0, L, H);
      var lignes = [['pas magiques', e.logPas, c.rouge], ['clous (au plus)', e.logn, c.bleu], ['allumettes (au moins)', e.logAllumettes, c.ambre]];
      var max = Math.max(e.logAllumettes, 1), h = H / 3;
      lignes.forEach(function (ligne, i) {
        var w = (ligne[1] / max) * (L - 16);
        ctx.fillStyle = ligne[2]; ctx.fillRect(8, i * h + h * 0.45, Math.max(w, 2), h * 0.4);
        ctx.fillStyle = c.texte; ctx.font = '13px system-ui, sans-serif';
        ctx.fillText(ligne[0] + ' : ' + Guide.chiffres(ligne[1]), 8, i * h + h * 0.38);
      });
      dessinerCourbe(e);
      compteurs.fixer('exposant', 'Exposant obtenu', Guide.nombre(e.exposant, 4));
      compteurs.fixer('limite', 'Exposant visé (f très grand)', '1 + γ/2B = 1 + ' + Guide.nombre(p.gamma / (2 * p.B), 4));
      compteurs.fixer('delta', 'δ garanti par la preuve', Guide.nombre(e.delta, 4));
    }
    function dessinerCourbe(e) {
      var c = Guide.couleurs(), ctx = courbe.ctx, L = courbe.largeur, H = courbe.hauteur, m = 30;
      ctx.clearRect(0, 0, L, H);
      if (!p.grille) { ctx.fillStyle = c.discret; ctx.font = '13px system-ui, sans-serif'; ctx.fillText('Active « grille d\'Erdős » pour comparer.', m, H / 2); return; }
      var xmax = 60, ymax = 1.8;
      function X(v) { return m + (v / xmax) * (L - 2 * m); }
      function Y(v) { return H - m - ((v - 1) / (ymax - 1)) * (H - 2 * m); }
      ctx.strokeStyle = c.trait; ctx.beginPath(); ctx.moveTo(m, Y(1)); ctx.lineTo(L - m, Y(1)); ctx.moveTo(m, m / 2); ctx.lineTo(m, H - m); ctx.stroke();
      ctx.strokeStyle = c.sarcelle; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(X(0), Y(e.exposantLimite)); ctx.lineTo(X(xmax), Y(e.exposantLimite)); ctx.stroke();
      ctx.fillStyle = c.ambre;
      for (var t = 1; t <= 30; t++) { var g = Bilan.grille(t); if (g.logn <= xmax) { ctx.beginPath(); ctx.arc(X(g.logn), Y(Math.min(g.exposant, ymax)), 3.5, 0, 2 * Math.PI); ctx.fill(); } }
      ctx.font = '12px system-ui, sans-serif';
      ctx.fillStyle = c.sarcelle; ctx.fillText('preuve', X(xmax) - 50, Y(e.exposantLimite) - 6);
      ctx.fillStyle = c.ambre; ctx.fillText('grille d\'Erdős', X(4), Y(1.6));
      ctx.fillStyle = c.discret; ctx.fillText('chiffres de n →', L - m - 90, H - 8);
    }
    Guide.curseur(barre, { nom: 'Gain net des clés (γ)', min: 0.1, max: 2, pas: 0.05, valeur: p.gamma, format: function (v) { return Guide.nombre(v, 2); }, change: function (v) { p.gamma = v; dessiner(); } });
    Guide.curseur(barre, { nom: 'Coût de la fenêtre (B)', min: 2, max: 20, pas: 0.5, valeur: p.B, format: function (v) { return Guide.nombre(v, 1); }, change: function (v) { p.B = v; dessiner(); } });
    Guide.curseur(barre, { nom: 'Nombre d\'écrans (f)', min: 1, max: 300, valeur: p.f, change: function (v) { p.f = v; dessiner(); } });
    Guide.bouton(barre, 'Grille d\'Erdős', function (actif) { p.grille = actif; dessiner(); }, { bascule: true, actif: false });
    toile.quandRedimensionne(dessiner);
    courbe.quandRedimensionne(dessiner);
    dessiner();
    return { parametres: p };
  }

  function monterCourse(zone) {
    var l = 1000, c0 = Bilan.C_ILLUSTRATIF;
    var toile = Guide.toile(zone, { rapport: 0.7, alt: 'Deux courbes en fonction de ℓ : les clés (environ ℓ²) finissent par dépasser les tiroirs (environ ℓ log ℓ).' });
    var barre = Guide.barre(zone);
    var compteurs = Guide.compteurs(zone);
    function dessiner() {
      var c = Guide.couleurs(), ctx = toile.ctx, L = toile.largeur, H = toile.hauteur, m = 30, lmax = 5000;
      var ymax = Math.log10(Bilan.course(lmax, c0).cles);
      function X(v) { return m + (v / lmax) * (L - 2 * m); }
      function Y(v) { return H - m - (Math.log10(Math.max(v, 1)) / ymax) * (H - 2 * m); }
      ctx.clearRect(0, 0, L, H);
      ctx.strokeStyle = c.trait; ctx.beginPath(); ctx.moveTo(m, H - m); ctx.lineTo(L - m, H - m); ctx.moveTo(m, m / 2); ctx.lineTo(m, H - m); ctx.stroke();
      [['cles', c.vert, 'clés', -8], ['tiroirs', c.rouge, 'tiroirs', 18]].forEach(function (s) {
        ctx.strokeStyle = s[1]; ctx.lineWidth = 3; ctx.beginPath();
        for (var v = 10; v <= lmax; v += 20) { var y = Y(Bilan.course(v, c0)[s[0]]); if (v === 10) ctx.moveTo(X(v), y); else ctx.lineTo(X(v), y); }
        ctx.stroke();
        ctx.fillStyle = s[1]; ctx.font = '12px system-ui, sans-serif'; ctx.fillText(s[2], L - m - 50, Y(Bilan.course(lmax, c0)[s[0]]) + s[3]);
      });
      ctx.setLineDash([4, 4]); ctx.strokeStyle = c.discret; ctx.beginPath(); ctx.moveTo(X(l), m / 2); ctx.lineTo(X(l), H - m); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = c.discret; ctx.font = '12px system-ui, sans-serif';
      var note = 'c = ' + c0 + ' : valeur d\'illustration';
      ctx.fillText(note, L - m - ctx.measureText(note).width, H - m - 8);
      var r = Bilan.course(l, c0);
      compteurs.fixer('t', 'Clés (t)', Guide.nombre(r.t));
      compteurs.fixer('cles', 'Gain des clés (t × log 2)', Guide.nombre(r.cles, 0));
      compteurs.fixer('tiroirs', 'Perte des tiroirs (c × ℓ × log ℓ)', Guide.nombre(r.tiroirs, 0));
      compteurs.fixer('verdict', 'Verdict', r.gamma > 0 ? 'les clés gagnent : γ > 0' : 'les tiroirs gagnent encore');
    }
    Guide.curseur(barre, { nom: 'ℓ (corps cubiques collés)', min: 10, max: 5000, pas: 10, valeur: l, change: function (v) { l = v; dessiner(); } });
    toile.quandRedimensionne(dessiner);
    dessiner();
    return {};
  }
});
