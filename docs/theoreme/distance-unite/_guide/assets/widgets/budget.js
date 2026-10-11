/* Widget « budget » : pièces libres, règles, et le plafond de Golod–Shafarevich. */
Guide.enregistrerControle('budget', function () {
  var a = Budget.etat(100, Budget.tAuto(100));
  if (a.d !== 99 || a.total !== 101 + 3 * 98 || Math.abs(a.plafond - 2450.25) > 1e-9 || !a.infini) return { ok: false, message: 'ℓ = 100 : état incorrect ' + JSON.stringify(a) };
  var b = Budget.etat(20, 50);
  if (b.infini) return { ok: false, message: 'ℓ = 20, t = 50 devrait dépasser le plafond' };
  for (var l = 5; l <= 200; l++) {
    var e = Budget.etat(l, Budget.tAuto(l));
    if (e.infini !== (e.total <= e.plafond)) return { ok: false, message: 'verdict incohérent à ℓ = ' + l };
  }
  return { ok: true, message: '' };
});

var Budget = (function () {
  'use strict';
  /** d = ℓ − 1 libertés (borne basse, prise comme valeur d'illustration) ; règles d + 2 + 3t ; plafond d²/4. */
  function etat(l, t) {
    var d = l - 1, depart = d + 2, cles = 3 * t, total = depart + cles, plafond = d * d / 4;
    return { d: d, depart: depart, cles: cles, total: total, plafond: plafond, infini: total <= plafond };
  }
  function tAuto(l) { return Math.floor((l - 1) * (l - 1) / 100); }
  return { etat: etat, tAuto: tAuto };
})();

Guide.enregistrerWidget('budget', function (zone) {
  var p = { l: 60, t: Budget.tAuto(60), auto: true };
  var toile = Guide.toile(zone, { rapport: 0.5, alt: 'Jauge des règles : règles de départ, règles ajoutées pour les clés, et le plafond.' });
  var barre = Guide.barre(zone);
  var compteurs = Guide.compteurs(zone);
  var curseurT, boutonAuto;
  function dessiner() {
    if (p.auto) {
      p.t = Budget.tAuto(p.l);
      if (curseurT) curseurT.montrer(p.t);
    }
    var c = Guide.couleurs(), ctx = toile.ctx, L = toile.largeur, H = toile.hauteur, e = Budget.etat(p.l, p.t);
    var echelle = (L - 24) / Math.max(e.total, e.plafond) / 1.05, y = H * 0.35, h = H * 0.3;
    ctx.clearRect(0, 0, L, H);
    ctx.fillStyle = c.discret; ctx.fillRect(12, y, e.depart * echelle, h);
    ctx.fillStyle = e.infini ? c.ambre : c.rouge; ctx.fillRect(12 + e.depart * echelle, y, e.cles * echelle, h);
    var xp = 12 + e.plafond * echelle;
    ctx.strokeStyle = c.vert; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(xp, y - 14); ctx.lineTo(xp, y + h + 14); ctx.stroke();
    ctx.fillStyle = c.vert; ctx.font = '12px system-ui, sans-serif'; ctx.fillText('plafond d²/4', Math.max(4, Math.min(xp - 40, L - 90)), y - 18);
    ctx.fillStyle = c.texte; ctx.fillText('règles', 12, y + h + 18);
    compteurs.fixer('d', 'Libertés (d = ℓ − 1, au moins)', Guide.nombre(e.d));
    compteurs.fixer('depart', 'Règles de départ (d + 2)', Guide.nombre(e.depart));
    compteurs.fixer('cles', 'Règles pour les clés (3t)', Guide.nombre(e.cles));
    compteurs.fixer('plafond', 'Plafond (d²/4)', Guide.nombre(e.plafond, 2));
    compteurs.fixer('verdict', 'Verdict', e.infini ? 'tour infinie garantie' : 'on ne sait pas : trop de règles');
  }
  Guide.curseur(barre, { nom: 'ℓ (corps cubiques collés)', min: 5, max: 200, valeur: p.l, change: function (v) { p.l = v; dessiner(); } });
  curseurT = Guide.curseur(barre, { nom: 'Clés imposées (t)', min: 0, max: 2000, valeur: p.t, change: function (v) { p.auto = false; boutonAuto.setAttribute('aria-pressed', 'false'); p.t = v; dessiner(); } });
  boutonAuto = Guide.bouton(barre, 't automatique', function (actif) { p.auto = actif; dessiner(); }, { bascule: true, actif: true });
  toile.quandRedimensionne(dessiner);
  dessiner();
  return { parametres: p };
});
