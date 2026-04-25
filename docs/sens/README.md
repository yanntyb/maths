# Sens

> [Retour au sommaire](../../README.md) | [Vocabulaire](../vocabulaire/) | [Architecture](../architecture.md)

```mermaid
graph LR
    subgraph PS["Aligner"]
        direction LR
        f_ps["f : E"]:::blue --> intfg["integrale fg"] --> r_ps["R"]:::green
        g_ps["g : E"]:::blue --> intfg
    end

    subgraph PD["Observer"]
        direction LR
        phi_pd["phi : E*"]:::violet --> eval["phi(v)"] --> r_pd["R"]:::green
        v_pd["v : E"]:::blue --> eval
    end

    subgraph MV["Deplacer"]
        direction LR
        v_mv["v : R^3"]:::blue --> tv["T_v"] --> sd_mv["(S',d')\nOmega x R"]:::red
        sd0_mv["(S,d)\nOmega x R"]:::red --> tv
    end

    subgraph AT["Attirer"]
        direction LR
        x_at["x : E"]:::blue --> inv_at["1/|x-y|^2"] --> r_at["R"]:::green
        y_at["y : E"]:::blue --> inv_at
    end

    subgraph CC["Concentrer"]
        direction LR
        eps_cc["epsilon : R_+"]:::violet --> w_cc["w_epsilon * f"] --> r_cc["R"]:::green
        f_cc["f : X -> R"]:::red --> w_cc
    end

    subgraph GD["Godel"]
        direction LR
        circuit_gd["Circuit"]:::red --> enc_gd["encodage"] --> n_gd["N"]:::green
    end

    subgraph CU["Currying"]
        direction LR
        ab_cu["A x B -> C"]:::blue --> fix_cu["fixer A"] --> bc_cu["B -> C"]:::curry
    end

    classDef blue fill:#3B82F6,color:#fff
    classDef violet fill:#8B5CF6,color:#fff
    classDef green fill:#10B981,color:#fff
    classDef red fill:#EF4444,color:#fff
    classDef curry fill:#F59E0B,color:#fff
```

## Blocs atomiques

| Objet | Contrat | Symetrie |
|-------|---------|----------|
| [Aligner](aligner.md) | `E x E -> R` | symetrique |
| [Observer](observer.md) | `E* x E -> R` | asymetrique |
| [Ponderer](ponderer.md) | `R x R -> R` | symetrique |
| [Attirer](attirer.md) | `E x E -> R` | symetrique |
| [Deplacer](deplacer.md) | `R^3 x (Omega x R) -> (Omega x R)` | asymetrique |
| [Concentrer](concentrer.md) | `R_+ x X x (X -> R) -> R` | asymetrique |

## Espaces

| | |
|---|---|
| [Espaces](espaces.md) | `E`, `E*`, `R`, `Omega` et regles de typage |

## Meta-objets

Operent sur les objets eux-memes, pas sur des valeurs.

| Meta-objet | Contrat |
|------------|---------|
| [Godel](../meta-objets/README.md) | `Circuit -> N` |
| [Currying](../meta-objets/currying.md) | `(A x B -> C) -> (A -> (B -> C))` |
| [Encodage](../meta-objets/encodage.md) | types, objets et circuits comme nombres |

## Cablages

Les cablages assemblent plusieurs sens en un circuit complet. Ils ne definissent rien de nouveau — ils montrent comment les sens se connectent.

| Cablage | Sens assembles |
|---------|---------------|
| [Projeter](../cablages/projeter.md) | observer + ponderer + deplacer |
| [Ecouter](../cablages/ecouter.md) | concentrer + ponderer + observer |
| [Concentration](../cablages/concentration.md) | 5 exemples concrets de concentrer |
