# Cablage : analyser

> [Retour au sens Observer](README.md) | [Synthetiser](synthetiser.md) | [Projeter sur V](projeter-v.md)

## Le probleme

On a une fonction `u` dans L^2 et une famille `{phi_k}` de fonctions (un frame). On veut decomposer `u` en coefficients : combien de chaque `phi_k` contient `u` ?

Chaque coefficient est un [Mesurer](../mesurer/) : fixer `phi_k`, lire `u`. Empiler tous les Mesurer donne l'operateur d'analyse.

## Circuit

```mermaid
graph LR
    u["u : E"]:::blue --> M1["Mesurer phi_1\nE -> R"]:::curry
    u --> M2["Mesurer phi_2\nE -> R"]:::curry
    u --> Mn["Mesurer phi_n\nE -> R"]:::curry

    M1 --> x1["x_1 : R"]:::green
    M2 --> x2["x_2 : R"]:::green
    Mn --> xn["x_n : R"]:::green

    x1 --> VEC["(x_1, ..., x_n)\nell^2(I)"]:::green
    x2 --> VEC
    xn --> VEC

    classDef blue fill:#3B82F6,color:#fff
    classDef green fill:#10B981,color:#fff
    classDef curry fill:#F59E0B,color:#fff
```

## Role de chaque bloc

| Etape | Bloc | Contrat | Sens |
|-------|------|---------|------|
| 1 | [Mesurer](../mesurer/) phi_k | `E -> R` | currying d'[Observer](README.md), phi_k fixe |
| 2 | Empiler | `R^n -> ell^2(I)` | collecter les scalaires en vecteur de coefficients |

## Notation du papier

```
Phi* : L^2(Omega) -> ell^2(I)
Phi* := [ <phi_k| ]_{k in I}     (colonne de bras)
x~* = Phi* u                      (vecteur de coefficients)
```

Chaque ligne de Phi* est un bra `<phi_k|` = un [Mesurer](../mesurer/).

## Triple distinction

| Dimension | Analyser |
|-----------|----------|
| **Sens** | decomposer une fonction sur un frame |
| **Contrat** | `E -> ell^2(I)` |
| **Cablage** | n Mesurer en parallele + empiler |

## Lien avec les autres fiches

- Chaque `<phi_k|` est un [currying](../../meta-objets/currying.md) d'[Observer](README.md)
- L'operation inverse est [Synthetiser](synthetiser.md)
- Analyser + Synthetiser = [Projeter sur V](projeter-v.md)
- Les produits `<phi_m|phi_n>` entre elements du frame donnent la [Gram](../aligner/gram.md)

---

[<- Observer](README.md) | [Synthetiser ->](synthetiser.md)
