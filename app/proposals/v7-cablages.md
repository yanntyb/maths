# Proposition V7 — Contrat de cablage explicite

> Ce document diagnostique la structure répétée dans `cablages/*/` et propose une classe abstraite `CablageContract` qui orchestre l'assemblage des trois composants : axiomes, classifier, rendu.

## Diagnostic de V6

### Le problème en une phrase

Chaque cablage (euclid, measure, hilbert, parseval, algebre, algebre-inversion) répète la même structure :

```
cablages/*/
  ├── axiomes.js       (exporte : axioms, formula, proof, format)
  ├── rendu.js         (exporte : draw)
  └── index.js         (réunit les trois + métadonnées)
```

Cette structure est **implicite** : il faut lire 6 dossiers pour voir qu'ils font tous la même chose.

### Anatomie du motif structurel

```
cablages/euclid/
  axiomes.js
    ├─ axioms : Array<{code, label, formal, weight, role}>
    ├─ formula : string
    ├─ proof : string
    └─ format(tri) : string

  rendu.js
    └─ draw(ctx, rect, tri, color) : void

  index.js
    └─ {id, title, color, axioms, formula, proof, format, draw}
```

Chaque cablage recrée cette structure identique.

| Cablage | Taille axiomes.js | Taille rendu.js | Structure index.js |
|---------|---|---|---|
| euclid | ~67 lignes | ~95 lignes | identique |
| measure | ~52 lignes | ~52 lignes | identique |
| hilbert | ~48 lignes | ~48 lignes | identique |
| parseval | ~66 lignes | ~164 lignes | identique |
| algebre | ~79 lignes | ~164 lignes | identique |
| algebre-inversion | ~71 lignes | ~240 lignes | identique |

**Coût de la structure répétée** :
- 6 fichiers `index.js` qui font la même chose
- 6 fichiers `axiomes.js` qui suivent la même convention sans la formaliser
- Ajouter un cablage = créer 3 fichiers + comprendre la convention implicite

### Ce que le code dit en triple distinction

| Dimension | V6 |
|-----------|-----|
| **Sens** | axiomes + rendu = cablage |
| **Contrat** | Chaque cablage exporte {id, title, color, axioms, formula, proof, format, draw} |
| **Cablage** | Convention : axiomes.js → rendu.js → index.js fusion |

**Le problème** : Le contrat est caché dans la convention. Le cablage est répété x6.

---

## Vision pour V7

### Le mouvement

Extraire la structure répétée en **classe abstraite `CablageContract`** qui orchestre l'assemblage des trois composants.

### Structure proposée

```
cablages/*/
  ├── axiomes.js                 (inchangé)
  ├── rendu.js                   (rendu devient classe héritant CablageContract)
  └── index.js                   (SUPPRIMÉ — remplacé par export de la classe)
```

Chaque rendu devient :

```javascript
// cablages/euclid/rendu.js
class EuclidCablage extends CablageContract {
  constructor() {
    super({
      id: 'euclid',
      title: 'Preuve 1 — Géométrie euclidienne',
      color: '#3B82F6',
      axioms: axioms,
      formula: formula,
      proof: proof,
      format: format,
    });
  }

  drawGeometry(layout) {
    // geometrie euclidienne
  }
}

export default new EuclidCablage();
```

### Classe abstraite CablageContract

```typescript
abstract class CablageContract {
  id: string;
  title: string;
  color: string;
  axioms: Axiom[];
  formula: string;
  proof: string;
  format: (tri) => string;

  constructor(config) {
    this.id = config.id;
    this.title = config.title;
    this.color = config.color;
    this.axioms = config.axioms;
    this.formula = config.formula;
    this.proof = config.proof;
    this.format = config.format;
  }

  // Hérité de RenderContract
  draw(ctx, rect, tri, color) {
    const layout = this.calculateLayout(rect);
    this.drawGeometry(layout);
    this.drawAnnotation(this.formula, layout);
  }

  // À surcharger
  abstract drawGeometry(layout);
}
```

### Import dans scene.js

```javascript
// Avant (V6)
import euclid from './cablages/euclid/index.js';
import measure from './cablages/measure/index.js';
// ...

// Après (V7)
import euclid from './cablages/euclid/rendu.js';
import measure from './cablages/measure/rendu.js';
// ...
```

---

## Architecture cible

```
app/7_cablages/
  pythagore.html
  js/
    render-contract.js       (base pour rendus)
    cablage-contract.js      ← NOUVEAU (base pour cablages)
    primitives.js
    classifier.js
    structure.js
    scene.js
    main.js
    cablages/
      algebre/
        axiomes.js
        rendu.js             ← hérite CablageContract
      algebre-inversion/
        axiomes.js
        rendu.js             ← hérite CablageContract
      euclid/
        axiomes.js
        rendu.js             ← hérite CablageContract
      measure/
        axiomes.js
        rendu.js             ← hérite CablageContract
      hilbert/
        axiomes.js
        rendu.js             ← hérite CablageContract
      parseval/
        axiomes.js
        rendu.js             ← hérite CablageContract
```

**Fichiers critiques à lire/modifier** :

| Fichier | Action | Raison |
|---------|--------|--------|
| cablage-contract.js | NOUVEAU | Classe abstraite pour tous les cablages |
| cablages/*/rendu.js | MODIFIER | Hériter CablageContract au lieu de RenderContract |
| cablages/*/index.js | SUPPRIMER | Logique repliée dans CablageContract |
| scene.js | MODIFIER | Import de rendu.js au lieu d'index.js |

---

## Bénéfices

| Bénéfice | V6 | V7 |
|----------|-----|-----|
| **Ajouter un cablage** | Créer 3 fichiers + apprendre la convention | Créer 1 classe + hériter |
| **Structure explicite** | Convention implicite (index.js assemble) | Classe CablageContract |
| **Duplication** | 6 × index.js identiques | 0 duplication |
| **Polymorphisme** | Par classe RenderContract (rendu) | Par classe CablageContract (cablage) |
| **Réutilisabilité** | Chaque cablage isolé | Tous les cablages partagent la même orchestration |

### Coût de modification

- cablage-contract.js : ~50 lignes (NOUVEAU)
- Chaque rendu.js : +5 lignes (ajouter extends CablageContract + constructor)
- Supprimer 6 × index.js : -350 lignes

**Bilan** : +55 lignes, -350 lignes = -295 lignes totales.

---

## Vérification

### Vérification structurelle

1. ✓ CablageContract hérite de RenderContract (donc hérite du pipeline 4-phases)
2. ✓ Chaque cablage hérite CablageContract
3. ✓ Chaque rendu ne surcharge que drawGeometry()
4. ✓ scene.js importe `cablages/*/rendu.js` (pas index.js)
5. ✓ Aucun index.js ne reste dans cablages/

### Vérification fonctionnelle

1. Tous les onglets de cablages s'affichent (euclid, measure, hilbert, parseval, algebre, algebre-inversion)
2. Les axiomes s'affichent correctement (cercle, arbre)
3. Le redimensionnement fonctionne
4. Les sliders a, b mettent à jour les animations
5. Les 3 vues (animation, arbre, cercle) fonctionnent

### Vérification comparative

| Aspect | V6 | V7 |
|--------|-----|-----|
| Import scene.js | `import euclid from './cablages/euclid/index.js'` | `import euclid from './cablages/euclid/rendu.js'` |
| Classe base rendu | RenderContract | CablageContract (hérite RenderContract) |
| Fichiers cablage | axiomes.js + rendu.js + index.js | axiomes.js + rendu.js |
| Responsabilité rendu.js | draw + drawGeometry | constructor + drawGeometry |

---

## Triple distinction de V7

| Dimension | Contenu |
|-----------|---------|
| **Sens** | Axiomes assemblés avec leur rendu forment un cablage complet |
| **Contrat** | CablageContract orchestre axiomes + metadata + rendu via une interface uniforme |
| **Cablage** | CablageContract hérite RenderContract (pipeline 4-phases) et centralise l'assemblage (constructor) |

---

## Après V7 ?

### V8 — Contrat de circuit (optionnel)

Si le mouvement continue, V8 pourrait formaliser les circuits d'axiomes (arbre, cercle).

**Problème** : drawAxiomTree et drawAxiomSphere répètent un motif : prendre les axiomes classifiés et les visualiser.

**Vision** : Créer AxiomVisualizationContract pour axiom-tree et axiom-sphere.

### La limite de la formalisation

```
Code parfait = Chaque motif est une classe
              = Chaque classe hérite d'une base
              = Zéro duplication
              = Zéro convention implicite
```

Mais Gödel garantit qu'il existera toujours une structure implicite au niveau suivant.

---

## Résumé

**V7 continue le mouvement V6** : rendre explicite ce qui est implicite.

- V6 : pipeline 4-phases → classe RenderContract
- V7 : structure cablage (axiomes + rendu) → classe CablageContract

**Mouvement unifié** :

```
Implicite (convention)
       ↓
Formalisé (classe abstraite)
       ↓
Réutilisable sans répétition
       ↓
Prêt pour V8
```

---

[← Index des propositions](README.md)
