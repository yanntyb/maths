# V2 — Contrats forts

> [Retour a l'index](../README.md)

`pythagore.html` + `js/*.js`

- **Sens** -- meme application que V1, reorganisee en 3 couches (donnees / calcul / rendu) avec contrats explicites
- **Contrat** -- `(a, b, s) -> Canvas` (inchange depuis V0)
- **Ports** -- `a in R_+` , `b in R_+` , `s in R_+` , `activeProof in {0..4}` , `rightView in {anim, tree, sphere}` (entrees) ; `Canvas` (sortie)

## Circuit

```mermaid
graph LR
    a["a : R_+"]:::blue --> MAIN["main.js<br/>construit ctx, tri"]:::curry
    b["b : R_+"]:::blue --> MAIN
    s["s : R_+"]:::violet --> MAIN
    proof["activeProof"]:::violet --> MAIN
    view["rightView"]:::violet --> MAIN

    MAIN --> SCENE["scene.js<br/>drawScene(ctx, proof, view, tri)"]:::green
    SCENE --> CLASS["classifier.js<br/>classify(proof, tri)"]:::violet
    SCENE --> VIZ["viz.js<br/>drawEuclid/Measure/...(ctx, rect, tri, color)"]:::blue
    SCENE --> STRUCT["structure.js<br/>drawAxiomTree/Sphere(ctx, rect, ...)"]:::blue
    CLASS --> DATA["preuves.js<br/>PREUVES (constant)"]:::green

    VIZ --> canvas["Canvas"]:::green
    STRUCT --> canvas

    classDef blue fill:#3B82F6,color:#fff
    classDef violet fill:#8B5CF6,color:#fff
    classDef green fill:#10B981,color:#fff
    classDef grey fill:#6B7280,color:#fff
    classDef curry fill:#F59E0B,color:#fff
```

## Comment ca marche

L'etat est local a `main.js` (objet `S`). A chaque frame, main.js construit deux objets de contrat :

- `ctx = { p, w, h, s }` — contexte de rendu (remplace P, W, H, S.s implicites de V1)
- `tri = { a, b, c }` — triangle courant (c = sqrt(a² + b²))

Ces objets sont passes en argument a `drawScene(ctx, activeProof, rightView, tri)` qui dispatche vers les modules de rendu. Plus aucune globale mutable n'est importee.

## Blocs (modules)

| Module | Sens | Contrat | Ports |
|--------|------|---------|-------|
| preuves.js | catalogue des 5 cablages + poids | `PREUVES : Preuve[]` (constant) | sortie : `PREUVES` |
| classifier.js | classification derivee des poids | `(proof, tri) -> classified[]` | proof + tri (entrees) ; classified (sortie) |
| viz.js | rendu des 5 visualisations | `(ctx, rect, tri, color) -> void` | ctx + rect + tri + color (entrees) ; Canvas (sortie) |
| structure.js | rendu arbre, cercle, ligne d'axiome | `(ctx, rect, proof, classified, tri) -> void` | ctx + rect + proof + classified + tri (entrees) ; Canvas (sortie) |
| scene.js | orchestrateur rendu | `(ctx, activeProof, rightView, tri) -> void` | ctx + activeProof + rightView + tri (entrees) ; Canvas (sortie) |
| main.js | point d'entree, UI, boucle p5 | `new p5(setup, draw, resize)` | DOM events (entrees) ; ctx + tri (sorties internes) |

## Cablages

### Boucle draw (60 fps)

```mermaid
graph LR
    subgraph "main.js"
        DRAW["p5.draw()"] --> INTERP["interpole a, b"]
        INTERP --> CTX["ctx = {p, w, h, s}"]
        CTX --> TRI["tri = {a, b, c}"]
        TRI --> SCENE["drawScene(ctx, proof, view, tri)"]
    end

    subgraph "scene.js"
        SCENE --> BAN["bandeau invariant"]
        SCENE --> PROOF["drawProof(ctx, rect, proof, tri, view)"]
    end

    subgraph "viz.js / structure.js"
        PROOF --> LEFT["colonne gauche<br/>drawAxiomRow x N"]
        PROOF --> RIGHT["colonne droite<br/>drawVizOf / Tree / Sphere"]
    end
```

### Classification structurel / numerique

```mermaid
graph TD
    AX["axiome.weight(a,b,c)"]
    AX -->|"isStructural(weight)<br/>teste 2 triplets"| DERIVE["DERIVE automatiquement"]:::green

    DERIVE -->|"poids constant"| STRUCT["STRUCTUREL"]:::grey
    DERIVE -->|"poids variable"| NUM["NUMERIQUE"]:::curry

    classDef grey fill:#6B7280,color:#fff
    classDef curry fill:#F59E0B,color:#fff
    classDef green fill:#10B981,color:#fff
```

La distinction n'est plus une table en dur (`NUMERIC_CODES` de V1) mais est **derivee** du poids : si `weight(3,4,5) == weight(5,12,13)` alors l'axiome est structurel.

### Dispatch des visualisations

```mermaid
graph LR
    VIZ["drawVizOf(ctx, type, rect, tri, color)"]
    VIZ -->|"euclid"| E["drawEuclid<br/>grand carre (a+b)²"]
    VIZ -->|"measure"| M["drawMeasure<br/>3 carres"]
    VIZ -->|"hilbert"| H["drawHilbert<br/>v perp w"]
    VIZ -->|"parseval"| Pa["drawParseval<br/>diagramme commutatif"]
    VIZ -->|"frontiere"| F["drawFrontiere<br/>paysage isometrique"]
```

## Analyse sens / contrat / cablage

| Dimension | Etat V2 |
|-----------|---------|
| **Sens** | explicite — 3 couches : donnees (preuves), calcul (classifier), rendu (viz + structure + scene) |
| **Contrat** | fort — tous les ports dans les signatures, aucun port cache |
| **Cablage** | compact — ctx passe de main -> scene -> viz/structure, 6 modules |

### Contrats forts : ce qui a change depuis V1

| Port cache V1 | Solution V2 |
|----------------|-------------|
| `P` (instance p5) importee par 9 modules | `ctx.p` passe en argument |
| `S.s` lu par draw-frontiere | `ctx.s` dans le contexte |
| `W, H` lus en global par draw-layout | `ctx.w`, `ctx.h` dans le contexte |
| `NUMERIC_CODES` table en dur | `isStructural()` derive du poids |
| `axiomsList[j][2]` code mort | fonctions `weight` actives, seule source de verite |

### Objets de contrat

```mermaid
graph TD
    subgraph "ctx (contexte de rendu)"
        P_["p : instance p5"]
        W_["w : largeur canvas"]
        H_["h : hauteur canvas"]
        S_["s : exposant zeta"]
    end

    subgraph "rect (zone de dessin)"
        RX["x, y : origine"]
        RW["w, h : dimensions"]
    end

    subgraph "tri (triangle)"
        TA["a : cote"]
        TB["b : cote"]
        TC["c : hypotenuse = sqrt(a² + b²)"]
    end
```

## Chiffres

| Metrique | V0 | V1 | V2 |
|----------|----|----|-----|
| Fichiers JS | 1 | 13 | 6 |
| Plus gros fichier | 1690 l. | 276 l. | 305 l. (viz.js) |
| Ports caches | tous | 4 | 0 |
| Sources de poids | 1 (inline) | 2 (une morte) | 1 (integree) |
| Tables en dur | oui | 1 (NUMERIC_CODES) | 0 |
| Globales mutables importees | toutes | 4 (P, S, W, H) | 0 |

---

[← V1 Modules ES](../1_modules/) | [Index](../README.md)
