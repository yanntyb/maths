# Vecteur

> [Retour aux meta-objets](README.md) | [Sens](../sens/)

Le meta-objet Vecteur prend [Aligner](../sens/aligner/) (`E x E -> R`) et engendre deux sens derives par **auto-application** et **quotient normalise**.

## Triple distinction

| Dimension | Vecteur |
|-----------|---------|
| **Sens** | extraire la taille et l'angle a partir de l'alignement |
| **Contrat** | `(E x E -> R) -> {(E -> R), (E x E -> R)}` |
| **Cablage** | auto-application pour Normer, quotient normalise pour Comparer |

## Difference avec le currying

Le [currying](currying.md) **fixe une entree** : `(A x B -> C) -> (A -> (B -> C))`. L'entree `A` est figee, il reste `B -> C`.

La derivation vectorielle est differente :

- **Normer** : on branche la **meme** valeur sur les deux ports → `<v,v>` → `sqrt`. C'est une **auto-application**, pas une entree fixee.
- **Comparer** : on divise par le produit des normes → `<v,w> / (||v|| * ||w||)`. C'est un **quotient normalise**, pas une restriction.

Dans les deux cas, Aligner reste a deux entrees — on ne fixe rien, on **reorganise le circuit autour de lui**.

## Derivation

```mermaid
graph TD
    AL["Aligner\nE x E -> R"]:::blue

    subgraph Normer["Normer (auto-application)"]
        direction LR
        v1["v"]:::blue --> fork["fork"]
        fork --> a1["port 1"]
        fork --> a2["port 2"]
        a1 --> AL1["Aligner"]:::blue
        a2 --> AL1
        AL1 --> sqrt["sqrt"]:::curry
        sqrt --> n1["||v|| : R"]:::green
    end

    subgraph Comparer["Comparer (quotient normalise)"]
        direction LR
        v2["v"]:::blue --> AL2["Aligner"]:::blue
        w2["w"]:::blue --> AL2
        AL2 --> div["/"]:::curry
        v2b["v"]:::blue --> N1["Normer"]:::violet
        w2b["w"]:::blue --> N2["Normer"]:::violet
        N1 --> mul["*"]:::curry
        N2 --> mul
        mul --> div
        div --> cos["cos theta : R"]:::green
    end

    AL --> Normer
    AL --> Comparer

    classDef blue fill:#3B82F6,color:#fff
    classDef green fill:#10B981,color:#fff
    classDef curry fill:#F59E0B,color:#fff
    classDef violet fill:#8B5CF6,color:#fff
```

## Sens engendres

| Sens | Contrat | Derivation |
|------|---------|------------|
| [Normer](../sens/normer/) | `E -> R` | auto-application de Aligner + sqrt |
| [Comparer](../sens/comparer/) | `E x E -> R` | quotient Aligner / (Normer x Normer) |
