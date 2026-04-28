# Proposition V8 — Contrat de visualisation axiomatique

> Ce document diagnostique la structure répétée dans `drawAxiomTree` et `drawAxiomSphere`, et propose une classe abstraite `VisualizationContract` qui orchestre l'affichage des axiomes classifiés.

## Diagnostic de V7

### Le problème en une phrase

Chaque visualisation d'axiomes (`drawAxiomTree`, `drawAxiomSphere`) répète le même motif :
1. Lire axiomes classifiés
2. Ajouter labels, contexte, titre
3. Renderer axiomes avec géométrie spécifique
4. Connecter entrées (a,b) → axiomes → sortie (c²)

Cette structure est **implicite** : il faut lire deux fonctions pour voir qu'elles font la même chose (mais avec rendus différents).

### Anatomie du motif structurel

```
structure.js (drawAxiomTree, drawAxiomSphere)
  ├─ Titre + labels
  ├─ Nœud input (a, b)
  ├─ Nœuds axiomes (classifiés)
     └─ Calcul de rayons (poids → taille cercles)
  ├─ Nœud output (c²)
  ├─ Connecteurs (entrées → axiomes → sortie)
     └─ Courbes, droites, ou autre géométrie
  └─ Annotations (poids, codes axiomes)
```

| Aspect | Tree | Sphere |
|--------|------|--------|
| Nœuds axiomes | Ligne horizontale au centre | Distribués en cercle |
| Connecteurs | Bézier courbes | (à explorer) |
| Radius axiome | ∝ poids | ∝ poids |
| Layout | Arbres → nœud central | Sphère/couronne |

**Coût de la structure répétée** :
- `drawAxiomTree` : ~110 lignes
- `drawAxiomSphere` : ~110 lignes
- Ajouter un 3e rendu = créer une 3e fonction sans interface claire
- Changer calcul de rayon = modifier 2 fonctions

### Ce que le code dit en triple distinction

| Dimension | V7 |
|-----------|-----|
| **Sens** | visualiser les axiomes classifiés (leur contribution) |
| **Contrat** | Chaque viz lit (ctx, rect, proof, classified, tri) ; écrit Canvas |
| **Cablage** | Procédures linéaires sans structure : drawAxiomTree, drawAxiomSphere |

**Le problème** : Le contrat est implicite. Le cablage est une convention de noms.

---

## Vision pour V8

### Le mouvement

Extraire la structure répétée en **classe abstraite `VisualizationContract`** qui orchestre l'assemblage de 3 composants :
1. Layout du graphe (où placer nœuds et arêtes)
2. Rendu des nœuds (cercles, carrés, autres)
3. Rendu des arêtes (bézier, droites, arcs)

### Structure proposée

```
Visualizations (nouvelles abstractions)
├── visualization-contract.js      (classe abstraite)
├── tree-visualization.js          (classe TreeVisualization extends VisualizationContract)
├── sphere-visualization.js        (classe SphereVisualization extends VisualizationContract)
└── [timeline-visualization.js]    (extensible pour V9+)

scene.js
└── utilise rightView pour sélectionner la visualisation
```

Chaque visualisation devient :

```javascript
class TreeVisualization extends VisualizationContract {
  constructor() {
    super({
      id: 'tree',
      title: 'Arbre des axiomes',
    });
  }

  // Layout : où placer les nœuds
  layoutInputs(rect, tri) {
    return {
      inA: { x: x + w * 0.30, y: y_in },
      inB: { x: x + w * 0.70, y: y_in },
    };
  }

  layoutAxioms(rect, classified, maxW) {
    const yAx = y + h * 0.55;
    return classified.map((entry, i) => ({
      x: xStart + i * xStep,
      y: yAx,
      r: ... // rayon basé sur poids
    }));
  }

  layoutOutput(rect) {
    return { x: x + w / 2, y: y_out };
  }

  // Rendu : comment dessiner les connexions
  drawInputEdges(ctx, inputs, axioms) {
    // Bézier courbes de a,b vers axiomes
  }

  drawOutputEdges(ctx, axioms, output) {
    // Bézier courbes de axiomes vers c²
  }
}

export default new TreeVisualization();
```

### Classe abstraite VisualizationContract

```typescript
abstract class VisualizationContract {
  id: string;
  title: string;
  color?: string;

  constructor(config) {
    this.id = config.id;
    this.title = config.title;
  }

  // Layout (à surcharger pour chaque visualisation)
  abstract layoutInputs(rect, tri): InputLayout
  abstract layoutAxioms(rect, classified, maxW): AxiomLayout[]
  abstract layoutOutput(rect): OutputLayout

  // Rendu d'arêtes (à surcharger)
  abstract drawInputEdges(ctx, inputs, axioms, proof): void
  abstract drawOutputEdges(ctx, axioms, output, proof): void

  // Rendu de nœuds (peut être partagé ou surcharger)
  drawNodes(ctx, inputs, axioms, output, proof) {
    // Dessine cercles standard pour nœuds
  }

  // Orchestration principale
  draw(ctx, rect, proof, classified, tri) {
    const inputs = this.layoutInputs(rect, tri);
    const axioms = this.layoutAxioms(rect, classified, maxW);
    const output = this.layoutOutput(rect);

    this.drawTitle(ctx, rect, proof);
    this.drawNodes(ctx, inputs, axioms, output, proof);
    this.drawInputEdges(ctx, inputs, axioms, proof);
    this.drawOutputEdges(ctx, axioms, output, proof);
  }
}
```

### Import dans scene.js

```javascript
// Avant (V7)
if (rightView === 'tree') {
  drawAxiomTree(ctx, vizRect, cablage, classified, tri);
} else if (rightView === 'sphere') {
  drawAxiomSphere(ctx, vizRect, cablage, classified, tri);
}

// Après (V8)
const viz = VIZ_TYPES[rightView]; // {'tree': TreeViz, 'sphere': SphereViz}
viz.draw(ctx, vizRect, cablage, classified, tri);
```

---

## Architecture cible

```
app/8_visualisations/
  pythagore.html
  js/
    visualization-contract.js      ← NOUVEAU (classe abstraite)
    visualizations/
      tree.js                       ← Nouveau (classe TreeVisualization)
      sphere.js                     ← Nouveau (classe SphereVisualization)
    render-contract.js              (copie V7)
    cablage-contract.js             (copie V7)
    classifier.js                   (copie V7)
    primitives.js                   (copie V7)
    scene.js                        (modifié : utilise viz.draw() au lieu de drawAxiomTree/Sphere)
    main.js                         (copie V7)
    cablages/                       (4 cablages, inchangés)
      euclid/...
      measure/...
      hilbert/...
      parseval/...
```

**Fichiers critiques à lire/modifier** :

| Fichier | Action | Raison |
|---------|--------|--------|
| visualization-contract.js | NOUVEAU | Classe abstraite pour toutes les visualisations |
| visualizations/tree.js | NOUVEAU | Classe TreeVisualization (extrait drawAxiomTree) |
| visualizations/sphere.js | NOUVEAU | Classe SphereVisualization (extrait drawAxiomSphere) |
| scene.js | MODIFIER | Utilise VIZ_TYPES[rightView].draw() au lieu de fonctions |
| structure.js | VIDER | Supprimer drawAxiomTree et drawAxiomSphere (logique repliée) |

---

## Bénéfices

| Bénéfice | V7 | V8 |
|----------|-----|-----|
| **Ajouter une visualisation** | Créer une fonction + gérer deux boucles | Créer 1 classe + hériter VisualizationContract |
| **Structure explicite** | Convention implicite (noms de fonctions) | Classe VisualizationContract |
| **Duplication** | drawAxiomTree et drawAxiomSphere copient layout | 0 duplication (layout centralisé) |
| **Polymorphisme** | Par dispatch sur rightView (string) | Par classe héritant VisualizationContract |
| **Réutilisabilité** | Chaque viz isolée | Toutes les viz partagent orchestration |

### Coût de modification

- visualization-contract.js : ~80 lignes (NOUVEAU)
- visualizations/tree.js : ~110 lignes (extrait drawAxiomTree)
- visualizations/sphere.js : ~110 lignes (extrait drawAxiomSphere)
- Supprimer drawAxiomTree, drawAxiomSphere : -220 lignes

**Bilan** : +290 lignes, -220 lignes = +70 lignes totales.

---

## Vérification

### Vérification structurelle

1. ✓ VisualizationContract a abstractLayout... et drawInputEdges/OutputEdges
2. ✓ TreeVisualization et SphereVisualization héritent VisualizationContract
3. ✓ scene.js utilise VIZ_TYPES[rightView].draw(ctx, rect, proof, classified, tri)
4. ✓ Aucun drawAxiomTree ou drawAxiomSphere ne reste dans structure.js
5. ✓ drawArrow, wrapToLines, drawAxiomRow restent dans structure.js (utilities partagées)

### Vérification fonctionnelle

1. Arbre des axiomes s'affiche (même rendu qu'avant)
2. Sphère des axiomes s'affiche (même rendu qu'avant)
3. Changement rightView bascule entre tree et sphere sans bug
4. Les axiomes sont classifiés et affichés correctement
5. Les connexions (bézier, arcs) apparaissent

---

## Triple distinction de V8

| Dimension | Contenu |
|-----------|---------|
| **Sens** | Visualiser axiomes classifiés (leur contribution au résultat) |
| **Contrat** | VisualizationContract orchestre layout + rendu via interface uniforme |
| **Cablage** | VisualizationContract hérite (implicitement) primitives ; each viz spécialise layout + edges |

---

## Après V8 ?

### V9 — Contrat de primitive graphique (optionnel)

Si le mouvement continue, V9 pourrait formaliser les primitives elles-mêmes.

**Problème** : Primitives.js a 50+ fonctions (P.box, P.circle, P.text, etc.) sans interface commune.

**Vision** : Créer GraphicPrimitive pour chaque forme (Box, Circle, Line, etc.) héritant d'une base.

### La limite de la formalisation (Gödel revient)

```
V0 : Monolithe                          1 scope
V1 : Modules                            13 fichiers
V2 : Contrats forts                     ctx/rect/tri explicites
V3 : Contraintes                        calcul séparé du rendu
V4 : Sens commun                        1 cablage = 1 dossier
V5 : Primitives                         p5.js encapsulé
V6 : Contrat rendu                      RenderContract (pipeline 4-phases)
V7 : Contrat cablage                    CablageContract (metadata + rendu)
V8 : Contrat visualisation              VisualizationContract (layout + edges)
V9 : Contrat primitif graphique (?)     GraphicPrimitive (chaque forme)
...
VN : Contrat [structure implicite]      [émerge au niveau N+1]
```

Chaque version rend explicite ce qui était implicite au niveau précédent. Mais Gödel garantit qu'il existera toujours une structure au niveau suivant.

---

## Résumé

**V8 continue le mouvement V6 → V7** : rendre explicite ce qui est implicite.

- V6 : pipeline 4-phases → classe RenderContract
- V7 : structure cablage (axiomes + rendu) → classe CablageContract
- V8 : structure visualisation (layout + edges) → classe VisualizationContract

**Mouvement unifié** :

```
Implicite (convention)
       ↓
Formalisé (classe abstraite)
       ↓
Réutilisable sans répétition
       ↓
Prêt pour V9
```

V8 = dernière formalisation avant que les primitives graphiques elles-mêmes deviennent des contrats.

---

[← Index des propositions](README.md)
