'use strict';

import { CablageContract } from '../../cablage-contract.js';

/**
 * complexe — couleur, formule et application numérique. Le titre, les axiomes et les
 * statuts viennent de data/statuts.json (fusion dans cablage-registry.js).
 */
class ComplexeCablage extends CablageContract {
  constructor() {
    super({
      id: 'complexe',
      color: '#8B5CF6',
      formula: '|z|² = z·z̄ = a² + b²',
      format: ({ a, b, c }) => '|' + a.toFixed(1) + '+' + b.toFixed(1) + 'i|² = ' + (a * a).toFixed(2) + ' + ' + (b * b).toFixed(2) + ' = ' + (c * c).toFixed(2),
    });
  }

  calculateScale() {
    return 1;
  }

  calculateCenterX() {
    return 0;
  }

  calculateCenterY() {
    return 0;
  }

  drawGeometry(layout) {
    // no-op — pas de rendu géométrique pour complexe
  }
}

export default new ComplexeCablage();
