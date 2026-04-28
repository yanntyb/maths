# Sonder -- cablage

> [Retour au sens Sonder](README.md)

## Comment ca marche

Sonder est le calcul brut. Il prend un circuit [encode par Godel](../../meta-objets/encodage.md) et un parametre d'ouverture `s`, et produit la valeur du produit d'Euler partiel.

La factorisation de `G` donne les premiers `p_1, ..., p_n`. Chaque premier contribue un facteur `1/(1 - p_i^{-s})`. Le produit de ces facteurs est `zeta_G(s)`.

```mermaid
graph LR
    G["G : N\nnombre de Godel"]:::green --> FACT["factorisation"]
    FACT --> P["p_1, ..., p_n\npremiers"]:::blue
    s["s : R\nouverture"]:::violet --> EULER["PI 1/(1-p_i^{-s})\nproduit d'Euler"]
    P --> EULER
    EULER --> r["R"]:::green

    classDef blue fill:#3B82F6,color:#fff
    classDef violet fill:#8B5CF6,color:#fff
    classDef green fill:#10B981,color:#fff
```

Chaque facteur `1/(1-p_i^{-s})` est une [ponderation](../ponderer/) : il pese la contribution du premier `p_i` selon l'ouverture `s`.

## Triple distinction

| Dimension | Sonder |
|-----------|--------|
| **Sens** | evaluer la fonction zeta sur un encodage |
| **Contrat** | `N x R -> R` |
| **Cablage** | factorisation -> produit d'Euler partiel |
