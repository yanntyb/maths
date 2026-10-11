'use strict';

import { CablageContract } from '../../cablage-contract.js';

/**
 * groupes — couleur, formule et application numérique. Le titre, les axiomes et les
 * statuts viennent de data/statuts.json (fusion dans cablage-registry.js).
 */
class GroupesCablage extends CablageContract {
  constructor() {
    super({
      id: 'groupes',
      color: '#F59E0B',
      formula: 'Q(a,b) = a² + b² (invariant SO(2))',
      format: ({ a, b, c }) => 'Q(' + a.toFixed(1) + ',' + b.toFixed(1) + ') = ' + (a * a).toFixed(2) + ' + ' + (b * b).toFixed(2) + ' = ' + (c * c).toFixed(2),
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
    // no-op — pas de rendu géométrique pour groupes
  }
}

export default new GroupesCablage();
