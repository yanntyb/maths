# Comparer -- cablage

> [Retour au sens Comparer](README.md)

## Comment ca marche

Le quotient normalise divise l'alignement brut par le produit des tailles. Le resultat est `cos theta in [-1, 1]` :

| Valeur | Interpretation |
|--------|----------------|
| `+1` | meme direction |
| `0` | perpendiculaires |
| `-1` | opposes |

```mermaid
graph LR
    v["v : E"]:::blue --> AL["Aligner\n< v, w >"]:::blue
    w["w : E"]:::blue --> AL

    v2["v"]:::blue --> N1["Normer\n||v||"]:::violet
    w2["w"]:::blue --> N2["Normer\n||w||"]:::violet

    N1 --> MUL["*\nR x R -> R"]:::curry
    N2 --> MUL

    AL --> DIV["/\nR x R -> R"]:::curry
    MUL --> DIV

    DIV --> cos["cos theta : R"]:::green

    classDef blue fill:#3B82F6,color:#fff
    classDef violet fill:#8B5CF6,color:#fff
    classDef green fill:#10B981,color:#fff
    classDef curry fill:#F59E0B,color:#fff
```

## Blocs reutilises

| Bloc | Contrat | Role |
|------|---------|------|
| [Aligner](../aligner/) | `E x E -> R` | produit scalaire brut |
| [Normer](../normer/) | `E -> R` | taille de chaque vecteur |
| [Ponderer](../ponderer/) | `R x R -> R` | produit des normes |

## Triple distinction

| Dimension | Comparer |
|-----------|----------|
| **Sens** | angle entre deux vecteurs |
| **Contrat** | `E x E -> R` |
| **Cablage** | Aligner + 2x Normer + produit + division |
