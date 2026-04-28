# Pythagore — cablage euclidien

> [Retour a Pythagore](../README.md)

## Le probleme

Montrer que `a² + b² = c²` en decoupant le grand carre `(a+b)²` en 4 triangles rectangles identiques et un carre central tourne de cote `c`. L'egalite des aires donne le resultat.

## Circuit

```mermaid
graph LR
    a["a : R"]:::green --> CARRE["construire\n(a+b)²"]
    b["b : R"]:::green --> CARRE
    CARRE --> grand["(a+b)² : Omega"]:::red

    grand --> DECOUP["decouper\n4 triangles"]
    DECOUP --> tri["4 x ½ab : Omega"]:::red
    DECOUP --> central["carre central : Omega"]:::red

    a2["a, b"]:::green --> AIRE_TRI["Ponderer\n½ x a x b"]:::curry
    AIRE_TRI --> aire_tri["½ab : R"]:::green
    aire_tri --> FOIS4["Ponderer\nx 4"]:::curry
    FOIS4 --> total_tri["2ab : R"]:::green

    central --> AIRE_C["aire\ncarre tourne"]:::red
    AIRE_C --> c2["c² : R"]:::green

    total_tri --> ADD["+"]:::curry
    c2 --> ADD
    ADD --> verif["(a+b)² = 2ab + c² : R"]:::green

    verif --> SIMPLIF["CN2\nsimplifier"]:::curry
    SIMPLIF --> result["a² + b² = c² : R"]:::green

    classDef blue fill:#3B82F6,color:#fff
    classDef green fill:#10B981,color:#fff
    classDef red fill:#EF4444,color:#fff
    classDef curry fill:#F59E0B,color:#fff
```

## Role de chaque bloc

| Etape | Bloc | Contrat | Sens dans ce contexte |
|-------|------|---------|----------------------|
| 1 | Construire carre | `R x R -> Omega` | figure geometrique de cote `(a+b)` |
| 2 | Decouper | `Omega -> Omega x Omega` | separe 4 triangles et carre central |
| 3 | [Ponderer](../../../ponderer/) | `R x R -> R` | aire d'un triangle `½ab` |
| 4 | [Ponderer](../../../ponderer/) | `R x R -> R` | multiplier par 4 |
| 5 | Aire carre tourne | `Omega -> R` | aire du carre central = `c²` |
| 6 | Additionner | `R x R -> R` | `2ab + c² = (a+b)²` |
| 7 | Simplifier (CN2) | `R -> R` | developper et annuler `2ab` des deux cotes |

## Axiomes mobilises

| Code | Role | Type |
|------|------|------|
| P1, P2 | tracer et prolonger les cotes du grand carre | structurel |
| P4 | les 4 triangles sont rectangles (aire = ½ab) | numerique |
| P5 | les paralleles ferment le carre central (aire = c²) | numerique |
| CN2 | additionner les aires : 4·½ab + c² = (a+b)² | numerique |
| CN4 | les 4 triangles sont congruents (meme aire) | numerique |
| CN1, CN5 | transitivite et structure du decoupage | structurel |

## Triple distinction

| Dimension | Pythagore euclidien |
|-----------|---------------------|
| **Sens** | l'hypotenuse se deduit des deux cotes par decoupage d'aires |
| **Contrat** | `R x R -> R` |
| **Cablage** | construire (a+b)² + decouper 4 triangles + isoler c² + simplifier |

## Blocs reutilises

| Bloc | Occurrences | Role |
|------|-------------|------|
| [Ponderer](../../../ponderer/) | x2 | aire triangle ½ab, multiplier par 4 |
