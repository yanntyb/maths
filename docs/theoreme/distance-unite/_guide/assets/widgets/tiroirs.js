/* Widget « tiroirs » : 2^m tickets dans h tiroirs ; un tiroir en a toujours au moins 2^m / h. */
Guide.enregistrerControle('tiroirs', function () {
  var r = Guide.hasard(11);
  for (var essai = 0; essai < 500; essai++) {
    var m = 1 + Math.floor(r() * 10), h = 1 + Math.floor(r() * 12);
    [false, true].forEach(function (equitable) {
      var tas = Tiroirs.ranger(m, h, essai + 1, equitable);
      var somme = tas.reduce(function (a, b) { return a + b; }, 0), max = Math.max.apply(null, tas);
      if (somme !== Math.pow(2, m)) throw new Error('tickets perdus : ' + somme + ' au lieu de ' + Math.pow(2, m));
      if (max < Tiroirs.garanti(m, h)) throw new Error('tiroir le plus plein ' + max + ' < garanti ' + Tiroirs.garanti(m, h));
      if (equitable && max !== Tiroirs.garanti(m, h)) throw new Error('rangement équitable : ' + max + ' au lieu de ' + Tiroirs.garanti(m, h));
    });
  }
  return { ok: true, message: '' };
});

var Tiroirs = (function () {
  'use strict';
  /** Range 2^m tickets dans h tiroirs : au hasard, ou de la façon la plus équitable possible. */
  function ranger(m, h, graine, equitable) {
    var total = Math.pow(2, m), tas = [];
    for (var i = 0; i < h; i++) tas.push(0);
    var r = Guide.hasard(graine);
    for (i = 0; i < total; i++) tas[equitable ? i % h : Math.floor(r() * h)]++;
    return tas;
  }
  function garanti(m, h) { return Math.ceil(Math.pow(2, m) / h); }
  return { ranger: ranger, garanti: garanti };
})();

Guide.enregistrerWidget('tiroirs', function (zone) {
  var etat = { m: 6, h: 5, graine: 1, equitable: false, tas: null, affiche: null, debut: 0 };
  var toile = Guide.toile(zone, { rapport: 0.65, alt: 'Des colonnes, une par tiroir, remplies de tickets ; une ligne pointillée marque la moyenne.' });
  var barre = Guide.barre(zone);
  var compteurs = Guide.compteurs(zone);

  function ranger() {
    etat.tas = Tiroirs.ranger(etat.m, etat.h, etat.graine, etat.equitable);
    etat.affiche = etat.tas.map(function () { return 0; });
    etat.debut = performance.now();
    dessiner();
    requestAnimationFrame(animer);
  }
  function animer(t) {
    var p = Math.min(1, Math.max(0, (t - etat.debut) / 600));
    etat.affiche = etat.tas.map(function (v) { return Math.round(v * p); });
    dessiner();
    if (p < 1) requestAnimationFrame(animer); else etat.affiche = null;
  }
  function dessiner() {
    var c = Guide.couleurs(), ctx = toile.ctx, L = toile.largeur, H = toile.hauteur, m = 28;
    var tas = etat.affiche || etat.tas, total = Math.pow(2, etat.m), moyenne = total / etat.h;
    var max = Math.max.apply(null, etat.tas), haut = Math.max(max, Tiroirs.garanti(etat.m, etat.h)) * 1.15;
    var largeurCol = (L - 2 * m) / etat.h;
    ctx.clearRect(0, 0, L, H);
    tas.forEach(function (v, i) {
      var hpx = (v / haut) * (H - 2 * m);
      ctx.fillStyle = etat.tas[i] === max ? c.vert : c.bleu;
      ctx.fillRect(m + i * largeurCol + 3, H - m - hpx, largeurCol - 6, hpx);
      ctx.fillStyle = c.discret; ctx.font = '11px system-ui, sans-serif';
      ctx.fillText(String(v), m + i * largeurCol + 4, H - m - hpx - 4);
    });
    var ym = H - m - (moyenne / haut) * (H - 2 * m);
    ctx.setLineDash([5, 4]); ctx.strokeStyle = c.rouge; ctx.beginPath(); ctx.moveTo(m, ym); ctx.lineTo(L - m, ym); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = c.rouge; ctx.fillText('moyenne', L - m - 56, ym - 4);
    compteurs.fixer('tickets', 'Tickets (2^m)', Guide.nombre(total));
    compteurs.fixer('tiroirs', 'Tiroirs (h)', String(etat.h));
    compteurs.fixer('moyenne', 'Moyenne par tiroir', Guide.nombre(moyenne, 1));
    compteurs.fixer('garanti', 'Garanti dans le plus plein', Guide.nombre(Tiroirs.garanti(etat.m, etat.h)));
    compteurs.fixer('max', 'Tiroir le plus plein ici', Guide.nombre(max));
  }

  Guide.curseur(barre, { nom: 'Interrupteurs (m)', min: 1, max: 10, valeur: etat.m, change: function (v) { etat.m = v; ranger(); } });
  Guide.curseur(barre, { nom: 'Tiroirs (h)', min: 1, max: 12, valeur: etat.h, change: function (v) { etat.h = v; ranger(); } });
  Guide.bouton(barre, 'Ranger au hasard', function () { etat.equitable = false; etat.graine++; ranger(); });
  Guide.bouton(barre, 'Ranger le plus équitablement', function () { etat.equitable = true; ranger(); });
  toile.quandRedimensionne(dessiner);
  etat.tas = Tiroirs.ranger(etat.m, etat.h, etat.graine, false);
  dessiner();
  return { etat: etat };
});
