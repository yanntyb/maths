/* Widget « pas magiques » : un nombre divisé par son reflet a une longueur 1, sur chaque écran. */
Guide.enregistrerControle('pas-magiques', function () {
  var z = { re: 1.3, im: -0.7 }, u = Cyclo.div(z, Cyclo.conj(z));
  if (Math.abs(Cyclo.abs(u) - 1) > 1e-12) return { ok: false, message: '|z / reflet| = ' + Cyclo.abs(u) };
  var pas = Cyclo.corps(7).pasMagique([1, 2, 0, -1, 0, 1]);
  for (var i = 0; i < pas.length; i++) {
    if (Math.abs(Cyclo.abs(pas[i]) - 1) > 1e-9) return { ok: false, message: 'écran ' + (i + 1) + ' : longueur ' + Cyclo.abs(pas[i]) };
  }
  var zone = document.querySelector('[data-widget="pas-magiques"][data-partie="trois"]');
  if (zone) {
    var bouton = Array.prototype.filter.call(zone.querySelectorAll('button'), function (b) { return b.textContent === 'α au hasard'; })[0];
    bouton.click();
    var faux = Array.prototype.filter.call(zone.querySelectorAll('label.curseur'), function (l) {
      return l.querySelector('output').textContent !== l.querySelector('input').value;
    });
    if (faux.length) return { ok: false, message: faux.length + ' curseur(s) affichent une valeur périmée après « α au hasard »' };
  }
  return { ok: true, message: '' };
});

Guide.enregistrerWidget('pas-magiques', function (zone, options) {
  return options.partie === 'trois' ? monterTrois(zone) : monterUn(zone);

  function fleche(ctx, x0, y0, x1, y1, couleur, epaisseur) {
    ctx.strokeStyle = couleur; ctx.fillStyle = couleur; ctx.lineWidth = epaisseur || 2;
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
    var a = Math.atan2(y1 - y0, x1 - x0);
    ctx.beginPath(); ctx.moveTo(x1, y1);
    ctx.lineTo(x1 - 9 * Math.cos(a - 0.4), y1 - 9 * Math.sin(a - 0.4));
    ctx.lineTo(x1 - 9 * Math.cos(a + 0.4), y1 - 9 * Math.sin(a + 0.4));
    ctx.closePath(); ctx.fill();
  }

  function monterUn(zone) {
    var z = { re: 1.6, im: 0.9 };
    var toile = Guide.toile(zone, { rapport: 1, alt: 'Plan complexe : z, son reflet, z fois son reflet sur l\'axe, et z divisé par son reflet sur le cercle unité.' });
    var compteurs = Guide.compteurs(zone);
    function unite() { return toile.largeur / 8; }
    function versEcran(w) { return { x: toile.largeur / 2 + w.re * unite(), y: toile.hauteur / 2 - w.im * unite() }; }
    function dessiner() {
      var c = Guide.couleurs(), ctx = toile.ctx, L = toile.largeur, H = toile.hauteur, o = versEcran({ re: 0, im: 0 });
      ctx.clearRect(0, 0, L, H);
      ctx.strokeStyle = c.trait; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, o.y); ctx.lineTo(L, o.y); ctx.moveTo(o.x, 0); ctx.lineTo(o.x, H); ctx.stroke();
      ctx.setLineDash([5, 5]); ctx.strokeStyle = c.sarcelle; ctx.beginPath(); ctx.arc(o.x, o.y, unite(), 0, 2 * Math.PI); ctx.stroke(); ctx.setLineDash([]);
      var reflet = Cyclo.conj(z), produit = Cyclo.mul(z, reflet), pas = Cyclo.div(z, reflet);
      var pz = versEcran(z), pr = versEcran(reflet), pp = versEcran(produit), pu = versEcran(pas);
      fleche(ctx, o.x, o.y, pz.x, pz.y, c.bleu, 3);
      ctx.setLineDash([4, 4]); fleche(ctx, o.x, o.y, pr.x, pr.y, c.indigo, 2); ctx.setLineDash([]);
      fleche(ctx, o.x, o.y, pp.x, pp.y, c.vert, 3);
      fleche(ctx, o.x, o.y, pu.x, pu.y, c.rouge, 3);
      ctx.font = '13px system-ui, sans-serif';
      function etiquette(texte, p, couleur, decalage) {
        var dx = p.x - o.x, dy = p.y - o.y, n = Math.hypot(dx, dy) || 1, w = ctx.measureText(texte).width;
        var x = p.x + (dx / n) * 12 - w / 2, y = p.y + (dy / n) * 12 + 4 + (decalage || 0);
        ctx.fillStyle = couleur;
        ctx.fillText(texte, Math.max(2, Math.min(L - w - 2, x)), Math.max(14, Math.min(H - 4, y)));
      }
      etiquette('z', pz, c.bleu);
      etiquette('reflet', pr, c.indigo);
      etiquette('z × reflet', pp, c.vert, -14);
      etiquette('z ÷ reflet', pu, c.rouge, Math.abs(pu.y - pz.y) < 24 ? -16 : 0);
      var deg = 180 / Math.PI;
      compteurs.fixer('lz', 'Longueur de z', Guide.nombre(Cyclo.abs(z), 3));
      compteurs.fixer('lp', 'Longueur de z × reflet', Guide.nombre(Cyclo.abs(produit), 3) + ' (= longueur² de z)');
      compteurs.fixer('lu', 'Longueur de z ÷ reflet', Guide.nombre(Cyclo.abs(pas), 4));
      compteurs.fixer('az', 'Angle de z', Guide.nombre(Math.atan2(z.im, z.re) * deg, 0) + '°');
      compteurs.fixer('au', 'Angle de z ÷ reflet', Guide.nombre(Math.atan2(pas.im, pas.re) * deg, 0) + '°');
    }
    function placer(e) {
      var w = { re: (e.x - toile.largeur / 2) / unite(), im: (toile.hauteur / 2 - e.y) / unite() };
      var n = Cyclo.abs(w);
      if (n < 0.2) return;
      if (n > 1.9) w = { re: w.re * 1.9 / n, im: w.im * 1.9 / n };
      z = w; dessiner();
    }
    var tenu = false;
    Guide.pointeur(toile.canvas, {
      appui: function (e) { tenu = true; placer(e); },
      deplacement: function (e) { if (tenu) placer(e); },
      relache: function () { tenu = false; }
    });
    toile.quandRedimensionne(dessiner);
    dessiner();
    return {};
  }

  function monterTrois(zone) {
    var corps = Cyclo.corps(7), coeffs = [1, 2, 0, -1, 0, 1], graine = 1;
    var toile = Guide.toile(zone, { rapport: 0.42, alt: 'Trois écrans : sur chacun, α et le pas magique α ÷ reflet, toujours sur le cercle de rayon 1.' });
    var barre = Guide.barre(zone);
    var compteurs = Guide.compteurs(zone);
    var reglages = document.createElement('details');
    var resume = document.createElement('summary');
    resume.textContent = 'Régler α à la main';
    reglages.appendChild(resume);
    zone.appendChild(reglages);
    var curseurs = coeffs.map(function (v, j) {
      return Guide.curseur(reglages, { nom: 'coefficient de ζ^' + j, min: -3, max: 3, valeur: v, change: function (x) { coeffs[j] = x; dessiner(); } });
    });
    function dessiner() {
      var c = Guide.couleurs(), ctx = toile.ctx, L = toile.largeur, H = toile.hauteur;
      ctx.clearRect(0, 0, L, H);
      var images = corps.plonger(coeffs), pas = corps.pasMagique(coeffs);
      var cote = L / 3;
      images.forEach(function (a, k) {
        var cx = cote * k + cote / 2, cy = H / 2, rayon = Math.min(cote, H) / 2 - 10;
        var echelle = rayon / Math.max(Cyclo.abs(a), 1) / 1.05;
        ctx.strokeStyle = c.trait; ctx.lineWidth = 1; ctx.strokeRect(cote * k + 2, 2, cote - 4, H - 4);
        ctx.setLineDash([4, 4]); ctx.strokeStyle = c.sarcelle; ctx.beginPath(); ctx.arc(cx, cy, echelle, 0, 2 * Math.PI); ctx.stroke(); ctx.setLineDash([]);
        if (pas) {
          fleche(ctx, cx, cy, cx + a.re * echelle, cy - a.im * echelle, c.bleu, 2);
          fleche(ctx, cx, cy, cx + pas[k].re * echelle, cy - pas[k].im * echelle, c.rouge, 3);
        }
        ctx.fillStyle = c.discret; ctx.font = '12px system-ui, sans-serif'; ctx.fillText('écran ' + (k + 1), cote * k + 8, 16);
        compteurs.fixer('e' + k, 'Écran ' + (k + 1) + ' : longueur de α / du pas', pas ? Guide.nombre(Cyclo.abs(a), 2) + ' / ' + Guide.nombre(Cyclo.abs(pas[k]), 3) : 'α = 0');
      });
    }
    Guide.bouton(barre, 'α au hasard', function () {
      var r = Guide.hasard(++graine);
      do { coeffs = coeffs.map(function () { return Math.floor(r() * 7) - 3; }); } while (coeffs.every(function (a) { return a === 0; }));
      curseurs.forEach(function (cur, j) { cur.montrer(coeffs[j]); });
      dessiner();
    });
    toile.quandRedimensionne(dessiner);
    dessiner();
    return {};
  }
});
