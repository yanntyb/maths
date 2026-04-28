# Pythagore — journal de restructuration

> [Retour au projet](../README.md) | [Vocabulaire](../docs/vocabulaire/) | [Sens](../docs/sens/)

`app/`

- **Sens** -- montrer le theoreme de Pythagore sous 4 eclairages, restructurer le code pour rendre les contrats visibles
- **Contrat** -- `(a, b) -> Canvas` (inchange a travers les versions, s retire en V4)
- **Ports** -- `a in R_+` , `b in R_+` , `s in R_+` , `activeProof in {0..4}` , `rightView in {anim, tree, sphere}` (entrees) ; `Canvas` (sortie)

## Propositions d'architecture

Chaque version a une **proposition** qui diagnostique la version précédente et propose une vision pour la suivante.

→ **[Lire toutes les propositions](proposals/)** (7 propositions, V1-V7)

---

## Circuit : progression des versions

```mermaid
graph TD
    V0["<b>V0 — Monolithe</b><br/>1 fichier, 1690 lignes<br/>sens correct<br/>contrats absents<br/>cablage enchevetre"]:::grey
    V1["<b>V1 — Modules ES</b><br/>14 fichiers<br/>sens par module<br/>contrats partiels<br/>cablage etoile"]:::blue
    V2["<b>V2 — Contrats forts</b><br/>6 fichiers<br/>sens par couche<br/>contrats forts<br/>cablage compact"]:::green
    V3["<b>V3 — Contraintes</b><br/>11 fichiers<br/>1 cablage = 1 fichier<br/>calcul separe du rendu<br/>3 profils de dependance"]:::teal
    V4["<b>V4 — Sens commun</b><br/>16 fichiers (4 dossiers)<br/>1 cablage = 1 dossier<br/>sens commun emergent<br/>dispatch supprime"]:::cyan
    V5["<b>V5 — Primitives</b><br/>17 fichiers + primitives.js<br/>p5.js encapsule<br/>rendus abstrait graphique<br/>swap graphique possible"]:::magenta
    V6["<b>V6 — Contrat rendu</b><br/>18 fichiers + RenderContract<br/>4 phases explicites<br/>template method pattern<br/>polymorphisme par héritage"]:::teal

    V0 -->|"decoupe en 13 modules"| V1
    V1 -->|"contrats forts ctx/rect/tri"| V2
    V2 -->|"1 preuve = 1 fichier calcul extrait"| V3
    V3 -->|"1 cablage = 1 dossier sens commun"| V4
    V4 -->|"primitives graphiques p5.js encapsule"| V5
    V5 -->|"4-phase pipeline classe abstraite"| V6

    classDef grey fill:#6B7280,color:#fff
    classDef blue fill:#3B82F6,color:#fff
    classDef green fill:#10B981,color:#fff
    classDef teal fill:#14B8A6,color:#fff
    classDef cyan fill:#0EA5E9,color:#fff
    classDef magenta fill:#D946EF,color:#fff
```

## Versions

| Version | Sens | Contrat | Cablage |
|---------|------|---------|---------|
| [V0 — Monolithe](0_monolithe/) | correct (5 preuves, 1 invariant) | externe correct, internes absents | enchevetre (1 scope) |
| [V1 — Modules ES](1_modules/) | clair par module | partiels (P, W, H, S.s caches) | etoile autour de draw-layout |
| [V2 — Contrats forts](2_contrats/) | explicite (3 couches) | forts (ctx/rect/tri, 0 ports caches) | compact (6 modules, pas de globale) |
| [V3 — Contraintes](3_contraintes/) | simple (1 cablage = 1 fichier) | forts + ctx.s isole | explicite (3 profils, calcul separe) |
| [V4 — Sens commun](4_sens/) | reuni (1 cablage = 1 dossier) | forts + auto-porte (cablage.draw) | forme commune emergente (4 dossiers, frontiere exclue) |
| [V5 — Primitives](5_abstraites/) | inchange (axiomes → formes) | 3 couches (rendus ↔ primitives ↔ p5.js) | p5.js encapsule, swap possible |
| [V6 — Contrat rendu](6_contrats/) | inchange (axiomes → formes) | **4 couches** (rendus → RenderContract → primitives → p5.js) | **template method** (RenderContract orchestre, rendus héritent) |

## Invariant a travers les versions

Le **sens mathematique** ne change jamais :

> `a² + b² = c²` — l'hypotenuse se deduit des deux cotes

Cinq axiomatiques independantes (Euclide, Mesure, Hilbert, Parseval, Frontiere) produisent le meme scalaire. Le sens est ce qui reste quand on change de cablage — dans le code comme en mathematiques.

## Ce qui evolue

Seul le **cablage du code** change d'une version a l'autre. La restructuration rend progressivement les **contrats** explicites : les ports caches deviennent des arguments visibles dans les signatures.

```mermaid
graph TD
    subgraph "V0"
        S0["sens correct"]:::green
        C0["contrats absents"]:::red
        W0["cablage enchevetre"]:::red
    end

    subgraph "V1"
        S1["sens par module"]:::green
        C1["contrats partiels<br/>4 ports caches"]:::curry
        W1["cablage etoile<br/>hub draw-layout"]:::curry
    end

    subgraph "V2"
        S2["sens par couche"]:::green
        C2["contrats forts<br/>0 ports caches"]:::green
        W2["cablage compact<br/>ctx/rect/tri"]:::green
    end

    subgraph "V3"
        S3["1 cablage = 1 fichier"]:::green
        C3["contrats forts<br/>ctx.s isole"]:::green
        W3["cablage explicite<br/>3 profils de dep."]:::green
    end

    subgraph "V4"
        S4["sens commun emergent"]:::green
        C4["contrats auto-portes<br/>cablage.draw()"]:::green
        W4["forme repetee<br/>4 dossiers identiques"]:::green
    end

    subgraph "V5"
        S5["inchange<br/>(axiomes → formes)"]:::green
        C5["3 couches<br/>rendus ↔ primitives ↔ p5.js"]:::green
        W5["p5.js encapsule<br/>swap graphique possible"]:::green
    end

    subgraph "V6"
        S6["inchange<br/>(axiomes → formes)"]:::green
        C6["4 couches<br/>rendus → RenderContract → primitives → p5.js"]:::green
        W6["template method<br/>4 classes héritant"]:::green
    end

    S0 --> S1 --> S2 --> S3 --> S4 --> S5 --> S6
    C0 --> C1 --> C2 --> C3 --> C4 --> C5 --> C6
    W0 --> W1 --> W2 --> W3 --> W4 --> W5 --> W6

    classDef green fill:#10B981,color:#fff
    classDef red fill:#EF4444,color:#fff
    classDef curry fill:#F59E0B,color:#fff
```

---

[← Projet](../README.md)
