# Meta-objets

> [Retour au sommaire](../../README.md) | [Sens](../sens/) | [Meta-sens](../meta-sens/) | [Meta-cablages](../meta-cablages/)

Un meta-objet ne transforme pas des **valeurs** (nombres, vecteurs, spheres). Il transforme des **objets** ou des **circuits**. Son entree est un contrat, pas une valeur.

```mermaid
graph TD
    subgraph niveau1["Niveau 1 -- meta-objets"]
        direction LR
        ENC["Encodage\nCircuit -> N"]:::red
        CUR["Currying\n(AxB->C) -> (A->(B->C))"]:::curry
        VEC["Vecteur\n(ExE->R) -> {(E->R),(ExE->R)}"]:::violet
        COMP["Composition\n(A->B)x(B->C) -> (A->C)"]:::grey
        DUAL["Dual\n(AxB->C) -> (BxA->C)"]:::grey
        TC["Type-checker\nCircuit -> {ok, erreur}"]:::grey
        INV["Invariance\nSens -> (Group, N)"]:::teal
    end

    subgraph niveau0["Niveau 0 -- objets"]
        direction LR
        AL["Aligner"]:::blue
        OB["Observer"]:::blue
        PO["Ponderer"]:::blue
        AT["Attirer"]:::blue
        DE["Deplacer"]:::blue
        CO["Concentrer"]:::blue
    end

    ENC -->|"encode"| niveau0
    CUR -->|"fixe une entree"| niveau0
    VEC -->|"derive"| AL
    INV -->|"classifie"| niveau0

    classDef blue fill:#3B82F6,color:#fff
    classDef red fill:#EF4444,color:#fff
    classDef curry fill:#F59E0B,color:#fff
    classDef violet fill:#8B5CF6,color:#fff
    classDef grey fill:#6B7280,color:#fff
    classDef teal fill:#14B8A6,color:#fff
```

## Catalogue

| Meta-objet | Contrat | Ce qu'il fait | Fiche |
|------------|---------|---------------|-------|
| Encodage | `Circuit -> N` | encode un circuit comme un nombre de Godel | [encodage.md](encodage.md) |
| Currying | `(A x B -> C) -> (A -> (B -> C))` | fixe une entree, produit un sens currie | [currying.md](currying.md) |
| Vecteur | `(E x E -> R) -> {(E -> R), (E x E -> R)}` | derive Normer et Comparer depuis Aligner | [vecteur.md](vecteur.md) |
| Composition | `(A -> B) x (B -> C) -> (A -> C)` | connecte deux objets en serie | -- |
| Dual | `(A x B -> C) -> (B x A -> C)` | echange les entrees | -- |
| Type-checker | `Circuit -> {ok, erreur}` | verifie les incompatibilites de typage | -- |
| Invariance | `Sens -> (Group, N)` | classifie un sens par son groupe d'invariance | [invariance.md](invariance.md) |

## Deux niveaux

| Niveau | Entree | Sortie | Exemple |
|--------|--------|--------|---------|
| 0 -- objet | valeur | valeur | `<phi\|v>` prend un vecteur, rend un scalaire |
| 1 -- meta-objet | objet ou circuit | valeur ou objet | Godel prend un circuit, rend un nombre |

## Ce que ca ouvre

- **Auto-reference** : un circuit peut prendre son propre nombre de Godel comme entree
- **Incompletude** : il existe des proprietes de circuits qu'aucun circuit ne peut decider
- **Quine** : un circuit dont la sortie est son propre encodage