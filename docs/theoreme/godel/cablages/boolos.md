# Godel — cablage Boolos (paradoxe de Berry, 1989)

> [Retour a Godel](../README.md)

## Le probleme

Formaliser le paradoxe de Berry — "le plus petit entier non definissable en moins de k symboles" — pour en deduire l'incompletude de T.

## Circuit

```mermaid
graph LR
    T["T : systeme formel\nalphabet fini"]:::blue --> FORMULES["Formules de L(T)\ndenombrables"]:::green

    FORMULES --> COMPTAGE["Comptage :\n#{formules de < k symboles}\n= fini"]:::curry

    COMPTAGE --> BERRY["Paradoxe de Berry :\n'le plus petit n\nnon definissable\nen < k symboles'"]:::red

    N["N : entiers"]:::blue --> INFINI["N est infini\nmais les formules\ncourtes sont finies"]:::green

    INFINI --> EXISTE["∃ n indefinissable\nen < k symboles\n(tiroir)"]:::curry
    COMPTAGE --> EXISTE

    EXISTE --> INDEF["n existe\nmais T ne peut pas\nle nommer en < k symboles"]:::red

    BERRY --> FORMAL["Formaliser dans T :\nsi T complet, T definirait n\nen O(log k) symboles < k"]:::curry

    FORMAL --> CONTRA["Contradiction :\nn defini en < k symboles\nmais n est indefinissable en < k"]:::red
    INDEF --> CONTRA

    CONTRA --> RESULT["T est incomplet\n∃ G : T ⊬ G ∧ T ⊬ ¬G"]:::green

    classDef blue fill:#3B82F6,color:#fff
    classDef green fill:#10B981,color:#fff
    classDef red fill:#EF4444,color:#fff
    classDef curry fill:#F59E0B,color:#fff
```

## Role de chaque bloc

| Etape | Bloc | Contrat | Sens dans ce contexte |
|-------|------|---------|----------------------|
| 1 | Formules de L(T) | `alphabet -> L(T)` | le langage de T sur un alphabet fini |
| 2 | Comptage | `N -> N` | nombre de formules de longueur < k — c'est fini |
| 3 | Principe du tiroir | `fini vs infini` | N infini, formules courtes finies => certains n ne sont pas definissables |
| 4 | Paradoxe de Berry | `L(T)` | "le plus petit n non definissable en < k symboles" — phrase auto-referente |
| 5 | Formalisation | `T complet -> definition courte` | si T est complet, il pourrait definir n en O(log k) symboles |
| 6 | Contradiction | | n serait definissable et indefinissable en < k symboles |
| 7 | Conclusion | | T est incomplet — il ne peut pas definir tous les entiers |

## Axiomes mobilises

| Code | Role | Type |
|------|------|------|
| COH | T est coherent (T ⊬ ⊥) | structurel |
| FIN | l'alphabet de T est fini | structurel |
| DEN | les formules de L(T) sont denombrables | structurel |
| LEX | borne lexicale — le nombre de formules de longueur < k est fini (|alphabet|^k) | numerique |
| COMP | comptage des definitions — principe du tiroir applique aux formules et aux entiers | numerique |

## Triple distinction

| Dimension | Boolos |
|-----------|--------|
| **Sens** | un langage fini ne peut pas nommer tous les entiers — le paradoxe de Berry revele les limites expressives de T |
| **Contrat** | `T (coherent, ⊇ PA) -> ∃ G : T ⊬ G ∧ T ⊬ ¬G` |
| **Cablage** | alphabet fini → formules denombrables → comptage → tiroir → ∃ n indefinissable → Berry formalise → contradiction → incompletude |
