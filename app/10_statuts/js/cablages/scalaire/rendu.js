'use strict';

import { CablageContract } from '../../cablage-contract.js';

/**
 * scalaire — couleur, formule et application numérique. Le titre, les axiomes et les
 * statuts viennent de data/statuts.json (fusion dans cablage-registry.js).
 */
class ScalaireCablage extends CablageContract {
  constructor() {
    super({
      id: 'scalaire',
      color: '#EF4444',
      formula: '‖u+v‖² = ‖u‖² + 2(u,v) + ‖v‖²',
      format: ({ a, b, c }) => '‖u+v‖² = ' + (a * a).toFixed(2) + ' + ' + (b * b).toFixed(2) + ' = ' + (c * c).toFixed(2),
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
    // no-op — pas de rendu géométrique pour scalaire
  }
}

export default new ScalaireCablage();
