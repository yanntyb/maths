'use strict';

export function axiomWeights(vizType, a, b, c) {
  const a2 = a*a, b2 = b*b, c2 = c*c;
  const total = a2 + b2;

  if (vizType === 'euclid') {
    const triangles = 4 * 0.5 * a * b;
    const central   = c2;
    const grand     = (a + b) * (a + b);
    return {
      'P1':  0.4,
      'P2':  0.4,
      'P3':  0.05,
      'P4':  triangles / grand,
      'P5':  central / grand,
      'CN1': 0.5,
      'CN2': 1.0,
      'CN4': triangles / grand,
      'CN5': 0.6,
    };
  }
  if (vizType === 'measure') {
    return {
      'M1': 1.0,
      'M2': Math.max(0.05, 1 - Math.min(a, b) / 6),
      'M3': Math.min(1, total / 30),
      'M4': 0.9,
      'M5': 0.3,
      'M6': 0.5,
    };
  }
  if (vizType === 'parseval') {
    return {
      'F1': 0.5,
      'F2': 0.6,
      'F3': 1.0,
      'F4': Math.sqrt(a*a + b*b) / 10,
      'F5': (a*a + b*b) / 50,
      'F6': c*c / 50,
      'F7': (a*a + b*b) / 50,
    };
  }
  if (vizType === 'frontiere') {
    return {
      'Z1': 0.5, 'Z2': 0.6, 'Z3': 0.6,
      'Z4': 1 / Math.max(0.01, Math.abs(a*a + b*b - c*c) + 1),
      'Z5': Math.min(1, (a*a + b*b) / 30),
      'Z6': 0.8, 'Z7': 1.0,
    };
  }
  if (vizType === 'hilbert') {
    const cross = 2 * a * b;
    return {
      'E1': 0.6,
      'E2': 0.7,
      'E3': cross / (cross + total),
      'E4': 0.5,
      'E5': total / (total + 10),
      'E6': 0.2,
      'D1': 1.0,
      'D2': cross / (cross + total),
    };
  }
  return {};
}

export function weightOfAxiom(proof, code, a, b, c) {
  const w = axiomWeights(proof.vizType, a, b, c);
  return w[code] ?? 0.5;
}

export function applyNumerically(vizType, a, b, c) {
  const a2 = (a*a).toFixed(2);
  const b2 = (b*b).toFixed(2);
  const c2 = (c*c).toFixed(2);
  if (vizType === 'euclid') {
    const ab2 = ((a+b)*(a+b)).toFixed(2);
    const tri = (4 * 0.5 * a * b).toFixed(2);
    return '(' + a.toFixed(1) + '+' + b.toFixed(1) + ')\u00b2 = 4\u00b7\u00bd\u00b7' + a.toFixed(1) + '\u00b7' + b.toFixed(1) + ' + c\u00b2  \u2192  ' + ab2 + ' = ' + tri + ' + ' + c2;
  }
  if (vizType === 'measure') {
    return '\u03bc(' + a2 + ') + \u03bc(' + b2 + ') = \u03bc(' + c2 + ')   \u2192   ' + a2 + ' + ' + b2 + ' = ' + c2;
  }
  if (vizType === 'hilbert') {
    return '||v||\u00b2=' + b2 + ',  ||w||\u00b2=' + a2 + '  \u2192  ||v+w||\u00b2 = ' + (parseFloat(a2)+parseFloat(b2)).toFixed(2) + ' = ' + c2;
  }
  if (vizType === 'parseval') {
    return '|\u27e8e\u2081|v\u27e9|\u00b2 + |\u27e8e\u2082|v\u27e9|\u00b2 = ' + a2 + ' + ' + b2 + ' = ' + (parseFloat(a2)+parseFloat(b2)).toFixed(2) + ' = ||v||\u00b2 = ' + c2;
  }
  if (vizType === 'frontiere') {
    const ratio = (a*a + b*b) / Math.max(c*c, 0.01);
    return '\u03c3_c = 1  \u00b7  Q(' + a.toFixed(1) + ',' + b.toFixed(1) + ') = ' + (a*a+b*b).toFixed(2) + ' = c\u00b2 = ' + c2 + '  (ratio=' + ratio.toFixed(3) + ')';
  }
  return '';
}
