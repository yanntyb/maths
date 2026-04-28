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

    subgraph SD["Sonder"]
        direction LR
        g_sd["G : N"]:::green --> fact_sd["factorisation"] --> euler_sd["PI 1/(1-p^-s)"] --> r_sd["R"]:::green
        s_sd["s : R"]:::violet --> euler_sd
    end

    subgraph NM["Normer"]
        direction LR
        v_nm["v : E"]:::blue --> fork_nm["fork"] --> al_nm["Aligner"] --> sqrt_nm["sqrt"] --> r_nm["R"]:::green
    end

    subgraph CP["Comparer"]
        direction LR
        v_cp["v : E"]:::blue --> al_cp["Aligner"] --> div_cp["/"] --> r_cp["cos theta"]:::green
        w_cp["w : E"]:::blue --> al_cp
        v_cp2["v"]:::blue --> nm1_cp["Normer"]:::violet --> mul_cp["*"] --> div_cp
        w_cp2["w"]:::blue --> nm2_cp["Normer"]:::violet --> mul_cp
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
| [Aligner](aligner/) | `E x E -> R` | symetrique |
| [Observer](observer/) | `E* x E -> R` | asymetrique |
| [Ponderer](ponderer/) | `R x R -> R` | symetrique |
| [Attirer](attirer/) | `E x E -> R` | symetrique |
| [Deplacer](deplacer/) | `R^3 x (Omega x R) -> (Omega x R)` | asymetrique |
| [Concentrer](concentrer/) | `R_+ x X x (X -> R) -> R` | asymetrique |

## Sens derives

Produits par derivation interne (auto-application, quotient) via le meta-objet [Vecteur](../meta-objets/vecteur.md).

| Sens | Contrat | Derivation |
|------|---------|------------|
| [Normer](normer/) | `E -> R` | auto-application de Aligner |
| [Comparer](comparer/) | `E x E -> R` | quotient Aligner / (Normer x Normer) |
| [Accelerer](accelerer/) | `R x R -> R` | composition de Ponderer x3 |
| [Equilibrer](equilibrer/) | `R^4 -> R` | resolution cubique (vitesse radiale nulle) |

## Sens curries

Produits par [currying](../meta-objets/currying.md) d'un bloc atomique.

| Sens | Contrat | Source |
|------|---------|--------|
| [Amplifier](amplifier/) | `R -> R` | ponderer, fixer `a` |
| [Champ](champ/) | `E -> R` | attirer, fixer `x` |
| [Translater](translater/) | `(Omega x R) -> (Omega x R)` | deplacer, fixer `v` |
| [Lire](lire/) | `(X -> R) -> R` | concentrer, fixer `epsilon, x_0` |
| [Mesurer](mesurer/) | `E -> R` | observer, fixer `phi` |

## Sonde zeta

Operent sur les [encodages de Godel](../meta-objets/encodage.md) via le produit d'Euler.

| Sens | Contrat | Symetrie |
|------|---------|----------|
| [Sonder](sonder/) | `N x R -> R` | asymetrique |
| [Reel](reel/) | `R -> R` | -- |

## Meta-sens

Operent sur les **conditions de possibilite** du calcul, pas sur des valeurs. Voir [meta-sens](../meta-sens/README.md).

| Meta-sens | Contrat | Role |
|-----------|---------|------|
| [Peser](../meta-sens/peser.md) | `N x R -> [0,1]` | champ de probabilite de convergence |
| [Frontiere](../meta-sens/frontiere.md) | `N -> R` | limite du regime constructif |

## Espaces

| | |
|---|---|
| [Espaces](../vocabulaire/espaces.md) | `E`, `E*`, `R`, `Omega` et regles de typage |

## Meta-objets

Operent sur les objets eux-memes, pas sur des valeurs.

| Meta-objet | Contrat |
|------------|---------|
| [Godel](../meta-objets/README.md) | `Circuit -> N` |
| [Currying](../meta-objets/currying.md) | `(A x B -> C) -> (A -> (B -> C))` |
| [Encodage](../meta-objets/encodage.md) | types, objets et circuits comme nombres |
| [Vecteur](../meta-objets/vecteur.md) | `(E x E -> R) -> {(E -> R), (E x E -> R)}` |
| [Invariance](../meta-objets/invariance.md) | `Sens -> (Group, N)` |

## Cablages

Les cablages assemblent plusieurs sens en un circuit complet. Ils ne definissent rien de nouveau — ils montrent comment les sens se connectent. Les [meta-cablages](../meta-cablages/) font de meme au niveau des meta-objets.

| Cablage | Sens assembles |
|---------|---------------|
| [Projeter](observer/projeter.md) | observer + ponderer + deplacer |
| [Ecouter](concentrer/ecouter.md) | concentrer + ponderer + observer |
| [Concentration](concentrer/exemples.md) | 5 exemples concrets de concentrer |
| [Rencontrer](aligner/rencontrer.md) | ponderer + normer + comparer + aligner |
| [Rencontrer Accelere](equilibrer/rencontrer-accelere.md) | aligner + accelerer + ponderer + normer + equilibrer |
| [Viser](equilibrer/viser.md) | aligner + accelerer + ponderer + normer + equilibrer |
| [Normer](normer/auto-aligner.md) | fork + aligner + sqrt |
| [Comparer](comparer/quotient-normalise.md) | aligner + normer + ponderer |
| [Accelerer](accelerer/triple-ponderation.md) | ponderer x3 |
| [Equilibrer](equilibrer/resolution-cubique.md) | resolution cubique (aligner + ponderer) |
| [Sonder](sonder/produit-euler.md) | factorisation + produit d'Euler (ponderer) |
