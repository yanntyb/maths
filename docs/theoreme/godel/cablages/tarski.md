# Godel — cablage Tarski (indefinissabilite de la verite)

> [Retour a Godel](../README.md)

## Le probleme

Montrer que la verite arithmetique n'est pas definissable dans l'arithmetique elle-meme, puis en deduire que certaines verites echappent a la demontrabilite.

## Circuit

```mermaid
graph TD
    T["T : systeme formel"]:::blue --> SUP["Supposer\nVrai(x) definissable\ndans L(T)"]
    SUP --> DIAG["Diagonalisation\nsur les formules\na une variable"]:::curry

    DIAG --> LIAR["Phrase du menteur\nL := ¬Vrai(⌜L⌝)\n'je ne suis pas vrai'"]:::red

    LIAR --> FORK["fork"]
    FORK --> H1["L est vrai\n=> Vrai(⌜L⌝)\n=> ¬L\n=> contradiction"]:::red
    FORK --> H2["L est faux\n=> ¬Vrai(⌜L⌝)\n=> L\n=> contradiction"]:::red

    H1 --> CONTRA["Contradiction :\nVrai(x) n'est pas\ndefinissable dans L(T)"]:::curry
    H2 --> CONTRA

    CONTRA --> RESULT["Vrai(x) ⊄ L(T)\n=> Vrai ≠ Dem\n=> ∃ verites indemontrables\n=> ∃ G : T ⊬ G"]:::green

    classDef blue fill:#3B82F6,color:#fff
    classDef green fill:#10B981,color:#fff
    classDef red fill:#EF4444,color:#fff
    classDef curry fill:#F59E0B,color:#fff
```

## Role de chaque bloc

| Etape | Bloc | Contrat | Sens dans ce contexte |
|-------|------|---------|----------------------|
| 1 | Hypothese | axiome temporaire | supposer que Vrai(x) est une formule de L(T) |
| 2 | Diagonalisation | `L(T) -> L(T)` | construire L qui parle de sa propre verite |
| 3 | Phrase du menteur | `L(T)` | L := ¬Vrai(⌜L⌝) — auto-reference semantique |
| 4 | fork | `L(T) -> L(T) x L(T)` | examiner les deux cas (L vrai / L faux) |
| 5 | Contradiction | `hypothese -> ⊥` | les deux cas menent a une contradiction |
| 6 | Conclusion | | Vrai(x) n'est pas definissable => verite ≠ demontrabilite => incompletude |

## Axiomes mobilises

| Code | Role | Type |
|------|------|------|
| COH | T est coherent (T ⊬ ⊥) | structurel |
| PA | T contient l'arithmetique de Peano | structurel |
| DEN | le langage L(T) est denombrable | structurel |
| DIAG | diagonalisation sur les formules a une variable — meme mecanisme que le point fixe de Godel | numerique |

## Triple distinction

| Dimension | Tarski |
|-----------|--------|
| **Sens** | la verite depasse la demontrabilite — un systeme formel ne peut pas definir sa propre notion de verite |
| **Contrat** | `T (coherent, ⊇ PA) -> ∃ G : T ⊬ G ∧ T ⊬ ¬G` |
| **Cablage** | supposer Vrai(x) definissable → diagonaliser → phrase du menteur → contradiction → verite ≠ preuve → incompletude |
