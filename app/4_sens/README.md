# V4 — Sens commun emergent

> [Retour a l'index](../README.md)

`pythagore.html` + `js/cablages/<nom>/`

- **Sens** -- meme application que V3, reorganisee pour qu'un cablage = un dossier et que le sens commun emerge de la forme repetee. Seules les 4 preuves classiques participent — la meta-preuve Frontiere reste dans V3 (son sens est trop eloigne du sens commun).
- **Contrat** -- `(a, b) -> Canvas` (simplifie : plus de parametre s)
- **Ports** -- `a in R_+` , `b in R_+` , `activeProof in {0..3}` , `rightView in {anim, tree, sphere}` (entrees) ; `Canvas` (sortie)

## Circuit

```mermaid
graph TD
    a["a : R_+"]:::blue --> MAIN["main.js<br/>construit ctx, tri"]:::curry
    b["b : R_+"]:::blue --> MAIN
    proof["activeProof"]:::violet --> MAIN
    view["rightView"]:::violet --> MAIN

    MAIN --> SCENE["scene.js<br/>drawScene(ctx, proof, view, tri)"]:::teal

    subgraph CABLAGES["cablages/ — 4 dossiers"]
        subgraph EUCLID["euclid/"]
            EA["axiomes.js"]:::blue
            ER["rendu.js"]:::blue
            EI["index.js"]:::blue
        end
        subgraph MEASURE["measure/"]
            MA["axiomes.js"]:::green
            MR["rendu.js"]:::green
            MI["index.js"]:::green
        end
        subgraph HILBERT["hilbert/"]
            HA["axiomes.js"]:::violet
            HR["rendu.js"]:::violet
            HI["index.js"]:::violet
        end
        subgraph PARSEVAL["parseval/"]
            PA["axiomes.js"]:::cyan
            PR["rendu.js"]:::cyan
            PI["index.js"]:::cyan
        end
    end

    SCENE --> EI & MI & HI & PI
    SCENE --> CLASS["classifier.js"]:::grey
    SCENE --> STRUCT["structure.js"]:::grey

    classDef blue fill:#3B82F6,color:#fff
    classDef violet fill:#8B5CF6,color:#fff
    classDef green fill:#10B981,color:#fff
    classDef teal fill:#14B8A6,color:#fff
    classDef curry fill:#F59E0B,color:#fff
    classDef cyan fill:#0EA5E9,color:#fff
    classDef grey fill:#6B7280,color:#fff
```

## Comment ca marche

Comme V3, main.js construit `ctx = { p, w, h }` et `tri = { a, b, c }` a chaque frame et appelle `drawScene(ctx, activeProof, rightView, tri)`.

La difference avec V3 : chaque cablage co-localise ses axiomes et son rendu dans un meme dossier. La table de dispatch `drawVizOf` disparait — scene.js appelle `cablage.draw(ctx, rect, tri, cablage.color)`. Le sens commun emerge de la forme repetee des 4 dossiers.

## Blocs (modules)

| Module | Sens | Contrat | Ports |
|--------|------|---------|-------|
| cablages/euclid/ | preuve Euclide — axiomes + rendu co-localises | `{ id, axioms, draw, format, ... }` | exporte un cablage complet |
| cablages/measure/ | preuve Mesure — axiomes + rendu co-localises | `{ id, axioms, draw, format, ... }` | exporte un cablage complet |
| cablages/hilbert/ | preuve Hilbert — axiomes + rendu co-localises | `{ id, axioms, draw, format, ... }` | exporte un cablage complet. rendu.js importe drawArrow |
| cablages/parseval/ | preuve Parseval — axiomes + rendu co-localises | `{ id, axioms, draw, format, ... }` | exporte un cablage complet. rendu.js importe drawArrow |
| classifier.js | classification derivee des poids | `(proof, tri) -> classified[]` | proof + tri (entrees) ; classified (sortie) |
| structure.js | rendu arbre, cercle, ligne d'axiome | `(ctx, rect, proof, classified, tri) -> void` | ctx + rect + proof + classified + tri ; Canvas |
| scene.js | orchestrateur rendu | `(ctx, activeProof, rightView, tri) -> void` | ctx + activeProof + rightView + tri ; Canvas |
| main.js | point d'entree, UI, boucle p5 | `new p5(setup, draw, resize)` | DOM events (entrees) ; ctx + tri (sorties internes) |

## Cablages

### Forme commune : 1 cablage = 1 dossier

```mermaid
graph LR
    subgraph "cablages/<nom>/"
        AX["axiomes.js<br/>ce que la preuve SAIT"]:::green
        RE["rendu.js<br/>ce que la preuve MONTRE"]:::blue
        IX["index.js<br/>ce que la preuve EST"]:::teal
        AX --> IX
        RE --> IX
    end

    classDef green fill:#D1FAE5,stroke:#10B981
    classDef blue fill:#DBEAFE,stroke:#3B82F6
    classDef teal fill:#CCFBF1,stroke:#14B8A6
```

Cette forme repetee 4 fois EST le sens commun. On ne l'a pas code — on l'a fait emerger par la structure du projet.

### Profils de dependance des rendus

```mermaid
graph LR
    subgraph "Profil A — autonome"
        E["euclid/rendu.js"]:::green
        M["measure/rendu.js"]:::green
    end

    subgraph "Profil B — drawArrow"
        H["hilbert/rendu.js"]:::violet
        Pa["parseval/rendu.js"]:::violet
        H --> S["structure.js<br/>drawArrow"]:::grey
        Pa --> S
    end

    classDef green fill:#D1FAE5,stroke:#10B981
    classDef violet fill:#EDE9FE,stroke:#8B5CF6
    classDef grey fill:#F3F4F6,stroke:#9CA3AF
```

### Dispatch supprime

```mermaid
graph LR
    subgraph "V3 — dispatch manuel"
        V3D["drawVizOf(ctx, type, ...)"]:::red
        V3D -->|"if type === 'euclid'"| V3E["drawEuclid"]:::red
        V3D -->|"if type === 'measure'"| V3M["drawMeasure"]:::red
    end

    subgraph "V4 — auto-porte"
        V4C["cablage.draw(ctx, rect, tri, color)"]:::green
    end

    V3D -->|"supprime"| V4C

    classDef red fill:#FEE2E2,stroke:#EF4444
    classDef green fill:#D1FAE5,stroke:#10B981
```

### Boucle draw (60 fps)

```mermaid
graph LR
    subgraph "main.js"
        DRAW["p5.draw()"] --> INTERP["interpole a, b"]
        INTERP --> CTX["ctx = {p, w, h}"]
        CTX --> TRI["tri = {a, b, c}"]
        TRI --> SCENE["drawScene(ctx, proof, view, tri)"]
    end

    subgraph "scene.js"
        SCENE --> BAN["bandeau invariant"]
        SCENE --> PROOF["drawProof(ctx, rect, cablage, tri, view)"]
    end

    subgraph "cablage.draw()"
        PROOF --> LEFT["colonne gauche<br/>drawAxiomRow x N"]
        PROOF --> RIGHT["colonne droite<br/>cablage.draw()"]
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

> (inchangé depuis V2 — voir [2_contrats/README.md](../2_contrats/README.md))

## Analyse sens / contrat / cablage

| Dimension | Etat V4 |
|-----------|---------|
| **Sens** | **reuni** — chaque cablage co-localise ce qu'il sait (axiomes) et ce qu'il montre (rendu) |
| **Contrat** | fort et **auto-porte** — le cablage porte son propre `draw`, plus de dispatch externe |
| **Cablage** | forme commune **emerge** de la structure repetee des 4 dossiers |

### Ce qui a change depuis V3

| Contrainte V3 | Solution V4 |
|----------------|-------------|
| Lien axiomes <-> rendu implicite (preuves.js <-> viz-*.js) | **explicite** — meme dossier |
| preuves.js monolithe (5 preuves) | eclate en 4 `axiomes.js` (frontiere exclue — sens trop eloigne) |
| dispatch manuel drawVizOf (switch sur type) | supprime — `cablage.draw()` |
| sens commun invisible | **emerge** de la forme repetee axiomes.js + rendu.js + index.js |

### Pourquoi frontiere est exclue

La meta-preuve Frontiere (convergence de zeta d'Epstein) a un sens trop eloigne des 4 preuves classiques pour participer a la forme commune. Ses specificites :

- `ctx.s` — seul cablage qui lit un parametre supplementaire
- `arithmetique.js` — module de calcul prive sans equivalent chez les autres
- `isMeta: true` — se declare elle-meme hors du sens commun

Elle reste dans V3 et pourra rejoindre V4 quand son sens sera clarifie.

### Modules testables sans p5

```mermaid
graph LR
    subgraph "Testables en isolation"
        C["classifier.js"]:::green
        AX1["euclid/axiomes.js"]:::green
        AX2["measure/axiomes.js"]:::green
        AX3["hilbert/axiomes.js"]:::green
        AX4["parseval/axiomes.js"]:::green
    end

    subgraph "Necessitent p5"
        R1["euclid/rendu.js"]:::grey
        R2["measure/rendu.js"]:::grey
        R3["hilbert/rendu.js"]:::grey
        R4["parseval/rendu.js"]:::grey
        ST["structure"]:::grey
        SC["scene"]:::grey
        MA["main"]:::grey
    end

    classDef green fill:#D1FAE5,stroke:#10B981
    classDef grey fill:#F3F4F6,stroke:#9CA3AF
```

V3 avait 3 modules testables (preuves, classifier, arithmetique). V4 en a 5 (4 axiomes + classifier).

## Chiffres

| Metrique | V0 | V1 | V2 | V3 | V4 |
|----------|----|----|-----|-----|-----|
| Fichiers JS | 1 | 13 | 6 | 11 | 16 (4 dossiers x 3 + 4 modules) |
| Plus gros fichier | 1690 l. | 276 l. | 514 l. | ~160 l. | ~160 l. (scene.js) |
| Sens melange | oui | non | 1 (viz.js) | 0 | 0 |
| Lien axiomes <-> rendu | implicite | implicite | implicite | implicite | **explicite** (meme dossier) |
| Dispatch viz | switch | switch | switch | switch | **supprime** (cablage.draw) |
| Modifier une preuve | 2+ fichiers | 2+ fichiers | 2 fichiers | 2 fichiers | **1 dossier** |
| Sens commun | invisible | invisible | invisible | invisible | **emerge** de la forme repetee |
| Modules testables sans p5 | 0 | 0 | 2 | 3 | 5 |

---

[<- V3 Contraintes](../3_contraintes/) | [Index](../README.md)
