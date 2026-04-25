# Ponderer

> [Retour aux sens](README.md)

`a * b`

- **Sens** -- peser une grandeur par une autre
- **Contrat** -- `R x R -> R` (symetrique)
- **Ports** -- `a in R`, `b in R` (entrees), `R` (sortie)
- **Cablage** -- `a, b -> a*b -> R`

## Comment ca marche

Le produit lineaire est le cablage le plus elementaire : deux scalaires entrent, leur produit sort. C'est la brique de **ponderation** — multiplier une grandeur par un poids.

```mermaid
graph LR
    a["a : R\nscalaire"]:::green --> MUL["a * b\nmultiplication"]
    b["b : R\nscalaire"]:::green --> MUL
    MUL --> r["R"]:::green

    classDef green fill:#10B981,color:#fff
```

## Currying du produit lineaire

Le [currying](../meta-objets/currying.md) transforme le produit lineaire en un bloc qui **produit un scalaire** :

```mermaid
graph LR
    subgraph Avant["Avant : R x R -> R"]
        a1["a : R"]:::green --> pl1["a * b"] --> r1["R"]:::green
        b1["b : R"]:::green --> pl1
    end

    subgraph Apres["Apres : R -> (R -> R)"]
        a2["a : R"]:::green --> pl2["a * _"]:::curry --> bloc["(R -> R)\nbloc"]:::curry
    end

    Avant -->|currying| Apres

    classDef green fill:#10B981,color:#fff
    classDef curry fill:#F59E0B,color:#fff
```

| | Avant | Apres |
|---|---|---|
| **Contrat** | `R x R -> R` | `R -> (R -> R)` |
| **Entrees** | `a : R`, `b : R` | `a : R` |
| **Sortie** | `R` | bloc `(R -> R)` |

Le bloc `a * _` est une **forme lineaire sur R** : il attend un scalaire et en produit un.

Dans l'[exemple de la sphere](../cablages/projeter.md), fixer `a = 1/d^2` donne le bloc `(1/d^2) * _` -- un attenuateur qui pondere l'aire geometrique par la distance.

## Currying + Godel

TODO -- le produit lineaire currie comme amplificateur dans l'encodage de Godel ; lien avec la table de mixage d'[ecouter](../cablages/ecouter.md).

---

[← Observer](observer.md) | [Attirer →](attirer.md)
