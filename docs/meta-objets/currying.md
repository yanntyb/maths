# Currying

> [Retour aux meta-objets](README.md) | [Sens](../sens/)

Une entree peut devenir une sortie par reecriture :

```mermaid
graph LR
    subgraph Avant["Avant currying"]
        a1["a : R"]:::green --> f1["a * b"] --> r1["R"]:::green
        b1["b : R"]:::green --> f1
    end

    subgraph Apres["Apres currying"]
        a2["1/d^2 : R"]:::green --> f2["(1/d^2) * _"]:::curry --> fb["attenuateur\n(R -> R)"]:::curry
    end

    Avant -->|"fixer a = 1/d^2"| Apres

    classDef green fill:#10B981,color:#fff
    classDef curry fill:#F59E0B,color:#fff
```

Dans la [projection de la sphere](../cablages/projeter.md), fixer `a = 1/d^2` dans le [produit lineaire](../sens/ponderer.md) produit un attenuateur `(1/d^2) * _` qui pondere n'importe quelle aire par la distance.

Changer le cablage change le **cout** ET la **topologie** des ports.
