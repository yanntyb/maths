'use strict';

import { CablageContract } from '../../cablage-contract.js';

/**
 * cosinus — couleur, formule et application numérique. Le titre, les axiomes et les
 * statuts viennent de data/statuts.json (fusion dans cablage-registry.js).
 */
class CosinusCablage extends CablageContract {
  constructor() {
    super({
      id: 'cosinus',
      color: '#10B981',
      formula: '‖u-v‖² = ‖u‖² + ‖v‖² - 2‖u‖‖v‖cos(θ)',
      format: ({ a, b, c }) => '‖u-v‖² = ' + (a * a).toFixed(2) + ' + ' + (b * b).toFixed(2) + ' - 0 = ' + (c * c).toFixed(2),
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
    // no-op — pas de rendu géométrique pour cosinus
  }
}

export default new CosinusCablage();
