'use strict';

import { CablageContract } from '../../cablage-contract.js';

/**
 * trigonometrique — couleur, formule et application numérique. Le titre, les axiomes et les
 * statuts viennent de data/statuts.json (fusion dans cablage-registry.js).
 */
class TrigonometriqueCablage extends CablageContract {
  constructor() {
    super({
      id: 'trigonometrique',
      color: '#06B6D4',
      formula: 'cos²θ + sin²θ = 1',
      format: ({ a, b, c }) => (c === 0 ? 'triangle dégénéré (c = 0)'
        : '(' + (a / c).toFixed(2) + ')² + (' + (b / c).toFixed(2) + ')² = 1'),
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
    // no-op — pas de rendu géométrique pour trigonometrique
  }
}

export default new TrigonometriqueCablage();
