/* Calcul dans le corps cyclotomique Q(ζ_m) : un plongement complexe par paire conjuguée. */
Guide.enregistrerControle('cyclo', function () {
  var k8 = Cyclo.corps(8), k7 = Cyclo.corps(7);
  if (k8.f !== 2 || k8.degre !== 4) return { ok: false, message: 'Q(ζ_8) : f = ' + k8.f + ', degré ' + k8.degre };
  if (k7.f !== 3 || k7.degre !== 6) return { ok: false, message: 'Q(ζ_7) : f = ' + k7.f + ', degré ' + k7.degre };
  var z = k8.plonger([0, 1, 0, 0]);
  if (Math.abs(z[0].re - Math.SQRT1_2) > 1e-12 || Math.abs(z[1].re + Math.SQRT1_2) > 1e-12) return { ok: false, message: 'plongements de ζ_8 faux' };
  if (k7.pasMagique([0, 0, 0, 0, 0, 0]) !== null) return { ok: false, message: 'α = 0 devrait donner null' };
  return { ok: true, message: '' };
});

var Cyclo = (function () {
  'use strict';
  function add(a, b) { return { re: a.re + b.re, im: a.im + b.im }; }
  function mul(a, b) { return { re: a.re * b.re - a.im * b.im, im: a.re * b.im + a.im * b.re }; }
  function conj(a) { return { re: a.re, im: -a.im }; }
  function div(a, b) { var d = b.re * b.re + b.im * b.im; return { re: (a.re * b.re + a.im * b.im) / d, im: (a.im * b.re - a.re * b.im) / d }; }
  function abs(a) { return Math.hypot(a.re, a.im); }
  function pgcd(a, b) { while (b) { var r = a % b; a = b; b = r; } return a; }

  /** Q(ζ_m) : plongements σ_k(ζ) = e^{2iπk/m}, un exposant k par paire conjuguée (k premier à m, k < m/2). */
  function corps(m) {
    var exposants = [], degre = 0;
    for (var k = 1; k < m; k++) {
      if (pgcd(k, m) !== 1) continue;
      degre++;
      if (2 * k < m) exposants.push(k);
    }
    function plonger(coeffs) {
      return exposants.map(function (k) {
        var s = { re: 0, im: 0 };
        coeffs.forEach(function (a, j) { var t = 2 * Math.PI * j * k / m; s.re += a * Math.cos(t); s.im += a * Math.sin(t); });
        return s;
      });
    }
    /** u = α / c(α) : sur chaque écran σ(α) / conj(σ(α)), car c agit comme la conjugaison complexe. */
    function pasMagique(coeffs) {
      if (coeffs.every(function (a) { return a === 0; })) return null;
      return plonger(coeffs).map(function (z) { return div(z, conj(z)); });
    }
    return { m: m, f: exposants.length, degre: degre, exposants: exposants, plonger: plonger, pasMagique: pasMagique };
  }
  return { corps: corps, add: add, mul: mul, conj: conj, div: div, abs: abs };
})();
